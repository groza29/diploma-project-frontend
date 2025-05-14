import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  nav?: boolean;
  icon?: React.ReactNode; // 👈 Add this line
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  className,
  disabled = false,
  nav = false,
  icon, // 👈 Receive the prop
}) => {
  const baseStyles = `flex items-center gap-2 font-thin text-text py-2 px-4 rounded-md mt-4 mb transition hover:text-white ${className}`;
  const navStyles = nav ? `bg-background hover:bg-selected` : `bg-primary hover:bg-selected`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${navStyles}`}
    >
      <span>{text}</span>
      {icon && <span className="text-text text-thin hover:text-white text-sm">{icon}</span>}
    </button>
  );
};

export default Button;
