
import React, { useState, useCallback } from 'react';
import { Lore } from '../services/geminiService';
import { toLoreMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface LoreDisplayProps {
  lore: Lore | null;
  isLoading: boolean;
}

const LoreDisplay: React.FC<LoreDisplayProps> = ({ lore, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (lore) {
      const markdown = toLoreMarkdown(lore);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [lore]);
  
  if (isLoading || !lore) {
    return null;
  }

  const markdownContent = toLoreMarkdown(lore);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {lore.title}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${lore.title}`}>
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
        <h3 className="text-xl font-bold text-cyan-400 mb-2">{title}</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
    </div>
);

export default LoreDisplay;
