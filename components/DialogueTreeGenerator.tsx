
import React, { useState, useCallback } from 'react';
import { generateDialogueTree, DialogueTree } from '../services/geminiService';
import TextareaGroup from './TextareaGroup';
import DialogueTreeDisplay from './DialogueTreeDisplay';
import LoadingSpinner from './LoadingSpinner';
import { DialogueTreeIcon, SparklesIcon } from './icons';

interface DialogueTreeGeneratorProps {
  generatedTree: DialogueTree | null;
  setGeneratedTree: (tree: DialogueTree | null) => void;
}

const DialogueTreeGenerator: React.FC<DialogueTreeGeneratorProps> = ({ generatedTree, setGeneratedTree }) => {
  const [topic, setTopic] = useState("Maya Chen negotiates with Dr. Victoria Thane over a piece of pre-collapse technology.");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic) {
      setError('A negotiation topic must be provided.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedTree(null);

    try {
      const tree = await generateDialogueTree(topic);
      setGeneratedTree(tree);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate dialogue tree. The conversation path is corrupted.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, setGeneratedTree]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <TextareaGroup
          label="Negotiation Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Maya tries to convince a faction leader to grant her safe passage."
          icon={<DialogueTreeIcon />}
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
                <span className="ml-2">Calculating Outcomes...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span className="ml-2">Generate Dialogue Tree</span>
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

      <DialogueTreeDisplay tree={generatedTree} isLoading={isLoading} />
    </div>
  );
};

export default DialogueTreeGenerator;