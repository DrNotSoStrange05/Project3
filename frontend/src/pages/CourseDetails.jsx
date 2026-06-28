import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Play, BookOpen, Clock, User, Award, ArrowLeft } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        // Fetch course info (includes lessons list)
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);

        // Check enrollment if logged in
        if (user) {
          try {
            await api.get(`/enrollments/course/${id}`);
            setEnrolled(true);
          } catch (e) {
            setEnrolled(false);
          }
        }
      } catch (err) {
        console.error('Error fetching course details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      setEnrollLoading(true);
      await api.post('/enrollments/enroll', { courseId: course._id });
      setEnrolled(true);
      navigate('/my-learning');
    } catch (err) {
      alert(err.response?.data?.message || 'Error enrolling in course');
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 bg-background text-foreground">
        <h3 className="text-xl font-bold mb-2">Course Not Found</h3>
        <p className="text-muted-foreground mb-6">The course you are looking for does not exist or was deleted.</p>
        <Link to="/" className="text-primary hover:underline">Back to Home</Link>
      </div>
    );
  }

  const totalDuration = course.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 bg-background text-foreground min-h-screen">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Course details & syllabus */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <span className="inline-block bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-3">
              {course.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
              {course.title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-indigo-500" />
                <span>Instructor: <strong className="text-foreground">{course.instructor?.name}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>{totalDuration} mins total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span>{course.lessons?.length || 0} lessons</span>
              </div>
            </div>
          </div>

          <hr className="border-border/30" />

          {/* Syllabus */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Curriculum / Lessons
            </h2>
            {(!course.lessons || course.lessons.length === 0) ? (
              <p className="text-muted-foreground text-sm py-4">No lessons have been uploaded to this course yet.</p>
            ) : (
              <div className="space-y-3">
                {course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson._id}
                    className="flex items-center justify-between rounded-lg border border-border/40 p-4 bg-secondary/15 hover:bg-secondary/25 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{lesson.title}</h4>
                        {lesson.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{lesson.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{lesson.duration || 0}m</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Enrollment Action */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-border/40 p-6 glass shadow-md text-center">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Course Details
            </h3>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-6">
              {course.price === 0 ? 'Free Access' : `$${course.price}`}
            </div>

            {enrolled ? (
              <div className="space-y-3">
                <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-4">
                  You are enrolled in this course!
                </div>
                <Link
                  to="/my-learning"
                  className="block text-center w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md py-3 text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  Go to Course Player
                </Link>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrollLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md py-3 text-sm shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {enrollLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" /> Enroll in Course
                  </>
                )}
              </button>
            )}

            <div className="mt-6 border-t border-border/20 pt-4 text-xs text-muted-foreground text-left space-y-2">
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-indigo-500" /> Full lifetime access
              </p>
              <p className="flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-indigo-500" /> Certificate of completion
              </p>
              <p className="flex items-center gap-2">
                <Play className="h-3.5 w-3.5 text-indigo-500" /> Access on mobile and desktop
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
