import React from 'react';
import { Plane } from 'lucide-react';

interface FlightSegmentProps {
  logo: string;
  departure: {
    time: string;
    code: string;
  };
  arrival: {
    time: string;
    code: string;
  };
  duration: string;
}

const FlightSegment: React.FC<FlightSegmentProps> = ({ logo, departure, arrival, duration }) => (
  <div className="flex items-center gap-10 py-3">
    <div className="min-w-[120px] flex justify-center">
       <img src={logo} alt="Logo" className="h-16 w-auto object-contain transition-transform group-hover:scale-105" />
    </div>
    <div className="flex-[3] flex items-center justify-between gap-12">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-normal text-gray-900 tracking-tight">{departure.time}</span>
        <span className="text-xs font-bold text-gray-400 mt-1 uppercase">{departure.code}</span>
      </div>

      <div className="flex flex-col items-center flex-1 max-w-[140px]">
        <span className="text-[10px] text-gray-400 font-medium mb-1">{duration}</span>
        <div className="relative w-full h-[1px] bg-gray-200 flex items-center justify-center">
          <Plane size={10} className="text-gray-400 absolute rotate-90" />
        </div>
        <span className="text-[10px] text-emerald-500 font-bold mt-1">Direct</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-2xl font-normal text-gray-900 tracking-tight">{arrival.time}</span>
        <span className="text-xs font-bold text-gray-400 mt-1 uppercase">{arrival.code}</span>
      </div>
    </div>
  </div>
);

export default FlightSegment;
