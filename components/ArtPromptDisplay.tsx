
import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface ArtPromptDisplayProps {
  promptText: string;
  isLoading: boolean;
}

const ArtPromptDisplay: React.FC<ArtPromptDisplayProps> = ({ promptText, isLoading }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (promptText) {
      navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [promptText]);

  if (isLoading || !promptText) {
    return null;
  }

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">Generated Art Prompt</h2>
      <p className="text-gray-300 whitespace-pre-wrap font-mono bg-slate-900 p-4 rounded-md border border-slate-700">
        {promptText}
      </p>
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 flex items-center justify-center px-3 py-2 bg-slate-800 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
        aria-label="Copy prompt to clipboard"
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
    </div>
  );
};

export default ArtPromptDisplay;
