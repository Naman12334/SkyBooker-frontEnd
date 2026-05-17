import React from 'react';

interface AirplaneSeatMapProps {
  rows: number;
  leftCols: string[];
  rightCols: string[];
  selectedSeats: string[];
  toggleSeat: (seatId: string) => void;
  isSeatBooked: (row: number, col: string) => boolean;
  getSeatColor: (row: number, col: string) => string;
}

const AirplaneSeatMap: React.FC<AirplaneSeatMapProps> = ({
  rows,
  leftCols,
  rightCols,
  selectedSeats,
  toggleSeat,
  isSeatBooked,
  getSeatColor,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-10 py-20 flex flex-col items-center custom-scrollbar">
      {/* Airplane Body Container */}
      <div className="relative w-[500px] flex flex-col items-center">
        {/* Long Realistic Nose Nose */}
        <div
          className="relative w-full h-[600px] bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-x-8 border-t-8 border-gray-100 flex flex-col items-center pt-48 overflow-hidden z-20"
          style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
        >
          {/* Cockpit Windows */}
          <div className="relative w-full flex justify-center mt-20 z-30">
            <div className="flex gap-4">
              <div className="w-32 h-44 bg-[#1a1a1a] rounded-tl-[100%] rounded-tr-[20%] rounded-bl-[10%] rounded-br-[60%] transform -rotate-[40deg] opacity-95 border-b-8 border-black shadow-2xl" />
              <div className="w-32 h-44 bg-[#1a1a1a] rounded-tr-[100%] rounded-tl-[20%] rounded-br-[10%] rounded-bl-[60%] transform rotate-[40deg] opacity-95 border-b-8 border-black shadow-2xl" />
            </div>
          </div>
          {/* Subtle shading for depth */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50/80 via-white/20 to-transparent pointer-events-none" />
        </div>

        {/* Main Cabin Tube */}
        <div className="w-full bg-white border-x-8 border-gray-100 shadow-2xl px-8 py-10 -mt-1 relative z-10">
          {/* Washroom Icons at the Top */}
          <div className="flex justify-between mb-12 px-12">
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm">
              <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10.5C7 9.1 8.1 8 9.5 8s2.5 1.1 2.5 2.5S10.9 13 9.5 13 7 11.9 7 10.5M12.5 14H11v6H8v-6H6.5c-.8 0-1.5.7-1.5 1.5V19h1.5v4h6v-4H14v-3.5c0-.8-.7-1.5-1.5-1.5m6.5-3.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5m3.5 3.5h-1.5v6h-3v-6h-1.5c-.8 0-1.5.7-1.5 1.5V19h1.5v4h6v-4H22v-3.5c0-.8-.7-1.5-1.5-1.5z" />
              </svg>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm">
              <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10.5C7 9.1 8.1 8 9.5 8s2.5 1.1 2.5 2.5S10.9 13 9.5 13 7 11.9 7 10.5M12.5 14H11v6H8v-6H6.5c-.8 0-1.5.7-1.5 1.5V19h1.5v4h6v-4H14v-3.5c0-.8-.7-1.5-1.5-1.5m6.5-3.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5m3.5 3.5h-1.5v6h-3v-6h-1.5c-.8 0-1.5.7-1.5 1.5V19h1.5v4h6v-4H22v-3.5c0-.8-.7-1.5-1.5-1.5z" />
              </svg>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="flex flex-col gap-2">
            {/* Column Headers */}
            <div className="flex items-center justify-between mb-6 text-[13px] font-black text-gray-300 px-12 uppercase tracking-widest">
              <div className="flex gap-8">
                <span className="w-10 text-center">A</span>
                <span className="w-10 text-center">B</span>
                <span className="w-10 text-center">C</span>
              </div>
              <div className="flex gap-8">
                <span className="w-10 text-center">D</span>
                <span className="w-10 text-center">E</span>
                <span className="w-10 text-center">F</span>
              </div>
            </div>

            {Array.from({ length: rows }).map((_, r) => {
              const rowNum = r + 1;
              const isFirstRow = rowNum === 1;
              const isExitRow = rowNum === 12 || rowNum === 13;

              return (
                <div key={r} className="relative flex flex-col items-center">
                  {isExitRow && (
                    <div className="flex items-center justify-between w-full my-6 px-2">
                      <div className="flex items-center gap-1 text-[10px] font-black text-red-600 uppercase tracking-tighter">
                        <div className="w-1.5 h-6 bg-red-600 rounded-sm" />
                        <span className="bg-white px-1">EXIT</span>
                        <svg className="w-3 h-3 transform rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M14 7l-5 5 5 5V7z" /></svg>
                      </div>
                      <div className="h-[2px] flex-1 mx-4 bg-red-100" />
                      <div className="flex items-center gap-1 text-[10px] font-black text-red-600 uppercase tracking-tighter">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M14 7l-5 5 5 5V7z" /></svg>
                        <span className="bg-white px-1">EXIT</span>
                        <div className="w-1.5 h-6 bg-red-600 rounded-sm" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center w-full justify-between">
                    {/* Left Side Seats */}
                    <div className="flex gap-2.5">
                      {leftCols.map(c => (
                        <button
                          key={c}
                          onClick={() => !isSeatBooked(rowNum, c) && toggleSeat(`${rowNum}${c}`)}
                          className={`w-10 h-11 rounded-sm border transition-all flex items-center justify-center text-[10px] font-bold relative group ${getSeatColor(rowNum, c)}`}
                        >
                          {isSeatBooked(rowNum, c) ? (
                            <div className="absolute inset-0 flex items-center justify-center opacity-60">
                              <div className="absolute w-[1.5px] h-full bg-gray-400 rotate-45" />
                              <div className="absolute w-[1.5px] h-full bg-gray-400 -rotate-45" />
                            </div>
                          ) : (
                            <span className="group-hover:scale-110 transition-transform">
                              {selectedSeats.includes(`${rowNum}${c}`) ? '✓' : ''}
                            </span>
                          )}
                          {isFirstRow && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-600 rounded-full -mt-0.5 -mr-0.5 shadow-sm" />}
                        </button>
                      ))}
                    </div>

                    {/* Row Number */}
                    <span className="text-[12px] font-black text-gray-200 w-12 text-center select-none">{rowNum}</span>

                    {/* Right Side Seats */}
                    <div className="flex gap-2.5">
                      {rightCols.map(c => (
                        <button
                          key={c}
                          onClick={() => !isSeatBooked(rowNum, c) && toggleSeat(`${rowNum}${c}`)}
                          className={`w-10 h-11 rounded-sm border transition-all flex items-center justify-center text-[10px] font-bold relative group ${getSeatColor(rowNum, c)}`}
                        >
                          {isSeatBooked(rowNum, c) ? (
                            <div className="absolute inset-0 flex items-center justify-center opacity-60">
                              <div className="absolute w-[1.5px] h-full bg-gray-400 rotate-45" />
                              <div className="absolute w-[1.5px] h-full bg-gray-400 -rotate-45" />
                            </div>
                          ) : (
                            <span className="group-hover:scale-110 transition-transform">
                               {selectedSeats.includes(`${rowNum}${c}`) ? '✓' : ''}
                            </span>
                          )}
                          {isFirstRow && !isSeatBooked(rowNum, c) && <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-red-600 rounded-full -mt-0.5 -ml-0.5 shadow-sm" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Row Gap */}
                  <div className="h-1.5" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Realistic Tail Design */}
        <div className="w-full relative py-12 flex flex-col items-center">
          {/* Main Body Transition */}
          <div className="absolute top-0 left-0 w-full h-[200px] bg-white border-x-8 border-gray-100 z-10" />

          <div className="relative w-full flex justify-center items-end">
            {/* Red Side Fins (Horizontal Stabilizers) */}
            <div className="absolute bottom-[100px] left-[-60px] w-48 h-64 bg-[#e60000] shadow-2xl z-20"
              style={{ clipPath: 'polygon(100% 0%, 20% 100%, 100% 100%)' }} />
            <div className="absolute bottom-[100px] right-[-60px] w-48 h-64 bg-[#e60000] shadow-2xl z-20"
              style={{ clipPath: 'polygon(0% 0%, 80% 100%, 0% 100%)' }} />

            {/* Tapered Fuselage Cone */}
            <div
              className="w-[450px] h-[550px] bg-white shadow-2xl border-x-8 border-b-8 border-gray-100 z-30"
              style={{ clipPath: 'polygon(0% 0%, 100% 0%, 55% 100%, 45% 100%)' }}
            />

            {/* Gray Vertical Fin (Vertical Stabilizer) */}
            <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 w-14 h-[420px] bg-gradient-to-b from-gray-300 to-gray-400 rounded-full border-t-4 border-gray-200 z-40 shadow-xl opacity-90 transition-transform duration-500 hover:scale-y-105 origin-bottom" />
          </div>

          {/* Subtle exhaust aura */}
          <div className="mt-[-20px] w-32 h-32 bg-gray-200/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default AirplaneSeatMap;
