import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlayCircle, CheckCircle, Circle, BookOpen, ChevronRight, Award } from 'lucide-react';

const MyLearning = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerLoading, setPlayerLoading] = useState(false);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/enrollments/my-courses');
        setMyCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCourse(res.data[0].course);
        }
      } catch (err) {
        console.error('Error fetching enrolled courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchCoursePlayerDetails = async () => {
      try {
        setPlayerLoading(true);
        const res = await api.get(`/enrollments/course/${selectedCourse._id}`);
        setEnrollment(res.data.enrollment);
        setLessons(res.data.lessons);
        setProgressList(res.data.progressList);

        if (res.data.lessons.length > 0) {
          // Keep active lesson or default to first
          setActiveLesson(res.data.lessons[0]);
        } else {
          setActiveLesson(null);
        }
      } catch (err) {
        console.error('Error fetching course player data', err);
      } finally {
        setPlayerLoading(false);
      }
    };

    fetchCoursePlayerDetails();
  }, [selectedCourse]);

  const handleToggleComplete = async (lessonId) => {
    if (!enrollment || !activeLesson) return;

    const isCurrentlyCompleted = progressList.some(
      (p) => p.lesson === lessonId && p.isCompleted
    );

    try {
      const res = await api.put('/progress', {
        courseId: selectedCourse._id,
        lessonId,
        isCompleted: !isCurrentlyCompleted,
      });

      // Update local progress list
      const updatedProgress = res.data.progress;
      setProgressList((prev) => {
        const index = prev.findIndex((p) => p.lesson === lessonId);
        if (index > -1) {
          const next = [...prev];
          next[index] = updatedProgress;
          return next;
        } else {
          return [...prev, updatedProgress];
        }
      });

      // Update enrollment progress
      setEnrollment(res.data.enrollment);

      // Also update myCourses progress lists
      setMyCourses((prev) =>
        prev.map((c) =>
          c.course._id === selectedCourse._id
            ? { ...c, progress: res.data.enrollment.progress }
            : c
        )
      );
    } catch (err) {
      console.error('Error toggling progress', err);
    }
  };

  const isCompleted = (lessonId) => {
    return progressList.some((p) => p.lesson === lessonId && p.isCompleted);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading course content...</p>
      </div>
    );
  }

  if (myCourses.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4">
        <BookOpen className="h-16 w-16 mx-auto text-indigo-500/20 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Enrolled Courses</h2>
        <p className="text-muted-foreground text-sm mb-6">
          You haven't enrolled in any courses yet. Head to the homepage to browse available courses.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 bg-background text-foreground min-h-screen">
      {/* Course Selector bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border/20 pb-4 mb-6">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          My Courses:
        </span>
        {myCourses.map((c) => (
          <button
            key={c._id}
            onClick={() => setSelectedCourse(c.course)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCourse?._id === c.course?._id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary hover:bg-secondary/80 text-foreground'
            }`}
          >
            {c.course?.title} ({c.progress}%)
          </button>
        ))}
      </div>

      {playerLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground">Loading course module...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: HTML5 Video & Details */}
          <div className="lg:col-span-2 space-y-4">
            {activeLesson ? (
              <div className="space-y-4">
                {/* HTML5 Video Box */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-border/40">
                  <video
                    key={activeLesson._id}
                    src={activeLesson.videoUrl}
                    controls
                    className="w-full h-full"
                    poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                  />
                </div>

                {/* Lesson Info Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-1">{activeLesson.title}</h2>
                    {activeLesson.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {activeLesson.description}
                      </p>
                    )}
                  </div>

                  {/* Mark Completed Actions */}
                  <button
                    onClick={() => handleToggleComplete(activeLesson._id)}
                    className={`flex items-center gap-2 border rounded-md px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      isCompleted(activeLesson._id)
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-secondary border-border/60 hover:border-primary/50 text-foreground'
                    }`}
                  >
                    {isCompleted(activeLesson._id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 fill-current" /> Completed
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4" /> Mark Complete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-secondary/10 rounded-2xl border border-border/20">
                <PlayCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">No lessons found in this course.</p>
              </div>
            )}
          </div>

          {/* Right Column: Progress & Lesson List sidebar */}
          <div className="rounded-xl border border-border/40 p-5 glass shadow-sm flex flex-col h-[fit-content] max-h-[80vh]">
            {/* Progress Header */}
            {enrollment && (
              <div className="border-b border-border/20 pb-4 mb-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="text-muted-foreground">Course Completion</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{enrollment.progress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-300"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                {enrollment.progress === 100 && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 rounded p-2 mt-3">
                    <Award className="h-4 w-4" /> Congratulations! Course completed.
                  </div>
                )}
              </div>
            )}

            {/* Scrollable Curriculum List */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Course Syllabus
              </h3>

              {lessons.map((lesson, idx) => (
                <div
                  key={lesson._id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`flex items-center justify-between rounded-lg p-3 cursor-pointer transition-all border ${
                    activeLesson?._id === lesson._id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-secondary/15 hover:bg-secondary/35 border-transparent text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid selecting lesson
                        handleToggleComplete(lesson._id);
                      }}
                      className="text-muted-foreground/60 hover:text-primary transition-colors cursor-pointer"
                    >
                      {isCompleted(lesson._id) ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 fill-current bg-background rounded-full" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground block">
                        Lesson {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold leading-tight line-clamp-1">{lesson.title}</h4>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearning;
