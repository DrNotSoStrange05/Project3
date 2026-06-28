import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, User, Image, GraduationCap } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [profilePic, setProfilePic] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/instructor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await login(email, password);
        if (data.role === 'Admin') {
          navigate('/instructor-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        const data = await register(name, email, password, role, profilePic);
        if (data.role === 'Admin') {
          navigate('/instructor-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl glass p-8 shadow-xl">
        {/* Toggle Headers */}
        <div className="flex border-b border-border/30 mb-8">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 pb-4 text-center text-sm font-semibold transition-all cursor-pointer ${
              isLogin
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 pb-4 text-center text-sm font-semibold transition-all cursor-pointer ${
              !isLogin
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Account
          </button>
        </div>

        <h2 className="text-2xl font-extrabold text-foreground mb-2">
          {isLogin ? 'Welcome Back' : 'Get Started Today'}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {isLogin ? 'Sign in to access your dashboard' : 'Fill in the details to start learning'}
        </p>

        {error && (
          <div className="mb-6 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary/25 border border-border/80 rounded-md py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/25 border border-border/80 rounded-md py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/25 border border-border/80 rounded-md py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Profile Picture URL
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={profilePic}
                    onChange={(e) => setProfilePic(e.target.value)}
                    className="w-full bg-secondary/25 border border-border/80 rounded-md py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Register As
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="Student"
                      checked={role === 'Student'}
                      onChange={() => setRole('Student')}
                      className="text-primary focus:ring-primary"
                    />
                    Student
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="Admin"
                      checked={role === 'Admin'}
                      onChange={() => setRole('Admin')}
                      className="text-primary focus:ring-primary"
                    />
                    Instructor / Admin
                  </label>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md py-2.5 mt-2 transition-all transform active:scale-95 flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
