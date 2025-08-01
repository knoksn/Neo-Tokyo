import React, { useState } from 'react';
import CodeBlock from './CodeBlock';
import { AiGuideIcon } from './icons';

interface EnterprisePlanProps {
    setPrefilledQuestion: (question: string) => void;
}

const AskAiButton: React.FC<{onClick: () => void}> = ({ onClick }) => (
    <button onClick={onClick} className="ml-3 opacity-60 hover:opacity-100 transition-opacity" aria-label="Ask AI Guide for more info">
        <AiGuideIcon />
    </button>
);

const Section: React.FC<{ title: string; children: React.ReactNode, setPrefilledQuestion: (q:string)=>void, question: string }> = ({ title, children, setPrefilledQuestion, question }) => (
  <details className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg shadow-cyan-500/5" open>
    <summary className="text-xl font-bold text-cyan-400 p-4 cursor-pointer [text-shadow:_0_0_8px_theme(colors.cyan.500)] flex items-center justify-between">
      {title}
      <AskAiButton onClick={() => setPrefilledQuestion(question)} />
    </summary>
    <div className="p-4 md:p-6 border-t border-slate-700/50">
      {children}
    </div>
  </details>
);

const EnterprisePlan: React.FC<EnterprisePlanProps> = ({ setPrefilledQuestion }) => {
    
    // --- Code Samples ---
    const couponApiCode = `
app.post('/api/coupon/redeem', async (req, res) => {
    const { code, userId } = req.body;
    const coupon = await db.coupons.findOne({ where: { code } });
    if (!coupon || coupon.used >= coupon.max_redemptions || new Date() > coupon.expires_at) {
        return res.status(400).json({ error: "Invalid or expired coupon" });
    }
    // apply discount, mark coupon as used
    await db.coupons.update({ used: coupon.used + 1 }, { where: { id: coupon.id } });
    // (More business logic here)
    res.json({ ok: true, value: coupon.value, type: coupon.type });
});`;

    const discordBotCode = `const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

client.once('ready', () => { console.log(\`Bot ready as \${client.user.tag}\`); });

client.on('messageCreate', async msg => {
  if (msg.content.startsWith('!coupon')) {
    // Parse coupon and call backend API
    const code = msg.content.split(' ')[1];
    // Call your API here, e.g. via fetch/axios
    msg.reply(\`Your coupon code '\${code}' has been submitted!\`);
  }
  if (msg.content === '!referral') {
    // Generate referral link (example)
    msg.reply(\`Here’s your referral link: https://yourplatform.com/signup?ref=\${msg.author.id}\`);
  }
  if (msg.content === '!perks') {
    msg.reply(\`Silver: 1 DLC/mo, Gold: All XR drops, Platinum: Beta, Early Access, and Discord VIP!\`);
  }
  if (msg.content === '!faq') {
    msg.reply(\`Visit https://yourplatform.com/faq or DM me any question about access, paywall, or features.\`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);`;
    
    const readmeCode = `# Neo Tokyo Noir | Modular Paywall & AI Ecosystem

Modern, multi-platform paywall, content unlock, and AI assistant for games, XR, web, and creative communities.
Built for Unreal Engine, Discord, and Google AI Studio integration.

## Features
- Stripe/Vipps/PayPal paywall with coupons, referral, drip-feed drops, community Discord unlocks
- Modular AI guide (web, Discord, Unreal, mobile)
- Unreal BP widgets for in-game paywall & instant DLC unlock
- GDPR, VAT/MVA, multi-language (Norwegian/English/global)
- Plug-and-play for React/Next.js and Node.js
- Discord bot with coupon, referral, FAQ, role unlocks
- World bible, onboarding, and marketing assets

## Quick Start
- \`npm install\` in \`/backend\` and \`/frontend\`
- Configure \`.env\` with Stripe, Vipps, Discord, Gemini keys
- \`npm run dev\` for frontend, backend, and Discord bot
- Import Unreal BP assets to your UE project`;


    return (
        <div className="space-y-6 animate-fade-in">
            <header className="text-center mb-6">
                <h2 className="text-3xl font-bold text-cyan-400">Enterprise System Blueprint</h2>
                <p className="text-gray-400 mt-1">The complete production plan for monetizing and scaling Neo-Tokyo Noir.</p>
            </header>
            
            <Section title="Final Go-Live Checklist" setPrefilledQuestion={setPrefilledQuestion} question="Summarize the final go-live checklist for the enterprise plan.">
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Production domain and SSL live</li>
                    <li>All payment methods tested live (Stripe, Vipps, PayPal)</li>
                    <li>Coupons/referrals fully tested (real user flow)</li>
                    <li>Discord bot joined and verified on main server</li>
                    <li>Unreal asset imported and functional in game build</li>
                    <li>AI Guide live on web/app/game/Discord</li>
                    <li>Legal links visible everywhere</li>
                    <li>Admin panel/analytics running</li>
                    <li>Staging environment ready for hotfixes</li>
                </ul>
            </Section>

            <Section title="Full Repo Structure" setPrefilledQuestion={setPrefilledQuestion} question="Describe the suggested repository structure for the project.">
                <CodeBlock language="plaintext" code={`/NeoTokyoNoir-Paywall/
│
├── backend/                   # Node/Express API
│   ├── api/
│   ├── models/
│   ├── webhooks/
│   ├── scripts/
│   └── test/
├── frontend/                  # Next.js/React app
│   ├── components/
│   ├── pages/
│   ├── paywall/
│   ├── dashboard/
│   ├── ai/
│   └── styles/
├── discord/
│   ├── bot.js
│   ├── commands/
│   ├── events/
│   └── utils/
├── unreal/
│   ├── BP_PaywallWidget.uasset
│   ├── HTTP_Integration.md
│   └── DLC_UnlockLogic/
├── docs/
│   ├── admin/
│   ├── legal/
│   ├── world/
│   └── roadmap.md
├── scripts/                   # Deployment scripts
│   └── setup.ps1
├── .env.example
├── README.md
└── LICENSE`} title="Full Project Directory" />
                <CodeBlock language="markdown" code={readmeCode} title="README.md (Essentials)" />
            </Section>

            <Section title="Community & Discord Integration" setPrefilledQuestion={setPrefilledQuestion} question="How does the Discord integration work? Explain the bot and webhooks.">
                <CodeBlock language="javascript" code={discordBotCode} title="Discord Bot Example (discord/bot.js)" />
                 <p className="text-sm text-gray-400 mt-4">The Discord bot provides users with commands to interact with the platform directly from the community server. It handles coupon redemptions, generates referral links, and answers common questions, offloading support tasks and increasing engagement.</p>
            </Section>
            
             <Section title="Coupons & Referral System" setPrefilledQuestion={setPrefilledQuestion} question="Explain the backend logic for the coupon and referral system.">
                <CodeBlock language="sql" code={`CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(32) UNIQUE,
    type VARCHAR(16), -- 'percent', 'fixed', etc.
    value INTEGER,
    max_redemptions INTEGER,
    used INTEGER DEFAULT 0,
    expires_at TIMESTAMP
);

CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER REFERENCES users(id),
    referred_id INTEGER REFERENCES users(id),
    reward_status VARCHAR(16) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT now()
);`} title="Database Table Models (SQL Example)" />
                <CodeBlock language="javascript" code={couponApiCode} title="Coupon Redemption API Endpoint (Node.js)" />
            </Section>
            
            <Section title="Unreal Engine 5 Integration" setPrefilledQuestion={setPrefilledQuestion} question="How does the system integrate with Unreal Engine?">
                <div className="space-y-3 text-gray-300">
                    <h4 className="font-bold text-cyan-300">In-Game Paywall and Unlocks</h4>
                    <p>The system uses a dedicated Unreal Engine Blueprint widget (`BP_PaywallWidget.uasset`) to handle all in-game monetization UI. This widget communicates securely with the web backend.</p>
                    <ul className="list-disc list-inside pl-4 text-sm space-y-1">
                        <li>On player login, the game sends an HTTP request to the `/api/check-access` endpoint with the user's token.</li>
                        <li>The backend responds with the user's access tier (e.g., "Gold") and a list of unlocked DLCs.</li>
                        <li>If the player has access, the game unlocks the corresponding content. Otherwise, it displays the paywall widget, prompting the user to upgrade or enter a coupon code.</li>
                        <li>On a successful unlock, the widget can trigger in-game visual and sound effects to confirm the new content is available.</li>
                    </ul>
                </div>
            </Section>
        </div>
    );
};

export default EnterprisePlan;
