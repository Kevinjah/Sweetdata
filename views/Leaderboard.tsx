
import React from 'react';

const Leaderboard: React.FC = () => {
  const players = [
    { rank: 1, name: 'Satoshi_N', score: '1.2m SWEET', status: 'Elite' },
    { rank: 2, name: 'CryptoKing', score: '980k SWEET', status: 'Platinum' },
    { rank: 3, name: 'RedDragon', score: '850k SWEET', status: 'Platinum' },
    { rank: 4, name: 'CyberGHOST', score: '720k SWEET', status: 'Gold' },
    { rank: 5, name: 'Anonymous', score: '640k SWEET', status: 'Gold' },
    { rank: 6, name: 'VoltVpn', score: '590k SWEET', status: 'Silver' },
    { rank: 7, name: 'User_492', score: '410k SWEET', status: 'Silver' },
  ];

  return (
    <div className="p-6 bg-black h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-luxury font-bold text-white uppercase tracking-tighter">GLOBAL<br/><span className="text-red-600">RANKS</span></h2>
        <p className="text-neutral-500 text-xs mt-1">Real-time leaderboard of top data miners.</p>
      </div>

      {/* Top 3 Podiums */}
      <div className="flex items-end justify-center space-x-2 mb-8 h-40">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-neutral-400 bg-neutral-800 mb-2 overflow-hidden flex items-center justify-center text-lg">🥈</div>
          <div className="w-full bg-neutral-800 h-20 rounded-t-xl flex flex-col items-center justify-center border-x border-t border-white/5">
            <span className="text-[10px] font-bold text-neutral-400">#2</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center scale-110">
          <div className="w-16 h-16 rounded-full border-2 border-red-600 bg-red-600/20 mb-2 overflow-hidden flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,0,0,0.5)]">🥇</div>
          <div className="w-full glossy-red h-28 rounded-t-xl flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-white">#1</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-orange-700 bg-neutral-800 mb-2 overflow-hidden flex items-center justify-center text-lg">🥉</div>
          <div className="w-full bg-neutral-800 h-16 rounded-t-xl flex flex-col items-center justify-center border-x border-t border-white/5">
            <span className="text-[10px] font-bold text-neutral-400">#3</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {players.map((p) => (
          <div key={p.rank} className="glass-card p-4 rounded-2xl flex items-center justify-between border-l-4 border-l-red-600/30">
            <div className="flex items-center space-x-4">
              <span className="text-neutral-600 font-luxury text-sm font-bold w-4">#{p.rank}</span>
              <div>
                <p className="text-sm font-bold text-white">{p.name}</p>
                <p className="text-[9px] text-red-500 uppercase font-bold tracking-widest">{p.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-luxury text-white">{p.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
