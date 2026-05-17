import React from 'react';

const SeatLegend: React.FC = () => {
  return (
    <div className="w-64 bg-white/90 backdrop-blur-md p-6 border-r border-gray-100/50 flex flex-col gap-6 m-6 rounded-2xl shadow-xl self-start">
      <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Legend</h4>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded bg-cyan-400 border border-cyan-500 shadow-sm" />
          <span className="text-sm font-medium text-gray-700">Free</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded bg-blue-100 border border-blue-200 shadow-sm" />
          <span className="text-sm font-medium text-gray-700">₹ 2000-5000</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded bg-purple-200 border border-purple-300 shadow-sm" />
          <span className="text-sm font-medium text-gray-700">₹ 5000-10000</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded border border-gray-200 flex flex-col overflow-hidden">
            <div className="h-1/2 bg-red-600" />
            <div className="h-1/2 bg-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">Exit Row Seats</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded border border-gray-200 border-b-4 border-b-black" />
          <span className="text-sm font-medium text-gray-700">Non Reclining</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400">XL</div>
          <span className="text-sm font-medium text-gray-700">Extra Legroom</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded bg-gray-100 border border-gray-200 relative">
             <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="absolute w-[1px] h-full bg-gray-400 rotate-45" />
                <div className="absolute w-[1px] h-full bg-gray-400 -rotate-45" />
             </div>
          </div>
          <span className="text-sm font-medium text-gray-700">Reserved</span>
        </div>
      </div>

      <div className="mt-10 p-4 bg-blue-50 rounded-xl border border-blue-100 italic text-[11px] text-blue-600 leading-relaxed">
        * Select a seat to view fare and details. Multiple seats can be selected for group bookings.
      </div>
    </div>
  );
};

export default SeatLegend;
