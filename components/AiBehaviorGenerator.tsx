
import React, { useState, useCallback } from 'react';
import { generateAiBehavior, AiBehavior } from '../services/geminiService';
import AiBehaviorDisplay from './AiBehaviorDisplay';
import LoadingSpinner from './LoadingSpinner';
import { AiBehaviorIcon } from './icons';

interface AiBehaviorGeneratorProps {
  generatedAiBehavior: AiBehavior | null;
  setGeneratedAiBehavior: (behavior: AiBehavior | null) => void;
}

const AiBehaviorGenerator: React.FC<AiBehaviorGeneratorProps> = ({ generatedAiBehavior, setGeneratedAiBehavior }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedAiBehavior(null);
    try {
      const behavior = await generateAiBehavior();
      setGeneratedAiBehavior(behavior);
    } catch (err) {
      console.error(err);
      setError('A behavioral matrix error occurred. The AI core is unstable.');
    } finally {
      setIsLoading(false);
    }
  }, [setGeneratedAiBehavior]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate an Adaptive AI Behavior</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to design a dynamic AI for an enemy or ally, detailing how it adapts to Maya's forms, tactics, and choices over time.</p>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Initializing...</span>
            </>
          ) : (
            <>
              <AiBehaviorIcon />
              <span className="ml-2">Generate AI Behavior</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <AiBehaviorDisplay behavior={generatedAiBehavior} isLoading={isLoading} />
    </div>
  );
};

export default AiBehaviorGenerator;
