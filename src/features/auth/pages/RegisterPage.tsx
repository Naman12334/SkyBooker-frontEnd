import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { registerUser } from '../../../store/slices/authSlice';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ 
      fullName, 
      email, 
      passwordHash: password, // Assuming backend expects passwordHash or password
      role: 'PASSENGER',
      provider: 'LOCAL'
    } as any));
    
    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans bg-gray-50">
      {/* Side Content Gradient: Moved to Right for inconsistency or consistency? Image shows form on left, banner on right */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2563eb] to-[#e11d48]">
        <div 
          className="absolute inset-0 opacity-30 mix-blend-multiply scale-105"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(0.1)'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
          <svg width="600" height="600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 80L50 20L80 80H65L50 50L35 80H20Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-20 text-center">
          <div className="max-w-md">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">Get Started</h2>
            <h1 className="text-5xl font-black mb-8 tracking-tight italic">Be Part of Us</h1>
            <div className="w-16 h-[2px] bg-white opacity-40 mx-auto mb-8 rounded-full"></div>
            <p className="text-lg font-medium opacity-90 leading-relaxed">Unlock the full potential of your financial management with Magnificent Accounting.</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white shrink-0 shadow-2xl z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
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
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-b border-gray-200 py-2.5 focus:border-red-500 focus:outline-none transition-colors text-gray-700 font-medium placeholder:text-gray-300"
                placeholder="Ex. John Makwana"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-200 py-2.5 focus:border-red-500 focus:outline-none transition-colors text-gray-700 font-medium placeholder:text-gray-300"
                placeholder="arjunmakwana@gmail.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-200 py-2.5 focus:border-red-500 focus:outline-none transition-colors text-gray-700 tracking-widest placeholder:text-gray-300"
                placeholder="**********"
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs font-semibold bg-red-50 p-3 rounded border border-red-100">{error}</p>}

            <div className="flex flex-col space-y-6 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#2563eb] to-[#e11d48] text-white font-black py-4 px-8 rounded-full text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Your Account...' : 'Get Started Now'}
              </button>
              
              <div className="text-center">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Already a member? <Link to="/login" className="text-blue-600 hover:underline underline-offset-4 ml-1">Login Here</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
