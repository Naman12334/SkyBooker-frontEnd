import React, { useState, useRef, useEffect } from 'react';
import { X, Info, Loader2 } from 'lucide-react';
import { bookingApi } from '../../shared/api/bookingApi';
import { passengerApi } from '../../shared/api/passengerApi';
import { seatApi, Seat, SeatStatus } from '../../shared/api/seatApi';
import { toPng } from 'html-to-image';
import { toast } from 'react-hot-toast';
import SeatLegend from './components/SeatLegend';
import AirplaneSeatMap from './components/AirplaneSeatMap';
import SeatFareFooter from './components/SeatFareFooter';
import BoardingPassReceipt from './components/BoardingPassReceipt';

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: any;
}

const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({ isOpen, onClose, flight }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<any>(null);
  const [seatMap, setSeatMap] = useState<Seat[]>([]);
  const boardingPassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && flight?.id) {
      seatApi.getSeatMap(flight.id).then(map => {
        setSeatMap(map);
      }).catch(err => console.error("Failed to load seat map", err));
    }
  }, [isOpen, flight?.id]);

  // Derived reserved seats from seatMap
  const reservedSeats = seatMap
    .filter(s => s.status === SeatStatus.CONFIRMED || s.status === SeatStatus.HELD)
    .map(s => s.seatNumber);

  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
  };

  const downloadBoardingPass = async () => {
    if (boardingPassRef.current) {
      try {
        const dataUrl = await toPng(boardingPassRef.current, { cacheBust: true, style: { transform: 'none' } });
        const link = document.createElement('a');
        link.download = `BoardingPass_${completedBooking?.pnrCode || 'Flight'}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download image', err);
        showToast('Failed to download receipt', 'error');
      }
    }
  };

  if (!isOpen) return null;

  const rows = 50;
  const leftCols = ['A', 'B', 'C'];
  const rightCols = ['D', 'E', 'F'];

  const formDataStr = localStorage.getItem('bookingFormData');
  const formData = formDataStr ? JSON.parse(formDataStr) : null;
  const numPassengers = parseInt(formData?.passengers || '1', 10);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      }
      if (prev.length >= numPassengers) {
        showToast(`You can only select ${numPassengers} seat(s) for this booking.`, 'error');
        return prev;
      }
      return [...prev, seatId];
    });
  };

  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) return;
    setIsBooking(true);
    try {
      // 1. Hold seats in backend first
      const userId = 1; // Mock user ID
      const selectedSeatIds = selectedSeats.map(num => 
        seatMap.find(s => s.seatNumber === num)?.seatId
      ).filter(id => id !== undefined) as number[];

      for (const seatId of selectedSeatIds) {
        try {
          await seatApi.holdSeat(seatId, userId);
        } catch (holdErr: any) {
          showToast(holdErr.response?.data || "One or more seats were just taken. Please refresh.", "error");
          setIsBooking(false);
          // Refresh seat map
          const newMap = await seatApi.getSeatMap(flight.id);
          setSeatMap(newMap);
          return;
        }
      }

      const basePricePerSeat = flight?.price || 450;
      const baseFare = selectedSeats.length * basePricePerSeat;
      const taxes = baseFare * 0.18;
      const totalFare = baseFare + taxes;

      const formDataStr = localStorage.getItem('bookingFormData');
      const formData = formDataStr ? JSON.parse(formDataStr) : null;

      const payload = {
        userId,
        flightId: flight?.id || 1,
        contactEmail: formData?.email || "user@example.com",
        contactPhone: formData?.phone || "+911234567890",
        baseFare,
        taxes,
        totalFare,
        tripType: "ONE_WAY",
        passengerIds: [1],
        seats: selectedSeats
      };

      const createdBooking = await bookingApi.createBooking(payload);
      
      const res = await loadRazorpay();
      if (!res) {
          showToast('Razorpay SDK failed to load. Are you online?', 'error');
          setIsBooking(false);
          return;
      }
      
      const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
          amount: Math.round(totalFare * 100), 
          currency: 'INR',
          name: 'SkyBooker',
          description: `Flight Booking ${createdBooking.pnrCode || 'PNR'}`,
          handler: async function (response: any) {
              try {
                  await bookingApi.updateBookingStatus(createdBooking.bookingId, 'CONFIRMED', selectedSeats.join(','));
                  
                  // Confirm seats in seat-service
                  for (const seatId of selectedSeatIds) {
                      await seatApi.confirmSeat(seatId);
                  }

                  // Create passengers in backend
                  const formDataStr = localStorage.getItem('bookingFormData');
                  const formData = formDataStr ? JSON.parse(formDataStr) : null;
                  const passengerDetails = formData?.passengerDetails || [];

                  if (passengerDetails.length > 0) {
                      for (let i = 0; i < passengerDetails.length; i++) {
                          const detail = passengerDetails[i];
                          try {
                              await passengerApi.addPassenger({
                                  ...detail,
                                  bookingId: createdBooking.bookingId,
                                  seatNumber: selectedSeats[i] || '',
                                  seatId: selectedSeatIds[i] || 0
                              });
                          } catch (pErr) {
                              console.error(`Failed to add passenger ${i+1}`, pErr);
                          }
                      }
                  }

                  showToast('Booking successful! Your seats have been confirmed.', 'success');
                  setCompletedBooking({ ...createdBooking, ...payload, paymentId: response.razorpay_payment_id });
              } catch (e) {
                  showToast('Payment successful but failed to update booking status.', 'error');
              } finally {
                  setIsBooking(false);
              }
          },
          prefill: {
              name: formData?.name || 'User',
              email: formData?.email || 'user@example.com',
              contact: formData?.phone || '9999999999',
              vpa: 'success@razorpay'
          },
          theme: {
              color: '#05203c'
          },
          method: {
              upi: true
          },
          modal: {
              ondismiss: function() {
                  setIsBooking(false);
                  showToast('Payment was cancelled.', 'error');
              }
          }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error('Booking failed', err);
      if (err.response?.status === 401) {
        showToast('Missing Authorization header. Please log in.', 'error');
      } else {
        showToast('Failed to book seats. Please try again.', 'error');
      }
      setIsBooking(false);
    }
  };

  const isSeatBooked = (row: number, col: string) => {
    return reservedSeats.includes(`${row}${col}`);
  };

  const getSeatColor = (row: number, col: string) => {
    const seatId = `${row}${col}`;
    if (selectedSeats.includes(seatId)) return 'bg-cyan-400 border-cyan-500 text-white';
    if (isSeatBooked(row, col)) return 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60';

    // Different types of seats based on rows
    if (row <= 4) return 'bg-purple-200 border-purple-300'; // Premium
    if (row === 12 || row === 13) return 'bg-blue-100 border-blue-200'; // Exit row / Extra legroom
    return 'bg-white border-gray-200';
  };



  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-gradient-to-b from-[#8EAFC1] via-[#ADC8D9] to-[#C0D6E2] w-full max-w-5xl h-full max-h-[90vh] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-700 ease-out">
        {/* Subtle clouds or atmospheric detail */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-white rounded-full blur-[150px]" />
        </div>

        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {flight?.departure?.code || 'GZB'} <span className="text-gray-400">→</span> {flight?.arrival?.code || 'NMB'}
            </h3>
            <p className="text-sm font-medium text-gray-500">
              {selectedSeats.length} of {numPassengers} Seat(s) Selected
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className={`font-bold text-sm tracking-wide ${selectedSeats.length === numPassengers ? 'text-green-500' : 'text-orange-500'}`}>
              {selectedSeats.length === numPassengers ? 'Ready to proceed' : 'Selection pending'}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          <SeatLegend />

          <AirplaneSeatMap 
             rows={rows}
             leftCols={leftCols}
             rightCols={rightCols}
             selectedSeats={selectedSeats}
             toggleSeat={toggleSeat}
             isSeatBooked={isSeatBooked}
             getSeatColor={getSeatColor}
          />
        </div>

        {/* Footer */}
        <SeatFareFooter
           flight={flight}
           selectedSeats={selectedSeats}
           isBooking={isBooking}
           onClose={onClose}
           onConfirm={handleConfirmBooking}
        />
      </div>

      <BoardingPassReceipt 
        ref={boardingPassRef}
        flight={flight}
        completedBooking={completedBooking}
        formData={formData}
        selectedSeats={selectedSeats}
        onClose={() => { setCompletedBooking(null); onClose(); }}
        onDownload={downloadBoardingPass}
      />


      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default SeatSelectionModal;
