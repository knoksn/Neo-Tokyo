
import React, { useState, useCallback } from 'react';
import { Scenario } from '../services/geminiService';
import { toScenarioMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface ScenarioDisplayProps {
  scenario: Scenario | null;
  isLoading: boolean;
}

const ScenarioDisplay: React.FC<ScenarioDisplayProps> = ({ scenario, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (scenario) {
      const markdown = toScenarioMarkdown(scenario);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [scenario]);

  if (isLoading || !scenario) {
    return null;
  }

  const markdownContent = toScenarioMarkdown(scenario);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {scenario.title}
          </h2>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
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
