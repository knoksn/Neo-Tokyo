import React, { useState } from 'react';
import CodeBlock from './CodeBlock';

type PaywallTab = 'Features' | 'Architecture' | 'Sample Code';

const serverCode = `const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const stripe = Stripe('sk_live_...'); // Use your live Stripe secret key
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Example User store (replace with DB in prod)
const users = {};

app.post('/api/create-checkout-session', async (req, res) => {
  const { email, tier } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{
      price: tier === 'gold' ? 'price_ABC123' : 'price_DEF456',
      quantity: 1
    }],
    mode: 'subscription',
    success_url: 'https://yourdomain.com/paywall/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://yourdomain.com/paywall/cancel'
  });
  res.json({ id: session.id });
});

// Stripe webhook: unlock content on payment success
app.post('/webhook', bodyParser.raw({type: 'application/json'}), (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], 'whsec_...');
  } catch (err) { return res.status(400).send(\`Webhook Error: \${err.message}\`); }
  if (event.type === 'checkout.session.completed') {
    const email = event.data.object.customer_email;
    // Unlock content (e.g., set user tier in DB)
    users[email] = { access: 'gold' };
    // Send welcome email, etc.
  }
  res.status(200).json({ received: true });
});

app.listen(4242, () => console.log('Server running on port 4242'));`;

const paywallButtonCode = `import { useState } from 'react';

export default function PaywallButton({ tier = "gold" }) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "user@email.com", tier })
    });
    const { id } = await res.json();
    window.location.href = \`https://checkout.stripe.com/pay/\${id}\`;
  };
  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Redirecting..." : \`Unlock \${tier} content\`}
    </button>
  );
}`;

const protectedContentCode = `import { useEffect, useState } from 'react';

export default function ProtectedContent() {
  const [access, setAccess] = useState(false);
  useEffect(() => {
    // Fetch access from backend (JWT or cookie auth)
    fetch('/api/check-access', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setAccess(data.access === 'gold'));
  }, []);
  if (!access) return <PaywallButton />;
  return <div>Your exclusive Neo Tokyo Noir content is unlocked!</div>;
}`;


const FeatureList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <div>
        <h3 className="text-lg font-bold text-cyan-300 mb-2">{title}</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);

const FeaturesTab: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureList title="Frontend" items={['Login/signup', 'Paywall overlay', 'User profile', 'Pricing tiers', 'Content preview', '“Unlock” buttons']} />
        <FeatureList title="Payment Providers" items={['Stripe', 'Vipps (Norway)', 'PayPal', 'Apple Pay', 'Google Pay (global)', 'Klarna (EU optional)']} />
        <FeatureList title="Access Levels" items={['Free', 'Silver', 'Gold', 'Platinum', 'Lifetime/DLC', 'Team/Org']} />
        <FeatureList title="Unlockable Content" items={['Articles', 'AI scenes', 'DLC', 'comics', 'XR packs', 'downloads']} />
        <FeatureList title="Account & Security" items={['JWT auth', 'Session tokens', 'GDPR/PSD2 compliance', '2FA', 'Password reset']} />
        <FeatureList title="Admin" items={['Dashboard', 'User management', 'Transaction logs', 'Analytics']} />
        <FeatureList title="Email/SMS" items={['Receipts', 'Failed payment', 'Renewal', '“Welcome,”', 'Auto reminders']} />
        <FeatureList title="APIs/Webhooks" items={['Stripe/Vipps', 'AI content unlock', 'Discord/Unreal integration']} />
        <FeatureList title="Localization" items={['Multilingual (incl. Norwegian)', 'Tax handling']} />
        <FeatureList title="Automation" items={['Auto-expiry', 'Refund flow', 'Invoice PDF', 'Payout reports']} />
    </div>
);

const ArchitectureTab: React.FC = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2">A. Frontend</h3>
            <p className="text-gray-300 text-sm">React/Next.js (web/app) or Unreal (plugin/Blueprints)</p>
            <p className="text-gray-300 text-sm">Modular paywall UI component</p>
        </div>
        <div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2">B. Backend</h3>
            <p className="text-gray-300 text-sm">Node.js (Express, NestJS, or Fastify)</p>
            <p className="text-gray-300 text-sm">Payment processor integration (Stripe API + optional Vipps/PayPal)</p>
            <p className="text-gray-300 text-sm">PostgreSQL or MongoDB for users, subs, payments, access rights</p>
        </div>
        <div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2">C. API/Webhooks</h3>
            <p className="text-gray-300 text-sm">Stripe + Vipps events, unlocks, refunds</p>
            <p className="text-gray-300 text-sm">Secure access token for AI/DLC endpoints</p>
        </div>
        <div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2">D. Security</h3>
            <p className="text-gray-300 text-sm">HTTPS, CORS, rate limiting, input validation, secure cookie/session management</p>
        </div>
    </div>
);

const SampleCodeTab: React.FC = () => (
    <div className="space-y-8">
        <div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">A. Stripe Backend API (Node.js / Express)</h3>
            <CodeBlock language="bash" code="npm install express stripe body-parser cors jsonwebtoken" title="Install Dependencies" />
            <CodeBlock language="javascript" code={serverCode} title="Server (server.js)" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">B. React/Next.js Frontend (Paywall Overlay)</h3>
            <CodeBlock language="javascript" code={paywallButtonCode} title="Paywall Button" />
            <CodeBlock language="javascript" code={protectedContentCode} title="Protected Content" />
        </div>
    </div>
);


const Paywall: React.FC = () => {
    const [activeTab, setActiveTab] = useState<PaywallTab>('Features');

    const renderContent = () => {
        switch(activeTab) {
            case 'Features': return <FeaturesTab />;
            case 'Architecture': return <ArchitectureTab />;
            case 'Sample Code': return <SampleCodeTab />;
            default: return null;
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
                <header className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-cyan-400">Enterprise Paywall System</h2>
                    <p className="text-gray-400">A complete plan for monetizing Neo-Tokyo Noir content.</p>
                </header>
                <div className="border-b border-slate-700 mb-4">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        {(['Features', 'Architecture', 'Sample Code'] as PaywallTab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${
                                    activeTab === tab
                                        ? 'border-cyan-400 text-cyan-300'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="mt-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Paywall;