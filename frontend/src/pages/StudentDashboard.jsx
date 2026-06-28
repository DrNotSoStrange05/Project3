import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen, Award, CheckCircle, Percent, GraduationCap, PlayCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/enrollments/my-courses');
        setEnrollments(res.data);
      } catch (err) {
        console.error('Error fetching enrolled courses', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading your learning dashboard...</p>
      </div>
    );
  }

  // Calculations for stats
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.progress === 100).length;
  const avgProgress =
    totalCourses > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 bg-background text-foreground min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
        Student Dashboard
      </h1>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* Enrolled Courses */}
        <div className="rounded-xl border border-border/40 p-6 glass shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Enrolled Courses</p>
            <p className="text-2xl font-extrabold text-foreground">{totalCourses}</p>
          </div>
        </div>

        {/* Avg Progress */}
        <div className="rounded-xl border border-border/40 p-6 glass shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Average Progress</p>
            <p className="text-2xl font-extrabold text-foreground">{avgProgress}%</p>
          </div>
        </div>

        {/* Certificates / Completed */}
        <div className="rounded-xl border border-border/40 p-6 glass shadow-sm flex items-center gap-4">
          <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Completed Courses</p>
            <p className="text-2xl font-extrabold text-foreground">{completedCourses}</p>
          </div>
        </div>
      </div>

      {/* Enrolled Courses List */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" /> My Learning Progress
        </h2>

        {enrollments.length === 0 ? (
          <div className="text-center py-20 bg-secondary/15 rounded-xl border border-dashed border-border/40">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Not enrolled in any courses yet</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Browse our course collection to find something you want to learn.
            </p>
            <Link
              to="/"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md px-6 py-2.5 text-sm shadow-md transition-all cursor-pointer"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {enrollments.map((item) => {
              const course = item.course;
              if (!course) return null;

              return (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-xl border border-border/40 p-6 glass hover:shadow-md transition-all gap-6"
                >
                  {/* Thumbnail / Meta info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="hidden sm:block h-16 w-28 bg-indigo-500/15 rounded-lg overflow-hidden border border-border/20 flex-shrink-0">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary font-bold text-lg">
                          LMS
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="inline-block bg-secondary text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {course.category}
                      </span>
                      <h3 className="font-bold text-base text-foreground line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Instructor: <strong className="text-foreground/80">{course.instructor?.name}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full md:w-64 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">{item.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    {item.progress === 100 && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle className="h-3 w-3" /> Certificate Earned
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-full md:w-auto flex-shrink-0">
                    <Link
                      to="/my-learning"
                      className="w-full md:w-auto text-center inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md px-5 py-2.5 text-sm transition-all active:scale-[0.98]"
                    >
                      <PlayCircle className="h-4 w-4" /> Resume Course
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
