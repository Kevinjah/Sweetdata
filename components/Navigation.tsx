
import React from 'react';
import { AppScreen } from '../types';

interface NavigationProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, setScreen }) => {
  const navItems = [
    { screen: AppScreen.DASHBOARD, icon: '⚡', label: 'Nodes' },
    { screen: AppScreen.BUNDLES, icon: '💎', label: 'Lease' },
    { screen: AppScreen.TASKS, icon: '🎯', label: 'Earn' },
    { screen: AppScreen.CHAT, icon: '🤖', label: 'Concierge' },
    { screen: AppScreen.PROFILE, icon: '👤', label: 'Identity' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-t border-neutral-100 flex justify-around items-center py-5 px-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => (
        <button
          key={item.screen}
          onClick={() => setScreen(item.screen)}
          className={`flex flex-col items-center transition-all duration-300 flex-1 ${
            currentScreen === item.screen ? 'scale-105' : 'opacity-30 grayscale'
          }`}
        >
          <span className="text-xl mb-1">{item.icon}</span>
          <span className={`text-[8px] uppercase font-bold tracking-[0.2em] ${currentScreen === item.screen ? 'text-black' : 'text-neutral-500'}`}>
            {item.label}
          </span>
          {currentScreen === item.screen && (
            <div className="w-4 h-[2px] bg-[#D40000] mt-1.5 rounded-full" />
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
