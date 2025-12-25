
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

const BACKEND_URL = 'http://161.35.76.106:8080';

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

  const refreshUserData = async (token?: string) => {
    const activeToken = token || user?.authToken || localStorage.getItem('sd_token');
    if (!activeToken) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
        headers: { 
          'Authorization': `Bearer ${activeToken}`,
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      if (response.ok) {
        const userData = await response.json();
        setUser({ ...userData, authToken: activeToken });
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (e) {
      console.error('Profile sync failed:', e);
    }
  };

  /**
   * Resilient Ad Configuration Fetcher
   * Implements exponential backoff and protocol detection to handle CORS/Mixed-Content issues.
   */
  const fetchAdConfig = async (retries = 5, delay = 1000): Promise<void> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Check for Mixed Content issues (HTTPS site requesting HTTP IP)
      const isSecureOrigin = window.location.protocol === 'https:';
      const targetUrl = isSecureOrigin && BACKEND_URL.startsWith('http:') 
        ? BACKEND_URL.replace('http:', 'https:') // Attempt upgrade if origin is secure
        : BACKEND_URL;

      const response = await fetch(`${targetUrl}/api/ads/config?nocache=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal,
        // Using "omit" credentials helps avoid some CORS preflight triggers for simple GETs
        credentials: 'omit' 
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setAdConfig(data);
        console.debug('Ad configuration synchronized successfully.');
      } else {
        throw new Error(`Protocol response: ${response.status}`);
      }
    } catch (e: any) {
      if (retries > 0) {
        // Exponential backoff
        const nextDelay = delay * 2;
        console.warn(`Sync attempt failed. Re-initiating in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchAdConfig(retries - 1, nextDelay);
      }
      
      // Fallback gracefully without throwing a permanent error to the UI
      console.info('Ad server unreachable or blocked. Operating with local secure defaults.');
    }
  };

  useEffect(() => {
    const initApp = async () => {
      // Start configuration sync
      fetchAdConfig();

      // Validate session
      const savedToken = localStorage.getItem('sd_token');
      if (savedToken) {
        await refreshUserData(savedToken);
        setScreen(AppScreen.DASHBOARD);
      } else {
        // Allow splash to be seen
        setTimeout(() => setScreen(AppScreen.LOGIN), 2500);
      }
    };
    initApp();
  }, []);

  const handleLogin = (userData: UserData) => {
    if (userData.authToken) {
      localStorage.setItem('sd_token', userData.authToken);
    }
    setUser(userData);
    setScreen(AppScreen.DASHBOARD);
  };

  const handleLogout = async () => {
    if (user?.authToken) {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${user.authToken}`,
          'Accept': 'application/json'
        },
        mode: 'cors'
      }).catch(() => {});
    }
    localStorage.removeItem('sd_token');
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
        return <Bundles user={user} onPurchaseSuccess={() => refreshUserData()} />;
      case AppScreen.TASKS:
        return <Tasks user={user} adConfig={adConfig} setUser={setUser} onActionComplete={() => refreshUserData()} />;
      case AppScreen.LEADERBOARD:
        return <Leaderboard />;
      case AppScreen.CHAT:
        return <SweetBot user={user} />;
      case AppScreen.PROFILE:
        return <Profile user={user} onLogout={handleLogout} onProfileUpdate={() => refreshUserData()} />;
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
