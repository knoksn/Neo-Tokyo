
import React, { useState, useCallback } from 'react';
import { generateLore, Lore } from '../services/geminiService';
import LoreDisplay from './LoreDisplay';
import LoadingSpinner from './LoadingSpinner';
import { LoreIcon } from './icons';

interface LoreGeneratorProps {
  generatedLore: Lore | null;
  setGeneratedLore: (lore: Lore | null) => void;
}

const LoreGenerator: React.FC<LoreGeneratorProps> = ({ generatedLore, setGeneratedLore }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLore = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedLore(null);
    try {
      const lore = await generateLore();
      setGeneratedLore(lore);
    } catch (err) {
      console.error(err);
      setError('A critical error occurred in the archives. Lore could not be retrieved.');
    } finally {
      setIsLoading(false);
    }
  }, [setGeneratedLore]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate Foundational Lore</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to expand the world of Neo-Tokyo. The AI will detail Maya's history, the cause of the quantum fractures, and a new urban legend.</p>
        <button
          onClick={handleGenerateLore}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Excavating...</span>
            </>
          ) : (
            <>
              <LoreIcon />
              <span className="ml-2">Generate Lore</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <LoreDisplay lore={generatedLore} isLoading={isLoading} />
    </div>
  );
};

export default LoreGenerator;
