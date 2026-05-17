import React from 'react';

const SummaryCard: React.FC = () => (
  <div className="w-[340px] px-8">
     <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-xl flex flex-col items-center text-center gap-8 sticky top-32 overflow-hidden group">
        {/* Background gradient for the ad feel */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#da1e28]" />
        
        <img 
           src="https://1000logos.net/wp-content/uploads/2020/09/Air-India-Logo.png" 
           alt="Air India" 
           className="h-16 w-auto transition-transform duration-500 group-hover:scale-110" 
        />
        
        <div className="flex flex-col gap-3">
           <h3 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
              FLY SKY HIGH<br />
              <span className="text-[#da1e28]">WITH 50% OFF</span>
           </h3>
           <p className="text-sm font-medium text-gray-500 max-w-[200px] mx-auto">
              Book your next journey with Air India and enjoy half the price.
           </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
           <div className="bg-gray-50 py-3 px-4 rounded-xl border border-dashed border-gray-300">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Use Code</span>
              <span className="text-xl font-black text-gray-800 tracking-tighter uppercase">SKY50OFF</span>
           </div>
           
           <button className="w-full bg-[#da1e28] hover:bg-[#b0131e] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-red-100">
              Book Now
           </button>
        </div>
        
        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">*Terms and conditions apply</p>
     </div>
  </div>
);

export default SummaryCard;
