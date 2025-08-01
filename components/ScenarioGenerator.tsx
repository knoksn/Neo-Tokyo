
import React, { useState, useCallback } from 'react';
import { generateScenario, Scenario } from '../services/geminiService';
import InputGroup from './InputGroup';
import ScenarioDisplay from './ScenarioDisplay';
import LoadingSpinner from './LoadingSpinner';
import { EnvironmentIcon, EnemyIcon, ScenarioIcon } from './icons';

interface ScenarioGeneratorProps {
  generatedScenario: Scenario | null;
  setGeneratedScenario: (scenario: Scenario | null) => void;
}

const ScenarioGenerator: React.FC<ScenarioGeneratorProps> = ({ generatedScenario, setGeneratedScenario }) => {
  const [environment, setEnvironment] = useState('a rain-slicked corporate data spire rooftop');
  const [enemies, setEnemies] = useState('two elite cyber-samurai guards and a hovering surveillance drone');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateScenario = useCallback(async () => {
    if (!environment || !enemies) {
      setError('Environment and Enemy fields must be filled out.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedScenario(null);

    try {
      const scenario = await generateScenario(environment, enemies);
      setGeneratedScenario(scenario);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the scenario. The simulation is unstable.');
    } finally {
      setIsLoading(false);
    }
  }, [environment, enemies, setGeneratedScenario]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup
            label="Environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            placeholder="e.g., A quantum physics lab"
            icon={<EnvironmentIcon />}
          />
          <InputGroup
            label="Enemy Types"
            value={enemies}
            onChange={(e) => setEnemies(e.target.value)}
            placeholder="e.g., Rival shapeshifters, corporate security"
            icon={<EnemyIcon />}
          />
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerateScenario}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Designing...</span>
              </>
            ) : (
              <>
                <ScenarioIcon />
                <span className="ml-2">Generate Scenario</span>
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

      <ScenarioDisplay scenario={generatedScenario} isLoading={isLoading} />
    </div>
  );
};

export default ScenarioGenerator;
