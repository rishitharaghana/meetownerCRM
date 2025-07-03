import React, { useState, useRef, useEffect } from "react";
import { Filter as FilterIcon } from "lucide-react";

interface FilterProps {
  onFilterChange?: (datetime: string) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Combine date and time to ISO string
  const getCombinedDateTime = () => {
    return selectedDate && selectedTime
      ? new Date(`${selectedDate}T${selectedTime}`).toISOString()
      : "";
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowFilter(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleApply = () => {
    const datetime = getCombinedDateTime();
    if (datetime && onFilterChange) {
      onFilterChange(datetime);
    }
    setShowFilter(false);
  };

  const handleClear = () => {
    setSelectedDate("");
    setSelectedTime("");
    if (onFilterChange) onFilterChange("");
    setShowFilter(false);
  };

  return (
    <div ref={filterRef} className="relative inline-block">
      {/* Filter Icon Button */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className={`p-2 rounded-full transition ${
          showFilter ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50 text-blue-500"
        }`}
        title="Toggle Filter"
        aria-label="Toggle date and time filter"
        aria-expanded={showFilter}
      >
        <FilterIcon className="w-5 h-5" />
      </button>

      {/* Filter Panel */}
      {showFilter && (
        <div className="absolute z-50 mt-2 right-0 bg-white border border-gray-300 shadow-lg rounded-md p-4 w-72 space-y-3">
          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-sm p-2"
            />
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md text-sm p-2"
            />
          </div>

          {/* Selected Date-Time */}
          {(selectedDate || selectedTime) && (
            <p className="text-xs text-gray-600">
              Selected:{" "}
              <span className="font-medium">{selectedDate} {selectedTime}</span>
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <button
              onClick={handleClear}
              className="text-xs text-red-500 hover:underline"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
