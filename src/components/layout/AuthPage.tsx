import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('chahathassanain@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Chahat');
  const [rememberMe, setRememberMe] = useState(true);
  const [resetSent, setResetSent] = useState(false);

  const { setUser, showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      setResetSent(true);
      showToast('Password reset link sent to your email!', 'info');
      return;
    }

    const userData = {
      id: 'usr_' + Date.now(),
      name: isLogin ? (name || 'Chahat') : name,
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Freelancer & Remote Specialist',
      country: 'Pakistan 🇵🇰',
      currency: 'USD' as const,
      isLoggedIn: true,
      streakDays: 7,
      aiTasksCompleted: 42,
      productivityScore: 94,
    };

    setUser(userData);
    localStorage.setItem('freelanceiq_user', JSON.stringify(userData));
    showToast(isLogin ? 'Welcome back to FreelanceIQ OS!' : 'Account created successfully!');
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">FreelanceIQ AI OS</h1>
          <p className="text-xs text-slate-400 mt-1">Your AI Business Partner for Freelancers</p>
        </div>

        {/* Tab Toggle */}
        {!isForgotPassword && (
          <div className="flex p-1 bg-white/5 rounded-xl mb-6 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setIsForgotPassword(false);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                isLogin ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setIsForgotPassword(false);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                !isLogin ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {isForgotPassword ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-slate-100">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1">Enter your email address to receive password reset instructions.</p>
            </div>

            {resetSent ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-medium text-emerald-300">Reset link sent!</p>
                <p className="text-xs text-slate-400">Check your inbox for instructions.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetSent(false);
                  }}
                  className="mt-2 text-xs text-indigo-400 hover:underline font-medium block mx-auto"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  Send Reset Link
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200 mt-2 block"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chahat"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chahathassanain@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 text-indigo-600 focus:ring-0 bg-white/5"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-indigo-400 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLogin ? 'Sign In to Workspace' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Social Logins */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-slate-500 mb-3">Or continue with social account</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-300 transition"
            >
              Google
            </button>
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-300 transition"
            >
              LinkedIn
            </button>
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-300 transition"
            >
              GitHub
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local Storage Authentication • 100% Client Persistence</span>
        </div>
      </div>
    </div>
  );
};
