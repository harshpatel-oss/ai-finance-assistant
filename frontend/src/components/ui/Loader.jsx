import React from "react";

export const Loader = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`} />
    </div>
  );
};

export const Skeleton = ({ className = "", count = 1 }) => {
  return (
    <div className={className}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-4 mb-2 animate-pulse" />
      ))}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="rounded-2xl bg-white shadow-md p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-lg mb-4 w-32" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded-lg" />
      <div className="h-4 bg-gray-200 rounded-lg w-5/6" />
    </div>
  </div>
);
