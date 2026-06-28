import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a lesson title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      required: [true, 'Please add a video URL'],
    },
    duration: {
      type: Number,
      default: 0, // in minutes
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to keep lesson orders unique per course if desired, or simple sorting
const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
