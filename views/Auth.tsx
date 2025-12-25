
import React, { useState } from 'react';
import { UserData } from '../types';

interface AuthProps {
  mode: 'login' | 'register';
  onAuthSuccess: (user: UserData) => void;
  onSwitchMode: () => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onAuthSuccess, onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Backend Handshake to http://161.35.76.106:8080
    setTimeout(() => {
      // FIX: Added dailyAdsWatched to mockUser to match UserData interface
      const mockUser: UserData = {
        id: '123',
        username: email.split('@')[0],
        email: email,
        balanceMB: 500,
        plan: 'Silver Tier',
        expiryDate: '2025-10-15',
        referralCode: 'SD-' + Math.floor(Math.random() * 9000 + 1000),
        dailyAdsWatched: 0
      };
      onAuthSuccess(mockUser);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="h-full bg-white px-8 flex flex-col justify-center overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#D40000]" />
      
      <div className="mb-12 relative z-10">
        <h2 className="text-4xl font-luxury text-black mb-3">
          {mode === 'login' ? 'Authenticate' : 'Inaugurate'}
          <br />
          <span className="text-[#D40000] uppercase tracking-widest text-lg font-bold">Access Node</span>
        </h2>
        <p className="text-neutral-400 text-xs font-medium uppercase tracking-[0.1em]">Entering the SweetData Ecosystem.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="space-y-4">
          <div className="premium-border rounded-2xl bg-white overflow-hidden">
            <input
              type="email"
              placeholder="E-mail"
              required
              className="w-full p-5 text-sm focus:outline-none placeholder:text-neutral-300 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="premium-border rounded-2xl bg-white overflow-hidden">
            <input
              type="password"
              placeholder="Private Key / Password"
              required
              className="w-full p-5 text-sm focus:outline-none placeholder:text-neutral-300 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-white shadow-2xl active:scale-[0.98] transition-all disabled:bg-neutral-200 text-[10px]"
        >
          {loading ? 'Validating credentials...' : (mode === 'login' ? 'Establish Session' : 'Create Profile')}
        </button>
      </form>

      <div className="mt-10 text-center relative z-10">
        <button
          onClick={onSwitchMode}
          className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest hover:text-black transition-colors"
        >
          {mode === 'login' ? "Need a membership? Register" : "Existing member? Authenticate"}
        </button>
      </div>

      <div className="absolute bottom-12 left-0 w-full px-8 flex justify-center space-x-8">
        <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">Privacy Protocol</span>
        <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">End-to-End</span>
        <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">Support</span>
      </div>
    </div>
  );
};

export default Auth;
