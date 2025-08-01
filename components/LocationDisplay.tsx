import React, { useState, useCallback } from 'react';
import { LocationSnippet } from '../services/geminiService';
import { toLocationSnippetMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface LocationDisplayProps {
  snippet: LocationSnippet | null;
  isLoading: boolean;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ snippet, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (snippet) {
      const markdown = toLocationSnippetMarkdown(snippet);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [snippet]);

  if (isLoading || !snippet) {
    return null;
  }

  const markdownContent = toLocationSnippetMarkdown(snippet);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {snippet.name}
          </h2>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>
        
        <div className="space-y-4">
          <InfoBlock title="Setting Description" content={snippet.setting_description} />
        </div>

        <div className="border-t border-slate-700/50 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ListBlock title="Cultural & Tech Features" items={snippet.cultural_features} />
            <ListBlock title="Visual Motifs for AI Art" items={snippet.visual_motifs} />
        </div>

        <div className="border-t border-slate-700/50 pt-6">
             <h3 className="font-bold text-cyan-400 mb-2 text-xl">Story Hook / Hazard</h3>
             <p className="text-gray-300">
                {snippet.story_hook}
            </p>
        </div>

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${snippet.name}`}>
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
    </>
  );
};

interface InfoBlockProps {
    title: string;
    content: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ title, content }) => (
    <div>
        <h3 className="text-xl font-bold text-cyan-400 mb-2">{title}</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
    </div>
);

interface ListBlockProps {
    title: string;
    items: string[];
}

const ListBlock: React.FC<ListBlockProps> = ({ title, items }) => (
    <div>
        <h3 className="text-xl font-bold text-cyan-400 mb-2">{title}</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);


export default LocationDisplay;