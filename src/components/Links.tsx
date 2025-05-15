import React from 'react';

interface LinkProps {
  text: string;
  onClick?: () => void;
  route?: string;
  noUnderline?: boolean;
}

const Links: React.FC<LinkProps> = ({ text, onClick, route, noUnderline }) => (
  <div>
    <a
      onClick={onClick}
      href={route}
      className={`text-sm text-selected hover:text-selected mt-9 text-opacity-60 ${noUnderline ? 'no-underline' : 'underline'}`}
    >
      {text}
    </a>
  </div>
);

export default Links;
