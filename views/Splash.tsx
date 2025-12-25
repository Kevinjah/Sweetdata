
import React from 'react';

const Splash: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#fff_0%,_#f2f2f2_100%)]" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-black rotate-45 flex items-center justify-center shadow-2xl mb-12 border-4 border-[#D40000]">
          <span className="text-white font-luxury text-4xl -rotate-45">SD</span>
        </div>
        
        <h1 className="text-4xl font-luxury tracking-[0.3em] text-black">
          SWEET<span className="text-[#D40000]">DATA</span>
        </h1>
        <p className="text-neutral-400 mt-4 text-[10px] tracking-[0.4em] uppercase font-bold">
          High Fidelity Full-Tunnel
        </p>
      </div>

      <div className="absolute bottom-20 flex flex-col items-center w-full px-12">
        <div className="w-full h-[1px] bg-neutral-100 relative">
          <div className="absolute top-0 left-0 h-full bg-[#D40000] animate-progress shadow-[0_0_10px_#D40000]" style={{ width: '40%' }} />
        </div>
        <div className="mt-4 flex justify-between w-full">
          <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">Protocol 1.0</span>
          <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">WireGuard V2</span>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { left: -40%; width: 40%; }
          50% { width: 60%; }
          100% { left: 100%; width: 40%; }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Splash;
