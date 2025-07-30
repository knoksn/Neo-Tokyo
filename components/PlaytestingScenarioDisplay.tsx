
import React from 'react';
import { PlaytestingScenario } from '../services/geminiService';

interface PlaytestingScenarioDisplayProps {
  scenario: PlaytestingScenario | null;
  isLoading: boolean;
}

const PlaytestingScenarioDisplay: React.FC<PlaytestingScenarioDisplayProps> = ({ scenario, isLoading }) => {
  if (isLoading || !scenario) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
          {scenario.title}
        </h2>
        <p className="text-gray-300 mt-1">{scenario.objective}</p>
      </header>
      
      <div className="border-t border-slate-700/50 pt-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Edge Cases to Test</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card title="Combat" description={scenario.edge_cases.combat} />
            <Card title="Social" description={scenario.edge_cases.social} />
            <Card title="Exploration" description={scenario.edge_cases.exploration} />
        </div>
      </div>

      <div className="border-t border-slate-700/50 pt-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Potential Bugs to Watch For</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card title="Animation" description={scenario.potential_bugs.animation} />
            <Card title="VFX" description={scenario.potential_bugs.vfx} />
            <Card title="Dialogue" description={scenario.potential_bugs.dialogue} />
            <Card title="Game State" description={scenario.potential_bugs.game_state} />
        </div>
      </div>

      <div className="border-t border-slate-700/50 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
         <InfoBlock title="Suggested Debugging Tools" content={scenario.debugging_tools} />
         <InfoBlock title="Easter Egg" content={scenario.easter_egg} />
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

interface CardProps {
    title: string;
    description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h4 className="font-bold text-cyan-300 mb-2">{title}</h4>
        <p className="text-sm text-gray-300">{description}</p>
    </div>
);

export default PlaytestingScenarioDisplay;