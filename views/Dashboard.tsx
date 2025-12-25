
import React, { useState, useEffect } from 'react';
import { UserData, VpnStatus } from '../types';

interface DashboardProps {
  user: UserData | null;
  vpnStatus: VpnStatus;
  setVpnStatus: (status: VpnStatus) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, vpnStatus, setVpnStatus }) => {
  const [sessionData, setSessionData] = useState({
    speed: '0.0',
    ping: '24ms',
    totalUsed: '142.5 MB'
  });

  const toggleVpn = async () => {
    // In a real native environment, this would call a Kotlin bridge method: 
    // AndroidNative.toggleWireGuard()
    if (vpnStatus === VpnStatus.DISCONNECTED) {
      setVpnStatus(VpnStatus.HANDSHAKE);
      // Simulate backend validation & WireGuard handshake
      setTimeout(() => setVpnStatus(VpnStatus.CONNECTED), 2000);
    } else {
      setVpnStatus(VpnStatus.DISCONNECTED);
    }
  };

  useEffect(() => {
    let interval: any;
    if (vpnStatus === VpnStatus.CONNECTED) {
      interval = setInterval(() => {
        setSessionData(prev => ({
          ...prev,
          speed: (Math.random() * 8.5).toFixed(1),
          // Simulate real-time MB counting
          totalUsed: (parseFloat(prev.totalUsed) + (Math.random() * 0.1)).toFixed(1) + ' MB'
        }));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [vpnStatus]);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      {/* Premium Luxury Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-full blur-[100px] -mr-32 -mt-32" />
      
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Authenticated Node</h2>
          <h1 className="text-2xl font-luxury text-black leading-none">Sweet<span className="text-[#D40000]">Data</span></h1>
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-neutral-50 px-4 py-2 rounded-2xl flex items-center space-x-2 border border-neutral-100 shadow-sm">
            <span className="text-[9px] font-bold text-neutral-400 uppercase">Balance</span>
            <span className="text-xs font-bold text-black font-mono">{user?.balanceMB?.toLocaleString() || '0'} MB</span>
          </div>
        </div>
      </header>

      {/* Main VPN Power Hub */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="relative group">
          {/* Handshake Visualizer */}
          {vpnStatus === VpnStatus.CONNECTED && (
            <>
              <div className="ripple w-64 h-64" style={{ animationDelay: '0s' }} />
              <div className="ripple w-64 h-64" style={{ animationDelay: '0.6s' }} />
            </>
          )}

          <button
            onClick={toggleVpn}
            className={`w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-700 relative z-20 ${
              vpnStatus === VpnStatus.CONNECTED 
              ? 'bg-[#D40000] shadow-[0_20px_60px_rgba(212,0,0,0.3)]' 
              : 'bg-white border-2 border-neutral-100 shadow-xl'
            }`}
          >
            <div className={`mb-3 transition-transform duration-500 ${vpnStatus === VpnStatus.HANDSHAKE ? 'animate-spin' : ''}`}>
               {vpnStatus === VpnStatus.CONNECTED ? (
                 <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                 </svg>
               ) : (
                 <svg className={`w-14 h-14 ${vpnStatus === VpnStatus.HANDSHAKE ? 'text-[#D40000]' : 'text-neutral-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
               )}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${vpnStatus === VpnStatus.CONNECTED ? 'text-white' : 'text-neutral-400'}`}>
              {vpnStatus}
            </span>
          </button>
        </div>

        {/* Dynamic Stats Card */}
        <div className="mt-12 w-full max-w-xs glass-card rounded-[2.5rem] p-7 border border-neutral-100 shadow-sm">
           <div className="flex justify-between mb-5 pb-5 border-b border-neutral-50">
             <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Tunnel</span>
             <span className="text-[10px] font-bold text-[#D40000] uppercase font-mono">Full Device (WG)</span>
           </div>
           <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[9px] text-neutral-400 font-bold uppercase mb-1">Throughput</p>
                <p className="text-xl font-luxury text-black">{sessionData.speed} <span className="text-[10px] text-neutral-300 font-mono">MB/S</span></p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-neutral-400 font-bold uppercase mb-1">Data Used</p>
                <p className="text-xl font-luxury text-black">{sessionData.totalUsed.split(' ')[0]} <span className="text-[10px] text-neutral-300 font-mono">MB</span></p>
              </div>
           </div>
        </div>
      </div>

      {/* Static Footer Security Label */}
      <div className="px-6 pb-12 flex justify-center opacity-40">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-black">AES-256 WireGuard Hardware Encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
