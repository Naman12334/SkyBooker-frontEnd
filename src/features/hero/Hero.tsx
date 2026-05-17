import React, { useState, useEffect } from 'react'
import { Camera as Instagram, Share2 as Facebook, X as Twitter, Play as Youtube, ArrowDown } from 'lucide-react'

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[120vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat transition-transform duration-100 ease-out"
        style={{
          backgroundImage: 'url("/images/1st page.png")',
          backgroundPosition: 'center 80%',
          transform: `translateY(${scrollY * 0.4}px)`
        }}
      />

      {/* Main Content Area */}
      <div 
        className="relative z-10 w-full px-20 flex flex-col items-center h-full pt-20 transition-all duration-300"
        style={{
          opacity: Math.max(0, 1 - scrollY / 600),
          transform: `translateY(${scrollY * 0.15}px)`
        }}
      >

        {/* Hero Title with Scale effect */}
        <h1 
          className="text-[8rem] font-black leading-[1] tracking-[0.05em] select-none mt-0 
          bg-gradient-to-r from-blue-600 via-blue-500 to-blue-800 bg-clip-text text-transparent
          drop-shadow-[0_8px_15px_rgba(51,51,255,0.2)]
          transition-all duration-1000 ease-in-out cursor-default uppercase"
          style={{
            transform: `scale(${Math.max(0.8, 1 - scrollY / 2000)})`,
          }}
        >
          SKYBOOKER
        </h1>

        {/* Bottom Area (Socials and Left Description) */}
        <div className="absolute top-[85vh] w-full px-20 flex justify-between items-end">
          {/* Left Description */}
          <div className="flex gap-4 items-start max-w-[300px]">
            <div className="bg-gray-100 p-2 rounded-full">
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-gray-600 leading-tight">
              Provides a visual representation of destinations, attractions, and activities.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, idx) => (
              <div key={idx} className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors cursor-pointer group">
                <Icon size={16} className="text-gray-600 group-hover:text-blue-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Moved Text Content and Button to Bottom */}
        <div className="absolute bottom-10 w-full px-20 flex flex-col items-center">
          {/* Text Content (formerly Top Text Content) */}
          <div className="w-full flex justify-between items-end mb-12">
            <p className="max-w-[200px] text-[10px] font-bold text-gray-800 leading-tight tracking-wider uppercase">
              A TEAM DEDICATED TO IMPROVING AVIATION STANDARDS
            </p>
            <p className="max-w-[200px] text-[10px] font-bold text-gray-800 leading-tight tracking-wider uppercase text-right">
              WITH OUR MODERN FLEET AND WELL-TRAINED CREW
            </p>
          </div>

          {/* Down Arrow Button */}
          <button className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center text-white border-[6px] border-gray-100 hover:rotate-12 transition-transform">
            <ArrowDown size={28} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
