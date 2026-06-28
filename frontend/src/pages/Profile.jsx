import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Image, Lock, Sun, Moon, Calendar, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, theme, toggleTheme } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (password && password !== confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        name,
        email,
        profilePic,
        password: password || undefined,
      });
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20 bg-background text-foreground">
        <p className="text-muted-foreground text-sm">Please log in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 bg-background text-foreground min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
        Profile Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Meta Stats */}
        <div className="rounded-2xl border border-border/40 p-6 glass text-center flex flex-col items-center">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.name}
              className="h-24 w-24 rounded-full border-2 border-primary object-cover mb-4 shadow-sm"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-3xl mb-4 border-2 border-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="font-bold text-lg text-foreground mb-1">{user.name}</h2>
          <p className="text-xs text-muted-foreground mb-6">{user.email}</p>

          <hr className="w-full border-border/30 mb-6" />

          {/* User Details */}
          <div className="w-full space-y-4 text-left text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-indigo-500" />
              <span>Role: <strong className="text-foreground">{user.role}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 text-indigo-500" />
              <span>Registered: <strong className="text-foreground">Online Learning Member</strong></span>
            </div>
          </div>

          <hr className="w-full border-border/30 my-6" />

          {/* Theme switcher control */}
          <div className="w-full">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-left">
              Aesthetics Mode
            </h4>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between bg-secondary hover:bg-secondary/80 rounded-md p-3 text-xs font-bold transition-all cursor-pointer"
            >
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-indigo-400" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2 rounded-2xl border border-border/40 p-6 glass shadow-sm">
          <h3 className="text-lg font-bold mb-6">Edit Personal Information</h3>

          {message && (
            <div className={`mb-6 rounded-md p-3 text-xs font-semibold border ${
              isError
                ? 'bg-destructive/10 border-destructive/20 text-destructive'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary/25 border border-border/80 rounded-md py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/25 border border-border/80 rounded-md py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Avatar URL
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="url"
                  value={profilePic}
                  onChange={(e) => setProfilePic(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-secondary/25 border border-border/80 rounded-md py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full bg-secondary/25 border border-border/80 rounded-md py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full bg-secondary/25 border border-border/80 rounded-md py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md py-2.5 mt-2 transition-all transform active:scale-95 flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                'Save Profile Updates'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
