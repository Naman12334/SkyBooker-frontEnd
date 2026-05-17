import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { PlaneTakeoff, Calendar, Users, Search, ArrowLeftRight, MapPin, X } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'

const DestinationCard = ({ image, title, sub, price, label }: { image: string, title: string, sub: string, price: string, label: string }) => (
  <div className="flex flex-col gap-3 group">
    <div className="relative overflow-hidden rounded-[1.5rem] aspect-[4/5]">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/50">
        <span className="text-white text-[8px] font-medium uppercase tracking-widest">{label}</span>
      </div>
    </div>
    <div className="flex flex-col">
      <h4 className="text-lg font-medium uppercase text-black tracking-tight">{title}</h4>
      <p className="text-[9px] font-normal text-gray-400 uppercase tracking-widest">{sub}</p>
      <p className="text-xl font-semibold text-blue-600 mt-1">{price}</p>
    </div>
  </div>
)

const INDIAN_CITIES = [
  { name: "Delhi", airport: "Indira Gandhi Int'l (DEL)", code: "DEL" },
  { name: "Mumbai", airport: "Chhatrapati Shivaji (BOM)", code: "BOM" },
  { name: "Bangalore", airport: "Kempegowda Int'l (BLR)", code: "BLR" },
  { name: "Kolkata", airport: "Netaji Subhas Bose (CCU)", code: "CCU" },
  { name: "Chennai", airport: "Chennai Int'l (MAA)", code: "MAA" },
  { name: "Hyderabad", airport: "Rajiv Gandhi Int'l (HYD)", code: "HYD" },
  { name: "Ahmedabad", airport: "Sardar Vallabhbhai (AMD)", code: "AMD" },
  { name: "Pune", airport: "Pune Airport (PNQ)", code: "PNQ" },
  { name: "Goa", airport: "Dabolim Airport (GOI)", code: "GOI" },
  { name: "Jaipur", airport: "Jaipur Int'l (JAI)", code: "JAI" }
];

const Destinations: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Search State
  const [pickup, setPickup] = useState(INDIAN_CITIES[0]);
  const [destination, setDestination] = useState(INDIAN_CITIES[2]);
  const [date, setDate] = useState("");
  const [dayjsDate, setDayjsDate] = useState<Dayjs | null>(null);
  const [guests, setGuests] = useState(1);

  const sectionRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    
    // Global click handler to close dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      observer.disconnect();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const destinations = [
    { title: "Delhi", sub: "International Airport (DEL)", price: "₹1000", image: "https://cdn.pixabay.com/photo/2020/02/02/17/24/travel-4813658_1280.jpg", label: "Economy Class" },
    { title: "Bangalore", sub: "Kempegowda Int'l (BLR)", price: "₹2000", image: "https://deih43ym53wif.cloudfront.net/bangalore-india-shutterstock_662210488_ac0dd8543d.jpeg", label: "Business Class" },
    { title: "Kolkata", sub: "Netaji Subhas Bose (CCU)", price: "₹5000", image: "https://tse4.mm.bing.net/th/id/OIP.7BjOqnfPECecU4JcS_BQSQHaFj?rs=1&pid=ImgDetMain&o=7&rm=3", label: "Economy Class" },
    { title: "Goa", sub: "Dabolim Airport (GOI)", price: "₹2000", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800", label: "Holiday Special" },
    { title: "Chennai", sub: "Chennai Int'l (MAA)", price: "₹1000", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800", label: "Business Class" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[120vh] flex flex-col items-center justify-center bg-white px-10 overflow-visible"
    >
      <div className="relative z-10 w-full flex flex-col items-center -mt-20">
        {/* Animated Title */}
        <h2 className={`text-3xl md:text-4xl font-light text-center text-black mb-12 leading-tight uppercase tracking-tight transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Find Special Prices to Favorite <br />
          <span className="font-medium text-blue-600">Destinations</span>
        </h2>

        {/* Search Bar - No more hardcoded! */}
        <div 
          ref={dropdownRef}
          className={`relative z-50 flex justify-center mb-8 w-full max-w-7xl transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="bg-white p-2.5 rounded-full flex items-center border border-gray-100 shadow-2xl w-full">
            {/* Pickup & Destination Group */}
            <div className="flex-[2.5] flex items-center gap-4 px-10 py-5 border-r border-gray-100">
              <div 
                className="flex-1 flex flex-col cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-colors"
                onClick={() => setActiveDropdown(activeDropdown === 'pickup' ? null : 'pickup')}
              >
                <div className="flex items-center gap-3">
                  <PlaneTakeoff size={18} className="text-blue-600" />
                  <span className="text-[12px] uppercase tracking-widest text-gray-400 font-bold">Pickup</span>
                </div>
                <span className="text-base font-semibold text-gray-900 mt-1">{pickup.name}</span>
                {activeDropdown === 'pickup' && (
                  <div className="absolute top-full left-10 mt-4 bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-6 w-72 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Pickup City</p>
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {INDIAN_CITIES.map(city => (
                        <div 
                          key={city.name} 
                          className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group"
                          onClick={(e) => { e.stopPropagation(); setPickup(city); setActiveDropdown(null); }}
                        >
                          <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                            <MapPin size={16} className="text-gray-400 group-hover:text-blue-600" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-semibold text-gray-900">{city.name}</span>
                             <span className="text-[10px] text-gray-400">{city.airport}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <ArrowLeftRight size={20} className="text-gray-200" />

              <div 
                className="flex-1 flex flex-col cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-colors"
                onClick={() => setActiveDropdown(activeDropdown === 'destination' ? null : 'destination')}
              >
                <div className="flex items-center gap-3">
                  <PlaneTakeoff size={18} className="text-blue-600 rotate-180" />
                  <span className="text-[12px] uppercase tracking-widest text-gray-400 font-bold">Destination</span>
                </div>
                <span className="text-base font-semibold text-gray-900 mt-1">{destination.name}</span>
                {activeDropdown === 'destination' && (
                  <div className="absolute top-full left-1/3 mt-4 bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-6 w-72 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Destination</p>
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {INDIAN_CITIES.map(city => (
                        <div 
                          key={city.name} 
                          className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group"
                          onClick={(e) => { e.stopPropagation(); setDestination(city); setActiveDropdown(null); }}
                        >
                          <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                            <MapPin size={16} className="text-gray-400 group-hover:text-blue-600" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-semibold text-gray-900">{city.name}</span>
                             <span className="text-[10px] text-gray-400">{city.airport}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date Picker */}
            <div
              className="flex-1 flex flex-col px-8 py-5 border-r border-gray-100 cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors relative"
              onClick={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')}
            >
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-blue-600" />
                <span className="text-[12px] uppercase tracking-widest text-gray-400 font-bold">Trip Date</span>
              </div>
              <span className="text-base font-semibold text-gray-900 mt-1">
                {dayjsDate ? dayjsDate.format('DD MMM YYYY') : 'Pick Date'}
              </span>

              {activeDropdown === 'date' && (
                <div
                  className="absolute top-full left-0 mt-3 z-[200] animate-in fade-in slide-in-from-top-4 duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-white rounded-[2rem] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden">
                    <div className="px-6 pt-5 pb-2 border-b border-gray-50">
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Trip Date</p>
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        value={dayjsDate}
                        onChange={(newVal: Dayjs | null) => {
                          setDayjsDate(newVal);
                          setDate(newVal ? newVal.format('YYYY-MM-DD') : '');
                          setActiveDropdown(null);
                        }}
                        disablePast
                        sx={{
                          '& .MuiPickersCalendarHeader-root': {
                            paddingLeft: '20px',
                            paddingRight: '20px',
                          },
                          '& .MuiDayCalendar-weekDayLabel': {
                            color: '#9ca3af',
                            fontWeight: 700,
                            fontSize: '11px',
                            letterSpacing: '0.1em',
                          },
                          '& .MuiPickersDay-root': {
                            borderRadius: '10px',
                            fontWeight: 500,
                            fontSize: '13px',
                            '&:hover': {
                              backgroundColor: '#eff6ff',
                              color: '#2563eb',
                            },
                          },
                          '& .MuiPickersDay-root.Mui-selected': {
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: '10px',
                            '&:hover': {
                              backgroundColor: '#1d4ed8',
                            },
                          },
                          '& .MuiPickersDay-today': {
                            border: '2px solid #2563eb !important',
                            color: '#2563eb',
                            borderRadius: '10px',
                          },
                          '& .MuiPickersCalendarHeader-label': {
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#111827',
                          },
                          '& .MuiIconButton-root': {
                            color: '#6b7280',
                            '&:hover': { color: '#2563eb', backgroundColor: '#eff6ff' },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              )}
            </div>

            {/* Guest Picker */}
            <div 
              className="flex-1 flex flex-col px-8 py-5 cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-colors relative"
              onClick={() => setActiveDropdown(activeDropdown === 'guest' ? null : 'guest')}
            >
              <div className="flex items-center gap-3">
                <Users size={18} className="text-blue-600" />
                <span className="text-[12px] uppercase tracking-widest text-gray-400 font-bold">Guest</span>
              </div>
              <span className="text-base font-semibold text-gray-900 mt-1">{guests} Guest</span>
              {activeDropdown === 'guest' && (
                <div className="absolute top-full right-0 mt-4 bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-6 w-48 z-[100]" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Total Guests</p>
                  <div className="flex items-center justify-between">
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors" onClick={() => setGuests(Math.max(1, guests - 1))}>-</button>
                    <span className="text-lg font-bold">{guests}</span>
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors" onClick={() => setGuests(guests + 1)}>+</button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-full text-sm font-bold transition-all shadow-xl shadow-blue-100 uppercase tracking-widest ml-4 px-12"
              onClick={() => {
                if (!date) {
                  toast.error("Please select a trip date before searching.");
                  return;
                }
                if (pickup.code === destination.code) {
                  toast.error("Pickup and Destination cities cannot be the same.");
                  return;
                }
                navigate(`/search?origin=${pickup.code}&destination=${destination.code}&date=${date}&passengers=${guests}`);
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-5 gap-6 w-full max-w-[1550px] mx-auto px-4">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              className={`transition-all duration-700 ease-out`}
              style={{
                transitionDelay: `${500 + idx * 100}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(25px)'
              }}
            >
              <DestinationCard {...dest} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Destinations
