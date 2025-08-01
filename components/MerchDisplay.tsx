import React, { useState, useCallback } from 'react';
import { MerchIdeas, MerchIdea } from '../services/geminiService';
import { toMerchIdeasMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface MerchDisplayProps {
  merch: MerchIdeas | null;
  isLoading: boolean;
}

const MerchCard: React.FC<{ idea: MerchIdea }> = ({ idea }) => {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col space-y-3">
            <h4 className="font-bold text-cyan-300 text-lg">{idea.type}</h4>
            <p className="text-sm text-gray-300 flex-grow">{idea.description}</p>
            <div className="text-xs text-gray-400">
                <p className="font-semibold text-gray-200">Art Suggestion:</p>
                <p className="italic">{idea.art_prompt_suggestion}</p>
            </div>
        </div>
    )
}

const MerchDisplay: React.FC<MerchDisplayProps> = ({ merch, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (merch) {
      const markdown = toMerchIdeasMarkdown(merch);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [merch]);

  if (isLoading || !merch) {
    return null;
  }

  const markdownContent = toMerchIdeasMarkdown(merch);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            Merch Concepts: {merch.title}
          </h2>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {merch.ideas.map((idea) => <MerchCard key={idea.type} idea={idea} />)}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${merch.title}`}>
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

export default MerchDisplay;