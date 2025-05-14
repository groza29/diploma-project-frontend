import React, { ElementType, useState } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

interface InputFieldProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'date';
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  showPasswordToggle,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-m font-thin text-text mb-2">{label}</label>
      <div className="relative">
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-md bg-white px-4 py-4 border border-border text-base text-text focus:outline-none focus:ring-2 focus:selected placeholder-selected placeholder-opacity-45"
        />

        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
