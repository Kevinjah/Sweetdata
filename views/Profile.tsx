
import React from 'react';
import { UserData } from '../types';

interface ProfileProps {
  user: UserData | null;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="p-6 bg-white h-full flex flex-col overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center mt-8 mb-12">
        <div className="relative">
          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-neutral-50 to-neutral-200 p-1 mb-6 shadow-xl flex items-center justify-center border border-neutral-100">
            <div className="w-full h-full rounded-[2rem] bg-white flex items-center justify-center text-4xl shadow-inner">
              <span className="text-[#D40000] font-luxury">SD</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-xs border-4 border-white shadow-lg">
            <span className="text-white text-lg">✏️</span>
          </div>
        </div>
        <h2 className="text-2xl font-luxury text-black uppercase tracking-wider">{user?.username || 'GUEST'}</h2>
        <p className="text-[#D40000] font-bold text-[9px] tracking-[0.4em] uppercase mt-2">Certified Member</p>
      </div>

      <div className="flex-1 space-y-4">
        {[
          { label: 'Identified E-mail', value: user?.email || 'N/A' },
          { label: 'Current Subscription', value: user?.plan || 'Free Tier' },
          { label: 'Lease Expiration', value: user?.expiryDate || 'N/A' },
          { label: 'WireGuard Key (Ed25519)', value: 'WG-ED25...9X2' },
        ].map((item) => (
          <div key={item.label} className="glass-card p-5 rounded-3xl border border-neutral-50 flex justify-between items-center shadow-sm">
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{item.label}</span>
            <span className="text-xs font-bold text-black font-mono">{item.value}</span>
          </div>
        ))}

        <div className="pt-6 space-y-3">
          <button className="w-full glass-card p-5 rounded-3xl flex items-center justify-between hover:bg-neutral-50 transition-colors shadow-sm">
            <span className="text-[10px] text-black font-bold uppercase tracking-widest">Billing & Methods</span>
            <span className="text-xs">💳</span>
          </button>
          <button className="w-full glass-card p-5 rounded-3xl flex items-center justify-between hover:bg-neutral-50 transition-colors shadow-sm">
            <span className="text-[10px] text-black font-bold uppercase tracking-widest">VPN Key Management</span>
            <span className="text-xs">🔑</span>
          </button>
          <button className="w-full glass-card p-5 rounded-3xl flex items-center justify-between hover:bg-neutral-50 transition-colors shadow-sm">
            <span className="text-[10px] text-black font-bold uppercase tracking-widest">Concierge Support</span>
            <span className="text-xs">🎧</span>
          </button>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="mt-12 mb-6 w-full bg-black py-5 rounded-[2rem] text-white font-bold uppercase text-[10px] tracking-[0.4em] shadow-2xl active:scale-95 transition-all"
      >
        Terminate Session
      </button>

      <div className="text-center mb-10">
        <p className="text-[8px] text-neutral-300 uppercase tracking-[0.3em] font-bold">
          SweetData Premium Protocol v4.0.2
        </p>
      </div>
    </div>
  );
};

export default Profile;
