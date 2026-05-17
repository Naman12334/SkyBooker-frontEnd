import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plane, 
  MapPin, 
  BookOpen, 
  LayoutDashboard, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Bell,
  Navigation
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

// Placeholder sub-components (we will create these next)
import DashboardOverview from './components/DashboardOverview';
import UserManagement from './components/UserManagement';
import AirlineManagement from './components/AirlineManagement';
import AirportManagement from './components/AirportManagement';
import BookingManagement from './components/BookingManagement';
import RouteManagement from './components/RouteManagement';

const AdminPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'User Management', icon: <Users size={20} />, path: '/admin/users', roles: ['ADMIN'] },
    { name: 'Airline Management', icon: <Plane size={20} />, path: '/admin/airlines' },
    { name: 'Airport Management', icon: <MapPin size={20} />, path: '/admin/airports' },
    { name: 'Booking Management', icon: <BookOpen size={20} />, path: '/admin/bookings' },
    { name: 'Route Management', icon: <Navigation size={20} />, path: '/admin/routes' },
  ];

  const filteredNavItems = navItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col z-20`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
            <ShieldCheck size={24} />
          </div>
          {isSidebarOpen && (
            <span className="font-semibold text-xl tracking-tighter text-blue-900">SKYADMIN</span>
          )}
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
                  : 'text-slate-500'}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-slate-500 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-slate-500 transition-colors"
            >
              <ChevronRight size={20} className={`transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            <h1 className="text-xl font-medium text-slate-800 capitalize italic">
              Welcome back, {user?.fullName.split(' ')[0]}!
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button className="p-2 text-slate-400 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">{user?.role.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                {user?.fullName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="airlines" element={<AirlineManagement />} />
            <Route path="airports" element={<AirportManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="routes" element={<RouteManagement />} />
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
