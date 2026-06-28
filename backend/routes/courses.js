import express from 'express';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all courses (with filters)
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query).populate('instructor', 'name email profilePic');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single course details & lessons
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email profilePic');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Fetch lessons for this course
    const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 });

    res.json({
      ...course.toObject(),
      lessons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin (Instructor)
router.post('/', protect, adminOnly, async (req, res) => {
  const { title, description, thumbnail, category, price } = req.body;

  try {
    const course = new Course({
      title,
      description,
      instructor: req.user._id,
      thumbnail: thumbnail || '',
      category,
      price: price || 0,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin (Instructor)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { title, description, thumbnail, category, price } = req.body;

  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to edit this course' });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.thumbnail = thumbnail !== undefined ? thumbnail : course.thumbnail;
    course.category = category || course.category;
    course.price = price !== undefined ? price : course.price;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a course & its lessons & enrollments
// @route   DELETE /api/courses/:id
// @access  Private/Admin (Instructor)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this course' });
    }

    // Remove course, associated lessons, and enrollments
    await Lesson.deleteMany({ course: course._id });
    await Enrollment.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course, associated lessons, and enrollments removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
