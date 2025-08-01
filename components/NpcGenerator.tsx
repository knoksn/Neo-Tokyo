
import React, { useState, useCallback } from 'react';
import { generateNpc, Npc } from '../services/geminiService';
import NpcDisplay from './NpcDisplay';
import LoadingSpinner from './LoadingSpinner';
import { NpcIcon } from './icons';

interface NpcGeneratorProps {
  generatedNpc: Npc | null;
  setGeneratedNpc: (npc: Npc | null) => void;
}

const NpcGenerator: React.FC<NpcGeneratorProps> = ({ generatedNpc, setGeneratedNpc }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateNpc = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedNpc(null);
    try {
      const npc = await generateNpc();
      setGeneratedNpc(npc);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the NPC. A ghost in the machine, perhaps.');
    } finally {
      setIsLoading(false);
    }
  }, [setGeneratedNpc]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate a Unique NPC</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to create a new character to populate the world of Neo-Tokyo. The AI will craft a name, description, secrets, and a potential quest line.</p>
        <button
          onClick={handleGenerateNpc}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Conjuring...</span>
            </>
          ) : (
            <>
              <NpcIcon />
              <span className="ml-2">Generate NPC</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <NpcDisplay npc={generatedNpc} isLoading={isLoading} />
    </div>
  );
};

export default NpcGenerator;
