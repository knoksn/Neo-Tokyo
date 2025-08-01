
import React, { useState, useCallback } from 'react';
import { generateTimelineSplit, TimelineSplit } from '../services/geminiService';
import TextareaGroup from './TextareaGroup';
import TimelineSplitDisplay from './TimelineSplitDisplay';
import LoadingSpinner from './LoadingSpinner';
import { TimelineSplitIcon, SparklesIcon } from './icons';

interface TimelineSplitGeneratorProps {
  generatedSplit: TimelineSplit | null;
  setGeneratedSplit: (split: TimelineSplit | null) => void;
}

const TimelineSplitGenerator: React.FC<TimelineSplitGeneratorProps> = ({ generatedSplit, setGeneratedSplit }) => {
  const [event, setEvent] = useState("Maya’s choice to merge with the nanite hive or remain independent");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!event) {
      setError('An event description must be provided.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedSplit(null);

    try {
      const split = await generateTimelineSplit(event);
      setGeneratedSplit(split);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate timeline split. A paradox was detected.');
    } finally {
      setIsLoading(false);
    }
  }, [event, setGeneratedSplit]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <TextareaGroup
          label="Pivotal Event"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="e.g., What if Maya failed to stop the Crimson Dragon assassination?"
          icon={<TimelineSplitIcon />}
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
                <span className="ml-2">Fracturing Timelines...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span className="ml-2">Generate Timeline Split</span>
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

      <TimelineSplitDisplay split={generatedSplit} isLoading={isLoading} />
    </div>
  );
};

export default TimelineSplitGenerator;
