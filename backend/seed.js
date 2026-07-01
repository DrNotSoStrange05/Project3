import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';

dotenv.config();

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.error('Error: MONGODB_URI is not defined in your environment/env file.');
      process.exit(1);
    }
    
    console.log('Connecting to database...');
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Cleaning up existing database records for instructor@lms.com...');
    const existingInstructor = await User.findOne({ email: 'instructor@lms.com' });
    if (existingInstructor) {
      await Lesson.deleteMany({ course: { $in: await Course.find({ instructor: existingInstructor._id }).select('_id') } });
      await Course.deleteMany({ instructor: existingInstructor._id });
      await User.deleteOne({ _id: existingInstructor._id });
    }
    
    // Create an Instructor (Admin)
    console.log('Creating Admin/Instructor account...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const instructor = await User.create({
      name: 'John Doe',
      email: 'instructor@lms.com',
      password: hashedPassword,
      role: 'Admin',
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    });
    console.log(`Instructor created with ID: ${instructor._id}`);

    // Seed Courses
    console.log('Seeding courses...');
    const course1 = await Course.create({
      title: 'Introduction to React 19',
      description: 'Learn the modern features of React 19 including Server Components, Actions, and the new use() hook from scratch.',
      instructor: instructor._id,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      category: 'Web Development',
      price: 0, // Free
    });

    const course2 = await Course.create({
      title: 'Mastering Node.js and Express',
      description: 'Master backend API development. Build scalable and secure REST APIs using Node.js, Express.js, and MongoDB.',
      instructor: instructor._id,
      thumbnail: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
      category: 'Backend Development',
      price: 49,
    });

    console.log('Seeding lessons...');
    // Seed Lessons for Course 1
    await Lesson.create([
      {
        course: course1._id,
        title: 'React 19 Introduction & Setup',
        description: 'Welcome to the course. In this lesson, we will introduce React 19 and set up our local development environment.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: 8,
        order: 1,
      },
      {
        course: course1._id,
        title: 'Understanding React Server Components (RSC)',
        description: 'Deep dive into React Server Components, how they differ from Client Components, and when to use them.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: 15,
        order: 2,
      },
      {
        course: course1._id,
        title: 'Form Actions and Pending States',
        description: 'Learn how to handle form submissions natively in React 19 using Actions, useActionState, and useFormStatus.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        duration: 12,
        order: 3,
      }
    ]);

    // Seed Lessons for Course 2
    await Lesson.create([
      {
        course: course2._id,
        title: 'Getting Started with Express',
        description: 'Initialize a Node.js project, install Express, and run a basic HTTP server listening on a port.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        duration: 10,
        order: 1,
      },
      {
        course: course2._id,
        title: 'Express Routing & Middleware Architecture',
        description: 'Learn how to handle complex nested routing structures and implement custom application-level and route-level middlewares.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        duration: 14,
        order: 2,
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
