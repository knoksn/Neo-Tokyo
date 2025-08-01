
import React, { useState, useCallback } from 'react';
import { Blueprint } from '../services/geminiService';
import { toBlueprintMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface BlueprintDisplayProps {
  blueprint: Blueprint | null;
  isLoading: boolean;
}

const nodeTypeColors: { [key: string]: string } = {
  'Event': 'border-rose-500/80',
  'Function Call': 'border-sky-500/80',
  'Flow Control': 'border-amber-400/80',
  'Variable': 'border-violet-500/80',
  'Action': 'border-emerald-500/80',
  'Macro': 'border-gray-400/80',
};

const nodeTypePillColors: { [key: string]: string } = {
  'Event': 'bg-rose-500/20 text-rose-300',
  'Function Call': 'bg-sky-500/20 text-sky-300',
  'Flow Control': 'bg-amber-400/20 text-amber-200',
  'Variable': 'bg-violet-500/20 text-violet-300',
  'Action': 'bg-emerald-500/20 text-emerald-300',
  'Macro': 'bg-gray-400/20 text-gray-300',
};


const BlueprintDisplay: React.FC<BlueprintDisplayProps> = ({ blueprint, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (blueprint) {
      const markdown = toBlueprintMarkdown(blueprint);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [blueprint]);

  if (isLoading || !blueprint) {
    return null;
  }

  const markdownContent = toBlueprintMarkdown(blueprint);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-8">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {blueprint.title}
          </h2>
          <p className="text-gray-300 mt-1 max-w-prose">{blueprint.description}</p>
           <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
              <InfoBlock title="Implementation Notes" content={blueprint.notes} />
              <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-3">Variables</h3>
                  <div className="space-y-3">
                      {blueprint.variables.map((variable, index) => (
                          <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                              <p className="font-bold text-gray-200">{variable.name}</p>
                              <p className="text-sm text-cyan-300">{variable.type}</p>
                              <p className="text-xs text-gray-400 mt-1">{variable.description}</p>
                          </div>
                      ))}
                      {blueprint.variables.length === 0 && <p className="text-gray-500 text-sm">No variables required for this logic.</p>}
                  </div>
              </div>
          </div>
          <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Node Graph</h3>
              <div className="space-y-3">
                  {blueprint.nodes.map((node) => (
                      <div key={node.id} className={`bg-slate-800/70 border-l-4 rounded-md p-4 ${nodeTypeColors[node.type] || 'border-slate-600'}`}>
                          <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-lg text-gray-100">
                                <span className="text-cyan-400">#{node.id}</span> {node.name}
                              </h4>
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${nodeTypePillColors[node.type] || 'bg-slate-700 text-slate-300'}`}>
                                  {node.type}
                              </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">{node.description}</p>
                          {node.connections?.length > 0 && (
                              <div className="text-xs text-gray-400 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                  <span className="font-semibold text-gray-300">Connects to: </span>&nbsp;
                                  {node.connections.map(id => `#${id}`).join(', ')}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${blueprint.title}`}>
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
        <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed bg-black/20 p-3 rounded-md border border-slate-700">{content}</p>
    </div>
);

export default BlueprintDisplay;
