import React, { useEffect } from "react";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import Button from "../ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import { setCityDetails } from "../../store/slices/propertyDetails";
import { RootState, AppDispatch } from "../../store/store";
import Dropdown from "../form/Dropdown"; // Assuming Dropdown is used for state/city

interface SelectOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  showUserTypeFilter?: boolean;
  showCreatedDateFilter?: boolean;
  showCreatedEndDateFilter?: boolean;
  showUpdatedDateFilter?: boolean;
  showStatusFilter?: boolean;
  showStateFilter?: boolean; // New prop for state filter
  showCityFilter?: boolean; // New prop for city filter
  userFilterOptions?: SelectOption[];
  statusFilterOptions?: SelectOption[];
  onUserTypeChange?: (value: string | null) => void;
  onCreatedDateChange?: (date: string | null) => void;
  onCreatedEndDateChange?: (date: string | null) => void;
  onUpdatedDateChange?: (date: string | null) => void;
  onStatusChange?: (value: string | null) => void;
  onStateChange?: (value: string | null) => void; // New handler
  onCityChange?: (value: string | null) => void; // New handler
  onClearFilters?: () => void;
  selectedUserType?: string | null;
  createdDate?: string | null;
  createdEndDate?: string | null;
  updatedDate?: string | null;
  selectedStatus?: string | null;
  selectedState?: string | null; // New prop
  selectedCity?: string | null; // New prop
  className?: string;
  showDateFilters?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  showUserTypeFilter = false,
  showCreatedDateFilter = false,
  showCreatedEndDateFilter = false,
  showUpdatedDateFilter = false,
  showStatusFilter = false,
  showStateFilter = false,
  showCityFilter = false,
  userFilterOptions = [],
  statusFilterOptions = [],
  onUserTypeChange,
  onCreatedDateChange,
  onCreatedEndDateChange,
  onUpdatedDateChange,
  onStatusChange,
  onStateChange,
  onCityChange,
  onClearFilters,
  selectedUserType,
  createdDate,
  createdEndDate,
  updatedDate,
  selectedStatus,
  selectedState,
  selectedCity,
  className = "",
  showDateFilters = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { states } = useSelector((state: RootState) => state.property);
  const { citiesQuery } = usePropertyQueries();

  // Fetch cities based on selected state
  const citiesResult = citiesQuery(selectedState ? parseInt(selectedState) : undefined);

  // Dispatch cities to Redux store
  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  // Map states and cities to options
  const stateOptions =
    states?.map((state: any) => ({ value: state.value.toString(), text: state.label })) || [];
  const cityOptions =
    citiesResult?.data?.map((city: any) => ({ value: city.value.toString(), text: city.label })) ||
    [];

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
    <div className={`flex flex-col sm:flex-row items-center gap-3 py-2 w-full ${className}`}>
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        {showUserTypeFilter && userFilterOptions.length > 0 && (
          <div className="w-full sm:w-40">
            <Select
              options={userFilterOptions}
              placeholder="Select User Type"
              onChange={(value: string) => onUserTypeChange?.(value || null)}
              value={selectedUserType || ""}
              className="dark:bg-dark-900"
            />
          </div>
        )}
        {showStateFilter && stateOptions.length > 0 && (
          <div className="w-full sm:w-40">
            <Dropdown
              id="state"
              label="Select State"
              options={stateOptions}
              value={selectedState || ""}
              onChange={(value: string) => {
                onStateChange?.(value || null);
                if (value !== selectedState) {
                  onCityChange?.(null); // Reset city when state changes
                }
              }}
              placeholder="Search for a state..."
            />
          </div>
        )}
        {showCityFilter && (
          <div className="w-full sm:w-40">
            <Dropdown
              id="city"
              label="Select City"
              options={cityOptions}
              value={selectedCity || ""}
              onChange={(value: string) => onCityChange?.(value || null)}
              placeholder="Search for a city..."
              disabled={!selectedState}
            />
          </div>
        )}
        {(displayCreatedDateFilter || displayCreatedEndDateFilter || displayUpdatedDateFilter) && (
          <div className="flex flex-wrap items-center gap-3">
            {displayCreatedDateFilter && (
              <DatePicker
                id="createdDate"
                placeholder="Select created start date"
                onChange={handleCreatedDateChange}
                defaultDate={createdDate ? new Date(createdDate) : undefined}
                className="w-full sm:w-40"
              />
            )}
            {displayCreatedEndDateFilter && (
              <DatePicker
                id="createdEndDate"
                placeholder="Select created end date"
                onChange={handleCreatedEndDateChange}
                defaultDate={createdEndDate ? new Date(createdEndDate) : undefined}
                className="w-full sm:w-40"
              />
            )}
            {displayUpdatedDateFilter && (
              <DatePicker
                id="updatedDate"
                placeholder="Select updated date"
                onChange={handleUpdatedDateChange}
                defaultDate={updatedDate ? new Date(updatedDate) : undefined}
                className="w-full sm:w-40"
              />
            )}
          </div>
        )}
        {showStatusFilter && statusFilterOptions.length > 0 && (
          <div className="w-full sm:w-40">
            <Select
              options={statusFilterOptions}
              placeholder="Select Status"
              onChange={(value: string) => onStatusChange?.(value || null)}
              value={selectedStatus || ""}
              className="dark:bg-dark-900"
            />
          </div>
        )}
        {(showUserTypeFilter ||
          showStateFilter ||
          showCityFilter ||
          displayCreatedDateFilter ||
          displayCreatedEndDateFilter ||
          displayUpdatedDateFilter ||
          showStatusFilter) && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="px-4 py-2 w-full sm:w-auto bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;