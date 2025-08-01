
import React, { useState, useCallback } from 'react';
import { generateBlueprint, Blueprint } from '../services/geminiService';
import TextareaGroup from './TextareaGroup';
import BlueprintDisplay from './BlueprintDisplay';
import LoadingSpinner from './LoadingSpinner';
import { BlueprintIcon, QuestIcon } from './icons';

interface BlueprintGeneratorProps {
  generatedBlueprint: Blueprint | null;
  setGeneratedBlueprint: (blueprint: Blueprint | null) => void;
}

const BlueprintGenerator: React.FC<BlueprintGeneratorProps> = ({ generatedBlueprint, setGeneratedBlueprint }) => {
  const [logic, setLogic] = useState('A door that requires a keycard to open. When the player overlaps with a trigger volume, check if they have the keycard (using a gameplay tag). If they do, play a timeline to open the door. The door should automatically close after 5 seconds.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateBlueprint = useCallback(async () => {
    if (!logic) {
      setError('You must describe the Blueprint logic to generate a plan.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedBlueprint(null);

    try {
      const blueprint = await generateBlueprint(logic);
      setGeneratedBlueprint(blueprint);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the Blueprint. The logic core is offline.');
    } finally {
      setIsLoading(false);
    }
  }, [logic, setGeneratedBlueprint]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <TextareaGroup
          label="Blueprint Logic Description"
          value={logic}
          onChange={(e) => setLogic(e.target.value)}
          placeholder="e.g., An enemy that patrols between two points and attacks the player if they get too close."
          icon={<QuestIcon />}
          rows={5}
        />
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerateBlueprint}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Visualizing...</span>
              </>
            ) : (
              <>
                <BlueprintIcon />
                <span className="ml-2">Generate Blueprint Plan</span>
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

      <BlueprintDisplay blueprint={generatedBlueprint} isLoading={isLoading} />
    </div>
  );
};

export default BlueprintGenerator;
