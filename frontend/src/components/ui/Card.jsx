import React from "react";

export const Card = ({ 
  children, 
  className = "", 
  hover = false,
  variant = "default"
}) => {
  const baseClasses = "rounded-2xl bg-white shadow-md transition-all duration-300";
  const hoverClasses = hover ? "hover:shadow-lg hover:scale-105" : "";
  const variants = {
    default: "p-6",
    sm: "p-4",
    lg: "p-8",
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50"
  };

  return (
    <div className={`${baseClasses} ${hoverClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={`mt-6 pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);
