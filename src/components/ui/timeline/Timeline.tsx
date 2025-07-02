import React from "react";
import { CheckCircle, Clock } from "lucide-react";

export interface TimelineEvent {
  label: string;
  timestamp: string;
  status: "completed" | "pending";
  description?: string;
  current?: boolean;
}

const Timeline: React.FC<{ data?: TimelineEvent[] }> = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No timeline data available.</p>;
  }

  return (
    <ol className="relative border-l border-purple-300 dark:border-purple-600">
      {data.map((event, index) => (
        <li key={index} className="mb-10 ml-6">
          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white ring-4 ring-white dark:ring-gray-900">
            {event.status === "completed" || event.current ? (
              <CheckCircle size={14} />
            ) : (
              <Clock size={14} />
            )}
          </span>
          <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900 dark:text-white">
            {event.label}
            {event.current && (
              <span className="ml-2 text-green-600 text-xs font-medium">(Current)</span>
            )}
          </h3>
          <time className="block mb-2 text-xs text-gray-400 dark:text-gray-500">
            {event.timestamp}
          </time>
          {event.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
};

export default Timeline;
