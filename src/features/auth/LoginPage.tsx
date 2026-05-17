import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { useAuth } from './hooks/useAuth';
import { loginUser, restoreSession } from '../../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  
  const { login, isLoading, error, resetError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      dispatch(restoreSession());
      navigate('/');
      return;
    }

    if (isAuthenticated) {
      navigate('/');
    }
    return () => resetError();
  }, [isAuthenticated, navigate, resetError, searchParams, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-gray-50 overflow-hidden">
      {/* Left Side: Form */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white shrink-0 z-10"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12"
          >
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 80L50 20L80 80H65L50 50L35 80H20Z" fill="url(#logo_grad)" />
              <path d="M40 80L55 50L70 80H40Z" fill="url(#logo_grad)" opacity="0.8" />
              <defs>
                <linearGradient id="logo_grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-1"
            >
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-200 py-2 focus:border-purple-500 focus:outline-none transition-colors text-gray-700 font-medium placeholder:text-gray-300"
                placeholder="arjunmakwana@gmail.com"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-1"
            >
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-gray-200 py-2 focus:border-purple-500 focus:outline-none transition-colors text-gray-700 tracking-widest placeholder:text-gray-300"
                  placeholder="**********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col space-y-4"
            >
              <label className="flex items-center space-x-2 cursor-pointer group w-fit">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-400 font-medium group-hover:text-gray-500 transition-colors">Remember Me</span>
              </label>
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="text-red-500 text-xs font-semibold bg-red-50 p-2 rounded border border-red-100 overflow-hidden"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center gap-4 pt-4"
            >
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 px-6 rounded-full text-[11px] uppercase tracking-widest hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Checking...' : 'Login'}
              </button>
              <Link
                to="/register"
                className="flex-1 border-2 border-purple-400 text-center py-3 px-6 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-purple-50 transition-colors"
              >
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create Account</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="relative flex items-center py-4"
            >
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Or login with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:8080/auth/oauth2/authorization/google'}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-600 font-bold py-3 px-6 rounded-full text-[11px] uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="pt-8 text-center"
            >
              <button type="button" className="text-[11px] text-gray-400 font-bold tracking-tight hover:text-gray-600 transition-colors underline underline-offset-4 decoration-gray-200">
                Forgotten your login details? Get Help Signing In
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Right Side: Welcome Banner */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#2563eb] to-[#9333ea]"
      >
        <div 
          className="absolute inset-0 opacity-40 mix-blend-multiply scale-105"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1543722530-d2c4b143e042?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.1) brightness(0.9)'
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none translate-y-20">
          <svg width="800" height="800" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 80L50 20L80 80H65L50 50L35 80H20Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-20">
          <div className="max-w-lg text-center">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="space-y-2 mb-8"
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Welcome To</h2>
              <h1 className="text-5xl font-extrabold tracking-tight">Skybooker</h1>
            </motion.div>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="h-[2px] bg-white/40 mx-auto mb-8 rounded-full"
            ></motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-lg font-medium tracking-wide"
            >
              Login to Access Your Flight Dashboard
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
