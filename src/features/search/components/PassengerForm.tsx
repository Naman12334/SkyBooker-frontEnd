import React, { useState, useEffect } from 'react';
import { Plane, ChevronDown, ChevronRight, User, Globe, Calendar, CreditCard } from 'lucide-react';
import { PassengerType } from '../../../shared/api/passengerApi';

interface PassengerFormProps {
  onSubmit: () => void;
  flight: any;
  airline: string;
}

interface PassengerDetail {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  passportNumber: string;
  nationality: string;
  passportExpiry: string;
  passengerType: PassengerType;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ onSubmit, flight, airline }) => {
  const [numPassengers, setNumPassengers] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetail[]>([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Contact info, 2: Passenger details

  useEffect(() => {
    // Initialize or adjust passenger details array when numPassengers changes
    const details = [...passengerDetails];
    if (details.length < numPassengers) {
      for (let i = details.length; i < numPassengers; i++) {
        details.push({
          title: 'Mr',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: 'MALE',
          passportNumber: '',
          nationality: 'Indian',
          passportExpiry: '',
          passengerType: PassengerType.ADULT
        });
      }
    } else if (details.length > numPassengers) {
      details.splice(numPassengers);
    }
    setPassengerDetails(details);
  }, [numPassengers]);

  const handleDetailChange = (index: number, field: keyof PassengerDetail, value: any) => {
    const updated = [...passengerDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerDetails(updated);
  };

  const handleSubmit = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    // Save to local storage
    const formData = {
      email,
      phone,
      passengers: numPassengers,
      passengerDetails
    };
    localStorage.setItem('bookingFormData', JSON.stringify(formData));
    onSubmit();
  };

  return (
    <div className="relative z-0 -mt-6 perspective-1000">
      <div className="bg-white/40 backdrop-blur-xl rounded-b-[3rem] p-1.5 border-x border-b border-white/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] animate-in slide-in-from-top-5 duration-700 ease-out">
        <div className="bg-white rounded-b-[2.8rem] overflow-hidden flex flex-col lg:flex-row border border-gray-100/50 relative">
          
          {/* Ticket Left Section: Flight Info */}
          <div className="flex-[1.5] p-10 bg-gradient-to-br from-white to-blue-50/30 relative overflow-hidden border-r border-gray-100/50">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none rotate-12 scale-150">
               <Plane size={400} />
            </div>

            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 rotate-3 transition-transform duration-500">
                    <Plane size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-medium text-blue-600 uppercase tracking-[0.3em] leading-none mb-1">{airline}</span>
                    <span className="text-xl font-normal text-gray-900 tracking-tighter uppercase">Boarding Pass</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 py-6 border-y border-dashed border-gray-200">
                <div className="flex flex-col">
                  <span className="text-[9px] font-normal text-blue-500 uppercase tracking-widest mb-1">Origin</span>
                  <span className="text-3xl font-normal text-gray-900 tracking-tighter">{flight?.departure?.code || 'GZB'}</span>
                </div>

                <div className="flex flex-col items-center flex-1">
                  <div className="relative w-full flex items-center justify-center">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent flex items-center justify-center">
                          <Plane size={14} className="text-blue-600 bg-white px-1" />
                      </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-normal text-blue-500 uppercase tracking-widest mb-1">Destination</span>
                  <span className="text-3xl font-normal text-gray-900 tracking-tighter">{flight?.arrival?.code || 'NMB'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                      <span className="text-[9px] font-normal text-gray-400 uppercase tracking-widest mb-1">Departure</span>
                      <span className="text-base font-normal text-gray-800">{flight?.departure?.time || '11:55 AM'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                      <span className="text-[9px] font-normal text-gray-400 uppercase tracking-widest mb-1">Flight ID</span>
                      <span className="text-base font-normal text-gray-800">SKB-442</span>
                  </div>
              </div>

              <div className="mt-4 p-4 bg-blue-600/5 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 text-blue-600 mb-2">
                  <User size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Booking Status</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Step {currentStep} of 2</span>
                  <div className="flex gap-1">
                    <div className={`w-8 h-1 rounded-full ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    <div className={`w-8 h-1 rounded-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-[3] p-10 bg-white relative">
            <div className="flex flex-col gap-6 h-full overflow-y-auto max-h-[500px] pr-2">
              <div className="flex flex-col gap-1">
                  <h4 className="text-xl font-normal text-gray-900 tracking-tighter uppercase">
                    {currentStep === 1 ? 'Contact Information' : 'Passenger Details'}
                  </h4>
                  <p className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">
                    {currentStep === 1 ? 'Start with your contact details' : `Details for ${numPassengers} traveler(s)`}
                  </p>
              </div>

              {currentStep === 1 ? (
                <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-normal text-blue-600 uppercase tracking-widest ml-1">Number of Passengers</label>
                        <div className="relative">
                            <select 
                              value={numPassengers}
                              onChange={(e) => setNumPassengers(parseInt(e.target.value))}
                              className="appearance-none w-full bg-gray-50 border border-gray-100 focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 text-sm font-normal text-gray-800 transition-all outline-none"
                            >
                                <option value="1">01 Adult</option>
                                <option value="2">02 Adults</option>
                                <option value="3">03 Adults</option>
                                <option value="4">04 Adults</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-normal text-blue-600 uppercase tracking-widest ml-1">Email Address</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com" 
                            className="bg-gray-50 border border-gray-100 focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 text-sm font-normal text-gray-800 transition-all outline-none shadow-sm" 
                          />
                      </div>
                      <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-normal text-blue-600 uppercase tracking-widest ml-1">Contact Phone</label>
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 000 000 0000" 
                            className="bg-gray-50 border border-gray-100 focus:border-blue-600/20 focus:bg-white rounded-2xl px-6 py-4 text-sm font-normal text-gray-800 transition-all outline-none shadow-sm" 
                          />
                      </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500">
                  {passengerDetails.map((passenger, idx) => (
                    <div key={idx} className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex flex-col gap-6 relative">
                      <div className="absolute -top-3 left-6 px-4 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                        Traveler {idx + 1}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Title</label>
                          <select 
                            value={passenger.title}
                            onChange={(e) => handleDetailChange(idx, 'title', e.target.value)}
                            className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500/30"
                          >
                            <option value="Mr">Mr.</option>
                            <option value="Ms">Ms.</option>
                            <option value="Mrs">Mrs.</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                          <input 
                            type="text" 
                            value={passenger.firstName}
                            onChange={(e) => handleDetailChange(idx, 'firstName', e.target.value)}
                            placeholder="First Name"
                            className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500/30"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                          <input 
                            type="text" 
                            value={passenger.lastName}
                            onChange={(e) => handleDetailChange(idx, 'lastName', e.target.value)}
                            placeholder="Last Name"
                            className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500/30"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                          <div className="relative">
                            <input 
                              type="date" 
                              value={passenger.dateOfBirth}
                              onChange={(e) => handleDetailChange(idx, 'dateOfBirth', e.target.value)}
                              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500/30"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                          <select 
                            value={passenger.gender}
                            onChange={(e) => handleDetailChange(idx, 'gender', e.target.value)}
                            className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500/30"
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Traveler Type</label>
                          <select 
                            value={passenger.passengerType}
                            onChange={(e) => handleDetailChange(idx, 'passengerType', e.target.value)}
                            className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500/30"
                          >
                            <option value={PassengerType.ADULT}>Adult (12+ yrs)</option>
                            <option value={PassengerType.CHILD}>Child (2-12 yrs)</option>
                            <option value={PassengerType.INFANT}>Infant (under 2 yrs)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Passport Number</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              value={passenger.passportNumber}
                              onChange={(e) => handleDetailChange(idx, 'passportNumber', e.target.value)}
                              placeholder="Passport #"
                              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500/30"
                            />
                            <CreditCard size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nationality</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              value={passenger.nationality}
                              onChange={(e) => handleDetailChange(idx, 'nationality', e.target.value)}
                              placeholder="Nationality"
                              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500/30"
                            />
                            <Globe size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-6 flex items-center justify-between gap-10">
                  {currentStep === 2 && (
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  
                  <div className="hidden sm:flex flex-col items-center gap-2">
                      <div className="flex gap-[2px]">
                          {Array.from({ length: 24 }).map((_, i) => (
                              <div key={i} className={`w-[1px] h-6 ${i % 4 === 0 ? 'bg-gray-800' : 'bg-gray-200'}`} />
                          ))}
                      </div>
                      <span className="text-[8px] font-normal text-gray-300 tracking-[0.4em] uppercase">SB-1155</span>
                  </div>

                  <button 
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:to-blue-600 text-white py-4 px-8 rounded-2xl text-[10px] font-normal uppercase tracking-[0.2em] shadow-xl shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-3"
                  >
                      {currentStep === 1 ? 'Next Details' : 'Finalize Seat'} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default PassengerForm;
