import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser } from '../../../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-gray-50">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white shrink-0">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
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
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-200 py-2 focus:border-purple-500 focus:outline-none transition-colors text-gray-700 font-medium placeholder:text-gray-300"
                placeholder="arjunmakwana@gmail.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-200 py-2 focus:border-purple-500 focus:outline-none transition-colors text-gray-700 tracking-widest placeholder:text-gray-300"
                placeholder="**********"
                required
              />
            </div>

            <div className="flex flex-col space-y-4">
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
              {error && <p className="text-red-500 text-xs font-semibold bg-red-50 p-2 rounded border border-red-100">{error}</p>}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 px-6 rounded-full text-[11px] uppercase tracking-widest hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Login'}
              </button>
              <Link
                to="/register"
                className="flex-1 border-2 border-purple-400 text-center py-3 px-6 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-purple-50 transition-colors"
              >
                <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create Account</span>
              </Link>
            </div>

            <div className="pt-8 text-center">
              <button type="button" className="text-[11px] text-gray-400 font-bold tracking-tight hover:text-gray-600 transition-colors underline underline-offset-4 decoration-gray-200">
                Forgotten your login details? Get Help Signing In
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Welcome Banner */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-[#2563eb] to-[#9333ea]">
        <div 
          className="absolute inset-0 opacity-40 mix-blend-multiply scale-105"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1454165833767-027ffea9e778?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.1) brightness(0.9) grayscale(0.2)'
          }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none translate-y-20">
          <svg width="800" height="800" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 80L50 20L80 80H65L50 50L35 80H20Z" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-20">
          <div className="max-w-lg text-center">
            <div className="space-y-2 mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">Welcome To</h2>
              <h1 className="text-5xl font-extrabold tracking-tight">Magnificent Accounting</h1>
            </div>
            
            <div className="w-16 h-[2px] bg-white/40 mx-auto mb-8 rounded-full"></div>
            
            <p className="text-lg font-medium tracking-wide opacity-80">Login to Access Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
