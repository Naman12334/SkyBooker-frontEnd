import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getAllBookings, updateBookingStatus } from '../../../shared/api/adminApi';
import { passengerApi } from '../../../shared/api/passengerApi';
import { useAppSelector } from '../../../store/hooks';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Info,
  Calendar,
  CreditCard,
  User as UserIcon,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Booking {
  bookingId: string;
  userId: number;
  flightId: number;
  returnFlightId: number | null;
  pnrCode: string;
  tripType: string;
  status: string;
  totalFare: number;
  baseFare: number;
  taxes: number;
  mealPreference: string | null;
  luggageKg: number;
  contactEmail: string;
  contactPhone: string;
  bookedAt: string;
  paymentId: string | null;
}

const statusColors: Record<string, { bg: string, text: string, icon: any }> = {
  'CONFIRMED': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle2 size={12} /> },
  'PENDING': { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Clock size={12} /> },
  'CANCELLED': { bg: 'bg-rose-50', text: 'text-rose-700', icon: <XCircle size={12} /> },
  'COMPLETED': { bg: 'bg-blue-50', text: 'text-blue-700', icon: <CheckCircle2 size={12} /> },
  'FAILED': { bg: 'bg-slate-100', text: 'text-slate-600', icon: <AlertCircle size={12} /> },
  'NO_SHOW': { bg: 'bg-rose-50', text: 'text-rose-700', icon: <AlertCircle size={12} /> },
};

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingPassengers, setSelectedBookingPassengers] = useState<any[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const canUpdate = user?.role === 'ADMIN' || user?.role === 'AIRLINE_STAFF';

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleViewPassengers = async (bookingId: string) => {
    try {
      const passengers = await passengerApi.getPassengersByBooking(bookingId);
      setSelectedBookingPassengers(passengers);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch passengers', error);
      toast.error('Could not fetch passenger details.');
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    if (!canUpdate) return;
    try {
      await updateBookingStatus(bookingId, status);
      fetchBookings();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Booking Management</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor global reservations and manage lifecycle states.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search PNR or Email..." 
              className="bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 w-64 shadow-sm"
            />
          </div>
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">PNR / Trip</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total Fare</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((b) => (
              <tr key={b.bookingId} className="transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-blue-600 tracking-tighter">{b.pnrCode}</span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{b.tripType}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{b.contactEmail}</span>
                    <span className="text-xs text-slate-500 font-medium">{b.contactPhone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <CreditCard size={14} className="text-slate-300" />
                    <span className="text-sm">₹{b.totalFare.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`w-fit flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-[10px] tracking-widest ${statusColors[b.status]?.bg || 'bg-slate-100'} ${statusColors[b.status]?.text || 'text-slate-600'}`}>
                    {statusColors[b.status]?.icon || <Clock size={12} />}
                    {b.status}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={14} className="text-slate-300" />
                    <span className="text-xs font-semibold">{new Date(b.bookedAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canUpdate && b.status !== 'CANCELLED' && (
                      <select 
                        value={b.status}
                        onChange={(e) => handleStatusUpdate(b.bookingId, e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-semibold p-1.5 outline-none transition-all cursor-pointer opacity-100"
                      >
                        <option value="PENDING">SET PENDING</option>
                        <option value="CONFIRMED">CONFIRM</option>
                        <option value="COMPLETED">COMPLETE</option>
                        <option value="CANCELLED">CANCEL</option>
                      </select>
                    )}
                    <button 
                      onClick={() => handleViewPassengers(b.bookingId)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                      title="View Details"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Passenger Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[2rem] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Passenger Information</h3>
                <p className="text-xs text-slate-500">Details for all travelers in this booking</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Info size={20} className="text-slate-400 rotate-180" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {selectedBookingPassengers && selectedBookingPassengers.length > 0 ? (
                <div className="space-y-4">
                  {selectedBookingPassengers.map((p, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900">{p.title}. {p.firstName} {p.lastName}</span>
                            <div className="flex gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{p.passengerType}</span>
                              <span className="text-[10px] font-medium text-slate-400">|</span>
                              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{p.gender}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seat</span>
                          <span className="text-sm font-bold text-blue-600">{p.seatNumber || 'Not Assigned'}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200/50">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Passport Number</span>
                          <span className="text-xs font-semibold text-slate-700">{p.passportNumber} ({p.nationality})</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket Number</span>
                          <span className="text-xs font-semibold text-slate-700">{p.ticketNumber || 'PENDING'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-slate-400 text-sm italic">No passenger details found for this booking.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-black transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
