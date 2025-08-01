import React, { useState, useCallback } from 'react';
import { generateWorkflow, Workflow } from '../services/geminiService';
import WorkflowDisplay from './WorkflowDisplay';
import LoadingSpinner from './LoadingSpinner';
import { WorkflowIcon } from './icons';

interface WorkflowGeneratorProps {
  generatedWorkflow: Workflow | null;
  setGeneratedWorkflow: (workflow: Workflow | null) => void;
}

const WorkflowGenerator: React.FC<WorkflowGeneratorProps> = ({ generatedWorkflow, setGeneratedWorkflow }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedWorkflow(null);
    try {
      const workflow = await generateWorkflow();
      setGeneratedWorkflow(workflow);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate workflow. The system architect is unavailable.');
    } finally {
      setIsLoading(false);
    }
  }, [setGeneratedWorkflow]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate End-to-End Workflow</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to generate a complete workflow for generating, tagging, and importing assets into Google AI Studio and Unreal Engine 5.6.</p>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Designing Pipeline...</span>
            </>
          ) : (
            <>
              <WorkflowIcon />
              <span className="ml-2">Generate Workflow</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <WorkflowDisplay workflow={generatedWorkflow} isLoading={isLoading} />
    </div>
  );
};

export default WorkflowGenerator;