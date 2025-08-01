
import React, { useState, useCallback } from 'react';
import { generateGlossaryEntry, GlossaryEntry } from '../services/geminiService';
import SelectGroup from './SelectGroup';
import InputGroup from './InputGroup';
import GlossaryDisplay from './GlossaryDisplay';
import LoadingSpinner from './LoadingSpinner';
import { GlossaryIcon, SparklesIcon } from './icons';

interface GlossaryGeneratorProps {
  generatedEntry: GlossaryEntry | null;
  setGeneratedEntry: (entry: GlossaryEntry | null) => void;
}

const GlossaryGenerator: React.FC<GlossaryGeneratorProps> = ({ generatedEntry, setGeneratedEntry }) => {
  const [entryType, setEntryType] = useState('Technology');
  const [entryName, setEntryName] = useState('Scent-Coded Currency');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!entryType || !entryName) {
      setError('Both Entry Type and Entry Name must be provided.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedEntry(null);

    try {
      const entry = await generateGlossaryEntry(entryType, entryName);
      setGeneratedEntry(entry);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate glossary entry. The archives are corrupted.');
    } finally {
      setIsLoading(false);
    }
  }, [entryType, entryName, setGeneratedEntry]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectGroup
            label="Entry Type"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value)}
            icon={<GlossaryIcon />}
          >
            <option value="Technology">Technology</option>
            <option value="Faction">Faction</option>
            <option value="Location">Location</option>
            <option value="Power">Power</option>
            <option value="Slang">Slang</option>
          </SelectGroup>
          <InputGroup
            label="Entry Name"
            value={entryName}
            onChange={(e) => setEntryName(e.target.value)}
            placeholder="e.g., Scent-Coded Currency"
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
                <span className="ml-2">Defining...</span>
              </>
            ) : (
              <>
                <GlossaryIcon />
                <span className="ml-2">Generate Glossary Entry</span>
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

      <GlossaryDisplay entry={generatedEntry} isLoading={isLoading} />
    </div>
  );
};

export default GlossaryGenerator;