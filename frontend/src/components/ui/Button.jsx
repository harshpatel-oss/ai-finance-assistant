import React from "react";

export const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseClasses = "rounded-full font-medium transition-all duration-300 cursor-pointer flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-105 disabled:opacity-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50",
    outline: "border-2 border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-50",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
    full: "w-full px-6 py-2.5"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};
