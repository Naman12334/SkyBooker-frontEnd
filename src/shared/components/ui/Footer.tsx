import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-12 px-20">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-sky-700 font-black text-2xl tracking-tighter">
            SKYBOOKER
          </div>
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
            Premium Aviation Standards
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-sm font-bold text-gray-900 uppercase tracking-[0.2em]">
            Made by <span className="text-[#3333FF]">Kshitiz Jain</span>
          </p>
          <a 
            href="mailto:kshitizagrawal001@gmail.com" 
            className="text-[11px] text-gray-400 hover:text-[#3333FF] transition-colors font-bold tracking-widest uppercase"
          >
            kshitizagrawal001@gmail.com
          </a>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
        <p className="text-[9px] text-gray-300 uppercase font-bold tracking-widest">
          © 2026 Skybooker. All rights reserved.
        </p>
        <div className="flex gap-8">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
            <span key={link} className="text-[9px] text-gray-300 uppercase font-bold tracking-widest cursor-pointer hover:text-gray-900 transition-colors">
              {link}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
