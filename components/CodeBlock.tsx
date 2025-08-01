import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CodeBlockProps {
    language: string;
    code: string;
    title: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, title }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    }, [code]);

    return (
        <div className="my-4">
            <p className="text-sm font-semibold text-gray-300 mb-1">{title}</p>
            <div className="bg-slate-900/70 rounded-lg border border-slate-700/50 relative">
                <div className="flex justify-between items-center px-4 py-1.5 border-b border-slate-700/50">
                    <span className="text-xs font-mono text-cyan-300">{language}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center text-xs text-gray-300 hover:text-cyan-300 transition-colors"
                        aria-label="Copy code to clipboard"
                    >
                        {isCopied ? (
                            <>
                                <CheckIcon />
                                <span className="ml-1">Copied</span>
                            </>
                        ) : (
                             <>
                                <CopyIcon />
                                <span className="ml-1">Copy</span>
                            </>
                        )}
                    </button>
                </div>
                <pre className="p-4 text-xs text-gray-200 overflow-x-auto">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;