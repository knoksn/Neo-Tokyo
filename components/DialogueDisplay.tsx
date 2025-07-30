
import React from 'react';
import { Dialogue } from '../services/geminiService';

interface DialogueDisplayProps {
  dialogue: Dialogue | null;
  isLoading: boolean;
}

const DialogueDisplay: React.FC<DialogueDisplayProps> = ({ dialogue, isLoading }) => {
  if (isLoading || !dialogue) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
          {dialogue.title}
        </h2>
        <p className="text-gray-400 italic mt-1">{dialogue.setting}</p>
      </header>

      <div className="border-t border-slate-700/50 pt-6">
        <blockquote className="border-l-4 border-cyan-500 pl-4">
          <p className="text-lg text-gray-200 italic">"{dialogue.npc_line}"</p>
        </blockquote>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Maya's Responses:</h3>
        <div className="space-y-4">
          {dialogue.maya_options.map((option, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 transition-shadow hover:shadow-md hover:shadow-cyan-500/10">
              <h4 className="font-bold text-cyan-300 mb-2 text-lg">
                [{option.type}]
              </h4>
              <p className="text-gray-300 mb-3">
                <span className="font-semibold text-gray-100">Maya:</span> "{option.line}"
              </p>
              <div className="border-l-2 border-slate-600 pl-3 space-y-2 text-sm">
                <p className="text-gray-400">
                    <span className="font-semibold text-gray-200">NPC Reaction:</span> {option.npc_reaction}
                </p>
                 <p className="text-cyan-400">
                    <span className="font-semibold text-cyan-200">Outcome:</span> {option.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DialogueDisplay;
