import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface DlcCharacter {
  name: string;
  role: string;
  ability: string;
  visuals: string;
  entryScene: string;
  artPrompt: string;
  challenge: string;
}

const solaris: DlcCharacter = {
  name: 'Solaris',
  role: 'Rogue solar-tech vigilante from a parallel Neo-Tokyo',
  ability: 'Aureum Chorus – Summons light-based holographic servitors',
  visuals: 'Golden armor, scythe of pure energy, solar flare glitches',
  entryScene: 'Solaris descends in a riot of gold light during a blackout. Maya is momentarily blinded as drones fizzle and crash.',
  artPrompt: 'Golden cyberpunk hero, luminous scythe, hologram servants, neon city night, riot scene, cinematic FX, --style solar noir',
  challenge: 'Remix Solaris’s battle with Maya—submissions open, winner is canon in the next expansion!',
};

const InfoBlock: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div>
        <h3 className="font-bold text-cyan-400 mb-1">{title}</h3>
        <p className="text-gray-300 text-sm">{content}</p>
    </div>
);

const DlcCharacterCard: React.FC<{ character: DlcCharacter }> = ({ character }) => {
    const [isArtPromptCopied, setIsArtPromptCopied] = useState(false);

    const handleArtPromptCopy = useCallback(() => {
        navigator.clipboard.writeText(character.artPrompt);
        setIsArtPromptCopied(true);
        setTimeout(() => setIsArtPromptCopied(false), 2500);
    }, [character.artPrompt]);

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-4">
            <header>
                <h2 className="text-2xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
                    {character.name}
                </h2>
                <p className="text-md text-gray-400 italic">{character.role}</p>
            </header>
            <div className="border-t border-slate-700/50 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <InfoBlock title="Signature Ability" content={character.ability} />
                    <InfoBlock title="Visual Motifs" content={character.visuals} />
                    <InfoBlock title="Entry Scene" content={character.entryScene} />
                </div>
                <div className="space-y-4">
                    <div className="relative">
                        <h3 className="font-bold text-cyan-400 mb-1">AI Art Prompt</h3>
                        <p className="text-gray-300 whitespace-pre-wrap font-mono bg-black/20 p-3 pr-10 rounded-md border border-slate-700/80 text-xs">
                            {character.artPrompt}
                        </p>
                        <button
                            onClick={handleArtPromptCopy}
                            className="absolute top-8 right-2 flex items-center justify-center p-1.5 bg-slate-700 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                            aria-label="Copy art prompt to clipboard"
                        >
                            {isArtPromptCopied ? <CheckIcon /> : <CopyIcon />}
                        </button>
                    </div>
                     <div>
                        <h3 className="font-bold text-cyan-400 mb-1">Community Challenge</h3>
                        <blockquote className="border-l-2 border-cyan-500/50 pl-3 italic text-gray-300 text-sm">
                            <p>{character.challenge}</p>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DlcShowcaseDisplay: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <header className="text-center">
            <h1 className="text-3xl font-bold text-cyan-300">DLC Showcase</h1>
            <p className="text-lg text-gray-400 mt-1">Featured downloadable content, characters, and expansions.</p>
        </header>
        <div className="space-y-6">
            <DlcCharacterCard character={solaris} />
        </div>
    </div>
  );
};

export default DlcShowcaseDisplay;