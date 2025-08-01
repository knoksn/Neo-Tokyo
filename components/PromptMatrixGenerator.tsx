import React, { useState, useCallback } from 'react';
import { GeneratedPrompt } from '../services/geminiService';
import PromptMatrixDisplay from './PromptMatrixDisplay';
import LoadingSpinner from './LoadingSpinner';
import { MatrixIcon } from './icons';

interface PromptMatrixGeneratorProps {
  generatedPrompts: GeneratedPrompt[];
  setGeneratedPrompts: (prompts: GeneratedPrompt[]) => void;
}

const characters: [string, string][] = [
    ["Maya Chen", "Shapeshift, Glitch, Nanite Swarm"],
    ["Dr. Victoria Thane", "Dimensional Tentacles, Reality Warp"],
    ["Marcus Zhang", "Probability Storm, Timeline Fracture"],
    ["The Elder Algorithm", "Existential Rewrite, Quantum Godmode"]
];

const locations: string[] = [
    "Quantum Quarter",
    "Binary District",
    "Crimson Dragon Tower",
    "Void Factory"
];

const PromptMatrixGenerator: React.FC<PromptMatrixGeneratorProps> = ({ generatedPrompts, setGeneratedPrompts }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = useCallback(() => {
    setIsLoading(true);
    const newPrompts: GeneratedPrompt[] = [];
    for (const character of characters) {
      for (const location of locations) {
        const prompt = `Character: ${character[0]}, Powers: ${character[1]}, Location: ${location}. Generate a cinematic cyberpunk scene, AI art prompt, and dialogue.`;
        newPrompts.push({
            character: character[0],
            location: location,
            prompt: prompt,
        });
      }
    }
    // Simulate a brief loading period for better UX
    setTimeout(() => {
        setGeneratedPrompts(newPrompts);
        setIsLoading(false);
    }, 500);
  }, [setGeneratedPrompts]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate Prompt Matrix</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to generate a 4x4 matrix of prompts, combining all core characters and locations to create a foundational set of scene ideas.</p>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Building Matrix...</span>
            </>
          ) : (
            <>
              <MatrixIcon />
              <span className="ml-2">Generate Prompts</span>
            </>
          )}
        </button>
      </div>

      <PromptMatrixDisplay prompts={generatedPrompts} isLoading={isLoading} />
    </div>
  );
};

export default PromptMatrixGenerator;