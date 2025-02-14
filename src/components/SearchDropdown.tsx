import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface OptionType {
  label: string;
  value: string;
}

interface SearchDropdownProps {
  options: OptionType[];
  selectedOption: OptionType | null;
  setSelectedOption: (option: OptionType | null) => void;
  label: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  label,
}) => {
  return (
    <div>
      <label className="block text-m font-thin text-text mb-2">{label}</label>
      <Autocomplete
        className="w-full rounded-md bg-white  text-base text-text focus:outline-none focus:ring-2 focus:selected placeholder-selected placeholder-opacity-45"
        options={options}
        getOptionLabel={(option) => option.label}
        value={selectedOption}
        onChange={(_, newValue) => setSelectedOption(newValue)}
        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
        filterOptions={(options, state) =>
          options.filter((option) =>
            option.label.toLowerCase().includes(state.inputValue.toLowerCase())
          )
        }
      />
    </div>
  );
};

export default SearchDropdown;
