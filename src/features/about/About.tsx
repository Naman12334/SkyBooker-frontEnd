import React, { useState, useEffect, useRef } from 'react'

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Set visible when section enters the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex flex-col items-center bg-white px-20 overflow-hidden"
    >
      {/* Background Image with entry scale animation */}
      <div
        className={`absolute inset-0 bg-cover bg-no-repeat transition-all duration-[1500ms] ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
        style={{
          backgroundImage: 'url("/images/Gemini_Generated_Image_e7dtcue7dtcue7dt.png")',
          backgroundPosition: 'center 80%'
        }}
      />

      {/* Top Text Content with staggered slide-up animation */}
      <div className="relative z-10 text-center max-w-4xl mt-[12vh]">
        <h2 className="text-2xl md:text-4xl font-normal tracking-tight leading-[1.4] uppercase text-black">
          <div className={`mb-1 transition-all duration-[800ms] ease-out delay-[200ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            SKYBOOKER IS NOT JUST AN AIRLINE,
          </div>

          <div className={`mb-1 transition-all duration-[800ms] ease-out delay-[400ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            WE ARE YOUR PARTNER <span className="text-gray-400 font-light">ON EVERY</span>
          </div>

          <div className={`flex items-center justify-center gap-3 mb-1 transition-all duration-[800ms] ease-out delay-[600ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            <span className="text-gray-400 font-light">JOURNEY</span>
            <span className="text-gray-400 font-light">TAKING YOU</span>
          </div>

          <div className={`text-gray-400 font-light mb-1 transition-all duration-[800ms] ease-out delay-[800ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            HIGHER FURTHER AND CLOSER
          </div>

          <div className={`text-gray-400 font-light transition-all duration-[800ms] ease-out delay-[1000ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
            TO YOUR DREAMS
          </div>
        </h2>
      </div>
    </section>
  )
}

export default About
