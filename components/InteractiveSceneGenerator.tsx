
import React, { useState, useCallback } from 'react';
import { generateInteractiveScene, InteractiveScene } from '../services/geminiService';
import InputGroup from './InputGroup';
import InteractiveSceneDisplay from './InteractiveSceneDisplay';
import LoadingSpinner from './LoadingSpinner';
import { InteractiveIcon, SparklesIcon } from './icons';

interface InteractiveSceneGeneratorProps {
  generatedScene: InteractiveScene | null;
  setGeneratedScene: (scene: InteractiveScene | null) => void;
}

const InteractiveSceneGenerator: React.FC<InteractiveSceneGeneratorProps> = ({ generatedScene, setGeneratedScene }) => {
  const [concept, setConcept] = useState('Timeline Fracture - Maya vs. Marcus');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!concept) {
      setError('A concept must be provided to generate a scene.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedScene(null);

    try {
      const scene = await generateInteractiveScene(concept);
      setGeneratedScene(scene);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate interactive scene. A narrative paradox occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [concept, setGeneratedScene]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <InputGroup
          label="Scene Concept"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="e.g., Infiltrating the Crimson Dragon Tower"
          icon={<InteractiveIcon />}
        />
        <div className="mt-6 text-center">
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {isLoading ? (
                <>
                    <LoadingSpinner />
                    <span className="ml-2">Branching...</span>
                </>
                ) : (
                <>
                    <SparklesIcon />
                    <span className="ml-2">Generate Interactive Scene</span>
                </>
                )}
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <InteractiveSceneDisplay scene={generatedScene} isLoading={isLoading} />
    </div>
  );
};

export default InteractiveSceneGenerator;
