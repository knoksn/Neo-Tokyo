import React, { useState, useCallback } from 'react';
import { Workflow } from '../services/geminiService';
import { toWorkflowMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface WorkflowDisplayProps {
  workflow: Workflow | null;
  isLoading: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-t border-slate-700/50 pt-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const WorkflowDisplay: React.FC<WorkflowDisplayProps> = ({ workflow, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (workflow) {
      const markdown = toWorkflowMarkdown(workflow);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [workflow]);

  if (isLoading || !workflow) {
    return null;
  }

  const markdownContent = toWorkflowMarkdown(workflow);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {workflow.title}
          </h2>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>

        <Section title="Workflow Steps">
            {workflow.workflow_steps.map((step, i) => (
                <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-cyan-300 text-lg">{step.step}</h4>
                    <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">{step.details}</p>
                </div>
            ))}
        </Section>
        
        <Section title="Folder Naming Conventions">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-slate-900 p-4 rounded-md border border-slate-700 max-h-[60vh] overflow-auto">
                <code>{workflow.folder_conventions}</code>
            </pre>
        </Section>
        
        <Section title="Automation Tips">
            <ul className="list-disc list-inside space-y-2 text-gray-300">
                {workflow.automation_tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
        </Section>
        
        <Section title="Versioning & Crediting">
             <ul className="list-disc list-inside space-y-2 text-gray-300">
                {workflow.versioning_and_crediting.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </Section>

      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${workflow.title}`}>
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

export default WorkflowDisplay;