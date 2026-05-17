import React, { useEffect, useState, useRef } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import {
  getAllFlights,
  addFlight,
  updateFlight,
  deleteFlight,
  updateFlightStatus,
} from '../../../shared/api/adminApi';
import { useAppSelector } from '../../../store/hooks';
import {
  Plane,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Activity,
  Hash,
  Shield,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Navigation,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
type FlightStatus = 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED';

interface FlightRoute {
  flightId: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  status: FlightStatus;
  airline?: { airlineId?: number; id?: number; name?: string };
  aircraftType?: string;
  airlineId?: number;
}

// ─── Status Config ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<FlightStatus, { label: string; bg: string; text: string; dot: string }> = {
  ON_TIME:   { label: 'On Time',   bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  DELAYED:   { label: 'Delayed',   bg: 'bg-orange-50',  text: 'text-orange-600',  dot: 'bg-orange-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-rose-50',    text: 'text-rose-600',    dot: 'bg-rose-500' },
  DEPARTED:  { label: 'Departed',  bg: 'bg-blue-50',    text: 'text-blue-600',    dot: 'bg-blue-500' },
  ARRIVED:   { label: 'Arrived',   bg: 'bg-indigo-50',  text: 'text-indigo-600',  dot: 'bg-indigo-500' },
};

const EMPTY_FORM: Partial<FlightRoute> = {
  flightNumber: '', origin: '', destination: '',
  departureTime: '', arrivalTime: '',
  price: 0, availableSeats: 0, totalSeats: 0,
  status: 'ON_TIME', aircraftType: 'Boeing 737', airlineId: 0
};

// ─── Premium DateTime Picker ─────────────────────────────────────────────────
interface DateTimePickerProps {
  label: string;
  value: string;            // ISO datetime string  "2026-05-01T14:30"
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const DateTimePicker: React.FC<DateTimePickerProps> = ({ label, value, onChange, icon }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Parse current value
  const parsed = value ? new Date(value) : new Date();
  const safeDate = isNaN(parsed.getTime()) ? new Date() : parsed;

  const [viewYear,  setViewYear]  = useState(safeDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(safeDate.getMonth());
  const [selYear,   setSelYear]   = useState(value ? safeDate.getFullYear()  : 0);
  const [selMonth,  setSelMonth]  = useState(value ? safeDate.getMonth()     : -1);
  const [selDay,    setSelDay]    = useState(value ? safeDate.getDate()      : 0);
  const [hour,      setHour]      = useState(value ? safeDate.getHours()     : 0);
  const [minute,    setMinute]    = useState(value ? safeDate.getMinutes()   : 0);

  // Sync from external value
  useEffect(() => {
    if (!value) return;
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    setViewYear(d.getFullYear()); setViewMonth(d.getMonth());
    setSelYear(d.getFullYear());  setSelMonth(d.getMonth());
    setSelDay(d.getDate());
    setHour(d.getHours()); setMinute(d.getMinutes());
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const emit = (y: number, mo: number, d: number, h: number, mi: number) => {
    if (!d) return;
    const pad = (n: number) => String(n).padStart(2, '0');
    onChange(`${y}-${pad(mo + 1)}-${pad(d)}T${pad(h)}:${pad(mi)}`);
  };

  const selectDay = (day: number) => {
    setSelYear(viewYear); setSelMonth(viewMonth); setSelDay(day);
    emit(viewYear, viewMonth, day, hour, minute);
  };

  const changeHour = (h: number) => {
    setHour(h);
    if (selDay) emit(selYear, selMonth, selDay, h, minute);
  };
  const changeMinute = (m: number) => {
    setMinute(m);
    if (selDay) emit(selYear, selMonth, selDay, hour, m);
  };

  // Calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const displayStr = selDay
    ? `${MONTHS[selMonth].slice(0,3)} ${selDay}, ${selYear}  ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`
    : 'Pick date & time';

  return (
    <div className="relative" ref={ref}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
        {icon} {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all text-left flex items-center justify-between group"
      >
        <span className={selDay ? 'text-slate-800' : 'text-slate-300'}>{displayStr}</span>
        <Clock size={16} className="text-slate-300 transition-colors" />
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-2 left-0 bg-white rounded-[1.75rem] shadow-2xl border border-slate-100 p-5 w-[340px] animate-in fade-in zoom-in-95 duration-150">
          
          {/* ── Month navigator ── */}
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={() => { const d = new Date(viewYear, viewMonth - 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
              className="p-2 rounded-xl transition-colors">
              <ChevronLeft size={16} className="text-slate-500" />
            </button>
            <span className="font-bold text-slate-800 text-sm tracking-wide">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={() => { const d = new Date(viewYear, viewMonth + 1); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
              className="p-2 rounded-xl transition-colors">
              <ChevronRight size={16} className="text-slate-500" />
            </button>
          </div>

          {/* ── Day-of-week headers ── */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-1">{d}</div>
            ))}
          </div>

          {/* ── Calendar grid ── */}
          <div className="grid grid-cols-7 gap-y-1 mb-5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = selDay === day && selMonth === viewMonth && selYear === viewYear;
              const isToday = (() => { const t = new Date(); return t.getFullYear() === viewYear && t.getMonth() === viewMonth && t.getDate() === day; })();
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`
                    w-9 h-9 mx-auto flex items-center justify-center rounded-xl text-sm font-semibold transition-all
                    ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : ''}
                    ${!isSelected && isToday ? 'border-2 border-blue-300 text-blue-600' : ''}
                    ${!isSelected && !isToday ? 'text-slate-600' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* ── Time Input ── */}
          <div className="border-t border-slate-100 pt-4 space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p>
            <TimePicker
              clearIcon={null}
              disableClock={false}
              format="HH:mm"
              value={`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`}
              onChange={(val) => {
                if (!val) return;
                const [h, m] = (val as string).split(':').map(Number);
                if (!isNaN(h) && !isNaN(m)) {
                  setHour(h);
                  setMinute(m);
                  if (selDay) emit(selYear, selMonth, selDay, h, m);
                }
              }}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-center text-lg font-bold outline-none focus-within:ring-4 focus-within:ring-blue-100 transition-all font-mono tracking-widest text-slate-700 cursor-pointer [&>div]:border-0 [&>div]:w-full"
            />
          </div>

          {/* Confirm */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 transition-all"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

const RouteManagement: React.FC = () => {
  const [flights, setFlights] = useState<FlightRoute[]>([]);
  const [airlines, setAirlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [airlineDropdownOpen, setAirlineDropdownOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightRoute | null>(null);
  const [formData, setFormData] = useState<Partial<FlightRoute>>(EMPTY_FORM);
  const [statusMap, setStatusMap] = useState<Record<number, FlightStatus>>({});

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin  = user?.role === 'ADMIN';
  const canWrite = user?.role === 'ADMIN' || user?.role === 'AIRLINE_STAFF';

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const data = await getAllFlights();
      setFlights(data);
      const map: Record<number, FlightStatus> = {};
      data.forEach((f: FlightRoute) => { map[f.flightId] = f.status; });
      setStatusMap(map);
    } catch (err) {
      console.error('Failed to fetch flights', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAirlineData = async () => {
    try {
      const { getAllAirlines } = await import('../../../shared/api/adminApi');
      const data = await getAllAirlines();
      setAirlines(data);
    } catch (err) {
      console.error('Failed to fetch airlines', err);
    }
  };

  useEffect(() => { fetchFlights(); fetchAirlineData(); }, []);

  const resetForm = () => { setFormData(EMPTY_FORM); setEditingFlight(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    try {
      // Auto-calculate duration payload to satisfy backend DTO
      const duration = formData.departureTime && formData.arrivalTime 
          ? Math.max(0, Math.floor((new Date(formData.arrivalTime).getTime() - new Date(formData.departureTime).getTime()) / 60000))
          : 120;
          
      const selectedAirlineId = formData.airlineId || formData.airline?.airlineId || formData.airline?.id || (airlines.length > 0 ? airlines[0].airlineId : 1);
          
      const payload = {
        ...formData,
        aircraftType: formData.aircraftType || 'Boeing 737',
        durationMinutes: duration,
        basePrice: formData.price,
        originAirportCode: formData.origin,
        destinationAirportCode: formData.destination,
        airlineId: selectedAirlineId,
        airline: { id: selectedAirlineId, airlineId: selectedAirlineId }
      };

      if (editingFlight) {
        await updateFlight(editingFlight.flightId, payload);
      } else {
        await addFlight(payload);
      }
      setShowModal(false);
      resetForm();
      fetchFlights();
    } catch (err) {
      console.error('Failed to save flight', err);
    }
  };

  const handleDelete = async (flightId: number) => {
    if (!isAdmin) return;
    if (!window.confirm('Are you sure you want to delete this flight?')) return;
    try {
      await deleteFlight(flightId);
      fetchFlights();
    } catch (err) {
      console.error('Failed to delete flight', err);
    }
  };

  const handleStatusChange = async (flightId: number, status: FlightStatus) => {
    if (!canWrite) return;
    try {
      await updateFlightStatus(flightId, status);
      setStatusMap(prev => ({ ...prev, [flightId]: status }));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const formatDateTime = (dt: string) => {
    if (!dt) return '—';
    try { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dt)); }
    catch { return dt; }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Routes...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Route Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage flight routes, schedules, pricing, and operational status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchFlights} className="p-3 bg-slate-50 text-slate-500 rounded-2xl border border-slate-100 transition-all" title="Refresh">
            <RefreshCw size={18} />
          </button>
          {canWrite && (
            <button onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-blue-200 flex items-center gap-2">
              <Plus size={20} /> Add Flight
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total',     value: flights.length,                                             color: 'text-slate-700',   bg: 'bg-slate-50'   },
          { label: 'On Time',   value: flights.filter(f => f.status === 'ON_TIME').length,          color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Delayed',   value: flights.filter(f => f.status === 'DELAYED').length,          color: 'text-orange-600',  bg: 'bg-orange-50'  },
          { label: 'Departed',  value: flights.filter(f => f.status === 'DEPARTED').length,         color: 'text-blue-600',    bg: 'bg-blue-50'    },
          { label: 'Cancelled', value: flights.filter(f => f.status === 'CANCELLED').length,        color: 'text-rose-600',    bg: 'bg-rose-50'    },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-white/80`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {flights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
            <Navigation size={48} strokeWidth={1} />
            <p className="text-sm font-semibold uppercase tracking-widest">No routes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Flight No.','Route','Departure','Arrival','Price','Seats','Status','Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {flights.map(flight => {
                  const currentStatus = statusMap[flight.flightId] ?? flight.status;
                  const cfg = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG['ON_TIME'];
                  return (
                    <tr key={flight.flightId} className="transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Plane size={14} className="text-blue-500" />
                          </div>
                          <span className="font-bold text-sm text-slate-800 tracking-wider">{flight.flightNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{flight.origin}</span>
                          <div className="flex items-center gap-1 text-slate-300">
                            <div className="w-6 h-px bg-slate-200"></div>
                            <Plane size={11} className="text-slate-300" />
                            <div className="w-6 h-px bg-slate-200"></div>
                          </div>
                          <span className="font-bold text-slate-800 text-sm">{flight.destination}</span>
                        </div>
                        {flight.airline?.name && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{flight.airline.name}</p>}
                      </td>
                      <td className="px-6 py-4"><p className="text-sm font-semibold text-slate-700 whitespace-nowrap">{formatDateTime(flight.departureTime)}</p></td>
                      <td className="px-6 py-4"><p className="text-sm font-semibold text-slate-700 whitespace-nowrap">{formatDateTime(flight.arrivalTime)}</p></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                          <span>₹</span><span>{flight.price?.toLocaleString('en-IN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-600 text-sm font-semibold">
                          <Users size={13} className="text-slate-400" />
                          <span>{flight.availableSeats}</span>
                          {flight.totalSeats > 0 && <span className="text-slate-300 font-normal">/ {flight.totalSeats}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {canWrite ? (
                          <select
                            value={currentStatus}
                            onChange={e => handleStatusChange(flight.flightId, e.target.value as FlightStatus)}
                            className={`${cfg.bg} ${cfg.text} text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1.5 border-0 outline-none cursor-pointer`}
                          >
                            {(Object.keys(STATUS_CONFIG) as FlightStatus[]).map(s => (
                              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit ${cfg.bg} ${cfg.text}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></div>
                            {cfg.label}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                          {canWrite && (
                            <button onClick={() => { 
                               setEditingFlight(flight); 
                               setFormData({ ...flight, airlineId: flight.airline?.airlineId || flight.airline?.id }); 
                               setShowModal(true); 
                             }}
                              className="p-2 bg-slate-50 text-slate-500 rounded-xl transition-all" title="Edit">
                              <Edit3 size={15} />
                            </button>
                          )}
                          {isAdmin && (
                            <button onClick={() => handleDelete(flight.flightId)}
                              className="p-2 bg-slate-50 text-slate-400 rounded-xl transition-all" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto custom-scrollbar">

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Plane size={24} /></div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingFlight ? 'Update Flight Route' : 'Add New Flight Route'}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  {editingFlight ? `Editing: ${editingFlight.flightNumber}` : 'Schedule a new route on the network'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Flight Number & Airline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
                    <Hash size={11} /> Flight Number
                  </label>
                  <input required
                    value={formData.flightNumber ?? ''}
                    onChange={e => setFormData({ ...formData, flightNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all uppercase placeholder:normal-case"
                    placeholder="e.g. AI-302"
                  />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
                    <Plane size={11} /> Airline
                  </label>
                  
                  <div 
                    onClick={() => setAirlineDropdownOpen(!airlineDropdownOpen)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer outline-none transition-all"
                  >
                    {formData.airlineId ? (
                      <div className="flex items-center gap-3">
                        {airlines.find(a => a.airlineId === formData.airlineId)?.logoUrl ? (
                           <img src={airlines.find(a => a.airlineId === formData.airlineId)?.logoUrl} className="h-6 w-6 object-contain rounded-md" alt="" />
                        ) : (
                           <div className="h-6 w-6 bg-blue-100 rounded-md flex items-center justify-center"><Plane size={12} className="text-blue-500" /></div>
                        )}
                        <span className="text-sm font-bold text-slate-800">
                          {airlines.find(a => a.airlineId === formData.airlineId)?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-slate-400">Select Airline</span>
                    )}
                    <ChevronRight size={16} className={`text-slate-400 transition-transform ${airlineDropdownOpen ? 'rotate-90' : ''}`} />
                  </div>

                  {airlineDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setAirlineDropdownOpen(false)}></div>
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar p-2 animate-in fade-in zoom-in-95">
                        {airlines.map(a => (
                           <div 
                             key={a.airlineId} 
                             onClick={() => { setFormData({ ...formData, airlineId: a.airlineId }); setAirlineDropdownOpen(false); }}
                             className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${formData.airlineId === a.airlineId ? 'bg-blue-50' : ''}`}
                           >
                              {a.logoUrl ? (
                                 <img src={a.logoUrl} className="h-8 w-8 object-contain rounded-lg border border-slate-100 bg-white p-1" alt={a.name} />
                              ) : (
                                 <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center"><Plane size={14} className="text-blue-400" /></div>
                              )}
                              <span className={`text-sm font-bold ${formData.airlineId === a.airlineId ? 'text-blue-700' : 'text-slate-700'}`}>{a.name}</span>
                              {formData.airlineId === a.airlineId && <CheckCircle2 size={16} className="text-blue-600 ml-auto" />}
                           </div>
                        ))}
                        {airlines.length === 0 && <p className="text-xs text-slate-400 font-semibold p-4 text-center">No airlines found</p>}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Origin & Destination */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
                    <MapPin size={11} /> Origin (IATA)
                  </label>
                  <input required maxLength={3}
                    value={formData.origin ?? ''}
                    onChange={e => setFormData({ ...formData, origin: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all uppercase placeholder:normal-case"
                    placeholder="DEL"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
                    <MapPin size={11} /> Destination (IATA)
                  </label>
                  <input required maxLength={3}
                    value={formData.destination ?? ''}
                    onChange={e => setFormData({ ...formData, destination: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all uppercase placeholder:normal-case"
                    placeholder="BOM"
                  />
                </div>
              </div>

              {/* Premium Date & Time Pickers & Aircraft */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DateTimePicker
                  label="Departure Date & Time"
                  value={formData.departureTime ?? ''}
                  onChange={val => setFormData({ ...formData, departureTime: val })}
                  icon={<Clock size={11} />}
                />
                <DateTimePicker
                  label="Arrival Date & Time"
                  value={formData.arrivalTime ?? ''}
                  onChange={val => setFormData({ ...formData, arrivalTime: val })}
                  icon={<Clock size={11} />}
                />
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
                    <Plane size={11} /> Aircraft Type
                  </label>
                  <input required
                    value={formData.aircraftType ?? ''}
                    onChange={e => setFormData({ ...formData, aircraftType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder:normal-case"
                    placeholder="e.g. Boeing 737"
                  />
                </div>
              </div>

              {/* Price, Total Seats, Available Seats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
                    <DollarSign size={11} /> Base Price (₹)
                  </label>
                  <input required type="text" inputMode="numeric" pattern="[0-9]*"
                    value={formData.price || ''}
                    onChange={e => {
                       const v = e.target.value.replace(/\D/g, '');
                       setFormData({ ...formData, price: v === '' ? 0 : Number(v) });
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                    placeholder="3500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
                    <Users size={11} /> Total Seats
                  </label>
                  <input required type="text" inputMode="numeric" pattern="[0-9]*"
                    value={formData.totalSeats || ''}
                    onChange={e => {
                       const v = e.target.value.replace(/\D/g, '');
                       setFormData({ ...formData, totalSeats: v === '' ? 0 : Number(v) });
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                    placeholder="180"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
                    <Users size={11} /> Available Seats
                  </label>
                  <input required type="text" inputMode="numeric" pattern="[0-9]*"
                    value={formData.availableSeats || ''}
                    onChange={e => {
                       const v = e.target.value.replace(/\D/g, '');
                       setFormData({ ...formData, availableSeats: v === '' ? 0 : Number(v) });
                    }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                    placeholder="180"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1.5">
                  <Shield size={11} /> Status
                </label>
                <select
                  value={formData.status ?? 'ON_TIME'}
                  onChange={e => setFormData({ ...formData, status: e.target.value as FlightStatus })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                >
                  {(Object.keys(STATUS_CONFIG) as FlightStatus[]).map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-10">
                <button type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-4 text-sm font-bold text-slate-500 rounded-2xl transition-all">
                  Discard
                </button>
                <button type="submit"
                  className="flex-[3] py-4 text-sm font-bold bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2">
                  <Activity size={18} className="animate-pulse" />
                  {editingFlight ? 'Save Changes' : 'Schedule Flight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;
