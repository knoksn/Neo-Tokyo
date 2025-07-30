
import React, { useState, useCallback } from 'react';
import { generateQuest, Quest } from '../services/geminiService';
import QuestDisplay from './QuestDisplay';
import LoadingSpinner from './LoadingSpinner';
import { QuestIcon } from './icons';

const QuestGenerator: React.FC = () => {
  const [generatedQuest, setGeneratedQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedQuest(null);
    try {
      const quest = await generateQuest();
      setGeneratedQuest(quest);
    } catch (err) {
      console.error(err);
      setError('A glitch in the datastream prevented quest generation. Try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Generate a Side Quest</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Click the button to generate a complete side quest for Maya Chen, including a hook, challenges, a moral dilemma, and a hint of a larger conspiracy.</p>
        <button
          onClick={handleGenerateQuest}
          disabled={isLoading}
          className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Compiling...</span>
            </>
          ) : (
            <>
              <QuestIcon />
              <span className="ml-2">Generate Quest</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <QuestDisplay quest={generatedQuest} isLoading={isLoading} />
    </div>
  );
};

export default QuestGenerator;
