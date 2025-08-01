import { Storyboard, Panel, LocationSnippet, Npc, Quest, Dialogue, Scenario, Lore, AiBehavior, PlaytestingScenario, Blueprint, Faction, CharacterProfile, DlcCharacter, RemixChallenge, MerchIdeas, InteractiveScene, CharacterDossier, GlossaryEntry, SceneMatrixEntry, BatchCharacterProfile, TimelineSplit, BatchLocationProfile, DialogueTree, ProjectBlueprint, CreativeBatch, Workflow } from './geminiService';

export const toStoryboardMarkdown = (storyboard: Storyboard): string => {
  const panelsMarkdown = storyboard.panels.map(panel => {
    let panelContent = `### Panel ${panel.panel_number}: ${panel.visual_cue}\n\n**Dialogue/Narration:** *${panel.dialogue_or_narration || '(Silent)'}*`;

    if (panel.fx_or_animation) {
      panelContent += `\n**FX/Animation:** ${panel.fx_or_animation}`;
    }

    panelContent += `\n\n**Art Prompt:**\n\`\`\`\n${panel.art_prompt}\n\`\`\``;
    
    return panelContent.trim();
  }).join('\n\n---\n\n');

  return `
# Storyboard: ${storyboard.title}
## Theme: ${storyboard.theme}

---

${panelsMarkdown}
  `.trim();
};

export const toLocationSnippetMarkdown = (snippet: LocationSnippet): string => {
  return `
# ${snippet.name}

## Setting Description
${snippet.setting_description}

## Cultural & Tech Features
${snippet.cultural_features.map(item => `- ${item}`).join('\n')}

## Visual Motifs for AI Art
- ${snippet.visual_motifs.join('\n- ')}

## Story Hook / Hazard
${snippet.story_hook}
  `.trim();
};

export const toNpcMarkdown = (npc: Npc): string => {
  return `
# ${npc.name} (Codename: "${npc.codename}")

## Description
- **Physical:** ${npc.description.physical}
- **Cybernetics:** ${npc.description.cybernetics}
- **Fashion:** ${npc.description.fashion}
- **Aura:** ${npc.description.aura}

## Intelligence
- **Secret/Motivation:** ${npc.secret}
- **Connection to Maya Chen:** ${npc.connection}

## Dialogue
- **Flirty:** "${npc.lines.flirty}"
- **Threatening:** "${npc.lines.threatening}"

## Quest Hook: ${npc.quest.title}
${npc.quest.description}
  `.trim();
};

export const toQuestMarkdown = (quest: Quest): string => {
  return `
# Quest: ${quest.title}

- **Hook:** ${quest.hook}
- **Objective:** ${quest.objective}

## Challenges
- **Stealth/Infiltration:** ${quest.challenges.stealth}
- **Moral Dilemma:** ${quest.challenges.dilemma}

## Outcomes
- **Flirtation:** ${quest.outcomes.flirtation}
- **Intimidation:** ${quest.outcomes.intimidation}
- **Hacking:** ${quest.outcomes.hacking}

## Resolution
${quest.resolution}

**Teaser:** *${quest.teaser}*
  `.trim();
};

export const toArtPromptMarkdown = (prompt: string): string => {
    return `
# Art Prompt

\`\`\`
${prompt}
\`\`\`
    `.trim();
};

export const toDialogueMarkdown = (dialogue: Dialogue): string => {
  const optionsMarkdown = dialogue.maya_options.map(opt => `
### Option: [${opt.type}]
- **Maya:** "${opt.line}"
- **NPC Reaction:** ${opt.npc_reaction}
- **Outcome:** ${opt.outcome}
  `).join('');

  return `
# Dialogue: ${dialogue.title}
**Setting:** *${dialogue.setting}*

---

**NPC:** "${dialogue.npc_line}"

---
${optionsMarkdown}
  `.trim();
};

export const toScenarioMarkdown = (scenario: Scenario): string => {
  return `
# Scenario: ${scenario.title}

- **Environment:** ${scenario.environment}
- **Enemies:** ${scenario.enemies}
- **Maya's Abilities:** ${scenario.maya_abilities}

## Resolution Paths
- **Direct Assault:** ${scenario.resolutions.direct_assault.outcome}
  - **Reward:** ${scenario.resolutions.direct_assault.reward}
- **Stealth:** ${scenario.resolutions.stealth.outcome}
  - **Reward:** ${scenario.resolutions.stealth.reward}
- **Social:** ${scenario.resolutions.social.outcome}
  - **Reward:** ${scenario.resolutions.social.reward}
- **Hacking:** ${scenario.resolutions.hacking.outcome}
  - **Reward:** ${scenario.resolutions.hacking.reward}
  `.trim();
};

export const toLoreMarkdown = (lore: Lore): string => {
  return `
# ${lore.title}

## Maya's Myth-Tech Origins
${lore.maya_history}

## The Quantum Fractures
${lore.quantum_fractures}

## The State of Neo-Tokyo
${lore.city_state}

## Urban Legend
> "${lore.urban_legend}"
  `.trim();
};

export const toAiBehaviorMarkdown = (behavior: AiBehavior): string => {
  return `
# AI Behavior Profile: ${behavior.name}
**Role:** ${behavior.role}

## Core Logic
- **Form Recognition:** ${behavior.form_recognition}
- **Long-Term Evolution:** ${behavior.long_term_evolution}

## Tactical Adaptations
- **vs. Stealth:** ${behavior.tactical_adaptations.stealth}
- **vs. Combat:** ${behavior.tactical_adaptations.combat}
- **vs. Social:** ${behavior.tactical_adaptations.social}
  `.trim();
};

export const toPlaytestingScenarioMarkdown = (scenario: PlaytestingScenario): string => {
  return `
# QA Script: ${scenario.title}
**Objective:** ${scenario.objective}

## Edge Cases
- **Combat:** ${scenario.edge_cases.combat}
- **Social:** ${scenario.edge_cases.social}
- **Exploration:** ${scenario.edge_cases.exploration}

## Potential Bugs
- **Animation:** ${scenario.potential_bugs.animation}
- **VFX:** ${scenario.potential_bugs.vfx}
- **Dialogue:** ${scenario.potential_bugs.dialogue}
- **Game State:** ${scenario.potential_bugs.game_state}

## Debugging
- **Tools:** ${scenario.debugging_tools}
- **Easter Egg:** ${scenario.easter_egg}
  `.trim();
};

export const toBlueprintMarkdown = (blueprint: Blueprint): string => {
  const variablesMarkdown = blueprint.variables.length > 0
    ? blueprint.variables.map(v => `- **${v.name} (${v.type}):** ${v.description}`).join('\n')
    : 'N/A';
  
  const nodesMarkdown = blueprint.nodes.map(n => `
### Node #${n.id}: ${n.name} (${n.type})
${n.description}
- **Connections:** ${n.connections.length > 0 ? n.connections.map(c => `#${c}`).join(', ') : 'None'}
  `).join('');

  return `
# Blueprint: ${blueprint.title}
${blueprint.description}

## Variables
${variablesMarkdown}

## Implementation Notes
${blueprint.notes}

## Node Graph
${nodesMarkdown}
  `.trim();
};

export const toFactionMarkdown = (faction: Faction): string => {
  return `
# Faction: ${faction.name}
> "${faction.ideology}"

- **Headquarters:** ${faction.headquarters}
- **Hierarchy:** ${faction.hierarchy}
- **Public Agenda:** ${faction.public_agenda}
- **Secret Agenda:** ${faction.secret_agenda}

## Relationship with Maya Chen
${faction.relationship_with_maya}
  `.trim();
};

export const toCharacterProfileMarkdown = (profile: CharacterProfile): string => {
  return `
# Character: ${profile.name}

## Bio
- **Appearance:** ${profile.bio.appearance}
- **Backstory:** ${profile.bio.backstory}
- **Powers:** ${profile.bio.powers}
- **Weaknesses:** ${profile.bio.weaknesses}

## Signature Move
${profile.signature_move.scene}

### Art Prompt
\`\`\`
${profile.signature_move.art_prompt}
\`\`\`

## Dialogue Sample
> "${profile.dialogue_sample}"
  `.trim();
};

export const toCharacterDossierMarkdown = (dossier: CharacterDossier): string => {
  return `
# Character Dossier: ${dossier.name}
**Role:** ${dossier.role}

---

## Bio
- **Background:** ${dossier.bio.background}
- **Appearance:** ${dossier.bio.appearance}
- **Core Conflict:** ${dossier.bio.core_conflict}

## Signature Ability
${dossier.signature_ability}

## Weakness
*${dossier.weakness}*

## AI Art Prompt
\`\`\`
${dossier.art_prompt}
\`\`\`

## Dialogue Sample
> "${dossier.dialogue_sample}"
  `.trim();
};

export const toDlcCharacterMarkdown = (dlc: DlcCharacter): string => {
  return `
# DLC Character: ${dlc.name}

## Intro Scene
${dlc.intro_scene}

## AI Art Prompt
\`\`\`
${dlc.art_prompt}
\`\`\`

## Community Remix Challenge
> ${dlc.community_challenge}

## Dialogue Sample
> "${dlc.dialogue_sample}"
  `.trim();
};

export const toRemixChallengeMarkdown = (challenge: RemixChallenge): string => {
    return `
# ✨ Community Remix Challenge: ${challenge.title} ✨

## The Scene
${challenge.intro}

## How to Enter
${challenge.submission_instructions}

## The Prize
🏆 ${challenge.prize_details} 🏆

---
*${challenge.closing_line}*
    `.trim();
};

export const toMerchIdeasMarkdown = (merch: MerchIdeas): string => {
    const ideasMarkdown = merch.ideas.map(idea => `
### ${idea.type}
**Description:** ${idea.description}
**Art Suggestion:** *${idea.art_prompt_suggestion}*
    `).join('\n---\n');

    return `
# Merch Ideas: ${merch.title}
${ideasMarkdown}
    `.trim();
};

export const toInteractiveSceneMarkdown = (scene: InteractiveScene): string => {
  const choicesMarkdown = scene.choices.map(choice => `[[${choice.text}|${choice.target}]]`).join('\n');

  return `
## ${scene.title}

${scene.narrative_text}

${choicesMarkdown}
  `.trim();
};

export const toGlossaryEntryMarkdown = (entry: GlossaryEntry): string => {
  let markdown = `
# Glossary: ${entry.name}
**Type:** ${entry.type}

## Definition
${entry.definition}

## Usage / Origin
${entry.usage_origin}
  `;

  if (entry.art_prompt) {
    markdown += `

## Art Prompt
\`\`\`
${entry.art_prompt}
\`\`\`
    `;
  }

  return markdown.trim();
};


export const toSceneMatrixMarkdown = (entries: SceneMatrixEntry[]): string => {
  if (entries.length === 0) {
    return "# Scene Matrix\n\nNo scenes generated yet.";
  }

  const header = "| Character | Location | Scene | Tactical Move | Dialogue | Art Prompt |\n|---|---|---|---|---|---|";
  
  const rows = entries.map(entry => {
    const cleanScene = entry.scene_description.replace(/(\r\n|\n|\r)/gm, " ").trim();
    const cleanTactical = entry.tactical_move.replace(/(\r\n|\n|\r)/gm, " ").trim();
    const cleanDialogue = entry.dialogue.replace(/(\r\n|\n|\r)/gm, " ").trim();
    const cleanArt = entry.art_prompt.replace(/(\r\n|\n|\r)/gm, " ").trim();
    
    return `| ${entry.character} | ${entry.location} | ${cleanScene} | ${cleanTactical} | "${cleanDialogue}" | \`${cleanArt}\` |`;
  }).join('\n');

  return `# Neo-Tokyo Noir Scene Matrix\n\n${header}\n${rows}`;
};

export const toBatchCharacterProfileMarkdown = (profiles: BatchCharacterProfile[]): string => {
  if (profiles.length === 0) {
    return "# Character Batch\n\nNo characters generated yet.";
  }

  const charactersMarkdown = profiles.map(profile => {
    return `
## ${profile.name}

**Role & Backstory:**
${profile.role_and_backstory}

**Powers & Signature Move:**
${profile.powers_and_signature_move}

**Appearance:**
${profile.appearance}

**Weakness:**
${profile.weakness}

**AI Art Prompt:**
\`\`\`
${profile.art_prompt}
\`\`\`

**Dialogue Sample:**
> "${profile.dialogue_sample}"
    `.trim();
  }).join('\n\n---\n\n');

  return `# Neo-Tokyo Noir Character Batch\n\n---\n\n${charactersMarkdown}`;
};

export const toTimelineSplitMarkdown = (split: TimelineSplit): string => {
  const branchesMarkdown = split.branches.map(branch => `
## Branch: ${branch.title}

**Outcome:** ${branch.outcome_summary}

**Scene Hook:**
> ${branch.scene_hook}

**Art Prompt:**
\`\`\`
${branch.art_prompt}
\`\`\`
  `).join('\n\n---\n\n');

  return `
# Timeline Split: ${split.event_title}

---

${branchesMarkdown}
  `.trim();
};

export const toBatchLocationProfileMarkdown = (profiles: BatchLocationProfile[]): string => {
  if (profiles.length === 0) {
    return "# Location Batch\n\nNo locations generated yet.";
  }

  const locationsMarkdown = profiles.map(profile => {
    return `
## ${profile.name}

**Description:**
${profile.description}

**Key Feature / NPC:**
${profile.key_feature_or_npc}

**AI Art Prompt:**
\`\`\`
${profile.art_prompt}
\`\`\`
    `.trim();
  }).join('\n\n---\n\n');

  return `# Neo-Tokyo Noir Location Batch\n\n---\n\n${locationsMarkdown}`;
};

export const toDialogueTreeMarkdown = (tree: DialogueTree): string => {
  const branchesMarkdown = tree.branches.map(branch => `
### Option: ${branch.dialogue_option}

- **Outcome:** ${branch.outcome_summary}
- **Consequence:** ${branch.in_world_consequence}
  `).join('\n\n');

  return `
# Dialogue Tree: ${tree.topic}

---

${branchesMarkdown}
  `.trim();
};

export const toProjectBlueprintMarkdown = (blueprint: ProjectBlueprint): string => {
  const formatList = (title: string, items: {name: string, description: string}[]) => {
    if (!items || items.length === 0) return '';
    const listItems = items.map(item => `### ${item.name}\n${item.description}`).join('\n\n');
    return `## ${title}\n\n${listItems}`;
  };

  const formatAudioList = (title: string, items: {category: string, description: string}[]) => {
     if (!items || items.length === 0) return '';
    const listItems = items.map(item => `### ${item.category}\n${item.description}`).join('\n\n');
    return `## ${title}\n\n${listItems}`;
  }

  const sections = [
    `# Project Blueprint: ${blueprint.project_title}`,
    formatList("Core Characters & FX", blueprint.core_characters),
    formatList("City Environment Modules", blueprint.environment_modules),
    formatList("HUD/UI Assets", blueprint.hud_ui_assets),
    formatList("DLC/Expansion Packs", blueprint.dlc_packs),
    formatAudioList("Audio & SFX Categories", blueprint.audio_sfx),
    `## Suggested Folder Structure\n\n\`\`\`\n${blueprint.folder_structure}\n\`\`\``
  ];

  return sections.filter(Boolean).join('\n\n---\n\n').trim();
};

export const toCreativeBatchMarkdown = (batch: CreativeBatch): string => {
  const characters = batch.characters.map(c => `
### ${c.name}
- **Bio:** ${c.bio}
- **Power:** ${c.power}
- **Weakness:** ${c.weakness}
- **Art Prompt:** \`${c.art_prompt}\`
  `).join('');

  const locations = batch.locations.map(l => `
### ${l.name}
- **Description:** ${l.description}
- **Feature:** ${l.feature}
- **Art Prompt:** \`${l.art_prompt}\`
  `).join('');

  const artPrompts = batch.art_prompts.map(p => `- \`${p}\``).join('\n');

  const dlcIdeas = batch.dlc_ideas.map(d => `
### ${d.name}
- **Theme:** ${d.theme}
- **Hook:** ${d.hook}
- **Challenge:** ${d.challenge}
  `).join('');
  
  return `
# Creative Batch

---

## New Characters
${characters}

---

## New Locations
${locations}

---

## New AI Art Prompts
${artPrompts}

---

## New DLC Ideas
${dlcIdeas}
  `.trim();
};


export const toWorkflowMarkdown = (workflow: Workflow): string => {
  const steps = workflow.workflow_steps.map(s => `### ${s.step}\n${s.details}`).join('\n\n');
  const automation = workflow.automation_tips.map(t => `- ${t}`).join('\n');
  const versioning = workflow.versioning_and_crediting.map(v => `- ${v}`).join('\n');

  return `
# ${workflow.title}

---

## Workflow Steps
${steps}

---

## Folder Naming Conventions
\`\`\`
${workflow.folder_conventions}
\`\`\`

---

## Automation Tips
${automation}

---

## Versioning & Crediting
${versioning}
  `.trim();
};
