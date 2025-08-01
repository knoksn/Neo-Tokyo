
import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon, ArtIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface ArtPromptDisplayProps {
  promptText: string;
  isLoadingPrompt: boolean;
  onGenerateImage: (prompt: string) => void;
  isLoadingImage: boolean;
  imageError: string | null;
  generatedImage: string;
}

const ArtPromptDisplay: React.FC<ArtPromptDisplayProps> = ({ promptText, isLoadingPrompt, onGenerateImage, isLoadingImage, imageError, generatedImage }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (promptText) {
      navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [promptText]);

  if (isLoadingPrompt || !promptText) {
    return null;
  }

  const imageUrl = `data:image/jpeg;base64,${generatedImage}`;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in">
        <div className="relative p-6">
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
                        <span className="ml-2 text-sm hidden sm:inline">Copied!</span>
                    </>
                ) : (
                    <>
                        <CopyIcon />
                        <span className="ml-2 text-sm hidden sm:inline">Copy</span>
                    </>
                )}
            </button>
            <div className="mt-6 text-center">
                <button
                    onClick={() => onGenerateImage(promptText)}
                    disabled={isLoadingImage}
                    className="inline-flex items-center justify-center px-8 py-3 bg-emerald-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/40 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {isLoadingImage ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">Generating Image...</span>
                        </>
                    ) : (
                        <>
                            <ArtIcon />
                            <span className="ml-2">Generate Image</span>
                        </>
                    )}
                </button>
            </div>
        </div>

        { (isLoadingImage || imageError || generatedImage) &&
            <div className="border-t border-slate-700/50 p-6">
                {isLoadingImage && (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <LoadingSpinner />
                        <p className="mt-2 text-lg">Warming up the neural art-bot...</p>
                        <p className="text-sm">This can take a moment.</p>
                    </div>
                )}
                {imageError && (
                    <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
                        <p>{imageError}</p>
                    </div>
                )}
                {generatedImage && !imageError && (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-bold text-cyan-400 mb-4 [text-shadow:_0_0_8px_theme(colors.cyan.500)] text-center">Generated Concept Art</h3>
                        <img 
                            src={imageUrl} 
                            alt="AI generated concept art for Neo-Tokyo Noir" 
                            className="w-full h-auto rounded-lg border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20" 
                        />
                    </div>
                )}
            </div>
        }
    </div>
  );
};

export default ArtPromptDisplay;
