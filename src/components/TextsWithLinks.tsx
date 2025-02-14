import React from 'react';

interface TextWithLinksProps {
  textPrimary: string;
  textSecondary: string;
  route?: string;
}

const TextWithLinksProps: React.FC<TextWithLinksProps> = ({
  textPrimary,
  textSecondary,
  route,
}) => (
  <>
    <p className="mt-6 text-sm font-thin text-text">{textPrimary} </p>
    <a
      href={route}
      className="font-semibold text-sm text-selected hover:text-selected text-opacity-60 "
    >
      {textSecondary}
    </a>
  </>
);

export default TextWithLinksProps;
