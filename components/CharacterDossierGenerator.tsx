
import React, { useState, useCallback } from 'react';
import { generateCharacterDossier, CharacterDossier } from '../services/geminiService';
import InputGroup from './InputGroup';
import CharacterDossierDisplay from './CharacterDossierDisplay';
import LoadingSpinner from './LoadingSpinner';
import { CharacterIcon, SparklesIcon, DossierIcon } from './icons';

interface CharacterDossierGeneratorProps {
  generatedDossier: CharacterDossier | null;
  setGeneratedDossier: (dossier: CharacterDossier | null) => void;
}

const CharacterDossierGenerator: React.FC<CharacterDossierGeneratorProps> = ({ generatedDossier, setGeneratedDossier }) => {
  const [name, setName] = useState('Maya Chen');
  const [role, setRole] = useState('Shapeshifting Guardian');
  const [powers, setPowers] = useState('Shapeshift, Glitch, Nanite Swarm, Quantum Sense');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDossier = useCallback(async () => {
    if (!name || !role || !powers) {
      setError('All fields must be filled out to generate a dossier.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedDossier(null);

    try {
      const dossier = await generateCharacterDossier(name, role, powers);
      setGeneratedDossier(dossier);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the character dossier. The records are corrupted.');
    } finally {
      setIsLoading(false);
    }
  }, [name, role, powers, setGeneratedDossier]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputGroup
            label="Character Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Dr. Victoria Thane"
            icon={<CharacterIcon />}
          />
          <InputGroup
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Cybernetic Antagonist"
            icon={<DossierIcon />}
          />
          <InputGroup
            label="Key Powers"
            value={powers}
            onChange={(e) => setPowers(e.target.value)}
            placeholder="e.g., Dimensional Tentacles, Reality Warp"
            icon={<SparklesIcon />}
          />
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerateDossier}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Compiling Dossier...</span>
              </>
            ) : (
              <>
                <DossierIcon />
                <span className="ml-2">Generate Dossier</span>
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

      <CharacterDossierDisplay dossier={generatedDossier} isLoading={isLoading} />
    </div>
  );
};

export default CharacterDossierGenerator;
