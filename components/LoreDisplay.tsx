
import React from 'react';
import { Lore } from '../services/geminiService';

interface LoreDisplayProps {
  lore: Lore | null;
  isLoading: boolean;
}

const LoreDisplay: React.FC<LoreDisplayProps> = ({ lore, isLoading }) => {
  if (isLoading || !lore) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
          {lore.title}
        </h2>
      </header>
      
      <div className="space-y-4">
        <InfoBlock title="Maya's Myth-Tech Origins" content={lore.maya_history} />
        <InfoBlock title="The Quantum Fractures" content={lore.quantum_fractures} />
        <InfoBlock title="The State of Neo-Tokyo" content={lore.city_state} />
      </div>

      <div className="border-t border-slate-700/50 pt-6">
         <h3 className="font-bold text-cyan-400 mb-1">Urban Legend</h3>
         <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-300">
            <p>"{lore.urban_legend}"</p>
         </blockquote>
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
        <h3 className="text-xl font-bold text-cyan-400 mb-2">{title}</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
    </div>
);

export default LoreDisplay;