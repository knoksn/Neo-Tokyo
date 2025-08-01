
import React from 'react';
import { Faction } from '../services/geminiService';

interface FactionDisplayProps {
  faction: Faction | null;
  isLoading: boolean;
}

const FactionDisplay: React.FC<FactionDisplayProps> = ({ faction, isLoading }) => {
  if (isLoading || !faction) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
          {faction.name}
        </h2>
        <p className="text-xl text-gray-400 italic">"{faction.ideology}"</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-4">
          <InfoBlock title="Headquarters" content={faction.headquarters} />
          <InfoBlock title="Hierarchy" content={faction.hierarchy} />
        </div>
        <div className="space-y-4">
          <InfoBlock title="Public Agenda" content={faction.public_agenda} />
          <InfoBlock title="Secret Agenda" content={faction.secret_agenda} />
        </div>
      </div>

      <div className="border-t border-slate-700/50 pt-6">
        <InfoBlock title="Relationship with Maya Chen" content={faction.relationship_with_maya} />
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

export default FactionDisplay;