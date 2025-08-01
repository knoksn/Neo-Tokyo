
import React, { useState, useCallback } from 'react';
import { generateCharacterProfile, CharacterProfile } from '../services/geminiService';
import InputGroup from './InputGroup';
import CharacterProfileDisplay from './CharacterProfileDisplay';
import LoadingSpinner from './LoadingSpinner';
import { CharacterIcon, SituationIcon, TransformIcon, SparklesIcon } from './icons';

interface CharacterProfileGeneratorProps {
  generatedProfile: CharacterProfile | null;
  setGeneratedProfile: (profile: CharacterProfile | null) => void;
}

const CharacterProfileGenerator: React.FC<CharacterProfileGeneratorProps> = ({ generatedProfile, setGeneratedProfile }) => {
  const [concept, setConcept] = useState('Marcus Zhang');
  const [situation, setSituation] = useState('Confrontation in a quantum speakeasy');
  const [transformation, setTransformation] = useState('Collapses into three timelines at once');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateProfile = useCallback(async () => {
    if (!concept || !situation || !transformation) {
      setError('All fields must be filled out to generate a profile.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedProfile(null);

    try {
      const profile = await generateCharacterProfile(concept, situation, transformation);
      setGeneratedProfile(profile);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the character profile. A data ghost corrupted the stream.');
    } finally {
      setIsLoading(false);
    }
  }, [concept, situation, transformation, setGeneratedProfile]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputGroup
            label="Character Name / Concept"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="e.g., Maya Chen"
            icon={<CharacterIcon />}
          />
          <InputGroup
            label="Situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g., Cornered in the Neon-drenched Binary District"
            icon={<SituationIcon />}
          />
          <InputGroup
            label="Signature Transformation / Move"
            value={transformation}
            onChange={(e) => setTransformation(e.target.value)}
            placeholder="e.g., Deploys 'Quantum Sense' to track ICE patterns"
            icon={<TransformIcon />}
          />
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerateProfile}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Analyzing...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span className="ml-2">Generate Profile</span>
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

      <CharacterProfileDisplay profile={generatedProfile} isLoading={isLoading} />
    </div>
  );
};

export default CharacterProfileGenerator;
