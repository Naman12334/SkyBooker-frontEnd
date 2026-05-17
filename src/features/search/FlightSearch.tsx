import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Info, Clock, ChevronDown, Loader2 } from 'lucide-react';
import SearchHeader from './components/SearchHeader';
import DateNavigation from './components/DateNavigation';
import FilterSection from './components/FilterSection';
import FlightCard from './components/FlightCard';
import SummaryCard from './components/SummaryCard';
import { flightApi, Flight } from '../../shared/api/flightApi';

const FlightSearch: React.FC = () => {
  const [activeSort, setActiveSort] = useState('Best');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [navDates, setNavDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      origin: params.get('origin') || 'DEL',
      destination: params.get('destination') || 'BOM',
      date: params.get('date') || new Date().toISOString().split('T')[0],
      passengers: parseInt(params.get('passengers') || '1', 10)
    };
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const { origin, destination, date, passengers } = getQueryParams();
        
        // Build generic empty layout initially
        const current = new Date(date);
        const datesToFetch: {i: number, dt: Date}[] = [];
        for(let i = -3; i <= 3; i++) {
           const d = new Date(current);
           d.setDate(d.getDate() + i);
           datesToFetch.push({i, dt: d});
        }
        
        setNavDates(datesToFetch.map(({i, dt}) => ({
           day: dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
           price: "",
           fullDate: dt.toISOString().split('T')[0],
           active: i === 0,
           highlight: false
        })));

        // Run 7 API requests Concurrently for correct actual API data minimum prices
        const responses = await Promise.all(datesToFetch.map(async ({i, dt}) => {
            const dtStr = dt.toISOString().split('T')[0];
            const dayStr = dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            try {
                const searchData = await flightApi.searchFlights(origin, destination, dtStr, passengers);
                const cheapest = searchData.length > 0 ? searchData.reduce((min, f) => f.price < min.price ? f : min, searchData[0]) : null;
                if (i === 0) setFlights(searchData); 
                return { 
                   day: dayStr, 
                   price: cheapest ? cheapest.price.toLocaleString() : "", 
                   cheapestPriceNum: cheapest ? cheapest.price : Infinity, 
                   fullDate: dtStr, 
                   active: i === 0, 
                   highlight: false 
                };
            } catch (e) {
                if (i === 0) setFlights([]);
                return { day: dayStr, price: "", cheapestPriceNum: Infinity, fullDate: dtStr, active: i === 0, highlight: false };
            }
        }));
        
        // Determine highlighting logic relative to main date
        const mainBase = responses.find(r => r.active)?.cheapestPriceNum || Infinity;
        if (mainBase !== Infinity) {
            responses.forEach(r => {
               if(r.cheapestPriceNum < mainBase) r.highlight = true;
            });
        }
        setNavDates(responses);

      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [location.search]);

  const getDurationMs = (departure: string, arrival: string) => {
    return new Date(arrival).getTime() - new Date(departure).getTime();
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const diff = getDurationMs(departure, arrival);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const { date } = getQueryParams();

  const cheapestFlight = flights.length > 0 ? flights.reduce((min, f) => f.price < min.price ? f : min, flights[0]) : null;
  const fastestFlight = flights.length > 0 ? flights.reduce((min, f) => getDurationMs(f.departureTime, f.arrivalTime) < getDurationMs(min.departureTime, min.arrivalTime) ? f : min, flights[0]) : null;



  const sortingTabsConfig = flights.length > 0 ? [
    {name: 'Best', price: `₹${cheapestFlight?.price.toLocaleString()}`, dur: `${calculateDuration(cheapestFlight!.departureTime, cheapestFlight!.arrivalTime)}`},
    {name: 'Cheapest', price: `₹${cheapestFlight?.price.toLocaleString()}`, dur: `${calculateDuration(cheapestFlight!.departureTime, cheapestFlight!.arrivalTime)}`},
    {name: 'Fastest', price: `₹${fastestFlight?.price.toLocaleString()}`, dur: `${calculateDuration(fastestFlight!.departureTime, fastestFlight!.arrivalTime)}`}
  ] : [
    {name: 'Best', price: '-', dur: '-'},
    {name: 'Cheapest', price: '-', dur: '-'},
    {name: 'Fastest', price: '-', dur: '-'}
  ];

  const sortedFlights = [...flights].sort((a, b) => {
    if (activeSort === 'Cheapest') return a.price - b.price;
    if (activeSort === 'Fastest') return getDurationMs(a.departureTime, a.arrivalTime) - getDurationMs(b.departureTime, b.arrivalTime);
    return a.price - b.price;
  });

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleDateSelect = (selectedDate: string) => {
    const params = new URLSearchParams(location.search);
    params.set('date', selectedDate);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col font-sans">
      <SearchHeader />

      <div>
        <DateNavigation dates={navDates} onDateSelect={handleDateSelect} />

        <div className="max-w-[1600px] w-full mx-auto flex py-8">
          {/* Sidebar Filters */}
          <div className="w-[300px] bg-transparent flex flex-col gap-8 px-6">
             <button className="bg-gray-200/60 hover:bg-gray-200 text-gray-900 py-3.5 px-6 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-3">
                <Clock size={16} /> Get Price Alerts
             </button>

             <div className="flex flex-col gap-2">
               <FilterSection title="Stops" options={[{label: 'Direct'}]} />
               <FilterSection title="Baggage" options={[{label: 'Cabin bag'}, {label: 'Checked bag'}]} />
               <FilterSection title="Departure times" options={[{label: 'Outbound'}]} />
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 px-8 flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-500 uppercase flex items-center gap-2 tracking-wide">
                   {loading ? 'Searching...' : `${flights.length} results sorted by `} 
                   <span className="font-bold text-gray-900 underline decoration-gray-300 underline-offset-4 cursor-pointer">
                     {activeSort}
                   </span> <Info size={14} />
                </h2>
                <span className="text-xs font-bold text-blue-600 border-b border-blue-100 cursor-pointer hover:text-blue-700 transition-colors">Show whole month</span>
             </div>

             {/* Sorting Tabs */}
             <div className="grid grid-cols-4 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-[88px]">
                {sortingTabsConfig.map(tab => (
                  <div 
                    key={tab.name}
                    className={`flex flex-col justify-center px-8 cursor-pointer transition-all border-r border-gray-100 ${activeSort === tab.name ? 'bg-[#05203c] text-white' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveSort(tab.name)}
                  >
                    <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${activeSort === tab.name ? 'text-gray-400' : 'text-gray-500'}`}>{tab.name}</span>
                    <p className={`text-2xl font-bold ${activeSort === tab.name ? 'text-white' : 'text-gray-900'}`}>{tab.price}</p>
                    <span className={`text-[10px] font-medium ${activeSort === tab.name ? 'text-gray-400' : 'text-gray-500'}`}>{tab.dur}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-8 cursor-pointer hover:bg-gray-50">
                   <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Sort</span>
                   <ChevronDown size={18} className="text-gray-400" />
                </div>
             </div>

             {/* Flight Results */}
             <div className="flex flex-col gap-4">
                {loading ? (
                   <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <Loader2 size={40} className="text-[#3333FF] animate-spin mb-4" />
                      <p className="text-gray-500 font-medium">Finding the best flights for you...</p>
                   </div>
                ) : sortedFlights.length > 0 ? (
                  sortedFlights.map(flight => (
                    <FlightCard 
                      key={flight.id}
                      airline={flight.airline.name} 
                      price={flight.price.toLocaleString()}
                      rawPrice={flight.price}
                      segments={[
                         { 
                           id: flight.id,
                           logo: flight.airline.logoUrl || "https://1000logos.net/wp-content/uploads/2020/09/Air-India-Logo.png", 
                           departure: { time: formatTime(flight.departureTime), code: flight.origin }, 
                           arrival: { time: formatTime(flight.arrivalTime), code: flight.destination }, 
                           duration: calculateDuration(flight.departureTime, flight.arrivalTime) 
                         }
                      ]}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-center px-10">
                    <p className="text-gray-900 font-bold text-xl mb-2">No flights found</p>
                    <p className="text-gray-500 max-w-sm">We couldn't find any flights for your selected route and date. Try selecting different dates or cities.</p>
                  </div>
                )}
             </div>
          </div>

          {/* Right Sidebar - Ad Summary */}
          <SummaryCard />
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
