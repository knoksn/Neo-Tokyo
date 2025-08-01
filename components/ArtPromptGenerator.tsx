
import React, { useState, useCallback } from 'react';
import { generateArtPrompt, generateImage } from '../services/geminiService';
import SelectGroup from './SelectGroup';
import ArtPromptDisplay from './ArtPromptDisplay';
import LoadingSpinner from './LoadingSpinner';
import { ArtIcon, MoodIcon, TransformIcon } from './icons';

interface ArtPromptGeneratorProps {
  generatedPrompt: string;
  setGeneratedPrompt: (prompt: string) => void;
  generatedImage: string;
  setGeneratedImage: (image: string) => void;
}

const ArtPromptGenerator: React.FC<ArtPromptGeneratorProps> = ({ generatedPrompt, setGeneratedPrompt, generatedImage, setGeneratedImage }) => {
  const [transformation, setTransformation] = useState('liquid mercury');
  const [mood, setMood] = useState('mysterious');
  const [isLoadingPrompt, setIsLoadingPrompt] = useState<boolean>(false);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [promptError, setPromptError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleGeneratePrompt = useCallback(async () => {
    setIsLoadingPrompt(true);
    setPromptError(null);
    setGeneratedPrompt('');
    setGeneratedImage(''); // Clear previous image when generating new prompt
    setImageError(null);

    try {
      const prompt = await generateArtPrompt(transformation, mood);
      setGeneratedPrompt(prompt);
    } catch (err) {
      console.error(err);
      setPromptError('An error occurred while generating the art prompt. The signal is unstable.');
    } finally {
      setIsLoadingPrompt(false);
    }
  }, [transformation, mood, setGeneratedPrompt, setGeneratedImage]);

  const handleGenerateImage = useCallback(async (prompt: string) => {
    if (!prompt) {
        setImageError("Cannot generate an image without a prompt.");
        return;
    }
    setIsLoadingImage(true);
    setImageError(null);
    setGeneratedImage('');

    try {
        const imageBytes = await generateImage(prompt);
        setGeneratedImage(imageBytes);
    } catch (err) {
        console.error(err);
        setImageError("Image generation failed. The art-bot might be offline.");
    } finally {
        setIsLoadingImage(false);
    }
  }, [setGeneratedImage]);

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
            disabled={isLoadingPrompt || isLoadingImage}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoadingPrompt ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Rendering Prompt...</span>
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

      {promptError && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{promptError}</p>
        </div>
      )}

      <ArtPromptDisplay 
        promptText={generatedPrompt} 
        isLoadingPrompt={isLoadingPrompt}
        onGenerateImage={handleGenerateImage}
        isLoadingImage={isLoadingImage}
        imageError={imageError}
        generatedImage={generatedImage}
      />
    </div>
  );
};

export default ArtPromptGenerator;
