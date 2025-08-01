
import React from 'react';

interface TextareaGroupProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  rows?: number;
}

const TextareaGroup: React.FC<TextareaGroupProps> = ({ label, value, onChange, placeholder, icon, rows = 4 }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="flex items-center text-sm font-bold text-cyan-400">
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-slate-800/70 border-2 border-slate-700 rounded-md p-3 text-gray-300 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-inner resize-y"
      />
    </div>
  );
};

export default TextareaGroup;