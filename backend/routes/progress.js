import express from 'express';
import Progress from '../models/Progress.js';
import Enrollment from '../models/Enrollment.js';
import Lesson from '../models/Lesson.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Update progress of a lesson and recalculate overall course progress
// @route   PUT /api/progress
// @access  Private (Student)
router.put('/', protect, async (req, res) => {
  const { courseId, lessonId, isCompleted } = req.body;

  if (!courseId || !lessonId) {
    return res.status(400).json({ message: 'courseId and lessonId are required' });
  }

  try {
    // 1. Update or create the Lesson Progress record
    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, lesson: lessonId },
      { isCompleted, watchedAt: Date.now() },
      { new: true, upsert: true }
    );

    // 2. Fetch the student's enrollment for this course
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found for this course' });
    }

    // 3. Update the enrollment's completedLessons list
    const index = enrollment.completedLessons.indexOf(lessonId);
    if (isCompleted && index === -1) {
      enrollment.completedLessons.push(lessonId);
    } else if (!isCompleted && index !== -1) {
      enrollment.completedLessons.splice(index, 1);
    }

    // 4. Calculate the percentage of completed lessons
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    if (totalLessons > 0) {
      const completedCount = enrollment.completedLessons.length;
      enrollment.progress = Math.round((completedCount / totalLessons) * 100);
    } else {
      enrollment.progress = 0;
    }

    await enrollment.save();

    res.json({
      progress,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
