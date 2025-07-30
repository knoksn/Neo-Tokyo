
import React from 'react';

interface SceneDisplayProps {
  sceneText: string;
  isLoading: boolean;
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({ sceneText, isLoading }) => {
  if (isLoading || !sceneText) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">Generated Scene</h2>
      <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
        {sceneText}
      </div>
    </div>
  );
};

export default SceneDisplay;
