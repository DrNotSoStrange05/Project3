import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Enroll in a course
// @route   POST /api/enroll
// @access  Private (Student)
router.post('/enroll', protect, async (req, res) => {
  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      user: req.user._id,
      course: courseId,
      progress: 0,
      completedLessons: [],
    });

    const createdEnrollment = await enrollment.save();
    res.status(201).json(createdEnrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get current user's enrolled courses with progress
// @route   GET /api/my-courses
// @access  Private (Student)
router.get('/my-courses', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email profilePic',
        },
      });

    // For each enrollment, we can attach the full lessons count to calculate client-side stats
    const enrollmentsWithDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessonsCount = await Lesson.countDocuments({ course: enrollment.course._id });
        return {
          ...enrollment.toObject(),
          totalLessonsCount,
        };
      })
    );

    res.json(enrollmentsWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get details about a specific enrollment including course, lessons, and progress status
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Student/Admin)
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId,
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found for this course' });
    }

    // Fetch all lessons for the course
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });

    // Fetch individual progress statuses
    const progressList = await Progress.find({
      user: req.user._id,
      lesson: { $in: lessons.map(l => l._id) }
    });

    res.json({
      enrollment,
      lessons,
      progressList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get instructor student enrollment metrics
// @route   GET /api/enrollments/instructor/stats
// @access  Private/Admin (Instructor)
router.get('/instructor/stats', protect, async (req, res) => {
  try {
    // Find all courses created by this instructor
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(c => c._id);

    // Find all enrollments in these courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('user', 'name email profilePic')
      .populate('course', 'title category price');

    // Calculate total students (unique users), total courses, total revenue (if price > 0)
    const uniqueStudents = new Set(enrollments.map(e => e.user.toString()));
    const totalStudents = uniqueStudents.size;

    const totalRevenue = enrollments.reduce((sum, e) => sum + (e.course.price || 0), 0);

    // Group student progress details
    const studentProgressDetails = enrollments.map(e => ({
      enrollmentId: e._id,
      studentName: e.user.name,
      studentEmail: e.user.email,
      courseTitle: e.course.title,
      progress: e.progress,
      enrolledAt: e.createdAt,
    }));

    res.json({
      totalStudents,
      totalCourses: courses.length,
      totalRevenue,
      studentProgressDetails,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
