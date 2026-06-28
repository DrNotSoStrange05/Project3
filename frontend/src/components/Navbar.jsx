import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, LogOut, BookOpen, User as UserIcon, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/40 bg-background/85 px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary transition-opacity hover:opacity-90">
          <BookOpen className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            LMS Learn
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Courses</Link>
          {user && user.role === 'Student' && (
            <>
              <Link to="/my-learning" className="hover:text-foreground transition-colors">My Learning</Link>
              <Link to="/student-dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            </>
          )}
          {user && user.role === 'Admin' && (
            <Link to="/instructor-dashboard" className="hover:text-foreground transition-colors">Instructor Portal</Link>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-secondary/80 text-foreground transition-all duration-300 transform active:scale-95 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Profile Avatar */}
              <Link to="/profile" className="flex items-center gap-2 group">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-primary/30 object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:inline text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {user.name}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm rounded-md px-4 py-2 shadow-sm transition-all duration-200 transform active:scale-95"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Links Container */}
      <div className="mt-2 flex md:hidden items-center justify-center gap-4 text-xs font-medium border-t border-border/10 pt-2 text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Browse</Link>
        {user && user.role === 'Student' && (
          <>
            <Link to="/my-learning" className="hover:text-foreground">My Learning</Link>
            <Link to="/student-dashboard" className="hover:text-foreground">Dashboard</Link>
          </>
        )}
        {user && user.role === 'Admin' && (
          <Link to="/instructor-dashboard" className="hover:text-foreground">Instructor</Link>
        )}
        {user && <Link to="/profile" className="hover:text-foreground">Profile</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
