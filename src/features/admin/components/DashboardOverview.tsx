import React from 'react';
import { Users, Plane, Globe, BookOpen, TrendingUp, ArrowUpRight, Activity, Server, ShieldCheck, Zap, Clock, Info } from 'lucide-react';
import { getAllUsers, getAllAirlines, getAllAirports, getAllBookings, getAllFlights } from '../../../shared/api/adminApi';
import { useAppSelector } from '../../../store/hooks';

interface Flight {
  flightId: number;
  flightNumber: string;
  originAirportCode: string;
  destinationAirportCode: string;
  departureTime: string;
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED';
}

const DashboardOverview: React.FC = () => {
  const [counts, setCounts] = React.useState({
    users: 0,
    airlines: 0,
    airports: 0,
    bookings: 0,
    totalCollection: 0
  });
  const [flights, setFlights] = React.useState<Flight[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lastSync, setLastSync] = React.useState(new Date());

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  console.log('Dashboard: Current User Role:', user?.role);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const calls: Promise<any>[] = [
        isAdmin ? getAllUsers() : Promise.resolve([]),
        getAllAirlines(),
        getAllAirports(),
        getAllBookings(),
        getAllFlights()
      ];

      const results = await Promise.allSettled(calls);

      const newCounts = { ...counts };

      // Process Users (Index 0)
      if (results[0].status === 'fulfilled' && Array.isArray(results[0].value)) {
        newCounts.users = results[0].value.length;
      }

      // Process Airlines (Index 1)
      if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) {
        newCounts.airlines = results[1].value.length;
      }

      // Process Airports (Index 2)
      if (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) {
        newCounts.airports = results[2].value.length;
      }

      // Process Bookings (Index 3)
      if (results[3].status === 'fulfilled' && Array.isArray(results[3].value)) {
        newCounts.bookings = results[3].value.length;
        newCounts.totalCollection = results[3].value
          .filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
          .reduce((sum: number, b: any) => sum + (b.totalFare || 0), 0);
      }

      // Process Flights (Index 4)
      if (results[4].status === 'fulfilled' && Array.isArray(results[4].value)) {
        setFlights(results[4].value);
      }

      setCounts(newCounts);
      setLastSync(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, [isAdmin]);

  const stats = [
    { label: 'Total Users', value: counts.users.toLocaleString(), icon: <Users className="text-blue-600" />, trend: '+12%', color: 'bg-blue-50', roles: ['ADMIN'] },
    { label: 'Active Airlines', value: counts.airlines.toLocaleString(), icon: <Plane className="text-indigo-600" />, trend: '+2', color: 'bg-indigo-50' },
    { label: 'Connected Airports', value: counts.airports.toLocaleString(), icon: <Globe className="text-emerald-600" />, trend: '+5', color: 'bg-emerald-50' },
    { label: 'Total Bookings', value: counts.bookings.toLocaleString(), icon: <BookOpen className="text-amber-600" />, trend: '+18%', color: 'bg-amber-50' },
  ];

  const filteredStats = stats.filter(stat => !stat.roles || (user && stat.roles.includes(user.role)));

  const getStatusColor = (status: Flight['status']) => {
    switch (status) {
      case 'DEPARTED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'DELAYED': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'ARRIVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  if (loading && (isAdmin ? counts.users === 0 : true) && flights.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">System Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Operational status and platform growth metrics.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 bg-white disabled:opacity-50 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-200 shadow-sm"
          >
            <Activity size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-shadow">
            <div className={`p-3 rounded-2xl ${stat.color} w-fit mb-4`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.1em] mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-semibold text-slate-800">{stat.value}</h3>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-semibold">
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          {/* Live Flight Monitor */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Flight Operations Monitor</h3>
                <p className="text-xs text-slate-400 mt-1">Tracking departed and exception status flights.</p>
              </div>
              <button className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest underline">View All Flights</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-50">
                    <th className="pb-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2">Flight</th>
                    <th className="pb-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2">Route</th>
                    <th className="pb-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2">Departure</th>
                    <th className="pb-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {flights.length > 0 ? flights.slice(0, 10).map((flight) => (
                    <tr key={flight.flightId} className="group transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-xl text-slate-400 transition-all">
                            <Plane size={14} />
                          </div>
                          <span className="text-sm font-semibold text-slate-700 tracking-tight">{flight.flightNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs uppercase">
                          <span>{flight.originAirportCode}</span>
                          <ArrowUpRight size={12} className="text-slate-300" />
                          <span>{flight.destinationAirportCode}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                          <Clock size={12} />
                          {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-tight border ${getStatusColor(flight.status)}`}>
                          {flight.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <Info size={24} className="opacity-20" />
                          <p className="text-xs font-medium">No live flight data available</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">Total Collection</h3>

            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Confirmed Revenue</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">₹ {counts.totalCollection.toLocaleString()}</span>
                  <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-md">INR</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Success Rate</span>
                    <span className="text-xs font-black text-emerald-800">100%</span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-200/50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full rounded-full" />
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Platform Fee</span>
                    <span className="text-xs font-black text-blue-800">₹ {(counts.totalCollection * 0.1).toLocaleString()}</span>
                  </div>
                  <p className="text-[9px] text-blue-500 font-bold italic">* Estimated 10% operational margin</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Financial Status</p>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">Payments are processed via Razorpay. All amounts shown are post-tax totals.</p>
              <p className="text-[8px] text-blue-500 font-bold uppercase mt-3">Refreshed: {lastSync.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
