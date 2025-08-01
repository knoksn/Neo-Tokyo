
import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface KeyScene {
  title: string;
  setting: string;
  characters: string;
  narrative: string;
  tactical_move: string;
  dialogue: { speaker: string; line: string }[];
  art_prompt: string;
}

const scenes: KeyScene[] = [
  {
    title: 'Glitchstorm in Quantum Quarter',
    setting: 'Quantum Quarter, night, buildings fracture between timelines, neon rain.',
    characters: 'Maya Chen, Marcus Zhang, AR refugees',
    narrative: 'Maya’s silhouette flickers along a glitching rooftop. She sees Marcus phasing between realities, his outline blurred, arms sparking with probability. The city beneath shifts between endless versions: a crowded night market, a war zone, a ghost town—one after another, each second.',
    tactical_move: 'Maya splits into three nanite clones, each attacking from a different quantum branch. Marcus counters by collapsing all probable outcomes, forcing a timeline singularity.',
    dialogue: [
        { speaker: 'Maya', line: 'Choose your future, Zhang!' },
        { speaker: 'Marcus', line: 'No. Tonight, every future chooses us.' }
    ],
    art_prompt: 'Cinematic cyberpunk rooftop, two dueling figures in glitching rain, quantum storm FX, fractal city, neon lights, timeline overlays, --style hyperreal noir',
  }
];

const InfoBlock: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div>
        <h3 className="font-bold text-cyan-400 mb-1">{title}</h3>
        <p className="text-gray-300 text-sm">{content}</p>
    </div>
);


const SceneCard: React.FC<{ scene: KeyScene }> = ({ scene }) => {
    const [isArtPromptCopied, setIsArtPromptCopied] = useState(false);

    const handleArtPromptCopy = useCallback(() => {
        navigator.clipboard.writeText(scene.art_prompt);
        setIsArtPromptCopied(true);
        setTimeout(() => setIsArtPromptCopied(false), 2500);
    }, [scene.art_prompt]);

    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-4">
            <header>
                <h2 className="text-2xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
                    {scene.title}
                </h2>
            </header>
            <div className="border-t border-slate-700/50 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <InfoBlock title="Setting" content={scene.setting} />
                    <InfoBlock title="Characters Present" content={scene.characters} />
                    <InfoBlock title="Narrative" content={scene.narrative} />
                    <InfoBlock title="Tactical Move" content={scene.tactical_move} />
                </div>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-cyan-400 mb-1">Dialogue</h3>
                        <div className="border-l-2 border-cyan-500/50 pl-3 space-y-2">
                        {scene.dialogue.map((d, i) => (
                            <p key={i} className="text-gray-300 text-sm italic">
                                <span className="font-semibold not-italic">{d.speaker}:</span> "{d.line}"
                            </p>
                        ))}
                        </div>
                    </div>
                     <div className="relative pt-2">
                        <h3 className="font-bold text-cyan-400 mb-1">AI Art Prompt</h3>
                        <p className="text-gray-300 whitespace-pre-wrap font-mono bg-black/20 p-3 pr-10 rounded-md border border-slate-700/80 text-xs">
                            {scene.art_prompt}
                        </p>
                        <button
                            onClick={handleArtPromptCopy}
                            className="absolute top-10 right-2 flex items-center justify-center p-1.5 bg-slate-700 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                            aria-label="Copy art prompt to clipboard"
                        >
                            {isArtPromptCopied ? <CheckIcon /> : <CopyIcon />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const KeyScenesDisplay: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <header className="text-center">
            <h1 className="text-3xl font-bold text-cyan-300">Key Narrative Scenes</h1>
            <p className="text-lg text-gray-400 mt-1">Pivotal moments and encounters in the Neo-Tokyo Noir saga.</p>
        </header>
        <div className="space-y-6">
            {scenes.map(scene => (
                <SceneCard key={scene.title} scene={scene} />
            ))}
        </div>
    </div>
  );
};

export default KeyScenesDisplay;
