
import React, { useState, useEffect } from 'react';
import { UserData, VpnStatus } from '../types';

interface DashboardProps {
  user: UserData | null;
  vpnStatus: VpnStatus;
  setVpnStatus: (status: VpnStatus) => void;
}

const BACKEND_URL = 'http://161.35.76.106:8080';

const Dashboard: React.FC<DashboardProps> = ({ user, vpnStatus, setVpnStatus }) => {
  const [sessionData, setSessionData] = useState({
    speed: '0.0',
    ping: '24ms',
    totalUsed: '0.0 MB'
  });

  const establishConnection = async (retries = 2): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${BACKEND_URL}/api/tunnel/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${user?.authToken || 'anonymous'}`
        },
        body: JSON.stringify({ deviceId: 'system-main', mode: 'full-tunnel' }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (e) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return establishConnection(retries - 1);
      }
      throw e;
    }
  };

  const terminateConnection = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/tunnel/disconnect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user?.authToken}` }
      });
    } catch (e) {}
    setVpnStatus(VpnStatus.DISCONNECTED);
  };

  const toggleVpn = async () => {
    if (vpnStatus === VpnStatus.DISCONNECTED) {
      setVpnStatus(VpnStatus.HANDSHAKE);
      try {
        const success = await establishConnection();
        if (success) setTimeout(() => setVpnStatus(VpnStatus.CONNECTED), 1000);
        else throw new Error();
      } catch (e) {
        setVpnStatus(VpnStatus.ERROR);
        setTimeout(() => setVpnStatus(VpnStatus.DISCONNECTED), 2000);
      }
    } else {
      terminateConnection();
    }
  };

  useEffect(() => {
    let interval: any;
    if (vpnStatus === VpnStatus.CONNECTED) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/tunnel/status`, {
            headers: { 'Authorization': `Bearer ${user?.authToken}` }
          });
          if (response.ok) {
            const data = await response.json();
            setSessionData({
              speed: data.currentSpeed || '0.0',
              ping: data.ping || '24ms',
              totalUsed: data.totalUsed || '0.0 MB'
            });
          }
        } catch (e) {}
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [vpnStatus, user?.authToken]);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-full blur-[100px] -mr-32 -mt-32" />
      
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

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="relative group">
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
              : vpnStatus === VpnStatus.ERROR ? 'bg-neutral-800' : 'bg-white border-2 border-neutral-100 shadow-xl'
            }`}
          >
            <div className={`mb-3 transition-transform duration-500 ${vpnStatus === VpnStatus.HANDSHAKE ? 'animate-spin' : ''}`}>
               {vpnStatus === VpnStatus.CONNECTED ? (
                 <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                 </svg>
               ) : (
                 <svg className={`w-14 h-14 ${vpnStatus === VpnStatus.HANDSHAKE ? 'text-[#D40000]' : vpnStatus === VpnStatus.ERROR ? 'text-red-500' : 'text-neutral-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
               )}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-[0.4em] ${vpnStatus === VpnStatus.CONNECTED ? 'text-white' : 'text-neutral-400'}`}>
              {vpnStatus}
            </span>
          </button>
        </div>

        <div className="mt-12 w-full max-w-xs glass-card rounded-[2.5rem] p-7 border border-neutral-100 shadow-sm">
           <div className="flex justify-between mb-5 pb-5 border-b border-neutral-50">
             <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Tunnel</span>
             <span className="text-[10px] font-bold text-[#D40000] uppercase font-mono">Full Device Internet</span>
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

      <div className="px-6 pb-12 flex justify-center opacity-40">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-black">AES-256 Hardware Encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
