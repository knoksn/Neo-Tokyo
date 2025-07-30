
import React from 'react';
import { Quest } from '../services/geminiService';

interface QuestDisplayProps {
  quest: Quest | null;
  isLoading: boolean;
}

const QuestDisplay: React.FC<QuestDisplayProps> = ({ quest, isLoading }) => {
  if (isLoading || !quest) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
          {quest.title}
        </h2>
      </header>
      
      <div className="space-y-4">
        <InfoBlock title="Quest Hook" content={quest.hook} />
        <InfoBlock title="Objective" content={quest.objective} />
      </div>

      <div className="border-t border-slate-700/50 pt-6 space-y-4">
        <h3 className="text-xl font-bold text-cyan-400">Challenges & Dilemmas</h3>
        <InfoBlock title="Stealth / Infiltration" content={quest.challenges.stealth} />
        <InfoBlock title="Moral Dilemma" content={quest.challenges.dilemma} />
      </div>
      
      <div className="border-t border-slate-700/50 pt-6 space-y-4">
          <h3 className="text-xl font-bold text-cyan-400">Potential Outcomes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <OutcomeCard title="Flirtation" description={quest.outcomes.flirtation} />
              <OutcomeCard title="Intimidation" description={quest.outcomes.intimidation} />
              <OutcomeCard title="Hacking" description={quest.outcomes.hacking} />
          </div>
      </div>

      <div className="border-t border-slate-700/50 pt-6 space-y-4">
        <InfoBlock title="Resolution" content={quest.resolution} />
        <InfoBlock title="Teaser" content={quest.teaser} />
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

interface OutcomeCardProps {
    title: string;
    description: string;
}

const OutcomeCard: React.FC<OutcomeCardProps> = ({ title, description }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h4 className="font-bold text-cyan-300 mb-2">{title}</h4>
        <p className="text-sm text-gray-300">{description}</p>
    </div>
)

export default QuestDisplay;
