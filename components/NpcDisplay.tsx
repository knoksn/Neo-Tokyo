
import React, { useState, useCallback } from 'react';
import { Npc } from '../services/geminiService';
import { toNpcMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface NpcDisplayProps {
  npc: Npc | null;
  isLoading: boolean;
}

const NpcDisplay: React.FC<NpcDisplayProps> = ({ npc, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (npc) {
      const markdown = toNpcMarkdown(npc);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [npc]);


  if (isLoading || !npc) {
    return null;
  }

  const markdownContent = toNpcMarkdown(npc);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {npc.name}
          </h2>
          <p className="text-xl text-gray-400 italic">Codename: "{npc.codename}"</p>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <InfoBlock title="Physical Description" content={npc.description.physical} />
            <InfoBlock title="Cybernetics" content={npc.description.cybernetics} />
            <InfoBlock title="Fashion" content={npc.description.fashion} />
            <InfoBlock title="Aura" content={npc.description.aura} />
          </div>
          <div className="space-y-4">
            <InfoBlock title="Secret / Motivation" content={npc.secret} />
            <InfoBlock title="Connection to Maya Chen" content={npc.connection} />
            <div>
              <h3 className="font-bold text-cyan-400 mb-1">Signature Lines</h3>
              <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-400 space-y-2">
                <p>"{npc.lines.flirty}"</p>
                <p>"{npc.lines.threatening}"</p>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-2">Quest Hook: {npc.quest.title}</h3>
          <p className="text-gray-300">{npc.quest.description}</p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${npc.name}`}>
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

export default NpcDisplay;
