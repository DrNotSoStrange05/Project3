import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Book, Clock, GraduationCap, ArrowRight } from 'lucide-react';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/courses', {
          params: { search, category },
        });
        setCourses(res.data);

        // Extract unique categories for filter
        if (categories.length === 0) {
          const allCourses = await api.get('/courses');
          const cats = [...new Set(allCourses.data.map((c) => c.category))];
          setCategories(cats);
        }
      } catch (err) {
        console.error('Error fetching courses', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden mb-12 p-8 md:p-16 bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="relative max-w-2xl">
          <span className="inline-block bg-indigo-500/25 text-indigo-300 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-4 border border-indigo-500/30">
            Learn at your own pace
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Unlock Your Potential with{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              LMS Learn
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Discover premium courses taught by industry professionals. Build your skills, complete modules, and track your learning progress seamlessly.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#courses-list"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md px-6 py-3 shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              Explore Courses <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Course Search & Filter Panel */}
      <section id="courses-list" className="mb-10">
        <h2 className="text-3xl font-extrabold mb-8 tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Explore Our Courses
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses by title, keyword, or technology..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/30 border border-border/80 focus:border-primary/80 focus:ring-1 focus:ring-primary/80 rounded-lg py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:w-64">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-secondary/30 border border-border/80 focus:border-primary/80 rounded-lg py-3 px-4 text-sm outline-none transition-all cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground text-sm">Loading course catalog...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-secondary/10 rounded-xl border border-dashed border-border/40">
            <Book className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No courses found</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              We couldn't find any courses matching your search query or category filters. Try adjusting your settings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex flex-col rounded-xl overflow-hidden glass hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full bg-slate-200 dark:bg-slate-800">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex w-full h-full items-center justify-center bg-indigo-500/10 text-primary">
                      <GraduationCap className="h-12 w-12" />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white font-semibold px-2.5 py-0.5 rounded-full text-xs shadow-md">
                    {course.category}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-bold text-lg mb-2 text-foreground line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                    {course.description}
                  </p>

                  <div className="border-t border-border/30 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">
                        {course.instructor?.name || 'Instructor'}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80">Author</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <div className="p-5 pt-0">
                  <Link
                    to={`/courses/${course._id}`}
                    className="block text-center w-full bg-secondary/80 hover:bg-primary hover:text-white font-semibold rounded-md py-2 text-sm transition-all active:scale-[0.98]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
