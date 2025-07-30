
import React from 'react';
import { Npc } from '../services/geminiService';

interface NpcDisplayProps {
  npc: Npc | null;
  isLoading: boolean;
}

const NpcDisplay: React.FC<NpcDisplayProps> = ({ npc, isLoading }) => {
  if (isLoading || !npc) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
          {npc.name}
        </h2>
        <p className="text-xl text-gray-400 italic">Codename: "{npc.codename}"</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-4">
          <InfoBlock title="Physical Description" content={npc.description.physical} />
          <InfoBlock title="Cybernetics" content={npc.description.cybernetics} />
          <InfoBlock title="Fashion" content={npc.description.fashion} />
          <InfoBlock title="Aura" content={npc.description.aura} />
        </div>
        <div className="space-y-4">
          <InfoBlock title="Secret / Motivation" content={npc.secret} />
          <InfoBlock title="Connection to Maya Chen" content={npc.connection} />
          <div>
            <h3 className="font-bold text-cyan-400 mb-1">Signature Lines</h3>
            <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-400 space-y-2">
              <p>"{npc.lines.flirty}"</p>
              <p>"{npc.lines.threatening}"</p>
            </blockquote>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700/50 pt-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-2">Quest Hook: {npc.quest.title}</h3>
        <p className="text-gray-300">{npc.quest.description}</p>
      </div>
    </div>
  );
};

interface InfoBlockProps {
    title: string;
    content: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ title, content }) => (
    <div>
        <h3 className="font-bold text-cyan-400 mb-1">{title}</h3>
        <p className="text-gray-300">{content}</p>
    </div>
);

export default NpcDisplay;
