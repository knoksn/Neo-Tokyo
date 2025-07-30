
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
import { NpcIcon, QuestIcon, SparklesIcon, ArtIcon, DialogueIcon, ScenarioIcon, LoreIcon, AiBehaviorIcon, PlaytestIcon } from './components/icons';

type ActiveTab = 'scene' | 'npc' | 'quest' | 'art' | 'dialogue' | 'scenario' | 'lore' | 'ai_behavior' | 'playtesting';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scene');

  return (
    <div className="min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-wider [text-shadow:_0_0_10px_theme(colors.cyan.500)]">
            Neo-Tokyo Noir
          </h1>
          <p className="text-lg text-gray-400 mt-2">World-Building Suite</p>
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
          {activeTab === 'scene' && <SceneGenerator />}
          {activeTab === 'npc' && <NpcGenerator />}
          {activeTab === 'quest' && <QuestGenerator />}
          {activeTab === 'art' && <ArtPromptGenerator />}
          {activeTab === 'dialogue' && <DialogueGenerator />}
          {activeTab === 'scenario' && <ScenarioGenerator />}
          {activeTab === 'lore' && <LoreGenerator />}
          {activeTab === 'ai_behavior' && <AiBehaviorGenerator />}
          {activeTab === 'playtesting' && <PlaytestingScenarioGenerator />}
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