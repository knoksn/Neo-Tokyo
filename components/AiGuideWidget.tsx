
import React, { useState, useEffect, useRef } from 'react';
import { askAiGuide } from '../services/geminiService';
import { AiGuideIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface ChatMessage {
    from: 'ai' | 'user';
    text: string;
}

const AiGuideWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([
    { from: 'ai', text: "Hei! I'm Oracle, your Neo-Tokyo Noir AI guide. Ask me anything about the world, DLC, features, or gameplay!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMsg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!msg.trim() || isLoading) return;

    const userMessage: ChatMessage = { from: 'user', text: msg };
    setChat(prevChat => [...prevChat, userMessage]);
    setMsg('');
    setIsLoading(true);

    try {
      const reply = await askAiGuide(msg, [...chat, userMessage]);
      setChat(prevChat => [...prevChat, { from: 'ai', text: reply }]);
    } catch (error) {
      console.error(error);
      setChat(prevChat => [...prevChat, { from: 'ai', text: "I'm experiencing a data-ghost in my system. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {isOpen && (
            <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 rounded-lg shadow-2xl shadow-cyan-500/20 w-80 flex flex-col">
              <header className="p-3 border-b border-cyan-500/30">
                  <h3 className="font-bold text-center text-cyan-400">AI Guide: Oracle</h3>
              </header>
              <div className="h-64 overflow-y-auto p-3 space-y-3 text-sm">
                {chat.map((c, i) => (
                  <div key={i} className={`flex ${c.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] p-2 rounded-lg ${c.from === 'ai' ? 'bg-slate-800 text-gray-300' : 'bg-cyan-900/70 text-cyan-200'}`}>
                        {c.text}
                      </div>
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-[80%] p-2 rounded-lg bg-slate-800 text-gray-300 flex items-center">
                            <LoadingSpinner />
                            <span className="ml-2 text-xs italic">Oracle is thinking...</span>
                         </div>
                    </div>
                 )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendMsg} className="p-2 border-t border-cyan-500/30 flex">
                <input
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  className="flex-grow bg-slate-800 border border-slate-700 text-gray-200 rounded-l-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="Ask a question..."
                  autoFocus
                />
                <button type="submit" disabled={isLoading} className="bg-cyan-600 text-slate-900 font-bold px-4 rounded-r-md hover:bg-cyan-500 transition-colors disabled:bg-slate-600">Send</button>
              </form>
            </div>
        )}
      </div>
       <button 
        onClick={() => setIsOpen(o => !o)} 
        className="mt-2 ml-auto flex items-center justify-center h-14 w-14 bg-cyan-500 text-slate-900 rounded-full shadow-lg shadow-cyan-500/40 hover:bg-cyan-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
        aria-label={isOpen ? "Close AI Guide" : "Open AI Guide"}
      >
        <AiGuideIcon />
      </button>
    </div>
  );
};

export default AiGuideWidget;
