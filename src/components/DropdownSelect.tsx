import React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { OptionType } from '../models/OptionType';

type DropdownSelectProps = {
  options: OptionType[];
  value?: OptionType | null;
  onChange: (value: OptionType) => void;
  job?: boolean;
};

const DropdownSelect: React.FC<DropdownSelectProps> = ({ options, value, onChange, job }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find((option) => option.value === selectedValue);
    if (selectedOption) {
      onChange(selectedOption);
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <select
        value={value?.value || ''}
        onChange={handleChange}
        className="appearance-none w-full bg-white text-gray-800 py-4 px-4 pr-10 rounded-full shadow focus:outline-none"
      >
        <option value="" disabled hidden>
          {job ? 'Select a job' : 'Select a rating'}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
        <ArrowDropDownIcon />
      </div>
    </div>
  );
};

export default DropdownSelect;
