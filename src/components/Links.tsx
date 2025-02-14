import React from 'react';

interface LinkProps {
  text: string;
  onClick?: () => void;
  route?: string;
}

const Links: React.FC<LinkProps> = ({ text, onClick, route }) => (
  <div>
    <a
      onClick={onClick}
      href={route}
      className="text-sm text-selected hover:text-selected mt-9 text-opacity-60 underline"
    >
      {text}
    </a>
  </div>
);

export default Links;
