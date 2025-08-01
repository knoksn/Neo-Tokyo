
import React from 'react';

interface Contributor {
  name: string;
  role?: string;
}

const contributors: Contributor[] = [
  { name: "SocialSophia" },
  { name: "Knoksen" },
  { name: "Gemini AI" },
  { name: "NightCafe Community" },
  { name: "Lucy", role: "DLC Artist" }
];

const CreditsDisplay: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <header className="text-center">
            <h1 className="text-3xl font-bold text-cyan-300">Project Credits</h1>
            <p className="text-lg text-gray-400 mt-1">The talented individuals and communities behind Neo-Tokyo Noir.</p>
        </header>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 max-w-lg mx-auto shadow-lg shadow-cyan-500/10">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">Contributors</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
                {contributors.map(contributor => (
                    <li key={contributor.name}>
                        {contributor.name}
                        {contributor.role && <span className="text-gray-400 italic ml-2">({contributor.role})</span>}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default CreditsDisplay;
