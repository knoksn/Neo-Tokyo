
import React from 'react';

interface SelectGroupProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ label, value, onChange, icon, children }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="flex items-center text-sm font-bold text-cyan-400">
        {icon}
        <span className="ml-2">{label}</span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none bg-slate-800/70 border-2 border-slate-700 rounded-md py-3 pl-4 pr-10 text-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-inner"
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
           <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default SelectGroup;
