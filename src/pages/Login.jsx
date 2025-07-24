import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Mail, Lock, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Set axios base URL
  axios.defaults.baseURL = 'http://localhost:5000';

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      const res = await axios.post('/api/login', {
        email: data.email,
        password: data.password,
      });
      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      navigate('/'); // Redirect to Home
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
      setError('email', { type: 'manual', message: 'Invalid credentials' });
      setError('password', { type: 'manual', message: 'Invalid credentials' });
    }
  };

  const onRegister = async (data) => {
    setErrorMsg('');
    try {
      await axios.post('/api/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setToastMsg('Registered successfully! Please log in.');
      setShowToast(true);
      navigate('/login'); // Stay on login page after registration
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
      setError('email', { type: 'manual', message: 'Email may already be in use' });
    }
  };

  // Placeholder for Google login
  const handleGoogleLogin = () => {
    setToastMsg('Google login coming soon!');
    setShowToast(true);
  };

  useEffect(() => {
    // Redirect to Home if token exists and not on /login or /register
    if (token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/');
    }
  }, [token, location.pathname, navigate]);

  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* No SVG mesh or gradient, just a clean background matching Home page */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-400/60 p-12 z-10 relative"
      >
        <div className="flex flex-col items-center mb-10">
          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-amber-400 to-yellow-400 shadow-lg shadow-emerald-400/20 w-20 h-20 mb-3 animate-popIn">
            <LogIn className="w-10 h-10 text-white drop-shadow-md" />
          </span>
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-amber-400 to-yellow-400 drop-shadow-lg mb-2 animate-fadeInDown tracking-tight">
            {isRegisterPage ? 'Join AgriSage' : 'Welcome Back'}
          </h2>
          <span className="block h-1 w-24 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-yellow-400 animate-gradient-x mb-2" />
          <p className="text-gray-700 dark:text-gray-200 text-lg animate-fadeInDown delay-100">
            {isRegisterPage ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>
        <form onSubmit={handleSubmit(isRegisterPage ? onRegister : onSubmit)} className="space-y-8 animate-fadeInUp">
          {isRegisterPage && (
            <div>
              <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Name</label>
              <div className="relative group">
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className={`w-full bg-white dark:bg-gray-900/80 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-400 focus:outline-none transition-colors text-lg group-hover:border-emerald-400 ${errors.name ? 'border-red-400' : ''}`}
                  placeholder="Farmer Guna"
                  autoComplete="name"
                />
                <UserPlus className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
              </div>
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>
          )}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Email</label>
            <div className="relative group">
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Enter a valid email'
                  }
                })}
                className={`w-full bg-white dark:bg-gray-900/80 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-400 focus:outline-none transition-colors text-lg group-hover:border-emerald-400 ${errors.email ? 'border-red-400' : ''}`}
                placeholder="you@email.com"
                autoComplete="email"
              />
              <Mail className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">Password</label>
            <div className="relative group">
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className={`w-full bg-white dark:bg-gray-900/80 text-gray-800 dark:text-white p-4 pl-12 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-emerald-400 focus:outline-none transition-colors text-lg group-hover:border-emerald-400 ${errors.password ? 'border-red-400' : ''}`}
                placeholder="Your password"
                autoComplete="current-password"
              />
              <Lock className="absolute left-4 top-4 w-5 h-5 text-emerald-400" />
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>
          {errorMsg && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center text-sm font-semibold animate-shake">
              {errorMsg}
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-yellow-400 text-white py-4 rounded-2xl font-bold text-xl shadow-lg shadow-emerald-400/20 transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-emerald-300 active:scale-95 flex items-center justify-center animate-popIn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                {isRegisterPage ? 'Registering...' : 'Logging in...'}
              </>
            ) : (
              <>
                {isRegisterPage ? <UserPlus className="w-6 h-6 mr-2" /> : <LogIn className="w-6 h-6 mr-2" />}
                {isRegisterPage ? 'Register' : 'Login'}
              </>
            )}
          </button>
        </form>
        <div className="my-8 flex items-center justify-center gap-2 animate-fadeInUp">
          <span className="h-px w-20 bg-gray-300 dark:bg-gray-700" />
          <span className="text-gray-500 dark:text-gray-400 text-sm">or</span>
          <span className="h-px w-20 bg-gray-300 dark:bg-gray-700" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow transition-all hover:scale-105 hover:border-emerald-400 animate-popIn"
        >
          <span className="w-5 h-5 mr-2">
            <svg viewBox="0 0 48 48" width="20" height="20">
              <g>
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 32.9 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.3-4z"/>
                <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 6.1 29.5 4 24 4c-7.2 0-13.3 4.1-16.7 10.7z"/>
                <path fill="#FBBC05" d="M24 44c5.5 0 10.5-2.1 14.3-5.7l-6.6-5.4C29.8 36 26.1 37.5 24 37.5c-5.7 0-10.5-3.7-12.2-8.7l-7 5.4C7.7 39.9 15.3 44 24 44z"/>
                <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.3 39.9 19.4 44 24 44c5.5 0 10.5-2.1 14.3-5.7l-6.6-5.4C29.8 36 26.1 37.5 24 37.5c-5.7 0-10.5-3.7-12.2-8.7l-7 5.4C7.7 39.9 15.3 44 24 44z"/>
              </g>
            </svg>
          </span>
          Continue with Google
        </button>
        <div className="mt-8 text-center animate-fadeInUp">
          <span className="text-gray-600 dark:text-gray-300 text-lg">
            {isRegisterPage ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            onClick={() => navigate(isRegisterPage ? '/login' : '/register')}
            className="ml-2 text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center text-lg"
          >
            {isRegisterPage ? <LogIn className="w-5 h-5 mr-1" /> : <UserPlus className="w-5 h-5 mr-1" />}
            {isRegisterPage ? 'Login' : 'Register'}
          </button>
        </div>
      </motion.div>
      <Toast message={toastMsg} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}