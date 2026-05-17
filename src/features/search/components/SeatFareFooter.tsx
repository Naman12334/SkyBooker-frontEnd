import React from 'react';
import { Loader2 } from 'lucide-react';

interface SeatFareFooterProps {
  flight: any;
  selectedSeats: string[];
  isBooking: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SeatFareFooter: React.FC<SeatFareFooterProps> = ({
  flight,
  selectedSeats,
  isBooking,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="bg-white p-6 border-t border-gray-100 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Fare Breakdown</span>
          <div className="flex flex-col">
            <div className="flex justify-between items-center gap-4">
              <span className="text-[11px] font-medium text-gray-400">Base Fare ({selectedSeats.length} Seats)</span>
              <span className="text-[11px] font-bold text-gray-600">₹ {selectedSeats.length * (flight?.price || 450)}</span>
            </div>
            <div className="flex justify-between items-center gap-4 border-b border-gray-100 pb-1 mb-1">
              <span className="text-[11px] font-medium text-gray-400">Taxes & Fees (18%)</span>
              <span className="text-[11px] font-bold text-gray-600">₹ {Math.round(selectedSeats.length * (flight?.price || 450) * 0.18)}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-bold text-gray-400">Total:</span>
              <span className="text-3xl font-normal text-gray-900 tracking-tighter">
                ₹ {Math.round(selectedSeats.length * (flight?.price || 450) * 1.18)}
              </span>
            </div>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="flex flex-col border-l border-gray-100 pl-8">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Seats</span>
            <div className="flex flex-wrap gap-2 max-w-[200px]">
              {selectedSeats.map(s => (
                <span key={s} className="bg-cyan-50 text-cyan-600 px-3 py-1 rounded text-xs font-black border border-cyan-100 shadow-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"
        >
          Back to Flight
        </button>
        <button
          disabled={selectedSeats.length === 0 || isBooking}
          onClick={onConfirm}
          className={`px-16 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-2xl relative overflow-hidden group flex items-center justify-center gap-2 ${selectedSeats.length > 0 && !isBooking
            ? 'bg-[#05203c] text-white hover:bg-black shadow-blue-900/20'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
            }`}
        >
          {isBooking ? (
            <>
              <Loader2 size={16} className="animate-spin relative z-10" />
              <span className="relative z-10">Processing...</span>
            </>
          ) : (
            <span className="relative z-10">Confirm & Pay</span>
          )}
          {selectedSeats.length > 0 && !isBooking && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SeatFareFooter;
