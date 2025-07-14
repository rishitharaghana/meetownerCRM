import React  from "react";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";

interface SelectOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  showUserTypeFilter?: boolean;
  showDateFilters?: boolean;
  userFilterOptions?: SelectOption[];
  onUserTypeChange?: (value: string | null) => void;
  onCreatedDateChange?: (date: string | null) => void;
  onUpdatedDateChange?: (date: string | null) => void;
  onClearFilters?: () => void;
  selectedUserType?: string | null;
  createdDate?: string | null;
  updatedDate?: string | null;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  showUserTypeFilter = false,
  showDateFilters = false,
  userFilterOptions = [],
  onUserTypeChange,
  onCreatedDateChange,
  onUpdatedDateChange,
  onClearFilters,
  selectedUserType,
  createdDate,
  updatedDate,
  className = "",
}) => {
  const handleCreatedDateChange = (selectedDates: Date[]) => {
    const dateObj = selectedDates[0];
    let date = "";
    if (dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      date = `${year}-${month}-${day}`;
    }
    onCreatedDateChange?.(date || null);
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
        {showDateFilters && (
          <>
            <DatePicker
              id="createdDate"
              placeholder="Select created date"
              onChange={handleCreatedDateChange}
              defaultDate={createdDate ? new Date(createdDate) : undefined}
            />
            <DatePicker
              id="updatedDate"
              placeholder="Select updated date"
              onChange={handleUpdatedDateChange}
              defaultDate={updatedDate ? new Date(updatedDate) : undefined}
            />
          </>
        )}
        {(showUserTypeFilter || showDateFilters) && (
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