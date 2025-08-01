
import React, { useState, useCallback } from 'react';
import { ProjectBlueprint } from '../services/geminiService';
import { toProjectBlueprintMarkdown } from '../services/markdownService';
import Modal from './Modal';
import { GithubIcon, CopyIcon, CheckIcon } from './icons';

interface ProjectBlueprintDisplayProps {
  blueprint: ProjectBlueprint | null;
  isLoading: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-t border-slate-700/50 pt-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const AssetCard: React.FC<{ name: string; description: string }> = ({ name, description }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <h4 className="font-bold text-cyan-300">{name}</h4>
        <p className="text-sm text-gray-300 mt-1">{description}</p>
    </div>
);


const ProjectBlueprintDisplay: React.FC<ProjectBlueprintDisplayProps> = ({ blueprint, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (blueprint) {
      const markdown = toProjectBlueprintMarkdown(blueprint);
      navigator.clipboard.writeText(markdown);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  }, [blueprint]);

  if (isLoading || !blueprint) {
    return null;
  }

  const markdownContent = toProjectBlueprintMarkdown(blueprint);

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-6">
        <header className="relative">
          <h2 className="text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
            {blueprint.project_title} - Project Blueprint
          </h2>
          <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 bg-slate-800/50 rounded-full transition-colors duration-200 hover:bg-slate-700 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
              aria-label="Preview as Markdown"
          >
              <GithubIcon />
          </button>
        </header>

        <Section title="Core Characters & FX">
            {blueprint.core_characters.map(asset => <AssetCard key={asset.name} {...asset} />)}
        </Section>
        
        <Section title="City Environment Modules">
            {blueprint.environment_modules.map(asset => <AssetCard key={asset.name} {...asset} />)}
        </Section>
        
        <Section title="HUD/UI Assets">
            {blueprint.hud_ui_assets.map(asset => <AssetCard key={asset.name} {...asset} />)}
        </Section>

        <Section title="DLC/Expansion Packs">
            {blueprint.dlc_packs.map(asset => <AssetCard key={asset.name} {...asset} />)}
        </Section>

        <Section title="Audio & SFX Categories">
            {blueprint.audio_sfx.map(cat => <AssetCard key={cat.category} name={cat.category} description={cat.description} />)}
        </Section>

        <Section title="Suggested Folder Structure">
            <pre className="whitespace-pre-wrap font-mono text-sm bg-slate-900 p-4 rounded-md border border-slate-700 max-h-[60vh] overflow-auto">
                <code>
                    {blueprint.folder_structure}
                </code>
            </pre>
        </Section>

      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Markdown Preview: ${blueprint.project_title}`}>
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

export default ProjectBlueprintDisplay;