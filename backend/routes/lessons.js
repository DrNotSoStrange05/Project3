import express from 'express';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @desc    Add a lesson to a course
// @route   POST /api/lessons
// @access  Private/Admin (Instructor)
router.post('/', protect, adminOnly, async (req, res) => {
  const { courseId, title, description, videoUrl, duration, order } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to add lessons to this course' });
    }

    const lesson = new Lesson({
      course: courseId,
      title,
      description: description || '',
      videoUrl,
      duration: duration || 0,
      order: order || 0,
    });

    const createdLesson = await lesson.save();
    res.status(201).json(createdLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin (Instructor)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { title, description, videoUrl, duration, order } = req.body;

  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    if (!course) {
      return res.status(404).json({ message: 'Course linked with lesson not found' });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to edit this lesson' });
    }

    lesson.title = title || lesson.title;
    lesson.description = description !== undefined ? description : lesson.description;
    lesson.videoUrl = videoUrl || lesson.videoUrl;
    lesson.duration = duration !== undefined ? duration : lesson.duration;
    lesson.order = order !== undefined ? order : lesson.order;

    const updatedLesson = await lesson.save();
    res.json(updatedLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin (Instructor)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.course);
    if (!course) {
      return res.status(404).json({ message: 'Course linked with lesson not found' });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this lesson' });
    }

    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
