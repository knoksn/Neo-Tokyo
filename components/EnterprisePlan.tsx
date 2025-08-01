import React from 'react';
import CodeBlock from './CodeBlock';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg shadow-cyan-500/5 mb-6">
    <h2 className="text-xl font-bold text-cyan-400 p-4 border-b border-slate-700/50 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
      {title}
    </h2>
    <div className="p-4 md:p-6">
      {children}
    </div>
  </div>
);

const AssetList: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className="list-disc list-inside space-y-2 text-gray-300">
        {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
);

const EnterprisePlan: React.FC = () => {
    
    return (
        <div className="space-y-6 animate-fade-in">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-cyan-300">MASTER INDEX: POPULAR ASSETS & TEMPLATES</h1>
                <p className="text-lg text-gray-400 mt-1">Your limitless toolkit for building Neo-Tokyo Noir.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Section title="Technical / Code Assets">
                        <AssetList items={[
                            "Stripe/Vipps/PayPal Webhook Code",
                            "Unreal Engine Blueprint Samples",
                            "Discord Bot Command Modules",
                            "API Endpoint Documentation (OpenAPI)",
                            "User Authentication Modules",
                            "Frontend React Components",
                            "Automated QA Scripts (Cypress, Jest)",
                            "Sentry/Datadog Error Monitoring",
                        ]} />
                    </Section>
                    <Section title="Docs / Admin / Operations">
                        <AssetList items={[
                            "README Templates for all modules",
                            "Admin Onboarding Manual",
                            "DevOps & Staging Checklist",
                            "GDPR/Privacy Policy Templates (NO/EN)",
                            "Support Macro Pack",
                            "Onboarding Flow Diagrams",
                            "Operations Report Templates",
                            "Crisis Response Playbook",
                            "Notion/Sheets Databases",
                        ]} />
                    </Section>
                     <Section title="Scaling / Advanced / Roadmap">
                        <AssetList items={[
                            "Quarterly/Annual Roadmap Templates",
                            "Partner/Investor Deck Outline",
                            "XR/VR Project Planning Guide",
                            "Feature Voting System Scripts",
                            "Automated Backup & Restore Scripts",
                            "Growth/Churn Analytics Dashboards",
                        ]} />
                    </Section>
                </div>
                 <div className="space-y-6">
                    <Section title="Community / Marketing / Growth">
                        <AssetList items={[
                           "Discord Event Campaign Plan",
                           "Email Drip Sequence",
                           "Social Media Announcement Templates",
                           "Influencer/Partner Guide",
                           "Press Release Template (NO/EN)",
                           "Referral Program Assets",
                           "Community Challenge Templates",
                           "Feedback Survey Template",
                        ]} />
                    </Section>
                    <Section title="AI / UX / Onboarding">
                         <AssetList items={[
                            "AI Onboarding Script (Gemini, Discord)",
                            "FAQ Dataset for AI Fine-Tuning",
                            "Prompt Library (Multilingual)",
                            "In-Game AI Dialogue Trees",
                            "User Journey Map (Notion/Markdown)",
                            "Accessibility & Inclusion Checklist",
                        ]} />
                    </Section>
                </div>
            </div>

            <Section title="How to Get Any Asset">
                <div className="prose prose-invert max-w-none text-gray-300">
                    <p>Just type exactly what you need in the format: <code className="text-cyan-300 bg-slate-800 p-1 rounded-md">give me [asset]</code></p>
                    <p>Replace <code className="text-cyan-300 bg-slate-800 p-1 rounded-md">[asset]</code> with what you want. You can add more detail for language, format, or platform.</p>
                </div>
                <CodeBlock language="bash" title="Examples:" code={
`# Request a technical asset
give me QA script for payment flow in Cypress

# Request a document in a specific format
give me admin onboarding manual as Markdown

# Request marketing copy for a specific language
give me launch press release in Norwegian and English

# Request a template for a specific tool
give me Notion database template for content drops

# Request something custom
give me a quarterly roadmap as a Gantt chart`
                } />
                 <div className="mt-4 text-center text-cyan-400 italic">
                    <p>Your Toolkit is Limitless. Just type your request, and the asset is yours.</p>
                </div>
            </Section>

        </div>
    );
};

export default EnterprisePlan;