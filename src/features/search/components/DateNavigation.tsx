import React from 'react';
import { Star } from 'lucide-react';

interface DateItem {
  day: string;
  price: string;
  fullDate: string;
  highlight?: boolean;
  active?: boolean;
}

interface DateNavigationProps {
  dates: DateItem[];
  onDateSelect?: (date: string) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({ dates, onDateSelect }) => (
  <div className="bg-white border-b border-gray-200">
     <div className="max-w-[1600px] mx-auto flex items-center h-[72px]">
        {dates.map((item, idx) => (
          <div 
            key={idx} 
            className={`flex-1 flex flex-col items-center justify-center h-full border-r border-gray-100 cursor-pointer transition-all ${item.active ? 'bg-[#05203c] text-white' : 'hover:bg-gray-50'} ${item.highlight ? 'bg-[#e5fcf3]' : ''}`}
            onClick={() => onDateSelect && onDateSelect(item.fullDate)}
          >
             <span className={`text-[10px] font-medium tracking-tight mb-1 ${item.active ? 'text-gray-400' : 'text-gray-500'}`}>{item.day}</span>
             <div className="flex items-center gap-1">
                {item.highlight && <Star size={10} className="text-emerald-600 fill-emerald-600" />}
                <span className={`text-[15px] font-bold ${item.active ? 'text-white' : 'text-gray-900'} ${item.highlight ? 'text-emerald-700' : ''}`}>
                   {item.price ? `₹${item.price}` : ' '}
                </span>
             </div>
          </div>
        ))}
        <div className="px-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-full">
           <div className="w-5 h-5 border-2 border-gray-900 rounded-sm mb-1 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
           </div>
           <span className="text-[10px] font-bold text-gray-900 uppercase">Flexible dates</span>
        </div>
     </div>
  </div>
);

export default DateNavigation;
