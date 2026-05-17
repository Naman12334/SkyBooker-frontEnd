import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  price?: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  isOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, options, isOpen = true }) => (
  <div className="flex flex-col border-b border-gray-100 py-5">
    <div className="flex items-center justify-between cursor-pointer mb-5">
      <span className="font-bold text-gray-800 text-base">{title}</span>
      <ChevronDown size={14} className="text-gray-400" />
    </div>
    {isOpen && (
      <div className="flex flex-col gap-4">
        {options.map((option, idx) => (
          <label key={idx} className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
               <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" defaultChecked={idx === 0} />
               <span className="text-[15px] text-gray-700 group-hover:text-black transition-colors">{option.label}</span>
            </div>
            {option.price && <span className="text-[11px] text-gray-400">from {option.price}</span>}
          </label>
        ))}
      </div>
    )}
  </div>
);

export default FilterSection;
