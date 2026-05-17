import React, { useState } from 'react';
import { Heart, Info, ChevronRight } from 'lucide-react';
import FlightSegment from './FlightSegment';
import PassengerForm from './PassengerForm';
import SeatSelectionModal from '../SeatSelectionModal';

interface FlightCardProps {
  airline: string;
  segments: any[];
  price: string;
  rawPrice?: number;
  sponsored?: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({ airline, segments, price, rawPrice, sponsored = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  return (
    <div className={`relative flex flex-col mb-5 transition-all duration-500`}>
      <div className={`relative bg-white rounded-2xl border transition-all duration-500 hover:shadow-2xl overflow-hidden ${sponsored ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 shadow-sm'} ${isFormExpanded ? 'shadow-2xl scale-[1.02]' : ''}`}>
        {sponsored && (
          <div className="bg-[#da1e28] text-white px-6 py-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <img src="https://1000logos.net/wp-content/uploads/2020/09/Air-India-Logo.png" className="h-4 w-auto brightness-0 invert" alt="logo" />
                    <span className="w-[1px] h-3 bg-white/30" />
                </div>
                <div className="flex flex-col -gap-1">
                    <span className="text-[13px] font-bold tracking-tight">Up to INR 1000 OFF*, Use: UPIPROMO</span>
                    <span className="text-[10px] font-medium opacity-90">₹0 Convenience Fee + 15% EXTRA OFF on Login</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Sponsored</span>
                <Info size={14} className="opacity-70" />
              </div>
          </div>
        )}
        
        <div className="flex">
          {/* Flight Segments */}
          <div className="flex-[4] p-6 border-r border-gray-100 flex flex-col justify-center">
              {segments.map((seg: any, i: number) => (
                <FlightSegment key={i} {...seg} />
              ))}
          </div>

          {/* Action Section */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center gap-2 min-w-[220px]">
              <div className="text-center mb-2">
                <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap">Book with {airline} from</span>
                <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">₹{price}</p>
              </div>
              <button 
                onClick={() => setIsFormExpanded(!isFormExpanded)}
                className={`px-10 py-3 rounded-lg text-sm font-normal transition-all flex items-center gap-2 group w-full justify-center ${isFormExpanded ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#05203c] text-white hover:bg-black'}`}
              >
                {isFormExpanded ? 'Cancel' : 'Select'} <ChevronRight size={18} className={isFormExpanded ? 'rotate-90' : ''} />
              </button>
          </div>
        </div>
        
        <div className="bg-gray-50/50 px-6 py-2.5 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-gray-500">This flight emits 9% less CO2e than a typical flight on this route</span>
              <Info size={14} className="text-gray-300" />
          </div>
          <div className="flex items-center gap-4">
              <Heart size={18} className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {isFormExpanded && (
        <PassengerForm 
            airline={airline}
            flight={{ ...segments[0], price }}
            onSubmit={() => {
                setIsFormExpanded(false);
                setIsModalOpen(true);
            }}
        />
      )}

      <SeatSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        flight={{
          ...segments[0],
          airline,
          price: rawPrice
        }}
      />
    </div>
  );
};

export default FlightCard;
