
import React from 'react';
import { UserData } from '../types';

interface BundlesProps {
  user: UserData | null;
}

const Bundles: React.FC<BundlesProps> = ({ user }) => {
  const bundles = [
    { id: '3d', name: 'Elite Passage', duration: '3 Days', price: '62 KES', highlight: 'Unlimited Data' },
    { id: '14d', name: 'Premium Voyage', duration: '14 Days', price: '250 KES', highlight: 'Full Support', popular: true },
    { id: '30d', name: 'Legacy Horizon', duration: '30 Days', price: '530 KES', highlight: 'Platinum Nodes' },
  ];

  return (
    <div className="h-full bg-white flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="mt-4 mb-10">
        <h1 className="text-3xl font-luxury text-black mb-2">Acquire<br/><span className="text-[#D40000]">Encryption</span></h1>
        <p className="text-neutral-400 text-xs font-medium tracking-wide">Select a premium bandwidth lease.</p>
      </div>

      <div className="space-y-6 pb-12">
        {bundles.map((b) => (
          <div key={b.id} className={`relative p-8 rounded-[2rem] border transition-all ${b.popular ? 'bg-black text-white shadow-2xl border-transparent scale-[1.02]' : 'bg-neutral-50 border-neutral-100 text-black'}`}>
            {b.popular && (
              <span className="absolute -top-3 left-8 bg-[#D40000] text-white text-[9px] font-bold px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg">
                Most Chosen
              </span>
            )}
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`text-lg font-luxury ${b.popular ? 'text-white' : 'text-black'}`}>{b.name}</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${b.popular ? 'text-[#D40000]' : 'text-neutral-400'}`}>{b.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-luxury">{b.price}</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {['Full-Tunnel WireGuard', 'Military AES-256', b.highlight].map((feature, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className={`text-[8px] ${b.popular ? 'text-[#D40000]' : 'text-black'}`}>●</span>
                  <span className={`text-xs font-medium ${b.popular ? 'text-neutral-400' : 'text-neutral-600'}`}>{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
              b.popular ? 'bg-white text-black shadow-xl active:scale-95' : 'bg-black text-white active:scale-95'
            }`}>
              Secure Lease
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bundles;
