import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  nav?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  className,
  disabled = false,
  nav = false,
}) => {
  return nav === false ? (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-primary font-thin text-text py-2 px-4 rounded-md mt-4 mb hover:bg-selected transition hover:text-white  ${className}`}
    >
      {text}
    </button>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-background font-thin text-text py-2 px-4 rounded-md mt-4 mb hover:bg-selected transition hover:text-white  ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
