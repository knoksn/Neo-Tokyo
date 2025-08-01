import React, { useState, useCallback } from 'react';
import { Storyboard, Panel } from '../services/geminiService';
import { toStoryboardMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface StoryboardDisplayProps {
  storyboard: Storyboard | null;
}

const PanelDisplay: React.FC<{ panel: Panel }> = ({ panel }) => {
  const [isArtPromptCopied, setIsArtPromptCopied] = useState(false);

  const handleArtPromptCopy = useCallback(() => {
    navigator.clipboard.writeText(panel.art_prompt);
    setIsArtPromptCopied(true);
    setTimeout(() => setIsArtPromptCopied(false), 2500);
  }, [panel.art_prompt]);

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4">
      <div className="flex-shrink-0 flex items-center justify-center bg-slate-900 rounded-full h-12 w-12 md:h-16 md:w-16 border-2 border-cyan-500 text-cyan-400 font-bold text-xl md:text-2xl">
        {panel.panel_number}
      </div>
      <div className="flex-grow space-y-3">
        <p className="font-bold text-gray-200">{panel.visual_cue}</p>
        {panel.dialogue_or_narration && (
          <blockquote className="border-l-2 border-slate-600 pl-3 italic text-gray-300 text-sm">
            "{panel.dialogue_or_narration}"
          </blockquote>
        )}
        {panel.fx_or_animation && (
            <p className="text-sm text-cyan-300">
                <span className="font-semibold text-cyan-200">FX/Animation:</span> {panel.fx_or_animation}
            </p>
        )}
        <div className="relative">
            <p className="text-xs font-mono bg-black/20 p-3 pr-10 rounded-md border border-slate-700/80 text-gray-400">
                {panel.art_prompt}
            </p>
            <button
                onClick={handleArtPromptCopy}
                className="absolute top-1 right-1 flex items-center justify-center p-1.5 bg-slate-700 text-gray-300 font-semibold rounded-md transition-colors duration-200 text-xs hover:bg-cyan-500 hover:text-slate-900 focus:outline-none"
                aria-label="Copy art prompt"
            >
                {isArtPromptCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
        </div>
      </div>
    </div>
  );
};


const StoryboardDisplay: React.FC<StoryboardDisplayProps> = ({ storyboard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (storyboard) {
      const markdown = toStoryboardMarkdown(storyboard);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [storyboard]);
  
  if (!storyboard) {
    return null;
  }

  const markdownContent = toStoryboardMarkdown(storyboard);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            Storyboard: {storyboard.title}
          </h2>
          <p className="text-lg text-gray-400">Theme: {storyboard.theme}</p>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>

        <div className="space-y-4">
          {storyboard.panels.map((panel) => (
            <PanelDisplay key={panel.panel_number} panel={panel} />
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${storyboard.title}`}>
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

export default StoryboardDisplay;