import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusCircle, Edit2, Trash2, Video, BarChart2, Users, DollarSign, BookOpen, Layers } from 'lucide-react';

const InstructorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms states
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [courseThumbnail, setCourseThumbnail] = useState('');

  const [selectedCourse, setSelectedCourse] = useState(null); // Course to manage lessons or edit
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonVideo, setLessonVideo] = useState('');
  const [lessonDuration, setLessonDuration] = useState(0);
  const [lessonOrder, setLessonOrder] = useState(1);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch instructor enrollment stats
      const statsRes = await api.get('/enrollments/instructor/stats');
      setStats(statsRes.data);

      // Fetch all courses
      const coursesRes = await api.get('/courses');
      // Filter only courses where instructor is the current user. (Wait, the backend `GET /courses` returns all courses. Let's filter client-side or we can fetch only current user's courses. We can get instructor _id from /auth/me or simply compare names. Actually, we populated instructor name, so we can filter by current logged in user name. Better yet, let's filter by checking if user is instructor!)
      const meRes = await api.get('/auth/me');
      const myCourses = coursesRes.data.filter((c) => c.instructor?._id === meRes.data._id);
      setCourses(myCourses);
    } catch (err) {
      console.error('Error fetching instructor portal data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', {
        title: courseTitle,
        description: courseDesc,
        category: courseCategory,
        price: Number(coursePrice),
        thumbnail: courseThumbnail,
      });

      // Reset
      setCourseTitle('');
      setCourseDesc('');
      setCourseCategory('');
      setCoursePrice(0);
      setCourseThumbnail('');
      setShowAddCourse(false);

      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating course');
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lessons', {
        courseId: selectedCourse._id,
        title: lessonTitle,
        description: lessonDesc,
        videoUrl: lessonVideo,
        duration: Number(lessonDuration),
        order: Number(lessonOrder),
      });

      // Reset
      setLessonTitle('');
      setLessonDesc('');
      setLessonVideo('');
      setLessonDuration(0);
      setLessonOrder(lessonOrder + 1);
      setShowAddLesson(false);

      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding lesson');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course and all associated lessons?')) {
      try {
        await api.delete(`/courses/${courseId}`);
        fetchDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting course');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading instructor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 bg-background text-foreground min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Instructor Portal
        </h1>
        <button
          onClick={() => {
            setShowAddCourse(!showAddCourse);
            setSelectedCourse(null);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md px-4 py-2 text-sm flex items-center gap-2 shadow-sm transition-all transform active:scale-95 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" /> Create Course
        </button>
      </div>

      {/* Analytics widgets */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-xl border border-border/40 p-6 glass shadow-sm flex items-center gap-4">
            <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Active Courses</p>
              <p className="text-2xl font-extrabold text-foreground">{stats.totalCourses || courses.length}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 p-6 glass shadow-sm flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Total Enrollments</p>
              <p className="text-2xl font-extrabold text-foreground">{stats.totalStudents}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 p-6 glass shadow-sm flex items-center gap-4">
            <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Estimated Revenue</p>
              <p className="text-2xl font-extrabold text-foreground">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List: My Courses */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> My Created Courses
          </h2>

          {courses.length === 0 ? (
            <div className="text-center py-16 bg-secondary/15 rounded-xl border border-dashed border-border/40">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-muted-foreground text-sm">You haven't created any courses yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className={`rounded-xl border p-5 glass hover:shadow-sm transition-all flex items-center justify-between gap-4 ${
                    selectedCourse?._id === course._id ? 'border-primary ring-1 ring-primary' : 'border-border/40'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="inline-block bg-secondary text-foreground text-[9px] font-semibold px-2 py-0.5 rounded-full">
                      {course.category}
                    </span>
                    <h3 className="font-bold text-base text-foreground line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Price: <strong className="text-foreground/80">${course.price}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowAddLesson(true);
                      }}
                      className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Video className="h-3.5 w-3.5" /> Add Lesson
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white rounded-md p-1.5 transition-all cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Student Progress details log */}
          {stats && stats.studentProgressDetails?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Active Enrolled Students
              </h2>
              <div className="overflow-x-auto rounded-lg border border-border/40">
                <table className="min-w-full divide-y divide-border/20 text-sm">
                  <thead className="bg-secondary/40 font-semibold text-muted-foreground text-left">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3 text-center">Progress</th>
                      <th className="px-4 py-3">Enrolled On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 bg-background text-foreground">
                    {stats.studentProgressDetails.map((details) => (
                      <tr key={details.enrollmentId} className="hover:bg-secondary/10">
                        <td className="px-4 py-3">
                          <p className="font-semibold">{details.studentName}</p>
                          <p className="text-xs text-muted-foreground">{details.studentEmail}</p>
                        </td>
                        <td className="px-4 py-3 font-medium">{details.courseTitle}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            details.progress === 100 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          }`}>
                            {details.progress}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(details.enrolledAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic forms */}
        <div className="space-y-6">
          {/* Create Course Form */}
          {showAddCourse && (
            <div className="rounded-xl border border-border/40 p-6 glass shadow-md">
              <h3 className="text-lg font-bold mb-4">Create New Course</h3>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. React Native Fundamentals"
                    className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
                  <textarea
                    required
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    placeholder="Write a descriptive syllabus or description..."
                    rows={3}
                    className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    placeholder="e.g. Design, Coding, Business"
                    className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Price (USD)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={coursePrice}
                      onChange={(e) => setCoursePrice(e.target.value)}
                      className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Thumbnail URL</label>
                    <input
                      type="url"
                      value={courseThumbnail}
                      onChange={(e) => setCourseThumbnail(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md py-2 text-sm transition-all"
                  >
                    Save Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCourse(false)}
                    className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-md py-2 px-4 text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Lesson Form */}
          {showAddLesson && selectedCourse && (
            <div className="rounded-xl border border-primary/50 p-6 glass shadow-md ring-1 ring-primary/30">
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-[10px] uppercase mb-1">
                  Adding to
                </span>
                <h3 className="text-lg font-bold text-foreground line-clamp-1">{selectedCourse.title}</h3>
              </div>

              <form onSubmit={handleCreateLesson} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Lesson Title</label>
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="e.g. Introduction & Scaffolding"
                    className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Short Description</label>
                  <textarea
                    value={lessonDesc}
                    onChange={(e) => setLessonDesc(e.target.value)}
                    placeholder="Briefly state what is covered..."
                    rows={2}
                    className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Video URL</label>
                  <input
                    type="url"
                    required
                    value={lessonVideo}
                    onChange={(e) => setLessonVideo(e.target.value)}
                    placeholder="https://www.w3schools.com/html/mov_bbb.mp4"
                    className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Duration (min)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(e.target.value)}
                      className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Lesson Order</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={lessonOrder}
                      onChange={(e) => setLessonOrder(e.target.value)}
                      className="w-full bg-secondary/25 border border-border/80 rounded-md py-2 px-3 text-sm outline-none focus:border-primary/80"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md py-2 text-sm transition-all"
                  >
                    Save Lesson
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddLesson(false);
                      setSelectedCourse(null);
                    }}
                    className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-md py-2 px-4 text-sm transition-all"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
