import React, { useState, useCallback } from 'react';
import { generateRemixChallenge, RemixChallenge } from '../services/geminiService';
import InputGroup from './InputGroup';
import RemixChallengeDisplay from './RemixChallengeDisplay';
import LoadingSpinner from './LoadingSpinner';
import { ArtistChallengeIcon, MoodIcon } from './icons';

interface RemixChallengeGeneratorProps {
  generatedChallenge: RemixChallenge | null;
  setGeneratedChallenge: (challenge: RemixChallenge | null) => void;
}

const RemixChallengeGenerator: React.FC<RemixChallengeGeneratorProps> = ({ generatedChallenge, setGeneratedChallenge }) => {
  const [topic, setTopic] = useState('Solaris vs. Maya battle in the Quantum Quarter');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic) {
      setError('A topic must be provided to generate a challenge.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedChallenge(null);

    try {
      const challenge = await generateRemixChallenge(topic);
      setGeneratedChallenge(challenge);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate remix challenge. Comms interference detected.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, setGeneratedChallenge]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <InputGroup
          label="DLC Focus"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., The heist at Crimson Dragon Tower"
          icon={<MoodIcon />}
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
                    <span className="ml-2">Broadcasting...</span>
                </>
                ) : (
                <>
                    <ArtistChallengeIcon />
                    <span className="ml-2">Generate Remix Challenge</span>
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

      <RemixChallengeDisplay challenge={generatedChallenge} isLoading={isLoading} />
    </div>
  );
};

export default RemixChallengeGenerator;