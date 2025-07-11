import React from "react";
import { CheckCircle, Clock } from "lucide-react";

  const allDesignationOptions = [
    {value:"3",text:"Channel Partner"},
    { value: "4", text: "Sales Manager" },
    { value: "5", text: "Telecallers" },
    { value: "6", text: "Marketing Agent" },
    { value: "7", text: "Receptionists" },
  ];

export interface TimelineEvent {
  label: string;
  timestamp: string;
  status: "completed" | "pending";
  description?: string;
  nextAction?:string;
  current?: boolean;
  updatedEmpType?:string;
  updatedEmpId?:string;
  updatedEmpPhone?:string;
  updatedEmpName?:string;
  
}

const Timeline: React.FC<{ data?: TimelineEvent[] }> = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No timeline data available.</p>;
  }

const getDesignation = (empType?: string) => {
    if (!empType) return "Unknown Designation"; // Fallback for undefined empType
    const designation = allDesignationOptions.find((emp) => emp.value === empType)?.text;
    return designation || "Unknown Designation"; // Fallback if no match found
};

  return (
    <ol className="relative border-l border-blue-600 dark:border-blue-600">
      {data.map((event, index) => (
        <li key={index} className="mb-10 ml-6">
          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-blue-900 text-white ring-4 ring-white dark:ring-gray-900">
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
           {event.nextAction && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{event.nextAction}</p>
          )}
          {(event.updatedEmpId && event.updatedEmpType) && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{getDesignation(event.updatedEmpType)}</p>
          )}
           {(event.updatedEmpName && event.updatedEmpPhone) && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{event.updatedEmpName} | {event.updatedEmpPhone}</p>
          )}
        </li>
      ))}
    </ol>
  );
};

export default Timeline;
