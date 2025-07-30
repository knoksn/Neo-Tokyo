
import React from 'react';
import { AiBehavior } from '../services/geminiService';

interface AiBehaviorDisplayProps {
  behavior: AiBehavior | null;
  isLoading: boolean;
}

const AiBehaviorDisplay: React.FC<AiBehaviorDisplayProps> = ({ behavior, isLoading }) => {
  if (isLoading || !behavior) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
          {behavior.name}
        </h2>
        <p className="text-xl text-gray-400 italic">{behavior.role}</p>
      </header>
      
      <div className="space-y-4">
        <InfoBlock title="Form Recognition" content={behavior.form_recognition} />
      </div>

      <div className="border-t border-slate-700/50 pt-6 space-y-4">
        <h3 className="text-xl font-bold text-cyan-400">Tactical Adaptations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdaptationCard title="Stealth" description={behavior.tactical_adaptations.stealth} />
          <AdaptationCard title="Combat" description={behavior.tactical_adaptations.combat} />
          <AdaptationCard title="Social" description={behavior.tactical_adaptations.social} />
        </div>
      </div>

      <div className="border-t border-slate-700/50 pt-6 space-y-4">
        <InfoBlock title="Long-Term Evolution" content={behavior.long_term_evolution} />
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
        <h3 className="font-bold text-cyan-400 mb-1 text-lg">{title}</h3>
        <p className="text-gray-300">{content}</p>
    </div>
);

interface AdaptationCardProps {
    title: string;
    description: string;
}

const AdaptationCard: React.FC<AdaptationCardProps> = ({ title, description }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h4 className="font-bold text-cyan-300 mb-2">{title}</h4>
        <p className="text-sm text-gray-300">{description}</p>
    </div>
)

export default AiBehaviorDisplay;