import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';
import { LogOut, LayoutDashboard, User as UserIcon, Settings, X, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/search')) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-10 py-6 z-[100] bg-transparent">
        <Link to="/" className="text-sky-700 font-bold text-2xl tracking-tighter cursor-pointer uppercase">
          SKYBOOKER
        </Link>
        
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm transition-all hover:shadow-md">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-[11px] leading-none mb-0.5">{user.fullName.split(' ')[0]}</span>
              <span className="text-[7px] font-bold text-blue-500 uppercase tracking-widest leading-none">{user.role.replace('_', ' ')}</span>
            </div>

            {/* Admin Panel Icon Button */}
            {(user.role === 'ADMIN' || user.role === 'AIRLINE_STAFF') && (
              <Link 
                to="/admin" 
                className="ml-2 p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                title="Go to Admin Panel"
              >
                <LayoutDashboard size={16} />
              </Link>
            )}

            <div className="w-px h-4 bg-slate-200 mx-1"></div>

            <button 
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-bold text-sm tracking-widest shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all"
          >
            LOGIN
          </Link>
        )}
      </nav>
    </>
  );
};

export default Navbar;
