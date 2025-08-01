
import React from 'react';

interface Location {
  name: string;
  description: string;
}

const locations: Location[] = [
  {
    name: 'Quantum Quarter',
    description: 'Probability-shifting district, streets fracture between realities, home to time tourists and rogue AI.',
  },
  {
    name: 'Binary District',
    description: 'Neon-lit undercity, digital refugees, illegal brain-dance arcades, AR graffiti and scent-coded currency.',
  },
  {
    name: 'Crimson Dragon Tower',
    description: 'Sky-high syndicate HQ, red glass architecture, rain-slick helipads, epic boss battles.',
  },
  {
    name: 'Void Factory',
    description: 'Industrial, multidimensional interior, recursive signage, gateway to digital underworld.',
  }
];

const LocationCard: React.FC<{ location: Location }> = ({ location }) => {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/10 animate-fade-in space-y-4">
            <header>
                <h2 className="text-2xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.500)]">
                    {location.name}
                </h2>
            </header>
            <div className="border-t border-slate-700/50 pt-4">
                <p className="text-gray-300">{location.description}</p>
            </div>
        </div>
    );
};

const LocationsDisplay: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <header className="text-center">
            <h1 className="text-3xl font-bold text-cyan-300">Key Locations</h1>
            <p className="text-lg text-gray-400 mt-1">Core locations in the Neo-Tokyo Noir universe.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map(location => (
                <LocationCard key={location.name} location={location} />
            ))}
        </div>
    </div>
  );
};

export default LocationsDisplay;
