import React from "react";

export const Badge = ({ 
  children, 
  variant = "default", 
  className = "" 
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
    gray: "bg-gray-100 text-gray-800"
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
