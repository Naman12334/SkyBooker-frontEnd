import React, { useEffect, useState } from 'react';
import { getAllAirports, createAirport, updateAirport } from '../../../shared/api/adminApi';
import { useAppSelector } from '../../../store/hooks';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Globe, 
  Navigation,
  Compass,
  Clock,
  Search,
  Building,
  Activity
} from 'lucide-react';

interface Airport {
  airportId: number;
  name: string;
  iataCode: string;
  icaoCode?: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const AirportManagement: React.FC = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<Airport>>({
    name: '',
    iataCode: '',
    icaoCode: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC'
  });

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  const fetchAirports = async () => {
    try {
      const data = await getAllAirports();
      setAirports(data);
    } catch (error) {
      console.error('Failed to fetch airports', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      if (editingAirport) {
        await updateAirport(editingAirport.airportId, formData);
      } else {
        await createAirport(formData as any);
      }
      setShowModal(false);
      fetchAirports();
      resetForm();
    } catch (error) {
      console.error('Failed to save airport', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      iataCode: '',
      icaoCode: '',
      city: '',
      country: '',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC'
    });
    setEditingAirport(null);
  };

  const filteredAirports = airports.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.iataCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Scanning Global Hubs...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Airport Infrastructure</h2>
          <p className="text-slate-500 text-sm mt-1">Management of global transit hubs and geospatial coordinates.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Filter by name, code or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium w-full md:w-64 outline-none focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Hub
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAirports.map((airport) => (
          <div key={airport.airportId} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm transition-all group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner transition-transform">
                <Building size={24} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-semibold text-slate-800 tracking-tighter uppercase">{airport.iataCode}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{airport.icaoCode || '---'}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2 truncate" title={airport.name}>{airport.name}</h3>
            
            <div className="flex items-center gap-2 text-slate-500 mb-6 font-semibold text-xs uppercase tracking-tight">
              <MapPin size={14} className="text-rose-500" />
              <span>{airport.city}, {airport.country}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400 uppercase">
                  <Compass size={10} /> Lat / Lng
                </div>
                <p className="text-[10px] font-semibold text-slate-600">
                  {airport.latitude.toFixed(2)}, {airport.longitude.toFixed(2)}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400 uppercase">
                  <Clock size={10} /> Timezone
                </div>
                <p className="text-[10px] font-semibold text-slate-600 truncate">
                  {airport.timezone}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingAirport(airport); setFormData({ ...airport }); setShowModal(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold transition-all shadow-md"
                >
                  <Edit3 size={16} /> Update Details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                <Globe size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{editingAirport ? 'Edit Hub Infrastructure' : 'Register New Transit Hub'}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global Geospatial Database</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Airport Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                    placeholder="e.g. Indira Gandhi International Airport"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">IATA Code</label>
                  <input 
                    required
                    maxLength={3}
                    value={formData.iataCode}
                    onChange={(e) => setFormData({...formData, iataCode: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all uppercase"
                    placeholder="DEL"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">ICAO Code</label>
                  <input 
                    required
                    maxLength={4}
                    value={formData.icaoCode}
                    onChange={(e) => setFormData({...formData, icaoCode: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all uppercase"
                    placeholder="VIDP"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">City</label>
                  <input 
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Country</label>
                  <input 
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Latitude</label>
                  <input 
                    required
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Longitude</label>
                  <input 
                    required
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Timezone (e.g. Asia/Kolkata)</label>
                  <input 
                    required
                    value={formData.timezone}
                    onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-sm font-bold text-slate-400 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="flex-2 py-4 px-8 text-sm font-bold bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  <Activity size={18} className="animate-pulse" />
                  {editingAirport ? 'Commit Infrastructure Update' : 'Register New Hub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportManagement;
