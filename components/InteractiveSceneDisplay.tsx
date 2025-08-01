
import React, { useState, useCallback } from 'react';
import { InteractiveScene, Choice } from '../services/geminiService';
import { toInteractiveSceneMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface InteractiveSceneDisplayProps {
  scene: InteractiveScene | null;
  isLoading: boolean;
}

const ChoiceLink: React.FC<{ choice: Choice }> = ({ choice }) => (
    <div className="font-mono text-cyan-300 bg-slate-800/60 hover:bg-slate-800 border-2 border-slate-700/80 hover:border-cyan-500 rounded-md transition-all duration-200 cursor-pointer">
        <p className="p-3">
            <span className="text-cyan-500">[[</span>
            {choice.text}
            <span className="text-gray-500">|</span>
            <span className="text-amber-400">{choice.target}</span>
            <span className="text-cyan-500">]]</span>
        </p>
    </div>
);


const InteractiveSceneDisplay: React.FC<InteractiveSceneDisplayProps> = ({ scene, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (scene) {
      const markdown = toInteractiveSceneMarkdown(scene);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [scene]);

  if (isLoading || !scene) {
    return null;
  }

  const markdownContent = toInteractiveSceneMarkdown(scene);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {scene.title}
          </h2>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>
        
        <div className="border-t border-slate-700/50 pt-6 prose prose-invert max-w-none text-gray-300">
          <p>{scene.narrative_text}</p>
        </div>

        <div className="border-t border-slate-700/50 pt-6 space-y-3">
            {scene.choices.map((choice, index) => (
                <ChoiceLink key={index} choice={choice} />
            ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${scene.title}`}>
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

export default InteractiveSceneDisplay;
