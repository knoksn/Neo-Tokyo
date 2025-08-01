
import React, { useState, useCallback } from 'react';
import { generateMerchIdeas, MerchIdeas } from '../services/geminiService';
import TextareaGroup from './TextareaGroup';
import MerchDisplay from './MerchDisplay';
import LoadingSpinner from './LoadingSpinner';
import { MerchIcon, ArtIcon } from './icons';

interface MerchGeneratorProps {
  generatedMerch: MerchIdeas | null;
  setGeneratedMerch: (merch: MerchIdeas | null) => void;
}

const MerchGenerator: React.FC<MerchGeneratorProps> = ({ generatedMerch, setGeneratedMerch }) => {
  const [asset, setAsset] = useState('Close-up shot of Maya Chen activating her Quantum Sense, eyes glowing with fractal light.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!asset) {
      setError('An asset description must be provided to generate merch ideas.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedMerch(null);

    try {
      const merch = await generateMerchIdeas(asset);
      setGeneratedMerch(merch);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate merch ideas. The replicator is offline.');
    } finally {
      setIsLoading(false);
    }
  }, [asset, setGeneratedMerch]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <TextareaGroup
          label="Art Asset or Scene Description"
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          placeholder="e.g., A panoramic view of the Crimson Dragon Tower at dusk."
          icon={<ArtIcon />}
          rows={3}
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
                    <span className="ml-2">Manufacturing...</span>
                </>
                ) : (
                <>
                    <MerchIcon />
                    <span className="ml-2">Generate Merch Ideas</span>
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

      <MerchDisplay merch={generatedMerch} isLoading={isLoading} />
    </div>
  );
};

export default MerchGenerator;
