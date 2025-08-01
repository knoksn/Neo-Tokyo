import React, { useState, useCallback } from 'react';
import { generateStoryboard, Storyboard } from '../services/geminiService';
import TextareaGroup from './TextareaGroup';
import StoryboardDisplay from './StoryboardDisplay';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon, QuestIcon } from './icons';

interface StoryboardGeneratorProps {
  generatedStoryboard: Storyboard | null;
  setGeneratedStoryboard: (storyboard: Storyboard | null) => void;
}

const StoryboardGenerator: React.FC<StoryboardGeneratorProps> = ({ generatedStoryboard, setGeneratedStoryboard }) => {
  const [sceneDescription, setSceneDescription] = useState('Maya faces Marcus on a glitching rooftop as timelines collapse');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!sceneDescription) {
      setError('A scene description must be provided.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedStoryboard(null);

    try {
      const storyboard = await generateStoryboard(sceneDescription);
      setGeneratedStoryboard(storyboard);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'A critical error occurred while generating the storyboard. A timeline has collapsed.');
    } finally {
      setIsLoading(false);
    }
  }, [sceneDescription, setGeneratedStoryboard]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <TextareaGroup
          label="Scene Description"
          value={sceneDescription}
          onChange={(e) => setSceneDescription(e.target.value)}
          placeholder="e.g., Maya faces Marcus on a glitching rooftop as timelines collapse"
          icon={<QuestIcon />}
          rows={4}
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
                    <span className="ml-2">Scripting...</span>
                </>
                ) : (
                <>
                    <SparklesIcon />
                    <span className="ml-2">Generate Storyboard-to-Script</span>
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

      <StoryboardDisplay storyboard={generatedStoryboard} />
    </div>
  );
};

export default StoryboardGenerator;