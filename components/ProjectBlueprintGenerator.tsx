
import React, { useState, useCallback } from 'react';
import { generateProjectBlueprint, ProjectBlueprint } from '../services/geminiService';
import ProjectBlueprintDisplay from './ProjectBlueprintDisplay';
import LoadingSpinner from './LoadingSpinner';
import { ProjectBlueprintIcon } from './icons';

interface ProjectBlueprintGeneratorProps {
  generatedBlueprint: ProjectBlueprint | null;
  setGeneratedBlueprint: (blueprint: ProjectBlueprint | null) => void;
}

const ProjectBlueprintGenerator: React.FC<ProjectBlueprintGeneratorProps> = ({ generatedBlueprint, setGeneratedBlueprint }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedBlueprint(null);
    try {
      const blueprint = await generateProjectBlueprint();
      setGeneratedBlueprint(blueprint);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'A critical error occurred while generating the project blueprint. The master schematic is corrupted.');
    } finally {
      setIsLoading(false);
    }
  }, [setGeneratedBlueprint]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate Unreal Engine Project Blueprint</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to generate a prioritized list of core assets and a suggested folder structure for a new Unreal Engine project based on Neo-Tokyo Noir.</p>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Initializing Project...</span>
            </>
          ) : (
            <>
              <ProjectBlueprintIcon />
              <span className="ml-2">Generate Project Blueprint</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <ProjectBlueprintDisplay blueprint={generatedBlueprint} isLoading={isLoading} />
    </div>
  );
};

export default ProjectBlueprintGenerator;