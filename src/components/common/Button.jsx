import React from 'react';

const Button = ({
    onClick,
    children,
    variant = "primary",
    className = "",
    type = "button",
    disabled = false,
}) => {
    const baseStyle =
        "px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        danger: "bg-red-50 text-red-600 hover:bg-red-100",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        success: "bg-green-600 text-white hover:bg-green-700",
        ghost: "hover:bg-gray-100 text-gray-600",
        ai: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 shadow-md",
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
