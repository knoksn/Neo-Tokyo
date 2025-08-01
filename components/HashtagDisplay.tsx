
import React from 'react';

interface HashtagSet {
  scene: string;
  tags: string[];
}

const hashtagData: HashtagSet[] = [
  {
    scene: 'Maya in the Quantum Quarter during a glitchstorm',
    tags: ['#MayaChen', '#QuantumQuarter', '#Glitchstorm', '#CyberpunkArt', '#Scifi'],
  },
  {
    scene: 'Solaris wielding her golden scythe in the Void Factory',
    tags: ['#Solaris', '#VoidFactory', '#GoldenScythe', '#DLC', '#CharacterArt'],
  },
  {
    scene: 'Dr. Victoria Thane unleashing dimensional tentacles in the Binary District',
    tags: ['#VictoriaThane', '#BinaryDistrict', '#CosmicHorror', '#CyberpunkVillain', '#DigitalArt'],
  },
];

const HashtagDisplay: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <header className="text-center">
            <h1 className="text-3xl font-bold text-cyan-300">Hashtag & Tag Generator</h1>
            <p className="text-lg text-gray-400 mt-1">Tags for asset management and community sharing.</p>
        </header>
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 mt-6 shadow-lg shadow-cyan-500/10">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-cyan-300 uppercase bg-slate-800/60">
                        <tr>
                            <th scope="col" className="px-6 py-3">Scene</th>
                            <th scope="col" className="px-6 py-3">Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hashtagData.map((item, index) => (
                            <tr key={index} className="border-b border-slate-700 hover:bg-slate-800/40">
                                <td className="px-6 py-4 font-medium ">{item.scene}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-cyan-900/50 text-cyan-300 text-xs font-mono rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default HashtagDisplay;
