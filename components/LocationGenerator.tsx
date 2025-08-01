import React, { useState, useCallback } from 'react';
import { generateLocationSnippet, LocationSnippet } from '../services/geminiService';
import InputGroup from './InputGroup';
import LocationDisplay from './LocationDisplay';
import LoadingSpinner from './LoadingSpinner';
import { LocationIcon, SituationIcon, SparklesIcon } from './icons';

interface LocationGeneratorProps {
  generatedLocation: LocationSnippet | null;
  setGeneratedLocation: (location: LocationSnippet | null) => void;
}

const LocationGenerator: React.FC<LocationGeneratorProps> = ({ generatedLocation, setGeneratedLocation }) => {
  const [location, setLocation] = useState('Quantum Quarter');
  const [feature, setFeature] = useState('Timeline fracture, glitching reality');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLocation = useCallback(async () => {
    if (!location || !feature) {
      setError('Both fields must be filled out to generate a location.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedLocation(null);

    try {
      const snippet = await generateLocationSnippet(location, feature);
      setGeneratedLocation(snippet);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the location. A glitch in the world-engine.');
    } finally {
      setIsLoading(false);
    }
  }, [location, feature, setGeneratedLocation]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 shadow-lg shadow-cyan-500/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup
            label="Location / District"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Binary District alley"
            icon={<LocationIcon />}
          />
          <InputGroup
            label="Special Feature"
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            placeholder="e.g., brain-dance arcade"
            icon={<SituationIcon />}
          />
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleGenerateLocation}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Building World...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span className="ml-2">Generate Location</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700/50 text-red-300 rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
      )}

      <LocationDisplay snippet={generatedLocation} isLoading={isLoading} />
    </div>
  );
};

export default LocationGenerator;