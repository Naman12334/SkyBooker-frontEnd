import React, { forwardRef, useState } from 'react';
import { Download, Plane, Mail, Loader2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { bookingApi } from '../../../shared/api/bookingApi';

interface BoardingPassReceiptProps {
  flight: any;
  completedBooking: any;
  formData: any;
  selectedSeats: string[];
  onClose: () => void;
  onDownload: () => void;
}

const BoardingPassReceipt = forwardRef<HTMLDivElement, BoardingPassReceiptProps>(
  ({ flight, completedBooking, formData, selectedSeats, onClose, onDownload }, ref) => {
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    if (!completedBooking) return null;

    const handleSendEmail = async () => {
      setIsSending(true);
      try {
        await bookingApi.sendNotification(completedBooking.bookingId);
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      } catch (error) {
        console.error("Failed to send manual notification", error);
        toast.error("Failed to send email. Please check backend services.");
      } finally {
        setIsSending(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        <div className="relative z-10 w-full max-w-4xl animate-in zoom-in-95 duration-500 perspective-1000">
           {/* Action Buttons */}
           <div className="flex justify-end gap-3 mb-4">
               <button 
                   onClick={handleSendEmail}
                   disabled={isSending || sent}
                   className={`backdrop-blur-md border px-5 py-2.5 rounded-xl flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg hover:scale-105 active:scale-95 ${sent ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'}`}
               >
                   {isSending ? <Loader2 size={14} className="animate-spin" /> : sent ? <Check size={14} /> : <Mail size={14} />}
                   {isSending ? 'Sending...' : sent ? 'Sent!' : 'Send Email'}
               </button>

               <button 
                   onClick={onDownload}
                   className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg hover:scale-105 active:scale-95"
               >
                   <Download size={14} /> Download Receipt
               </button>
           </div>

           <div ref={ref} className="bg-white rounded-[2.8rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
               {/* Ticket Left Section: Flight Info */}
               <div className="flex-[2.5] p-12 bg-gradient-to-br from-white to-green-50/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none rotate-12 scale-150">
                     <Plane size={400} />
                  </div>

                  <div className="relative z-10 flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-200 rotate-3">
                          <Plane size={24} className="text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-green-600 uppercase tracking-[0.3em] leading-none mb-1">{flight?.airline || 'SkyBooker'}</span>
                          <span className="text-2xl font-normal text-gray-900 tracking-tighter">BOARDING PASS</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="px-5 py-2 bg-green-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">CONFIRMED</div>
                        <span className="text-[10px] font-normal text-gray-400 mt-2 tracking-widest uppercase">Gate Closes at {flight?.departure?.time || '11:15'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-8 py-8 border-y border-dashed border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-normal text-green-500 uppercase tracking-widest mb-2">Origin</span>
                        <span className="text-4xl font-normal text-gray-900 tracking-tighter">{flight?.departure?.code || 'GZB'}</span>
                        <span className="text-sm font-normal text-gray-500 mt-1">Departure City</span>
                      </div>

                      <div className="flex flex-col items-center flex-1">
                        <div className="relative w-full flex items-center justify-center">
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent flex items-center justify-center">
                                <div className="bg-white p-2 rounded-full border border-gray-100 shadow-sm">
                                    <Plane size={16} className="text-green-600" />
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-normal text-gray-300 mt-4 uppercase tracking-[0.4em]">{flight?.duration || '1h 05m'} Non-stop</span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-normal text-green-500 uppercase tracking-widest mb-2">Destination</span>
                        <span className="text-4xl font-normal text-gray-900 tracking-tighter">{flight?.arrival?.code || 'NMB'}</span>
                        <span className="text-sm font-normal text-gray-500 mt-1">Arrival City</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-1">PNR Number</span>
                            <span className="text-lg font-bold text-gray-800">{completedBooking.pnrCode || '#AQ-29188'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-1">Departure</span>
                            <span className="text-lg font-normal text-gray-800">{flight?.departure?.time || '11:55 AM'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-1">Flight ID</span>
                            <span className="text-lg font-normal text-gray-800">SKB-{flight?.id || '442'}</span>
                        </div>
                    </div>
                  </div>
               </div>

               <div className="hidden lg:flex flex-col justify-between py-6 relative z-20 bg-white">
                  <div className="w-8 h-8 bg-gray-500/10 rounded-full -mt-10 -ml-4 shadow-inner" />
                  <div className="flex-1 border-r-2 border-dashed border-gray-200 mx-auto my-2" />
                  <div className="w-8 h-8 bg-gray-500/10 rounded-full -mb-10 -ml-4 shadow-inner" />
               </div>

               <div className="flex-[2] p-12 bg-white relative">
                 <div className="flex flex-col gap-8 h-full">
                   <div className="flex flex-col gap-2">
                       <h4 className="text-xl font-normal text-gray-900 tracking-tighter uppercase">Traveler Details</h4>
                       <p className="text-xs font-normal text-gray-400 uppercase tracking-widest leading-none">Your receipt & booking summary</p>
                   </div>

                   <div className="flex flex-col gap-4">
                       <div className="flex justify-between border-b border-gray-50 pb-2">
                           <span className="text-xs font-medium text-gray-500">Travelers ({formData?.passengers || 1})</span>
                           <div className="flex flex-col items-end gap-1">
                               {formData?.passengerDetails ? (
                                   formData.passengerDetails.map((p: any, i: number) => (
                                       <span key={i} className="text-[11px] font-bold text-gray-900">
                                           {p.title}. {p.firstName} {p.lastName}
                                       </span>
                                   ))
                               ) : (
                                   <span className="text-sm font-bold text-gray-900">{formData?.name || 'User'}</span>
                               )}
                           </div>
                       </div>
                       <div className="flex justify-between border-b border-gray-50 pb-2">
                           <span className="text-xs font-medium text-gray-500">Seats ({selectedSeats.length})</span>
                           <span className="text-sm font-bold text-gray-900">{selectedSeats.join(', ')}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-50 pb-2">
                           <span className="text-xs font-medium text-gray-500">Payment ID</span>
                           <span className="text-sm font-mono text-gray-900">{completedBooking.paymentId || 'N/A'}</span>
                       </div>
                       <div className="flex justify-between pt-2">
                           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Paid</span>
                           <span className="text-xl font-bold text-green-600">₹{completedBooking.totalFare}</span>
                       </div>
                   </div>

                   <div className="mt-auto flex items-center justify-between gap-10">
                       <button 
                           onClick={onClose}
                           className="flex-1 bg-gradient-to-r from-gray-900 to-black hover:from-black text-white py-5 px-8 rounded-2xl text-[11px] font-normal uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-[1.03] active:scale-[0.97]"
                       >
                           Done
                       </button>
                   </div>
                 </div>
               </div>

           </div>
        </div>
      </div>
    );
  }
);

BoardingPassReceipt.displayName = 'BoardingPassReceipt';

export default BoardingPassReceipt;
