import React from 'react';

type SearchInputProps = {
  icon?: React.ElementType;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({
  icon: Icon,
  placeholder = 'Search...',
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center bg-white rounded-full shadow px-2 py-4 pr-10 w-full max-w-md">
      {Icon && <Icon className="text-gray-500 mr-2" />}
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent focus:outline-none w-full text-gray-700 placeholder-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
