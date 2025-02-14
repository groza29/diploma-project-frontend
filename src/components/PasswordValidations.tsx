import React from 'react';

interface passwordValidationsProps {
  text: string;
  status: boolean;
}

const PasswordValidations: React.FC<passwordValidationsProps> = ({ text, status }) => {
  return status === true ? (
    <p className="text-green-validation text-opacity-45 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      {text}
    </p>
  ) : (
    <p className="text-red text-opacity-45 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
      {text}
    </p>
  );
};

export default PasswordValidations;
