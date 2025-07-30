
import React, { useState, useCallback } from 'react';
import { generateDialogue, Dialogue } from '../services/geminiService';
import InputGroup from './InputGroup';
import DialogueDisplay from './DialogueDisplay';
import LoadingSpinner from './LoadingSpinner';
import { NpcIcon, SituationIcon, DialogueIcon } from './icons';

const DialogueGenerator: React.FC = () => {
  const [npcRole, setNpcRole] = useState('An enigmatic information broker known as "Echo"');
  const [situation, setSituation] = useState('Maya meets them in a virtual reality teahouse to trade a secret for a crucial piece of data.');
  const [generatedDialogue, setGeneratedDialogue] = useState<Dialogue | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDialogue = useCallback(async () => {
    if (!npcRole || !situation) {
      setError('Both NPC Role and Situation must be filled out.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedDialogue(null);

    try {
      const dialogue = await generateDialogue(npcRole, situation);
      setGeneratedDialogue(dialogue);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the dialogue. The connection might be unstable.');
    } finally {
      setIsLoading(false);
    }
  }, [npcRole, situation]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup
            label="NPC Name / Role"
            value={npcRole}
            onChange={(e) => setNpcRole(e.target.value)}
            placeholder="e.g., A grizzled ex-cop"
            icon={<NpcIcon />}
          />
          <InputGroup
            label="Situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g., A tense negotiation in a noodle bar"
            icon={<SituationIcon />}
          />
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerateDialogue}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Writing...</span>
              </>
            ) : (
              <>
                <DialogueIcon />
                <span className="ml-2">Generate Dialogue</span>
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

      <DialogueDisplay dialogue={generatedDialogue} isLoading={isLoading} />
    </div>
  );
};

export default DialogueGenerator;
