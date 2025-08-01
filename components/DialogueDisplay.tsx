
import React, { useState, useCallback } from 'react';
import { Dialogue } from '../services/geminiService';
import { toDialogueMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface DialogueDisplayProps {
  dialogue: Dialogue | null;
  isLoading: boolean;
}

const DialogueDisplay: React.FC<DialogueDisplayProps> = ({ dialogue, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (dialogue) {
      const markdown = toDialogueMarkdown(dialogue);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [dialogue]);

  if (isLoading || !dialogue) {
    return null;
  }

  const markdownContent = toDialogueMarkdown(dialogue);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {dialogue.title}
          </h2>
          <p className="text-gray-400 italic mt-1">{dialogue.setting}</p>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>

        <div className="border-t border-slate-700/50 pt-6">
          <blockquote className="border-l-4 border-cyan-500 pl-4">
            <p className="text-lg text-gray-200 italic">"{dialogue.npc_line}"</p>
          </blockquote>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Maya's Responses:</h3>
          <div className="space-y-4">
            {dialogue.maya_options.map((option, index) => (
              <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 transition-shadow hover:shadow-md hover:shadow-cyan-500/10">
                <h4 className="font-bold text-cyan-300 mb-2 text-lg">
                  [{option.type}]
                </h4>
                <p className="text-gray-300 mb-3">
                  <span className="font-semibold text-gray-100">Maya:</span> "{option.line}"
                </p>
                <div className="border-l-2 border-slate-600 pl-3 space-y-2 text-sm">
                  <p className="text-gray-400">
                      <span className="font-semibold text-gray-200">NPC Reaction:</span> {option.npc_reaction}
                  </p>
                   <p className="text-cyan-400">
                      <span className="font-semibold text-cyan-200">Outcome:</span> {option.outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${dialogue.title}`}>
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

export default DialogueDisplay;
