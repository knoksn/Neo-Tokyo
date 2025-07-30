
import React from 'react';
import { Scenario } from '../services/geminiService';

interface ScenarioDisplayProps {
  scenario: Scenario | null;
  isLoading: boolean;
}

const ScenarioDisplay: React.FC<ScenarioDisplayProps> = ({ scenario, isLoading }) => {
  if (isLoading || !scenario) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
          {scenario.title}
        </h2>
      </header>
      
      <div className="space-y-4">
        <InfoBlock title="Environment" content={scenario.environment} />
        <InfoBlock title="Enemies & Tactics" content={scenario.enemies} />
        <InfoBlock title="Maya's Abilities" content={scenario.maya_abilities} />
      </div>

      <div className="border-t border-slate-700/50 pt-6 space-y-4">
          <h3 className="text-xl font-bold text-cyan-400">Resolution Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResolutionCard title="Direct Assault" outcome={scenario.resolutions.direct_assault.outcome} reward={scenario.resolutions.direct_assault.reward} />
              <ResolutionCard title="Stealth" outcome={scenario.resolutions.stealth.outcome} reward={scenario.resolutions.stealth.reward} />
              <ResolutionCard title="Social" outcome={scenario.resolutions.social.outcome} reward={scenario.resolutions.social.reward} />
              <ResolutionCard title="Hacking" outcome={scenario.resolutions.hacking.outcome} reward={scenario.resolutions.hacking.reward} />
          </div>
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

interface ResolutionCardProps {
    title: string;
    outcome: string;
    reward: string;
}

const ResolutionCard: React.FC<ResolutionCardProps> = ({ title, outcome, reward }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col">
        <h4 className="font-bold text-cyan-300 mb-2 text-lg">{title}</h4>
        <div className="text-sm text-gray-300 space-y-2 flex-grow">
            <p><span className="font-semibold text-gray-100">Outcome:</span> {outcome}</p>
            <p><span className="font-semibold text-cyan-200">Reward:</span> {reward}</p>
        </div>
    </div>
);

export default ScenarioDisplay;
