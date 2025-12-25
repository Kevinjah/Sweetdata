
import React, { useState, useRef, useEffect } from 'react';
import { UserData, Message } from '../types';

interface SweetBotProps {
  user: UserData | null;
}

const BACKEND_URL = 'http://161.35.76.106:8080';

const SweetBot: React.FC<SweetBotProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Welcome to the SweetData Concierge. I am your personal digital attaché. How may I assist your voyage today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.authToken) return;
      try {
        const response = await fetch(`${BACKEND_URL}/api/chat/history`, {
          headers: { 'Authorization': `Bearer ${user.authToken}` }
        });
        if (response.ok) {
          const history = await response.json();
          if (history.length > 0) setMessages(history.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
        }
      } catch (e) {}
    };
    fetchHistory();
  }, [user?.authToken]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping || !user?.authToken) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.authToken}`
        },
        body: JSON.stringify({ message: input })
      });

      if (response.ok) {
        const data = await response.json();
        const modelMessage: Message = {
          id: data.id || (Date.now() + 1).toString(),
          role: data.role || 'model',
          text: data.text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, modelMessage]);
      }
    } catch (error) {
      console.error('Concierge Failure:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFDFD]">
      <div className="p-6 bg-white border-b border-neutral-100 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-2xl border border-[#D40000]">
             <span className="text-white text-xl">S</span>
          </div>
          <div>
            <h2 className="font-luxury text-lg text-black">Concierge</h2>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-[#D40000] rounded-full animate-pulse" />
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Attentive</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl ${
              m.role === 'user' 
              ? 'bg-[#D40000] text-white rounded-tr-none shadow-xl' 
              : 'bg-neutral-50 text-neutral-800 border border-neutral-100 rounded-tl-none'
            }`}>
              <p className="text-xs leading-relaxed font-medium">{m.text}</p>
              <div className="mt-3 flex items-center justify-between opacity-40">
                <span className="text-[8px] font-bold uppercase tracking-widest">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {m.role !== 'user' && <span className="text-[8px] italic">SweetData Attaché</span>}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-neutral-50 p-4 rounded-2xl rounded-tl-none border border-neutral-100 flex space-x-2">
              <div className="w-1.5 h-1.5 bg-[#D40000] rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-[#D40000] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-[#D40000] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-white border-t border-neutral-100 pb-10">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Inquire here..."
            className="w-full bg-neutral-50 border border-neutral-100 p-5 rounded-2xl pr-20 focus:outline-none focus:border-[#D40000] transition-all text-xs font-medium placeholder:text-neutral-300 shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="absolute right-3 p-3 bg-black rounded-xl text-white shadow-lg active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SweetBot;
