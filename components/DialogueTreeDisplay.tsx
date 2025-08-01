
import React, { useState, useCallback } from 'react';
import { DialogueTree, DialogueBranch } from '../services/geminiService';
import { toDialogueTreeMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface DialogueTreeDisplayProps {
  tree: DialogueTree | null;
  isLoading: boolean;
}

const BranchCard: React.FC<{ branch: DialogueBranch }> = ({ branch }) => {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-md shadow-cyan-500/5 animate-fade-in space-y-4 flex flex-col">
            <header className="flex-shrink-0">
                <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-lg text-gray-200">
                    "{branch.dialogue_option}"
                </blockquote>
            </header>
            <div className="border-t border-slate-700/50 pt-4 space-y-3">
                 <InfoBlock title="Likely Outcome" content={branch.outcome_summary} />
                 <InfoBlock title="In-World Consequence" content={branch.in_world_consequence} />
            </div>
        </div>
    );
};

const DialogueTreeDisplay: React.FC<DialogueTreeDisplayProps> = ({ tree, isLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = useCallback(() => {
        if (tree) {
            const markdown = toDialogueTreeMarkdown(tree);
            navigator.clipboard.writeText(markdown);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        }
    }, [tree]);

    if (isLoading || !tree) {
        return null;
    }
    
    const markdownContent = toDialogueTreeMarkdown(tree);

    return (
        <div className="mt-8 space-y-8">
            <header className="text-center relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-cyan-300">Dialogue Tree: {tree.topic}</h2>
                 <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-4 right-4 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                    aria-label="Preview full dialogue tree as Markdown"
                >
                    <GithubIcon />
                </button>
            </header>
            <div className="space-y-6">
                {tree.branches.map((branch, index) => (
                    <BranchCard key={index} branch={branch} />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${tree.topic}`}>
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
}

const InfoBlock: React.FC<InfoBlockProps> = ({ title, content }) => (
    <div>
        <h4 className="text-sm font-bold text-cyan-400 mb-1">{title}</h4>
        <p className="text-sm text-gray-300">{content}</p>
    </div>
);

export default DialogueTreeDisplay;