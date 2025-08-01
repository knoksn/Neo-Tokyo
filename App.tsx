
import React, { useState } from 'react';
import SceneGenerator from './components/SceneGenerator';
import NpcGenerator from './components/NpcGenerator';
import QuestGenerator from './components/QuestGenerator';
import ArtPromptGenerator from './components/ArtPromptGenerator';
import DialogueGenerator from './components/DialogueGenerator';
import ScenarioGenerator from './components/ScenarioGenerator';
import LoreGenerator from './components/LoreGenerator';
import AiBehaviorGenerator from './components/AiBehaviorGenerator';
import PlaytestingScenarioGenerator from './components/PlaytestingScenarioGenerator';
import BlueprintGenerator from './components/BlueprintGenerator';
import UeTransformer from './components/UeTransformer';
import { Npc, Quest, Dialogue, Scenario, Lore, AiBehavior, PlaytestingScenario, Blueprint } from './services/geminiService';
import { NpcIcon, QuestIcon, SparklesIcon, ArtIcon, DialogueIcon, ScenarioIcon, LoreIcon, AiBehaviorIcon, PlaytestIcon, BlueprintIcon, UeTransformerIcon, ExportIcon } from './components/icons';

type ActiveTab = 'scene' | 'npc' | 'quest' | 'art' | 'dialogue' | 'scenario' | 'lore' | 'ai_behavior' | 'playtesting' | 'blueprint' | 'ue_transformer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scene');

  // Lifted state for all generated assets
  const [generatedScene, setGeneratedScene] = useState<string>('');
  const [generatedNpc, setGeneratedNpc] = useState<Npc | null>(null);
  const [generatedQuest, setGeneratedQuest] = useState<Quest | null>(null);
  const [generatedArtPrompt, setGeneratedArtPrompt] = useState<string>('');
  const [generatedDialogue, setGeneratedDialogue] = useState<Dialogue | null>(null);
  const [generatedBlueprint, setGeneratedBlueprint] = useState<Blueprint | null>(null);
  const [generatedScenario, setGeneratedScenario] = useState<Scenario | null>(null);
  const [generatedLore, setGeneratedLore] = useState<Lore | null>(null);
  const [generatedAiBehavior, setGeneratedAiBehavior] = useState<AiBehavior | null>(null);
  const [generatedPlaytestingScenario, setGeneratedPlaytestingScenario] = useState<PlaytestingScenario | null>(null);

  const handleExport = () => {
    const exportData = {
      projectName: "Neo-Tokyo Noir: World-Building Suite Export",
      exportDate: new Date().toISOString(),
      assets: {
        scene: generatedScene || null,
        npc: generatedNpc || null,
        quest: generatedQuest || null,
        artPrompt: generatedArtPrompt || null,
        dialogue: generatedDialogue || null,
        blueprint: generatedBlueprint || null,
        scenario: generatedScenario || null,
        lore: generatedLore || null,
        aiBehavior: generatedAiBehavior || null,
        playtestingScenario: generatedPlaytestingScenario || null,
      },
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neo-tokyo-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-wider [text-shadow:_0_0_10px_theme(colors.cyan.500)]">
            Neo-Tokyo Noir
          </h1>
          <p className="text-lg text-gray-400 mt-2">World-Building Suite</p>
           <div className="absolute top-0 right-0">
             <button
                onClick={handleExport}
                className="flex items-center justify-center px-3 py-2 bg-slate-800 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                aria-label="Export all generated project data"
              >
                <ExportIcon />
                <span className="ml-2 text-sm hidden sm:inline">Export Project</span>
              </button>
          </div>
        </header>

        <div className="mb-6 flex justify-center">
          <div className="flex flex-wrap justify-center bg-slate-900/50 border border-slate-700/50 rounded-lg p-1 gap-1">
            <TabButton
              label="Scene"
              icon={<SparklesIcon />}
              isActive={activeTab === 'scene'}
              onClick={() => setActiveTab('scene')}
            />
            <TabButton
              label="NPC"
              icon={<NpcIcon />}
              isActive={activeTab === 'npc'}
              onClick={() => setActiveTab('npc')}
            />
             <TabButton
              label="Quest"
              icon={<QuestIcon />}
              isActive={activeTab === 'quest'}
              onClick={() => setActiveTab('quest')}
            />
             <TabButton
              label="Art Prompt"
              icon={<ArtIcon />}
              isActive={activeTab === 'art'}
              onClick={() => setActiveTab('art')}
            />
            <TabButton
              label="Dialogue"
              icon={<DialogueIcon />}
              isActive={activeTab === 'dialogue'}
              onClick={() => setActiveTab('dialogue')}
            />
            <TabButton
              label="Blueprint"
              icon={<BlueprintIcon />}
              isActive={activeTab === 'blueprint'}
              onClick={() => setActiveTab('blueprint')}
            />
             <TabButton
              label="UE Transformer"
              icon={<UeTransformerIcon />}
              isActive={activeTab === 'ue_transformer'}
              onClick={() => setActiveTab('ue_transformer')}
            />
            <TabButton
              label="Scenario"
              icon={<ScenarioIcon />}
              isActive={activeTab === 'scenario'}
              onClick={() => setActiveTab('scenario')}
            />
            <TabButton
              label="Lore"
              icon={<LoreIcon />}
              isActive={activeTab === 'lore'}
              onClick={() => setActiveTab('lore')}
            />
             <TabButton
              label="AI Behavior"
              icon={<AiBehaviorIcon />}
              isActive={activeTab === 'ai_behavior'}
              onClick={() => setActiveTab('ai_behavior')}
            />
            <TabButton
              label="Playtest"
              icon={<PlaytestIcon />}
              isActive={activeTab === 'playtesting'}
              onClick={() => setActiveTab('playtesting')}
            />
          </div>
        </div>

        <main>
          {activeTab === 'scene' && <SceneGenerator generatedScene={generatedScene} setGeneratedScene={setGeneratedScene} />}
          {activeTab === 'npc' && <NpcGenerator generatedNpc={generatedNpc} setGeneratedNpc={setGeneratedNpc} />}
          {activeTab === 'quest' && <QuestGenerator generatedQuest={generatedQuest} setGeneratedQuest={setGeneratedQuest} />}
          {activeTab === 'art' && <ArtPromptGenerator generatedPrompt={generatedArtPrompt} setGeneratedPrompt={setGeneratedArtPrompt} />}
          {activeTab === 'dialogue' && <DialogueGenerator generatedDialogue={generatedDialogue} setGeneratedDialogue={setGeneratedDialogue} />}
          {activeTab === 'blueprint' && <BlueprintGenerator generatedBlueprint={generatedBlueprint} setGeneratedBlueprint={setGeneratedBlueprint} />}
          {activeTab === 'ue_transformer' && <UeTransformer />}
          {activeTab === 'scenario' && <ScenarioGenerator generatedScenario={generatedScenario} setGeneratedScenario={setGeneratedScenario} />}
          {activeTab === 'lore' && <LoreGenerator generatedLore={generatedLore} setGeneratedLore={setGeneratedLore} />}
          {activeTab === 'ai_behavior' && <AiBehaviorGenerator generatedAiBehavior={generatedAiBehavior} setGeneratedAiBehavior={setGeneratedAiBehavior} />}
          {activeTab === 'playtesting' && <PlaytestingScenarioGenerator generatedScenario={generatedPlaytestingScenario} setGeneratedScenario={setGeneratedPlaytestingScenario} />}
        </main>
      </div>
    </div>
  );
};

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    aria-pressed={isActive}
    className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none ${
      isActive
        ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/20'
        : 'text-gray-300 hover:bg-slate-800/60'
    }`}
  >
    {icon}
    <span className="ml-2 hidden sm:inline">{label}</span>
  </button>
);


export default App;
