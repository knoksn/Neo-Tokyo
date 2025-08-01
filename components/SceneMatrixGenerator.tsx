
import React, { useState, useCallback } from 'react';
import { generateSceneMatrixEntry, SceneMatrixEntry, SceneMatrixEntryData } from '../services/geminiService';
import SceneMatrixDisplay from './SceneMatrixDisplay';
import LoadingSpinner from './LoadingSpinner';
import { SceneMatrixIcon } from './icons';

interface SceneMatrixGeneratorProps {
  generatedEntries: SceneMatrixEntry[];
  setGeneratedEntries: React.Dispatch<React.SetStateAction<SceneMatrixEntry[]>>;
}

const characters: string[] = [
    "Maya Chen",
    "Dr. Victoria Thane",
    "Marcus Zhang",
    "The Elder Algorithm"
];

const locations: string[] = [
    "Quantum Quarter",
    "Binary District",
    "Crimson Dragon Tower",
    "Void Factory"
];

const SceneMatrixGenerator: React.FC<SceneMatrixGeneratorProps> = ({ generatedEntries, setGeneratedEntries }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0});

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedEntries([]);
    
    const combinations = [];
    for (const character of characters) {
      for (const location of locations) {
        combinations.push({ character, location });
      }
    }
    setProgress({ current: 0, total: combinations.length });

    for (const combo of combinations) {
        try {
            const data: SceneMatrixEntryData = await generateSceneMatrixEntry(combo.character, combo.location);
            const newEntry: SceneMatrixEntry = {
                ...data,
                character: combo.character,
                location: combo.location,
            };
            setGeneratedEntries(prev => [...prev, newEntry]);
            setProgress(prev => ({ ...prev, current: prev.current + 1 }));
        } catch (err: any) {
            console.error(err);
            setError(`An error occurred while generating the scene for ${combo.character} in ${combo.location}. The matrix is unstable.`);
            setIsLoading(false);
            return;
        }
    }

    setIsLoading(false);
  }, [setGeneratedEntries]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate Scene Matrix</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to generate a 4x4 matrix of unique scenes, one for each core character and location combination. This will perform 16 AI calls.</p>
        
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
                  <SceneMatrixIcon />
                  <span className="ml-2">Generate Scene Matrix</span>
                </>
              )}
            </button>
            {isLoading && (
                <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4 max-w-sm">
                    <div 
                        className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300" 
                        style={{width: `${(progress.current / progress.total) * 100}%`}}>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{progress.current} / {progress.total} scenes generated.</p>
                </div>
            )}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <SceneMatrixDisplay entries={generatedEntries} />
    </div>
  );
};

export default SceneMatrixGenerator;