import React from "react";

export const Badge = ({ 
  children, 
  variant = "default", 
  className = "" 
}) => {
  const variants = {
    default: "bg-blue-100/90 text-blue-800 dark:bg-slate-800 dark:text-blue-300",
    success: "bg-green-100/90 text-green-800 dark:bg-emerald-900 dark:text-emerald-300",
    warning: "bg-yellow-100/90 text-yellow-800 dark:bg-amber-900 dark:text-amber-300",
    danger: "bg-red-100/90 text-red-800 dark:bg-red-900 dark:text-red-300",
    purple: "bg-purple-100/90 text-purple-800 dark:bg-violet-900 dark:text-purple-300",
    gray: "bg-gray-100/90 text-gray-800 dark:bg-slate-800 dark:text-gray-300"
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
