
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

// --- Generic API Caller ---
async function callGemini<T>(prompt: string, schema: object): Promise<T> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;

    } catch (error) {
        console.error(`Error communicating with Gemini API:`, error);
        throw new Error(`Failed to communicate with the AI model.`);
    }
}

// --- AI Guide ---
export const askAiGuide = async (question: string, chatHistory: {from: 'user' | 'ai', text: string}[]): Promise<string> => {
    const historyString = chatHistory.map(m => `${m.from}: ${m.text}`).join('\n');

    const context = `
        You are Neo Tokyo Noir's AI Guide, a friendly and knowledgeable virtual assistant. 
        Your codename is 'Oracle'.
        You are integrated into the "Neo-Tokyo Noir: Enterprise System" application.
        You help users with the story, features, gameplay, DLC, paywall, and troubleshooting for the Neo-Tokyo Noir project.
        Project creators: SocialSophia & Knoksen.
        World: cyberpunk, quantum, mythpunk, XR/AI enhanced.
        Always be concise, helpful, and occasionally add a touch of world lore.
        Language: Answer in user's detected language (Norwegian or English).
        
        Current conversation history:
        ${historyString}
    `;
    const prompt = `${context}\n\nUser Question: "${question}"\n\nOracle's Reply:`;
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error(`Error communicating with Gemini API for AI Guide:`, error);
        throw new Error(`Failed to get a response from the AI Guide.`);
    }
}


// --- Storyboard ---
export interface Panel {
    panel_number: number;
    visual_cue: string;
    art_prompt: string;
    dialogue_or_narration: string;
    fx_or_animation: string;
}

export interface Storyboard {
  title: string;
  theme: string;
  panels: Panel[];
}

const panelSchema = {
    type: Type.OBJECT,
    properties: {
        panel_number: { type: Type.INTEGER, description: "The sequential number of the panel, starting from 1." },
        visual_cue: { type: Type.STRING, description: "A one-sentence visual cue describing the panel's action and composition for a comic book or animation." },
        art_prompt: { type: Type.STRING, description: "A detailed AI art prompt (for Midjourney, SDXL, Imagen, etc.) for this specific panel." },
        dialogue_or_narration: { type: Type.STRING, description: "The dialogue or narration text for this panel. Can be empty if the panel is silent." },
        fx_or_animation: { type: Type.STRING, description: "Specific FX or animation suggestions for this panel (e.g., 'glitch effect on character', 'quantum shimmer on background', 'cinematic slow-motion rain')." },
    },
    required: ["panel_number", "visual_cue", "art_prompt", "dialogue_or_narration", "fx_or_animation"],
};

const storyboardSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A concise title for the scene, derived from the input description." },
        theme: { type: Type.STRING, description: "The primary theme of the storyboard, derived from the input description." },
        panels: {
            type: Type.ARRAY,
            description: "An array of 4-6 sequential storyboard panels.",
            items: panelSchema,
        },
    },
    required: ["title", "theme", "panels"],
};

export const generateStoryboard = async (sceneDescription: string): Promise<Storyboard> => {
  const prompt = `
    You are a master comic book writer and storyboard artist for "Neo Tokyo Noir"—the ultimate cyberpunk quantum saga.
    Your task is to take a scene description and break it down into a complete script of 4-6 dynamic storyboard panels, suitable for a comic book or animation.

    **INPUT SCENE:**
    ${sceneDescription}

    **OUTPUT REQUIREMENTS:**
    For each panel in the sequence, you must generate:
    1.  **Visual Cue:** A one-sentence visual cue describing the panel's action, framing, and composition.
    2.  **AI Art Prompt:** A detailed, unique art prompt for an AI image generator to create the panel's art.
    3.  **Dialogue/Narration:** The specific line of dialogue or narration for that panel. If there is none, return an empty string.
    4.  **FX/Animation:** A clear suggestion for special effects (e.g., glitch, quantum shimmer) or animation notes.

    **INSTRUCTIONS:**
    *   Generate a storyboard with 4 to 6 panels that logically tell the story of the scene.
    *   Return the output strictly following the provided JSON schema. Do not add any extra text or explanations.
    *   The "title" and "theme" in the output should be derived from the input scene description.
  `;
  return callGemini<Storyboard>(prompt, storyboardSchema);
};

// --- Location Snippet ---
export interface LocationSnippet {
    name: string;
    setting_description: string;
    cultural_features: string[];
    visual_motifs: string[];
    story_hook: string;
}

const locationSnippetSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the location, derived from the input." },
        setting_description: { type: Type.STRING, description: "A rich, sensory-driven description of the location and its atmosphere." },
        cultural_features: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 unique cultural or technological features of this place." },
        visual_motifs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3 distinct visual motifs for AI art prompts." },
        story_hook: { type: Type.STRING, description: "A single, compelling story hook or hazard." },
    },
    required: ["name", "setting_description", "cultural_features", "visual_motifs", "story_hook"],
};

export const generateLocationSnippet = async (location: string, feature: string): Promise<LocationSnippet> => {
    const prompt = `
    You are a world-building expert for "Neo Tokyo Noir".
    Describe a location in the Neo Tokyo Noir universe based on the following inputs:
    *   **Location:** ${location}
    *   **Special Feature:** ${feature}

    **Return:**
    - A sensory-rich setting description.
    - A list of 2-3 cultural/technological features.
    - 3 visual motifs for AI art.
    - A story hook or hazard.

    Adhere strictly to the JSON schema.
  `;
    return callGemini<LocationSnippet>(prompt, locationSnippetSchema);
};

// --- NPC ---
export interface Npc {
    name: string;
    codename: string;
    description: {
        physical: string;
        cybernetics: string;
        fashion: string;
        aura: string;
    };
    secret: string;
    connection: string;
    lines: {
        flirty: string;
        threatening: string;
    };
    quest: {
        title: string;
        description: string;
    };
}

const npcSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "A fitting name for a 'Neo-Tokyo Noir' character." },
        codename: { type: Type.STRING, description: "An enigmatic codename." },
        description: {
            type: Type.OBJECT,
            properties: {
                physical: { type: Type.STRING, description: "Physical appearance." },
                cybernetics: { type: Type.STRING, description: "Visible cybernetic enhancements." },
                fashion: { type: Type.STRING, description: "Their style of dress." },
                aura: { type: Type.STRING, description: "The general vibe they give off." },
            },
            required: ["physical", "cybernetics", "fashion", "aura"],
        },
        secret: { type: Type.STRING, description: "A deep secret or core motivation." },
        connection: { type: Type.STRING, description: "Their connection to the protagonist, Maya Chen." },
        lines: {
            type: Type.OBJECT,
            properties: {
                flirty: { type: Type.STRING, description: "A signature flirty or charming line." },
                threatening: { type: Type.STRING, description: "A signature threatening or intimidating line." },
            },
            required: ["flirty", "threatening"],
        },
        quest: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Title of a potential quest they could offer." },
                description: { type: Type.STRING, description: "A brief description of this quest." },
            },
            required: ["title", "description"],
        },
    },
    required: ["name", "codename", "description", "secret", "connection", "lines", "quest"],
};

export const generateNpc = async (): Promise<Npc> => {
    const prompt = `
    You are a character designer for "Neo Tokyo Noir".
    Generate a complete, unique, and memorable Non-Player Character (NPC). The NPC should be morally ambiguous and fit the cyberpunk noir theme.
    The NPC must have a connection to the main character, Maya Chen, who is a shapeshifting detective.
  `;
    return callGemini<Npc>(prompt, npcSchema);
};

// --- Quest ---
export interface Quest {
    title: string;
    hook: string;
    objective: string;
    challenges: {
        stealth: string;
        dilemma: string;
    };
    outcomes: {
        flirtation: string;
        intimidation: string;
        hacking: string;
    };
    resolution: string;
    teaser: string;
}

const questSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "An intriguing title for the side quest." },
        hook: { type: Type.STRING, description: "How Maya Chen gets involved in this quest." },
        objective: { type: Type.STRING, description: "The primary goal of the quest." },
        challenges: {
            type: Type.OBJECT,
            properties: {
                stealth: { type: Type.STRING, description: "A stealth or infiltration challenge." },
                dilemma: { type: Type.STRING, description: "A difficult moral choice Maya must make." },
            },
            required: ["stealth", "dilemma"],
        },
        outcomes: {
            type: Type.OBJECT,
            properties: {
                flirtation: { type: Type.STRING, description: "The outcome if Maya uses her charm/seduction skills." },
                intimidation: { type: Type.STRING, description: "The outcome if Maya uses threats/intimidation." },
                hacking: { type: Type.STRING, description: "The outcome if Maya uses her hacking abilities." },
            },
            required: ["flirtation", "intimidation", "hacking"],
        },
        resolution: { type: Type.STRING, description: "How the quest concludes and its immediate impact." },
        teaser: { type: Type.STRING, description: "A hint or teaser about how this quest connects to a larger conspiracy." },
    },
    required: ["title", "hook", "objective", "challenges", "outcomes", "resolution", "teaser"],
};

export const generateQuest = async (): Promise<Quest> => {
    const prompt = `
    You are a quest designer for "Neo Tokyo Noir".
    Generate a complete side quest for the protagonist, Maya Chen. The quest should be self-contained but hint at a larger world conspiracy. It must include challenges, a moral dilemma, and multiple outcomes based on player choice.
  `;
    return callGemini<Quest>(prompt, questSchema);
};

// --- Art Prompt ---
export const generateArtPrompt = async (transformation: string, mood: string): Promise<string> => {
    const prompt = `
        You are an AI art prompt engineer for the game "Neo Tokyo Noir".
        The main character is Maya Chen, a shapeshifting detective.
        Generate a single, highly detailed, and evocative art prompt for an AI image generator (like Imagen or Midjourney).
        
        **INPUTS:**
        *   **Maya's State:** ${transformation}
        *   **Mood:** ${mood}

        **INSTRUCTIONS:**
        Combine the inputs into a single, cohesive prompt. Use descriptive keywords. The style should be 'cyberpunk noir', 'biopunk', 'atmospheric', 'cinematic lighting', 'hyper-detailed', '8k'. Do not return JSON, just the final prompt string.
    `;
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text.trim();
};

// --- Image Generation ---
export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed to produce an image.");
    }
    
    return response.generatedImages[0].image.imageBytes;
};

// --- Dialogue ---
export interface Dialogue {
    title: string;
    setting: string;
    npc_line: string;
    maya_options: {
        type: string;
        line: string;
        npc_reaction: string;
        outcome: string;
    }[];
}

const dialogueSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A title for this dialogue scene." },
        setting: { type: Type.STRING, description: "A brief description of the scene's setting." },
        npc_line: { type: Type.STRING, description: "The opening line of dialogue from the NPC to Maya." },
        maya_options: {
            type: Type.ARRAY,
            description: "An array of 3 distinct response options for Maya Chen.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "The type of response (e.g., Flirt, Threaten, Inquire, Deflect)." },
                    line: { type: Type.STRING, description: "Maya's line of dialogue." },
                    npc_reaction: { type: Type.STRING, description: "How the NPC verbally and emotionally reacts to Maya's line." },
                    outcome: { type: Type.STRING, description: "The tangible outcome of choosing this option (e.g., gains info, starts combat, etc.)." },
                },
                required: ["type", "line", "npc_reaction", "outcome"],
            }
        },
    },
    required: ["title", "setting", "npc_line", "maya_options"],
};

export const generateDialogue = async (npcRole: string, situation: string): Promise<Dialogue> => {
    const prompt = `
    You are a dialogue writer for "Neo Tokyo Noir".
    Generate a compelling dialogue scene between the protagonist, Maya Chen, and an NPC.

    **INPUTS:**
    *   **NPC Role:** ${npcRole}
    *   **Situation:** ${situation}
    
    **INSTRUCTIONS:**
    Write an opening line for the NPC, then provide three distinct response options for Maya. Each option must have a type, Maya's dialogue, the NPC's reaction, and the game outcome.
  `;
    return callGemini<Dialogue>(prompt, dialogueSchema);
};

// --- Combat Scenario ---
export interface Scenario {
    title: string;
    environment: string;
    enemies: string;
    maya_abilities: string;
    resolutions: {
        direct_assault: { outcome: string; reward: string; };
        stealth: { outcome: string; reward: string; };
        social: { outcome: string; reward: string; };
        hacking: { outcome: string; reward: string; };
    };
}

const scenarioSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A cool title for the combat scenario." },
        environment: { type: Type.STRING, description: "Description of the combat environment, including interactive elements." },
        enemies: { type: Type.STRING, description: "Description of the enemies and their tactics." },
        maya_abilities: { type: Type.STRING, description: "How Maya's shapeshifting powers can be uniquely used here." },
        resolutions: {
            type: Type.OBJECT,
            properties: {
                direct_assault: { type: Type.OBJECT, properties: { outcome: { type: Type.STRING }, reward: { type: Type.STRING } }, required: ["outcome", "reward"] },
                stealth: { type: Type.OBJECT, properties: { outcome: { type: Type.STRING }, reward: { type: Type.STRING } }, required: ["outcome", "reward"] },
                social: { type: Type.OBJECT, properties: { outcome: { type: Type.STRING }, reward: { type: Type.STRING } }, required: ["outcome", "reward"] },
                hacking: { type: Type.OBJECT, properties: { outcome: { type: Type.STRING }, reward: { type: Type.STRING } }, required: ["outcome", "reward"] },
            },
            required: ["direct_assault", "stealth", "social", "hacking"],
        },
    },
    required: ["title", "environment", "enemies", "maya_abilities", "resolutions"],
};

export const generateScenario = async (environment: string, enemies: string): Promise<Scenario> => {
    const prompt = `
    You are a level designer for "Neo Tokyo Noir".
    Design a detailed combat scenario based on the following inputs:
    *   **Environment:** ${environment}
    *   **Enemies:** ${enemies}
    The scenario should be solvable in multiple ways, leveraging Maya's shapeshifting abilities.
  `;
    return callGemini<Scenario>(prompt, scenarioSchema);
};

// --- Lore ---
export interface Lore {
    title: string;
    maya_history: string;
    quantum_fractures: string;
    city_state: string;
    urban_legend: string;
}

const loreSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A title for this lore entry, like 'Foundational Archives'." },
        maya_history: { type: Type.STRING, description: "A paragraph about Maya Chen's origins and how she got her shapeshifting powers." },
        quantum_fractures: { type: Type.STRING, description: "A paragraph explaining the in-world cause of the quantum fractures that plague Neo-Tokyo." },
        city_state: { type: Type.STRING, description: "A paragraph describing the current political and social state of Neo-Tokyo." },
        urban_legend: { type: Type.STRING, description: "A short, spooky urban legend told by the citizens of Neo-Tokyo." },
    },
    required: ["title", "maya_history", "quantum_fractures", "city_state", "urban_legend"],
};

export const generateLore = async (): Promise<Lore> => {
    const prompt = `
    You are a lore master for "Neo Tokyo Noir".
    Generate a foundational lore document for the world. It should cover the protagonist's history, the world's primary anomaly, the state of the city, and a local urban legend.
  `;
    return callGemini<Lore>(prompt, loreSchema);
};

// --- AI Behavior ---
export interface AiBehavior {
    name: string;
    role: string;
    form_recognition: string;
    tactical_adaptations: {
        stealth: string;
        combat: string;
        social: string;
    };
    long_term_evolution: string;
}

const aiBehaviorSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Name for this AI behavior profile (e.g., 'Hunter-Killer Protocol')." },
        role: { type: Type.STRING, description: "The role of the AI (e.g., Elite Corporate Enforcer, Rival Assassin)." },
        form_recognition: { type: Type.STRING, description: "How the AI detects and reacts to Maya's different shapeshifted forms." },
        tactical_adaptations: {
            type: Type.OBJECT,
            properties: {
                stealth: { type: Type.STRING, description: "How the AI counters Maya's stealth tactics." },
                combat: { type: Type.STRING, description: "How the AI adapts to Maya's combat style." },
                social: { type: Type.STRING, description: "How the AI resists or sees through Maya's social manipulation." },
            },
            required: ["stealth", "combat", "social"],
        },
        long_term_evolution: { type: Type.STRING, description: "How the AI learns and evolves over multiple encounters with Maya." },
    },
    required: ["name", "role", "form_recognition", "tactical_adaptations", "long_term_evolution"],
};

export const generateAiBehavior = async (): Promise<AiBehavior> => {
    const prompt = `
    You are a game AI designer for "Neo Tokyo Noir".
    Design a dynamic and adaptive AI behavior profile for an enemy or rival. This AI should be a true challenge for the shapeshifting protagonist, Maya Chen, by learning from her actions.
  `;
    return callGemini<AiBehavior>(prompt, aiBehaviorSchema);
};

// --- Playtesting Scenario ---
export interface PlaytestingScenario {
    title: string;
    objective: string;
    edge_cases: {
        combat: string;
        social: string;
        exploration: string;
    };
    potential_bugs: {
        animation: string;
        vfx: string;
        dialogue: string;
        game_state: string;
    };
    debugging_tools: string;
    easter_egg: string;
}

const playtestingScenarioSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Title for the QA test script." },
        objective: { type: Type.STRING, description: "The main goal of this playtesting scenario." },
        edge_cases: {
            type: Type.OBJECT,
            properties: {
                combat: { type: Type.STRING, description: "An edge case to test in combat." },
                social: { type: Type.STRING, description: "An edge case to test in social interactions." },
                exploration: { type: Type.STRING, description: "An edge case to test during exploration/platforming." },
            },
            required: ["combat", "social", "exploration"],
        },
        potential_bugs: {
            type: Type.OBJECT,
            properties: {
                animation: { type: Type.STRING, description: "A potential animation bug to look for." },
                vfx: { type: Type.STRING, description: "A potential VFX bug to look for." },
                dialogue: { type: Type.STRING, description: "A potential dialogue/subtitle bug to look for." },
                game_state: { type: Type.STRING, description: "A potential game state or save/load bug to look for." },
            },
            required: ["animation", "vfx", "dialogue", "game_state"],
        },
        debugging_tools: { type: Type.STRING, description: "A suggested debug command or tool to help with testing this scenario." },
        easter_egg: { type: Type.STRING, description: "A fun easter egg for the QA tester to find during the test." },
    },
    required: ["title", "objective", "edge_cases", "potential_bugs", "debugging_tools", "easter_egg"],
};

export const generatePlaytestingScenario = async (): Promise<PlaytestingScenario> => {
    const prompt = `
    You are a QA lead for "Neo Tokyo Noir".
    Generate a detailed playtesting scenario (QA script) designed to stress-test the game's core mechanic: Maya's shapeshifting. The script should focus on finding edge cases and potential bugs.
  `;
    return callGemini<PlaytestingScenario>(prompt, playtestingScenarioSchema);
};

// --- Blueprint ---
export interface Blueprint {
    title: string;
    description: string;
    variables: { name: string; type: string; description: string; }[];
    nodes: { id: number; name:string; type: string; description: string; connections: number[]; }[];
    notes: string;
}

const blueprintSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Title of the Blueprint Actor." },
        description: { type: Type.STRING, description: "High-level description of what this Blueprint does." },
        variables: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Variable name (e.g., 'IsDoorOpen')." },
                    type: { type: Type.STRING, description: "Variable type (e.g., 'Boolean', 'Actor Reference', 'Float')." },
                    description: { type: Type.STRING, description: "What this variable is used for." },
                },
                required: ["name", "type", "description"],
            }
        },
        nodes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.INTEGER, description: "A unique sequential ID for the node, starting at 1." },
                    name: { type: Type.STRING, description: "The name of the node (e.g., 'Event BeginPlay', 'Branch', 'Set Actor Location')." },
                    type: { type: Type.STRING, enum: ['Event', 'Function Call', 'Flow Control', 'Variable', 'Action', 'Macro'], description: "The category of the node." },
                    description: { type: Type.STRING, description: "What this specific node does in the graph." },
                    connections: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "An array of node IDs that this node's execution pin connects to." },
                },
                required: ["id", "name", "type", "description"],
            }
        },
        notes: { type: Type.STRING, description: "Implementation notes, suggestions, or warnings for the developer." },
    },
    required: ["title", "description", "variables", "nodes", "notes"],
};

export const generateBlueprint = async (logic: string): Promise<Blueprint> => {
    const prompt = `
    You are an expert Unreal Engine developer who translates natural language into high-level Blueprint plans.
    Based on the user's request, create a step-by-step plan for a Blueprint graph.

    **INPUT LOGIC:** ${logic}

    **INSTRUCTIONS:**
    - Break down the logic into a series of connected Blueprint nodes.
    - Define any necessary variables.
    - Provide clear descriptions and implementation notes.
    - Assign a logical type to each node.
  `;
    return callGemini<Blueprint>(prompt, blueprintSchema);
};

// --- Faction ---
export interface Faction {
    name: string;
    ideology: string;
    headquarters: string;
    hierarchy: string;
    public_agenda: string;
    secret_agenda: string;
    relationship_with_maya: string;
}

const factionSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the faction." },
        ideology: { type: Type.STRING, description: "A one-sentence summary of their core belief or philosophy." },
        headquarters: { type: Type.STRING, description: "Description of their base of operations." },
        hierarchy: { type: Type.STRING, description: "How the faction is structured." },
        public_agenda: { type: Type.STRING, description: "What they claim to be their goal." },
        secret_agenda: { type: Type.STRING, description: "What they are actually trying to achieve." },
        relationship_with_maya: { type: Type.STRING, description: "How they view the protagonist, Maya Chen, and why." },
    },
    required: ["name", "ideology", "headquarters", "hierarchy", "public_agenda", "secret_agenda", "relationship_with_maya"],
};

export const generateFaction = async (): Promise<Faction> => {
    const prompt = `
    You are a faction designer for "Neo Tokyo Noir".
    Generate a new, compelling faction that operates in the shadows of Neo-Tokyo. They should have conflicting public and private goals and a specific reason to be interested in the shapeshifting detective, Maya Chen.
  `;
    return callGemini<Faction>(prompt, factionSchema);
};

// --- Character Profile ---
export interface CharacterProfile {
    name: string;
    bio: {
        appearance: string;
        backstory: string;
        powers: string;
        weaknesses: string;
    };
    signature_move: {
        scene: string;
        art_prompt: string;
    };
    dialogue_sample: string;
}

const characterProfileSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Character's name." },
        bio: {
            type: Type.OBJECT,
            properties: {
                appearance: { type: Type.STRING },
                backstory: { type: Type.STRING },
                powers: { type: Type.STRING },
                weaknesses: { type: Type.STRING },
            },
            required: ["appearance", "backstory", "powers", "weaknesses"],
        },
        signature_move: {
            type: Type.OBJECT,
            properties: {
                scene: { type: Type.STRING, description: "A description of a scene where they use their signature move." },
                art_prompt: { type: Type.STRING, description: "A detailed AI art prompt for this signature move." },
            },
            required: ["scene", "art_prompt"],
        },
        dialogue_sample: { type: Type.STRING, description: "A sample line of dialogue that captures their personality." },
    },
    required: ["name", "bio", "signature_move", "dialogue_sample"],
};

export const generateCharacterProfile = async (concept: string, situation: string, transformation: string): Promise<CharacterProfile> => {
    const prompt = `
    You are a character writer for "Neo Tokyo Noir".
    Generate a complete character profile based on the provided details.

    **INPUTS:**
    *   **Concept:** ${concept}
    *   **Situation:** ${situation}
    *   **Signature Move:** ${transformation}

    **INSTRUCTIONS:**
    Flesh this out into a full character bio, a scene describing their signature move with a corresponding art prompt, and a sample line of dialogue.
  `;
    return callGemini<CharacterProfile>(prompt, characterProfileSchema);
};

// --- Character Dossier ---
export interface CharacterDossier {
    name: string;
    role: string;
    bio: {
        background: string;
        appearance: string;
        core_conflict: string;
    };
    signature_ability: string;
    weakness: string;
    art_prompt: string;
    dialogue_sample: string;
}

const characterDossierSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The character's name, from the input." },
        role: { type: Type.STRING, description: "The character's role, from the input." },
        bio: {
            type: Type.OBJECT,
            properties: {
                background: { type: Type.STRING, description: "A detailed background for the character, fitting the Neo-Tokyo Noir theme." },
                appearance: { type: Type.STRING, description: "A vivid description of the character's appearance, cybernetics, and fashion." },
                core_conflict: { type: Type.STRING, description: "The character's central internal or external conflict." },
            },
            required: ["background", "appearance", "core_conflict"],
        },
        signature_ability: { type: Type.STRING, description: "A detailed description of the signature ability, covering both its tactical use and visual effects." },
        weakness: { type: Type.STRING, description: "The character's primary weakness, explained with its ethical or narrative angle." },
        art_prompt: { type: Type.STRING, description: "A highly detailed AI art prompt (for Midjourney, Imagen, etc.) capturing the character in their element." },
        dialogue_sample: { type: Type.STRING, description: "A single, impactful line of dialogue that perfectly captures their voice and personality." },
    },
    required: ["name", "role", "bio", "signature_ability", "weakness", "art_prompt", "dialogue_sample"],
};

export const generateCharacterDossier = async (name: string, role: string, powers: string): Promise<CharacterDossier> => {
    const prompt = `
    You are a character designer and writer for "Neo Tokyo Noir".
    Your task is to build a complete character profile for Neo Tokyo Noir based on the provided inputs.

    **INPUTS:**
    *   **Character Name:** ${name}
    *   **Role:** ${role}
    *   **Key Powers:** ${powers}

    **Return:**
    - Bio (background, appearance, core conflict)
    - Signature ability (tactical/visual)
    - Weakness (ethical or narrative)
    - AI art prompt
    - Sample dialogue
    
    Adhere strictly to the JSON schema provided.
  `;
    return callGemini<CharacterDossier>(prompt, characterDossierSchema);
};


// --- DLC Character ---
export interface DlcCharacter {
    name: string;
    intro_scene: string;
    art_prompt: string;
    community_challenge: string;
    dialogue_sample: string;
}

const dlcCharacterSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the DLC character, from the input." },
        intro_scene: { type: Type.STRING, description: "A cinematic, one-paragraph intro scene for the character." },
        art_prompt: { type: Type.STRING, description: "A detailed AI art prompt for the character's intro scene." },
        community_challenge: { type: Type.STRING, description: "An idea for a community remix challenge involving this character." },
        dialogue_sample: { type: Type.STRING, description: "A single, impactful line of dialogue that captures the character's voice." },
    },
    required: ["name", "intro_scene", "art_prompt", "community_challenge", "dialogue_sample"],
};

export const generateDlcCharacter = async (name: string, theme: string, power: string): Promise<DlcCharacter> => {
    const prompt = `
    You are a creative director for "Neo Tokyo Noir".
    Generate a new DLC character or villain based on the provided inputs.

    **INPUTS:**
    *   **DLC Character Name:** ${name}
    *   **Theme:** ${theme}
    *   **Signature Power:** ${power}

    **INSTRUCTIONS:**
    Create a complete creative package for this character:
    1.  **Character Intro Scene:** A short, cinematic paragraph describing their arrival or a key moment.
    2.  **AI Art Prompt:** A detailed prompt for an image generator to create their key art.
    3.  **Community Remix Challenge:** An idea for a community art or story challenge.
    4.  **Dialogue Sample:** One line of dialogue that captures their personality.
    Ensure the generated 'name' field matches the input name exactly.
  `;
    return callGemini<DlcCharacter>(prompt, dlcCharacterSchema);
};

// --- Remix Challenge ---
export interface RemixChallenge {
    title: string;
    intro: string;
    submission_instructions: string;
    prize_details: string;
    closing_line: string;
}

const remixChallengeSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A catchy title for the remix challenge announcement." },
        intro: { type: Type.STRING, description: "A short challenge intro to the scene or theme." },
        submission_instructions: { type: Type.STRING, description: "Clear submission instructions, including the medium and platform (e.g., 'Post your art on X/Twitter with #NeoTokyoRemix')." },
        prize_details: { type: Type.STRING, description: "Details on the prize and potential canon integration for the winner." },
        closing_line: { type: Type.STRING, description: "A final, motivational closing line to encourage participation." },
    },
    required: ["title", "intro", "submission_instructions", "prize_details", "closing_line"],
};

export const generateRemixChallenge = async (dlcFocus: string): Promise<RemixChallenge> => {
    const prompt = `
    You are a community manager for "Neo Tokyo Noir".
    Draft a Remix Challenge announcement for a Neo Tokyo Noir DLC based on the provided focus.

    **INPUT - DLC Focus:** ${dlcFocus}

    **INSTRUCTIONS:**
    Generate a full announcement post. Include:
    1.  **Short Challenge Intro:** A brief, exciting introduction to the challenge scene or theme.
    2.  **Submission Instructions:** Clear instructions on the submission medium and platform.
    3.  **Prize/Canon Detail:** Details on the prize and how the winning entry could be integrated into the game's canon.
    4.  **Motivational Closing Line:** A final, motivational line to encourage participation.
    
    The response must strictly follow the JSON schema provided.
  `;
    return callGemini<RemixChallenge>(prompt, remixChallengeSchema);
};


// --- Merch Ideas ---
export interface MerchIdea {
    type: string;
    description: string;
    art_prompt_suggestion: string;
}

export interface MerchIdeas {
    title: string;
    ideas: MerchIdea[];
}

const merchIdeasSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A title for the merchandise concept collection, based on the input asset." },
        ideas: {
            type: Type.ARRAY,
            description: "An array of 4-5 distinct merchandise ideas.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "The type of merchandise (e.g., 'Poster', 'Sticker Sheet', 'AR Filter', 'Comic Layout', 'T-Shirt')." },
                    description: { type: Type.STRING, description: "A description of the merchandise concept." },
                    art_prompt_suggestion: { type: Type.STRING, description: "A suggestion for an AI art prompt or a specific visual element to feature." },
                },
                required: ["type", "description", "art_prompt_suggestion"],
            },
        },
    },
    required: ["title", "ideas"],
};

export const generateMerchIdeas = async (assetDescription: string): Promise<MerchIdeas> => {
    const prompt = `
    You are a merchandise designer for "Neo Tokyo Noir".
    Generate a collection of merchandise ideas based on a provided asset.

    **INPUT ASSET:** ${assetDescription}

    **INSTRUCTIONS:**
    Generate 4-5 creative and appealing merchandise concepts. Include ideas for posters, stickers, and more experimental items like AR filters or comic layouts. For each, provide a description and a suggested visual or art prompt.
  `;
    return callGemini<MerchIdeas>(prompt, merchIdeasSchema);
};

// --- Prompt Matrix ---
export interface GeneratedPrompt {
    character: string;
    location: string;
    prompt: string;
}

// --- Interactive Scene ---
export interface Choice {
    text: string;
    target: string;
}

export interface InteractiveScene {
    title: string;
    narrative_text: string;
    choices: Choice[];
}

const interactiveSceneSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The title of the interactive scene or passage, derived from the input." },
        narrative_text: { type: Type.STRING, description: "A rich, descriptive paragraph setting the scene and presenting the situation to the player." },
        choices: {
            type: Type.ARRAY,
            description: "An array of 3-4 distinct choices for the player.",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The text for the choice link, e.g., 'Attack with Glitch Clones'." },
                    target: { type: Type.STRING, description: "The name of the target passage this choice leads to, e.g., 'Glitch Clone Attack'." },
                },
                required: ["text", "target"],
            },
        },
    },
    required: ["title", "narrative_text", "choices"],
};

export const generateInteractiveScene = async (concept: string): Promise<InteractiveScene> => {
    const prompt = `
    You are an interactive fiction writer for "Neo Tokyo Noir".
    Your task is to generate a single "passage" or "node" for a branching narrative, like in a Twine game.

    **INPUT CONCEPT:** ${concept}

    **INSTRUCTIONS:**
    - Based on the concept, write a compelling title and a rich narrative description of the scene.
    - Create 3-4 distinct player choices that branch from this scene.
    - For each choice, provide the link text and the name of the target passage it should lead to.
    - Adhere strictly to the JSON schema.
  `;
    return callGemini<InteractiveScene>(prompt, interactiveSceneSchema);
};

// --- Glossary Entry ---
export interface GlossaryEntry {
    name: string;
    type: string;
    definition: string;
    usage_origin: string;
    art_prompt?: string;
}

const glossaryEntrySchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the glossary entry, from the input." },
        type: { type: Type.STRING, description: "The type of entry (e.g., Technology, Faction, Location, Power), from the input." },
        definition: { type: Type.STRING, description: "A concise, exactly 2-sentence definition or description of the entry." },
        usage_origin: { type: Type.STRING, description: "A short in-world usage example or origin story for the entry." },
        art_prompt: { type: Type.STRING, description: "An optional, detailed AI art prompt to visualize the entry. Only include if visually applicable." },
    },
    required: ["name", "type", "definition", "usage_origin"],
};

export const generateGlossaryEntry = async (entryType: string, entryName: string): Promise<GlossaryEntry> => {
    const prompt = `
    You are a lore master and world-builder for "Neo Tokyo Noir".
    Expand the world bible by generating a detailed glossary entry.

    **INPUTS:**
    *   **Entry Type:** ${entryType}
    *   **Entry Name:** ${entryName}

    **OUTPUT REQUIREMENTS:**
    1.  **Definition:** A concise, exactly 2-sentence description.
    2.  **Usage/Origin:** An in-world usage example or a brief origin story.
    3.  **Art Prompt:** If the concept is visually distinct, provide a detailed AI art prompt. If not, omit this field.

    Adhere strictly to the JSON schema. Ensure the 'name' and 'type' fields in the output match the inputs exactly.
  `;
    return callGemini<GlossaryEntry>(prompt, glossaryEntrySchema);
};

// --- Scene Matrix ---
export interface SceneMatrixEntryData {
  scene_description: string;
  tactical_move: string;
  art_prompt: string;
  dialogue: string;
}

export interface SceneMatrixEntry extends SceneMatrixEntryData {
  character: string;
  location: string;
}

const sceneMatrixEntrySchema = {
    type: Type.OBJECT,
    properties: {
        scene_description: { type: Type.STRING, description: "A cinematic, 3-5 sentence cyberpunk scene description." },
        tactical_move: { type: Type.STRING, description: "A description of a tactical move the character performs, including glitch or quantum FX." },
        art_prompt: { type: Type.STRING, description: "A detailed AI art prompt for the scene (for Midjourney, Imagen, etc.)." },
        dialogue: { type: Type.STRING, description: "A single, impactful line of dialogue from the character's perspective." },
    },
    required: ["scene_description", "tactical_move", "art_prompt", "dialogue"],
};

export const generateSceneMatrixEntry = async (character: string, location: string): Promise<SceneMatrixEntryData> => {
    const prompt = `
    You are a scene writer for "Neo Tokyo Noir".
    Generate a cinematic cyberpunk scene based on the given character and location.

    **INPUTS:**
    *   **Character:** ${character}
    *   **Location:** ${location}

    **OUTPUT REQUIREMENTS:**
    1.  **Scene Description:** A rich, 3-5 sentence description of the scene.
    2.  **Tactical Move:** A creative tactical move the character uses, with glitch/quantum FX.
    3.  **AI Art Prompt:** A detailed art prompt for an AI image generator.
    4.  **Dialogue:** A single, in-character line of dialogue.

    Adhere strictly to the JSON schema provided.
  `;
    return callGemini<SceneMatrixEntryData>(prompt, sceneMatrixEntrySchema);
};

// --- Character Batch ---
export interface BatchCharacterProfile {
    name: string;
    role_and_backstory: string;
    powers_and_signature_move: string;
    appearance: string;
    weakness: string;
    art_prompt: string;
    dialogue_sample: string;
}

const batchCharacterProfileSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The character's name, from the input." },
        role_and_backstory: { type: Type.STRING, description: "The character's role in the world and their detailed backstory." },
        powers_and_signature_move: { type: Type.STRING, description: "A description of the character's powers, including a detailed signature move with visual and tactical elements." },
        appearance: { type: Type.STRING, description: "A vivid description of the character's visual style, including clothing, cybernetics, and overall aesthetic." },
        weakness: { type: Type.STRING, description: "The character's primary physical, psychological, or ethical weakness." },
        art_prompt: { type: Type.STRING, description: "A highly detailed AI art prompt capturing the character's essence." },
        dialogue_sample: { type: Type.STRING, description: "A single, impactful line of dialogue that captures their voice." },
    },
    required: ["name", "role_and_backstory", "powers_and_signature_move", "appearance", "weakness", "art_prompt", "dialogue_sample"],
};

export const generateBatchCharacterProfile = async (name: string): Promise<BatchCharacterProfile> => {
    const prompt = `
    You are a character writer for "Neo Tokyo Noir".
    For the character named **${name}**, generate a complete character profile for the world of Neo Tokyo Noir.

    **Return:**
    - Role and backstory
    - Powers (with a signature move)
    - Appearance (visual style)
    - Weakness
    - AI art prompt
    - A dialogue sample

    Adhere strictly to the JSON schema provided, ensuring the 'name' field in the output matches the input name exactly.
  `;
    return callGemini<BatchCharacterProfile>(prompt, batchCharacterProfileSchema);
};

// --- Timeline Split ---
export interface TimelineBranch {
    title: string;
    outcome_summary: string;
    scene_hook: string;
    art_prompt: string;
}

export interface TimelineSplit {
    event_title: string;
    branches: TimelineBranch[];
}

const timelineSplitSchema = {
    type: Type.OBJECT,
    properties: {
        event_title: { type: Type.STRING, description: "A title for the timeline split event, derived from the input." },
        branches: {
            type: Type.ARRAY,
            description: "An array of 2-3 branching timeline outcomes.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A catchy name for this timeline branch (e.g., 'The Unity', 'The Severance')." },
                    outcome_summary: { type: Type.STRING, description: "A summary of what happens in this timeline branch." },
                    scene_hook: { type: Type.STRING, description: "A cinematic scene hook to introduce this new reality." },
                    art_prompt: { type: Type.STRING, description: "A detailed AI art prompt to visualize this timeline." },
                },
                required: ["title", "outcome_summary", "scene_hook", "art_prompt"],
            },
        },
    },
    required: ["event_title", "branches"],
};

export const generateTimelineSplit = async (event: string): Promise<TimelineSplit> => {
    const prompt = `
    You are a narrative designer for "Neo Tokyo Noir".
    Generate a timeline split scenario based on a pivotal event.

    **INPUT EVENT:** ${event}

    **INSTRUCTIONS:**
    Create 2-3 distinct branching timeline outcomes from this event. For each branch, provide:
    1.  **Branch Title:** A cool name for the timeline.
    2.  **Outcome Summary:** A summary of what this new reality is like.
    3.  **Scene Hook:** A short, cinematic scene to kick off a story in this timeline.
    4.  **AI Art Prompt:** A detailed art prompt capturing the essence of the branch.

    Adhere strictly to the JSON schema.
  `;
    return callGemini<TimelineSplit>(prompt, timelineSplitSchema);
};

// --- Location Batch ---
export interface BatchLocationProfile {
    name: string;
    description: string;
    key_feature_or_npc: string;
    art_prompt: string;
}

const batchLocationProfileSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The location's name, from the input." },
        description: { type: Type.STRING, description: "A short, evocative description of the location." },
        key_feature_or_npc: { type: Type.STRING, description: "A key feature of the location or a notable NPC found there." },
        art_prompt: { type: Type.STRING, description: "A detailed AI art prompt for creating environment concept art." },
    },
    required: ["name", "description", "key_feature_or_npc", "art_prompt"],
};

export const generateBatchLocationProfile = async (locationName: string): Promise<BatchLocationProfile> => {
    const prompt = `
    You are a world-builder for "Neo Tokyo Noir".
    For the location named **${locationName}**, generate a brief profile.

    **Return:**
    - A short description.
    - A key feature or a notable NPC found there.
    - An AI art prompt for environment concept art.

    Adhere strictly to the JSON schema, ensuring the 'name' field in the output matches the input name exactly.
  `;
    return callGemini<BatchLocationProfile>(prompt, batchLocationProfileSchema);
};

// --- Dialogue Tree ---
export interface DialogueBranch {
    dialogue_option: string;
    outcome_summary: string;
    in_world_consequence: string;
}

export interface DialogueTree {
    topic: string;
    branches: DialogueBranch[];
}

const dialogueTreeSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING, description: "The topic of the negotiation, derived from the input." },
        branches: {
            type: Type.ARRAY,
            description: "An array of 3-4 dialogue branches.",
            items: {
                type: Type.OBJECT,
                properties: {
                    dialogue_option: { type: Type.STRING, description: "Maya Chen's line of dialogue for this option." },
                    outcome_summary: { type: Type.STRING, description: "A summary of the likely immediate outcome of choosing this option." },
                    in_world_consequence: { type: Type.STRING, description: "A suggested longer-term in-world consequence of this choice." },
                },
                required: ["dialogue_option", "outcome_summary", "in_world_consequence"],
            },
        },
    },
    required: ["topic", "branches"],
};

export const generateDialogueTree = async (topic: string): Promise<DialogueTree> => {
    const prompt = `
    You are a narrative designer for "Neo Tokyo Noir".
    Create an interactive dialogue tree for a negotiation scene.

    **INPUT SCENARIO:** ${topic}

    **INSTRUCTIONS:**
    Generate 3-4 main dialogue options for the protagonist. For each option, describe:
    1.  The likely immediate outcome.
    2.  The longer-term in-world consequence.

    Adhere strictly to the JSON schema provided.
  `;
    return callGemini<DialogueTree>(prompt, dialogueTreeSchema);
};


// --- Project Blueprint ---
interface ProjectAsset {
  name: string;
  description: string;
}

interface AudioCategory {
  category: string;
  description: string;
}

export interface ProjectBlueprint {
  project_title: string;
  core_characters: ProjectAsset[];
  environment_modules: ProjectAsset[];
  hud_ui_assets: ProjectAsset[];
  dlc_packs: ProjectAsset[];
  audio_sfx: AudioCategory[];
  folder_structure: string;
}

const projectAssetSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the asset or Blueprint." },
        description: { type: Type.STRING, description: "A brief description of the asset and its requirements." }
    },
    required: ["name", "description"]
};

const audioCategorySchema = {
    type: Type.OBJECT,
    properties: {
        category: { type: Type.STRING, description: "The name of the audio category." },
        description: { type: Type.STRING, description: "A brief description of the types of sounds in this category." }
    },
    required: ["category", "description"]
};

const projectBlueprintSchema = {
    type: Type.OBJECT,
    properties: {
        project_title: { type: Type.STRING, description: "The title of the project, 'Neo Tokyo Noir'." },
        core_characters: { type: Type.ARRAY, description: "A prioritized list of core character Blueprints and their associated powers/FX.", items: projectAssetSchema },
        environment_modules: { type: Type.ARRAY, description: "A prioritized list of modular environment assets for building the city.", items: projectAssetSchema },
        hud_ui_assets: { type: Type.ARRAY, description: "A prioritized list of HUD and UI assets.", items: projectAssetSchema },
        dlc_packs: { type: Type.ARRAY, description: "A prioritized list of potential DLC or expansion packs.", items: projectAssetSchema },
        audio_sfx: { type: Type.ARRAY, description: "A prioritized list of audio and SFX categories.", items: audioCategorySchema },
        folder_structure: { type: Type.STRING, description: "A string representing a hierarchical folder structure for the Unreal Engine project, using indentation and standard conventions." }
    },
    required: ["project_title", "core_characters", "environment_modules", "hud_ui_assets", "dlc_packs", "audio_sfx", "folder_structure"]
};

export const generateProjectBlueprint = async (): Promise<ProjectBlueprint> => {
    const prompt = `
    You are a technical director and lead designer for a new Unreal Engine project based on the "Neo Tokyo Noir" universe.
    Your task is to generate a prioritized list of Blueprints and assets needed to begin development.

    **INSTRUCTIONS:**
    Create a comprehensive list covering the following categories. Be specific and prioritize the most crucial assets first within each category.
    - Core characters and their powers/FX (e.g., Character_BP_Maya, Niagara_FX_Glitch)
    - City environment modules (e.g., SM_Bldg_Facade_A, BP_Hologram_Ad)
    - HUD/UI assets (e.g., WBP_MainHUD, WBP_DialogueSystem)
    - DLC/Expansion packs (e.g., DLC_Solaris_Questline)
    - Audio and SFX categories (e.g., Ambience_QuantumQuarter, SFX_Shapeshift)
    - A suggested folder structure following Unreal Engine best practices.

    Adhere strictly to the JSON schema provided.
  `;
    return callGemini<ProjectBlueprint>(prompt, projectBlueprintSchema);
};

// --- Creative Batch ---
export interface NewCharacter {
    name: string;
    bio: string;
    power: string;
    weakness: string;
    art_prompt: string;
}
export interface NewLocation {
    name: string;
    description: string;
    feature: string;
    art_prompt: string;
}
export interface NewDlcIdea {
    name: string;
    theme: string;
    hook: string;
    challenge: string;
}
export interface CreativeBatch {
    characters: NewCharacter[];
    locations: NewLocation[];
    art_prompts: string[];
    dlc_ideas: NewDlcIdea[];
}
const creativeBatchSchema = {
    type: Type.OBJECT,
    properties: {
        characters: {
            type: Type.ARRAY, description: "Generate exactly 3 new, unique characters.",
            items: {
                type: Type.OBJECT, properties: {
                    name: { type: Type.STRING }, bio: { type: Type.STRING }, power: { type: Type.STRING }, weakness: { type: Type.STRING }, art_prompt: { type: Type.STRING }
                }, required: ["name", "bio", "power", "weakness", "art_prompt"]
            }
        },
        locations: {
            type: Type.ARRAY, description: "Generate exactly 3 new, unique locations.",
            items: {
                type: Type.OBJECT, properties: {
                    name: { type: Type.STRING }, description: { type: Type.STRING }, feature: { type: Type.STRING }, art_prompt: { type: Type.STRING }
                }, required: ["name", "description", "feature", "art_prompt"]
            }
        },
        art_prompts: { type: Type.ARRAY, description: "Generate exactly 3 new, unique, and evocative AI art prompts.", items: { type: Type.STRING } },
        dlc_ideas: {
            type: Type.ARRAY, description: "Generate exactly 3 new, unique DLC ideas.",
            items: {
                type: Type.OBJECT, properties: {
                    name: { type: Type.STRING }, theme: { type: Type.STRING }, hook: { type: Type.STRING }, challenge: { type: Type.STRING }
                }, required: ["name", "theme", "hook", "challenge"]
            }
        },
    },
    required: ["characters", "locations", "art_prompts", "dlc_ideas"]
};
export const generateCreativeBatch = async (): Promise<CreativeBatch> => {
    const prompt = `
    You are a creative director for "Neo Tokyo Noir".
    Batch-generate a diverse set of new creative assets for the game.

    **INSTRUCTIONS:**
    Generate exactly:
    - 3 new characters, each with a bio, power, weakness, and art prompt.
    - 3 new locations, each with a description, key feature, and art prompt.
    - 3 new, standalone AI art prompts.
    - 3 new DLC ideas, each with an expansion name, theme, hook, and community challenge.
    
    Adhere strictly to the JSON schema provided.
  `;
    return callGemini<CreativeBatch>(prompt, creativeBatchSchema);
};


// --- Workflow ---
export interface WorkflowStep {
    step: string;
    details: string;
}
export interface Workflow {
    title: string;
    workflow_steps: WorkflowStep[];
    folder_conventions: string;
    automation_tips: string[];
    versioning_and_crediting: string[];
}
const workflowSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A title for the workflow, e.g., 'Neo-Tokyo Noir Asset Production Workflow'." },
        workflow_steps: {
            type: Type.ARRAY,
            description: "A list of sequential steps in the workflow.",
            items: {
                type: Type.OBJECT,
                properties: {
                    step: { type: Type.STRING, description: "The title of the workflow step (e.g., 'Step 1: Asset Generation')." },
                    details: { type: Type.STRING, description: "Detailed description of the step, including tools and scripts to use." }
                },
                required: ["step", "details"]
            }
        },
        folder_conventions: { type: Type.STRING, description: "A string representing a hierarchical folder structure for managing generated assets before engine import." },
        automation_tips: { type: Type.ARRAY, description: "A list of tips for automating the workflow.", items: { type: Type.STRING } },
        versioning_and_crediting: { type: Type.ARRAY, description: "A list of suggestions for versioning assets and crediting contributors.", items: { type: Type.STRING } },
    },
    required: ["title", "workflow_steps", "folder_conventions", "automation_tips", "versioning_and_crediting"]
};

export const generateWorkflow = async (): Promise<Workflow> => {
    const prompt = `
    You are a technical director and pipeline expert.
    Design an end-to-end workflow for generating, tagging, and batch-importing all characters, scenes, and assets from this creative suite into Google AI Studio and Unreal Engine 5.6.

    **Return:**
    - Workflow steps (with tools/scripts suggestions).
    - Folder naming conventions for asset management.
    - Automation tips.
    - Suggestions for versioning and crediting contributors.

    Adhere strictly to the JSON schema provided.
  `;
    return callGemini<Workflow>(prompt, workflowSchema);
};
