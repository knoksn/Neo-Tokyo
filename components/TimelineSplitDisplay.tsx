
import React, { useState, useCallback } from 'react';
import { TimelineSplit, TimelineBranch } from '../services/geminiService';
import { toTimelineSplitMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface TimelineSplitDisplayProps {
  split: TimelineSplit | null;
  isLoading: boolean;
}

const BranchCard: React.FC<{ branch: TimelineBranch }> = ({ branch }) => {
    const [isArtPromptCopied, setIsArtPromptCopied] = useState(false);

    const handleArtPromptCopy = useCallback(() => {
        navigator.clipboard.writeText(branch.art_prompt);
        setIsArtPromptCopied(true);
        setTimeout(() => setIsArtPromptCopied(false), 2500);
    }, [branch.art_prompt]);
    
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-md shadow-cyan-500/5 animate-fade-in space-y-4 flex flex-col">
            <header>
                <h3 className="text-xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
                    Branch: {branch.title}
                </h3>
            </header>
            <div className="border-t border-slate-700/50 pt-4 space-y-3">
                 <InfoBlock title="Outcome Summary" content={branch.outcome_summary} />
                 <InfoBlock title="Scene Hook" content={branch.scene_hook} isQuote={true} />
            </div>
             <div className="border-t border-slate-700/50 pt-4 mt-auto flex-shrink-0 relative">
                <h4 className="font-bold text-cyan-400 mb-2 text-sm">AI Art Prompt</h4>
                <p className="text-gray-300 font-mono bg-black/20 p-3 pr-10 rounded-md border border-slate-700/80 text-xs">
                    {branch.art_prompt}
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

const TimelineSplitDisplay: React.FC<TimelineSplitDisplayProps> = ({ split, isLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = useCallback(() => {
        if (split) {
            const markdown = toTimelineSplitMarkdown(split);
            navigator.clipboard.writeText(markdown);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        }
    }, [split]);

    if (isLoading || !split) {
        return null;
    }
    
    const markdownContent = toTimelineSplitMarkdown(split);

    return (
        <div className="mt-8 space-y-8">
            <header className="text-center relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-cyan-300">Timeline Split: {split.event_title}</h2>
                 <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-4 right-4 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                    aria-label="Preview full split as Markdown"
                >
                    <GithubIcon />
                </button>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {split.branches.map((branch) => (
                    <BranchCard key={branch.title} branch={branch} />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${split.event_title}`}>
                <div className="relative">
                    <button
                        onClick={handleCopy}
                        className="absolute -top-1 -right-1 flex items-center justify-center px-3 py-1.5 bg-slate-700 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
                        aria-label="Copy Markdown to clipboard"
                    >
                        {isCopied ? (
                            <>
                                <CheckIcon />
                                <span className="ml-2 text-sm">Copied!</span>
                            </>
                        ) : (
                            <>
                                <CopyIcon />
                                <span className="ml-2 text-sm">Copy</span>
                            </>
                        )}
                    </button>
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-slate-900/70 p-4 rounded-md border border-slate-700 max-h-[60vh] overflow-auto">
                        <code>
                            {markdownContent}
                        </code>
                    </pre>
                </div>
            </Modal>
        </div>
    );
};

interface InfoBlockProps {
    title: string;
    content: string;
    isQuote?: boolean;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ title, content, isQuote }) => (
    <div>
        <h4 className="text-sm font-bold text-cyan-400 mb-1">{title}</h4>
        {isQuote ? (
             <blockquote className="border-l-2 border-cyan-500/50 pl-2 italic text-gray-300 text-sm">
                {content}
            </blockquote>
        ) : (
            <p className="text-sm text-gray-300">{content}</p>
        )}
    </div>
);

export default TimelineSplitDisplay;
