import React from "react";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";

interface SelectOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  showUserTypeFilter?: boolean;
  showCreatedDateFilter?: boolean;
  showCreatedEndDateFilter?: boolean; // New prop for created end date filter
  showUpdatedDateFilter?: boolean;
  showStatusFilter?: boolean;
  userFilterOptions?: SelectOption[];
  statusFilterOptions?: SelectOption[];
  onUserTypeChange?: (value: string | null) => void;
  onCreatedDateChange?: (date: string | null) => void;
  onCreatedEndDateChange?: (date: string | null) => void; // New handler
  onUpdatedDateChange?: (date: string | null) => void;
  onStatusChange?: (value: string | null) => void;
  onClearFilters?: () => void;
  selectedUserType?: string | null;
  createdDate?: string | null;
  createdEndDate?: string | null; // New prop for created end date
  updatedDate?: string | null;
  selectedStatus?: string | null;
  className?: string;
  showDateFilters?: boolean; // Keep for backward compatibility
}

const FilterBar: React.FC<FilterBarProps> = ({
  showUserTypeFilter = false,
  showCreatedDateFilter = false,
  showCreatedEndDateFilter = false, // Default to false
  showUpdatedDateFilter = false,
  showStatusFilter = false,
  userFilterOptions = [],
  statusFilterOptions = [],
  onUserTypeChange,
  onCreatedDateChange,
  onCreatedEndDateChange, // New handler
  onUpdatedDateChange,
  onStatusChange,
  onClearFilters,
  selectedUserType,
  createdDate,
  createdEndDate, // New prop
  updatedDate,
  selectedStatus,
  className = "",
  showDateFilters = false,
}) => {
  const handleCreatedDateChange = (selectedDates: Date[]) => {
    const dateObj = selectedDates[0];
    let date = "";
    if (dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      date = `${year}-${month}-${day}`;
      if (createdEndDate && date > createdEndDate) {
        alert("Created start date cannot be after created end date");
        return;
      }
    }
    onCreatedDateChange?.(date || null);
  };

  const handleCreatedEndDateChange = (selectedDates: Date[]) => {
    const dateObj = selectedDates[0];
    let date = "";
    if (dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      date = `${year}-${month}-${day}`;
      if (createdDate && date < createdDate) {
        alert("Created end date cannot be before created start date");
        return;
      }
    }
    onCreatedEndDateChange?.(date || null);
  };

  const handleUpdatedDateChange = (selectedDates: Date[]) => {
    const dateObj = selectedDates[0];
    let date = "";
    if (dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      date = `${year}-${month}-${day}`;
      if (createdDate && date < createdDate) {
        alert("Updated date cannot be before created date");
        return;
      }
    }
    onUpdatedDateChange?.(date || null);
  };

  const handleClearFilters = () => {
    onClearFilters?.();
  };

  // For backward compatibility: if showDateFilters is true, enable all date filters
  const displayCreatedDateFilter = showCreatedDateFilter || showDateFilters;
  const displayCreatedEndDateFilter = showCreatedEndDateFilter || showDateFilters;
  const displayUpdatedDateFilter = showUpdatedDateFilter || showDateFilters;

  return (
    <div className={`flex flex-col sm:flex-row gap-3 py-2 w-full ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {showUserTypeFilter && userFilterOptions.length > 0 && (
          <div className="w-full sm:w-43">
            <Select
              options={userFilterOptions}
              placeholder="Select User Type"
              onChange={(value: string) => onUserTypeChange?.(value || null)}
              value={selectedUserType || ""}
              className="dark:bg-dark-900"
            />
          </div>
        )}
        {(displayCreatedDateFilter || displayCreatedEndDateFilter || displayUpdatedDateFilter) && (
          <>
            {displayCreatedDateFilter && (
              <DatePicker
                id="createdDate"
                placeholder="Select created start date"
                onChange={handleCreatedDateChange}
                defaultDate={createdDate ? new Date(createdDate) : undefined}
              />
            )}
            {displayCreatedEndDateFilter && (
              <DatePicker
                id="createdEndDate"
                placeholder="Select created end date"
                onChange={handleCreatedEndDateChange}
                defaultDate={createdEndDate ? new Date(createdEndDate) : undefined}
              />
            )}
            {displayUpdatedDateFilter && (
              <DatePicker
                id="updatedDate"
                placeholder="Select updated date"
                onChange={handleUpdatedDateChange}
                defaultDate={updatedDate ? new Date(updatedDate) : undefined}
              />
            )}
          </>
        )}
        {showStatusFilter && statusFilterOptions.length > 0 && (
          <div className="w-full sm:w-43">
            <Select
              options={statusFilterOptions}
              placeholder="Select Status"
              onChange={(value: string) => onStatusChange?.(value || null)}
              value={selectedStatus || ""}
              className="dark:bg-dark-900"
            />
          </div>
        )}
        {(showUserTypeFilter || displayCreatedDateFilter || displayCreatedEndDateFilter || displayUpdatedDateFilter || showStatusFilter) && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="px-3 py-1 w-full sm:w-auto"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;