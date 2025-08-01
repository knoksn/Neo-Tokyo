import React, { useState, useCallback } from 'react';
import { DlcCharacter } from '../services/geminiService';
import { toDlcCharacterMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface DlcCharacterDisplayProps {
  dlc: DlcCharacter | null;
  isLoading: boolean;
}

const DlcCharacterDisplay: React.FC<DlcCharacterDisplayProps> = ({ dlc, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isArtPromptCopied, setIsArtPromptCopied] = useState(false);

  const handleModalCopy = useCallback(() => {
    if (dlc) {
      const markdown = toDlcCharacterMarkdown(dlc);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [dlc]);
  
  const handleArtPromptCopy = useCallback(() => {
    if (dlc) {
      navigator.clipboard.writeText(dlc.art_prompt);
      setIsArtPromptCopied(true);
      setTimeout(() => setIsArtPromptCopied(false), 2500);
    }
  }, [dlc]);

  if (isLoading || !dlc) {
    return null;
  }

  const markdownContent = toDlcCharacterMarkdown(dlc);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            DLC Concept: {dlc.name}
          </h2>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>
        
        <div className="border-t border-slate-700/50 pt-6">
            <InfoBlock title="Intro Scene" content={dlc.intro_scene} />
        </div>
        
        <div className="border-t border-slate-700/50 pt-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">AI Art Prompt</h3>
            <div className="relative">
                <p className="text-gray-300 whitespace-pre-wrap font-mono bg-slate-900 p-4 rounded-md border border-slate-700 text-sm">
                    {dlc.art_prompt}
                </p>
                <button
                    onClick={handleArtPromptCopy}
                    className="absolute top-2 right-2 flex items-center justify-center px-3 py-1.5 bg-slate-700 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                    aria-label="Copy art prompt to clipboard"
                >
                    {isArtPromptCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
        </div>

        <div className="border-t border-slate-700/50 pt-6">
          <InfoBlock title="Community Remix Challenge" content={dlc.community_challenge} isQuote={true}/>
        </div>

        <div className="border-t border-slate-700/50 pt-6">
          <InfoBlock title="Dialogue Sample" content={dlc.dialogue_sample} isQuote={true}/>
        </div>

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${dlc.name}`}>
        <div className="relative">
            <button
                onClick={handleModalCopy}
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

const InfoBlock: React.FC<{ title: string; content: string; isQuote?: boolean }> = ({ title, content, isQuote }) => (
    <div>
        <h3 className="font-bold text-xl text-cyan-400 mb-2">{title}</h3>
        {isQuote ? (
            <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-300">
              <p>"{content}"</p>
          </blockquote>
        ) : (
             <p className="text-gray-300">{content}</p>
        )}
    </div>
);


export default DlcCharacterDisplay;