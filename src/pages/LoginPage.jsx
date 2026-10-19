import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Eye,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  KeyRound,
  User,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Detect whether to start on student or admin tab based on pathname or search params
  const [activeRole, setActiveRole] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.pathname.includes('/student') || params.get('role') === 'student') {
      return 'student';
    }
    return 'admin';
  });

  const [identifier, setIdentifier] = useState(() => {
    const isStudent = window.location.pathname.includes('/student');
    return (
      (isStudent
        ? localStorage.getItem('vidya_remember_student_id')
        : localStorage.getItem('vidya_remember_admin_id')) || ''
    );
  });

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sync role if navigation changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname.includes('/student') || params.get('role') === 'student') {
      setActiveRole('student');
    }
  }, [location]);

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setErrorMsg('');
    setPassword('');
    const savedId =
      role === 'student'
        ? localStorage.getItem('vidya_remember_student_id') || ''
        : localStorage.getItem('vidya_remember_admin_id') || '';
    setIdentifier(savedId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg(
        activeRole === 'student'
          ? 'Please enter your Roll ID / Mobile and password.'
          : 'Please enter your email/phone and password.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(identifier, password, activeRole);
      if (res.success) {
        if (rememberMe) {
          if (activeRole === 'student') {
            localStorage.setItem('vidya_remember_student_id', identifier.trim());
          } else {
            localStorage.setItem('vidya_remember_admin_id', identifier.trim());
          }
        } else {
          if (activeRole === 'student') {
            localStorage.removeItem('vidya_remember_student_id');
          } else {
            localStorage.removeItem('vidya_remember_admin_id');
          }
        }

        if (res.user?.role === 'student' || activeRole === 'student') {
          navigate('/student/dashboard');
        } else {
          navigate('/admin');
        }
      } else {
        setErrorMsg(
          res.message ||
            (activeRole === 'student'
              ? 'Invalid Roll ID or password. Please verify your credentials.'
              : 'Invalid credentials. Please verify your phone/email and password.')
        );
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD] relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#544bec]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="py-4 px-4 sm:px-8 flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/vidya-library-logo.png"
            alt="Vidya Library Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-md shadow-[#544bec]/30 group-hover:scale-105 transition-all border border-[#EDF1F7] shrink-0"
          />
          <div>
            <div className="text-base sm:text-lg font-black tracking-tight text-[#192038]">
              Vidya Library
            </div>
            <div className="text-[11px] text-[#8F9BB3] font-medium">
              Self Study & Digital Space
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-xl border border-[#EDF1F7] bg-white text-xs font-bold text-[#192038] hover:bg-[#F8FAFD] shadow-2xs transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EDF1F7] shadow-xl p-6 sm:p-8 transition-all">
          
          {/* Dual Portal Tab Switcher */}
          <div className="flex items-center p-1 bg-[#F1F4F9] rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-white text-[#544bec] shadow-sm'
                  : 'text-[#6B778C] hover:text-[#192038]'
              }`}
            >
              <GraduationCap size={16} />
              <span>Student Login</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-white text-[#192038] shadow-sm'
                  : 'text-[#6B778C] hover:text-[#192038]'
              }`}
            >
              <ShieldCheck size={16} className={activeRole === 'admin' ? 'text-[#544bec]' : ''} />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-xs border border-primary-subtle bg-primary-light text-primary transition-all">
              {activeRole === 'student' ? (
                <GraduationCap size={30} />
              ) : (
                <ShieldCheck size={30} />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black m-0 text-[#192038]">
              {activeRole === 'student' ? 'Student Portal' : 'Admin Sign In'}
            </h1>
            <p className="mt-1 text-xs text-[#8F9BB3]">
              {activeRole === 'student'
                ? 'Check attendance, seat status, fee receipts & library updates'
                : 'Enter your credentials to manage library operations'}
            </p>
          </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="bg-rose-50 text-rose-600 border border-rose-200 rounded-xl p-3 mb-5 text-xs flex items-center gap-2 font-medium">
                <span className="shrink-0 font-bold">⚠</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#192038]">
                  {activeRole === 'student'
                    ? 'Roll ID or Mobile Number'
                    : 'Email Address or Phone Number'}
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]">
                    {activeRole === 'student' ? <User size={16} /> : <ShieldCheck size={16} />}
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all"
                    placeholder={
                      activeRole === 'student'
                        ? 'e.g. STU-001 or 9685912333'
                        : 'admin@gmail.com or 9685912333'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#192038]">
                    {activeRole === 'student' ? 'Password' : 'Admin Password'}
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3]">
                    <KeyRound size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-2.5 bg-[#F7F9FC] border border-[#EDF1F7] rounded-xl text-xs font-semibold text-[#192038] placeholder-[#8F9BB3] focus:outline-hidden focus:border-[#544bec] focus:bg-white transition-all font-mono"
                    placeholder={activeRole === 'student' ? 'Enter your password' : 'Enter admin password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8F9BB3] hover:text-[#192038] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#544bec] w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-[#6B778C] font-medium">Remember me</span>
              </label>

              {activeRole === 'student' && (
                <span className="text-[11px] text-[#8F9BB3]">
                  Forgot password? Contact admin
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-black text-xs text-white bg-[#544bec] hover:bg-[#4338ca] shadow-sm shadow-[#544bec]/30 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    {activeRole === 'student'
                      ? 'Sign In to Student Dashboard'
                      : 'Sign In to Admin Dashboard'}
                  </span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-5 text-center">
            {activeRole === 'student' ? (
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className="text-xs font-semibold text-[#6B778C] hover:text-[#544bec] transition-colors cursor-pointer"
              >
                Are you an administrator? <span className="underline font-bold">Admin Login</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className="text-xs font-semibold text-[#6B778C] hover:text-[#544bec] transition-colors cursor-pointer"
              >
                Are you a student? <span className="underline font-bold">Student Login</span>
              </button>
            )}
          </div>

          {/* Security Footer */}
          <div className="mt-6 pt-4 border-t border-[#EDF1F7] text-center text-[11px] text-[#8F9BB3] flex items-center justify-center gap-1.5">
            <span>🔒</span>
            <span>Vidya Library 256-bit Secure Authentication</span>
          </div>
        </div>
      </main>
    </div>
  );
};
