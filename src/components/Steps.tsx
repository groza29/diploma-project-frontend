import React from 'react';

interface StepsProps {
  step: 1 | 2 | 3;
}

const Steps: React.FC<StepsProps> = ({ step }) => {
  return (
    <div className="flex items-center justify-center">
      {step === 1 && (
        <>
          <p className="text-5xl font-bold text-selected text-opacity-45">.</p>
          <p className="text-5xl font-bold text-selected text-opacity-20">.</p>
          <p className="text-5xl font-bold text-selected text-opacity-20">.</p>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-5xl font-bold text-selected text-opacity-20">.</p>
          <p className="text-5xl font-bold text-selected text-opacity-45">.</p>
          <p className="text-5xl font-bold text-selected text-opacity-20">.</p>
        </>
      )}

      {step === 3 && (
        <>
          <p className="text-5xl font-bold text-selected text-opacity-20">.</p>
          <p className="text-5xl font-bold text-selected text-opacity-20">.</p>
          <p className="text-5xl font-bold text-selected text-opacity-45">.</p>
        </>
      )}
    </div>
  );
};

export default Steps;
