import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CanonPrompt {
  character: string;
  location: string;
  art_prompt: string;
}

const prompts: CanonPrompt[] = [
    {
        character: 'Maya Chen',
        location: 'Quantum Quarter',
        art_prompt: 'Hyper-detailed cyberpunk shapeshifter, chrome suit, glitch FX, rain-soaked fractal city, neon, cinematic, --style cybernoir'
    },
    {
        character: 'Dr. Victoria Thane',
        location: 'Void Factory',
        art_prompt: 'Cybernetic fembot scientist, emerald eyes, chrome tentacles, reality warp, glitching void, black latex, --style cosmic glitch'
    },
    {
        character: 'Marcus Zhang',
        location: 'Binary District',
        art_prompt: 'Quantum phase-shifting man, neon fractal energy, static aura, AR overlays, in glitching digital street market, --style timeline fracture'
    },
    {
        character: 'The Elder Algorithm',
        location: 'Crimson Dragon Tower',
        art_prompt: 'Hyperdimensional golden AI, data fractal god, looming over cyberpunk cityscape, reality bending, Maya foreground, --style cosmic horror'
    }
];

const PromptCard: React.FC<{ prompt: CanonPrompt }> = ({ prompt }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(prompt.art_prompt);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    }, [prompt.art_prompt]);

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-4 flex flex-col">
            <header>
                <h2 className="text-xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
                    {prompt.character}
                </h2>
                <p className="text-md text-gray-400 italic">in the {prompt.location}</p>
            </header>
            <div className="border-t border-slate-700/50 pt-4 flex-grow relative">
                <p className="text-gray-300 whitespace-pre-wrap font-mono bg-black/20 p-4 rounded-md border border-slate-700/80 text-sm">
                    {prompt.art_prompt}
                </p>
                <button
                    onClick={handleCopy}
                    className="absolute top-6 right-2 flex items-center justify-center p-2 bg-slate-700 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                    aria-label="Copy art prompt to clipboard"
                >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
        </div>
    );
};


const CanonPromptsDisplay: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <header className="text-center">
            <h1 className="text-3xl font-bold text-cyan-300">Canon Art Prompts</h1>
            <p className="text-lg text-gray-400 mt-1">A curated list of foundational art prompts for key scenes.</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {prompts.map(p => (
                <PromptCard key={p.character + p.location} prompt={p} />
            ))}
        </div>
    </div>
  );
};

export default CanonPromptsDisplay;