import React, { useState, useCallback } from 'react';
import { GeneratedPrompt } from '../services/geminiService';
import { CopyIcon, CheckIcon } from './icons';

interface PromptMatrixDisplayProps {
  prompts: GeneratedPrompt[];
  isLoading: boolean;
}

const PromptMatrixDisplay: React.FC<PromptMatrixDisplayProps> = ({ prompts, isLoading }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = useCallback((textToCopy: string, index: number) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  }, []);

  if (isLoading || prompts.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in">
        <header className="mb-4">
             <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
                Prompt Matrix
            </h2>
             <p className="text-gray-400 mt-1">16 generated prompts. Export the full list as a CSV using the "Export Project" button.</p>
        </header>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-cyan-300 uppercase bg-slate-800/60">
                    <tr>
                        <th scope="col" className="px-4 py-3">Character</th>
                        <th scope="col" className="px-4 py-3">Location</th>
                        <th scope="col" className="px-4 py-3">Generated Prompt</th>
                        <th scope="col" className="px-4 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {prompts.map((p, index) => (
                        <tr key={index} className="border-b border-slate-700 hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-medium whitespace-nowrap">{p.character}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{p.location}</td>
                            <td className="px-4 py-3 font-mono text-xs">{p.prompt}</td>
                            <td className="px-4 py-3 text-center">
                                <button
                                    onClick={() => handleCopy(p.prompt, index)}
                                    className="p-2 text-gray-400 bg-slate-800/50 rounded-md transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                                    aria-label="Copy prompt"
                                >
                                    {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default PromptMatrixDisplay;