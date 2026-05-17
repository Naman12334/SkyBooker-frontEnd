import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { registerUser } from '../../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, isLoading, error, resetError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => resetError();
  }, [isAuthenticated, navigate, resetError]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register({ 
      fullName, 
      email, 
      passwordHash: password,
      role: 'PASSENGER',
      provider: 'LOCAL'
    });
    
    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-gray-50 overflow-hidden">
      {/* Side Content Gradient: Moved to Right for inconsistency or consistency? Image shows form on left, banner on right */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2563eb] to-[#e11d48]"
      >
        <div 
          className="absolute inset-0 opacity-30 mix-blend-multiply scale-105"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1506012733851-bb0755ee9880?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8)'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
          <svg width="600" height="600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 80L50 20L80 80H65L50 50L35 80H20Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-20 text-center">
          <div className="max-w-md">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">Welcome To</h2>
              <h1 className="text-5xl font-black mb-8 tracking-tight italic">Skybooker</h1>
            </motion.div>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-[2px] bg-white opacity-40 mx-auto mb-8 rounded-full"
            ></motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-lg font-medium leading-relaxed"
            >
              Book your next journey with Skybooker and explore the world in style and luxury.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Form Content */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white shrink-0 shadow-2xl z-10"
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
              <path d="M20 80L50 20L80 80H65L50 50L35 80H20Z" fill="url(#logo_grad_reg)" />
              <path d="M40 80L55 50L70 80H40Z" fill="url(#logo_grad_reg)" opacity="0.8" />
              <defs>
                <linearGradient id="logo_grad_reg" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2563eb" />
                  <stop offset="1" stopColor="#e11d48" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <form onSubmit={handleRegister} className="space-y-6">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-1"
            >
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-b border-gray-200 py-2.5 focus:border-red-500 focus:outline-none transition-colors text-gray-700 font-medium placeholder:text-gray-300"
                placeholder="Ex. John Makwana"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-1"
            >
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-200 py-2.5 focus:border-red-500 focus:outline-none transition-colors text-gray-700 font-medium placeholder:text-gray-300"
                placeholder="arjunmakwana@gmail.com"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-1"
            >
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-gray-200 py-2.5 focus:border-red-500 focus:outline-none transition-colors text-gray-700 tracking-widest placeholder:text-gray-300"
                  placeholder="**********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-red-500 text-xs font-semibold bg-red-50 p-3 rounded border border-red-100 overflow-hidden"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col space-y-4 pt-6"
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#2563eb] to-[#e11d48] text-white font-black py-4 px-8 rounded-full text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Creating Your Account...' : 'Get Started Now'}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:8080/auth/oauth2/authorization/google'}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-600 font-bold py-3.5 px-8 rounded-full text-[11px] uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>
              
              <div className="text-center pt-2">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Already a member? <Link to="/login" className="text-blue-600 hover:underline underline-offset-4 ml-1">Login Here</Link>
                </p>
              </div>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
