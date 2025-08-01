
import React, { useState, useCallback } from 'react';
import { generatePlaytestingScenario, PlaytestingScenario } from '../services/geminiService';
import PlaytestingScenarioDisplay from './PlaytestingScenarioDisplay';
import LoadingSpinner from './LoadingSpinner';
import { PlaytestIcon } from './icons';

interface PlaytestingScenarioGeneratorProps {
  generatedScenario: PlaytestingScenario | null;
  setGeneratedScenario: (scenario: PlaytestingScenario | null) => void;
}

const PlaytestingScenarioGenerator: React.FC<PlaytestingScenarioGeneratorProps> = ({ generatedScenario, setGeneratedScenario }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedScenario(null);
    try {
      const scenario = await generatePlaytestingScenario();
      setGeneratedScenario(scenario);
    } catch (err) {
      console.error(err);
      setError('Failed to generate playtesting scenario. The simulation core may be corrupted.');
    } finally {
      setIsLoading(false);
    }
  }, [setGeneratedScenario]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate a Playtesting Scenario</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to design a comprehensive QA script to stress-test the shapeshifting system, including edge cases, potential bugs, and debugging tools.</p>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Compiling Test...</span>
            </>
          ) : (
            <>
              <PlaytestIcon />
              <span className="ml-2">Generate Test Scenario</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <PlaytestingScenarioDisplay scenario={generatedScenario} isLoading={isLoading} />
    </div>
  );
};

export default PlaytestingScenarioGenerator;
