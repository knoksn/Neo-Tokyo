
import React, { useState, useCallback } from 'react';
import { BatchCharacterProfile } from '../services/geminiService';
import { CopyIcon, CheckIcon } from './icons';

interface CharacterBatchDisplayProps {
  profiles: BatchCharacterProfile[];
}

const InfoBlock: React.FC<{ title: string; content: string; isQuote?: boolean }> = ({ title, content, isQuote }) => (
    <div>
        <h3 className="font-bold text-cyan-400 mb-1">{title}</h3>
        {isQuote ? (
            <blockquote className="text-gray-300 text-sm italic border-l-2 border-slate-600 pl-3">"{content}"</blockquote>
        ) : (
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{content}</p>
        )}
    </div>
);

const CharacterCard: React.FC<{ profile: BatchCharacterProfile }> = ({ profile }) => {
    const [isArtPromptCopied, setIsArtPromptCopied] = useState(false);

    const handleArtPromptCopy = useCallback(() => {
        navigator.clipboard.writeText(profile.art_prompt);
        setIsArtPromptCopied(true);
        setTimeout(() => setIsArtPromptCopied(false), 2500);
    }, [profile.art_prompt]);
    
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-4">
            <header>
                <h2 className="text-2xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
                    {profile.name}
                </h2>
            </header>
            <div className="border-t border-slate-700/50 pt-4 space-y-3">
                <InfoBlock title="Role & Backstory" content={profile.role_and_backstory} />
                <InfoBlock title="Powers & Signature Move" content={profile.powers_and_signature_move} />
                <InfoBlock title="Appearance" content={profile.appearance} />
                <InfoBlock title="Weakness" content={profile.weakness} />
                <InfoBlock title="Dialogue Sample" content={profile.dialogue_sample} isQuote={true} />
            </div>
            <div className="border-t border-slate-700/50 pt-4 relative">
                <h4 className="font-bold text-cyan-400 mb-2 text-sm">AI Art Prompt</h4>
                <p className="text-gray-300 font-mono bg-black/20 p-3 pr-10 rounded-md border border-slate-700/80 text-xs">
                    {profile.art_prompt}
                </p>
                <button
                    onClick={handleArtPromptCopy}
                    className="absolute top-5 right-2 flex items-center justify-center p-1.5 bg-slate-700 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                    aria-label="Copy art prompt to clipboard"
                >
                    {isArtPromptCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
        </div>
    );
};

const CharacterBatchDisplay: React.FC<CharacterBatchDisplayProps> = ({ profiles }) => {
  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-8">
        <header className="text-center">
            <h1 className="text-3xl font-bold text-cyan-300">Generated Character Cast</h1>
            <p className="text-lg text-gray-400 mt-1">Export the full batch as a Markdown file using the "Export Project" button.</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profiles.map(profile => (
                <CharacterCard key={profile.name} profile={profile} />
            ))}
        </div>
    </div>
  );
};

export default CharacterBatchDisplay;
