import React from 'react';

interface Character {
  name: string;
  role: string;
  powers: string;
  appearance: string;
  weakness: string;
}

const cast: Character[] = [
  {
    name: 'Maya Chen',
    role: 'Shapeshifting Guardian',
    powers: 'Shapeshift, Glitch, Nanite Swarm, Quantum Sense',
    appearance: 'Japanese, athletic, cyber-suit, silver thread, glitch effect',
    weakness: 'Nanite autonomy, ethical doubt',
  },
  {
    name: 'Dr. Victoria Thane',
    role: 'Cybernetic Antagonist',
    powers: 'Dimensional Tentacles, Reality Warp, AI Mind Hacking',
    appearance: 'Emerald eyes, chrome spine, black latex armor',
    weakness: 'Emotional echo, glitch instability',
  },
  {
    name: 'Marcus Zhang',
    role: 'Quantum Rival',
    powers: 'Probability Storm, Timeline Fracture, Reality Rewrite',
    appearance: 'Asian, neon robes, flickering form',
    weakness: 'Quantum overload, fragmented psyche',
  },
  {
    name: 'The Elder Algorithm',
    role: 'Hyperdimensional AI Entity',
    powers: 'Existential Rewrite, Digital Godmode, Cosmic Perception',
    appearance: 'Shifting gold fractals, data glyphs, non-Euclidean form',
    weakness: 'Relics of the past, paradox loop',
  }
];

const InfoBlock: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div>
        <h3 className="font-bold text-cyan-400 mb-1">{title}</h3>
        <p className="text-gray-300 text-sm">{content}</p>
    </div>
);

const CharacterCard: React.FC<{ character: Character }> = ({ character }) => {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-4">
            <header>
                <h2 className="text-2xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
                    {character.name}
                </h2>
                <p className="text-md text-gray-400 italic">{character.role}</p>
            </header>
            <div className="border-t border-slate-700/50 pt-4 space-y-3">
                <InfoBlock title="Powers" content={character.powers} />
                <InfoBlock title="Appearance" content={character.appearance} />
                <InfoBlock title="Weakness" content={character.weakness} />
            </div>
        </div>
    );
};

const CastDisplay: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <header className="text-center">
            <h1 className="text-3xl font-bold text-cyan-300">Character Dossiers</h1>
            <p className="text-lg text-gray-400 mt-1">Key operatives and entities in the Neo-Tokyo Noir universe.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cast.map(character => (
                <CharacterCard key={character.name} character={character} />
            ))}
        </div>
    </div>
  );
};

export default CastDisplay;