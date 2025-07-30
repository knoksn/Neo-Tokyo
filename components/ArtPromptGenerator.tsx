
import React, { useState, useCallback } from 'react';
import { generateArtPrompt } from '../services/geminiService';
import SelectGroup from './SelectGroup';
import ArtPromptDisplay from './ArtPromptDisplay';
import LoadingSpinner from './LoadingSpinner';
import { ArtIcon, MoodIcon, TransformIcon } from './icons';

const ArtPromptGenerator: React.FC = () => {
  const [transformation, setTransformation] = useState('liquid mercury');
  const [mood, setMood] = useState('mysterious');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePrompt = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      const prompt = await generateArtPrompt(transformation, mood);
      setGeneratedPrompt(prompt);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the art prompt. The signal is unstable.');
    } finally {
      setIsLoading(false);
    }
  }, [transformation, mood]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectGroup
            label="Transformation State"
            value={transformation}
            onChange={(e) => setTransformation(e.target.value)}
            icon={<TransformIcon />}
          >
            <option value="liquid mercury flowing over her skin">Liquid Mercury</option>
            <option value="crystalline diamond armor forming on her limbs">Diamond Armor</option>
            <option value="her iconic cybernetic combat form with glowing circuitry">Iconic Cyber Form</option>
          </SelectGroup>
          <SelectGroup
            label="Mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            icon={<MoodIcon />}
          >
            <option value="seductive and dangerous">Seductive</option>
            <option value="powerful and defiant">Powerful</option>
            <option value="mysterious and haunted">Mysterious</option>
          </SelectGroup>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleGeneratePrompt}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Rendering...</span>
              </>
            ) : (
              <>
                <ArtIcon />
                <span className="ml-2">Generate Art Prompt</span>
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

      <ArtPromptDisplay promptText={generatedPrompt} isLoading={isLoading} />
    </div>
  );
};

export default ArtPromptGenerator;
