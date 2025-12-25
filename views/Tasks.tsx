
import React, { useState } from 'react';
import { UserData, Task, AdConfig } from '../types';

interface TasksProps {
  user: UserData | null;
  adConfig: AdConfig;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const Tasks: React.FC<TasksProps> = ({ user, adConfig, setUser }) => {
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const tasks: Task[] = [
    { id: 'ad1', title: 'Watch Ad & Earn MB', rewardMB: adConfig.adRewardMB, completed: false, isAdTask: true },
    { id: 'r1', title: 'Refer a Colleague', rewardMB: 20, completed: false },
    { id: 't1', title: 'Social Follow: TikTok', rewardMB: 15, completed: false },
    { id: 't2', title: 'Social Follow: Facebook', rewardMB: 15, completed: true },
    { id: 't3', title: 'App Feedback', rewardMB: 10, completed: false },
  ];

  const triggerAd = (onComplete: () => void) => {
    setPendingAction(() => onComplete);
    setShowAdOverlay(true);
    setAdProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setAdProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleAdComplete = () => {
    setShowAdOverlay(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const claimDailyBonus = () => {
    const action = () => {
      setDailyBonusClaimed(true);
      if (user) {
        setUser({ ...user, balanceMB: user.balanceMB + 10 });
      }
      alert("10MB Daily Bonus Claimed!");
    };

    if (adConfig.enabled && adConfig.dailyLoginAdGated) {
      triggerAd(action);
    } else {
      action();
    }
  };

  const handleReferralCopy = () => {
    const action = () => {
      navigator.clipboard.writeText(user?.referralCode || 'SD-UX-992');
      alert("Referral Link Generated & Copied!");
    };

    if (adConfig.enabled && adConfig.referralAdGated) {
      triggerAd(action);
    } else {
      action();
    }
  };

  const handleWatchAdTask = () => {
    if (user && user.dailyAdsWatched >= adConfig.maxDailyAds) {
      alert(`Daily limit reached. Max ${adConfig.maxDailyAds} ads per 24h.`);
      return;
    }

    const action = () => {
      if (user) {
        setUser({ 
          ...user, 
          balanceMB: user.balanceMB + adConfig.adRewardMB,
          dailyAdsWatched: (user.dailyAdsWatched || 0) + 1
        });
      }
      alert(`${adConfig.adRewardMB}MB Reward Credited!`);
    };

    triggerAd(action);
  };

  return (
    <div className="h-full bg-white flex flex-col p-6 overflow-y-auto no-scrollbar relative">
      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-luxury text-black mb-2 leading-none">Resource<br/><span className="text-[#D40000]">Acquisition</span></h1>
        <p className="text-neutral-400 text-xs font-medium tracking-wide">Earn bandwidth via the mission protocol.</p>
      </div>

      {/* Daily Bonus Card */}
      <div className="mb-6 p-6 rounded-[2rem] border-2 border-dashed border-neutral-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-black uppercase tracking-wider">Daily Protocol</h3>
          <p className="text-[10px] text-neutral-400 mt-1">Check in every 24 hours.</p>
        </div>
        <button 
          onClick={claimDailyBonus}
          disabled={dailyBonusClaimed}
          className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all ${
            dailyBonusClaimed ? 'bg-neutral-100 text-neutral-300' : 'bg-[#D40000] text-white active:scale-95'
          }`}
        >
          {dailyBonusClaimed ? 'Claimed' : adConfig.dailyLoginAdGated ? 'Watch Ad for 10MB' : '+10 MB'}
        </button>
      </div>

      {/* Referral Card */}
      <div className="bg-black text-white p-7 rounded-[2.5rem] shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D40000]/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D40000] mb-3">Invitation Link</p>
        <h3 className="text-xl font-luxury mb-5">Expand the Network</h3>
        <div className="flex items-center space-x-3 bg-neutral-900 p-4 rounded-2xl border border-white/5">
          <code className="flex-1 font-mono text-xs tracking-widest text-neutral-200">
            {adConfig.referralAdGated ? '••••••••' : (user?.referralCode || 'SD-UX-992')}
          </code>
          <button 
            onClick={handleReferralCopy}
            className="text-[10px] font-bold uppercase tracking-widest text-[#D40000] bg-white/5 px-4 py-2 rounded-xl"
          >
            {adConfig.referralAdGated ? 'Unlock link' : 'Copy'}
          </button>
        </div>
        <p className="text-[9px] text-neutral-500 mt-5 leading-relaxed font-bold uppercase tracking-[0.2em]">
          Both users receive <span className="text-white">20 MB</span> upon verified lease activation.
        </p>
      </div>

      <div className="space-y-4 pb-12">
        {tasks.map((t) => (
          <div key={t.id} className="glass-card p-5 rounded-3xl flex items-center justify-between border-l-4 border-l-[#D40000] shadow-sm">
            <div className="flex-1 mr-4">
              <h4 className="text-xs font-bold text-black mb-1 uppercase tracking-wider">{t.title}</h4>
              <p className="text-[10px] font-mono font-bold text-[#D40000]">+{t.rewardMB} MB</p>
              {t.isAdTask && user && (
                <p className="text-[8px] text-neutral-400 uppercase mt-1">Remaining: {adConfig.maxDailyAds - user.dailyAdsWatched}</p>
              )}
            </div>
            <button 
              disabled={t.completed || (t.isAdTask && user && user.dailyAdsWatched >= adConfig.maxDailyAds)}
              onClick={t.isAdTask ? handleWatchAdTask : undefined}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                t.completed ? 'bg-neutral-100 text-neutral-300' : 'bg-black text-white active:scale-95'
              }`}
            >
              {t.completed ? 'Success' : t.isAdTask ? 'Watch' : 'Process'}
            </button>
          </div>
        ))}
      </div>

      {/* Simulated Fullscreen Ad Overlay */}
      {showAdOverlay && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-xs aspect-[9/16] bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center bg-black/50 border-b border-white/5">
              <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Sponsored</span>
              {adProgress >= 100 && (
                <button 
                  onClick={handleAdComplete}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-[#D40000] rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                 <span className="text-white text-3xl">Ad</span>
              </div>
              <h4 className="text-white font-luxury text-xl mb-2">Luxury Lifestyle</h4>
              <p className="text-neutral-500 text-xs">Experience the ultimate encryption protocol with SweetData Premium Nodes.</p>
            </div>
            <div className="p-6">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#D40000] transition-all duration-300"
                  style={{ width: `${adProgress}%` }}
                />
              </div>
              <p className="text-[8px] text-center text-neutral-500 uppercase mt-2 tracking-widest">
                {adProgress < 100 ? `Reward in ${Math.ceil((100 - adProgress) / 20)}s` : 'Reward Ready'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
