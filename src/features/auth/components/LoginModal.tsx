import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser, clearError } from '../../../store/slices/authSlice';
import { X, Mail, Lock, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-white/90 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20 transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* Abstract Header Design */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-sky-400 opacity-90 rounded-b-[40%] scale-110 origin-top"></div>
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative pt-12 pb-8 px-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-6 border-4 border-blue-50">
            <div className="text-blue-600 font-extrabold text-2xl tracking-tighter">SB</div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-center mb-8">Enter your credentials to access your Skybooker account</p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                {error}
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                placeholder="Password"
              />
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transform transition-all active:scale-[0.98] flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-500">
            Don't have an account?{' '}
            <button className="text-blue-600 font-bold hover:underline">
              Create one now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
