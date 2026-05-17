import React, { useEffect, useState } from 'react';
import { getAllAirlines, createAirline, updateAirline, deactivateAirline } from '../../../shared/api/adminApi';
import { useAppSelector } from '../../../store/hooks';
import { 
  Plane, 
  Plus, 
  Edit3, 
  Power, 
  Globe, 
  Hash,
  Mail,
  Phone,
  Shield,
  Activity
} from 'lucide-react';

interface Airline {
  airlineId: number;
  name: string;
  iataCode: string;
  icaoCode?: string;
  logoUrl?: string;
  country: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
}

const AirlineManagement: React.FC = () => {
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAirline, setEditingAirline] = useState<Airline | null>(null);
  const [formData, setFormData] = useState<Partial<Airline>>({
    name: '',
    iataCode: '',
    icaoCode: '',
    country: '',
    logoUrl: '',
    contactEmail: '',
    contactPhone: ''
  });
  
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  const fetchAirlines = async () => {
    try {
      const data = await getAllAirlines();
      setAirlines(data);
    } catch (error) {
      console.error('Failed to fetch airlines', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  const handleToggleStatus = async (airline: Airline) => {
    if (!isAdmin) return;
    try {
      if (airline.isActive) {
        await deactivateAirline(airline.airlineId);
      } else {
        await updateAirline(airline.airlineId, { ...airline, isActive: true });
      }
      fetchAirlines();
    } catch (error) {
      console.error('Failed to toggle status', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      if (editingAirline) {
        await updateAirline(editingAirline.airlineId, formData);
      } else {
        await createAirline(formData as any);
      }
      setShowModal(false);
      fetchAirlines();
      resetForm();
    } catch (error) {
      console.error('Failed to save airline', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      iataCode: '',
      icaoCode: '',
      country: '',
      logoUrl: '',
      contactEmail: '',
      contactPhone: ''
    });
    setEditingAirline(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Fetching Carriers...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Airline Management</h2>
          <p className="text-slate-500 text-sm mt-1">Operational registry of all partner carriers and contact nodes.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Register Airline
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {airlines.map((airline) => (
          <div key={airline.airlineId} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm transition-all group relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] transition-transform duration-700 ${airline.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

            <div className="flex justify-between items-start mb-6 relative">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden shadow-inner">
                {airline.logoUrl ? (
                  <img src={airline.logoUrl} alt={airline.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <Plane className="text-slate-300" size={32} />
                )}
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${airline.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${airline.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                {airline.isActive ? 'Operational' : 'Grounded'}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-4">{airline.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">IATA Code</p>
                <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Hash size={14} className="text-slate-400" />
                  {airline.iataCode}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">ICAO Code</p>
                <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} className="text-slate-400" />
                  {airline.icaoCode || 'N/A'}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-slate-600">
                <Globe size={16} className="text-slate-400" />
                <span className="text-xs font-bold">{airline.country}</span>
              </div>
              {airline.contactEmail && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-xs font-bold truncate">{airline.contactEmail}</span>
                </div>
              )}
              {airline.contactPhone && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-xs font-bold">{airline.contactPhone}</span>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="flex gap-2 pt-6 border-t border-slate-50">
                <button 
                  onClick={() => { setEditingAirline(airline); setFormData({ ...airline }); setShowModal(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold transition-all shadow-sm"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
                <button 
                  onClick={() => handleToggleStatus(airline)}
                  className={`px-4 flex items-center justify-center rounded-2xl transition-all shadow-sm
                    ${airline.isActive ? 'bg-slate-50 text-slate-400' : 'bg-emerald-500 text-white shadow-emerald-100'}
                  `}
                  title={airline.isActive ? 'Deactivate Airline' : 'Activate Airline'}
                >
                  <Power size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{editingAirline ? 'Update Airline' : 'Register Carrier'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Airline Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="e.g. SkyBooker Airlines"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">IATA Code</label>
                  <input 
                    required
                    maxLength={2}
                    value={formData.iataCode}
                    onChange={(e) => setFormData({...formData, iataCode: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all uppercase placeholder:normal-case"
                    placeholder="XX"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">ICAO Code</label>
                  <input 
                    required
                    maxLength={3}
                    value={formData.icaoCode}
                    onChange={(e) => setFormData({...formData, icaoCode: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all uppercase placeholder:normal-case"
                    placeholder="XXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Country</label>
                  <input 
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="e.g. India"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Contact Phone</label>
                  <input 
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="+91..."
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Contact Email</label>
                <input 
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="admin@carrier.com"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Logo URL</label>
                <input 
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-sm font-bold text-slate-500 rounded-2xl transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-3 py-4 text-sm font-bold bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  <Activity size={18} className="animate-pulse" />
                  {editingAirline ? 'Finalize Changes' : 'Register Carrier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirlineManagement;
