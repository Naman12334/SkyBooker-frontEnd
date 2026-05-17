import React from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

const Testimonials: React.FC = () => {
  return (
    <section className="w-full flex flex-col bg-white">
      {/* Top Testimonial Section - Matching Second Image Layout */}
      <div className="w-full py-24 px-20 flex flex-col gap-6">
         <div className="flex flex-col gap-4">
            <p className="text-sm font-normal text-gray-800">
               This is why passengers love Skybooker
            </p>
            <h3 className="text-3xl md:text-4xl font-normal text-gray-900 leading-[1.3] max-w-5xl">
               Thank you to Skybooker for a great flight experience! Friendly service and on time flights made my trip very enjoyable. I would love to use Skybooker again in the future.
            </h3>
         </div>

         <div className="flex items-center justify-between w-full mt-10">
            {/* Passenger Info - Left */}
            <div className="flex items-center gap-4">
               <img 
                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" 
                 alt="Kianna Curtis" 
                 className="w-14 h-14 rounded-full object-cover"
               />
               <div className="flex flex-col">
                  <span className="font-medium text-base text-gray-900">Kianna Curtis</span>
                  <span className="font-normal text-gray-400 text-sm">Passengers</span>
               </div>
            </div>

            {/* Navigation - Right */}
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-6">
                  <ArrowLeft size={18} className="text-gray-300 cursor-pointer hover:text-gray-900 transition-colors" />
                  <span className="font-normal text-sm text-gray-900">1 / 8</span>
                  <ArrowRight size={18} className="text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" />
               </div>
            </div>
         </div>
      </div>

      {/* Bottom CTA Image Section - Full-bleed as per user request */}
      <div className="relative w-full h-[80vh] flex flex-col justify-center overflow-hidden">
         {/* Main Full-width Image */}
         <div className="absolute inset-0">
            <img 
               src="/images/Gemini_Generated_Image_lfcvx2lfcvx2lfcv.png" 
               alt="Airplane Wing over Mountains" 
               className="w-full h-full object-cover"
            />
            {/* Very light overlay for legibility if needed, but the image is mostly light */}
            <div className="absolute inset-0 bg-white/5" />
         </div>
         
         {/* Overlay Content - Positioned like the reference image */}
         <div className="relative z-10 px-24 flex flex-col justify-center h-full">
            <div className="max-w-4xl">
               <h2 className="text-5xl md:text-6xl font-normal text-gray-900 leading-[1.05] uppercase tracking-tighter">
                  FIND SPECIAL PRICES<br />
                  TO FAVORITE<br />
                  DESTINATIONS
               </h2>
               
               <div className="mt-12 flex flex-col gap-2">
                  <span className="text-gray-800 text-lg font-normal tracking-wide">Special Offers</span>
                  <span className="text-gray-900 text-4xl font-normal">40% Off Prices</span>
               </div>
            </div>
         </div>

         {/* Page Indicator Dots - Bottom Left */}
         <div className="absolute bottom-16 left-24 flex gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
         </div>

         {/* Blue Circle Arrow Button - Bottom Right */}
         <div className="absolute bottom-16 right-24">
            <button 
              className="w-24 h-24 bg-[#3d5afe] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
               <ArrowUpRight size={40} className="group-hover:rotate-45 transition-transform" />
            </button>
         </div>
      </div>
    </section>
  )
}

export default Testimonials
