
import React, { useState, useEffect } from 'react';
import { AppScreen, UserData, VpnStatus, AdConfig } from './types';
import Splash from './views/Splash';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import Bundles from './views/Bundles';
import Tasks from './views/Tasks';
import Leaderboard from './views/Leaderboard';
import SweetBot from './views/SweetBot';
import Profile from './views/Profile';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [user, setUser] = useState<UserData | null>(null);
  const [vpnStatus, setVpnStatus] = useState<VpnStatus>(VpnStatus.DISCONNECTED);
  const [adConfig, setAdConfig] = useState<AdConfig>({
    enabled: true,
    bannerId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialId: '',
    rewardedId: '',
    dailyLoginAdGated: true,
    referralAdGated: true,
    maxDailyAds: 4,
    adRewardMB: 5
  });

  useEffect(() => {
    // Fetch Ad Configuration from Backend: http://161.35.76.106:8080/api/ads/config
    // For now using default state as simulation
    const timer = setTimeout(() => {
      setScreen(AppScreen.LOGIN);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (userData: UserData) => {
    // FIX: userData already correctly matches UserData interface including dailyAdsWatched
    setUser(userData);
    setScreen(AppScreen.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setScreen(AppScreen.LOGIN);
    setVpnStatus(VpnStatus.DISCONNECTED);
  };

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.SPLASH:
        return <Splash />;
      case AppScreen.LOGIN:
      case AppScreen.REGISTER:
        return <Auth mode={screen === AppScreen.LOGIN ? 'login' : 'register'} onAuthSuccess={handleLogin} onSwitchMode={() => setScreen(screen === AppScreen.LOGIN ? AppScreen.REGISTER : AppScreen.LOGIN)} />;
      case AppScreen.DASHBOARD:
        return <Dashboard user={user} vpnStatus={vpnStatus} setVpnStatus={setVpnStatus} />;
      case AppScreen.BUNDLES:
        return <Bundles user={user} />;
      case AppScreen.TASKS:
        return <Tasks user={user} adConfig={adConfig} setUser={setUser} />;
      case AppScreen.LEADERBOARD:
        return <Leaderboard />;
      case AppScreen.CHAT:
        return <SweetBot />;
      case AppScreen.PROFILE:
        return <Profile user={user} onLogout={handleLogout} />;
      default:
        return <Dashboard user={user} vpnStatus={vpnStatus} setVpnStatus={setVpnStatus} />;
    }
  };

  const showNav = screen !== AppScreen.SPLASH && screen !== AppScreen.LOGIN && screen !== AppScreen.REGISTER;

  return (
    <div className="flex flex-col h-screen w-full bg-white max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <main className="flex-1 overflow-y-auto no-scrollbar bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {renderScreen()}
        </div>
        
        {/* Persistent Banner Ad Slot controlled by Backend */}
        {showNav && adConfig.enabled && (
          <div className="w-full bg-neutral-50 border-t border-neutral-100 py-2 flex flex-col items-center justify-center">
            <span className="text-[7px] text-neutral-300 font-bold uppercase mb-1">Sponsored Content</span>
            <div className="w-[320px] h-[50px] bg-neutral-100 flex items-center justify-center border border-neutral-200 rounded text-[10px] text-neutral-400 font-mono italic">
              AdMob Banner Instance
            </div>
          </div>
        )}
      </main>
      {showNav && <Navigation currentScreen={screen} setScreen={setScreen} />}
    </div>
  );
};

export default App;
