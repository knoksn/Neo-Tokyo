
import React from 'react';
import { SceneMatrixEntry } from '../services/geminiService';

interface SceneMatrixDisplayProps {
  entries: SceneMatrixEntry[];
}

const SceneMatrixDisplay: React.FC<SceneMatrixDisplayProps> = ({ entries }) => {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in">
        <header className="mb-4">
             <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
                Scene Matrix Results
            </h2>
             <p className="text-gray-400 mt-1">Export the full matrix as a Markdown file using the "Export Project" button.</p>
        </header>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-cyan-300 uppercase bg-slate-800/60">
                    <tr>
                        <th scope="col" className="px-4 py-3">Character</th>
                        <th scope="col" className="px-4 py-3">Location</th>
                        <th scope="col" className="px-4 py-3">Scene</th>
                        <th scope="col" className="px-4 py-3">Tactical Move</th>
                        <th scope="col" className="px-4 py-3">Dialogue</th>
                        <th scope="col" className="px-4 py-3">Art Prompt</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={index} className="border-b border-slate-700 hover:bg-slate-800/40 animate-fade-in">
                            <td className="px-4 py-3 font-medium whitespace-nowrap">{entry.character}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{entry.location}</td>
                            <td className="px-4 py-3 min-w-[300px]">{entry.scene_description}</td>
                            <td className="px-4 py-3 min-w-[300px]">{entry.tactical_move}</td>
                            <td className="px-4 py-3 italic">"{entry.dialogue}"</td>
                            <td className="px-4 py-3 font-mono text-xs min-w-[400px]">{entry.art_prompt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default SceneMatrixDisplay;