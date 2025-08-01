import React, { useState } from 'react';
import LocationGenerator from './components/LocationGenerator';
import CharacterDossierGenerator from './components/CharacterDossierGenerator';
import ArtPromptGenerator from './components/ArtPromptGenerator';
import DlcCharacterGenerator from './components/DlcCharacterGenerator';
import RemixChallengeGenerator from './components/RemixChallengeGenerator';
import MerchGenerator from './components/MerchGenerator';
import PromptMatrixGenerator from './components/PromptMatrixGenerator';
import SceneMatrixGenerator from './components/SceneMatrixGenerator';
import CanonPromptsDisplay from './components/CanonPromptsDisplay';
import LocationsDisplay from './components/LocationsDisplay';
import KeyScenesDisplay from './components/KeyScenesDisplay';
import InteractiveSceneGenerator from './components/InteractiveSceneGenerator';
import DlcShowcaseDisplay from './components/DlcShowcaseDisplay';
import GlossaryGenerator from './components/GlossaryGenerator';
import CastDisplay from './components/CastDisplay';
import CreditsDisplay from './components/CreditsDisplay';
import HashtagDisplay from './components/HashtagDisplay';
import CharacterBatchGenerator from './components/CharacterBatchGenerator';
import LocationBatchGenerator from './components/LocationBatchGenerator';
import TimelineSplitGenerator from './components/TimelineSplitGenerator';
import DialogueTreeGenerator from './components/DialogueTreeGenerator';
import ProjectBlueprintGenerator from './components/ProjectBlueprintGenerator';
import CreativeBatchGenerator from './components/CreativeBatchGenerator';
import WorkflowGenerator from './components/WorkflowGenerator';
import EnterprisePlan from './components/EnterprisePlan';
import AiGuideWidget from './components/AiGuideWidget';
import StoryboardGenerator from './components/StoryboardGenerator';

import { 
    Storyboard, LocationSnippet, DlcCharacter, RemixChallenge, MerchIdeas, GeneratedPrompt, InteractiveScene, 
    CharacterDossier, GlossaryEntry, SceneMatrixEntry, BatchCharacterProfile, TimelineSplit, BatchLocationProfile, 
    DialogueTree, ProjectBlueprint, CreativeBatch, Workflow
} from './services/geminiService';

import { 
    toSceneMatrixMarkdown, toBatchCharacterProfileMarkdown, toTimelineSplitMarkdown, toBatchLocationProfileMarkdown, 
    toDialogueTreeMarkdown, toProjectBlueprintMarkdown, toCreativeBatchMarkdown, toWorkflowMarkdown 
} from './services/markdownService';

import { 
    ExportIcon, SparklesIcon, LocationIcon, ArtIcon, DlcIcon, ArtistChallengeIcon, MerchIcon, MatrixIcon, 
    DossierIcon, BookmarkIcon, LocationsIcon, KeySceneIcon, InteractiveIcon, DlcShowcaseIcon, GlossaryIcon, 
    CastIcon, CreditsIcon, HashtagIcon, SceneMatrixIcon, BatchCharacterIcon, TimelineSplitIcon, BatchLocationIcon, 
    DialogueTreeIcon, ProjectBlueprintIcon, CreativeBatchIcon, WorkflowIcon, EnterprisePlanIcon
} from './components/icons';

type GeneratorType = 'Master Index' | 'Workflow' | 'Creative Batch' | 'Project Blueprint' | 'Storyboard' | 'Scene Matrix' | 'Character Batch' | 'Location Batch' | 'Timeline Split' | 'Dialogue Tree' | 'Interactive Scene' | 'Character Dossier' | 'Location' | 'Glossary' | 'Art Prompt' | 'Prompt Matrix' | 'DLC Character' | 'Remix Challenge' | 'Merch Ideas' | 'Cast' | 'Canon Prompts' | 'Locations' | 'Key Scenes' | 'DLC Showcase' | 'Hashtag' | 'Credits';

const TABS: { name: GeneratorType, icon: React.FC }[] = [
    { name: 'Master Index', icon: EnterprisePlanIcon },
    { name: 'Workflow', icon: WorkflowIcon },
    { name: 'Project Blueprint', icon: ProjectBlueprintIcon },
    { name: 'Storyboard', icon: SparklesIcon },
    { name: 'Interactive Scene', icon: InteractiveIcon },
    { name: 'Dialogue Tree', icon: DialogueTreeIcon },
    { name: 'Creative Batch', icon: CreativeBatchIcon },
    { name: 'Scene Matrix', icon: SceneMatrixIcon },
    { name: 'Character Batch', icon: BatchCharacterIcon },
    { name: 'Location Batch', icon: BatchLocationIcon },
    { name: 'Timeline Split', icon: TimelineSplitIcon },
    { name: 'Character Dossier', icon: DossierIcon },
    { name: 'Location', icon: LocationIcon },
    { name: 'Glossary', icon: GlossaryIcon },
    { name: 'Art Prompt', icon: ArtIcon },
    { name: 'Prompt Matrix', icon: MatrixIcon },
    { name: 'DLC Character', icon: DlcIcon },
    { name: 'Remix Challenge', icon: ArtistChallengeIcon },
    { name: 'Merch Ideas', icon: MerchIcon },
    { name: 'Cast', icon: CastIcon },
    { name: 'Canon Prompts', icon: BookmarkIcon },
    { name: 'Locations', icon: LocationsIcon },
    { name: 'Key Scenes', icon: KeySceneIcon },
    { name: 'DLC Showcase', icon: DlcShowcaseIcon },
    { name: 'Hashtag', icon: HashtagIcon },
    { name: 'Credits', icon: CreditsIcon },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GeneratorType>('Master Index');
  const [prefilledQuestion, setPrefilledQuestion] = useState('');
  
  // State for generators
  const [generatedWorkflow, setGeneratedWorkflow] = useState<Workflow | null>(null);
  const [generatedCreativeBatch, setGeneratedCreativeBatch] = useState<CreativeBatch | null>(null);
  const [generatedProjectBlueprint, setGeneratedProjectBlueprint] = useState<ProjectBlueprint | null>(null);
  const [generatedStoryboard, setGeneratedStoryboard] = useState<Storyboard | null>(null);
  const [generatedInteractiveScene, setGeneratedInteractiveScene] = useState<InteractiveScene | null>(null);
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
  const [generatedSceneMatrix, setGeneratedSceneMatrix] = useState<SceneMatrixEntry[]>([]);
  const [generatedCharacterBatch, setGeneratedCharacterBatch] = useState<BatchCharacterProfile[]>([]);
  const [generatedLocationBatch, setGeneratedLocationBatch] = useState<BatchLocationProfile[]>([]);
  const [generatedTimelineSplit, setGeneratedTimelineSplit] = useState<TimelineSplit | null>(null);
  const [generatedDialogueTree, setGeneratedDialogueTree] = useState<DialogueTree | null>(null);
  const [generatedLocation, setGeneratedLocation] = useState<LocationSnippet | null>(null);
  const [generatedDossier, setGeneratedDossier] = useState<CharacterDossier | null>(null);
  const [generatedGlossaryEntry, setGeneratedGlossaryEntry] = useState<GlossaryEntry | null>(null);
  const [generatedArtPrompt, setGeneratedArtPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [generatedDlcCharacter, setGeneratedDlcCharacter] = useState<DlcCharacter | null>(null);
  const [generatedRemixChallenge, setGeneratedRemixChallenge] = useState<RemixChallenge | null>(null);
  const [generatedMerchIdeas, setGeneratedMerchIdeas] = useState<MerchIdeas | null>(null);

  const convertToCSV = (data: GeneratedPrompt[]) => {
    const header = ['Character', 'Location', 'Prompt'];
    const rows = data.map(row => [
        `"${row.character.replace(/"/g, '""')}"`,
        `"${row.location.replace(/"/g, '""')}"`,
        `"${row.prompt.replace(/"/g, '""')}"`
    ].join(','));
    return [header.join(','), ...rows].join('\n');
  };

  const handleExport = () => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';

    let dataString: string = '';
    let fileName: string = `neo-tokyo-export.txt`;
    let mimeType: string = 'text/plain';

    switch(activeTab) {
        case 'Workflow':
             if (generatedWorkflow) {
                fileName = `neo-tokyo-workflow.md`;
                dataString = toWorkflowMarkdown(generatedWorkflow);
            }
            break;
        case 'Creative Batch':
             if (generatedCreativeBatch) {
                fileName = `neo-tokyo-creative-batch.md`;
                dataString = toCreativeBatchMarkdown(generatedCreativeBatch);
            }
            break;
        case 'Project Blueprint':
             if (generatedProjectBlueprint) {
                fileName = `neo-tokyo-project-blueprint.md`;
                dataString = toProjectBlueprintMarkdown(generatedProjectBlueprint);
            }
            break;
        case 'Prompt Matrix':
            if (generatedPrompts.length > 0) {
                fileName = `neo-tokyo-prompt-matrix.csv`;
                mimeType = 'text/csv;charset=utf-8;';
                dataString = convertToCSV(generatedPrompts);
            }
            break;
        case 'Scene Matrix':
            if (generatedSceneMatrix.length > 0) {
                fileName = `neo-tokyo-scene-matrix.md`;
                dataString = toSceneMatrixMarkdown(generatedSceneMatrix);
            }
            break;
        case 'Character Batch':
            if (generatedCharacterBatch.length > 0) {
                fileName = `neo-tokyo-character-batch.md`;
                dataString = toBatchCharacterProfileMarkdown(generatedCharacterBatch);
            }
            break;
        case 'Location Batch':
             if (generatedLocationBatch.length > 0) {
                fileName = `neo-tokyo-location-batch.md`;
                dataString = toBatchLocationProfileMarkdown(generatedLocationBatch);
            }
            break;
        case 'Timeline Split':
            if (generatedTimelineSplit) {
                fileName = `neo-tokyo-timeline-split.md`;
                dataString = toTimelineSplitMarkdown(generatedTimelineSplit);
            }
            break;
        case 'Dialogue Tree':
            if (generatedDialogueTree) {
                fileName = `neo-tokyo-dialogue-tree.md`;
                dataString = toDialogueTreeMarkdown(generatedDialogueTree);
            }
            break;
    }
    
    if (dataString) {
        if(mimeType === 'text/plain') mimeType = 'text/markdown;charset=utf-8;';
        const blob = new Blob([dataString], { type: mimeType });
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    document.body.removeChild(a);
  };

  const renderActiveGenerator = () => {
    switch(activeTab) {
      case 'Master Index': return <EnterprisePlan />;
      case 'Workflow': return <WorkflowGenerator generatedWorkflow={generatedWorkflow} setGeneratedWorkflow={setGeneratedWorkflow} />;
      case 'Creative Batch': return <CreativeBatchGenerator generatedBatch={generatedCreativeBatch} setGeneratedBatch={setGeneratedCreativeBatch} />;
      case 'Project Blueprint': return <ProjectBlueprintGenerator generatedBlueprint={generatedProjectBlueprint} setGeneratedBlueprint={setGeneratedProjectBlueprint} />;
      case 'Storyboard': return <StoryboardGenerator generatedStoryboard={generatedStoryboard} setGeneratedStoryboard={setGeneratedStoryboard} />;
      case 'Interactive Scene': return <InteractiveSceneGenerator generatedScene={generatedInteractiveScene} setGeneratedScene={setGeneratedInteractiveScene} />;
      case 'Scene Matrix': return <SceneMatrixGenerator generatedEntries={generatedSceneMatrix} setGeneratedEntries={setGeneratedSceneMatrix} />;
      case 'Character Batch': return <CharacterBatchGenerator generatedProfiles={generatedCharacterBatch} setGeneratedProfiles={setGeneratedCharacterBatch} />;
      case 'Location Batch': return <LocationBatchGenerator generatedProfiles={generatedLocationBatch} setGeneratedProfiles={setGeneratedLocationBatch} />;
      case 'Timeline Split': return <TimelineSplitGenerator generatedSplit={generatedTimelineSplit} setGeneratedSplit={setGeneratedTimelineSplit} />;
      case 'Dialogue Tree': return <DialogueTreeGenerator generatedTree={generatedDialogueTree} setGeneratedTree={setGeneratedDialogueTree} />;
      case 'Prompt Matrix': return <PromptMatrixGenerator generatedPrompts={generatedPrompts} setGeneratedPrompts={setGeneratedPrompts} />;
      case 'DLC Character': return <DlcCharacterGenerator generatedDlcCharacter={generatedDlcCharacter} setGeneratedDlcCharacter={setGeneratedDlcCharacter} />;
      case 'Remix Challenge': return <RemixChallengeGenerator generatedChallenge={generatedRemixChallenge} setGeneratedChallenge={setGeneratedRemixChallenge} />;
      case 'Merch Ideas': return <MerchGenerator generatedMerch={generatedMerchIdeas} setGeneratedMerch={setGeneratedMerchIdeas} />;
      case 'Location': return <LocationGenerator generatedLocation={generatedLocation} setGeneratedLocation={setGeneratedLocation} />;
      case 'Character Dossier': return <CharacterDossierGenerator generatedDossier={generatedDossier} setGeneratedDossier={setGeneratedDossier} />;
      case 'Glossary': return <GlossaryGenerator generatedEntry={generatedGlossaryEntry} setGeneratedEntry={setGeneratedGlossaryEntry} />;
      case 'Art Prompt': return <ArtPromptGenerator generatedPrompt={generatedArtPrompt} setGeneratedPrompt={setGeneratedArtPrompt} generatedImage={generatedImage} setGeneratedImage={setGeneratedImage} />;
      case 'DLC Showcase': return <DlcShowcaseDisplay />;
      case 'Cast': return <CastDisplay />;
      case 'Locations': return <LocationsDisplay />;
      case 'Key Scenes': return <KeyScenesDisplay />;
      case 'Credits': return <CreditsDisplay />;
      case 'Hashtag': return <HashtagDisplay />;
      case 'Canon Prompts': return <CanonPromptsDisplay />;
      default:
        return <div className="text-center text-gray-400 p-8">Select a tool from the navigation bar.</div>;
    }
  }

  const showExportButton = [
    'Workflow', 'Creative Batch', 'Project Blueprint', 'Prompt Matrix', 
    'Scene Matrix', 'Character Batch', 'Location Batch', 'Timeline Split', 'Dialogue Tree'
  ].includes(activeTab);

  return (
    <div className="min-h-screen text-gray-200 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-wider [text-shadow:_0_0_10px_theme(colors.cyan.500)]">
            Neo-Tokyo Noir
          </h1>
          <p className="text-lg text-gray-400 mt-2">Enterprise System</p>
           {showExportButton && (
              <div className="absolute top-0 right-0">
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center px-3 py-2 bg-slate-800 text-gray-300 font-semibold rounded-md transition-colors duration-200 hover:bg-cyan-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                    aria-label="Export Project"
                >
                    <ExportIcon />
                    <span className="ml-2 text-sm hidden sm:inline">Export</span>
                </button>
              </div>
           )}
        </header>

        <nav className="mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2 border-b border-slate-700">
                {TABS.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex items-center space-x-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none ${
                            activeTab === tab.name
                                ? 'border-b-2 border-cyan-400 text-cyan-400'
                                : 'text-gray-400 hover:text-white'
                        }`}
                        role="tab"
                        aria-selected={activeTab === tab.name}
                    >
                        <tab.icon />
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>
        </nav>

        <main>
          {renderActiveGenerator()}
        </main>
      </div>
      <AiGuideWidget prefilledQuestion={prefilledQuestion} setPrefilledQuestion={setPrefilledQuestion} />
    </div>
  );
};

export default App;