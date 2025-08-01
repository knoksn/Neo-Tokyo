import React, { useState, useCallback } from 'react';
import { generateCreativeBatch, CreativeBatch } from '../services/geminiService';
import CreativeBatchDisplay from './CreativeBatchDisplay';
import LoadingSpinner from './LoadingSpinner';
import { CreativeBatchIcon } from './icons';

interface CreativeBatchGeneratorProps {
  generatedBatch: CreativeBatch | null;
  setGeneratedBatch: (batch: CreativeBatch | null) => void;
}

const CreativeBatchGenerator: React.FC<CreativeBatchGeneratorProps> = ({ generatedBatch, setGeneratedBatch }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedBatch(null);
    try {
      const batch = await generateCreativeBatch();
      setGeneratedBatch(batch);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate creative batch. The world-engine is overloaded.');
    } finally {
      setIsLoading(false);
    }
  }, [setGeneratedBatch]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate Creative Asset Batch</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to generate a complete package of new assets: 3 characters, 3 locations, 3 art prompts, and 3 DLC ideas.</p>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Ideating...</span>
            </>
          ) : (
            <>
              <CreativeBatchIcon />
              <span className="ml-2">Generate Creative Batch</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <CreativeBatchDisplay batch={generatedBatch} isLoading={isLoading} />
    </div>
  );
};

export default CreativeBatchGenerator;