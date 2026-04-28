import type { ReactNode } from 'react';

interface InputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  icon?: ReactNode;
  error?: string;
  disabled?: boolean;
}

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}

const baseInput = `w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-200
  rounded-xl text-slate-800 placeholder-slate-400 font-medium text-sm
  focus:outline-none focus:ring-2 focus:ring-[#FF6F61]/30 focus:border-[#FF6F61]
  transition-all duration-200`;

export function Input({
  label, value, onChange, placeholder, type = 'text',
  required, icon, error, disabled,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-600">
          {label} {required && <span className="text-[#FF6F61]">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${baseInput} ${icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:ring-red-300' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export function Textarea({
  label, value, onChange, placeholder, rows = 4, required, error,
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-600">
          {label} {required && <span className="text-[#FF6F61]">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`${baseInput} resize-none ${error ? 'border-red-400 focus:ring-red-300' : ''}`}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export function Select({ label, value, onChange, options, required, error }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-600">
          {label} {required && <span className="text-[#FF6F61]">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`${baseInput} cursor-pointer ${error ? 'border-red-400' : ''}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}