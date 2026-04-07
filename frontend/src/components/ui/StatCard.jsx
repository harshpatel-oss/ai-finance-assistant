import React, { useEffect, useState } from "react";
import { Card } from "./Card";

const AnimatedCounter = ({ value, duration = 1000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  isPositive = true,
  prefix = "",
  suffix = "",
  trend = null
}) => {
  return (
    <Card hover={true} className="flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon size={24} className="text-blue-600" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {isPositive ? "↑" : "↓"} {trend}%
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mb-3">
        <AnimatedCounter 
          value={parseFloat(value) || 0} 
          prefix={prefix}
          suffix={suffix}
          duration={800}
        />
      </p>

      {change && (
        <p className={`text-xs font-medium ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}>
          {change}
        </p>
      )}
    </Card>
  );
};
