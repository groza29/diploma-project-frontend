import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { OptionType } from '../models/OptionType';

interface BaseProps {
  options: OptionType[];
  label: string;
  multiple?: boolean;
}

interface SingleSelectProps extends BaseProps {
  multiple?: false;
  selectedOption: OptionType | null;
  setSelectedOption: (option: OptionType | null) => void;
}

interface MultiSelectProps extends BaseProps {
  multiple: true;
  selectedOption: OptionType[];
  setSelectedOption: (option: OptionType[]) => void;
}

type SearchDropdownProps = SingleSelectProps | MultiSelectProps;

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  options,
  selectedOption,
  setSelectedOption,
  label,
  multiple = false,
}) => {
  return (
    <div>
      <label className="block text-m font-thin text-text mb-2">{label}</label>
      <Autocomplete
        multiple={multiple}
        options={options}
        value={selectedOption}
        onChange={(_, newValue) => setSelectedOption(newValue as any)}
        getOptionLabel={(option) => option.label}
        filterOptions={(options, state) =>
          options.filter((option) =>
            option.label.toLowerCase().includes(state.inputValue.toLowerCase())
          )
        }
        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
        className="w-full rounded-md bg-white text-base text-text focus:outline-none"
      />
    </div>
  );
};

export default SearchDropdown;
