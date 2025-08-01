
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateScene = async (
  location: string,
  outfit: string,
  situation: string
): Promise<string> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are a master storyteller and world-builder for the AAA video game “Neo-Tokyo Noir: Chrome and Shadows.”
    Your task is to write a short, evocative, and cinematic scene description in 2-3 paragraphs. Embrace a dark, cyberpunk noir tone.

    **SCENE DETAILS:**
    *   **Game:** Neo-Tokyo Noir: Chrome and Shadows
    *   **Main Character:** Maya Chen, a shapeshifting heroine. Her powers allow her to subtly alter her appearance or interact with technology in unique ways. Her personality is sharp, observant, and haunted by her past.
    *   **Location:** ${location}
    *   **Maya's Outfit/Form:** Maya is ${outfit}.
    *   **Situation:** ${situation}.

    **INSTRUCTIONS:**
    1.  **Atmosphere is Key:** Weave in details about the environment. Is it raining? What do the neon signs and holographic ads look like? What sounds fill the air? Use sensory details.
    2.  **Character-Driven:** Describe the scene from Maya's perspective or focus on her actions and internal thoughts. Show, don't just tell.
    3.  **Incorporate Powers/Personality:** Explicitly describe how Maya's shapeshifting abilities or her keen, noir-detective personality influence this specific moment. For example, does a flicker in her form betray her emotions? Does her enhanced perception pick up a detail others would miss?
    4.  **Cinematic Language:** Write as if you are describing a shot in a movie. Use dynamic verbs and vivid imagery. Keep it concise but impactful.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

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
      name: { type: Type.STRING, description: "The NPC's full name." },
      codename: { type: Type.STRING, description: "The NPC's street codename or handle." },
      description: {
        type: Type.OBJECT,
        properties: {
          physical: { type: Type.STRING, description: "The NPC's physical appearance." },
          cybernetics: { type: Type.STRING, description: "Noticeable cybernetic enhancements or traits." },
          fashion: { type: Type.STRING, description: "Their clothing style and fashion sense." },
          aura: { type: Type.STRING, description: "The general vibe or presence they project." },
        },
        required: ["physical", "cybernetics", "fashion", "aura"]
      },
      secret: { type: Type.STRING, description: "A personal secret or a powerful motivation driving them." },
      connection: { type: Type.STRING, description: "Their relationship to the player character, Maya Chen (e.g., friend, rival, enemy, ambiguous)." },
      lines: {
        type: Type.OBJECT,
        properties: {
          flirty: { type: Type.STRING, description: "A signature flirty line they might use." },
          threatening: { type: Type.STRING, description: "A signature threatening line they might use." },
        },
        required: ["flirty", "threatening"]
      },
      quest: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The title of a potential quest or favor." },
          description: { type: Type.STRING, description: "A brief description of the quest or favor they might offer Maya." },
        },
        required: ["title", "description"]
      },
    },
    required: ["name", "codename", "description", "secret", "connection", "lines", "quest"],
};

export const generateNpc = async (): Promise<Npc> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are a master storyteller and world-builder for the AAA video game “Neo-Tokyo Noir: Chrome and Shadows.”
    Your task is to generate a complete, unique, and compelling Non-Player Character (NPC) that fits the game's dark, cyberpunk noir setting. The world is defined by reality glitches and advanced quantum technology that can alter perception and physical matter.

    **NPC REQUIREMENTS:**
    *   **Uniqueness:** Create a character that feels fresh and memorable. Avoid common cyberpunk tropes unless you can give them a unique twist.
    *   **Name and Codename:** Give them a believable name and a cool, fitting codename.
    *   **Description:** Provide a rich description covering their physical appearance, noticeable cybernetics, distinct fashion, and the overall aura they project.
    *   **Secret/Motivation:** What is their core driver? What secret do they protect? This should be a compelling plot hook.
    *   **Connection to Maya Chen:** Define their relationship with the protagonist, Maya. It can be anything from friend, rival, love interest, enemy, or something more ambiguous and complex.
    *   **Signature Lines:** Write two distinct lines of dialogue: one flirty, one threatening. These should perfectly capture their personality.
    *   **Quest/Favor:** Design a quest or a favor they might ask of Maya. It should be intriguing and relevant to the character and the world.

    **INSTRUCTIONS:**
    1.  **Embrace the Theme:** The character should feel like they belong in a world where reality is unstable. Perhaps their cybernetics are quantum-entangled, or they have a unique understanding of the digital glitches that plague the city.
    2.  **Depth and Nuance:** Give the character a personality that is more than one-note. A rival could be honorable; a friend could have a dark secret.
    3.  **JSON Output:** Generate the character details strictly following the provided JSON schema. Do not add any extra text or explanations outside of the JSON structure.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: npcSchema,
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Npc;

  } catch (error) {
    console.error("Error generating NPC from Gemini:", error);
    throw new Error("Failed to communicate with the AI model to generate NPC.");
  }
};

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
    title: { type: Type.STRING, description: "A cool, noir-inspired title for the side quest." },
    hook: { type: Type.STRING, description: "How the quest begins: a mysterious anomaly or request Maya receives in a neon-lit part of Neo-Tokyo." },
    objective: { type: Type.STRING, description: "The primary goal of the quest." },
    challenges: {
      type: Type.OBJECT,
      properties: {
        stealth: { type: Type.STRING, description: "Describe a stealth or infiltration section of the quest." },
        dilemma: { type: Type.STRING, description: "Describe the core moral dilemma Maya faces, e.g., saving someone at a personal cost or dealing with an ambiguous NPC." }
      },
      required: ["stealth", "dilemma"]
    },
    outcomes: {
      type: Type.OBJECT,
      properties: {
        flirtation: { type: Type.STRING, description: "The result if Maya uses flirtation or charm to resolve a key situation." },
        intimidation: { type: Type.STRING, description: "The result if Maya uses intimidation or threats." },
        hacking: { type: Type.STRING, description: "The result if Maya uses her technical hacking skills." },
      },
      required: ["flirtation", "intimidation", "hacking"]
    },
    resolution: { type: Type.STRING, description: "How the quest concludes based on Maya's actions." },
    teaser: { type: Type.STRING, description: "A final hint or discovery that points towards a larger city secret or quantum threat." }
  },
  required: ["title", "hook", "objective", "challenges", "outcomes", "resolution", "teaser"]
};

export const generateQuest = async (): Promise<Quest> => {
    const model = "gemini-2.5-flash";
    const prompt = `
        You are a master quest designer for the AAA video game “Neo-Tokyo Noir: Chrome and Shadows.”
        Your task is to generate a complete, unique, and compelling side quest that fits the game's dark, cyberpunk noir setting, where reality glitches and quantum technology are central themes. The protagonist is Maya Chen, a shapeshifting detective.

        **QUEST REQUIREMENTS:**
        1.  **Mysterious Start:** The quest must begin with a strange anomaly or a mysterious request Maya encounters in a vibrant, neon-drenched district of Neo-Tokyo.
        2.  **Stealth Challenge:** It must include at least one significant stealth or infiltration challenge where Maya has to bypass security, guards, or surveillance systems.
        3.  **Moral Dilemma:** At its core, the quest must present Maya with a difficult moral choice. This could involve an ambiguous NPC, a choice between two bad outcomes, or a personal sacrifice.
        4.  **Multiple Outcomes:** A key conflict within the quest must be resolvable in at least three ways: through **flirtation/charm**, **intimidation/threats**, or **technical hacking**. Describe the outcome for each path.
        5.  **Quantum Threat Teaser:** The quest's conclusion must reveal a small piece of a larger puzzle, hinting at a city-wide secret or a looming threat related to unstable quantum technology.

        **INSTRUCTIONS:**
        *   **Be Creative:** Design a quest that feels unique and memorable.
        *   **Embrace the Noir:** The tone should be cynical, mysterious, and morally gray.
        *   **JSON Output:** Generate the quest details strictly following the provided JSON schema. Do not add any extra text or explanations outside of the JSON structure.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: questSchema,
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Quest;

    } catch (error) {
        console.error("Error generating Quest from Gemini:", error);
        throw new Error("Failed to communicate with the AI model to generate Quest.");
    }
};

export const generateArtPrompt = async (
  transformation: string,
  mood: string
): Promise<string> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are a professional concept art director. Your task is to generate a highly detailed and evocative art prompt for an image generation AI. The subject is Maya Chen, the protagonist of the cyberpunk noir game "Neo-Tokyo Noir: Chrome and Shadows."

    **ART PROMPT REQUIREMENTS:**

    **Subject:** Maya Chen, a powerful female shapeshifter.

    **Core Concept:** Maya captured mid-transformation, showcasing her fluid and dangerous nature.

    **Transformation State:** Her form is shifting into: ${transformation}.

    **Outfit:** She wears a sleek, form-fitting black latex suit. The suit is futuristic and features subtle, glitching digital patterns that ripple across its surface like corrupted data. A signature piece is her glowing silver-blue armband on her left bicep, which acts as the catalyst for her powers.

    **Lighting & Atmosphere:**
    *   **Lighting:** Cinematic, dramatic lighting with high contrast. Strong neon highlights (pinks, blues, purples) from the city signs reflecting off wet surfaces and her suit. Volumetric light rays cutting through the rain.
    *   **Mood:** The scene should feel ${mood}. Her expression should reflect this.
    *   **Environment:** A rain-slicked alley or rooftop in Neo-Tokyo at night. The background is filled with towering skyscrapers, holographic advertisements, and a constant downpour of rain.

    **Composition & Quality:**
    *   **Shot:** Medium close-up, focusing on Maya from the waist up to emphasize her expression and transformation.
    *   **Style:** Hyper-realistic, cinematic render in Unreal Engine 5.6, photorealistic, 8K resolution, intricate detail, next-gen Nanite geometry and foliage, advanced Lumen global illumination and reflections, octane render.

    **Final Instructions:**
    Combine all these elements into a single, cohesive paragraph. Start the prompt with the core subject and action. Use dynamic and descriptive language. Do not add any conversational text, just the final prompt.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating art prompt from Gemini:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

export interface Dialogue {
  title: string;
  setting: string;
  npc_line: string;
  maya_options: {
    type: 'Flirt' | 'Intimidate' | 'Persuade' | 'Deceive' | 'Question' | string;
    line: string;
    npc_reaction: string;
    outcome: string;
  }[];
}

const dialogueSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A fitting title for the dialogue scene." },
        setting: { type: Type.STRING, description: "A brief, atmospheric description of where the scene takes place." },
        npc_line: { type: Type.STRING, description: "The opening line from the NPC that prompts Maya's response." },
        maya_options: {
            type: Type.ARRAY,
            description: "An array of response options for Maya.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "The tone or approach of the response (e.g., Flirt, Intimidate, Persuade, Deceive, Question)." },
                    line: { type: Type.STRING, description: "The dialogue line for Maya." },
                    npc_reaction: { type: Type.STRING, description: "How the NPC verbally and emotionally reacts to Maya's line." },
                    outcome: { type: Type.STRING, description: "The immediate consequence of this choice on the relationship or mission." },
                },
                required: ["type", "line", "npc_reaction", "outcome"],
            },
        },
    },
    required: ["title", "setting", "npc_line", "maya_options"],
};


export const generateDialogue = async (npcRole: string, situation: string): Promise<Dialogue> => {
    const model = "gemini-2.5-flash";
    const prompt = `
        You are a senior narrative designer for the AAA video game “Neo-Tokyo Noir: Chrome and Shadows.”
        Your task is to write a short, branching dialogue scene. The scene should present the player with clear choices and meaningful consequences.

        **SCENE DETAILS:**
        *   **Game:** Neo-Tokyo Noir: Chrome and Shadows
        *   **Protagonist:** Maya Chen, a sharp, cynical, and resourceful shapeshifting detective.
        *   **NPC:** ${npcRole}
        *   **Situation:** ${situation}

        **REQUIREMENTS:**
        1.  **Branching Path:** Create at least 2-3 distinct response options for Maya. Each option must represent a different approach (e.g., Flirt, Intimidate, Persuade, Deceive, Question).
        2.  **Clear Consequences:** For each of Maya's options, describe how the NPC reacts and what the immediate outcome is. How does it affect the relationship (e.g., +Trust, -Respect) or the mission (e.g., gains new info, closes off a lead)?
        3.  **Character Voice:** Ensure the dialogue fits the characters. Maya is a noir protagonist—witty and cautious. The NPC's dialogue should reflect their specified role.
        4.  **Noir Tone:** The dialogue should be tense, atmospheric, and laced with subtext.

        **INSTRUCTIONS:**
        *   Generate the dialogue scene strictly following the provided JSON schema. Do not add any extra text or explanations outside of the JSON structure.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: dialogueSchema,
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Dialogue;

    } catch (error) {
        console.error("Error generating Dialogue from Gemini:", error);
        throw new Error("Failed to communicate with the AI model to generate Dialogue.");
    }
};

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
        ideology: { type: Type.STRING, description: "The core belief system or philosophy that drives the faction." },
        headquarters: { type: Type.STRING, description: "A description of the faction's base of operations." },
        hierarchy: { type: Type.STRING, description: "The organizational structure and key roles within the faction." },
        public_agenda: { type: Type.STRING, description: "What the faction claims to be working towards." },
        secret_agenda: { type: Type.STRING, description: "The faction's true, hidden goals." },
        relationship_with_maya: { type: Type.STRING, description: "The faction's initial stance towards the protagonist, Maya Chen (e.g., ally, enemy, potential client, rival)." }
    },
    required: ["name", "ideology", "headquarters", "hierarchy", "public_agenda", "secret_agenda", "relationship_with_maya"],
};

export const generateFaction = async (): Promise<Faction> => {
    const model = "gemini-2.5-flash";
    const prompt = `
        You are a lead writer for the AAA video game “Neo-Tokyo Noir: Chrome and Shadows.”
        Your task is to generate a complete, unique, and compelling faction that fits the game's dark, cyberpunk noir setting. These factions are powerful groups vying for control and influence in the fractured reality of Neo-Tokyo.

        **FACTION REQUIREMENTS:**
        1.  **Name:** A cool, evocative name that reflects their identity (e.g., The Onyx Syndicate, Children of the Glitch, Chronos Wardens).
        2.  **Ideology:** What is their core philosophy? Are they anarchists, corporate purists, transhumanist zealots, digital preservationists, or something else entirely?
        3.  **Headquarters:** Describe their base of operations. Is it a high-tech skyscraper, a hidden network of tunnels, a virtual reality space, or a repurposed industrial relic?
        4.  **Hierarchy:** Briefly describe their structure. Is it a rigid corporate ladder, a fluid collective, a council of elders, or led by a single charismatic figure?
        5.  **Agendas (Public & Secret):** What do they tell the world they want, and what do they *really* want? The secret agenda should be a potential plot driver.
        6.  **Relationship with Maya Chen:** What is their starting relationship with the protagonist? Are they a direct threat, a potential employer, a rival organization, or an unpredictable neutral party?

        **INSTRUCTIONS:**
        *   Be creative and ensure the faction feels like a natural part of a cyberpunk noir world.
        *   Generate the faction details strictly following the provided JSON schema. Do not add any extra text or explanations outside of the JSON structure.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: factionSchema,
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Faction;

    } catch (error) {
        console.error("Error generating Faction from Gemini:", error);
        throw new Error("Failed to communicate with the AI model to generate Faction.");
    }
};

export interface Scenario {
  title: string;
  environment: string;
  enemies: string;
  maya_abilities: string;
  resolutions: {
    direct_assault: {
      outcome: string;
      reward: string;
    },
    stealth: {
      outcome: string;
      reward: string;
    },
    social: {
      outcome: string;
      reward: string;
    },
    hacking: {
      outcome: string;
      reward: string;
    }
  }
}

const scenarioSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A cool, action-oriented title for the scenario." },
    environment: { type: Type.STRING, description: "A detailed, atmospheric description of the combat/stealth environment." },
    enemies: { type: Type.STRING, description: "A description of the enemy types, their numbers, and their primary tactics." },
    maya_abilities: { type: Type.STRING, description: "Creative ways Maya can use her shapeshifting or glitch powers in this specific environment to gain an advantage." },
    resolutions: {
      type: Type.OBJECT,
      properties: {
        direct_assault: {
          type: Type.OBJECT,
          properties: {
            outcome: { type: Type.STRING, description: "The result of Maya choosing a direct, aggressive combat approach." },
            reward: { type: Type.STRING, description: "The reward for succeeding via direct assault (e.g., specific loot, reputation change)." }
          },
          required: ["outcome", "reward"]
        },
        stealth: {
          type: Type.OBJECT,
          properties: {
            outcome: { type: Type.STRING, description: "The result of Maya using stealth to bypass or neutralize enemies." },
            reward: { type: Type.STRING, description: "The reward for a successful stealth approach (e.g., bonus intel, unique item)." }
          },
          required: ["outcome", "reward"]
        },
        social: {
          type: Type.OBJECT,
          properties: {
            outcome: { type: Type.STRING, description: "The result of Maya using social skills (flirtation, intimidation, deception) to resolve the situation without combat." },
            reward: { type: Type.STRING, description: "The reward for a social resolution (e.g., a new contact, a future favor)." }
          },
          required: ["outcome", "reward"]
        },
        hacking: {
          type: Type.OBJECT,
          properties: {
            outcome: { type: Type.STRING, description: "The result of Maya using her hacking skills to turn the environment or enemies against each other." },
            reward: { type: Type.STRING, description: "The reward for a hacking resolution (e.g., valuable data, disabling a larger system)." }
          },
          required: ["outcome", "reward"]
        },
      },
      required: ["direct_assault", "stealth", "social", "hacking"]
    }
  },
  required: ["title", "environment", "enemies", "maya_abilities", "resolutions"]
};

export const generateScenario = async (environment: string, enemies: string): Promise<Scenario> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are a senior level designer for the AAA video game “Neo-Tokyo Noir: Chrome and Shadows.”
    Your task is to design a dynamic combat or stealth scenario for the protagonist, Maya Chen.

    **SCENARIO DETAILS:**
    *   **Protagonist:** Maya Chen, a shapeshifting operative with "glitch" powers that let her manipulate digital systems and her own form.
    *   **Environment:** ${environment}
    *   **Enemies:** ${enemies}

    **REQUIREMENTS:**
    1.  **Detailed Environment:** Describe the specified environment with an eye for tactical opportunities (e.g., cover, verticality, hackable objects, environmental hazards).
    2.  **Enemy Tactics:** Describe the enemies and how they work together. Do they patrol? Do they have specific weaknesses?
    3.  **Unique Abilities:** Detail creative ways Maya can use her shapeshifting (e.g., mimicking an enemy, turning into a puddle of chrome) or glitch powers (e.g., causing a holographic ad to create a distraction, turning an enemy's optics against them) to gain an advantage.
    4.  **Branching Resolutions:** Provide distinct outcomes and rewards for four different player approaches: Direct Assault, Stealth, Social (flirtation/intimidation/deception), and Hacking. The social option may not always be possible, but you should describe why it fails if so.

    **INSTRUCTIONS:**
    *   Generate the scenario details strictly following the provided JSON schema. Do not add any extra text or explanations outside of the JSON structure.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: scenarioSchema,
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Scenario;

  } catch (error) {
    console.error("Error generating Scenario from Gemini:", error);
    throw new Error("Failed to communicate with the AI model to generate Scenario.");
  }
};

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
    title: { type: Type.STRING, description: "A cool, evocative title for this lore entry." },
    maya_history: { type: Type.STRING, description: "The detailed history of Maya Chen’s ancestry, blending ancient myths with futuristic nanotech." },
    quantum_fractures: { type: Type.STRING, description: "An explanation of the key historical events that led to Neo-Tokyo's quantum instability and societal changes." },
    city_state: { type: Type.STRING, description: "How the city's architecture, factions, and technology reflect its fractured reality." },
    urban_legend: { type: Type.STRING, description: "A provocative open question or urban legend that hints at deeper mysteries." }
  },
  required: ["title", "maya_history", "quantum_fractures", "city_state", "urban_legend"]
};

export const generateLore = async (): Promise<Lore> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are the lead writer and world-builder for the AAA video game “Neo-Tokyo Noir: Chrome and Shadows.”
    Your task is to generate a rich, foundational lore document that expands the game's universe.

    **LORE REQUIREMENTS:**
    1.  **Maya's History:** Detail the origins of Maya Chen's powers. Explain the fusion of her "myth-tech" ancestry—perhaps a bloodline tied to ancient Japanese trickster spirits (yokai/kami) like the Kitsune—with a cutting-edge, experimental nanite technology. How does this unique synthesis allow her to shapeshift and "glitch" reality?
    2.  **The Quantum Fractures:** Describe the key historical event that broke Neo-Tokyo's reality. Was it a failed experiment by a megacorp (like the 'Zero Point Cascade'), a quantum computing disaster, or the awakening of a digital god? Explain its immediate and long-term effects on the city and its people.
    3.  **The Fractured City:** Explain how Neo-Tokyo's current state reflects this instability. Describe how its architecture might phase in and out of existence, how factions (like data-purist 'Shoguns' or glitch-worshipping 'Oni') rose from the chaos, and how technology has become dangerously unpredictable (e.g., quantum-entangled weapons, holographic ghosts).
    4.  **Urban Legend:** Conclude with a provocative, open-ended urban legend or mystery that players might hear whispered in the city's dark corners. This should serve as a hook for future quests. For example, "What is the 'Ghost of the System,' and why does it leave behind impossible, shimmering artifacts?" or "They say if you follow the glitched subway lines to their end, you don't find a station, but the city's source code."

    **INSTRUCTIONS:**
    *   Be creative, consistent, and evocative. The tone should be dark, mysterious, and noir-infused.
    *   Generate the lore details strictly following the provided JSON schema. Do not add any extra text or explanations outside of the JSON structure.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: loreSchema,
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Lore;

  } catch (error) {
    console.error("Error generating Lore from Gemini:", error);
    throw new Error("Failed to communicate with the AI model to generate Lore.");
  }
};

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
    name: { type: Type.STRING, description: "A cool, thematic name or designation for the AI entity." },
    role: { type: Type.STRING, description: "The AI's role in the world (e.g., enemy, ally, ambiguous)." },
    form_recognition: { type: Type.STRING, description: "How this AI recognizes or reacts to Maya's different shapeshifted forms (e.g., thermal, quantum signature, data analysis)." },
    tactical_adaptations: {
      type: Type.OBJECT,
      properties: {
        stealth: { type: Type.STRING, description: "How the AI's tactics change when Maya uses stealth." },
        combat: { type: Type.STRING, description: "How the AI's tactics change when Maya engages in direct combat." },
        social: { type: Type.STRING, description: "How the AI's tactics or behavior changes when Maya uses social approaches like flirtation or intimidation." },
      },
      required: ["stealth", "combat", "social"]
    },
    long_term_evolution: { type: Type.STRING, description: "How player choices or timeline shifts affect this AI's behavior in future encounters, making them more dangerous or sympathetic." }
  },
  required: ["name", "role", "form_recognition", "tactical_adaptations", "long_term_evolution"]
};

export const generateAiBehavior = async (): Promise<AiBehavior> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are a senior AI designer for the AAA video game “Neo-Tokyo Noir: Chrome and Shadows.”
    Your task is to design a dynamic and adaptive AI behavior profile for an enemy or ally NPC. The AI should learn from and react to the player's choices, creating a challenging and memorable experience. The protagonist is Maya Chen, a shapeshifting operative.

    **AI BEHAVIOR REQUIREMENTS:**
    1.  **AI Name & Role:** Give the AI a unique name/designation and a clear role (e.g., Elite Corporate Enforcer, Sympathetic AI Companion).
    2.  **Form Recognition:** How does the AI detect Maya's different forms? Is it via quantum signature analysis, audio-vibrations, data residue, or does it rely on conventional optics, making it easy to fool? Be specific.
    3.  **Tactical Adaptation:** Describe how it alters its behavior based on Maya's actions.
        *   **Stealth:** If Maya uses stealth, how does the AI adapt? Does it deploy new sensor types (tripwires, sonar), patrol more erratically, or try to flush her out with area-of-effect attacks?
        *   **Combat:** If Maya uses direct combat, how does the AI learn? Does it switch weapon loadouts, call for specific reinforcements (snipers, heavy units), or try to exploit a weakness it observed in her fighting style?
        *   **Social:** If Maya uses social skills (flirtation, intimidation), how does the AI react? Can it be manipulated, or does it become more suspicious? Does its dialogue and trust level change?
    4.  **Long-Term Evolution:** Explain how the AI changes across multiple encounters based on player choices or major story events (timeline shifts). For example, if the player spares them, do they become a reluctant ally or a vengeful hunter? If the player is consistently brutal, do they upgrade their systems specifically to counter Maya's known tactics?

    **INSTRUCTIONS:**
    *   Be creative and focus on interesting gameplay loops.
    *   Generate the AI behavior profile strictly following the provided JSON schema. Do not add any extra text or explanations outside of the JSON structure.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: aiBehaviorSchema,
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AiBehavior;

  } catch (error) {
    console.error("Error generating AI Behavior from Gemini:", error);
    throw new Error("Failed to communicate with the AI model to generate AI Behavior.");
  }
};

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
        title: { type: Type.STRING, description: "A name for the playtesting scenario, e.g., 'Shapeshifter Stress Test'." },
        objective: { type: Type.STRING, description: "The main goal of this specific playtesting session." },
        edge_cases: {
            type: Type.OBJECT,
            properties: {
                combat: { type: Type.STRING, description: "An edge case involving rapid form-switching during combat." },
                social: { type: Type.STRING, description: "An edge case involving form-switching during a sensitive dialogue scene." },
                exploration: { type: Type.STRING, description: "An edge case involving using forms to access unintended areas or break traversal puzzles." },
            },
            required: ["combat", "social", "exploration"]
        },
        potential_bugs: {
            type: Type.OBJECT,
            properties: {
                animation: { type: Type.STRING, description: "A likely animation bug to look for (e.g., T-posing, blending errors)." },
                vfx: { type: Type.STRING, description: "A likely VFX bug (e.g., effects not disappearing, particle glitches)." },
                dialogue: { type: Type.STRING, description: "A likely dialogue bug (e.g., wrong lines playing after a mid-scene morph)." },
                game_state: { type: Type.STRING, description: "A potential game state bug (e.g., getting locked out of quests, retaining wrong abilities)." },
            },
            required: ["animation", "vfx", "dialogue", "game_state"]
        },
        debugging_tools: { type: Type.STRING, description: "A suggestion for a debugging tool or test script to help QA identify these issues (e.g., a console command to force-switch forms)." },
        easter_egg: { type: Type.STRING, description: "A fun, bonus 'easter egg' outcome if the player manages to break the system in a particularly creative or difficult way." },
    },
    required: ["title", "objective", "edge_cases", "potential_bugs", "debugging_tools", "easter_egg"],
};

export const generatePlaytestingScenario = async (): Promise<PlaytestingScenario> => {
    const model = "gemini-2.5-flash";
    const prompt = `
        You are a senior QA Lead for the AAA video game “Neo-Tokyo Noir: Chrome and Shadows.”
        Your task is to design a comprehensive playtesting scenario specifically to stress-test the protagonist Maya Chen's shapeshifting system.

        **PLAYTESTING SCENARIO REQUIREMENTS:**
        1.  **Objective:** Clearly state the goal of the test.
        2.  **Edge Cases:** Provide specific, testable edge cases for different situations:
            *   **Combat:** How to test rapid morphing between different forms while under fire.
            *   **Social:** How to test morphing mid-conversation and its effect on NPC reactions and quest flags.
            *   **Exploration:** How to test using forms to sequence-break or get into out-of-bounds areas.
        3.  **Potential Bugs:** Identify likely bugs that might arise from these edge cases. Be specific about potential issues with animation, VFX, dialogue systems, and overall game state.
        4.  **Debugging Tools:** Suggest a conceptual debugging tool or a simple test script/console command that would help a playtester reproduce and document these bugs.
        5.  **Easter Egg:** Propose a fun, hidden outcome or "easter egg" that rewards the player for intentionally and creatively breaking the shapeshifting system in a non-trivial way.

        **INSTRUCTIONS:**
        *   The tone should be professional and clear, as if writing for an internal QA team.
        *   Generate the playtesting scenario strictly following the provided JSON schema. Do not add any extra text or explanations outside of the JSON structure.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: playtestingScenarioSchema,
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PlaytestingScenario;

    } catch (error) {
        console.error("Error generating Playtesting Scenario from Gemini:", error);
        throw new Error("Failed to communicate with the AI model to generate Playtesting Scenario.");
    }
};

export interface Blueprint {
  title: string;
  description: string;
  notes: string;
  variables: {
    name: string;
    type: string;
    description: string;
  }[];
  nodes: {
    id: number;
    name: string;
    type: 'Event' | 'Function Call' | 'Flow Control' | 'Variable' | 'Action' | 'Macro' | string;
    description: string;
    connections: number[];
  }[];
}

const blueprintSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A concise title for the Blueprint logic, e.g., 'Keycard-Activated Door'." },
    description: { type: Type.STRING, description: "A high-level overview of what this Blueprint accomplishes." },
    notes: { type: Type.STRING, description: "Implementation notes, best practices, or potential UE 5.6 specific considerations (e.g., 'Use a Box Collision component for the trigger volume')." },
    variables: {
      type: Type.ARRAY,
      description: "An array of variables required for this Blueprint.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The name of the variable, e.g., 'IsLocked'." },
          type: { type: Type.STRING, description: "The Unreal Engine variable type, e.g., 'Boolean', 'Actor Reference', 'Name'." },
          description: { type: Type.STRING, description: "A brief explanation of the variable's purpose." },
        },
        required: ["name", "type", "description"],
      },
    },
    nodes: {
      type: Type.ARRAY,
      description: "A step-by-step breakdown of the Blueprint nodes and their connections.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER, description: "A unique integer ID for this node, starting from 1." },
          name: { type: Type.STRING, description: "The name of the Blueprint node, e.g., 'Event BeginPlay', 'Branch', 'Play Sound at Location'." },
          type: { type: Type.STRING, description: "The category of the node (e.g., 'Event', 'Function Call', 'Flow Control', 'Variable', 'Action', 'Macro')." },
          description: { type: Type.STRING, description: "A detailed explanation of what this node does and how it should be configured (e.g., which variable it gets/sets, condition for a Branch)." },
          connections: {
            type: Type.ARRAY,
            description: "An array of node IDs that this node's execution pin connects to.",
            items: { type: Type.INTEGER }
          },
        },
        required: ["id", "name", "type", "description", "connections"],
      },
    },
  },
  required: ["title", "description", "notes", "variables", "nodes"],
};

export const generateBlueprint = async (logic: string): Promise<Blueprint> => {
    const model = "gemini-2.5-flash";
    const prompt = `
        You are a senior Unreal Engine 5.6 developer specializing in Blueprint visual scripting. Your task is to take a user's request for gameplay logic and break it down into a structured, easy-to-follow Blueprint plan. This plan will be used by a developer to implement the feature in the UE 5.6 editor.

        **USER'S LOGIC REQUEST:**
        "${logic}"

        **INSTRUCTIONS:**
        1.  **Analyze the Request:** Understand the core components: triggers, actions, conditions, and actors involved.
        2.  **Design the Blueprint:** Create a logical flow using common Blueprint nodes. Think about events, branches, loops, functions, and variables.
        3.  **Identify Variables:** List all necessary variables, their types (e.g., Boolean, Actor, Vector, Name), and a brief description.
        4.  **Detail the Nodes:** Describe each node in the execution flow.
            *   Give each node a unique integer ID, starting from 1.
            *   Specify the node's name and type.
            *   Explain what the node does and how it should be configured.
            *   Use the 'connections' array to show the flow of execution from this node to others, referencing their IDs. The connection represents the white "execution" wire in Blueprints.
        5.  **Add Implementation Notes:** Provide helpful tips or best practices for implementing this in Unreal Engine 5.6. For example, mention required components on the Actor (like Collision Components) or suggest specific functions.
        6.  **JSON Output:** Generate the blueprint plan strictly following the provided JSON schema. Do not add any extra text or explanations outside of the JSON structure.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: blueprintSchema,
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Blueprint;

    } catch (error) {
        console.error("Error generating Blueprint from Gemini:", error);
        throw new Error("Failed to communicate with the AI model to generate Blueprint.");
    }
};


export const generateImage = async (prompt: string): Promise<string> => {
    const model = 'imagen-3.0-generate-002';

    try {
        const response = await ai.models.generateImages({
            model: model,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9', // Cinematic ratio
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("No image was generated by the API.");
        }

    } catch (error) {
        console.error("Error generating image from Gemini:", error);
        throw new Error("Failed to communicate with the AI model to generate the image.");
    }
}