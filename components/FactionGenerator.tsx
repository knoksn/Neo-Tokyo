
import React, { useState, useCallback } from 'react';
import { generateFaction, Faction } from '../services/geminiService';
import FactionDisplay from './FactionDisplay';
import LoadingSpinner from './LoadingSpinner';
import { FactionIcon } from './icons';

interface FactionGeneratorProps {
  generatedFaction: Faction | null;
  setGeneratedFaction: (faction: Faction | null) => void;
}

const FactionGenerator: React.FC<FactionGeneratorProps> = ({ generatedFaction, setGeneratedFaction }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateFaction = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedFaction(null);
    try {
      const faction = await generateFaction();
      setGeneratedFaction(faction);
    } catch (err) {
      console.error(err);
      setError('A political error occurred. Could not establish faction protocols.');
    } finally {
      setIsLoading(false);
    }
  }, [setGeneratedFaction]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate a Faction</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to create a new influential faction vying for power in Neo-Tokyo. The AI will generate their ideology, headquarters, agendas, and relationship to Maya Chen.</p>
        <button
          onClick={handleGenerateFaction}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Forming Alliances...</span>
            </>
          ) : (
            <>
              <FactionIcon />
              <span className="ml-2">Generate Faction</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <FactionDisplay faction={generatedFaction} isLoading={isLoading} />
    </div>
  );
};

export default FactionGenerator;
