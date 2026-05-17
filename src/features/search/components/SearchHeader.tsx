import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Heart, MapPin, Calendar, Star, ChevronLeft, ChevronRight, LogOut, Check, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../store/slices/authSlice';

const INDIAN_CITIES = [
  { name: "Delhi", code: "DEL" },
  { name: "Mumbai", code: "BOM" },
  { name: "Bangalore", code: "BLR" },
  { name: "Kolkata", code: "CCU" },
  { name: "Chennai", code: "MAA" },
  { name: "Hyderabad", code: "HYD" },
  { name: "Ahmedabad", code: "AMD" },
  { name: "Pune", code: "PNQ" },
  { name: "Goa", code: "GOI" },
  { name: "Jaipur", code: "JAI" }
];

const SearchHeader: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      origin: params.get('origin') || 'DEL',
      destination: params.get('destination') || 'BOM',
      date: params.get('date'),
      passengers: params.get('passengers') || '1'
    };
  };

  const { origin, destination, date, passengers } = getQueryParams();

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editOrigin, setEditOrigin] = useState(origin);
  const [editDest, setEditDest] = useState(destination);
  const [editDate, setEditDate] = useState(date || '');
  const [editGuests, setEditGuests] = useState(passengers);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Select Date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getShiftedDateStr = (shift: number) => {
    if(!date) return '';
    const d = new Date(date);
    d.setDate(d.getDate() + shift);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const shiftDate = (shift: number) => {
    if(!date) return;
    const d = new Date(date);
    d.setDate(d.getDate() + shift);
    navigate(`/search?origin=${origin}&destination=${destination}&date=${d.toISOString().split('T')[0]}&passengers=${passengers}`);
  };

  const handleUpdate = () => {
    if (!editDate) {
      toast.error("Please select a trip date.");
      return;
    }
    if (editOrigin === editDest) {
      toast.error("Origin and Destination cannot be the same.");
      return;
    }
    navigate(`/search?origin=${editOrigin}&destination=${editDest}&date=${editDate}&passengers=${editGuests}`);
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
       {/* Navbar Layer */}
       <div className="max-w-[1600px] mx-auto px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-12">
             <div className="text-[#3333FF] font-black text-2xl tracking-tighter cursor-pointer" onClick={() => window.location.href = '/'}>
                SKYBOOKER
             </div>
             
             {/* Categories - Simplified and Premium */}
             <div className="hidden md:flex items-center gap-8">
                {['Flights'].map(tab => (
                   <span 
                      key={tab}
                      className={`text-[11px] font-bold uppercase tracking-[0.2em] cursor-pointer transition-all ${tab === 'Flights' ? 'text-[#3333FF] border-b-2 border-[#3333FF] pb-1' : 'text-gray-400 hover:text-gray-900'}`}
                   >
                      {tab}
                   </span>
                ))}
             </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-900 transition-all">
                <Heart size={16} />
                <span>Wishlist</span>
             </div>
             <div className="w-[1px] h-4 bg-gray-200" />
             
             {isAuthenticated && user ? (
               <div className="flex items-center gap-4 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                 <div className="w-8 h-8 bg-[#3333FF] rounded-full flex items-center justify-center text-white font-bold text-sm">
                   {user.fullName.charAt(0).toUpperCase()}
                 </div>
                 <span className="font-bold text-gray-900 text-xs tracking-tight">{user.fullName.split(' ')[0]}</span>
                 <button 
                   onClick={handleLogout}
                   className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                   title="Logout"
                 >
                   <LogOut size={14} />
                 </button>
               </div>
             ) : (
               <button 
                 onClick={() => window.location.href = '/login'}
                 className="bg-[#3333FF] hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-bold text-[11px] tracking-widest transition-all shadow-lg shadow-blue-100"
               >
                  LOGIN
               </button>
             )}
          </div>
       </div>

       {/* Search Summary Bar - Integrated & Clean */}
       <div className="bg-[#fcfcff] border-t border-gray-50 py-4 px-10">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
             <div className="flex items-center gap-8 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all flex-1 max-w-[900px] group">
                {!isEditing ? (
                  <>
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsEditing(true)}>
                       <div className="bg-[#3333FF]/10 p-2 rounded-full">
                          <MapPin size={14} className="text-[#3333FF]" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Route</span>
                          <span className="text-sm font-bold text-gray-900">{origin} → {destination}</span>
                       </div>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-100" />
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsEditing(true)}>
                       <div className="bg-[#3333FF]/10 p-2 rounded-full">
                          <Calendar size={14} className="text-[#3333FF]" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Date</span>
                          <span className="text-sm font-bold text-gray-900">{formatDate(date)}</span>
                       </div>
                    </div>
                    <div className="w-[1px] h-8 bg-gray-100" />
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsEditing(true)}>
                       <div className="bg-[#3333FF]/10 p-2 rounded-full">
                          <Star size={14} className="text-[#3333FF]" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Class</span>
                          <span className="text-sm font-bold text-gray-900">Economy, {passengers} Guest{parseInt(passengers) > 1 ? 's' : ''}</span>
                       </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4 w-full">
                    <select value={editOrigin} onChange={e => setEditOrigin(e.target.value)} className="bg-gray-50 border-none rounded p-2 text-sm font-bold outline-none flex-1">
                       {INDIAN_CITIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                    </select>
                    <span className="text-gray-400">→</span>
                    <select value={editDest} onChange={e => setEditDest(e.target.value)} className="bg-gray-50 border-none rounded p-2 text-sm font-bold outline-none flex-1">
                       {INDIAN_CITIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                    </select>
                    <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="bg-gray-50 border-none rounded p-2 text-sm font-bold outline-none flex-1" />
                    <input type="number" min="1" max="9" value={editGuests} onChange={e => setEditGuests(e.target.value)} className="bg-gray-50 border-none rounded p-2 text-sm font-bold outline-none w-16" />
                    <div className="flex items-center gap-2 ml-auto">
                      <button onClick={handleUpdate} className="bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 transition-colors"><Check size={16} /></button>
                      <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors"><X size={16} /></button>
                    </div>
                  </div>
                )}
             </div>

             <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                   <div onClick={() => shiftDate(-1)} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-all text-gray-400 hover:text-gray-900">
                      <ChevronLeft size={20} />
                   </div>
                   <div className="flex flex-col items-center min-w-[50px]">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Prev Date</span>
                      <span className="text-xs font-bold text-gray-900">{getShiftedDateStr(-1) || '—'}</span>
                   </div>
                   <div onClick={() => shiftDate(1)} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-all text-gray-400 hover:text-gray-900">
                      <ChevronRight size={20} />
                   </div>
                </div>
                <div className="w-[1px] h-8 bg-gray-200" />
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[#3333FF] text-[10px] font-black uppercase tracking-widest hover:underline underline-offset-4"
                >
                  {isEditing ? 'Cancel Edit' : 'Modify Search'}
                </button>
             </div>
          </div>
       </div>
    </header>
  );
};

export default SearchHeader;
