import React, { useState, useCallback } from 'react';
import { generateDlcCharacter, DlcCharacter } from '../services/geminiService';
import InputGroup from './InputGroup';
import DlcCharacterDisplay from './DlcCharacterDisplay';
import LoadingSpinner from './LoadingSpinner';
import { DlcIcon, CharacterIcon, MoodIcon, SparklesIcon } from './icons';

interface DlcCharacterGeneratorProps {
  generatedDlcCharacter: DlcCharacter | null;
  setGeneratedDlcCharacter: (character: DlcCharacter | null) => void;
}

const DlcCharacterGenerator: React.FC<DlcCharacterGeneratorProps> = ({ generatedDlcCharacter, setGeneratedDlcCharacter }) => {
  const [name, setName] = useState('Solaris');
  const [theme, setTheme] = useState('Rogue solar-tech vigilante from a parallel Neo-Tokyo');
  const [power, setPower] = useState('Aureum Chorus – Summons light-based holographic servitors');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!name || !theme || !power) {
      setError('All fields must be filled out to generate a DLC character.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedDlcCharacter(null);

    try {
      const character = await generateDlcCharacter(name, theme, power);
      setGeneratedDlcCharacter(character);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate DLC character. The creative core is offline.');
    } finally {
      setIsLoading(false);
    }
  }, [name, theme, power, setGeneratedDlcCharacter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputGroup
            label="DLC Character Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Solaris"
            icon={<CharacterIcon />}
          />
          <InputGroup
            label="Theme / Concept"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g., Rogue solar-tech vigilante"
            icon={<MoodIcon />}
          />
          <InputGroup
            label="Signature Power"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            placeholder="e.g., Summons light-based servitors"
            icon={<SparklesIcon />}
          />
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Initializing DLC...</span>
              </>
            ) : (
              <>
                <DlcIcon />
                <span className="ml-2">Generate DLC Character</span>
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

      <DlcCharacterDisplay dlcCharacter={generatedDlcCharacter} isLoading={isLoading} />
    </div>
  );
};

export default DlcCharacterGenerator;
