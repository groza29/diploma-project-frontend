import React from 'react';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = 'button', className, disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`py-2 px-4 rounded-md transition duration-300 ease-in-out ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-selected text-white'
                } ${className}`}
        >
            {text}
        </button>
    );
};

export default Button;
