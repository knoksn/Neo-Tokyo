import React, { useState, useCallback } from 'react';
import { CreativeBatch, NewCharacter, NewLocation, NewDlcIdea } from '../services/geminiService';
import { toCreativeBatchMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface CreativeBatchDisplayProps {
  batch: CreativeBatch | null;
  isLoading: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg shadow-cyan-500/10" open>
    <summary className="text-xl font-bold text-cyan-400 p-4 cursor-pointer [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
      {title}
    </summary>
    <div className="p-4 border-t border-slate-700/50">
      {children}
    </div>
  </details>
);

const CharacterCard: React.FC<{ char: NewCharacter }> = ({ char }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h4 className="font-bold text-cyan-300 text-lg">{char.name}</h4>
        <p className="text-sm text-gray-300 mt-1"><span className="font-semibold">Bio:</span> {char.bio}</p>
        <p className="text-sm text-gray-300 mt-1"><span className="font-semibold">Power:</span> {char.power}</p>
        <p className="text-sm text-gray-300 mt-1"><span className="font-semibold">Weakness:</span> {char.weakness}</p>
        <p className="text-xs text-cyan-300 mt-2 font-mono bg-black/20 p-2 rounded-md">Art Prompt: {char.art_prompt}</p>
    </div>
);

const LocationCard: React.FC<{ loc: NewLocation }> = ({ loc }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h4 className="font-bold text-cyan-300 text-lg">{loc.name}</h4>
        <p className="text-sm text-gray-300 mt-1"><span className="font-semibold">Description:</span> {loc.description}</p>
        <p className="text-sm text-gray-300 mt-1"><span className="font-semibold">Feature:</span> {loc.feature}</p>
        <p className="text-xs text-cyan-300 mt-2 font-mono bg-black/20 p-2 rounded-md">Art Prompt: {loc.art_prompt}</p>
    </div>
);

const DlcCard: React.FC<{ dlc: NewDlcIdea }> = ({ dlc }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h4 className="font-bold text-cyan-300 text-lg">{dlc.name}</h4>
        <p className="text-sm text-gray-300 mt-1"><span className="font-semibold">Theme:</span> {dlc.theme}</p>
        <p className="text-sm text-gray-300 mt-1"><span className="font-semibold">Hook:</span> {dlc.hook}</p>
        <p className="text-sm text-gray-300 mt-1"><span className="font-semibold">Challenge:</span> {dlc.challenge}</p>
    </div>
);

const CreativeBatchDisplay: React.FC<CreativeBatchDisplayProps> = ({ batch, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (batch) {
      const markdown = toCreativeBatchMarkdown(batch);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [batch]);

  if (isLoading || !batch) {
    return null;
  }

  const markdownContent = toCreativeBatchMarkdown(batch);

  return (
    <>
      <div className="mt-6 animate-fade-in space-y-6">
        <header className="relative text-center">
            <h2 className="text-3xl font-bold text-cyan-300">Creative Asset Batch</h2>
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                aria-label="Preview as Markdown"
            >
                <GithubIcon />
            </button>
        </header>

        <Section title="New Characters">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {batch.characters.map(char => <CharacterCard key={char.name} char={char} />)}
            </div>
        </Section>
        
        <Section title="New Locations">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {batch.locations.map(loc => <LocationCard key={loc.name} loc={loc} />)}
            </div>
        </Section>
        
        <Section title="New AI Art Prompts">
            <div className="space-y-2">
            {batch.art_prompts.map((prompt, i) => (
                <p key={i} className="text-sm text-cyan-300 font-mono bg-slate-800/50 p-3 rounded-md border border-slate-700">{prompt}</p>
            ))}
            </div>
        </Section>

        <Section title="New DLC Ideas">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {batch.dlc_ideas.map(dlc => <DlcCard key={dlc.name} dlc={dlc} />)}
            </div>
        </Section>

      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Markdown Preview: Creative Batch">
        <div className="relative">
            <button
                onClick={handleCopy}
                className="absolute -top-1 -right-1 flex items-center justify-center px-3 py-1.5 bg-slate-700 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
                aria-label="Copy Markdown to clipboard"
            >
                {isCopied ? ( <><CheckIcon /><span className="ml-2 text-sm">Copied!</span></> ) : ( <><CopyIcon /><span className="ml-2 text-sm">Copy</span></> )}
            </button>
          <pre className="whitespace-pre-wrap font-mono text-sm bg-slate-900/70 p-4 rounded-md border border-slate-700 max-h-[60vh] overflow-auto">
            <code>{markdownContent}</code>
          </pre>
        </div>
      </Modal>
    </>
  );
};

export default CreativeBatchDisplay;