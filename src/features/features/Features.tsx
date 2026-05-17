import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import Button from '../../shared/components/ui/Button'

const Features: React.FC = () => {
  return (
    <section className="relative w-full h-[120vh] bg-white flex items-start overflow-hidden pt-32">
      {/* Background Plane (Top-down view on the left/center) */}
      <div 
        className="absolute inset-0 w-full h-full bg-contain bg-no-repeat z-0 pointer-events-none opacity-90"
        style={{ 
          backgroundImage: 'url("/images/3rd page.png")', 
          backgroundPosition: '-5% -10%',
          transform: 'scale(0.9)' 
        }}
      />

      <div className="relative z-10 w-full px-40 flex justify-end">
        {/* Right-aligned Content Area */}
        <div className="flex flex-col gap-10 max-w-2xl text-right items-end">
           <h2 className="text-5xl md:text-6xl font-light text-gray-900 leading-[1.2] uppercase tracking-tight">
              More fun and efficient <br />
              <span className="font-normal text-blue-600">with Skybooker</span>
           </h2>
           
           <p className="text-gray-500 text-base font-normal leading-relaxed max-w-lg">
              By using our flights, you will experience unmatched travel speed and comfort, while having easy access to destinations around the world. Our dedicated team ensures every journey is safe and enjoyable.
           </p>

           <div className="flex flex-col gap-6 mt-2 items-end">
              {[
                'Skybooker provides great travel flexibility',
                'Comfortable facilities and services',
                'Friendly and kind flight attendants'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group justify-end">
                   <span className="text-gray-400 font-light text-base group-hover:text-blue-500 transition-colors uppercase tracking-wider">{item}</span>
                   <div className="bg-blue-50 rounded-full p-1.5 border border-blue-100 group-hover:bg-blue-600 transition-colors">
                     <CheckCircle2 size={18} className="text-blue-600 group-hover:text-white" />
                   </div>
                </div>
              ))}
           </div>

           <div className="flex gap-4 mt-4">
              <Button 
                className="w-fit rounded-none border-b-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 px-8"
              >
                Learn More
              </Button>
           </div>
        </div>
      </div>
    </section>
  )
}

export default Features
