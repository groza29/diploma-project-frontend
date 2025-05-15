import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface FilterDisplayProp {
  text: string;
  onClick?: () => void;
  className?: string;
}

const FilterDisplay: React.FC<FilterDisplayProp> = ({ text, onClick, className = '' }) => {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-gray-800 bg-white text-sm ${className}`}
    >
      <span>{text}</span>
      <button onClick={onClick} className="text-text hover:text-black focus:outline-none">
        <CloseIcon style={{ fontSize: '16px' }} />
      </button>
    </div>
  );
};

export default FilterDisplay;
