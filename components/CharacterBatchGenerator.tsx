
import React, { useState, useCallback } from 'react';
import { generateBatchCharacterProfile, BatchCharacterProfile } from '../services/geminiService';
import CharacterBatchDisplay from './CharacterBatchDisplay';
import LoadingSpinner from './LoadingSpinner';
import { BatchCharacterIcon } from './icons';

interface CharacterBatchGeneratorProps {
  generatedProfiles: BatchCharacterProfile[];
  setGeneratedProfiles: React.Dispatch<React.SetStateAction<BatchCharacterProfile[]>>;
}

const characterNames: string[] = [
    'Maya Chen', 
    'Dr. Victoria Thane', 
    'Marcus Zhang', 
    'The Elder Algorithm', 
    'Solaris', 
    'ENAS', 
    'Lucy', 
    'Ara', 
    'Iris', 
    'Ani'
];

const CharacterBatchGenerator: React.FC<CharacterBatchGeneratorProps> = ({ generatedProfiles, setGeneratedProfiles }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0});

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedProfiles([]);
    setProgress({ current: 0, total: characterNames.length });

    for (const name of characterNames) {
        try {
            const profile = await generateBatchCharacterProfile(name);
            setGeneratedProfiles(prev => [...prev, profile]);
            setProgress(prev => ({ ...prev, current: prev.current + 1 }));
        } catch (err: any) {
            console.error(err);
            setError(`An error occurred while generating the profile for ${name}.`);
            setIsLoading(false);
            return;
        }
    }

    setIsLoading(false);
  }, [setGeneratedProfiles]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate Character Batch</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to generate full character profiles for the entire main cast of Neo-Tokyo Noir. This will perform {characterNames.length} AI calls.</p>
        
        <div className="flex flex-col items-center">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                <>
                  <BatchCharacterIcon />
                  <span className="ml-2">Generate All Characters</span>
                </>
              )}
            </button>
            {isLoading && (
                <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4 max-w-sm">
                    <div 
                        className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300" 
                        style={{width: `${(progress.current / progress.total) * 100}%`}}>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{progress.current} / {progress.total} characters generated.</p>
                </div>
            )}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <CharacterBatchDisplay profiles={generatedProfiles} />
    </div>
  );
};

export default CharacterBatchGenerator;
