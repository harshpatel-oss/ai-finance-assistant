import React from "react";

export const Input = ({
  label,
  error,
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:outline-none transition-colors ${
          error ? "border-red-500 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:outline-none transition-colors resize-none ${
          error ? "border-red-500 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  error,
  options = [],
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:outline-none transition-colors ${
          error ? "border-red-500 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
