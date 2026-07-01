import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI;
    console.log('Database Connection Status Check: MONGODB_URI is', dbUri ? `Defined (starts with ${dbUri.substring(0, 12)}...)` : 'Undefined');
    const conn = await mongoose.connect(dbUri || 'mongodb://127.0.0.1:27017/lms-learn');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please ensure MongoDB is running locally on port 27017 or verify MONGODB_URI in your .env file.');
    process.exit(1);
  }
};

export default connectDB;
