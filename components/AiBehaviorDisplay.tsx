
import React, { useState, useCallback } from 'react';
import { AiBehavior } from '../services/geminiService';
import { toAiBehaviorMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface AiBehaviorDisplayProps {
  behavior: AiBehavior | null;
  isLoading: boolean;
}

const AiBehaviorDisplay: React.FC<AiBehaviorDisplayProps> = ({ behavior, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (behavior) {
      const markdown = toAiBehaviorMarkdown(behavior);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [behavior]);

  if (isLoading || !behavior) {
    return null;
  }

  const markdownContent = toAiBehaviorMarkdown(behavior);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {behavior.name}
          </h2>
          <p className="text-xl text-gray-400 italic">{behavior.role}</p>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${behavior.name}`}>
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
