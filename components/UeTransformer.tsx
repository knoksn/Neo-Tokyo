
import React, { useState, useCallback, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { UeTransformerIcon, CheckIcon } from './icons';

const UeTransformer: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);
    setIsSuccess(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setIsSuccess(false);
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };
  
  const handleProcessFiles = useCallback(() => {
    if (files.length === 0) {
      setError('Please select files to process.');
      return;
    }
    setError(null);
    setIsSuccess(false);
    setIsLoading(true);

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setFiles([]);
    }, 2000);

  }, [files]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/5">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Unreal Engine Asset Transformer</h2>
        <p className="text-gray-400 mb-6 max-w-prose mx-auto">Upload your lore documents, dialogue scripts, or concept art. This tool will (conceptually) process and package them for direct use in Unreal Engine 5.6.</p>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-300 cursor-pointer ${
            isDragging ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-600 hover:border-cyan-600'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFilePicker}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m0 0l4-4m-4 4h12" />
            </svg>
            <p className="font-semibold text-gray-300">Drag & drop files here</p>
            <p className="text-sm">or click to browse</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6 text-left">
            <h3 className="font-bold text-gray-300 mb-2">Selected Files:</h3>
            <ul className="list-disc list-inside bg-slate-800/50 p-4 rounded-md text-cyan-300 text-sm space-y-1">
              {files.map((file, index) => (
                <li key={index}>{file.name} <span className="text-gray-500">- ({(file.size / 1024).toFixed(2)} KB)</span></li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleProcessFiles}
            disabled={isLoading || files.length === 0}
            className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/40 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              <>
                <UeTransformerIcon />
                <span className="ml-2">Process for Unreal Engine</span>
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

      {isSuccess && (
        <div className="bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 rounded-lg p-4 text-center flex items-center justify-center animate-fade-in">
          <CheckIcon />
          <span className="ml-2">Files successfully processed and packaged for engine import!</span>
        </div>
      )}

    </div>
  );
};

export default UeTransformer;
