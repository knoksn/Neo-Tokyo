
import React, { useState, useCallback } from 'react';
import { PlaytestingScenario } from '../services/geminiService';
import { toPlaytestingScenarioMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface PlaytestingScenarioDisplayProps {
  scenario: PlaytestingScenario | null;
  isLoading: boolean;
}

const PlaytestingScenarioDisplay: React.FC<PlaytestingScenarioDisplayProps> = ({ scenario, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (scenario) {
      const markdown = toPlaytestingScenarioMarkdown(scenario);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [scenario]);

  if (isLoading || !scenario) {
    return null;
  }

  const markdownContent = toPlaytestingScenarioMarkdown(scenario);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {scenario.title}
          </h2>
          <p className="text-gray-300 mt-1">{scenario.objective}</p>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${scenario.title}`}>
        <div className="relative">
            <button
                onClick={handleCopy}
                className="absolute -top-1 -right-1 flex items-center justify-center px-3 py-1.5 bg-slate-700 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
                aria-label="Copy Markdown to clipboard"
            >
                {isCopied ? (
                    <>
                        <CheckIcon />
                        <span className="ml-2 text-sm">Copied!</span>
                    </>
                ) : (
                    <>
                        <CopyIcon />
                        <span className="ml-2 text-sm">Copy</span>
                    </>
                )}
            </button>
          <pre className="whitespace-pre-wrap font-mono text-sm bg-slate-900/70 p-4 rounded-md border border-slate-700 max-h-[60vh] overflow-auto">
            <code>
              {markdownContent}
            </code>
          </pre>
        </div>
      </Modal>
    </>
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
