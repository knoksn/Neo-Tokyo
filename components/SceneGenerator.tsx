
import React, { useState, useCallback } from 'react';
import { generateScene } from '../services/geminiService';
import InputGroup from './InputGroup';
import SceneDisplay from './SceneDisplay';
import LoadingSpinner from './LoadingSpinner';
import { LocationIcon, CharacterIcon, SituationIcon, SparklesIcon } from './icons';

const SceneGenerator: React.FC = () => {
  const [location, setLocation] = useState('Crimson Dragon Tower rooftop');
  const [outfit, setOutfit] = useState('a chameleon-cloak that glitches with digital static');
  const [situation, setSituation] = useState('preparing for a high-stakes data heist in the pouring rain');
  const [generatedScene, setGeneratedScene] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScene = useCallback(async () => {
    if (!location || !outfit || !situation) {
      setError('All fields must be filled out to generate a scene.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedScene('');

    try {
      const scene = await generateScene(location, outfit, situation);
      setGeneratedScene(scene);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the scene. The chrome might be corrupted.');
    } finally {
      setIsLoading(false);
    }
  }, [location, outfit, situation]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputGroup
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Binary District alley"
            icon={<LocationIcon />}
          />
          <InputGroup
            label="Character Form / Outfit"
            value={outfit}
            onChange={(e) => setOutfit(e.target.value)}
            placeholder="e.g., wearing a trench coat of shimmering pixels"
            icon={<CharacterIcon />}
          />
          <InputGroup
            label="Situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g., an intense confrontation with a rival"
            icon={<SituationIcon />}
          />
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerateScene}
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
                <SparklesIcon />
                <span className="ml-2">Generate Scene</span>
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

      <SceneDisplay sceneText={generatedScene} isLoading={isLoading} />
    </div>
  );
};

export default SceneGenerator;
