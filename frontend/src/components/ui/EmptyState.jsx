import React from "react";
import { InboxIcon } from "lucide-react";

export const EmptyState = ({
  icon: Icon = InboxIcon,
  title = "No data",
  description = "Nothing to display right now",
  action,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="mb-4 p-3 bg-gray-100 rounded-full">
        <Icon size={40} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        {description}
      </p>
      {action && <>{action}</>}
    </div>
  );
};
