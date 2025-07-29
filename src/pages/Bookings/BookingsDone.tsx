import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import FilterBar from "../../components/common/FilterBar";
import { RootState, AppDispatch } from "../../store/store";
import { clearLeads, getBookedLeads } from "../../store/slices/leadslice";
import { leadSourceOptions } from "../../components/common/reusedList";
import { BUILDER_USER_TYPE } from "../Lead Management/CustomComponents";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import { setCityDetails } from "../../store/slices/propertyDetails";

const BookingsDone: React.FC = () => {
  const [localPage, setLocalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [updatedDate, setUpdatedDate] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { bookedLeads, loading, error } = useSelector((state: RootState) => state.lead);
  const { states } = useSelector((state: RootState) => state.property);
  const { citiesQuery } = usePropertyQueries();
  const itemsPerPage = 10;
  const isBuilder = user?.user_type === BUILDER_USER_TYPE;

  // Fetch cities based on selected state
  const citiesResult = citiesQuery(selectedState ? parseInt(selectedState) : undefined);

  // Dispatch cities to Redux store
  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  // Handle city fetch errors
  useEffect(() => {
    if (citiesResult.isError) {
      toast.error(`Failed to fetch cities: ${citiesResult.error?.message || "Unknown error"}`);
    }
  }, [citiesResult.isError, citiesResult.error]);

  // Prepare parameters for fetching leads
  const leadsParams = useMemo(() => {
    if (!isAuthenticated || !user?.id || !user.user_type) {
      return null;
    }

    const params = {
      lead_added_user_id: isBuilder ? user.id : user.created_user_id!,
      lead_added_user_type: isBuilder ? user.user_type : Number(user.created_user_type),
    };

    if (!isBuilder && user.created_user_id && user.created_user_type !== undefined) {
      return {
        ...params,
        assigned_user_type: user.user_type.toString(),
        assigned_id: user.id.toString(),
      };
    }

    return params;
  }, [isAuthenticated, user, isBuilder]);

  // Fetch booked leads
  useEffect(() => {
    if (leadsParams) {
      dispatch(getBookedLeads(leadsParams)).unwrap().catch((err) => {
        console.error("Failed to fetch booked leads:", err);
      });
    }
    return () => {
      dispatch(clearLeads());
    };
  }, [leadsParams, dispatch]);

  // Filter leads based on search and filter criteria
  const filteredLeads = useMemo(() => {
    return bookedLeads?.filter((item) => {
      const matchesText = !searchQuery
        ? true
        : [
            item.customer_name,
            item.customer_phone_number,
            item.customer_email,
            item.interested_project_name,
            item.assigned_name,
            item.assigned_emp_number,
            item.assigned_priority,
          ]
            .map((field) => field?.toLowerCase() || "")
            .some((field) => field.includes(searchQuery.toLowerCase()));

      const matchesCreatedDate = !createdDate || item.created_date?.split("T")[0] === createdDate;
      const matchesUpdatedDate = !updatedDate || item.updated_date?.split("T")[0] === updatedDate;
      const matchesState =
        !selectedState ||
        item.state?.toLowerCase() ===
          states.find((s) => s.value.toString() === selectedState)?.label.toLowerCase();
      const matchesCity =
        !selectedCity ||
        citiesResult.data?.find((c) => c.value === selectedCity)?.label.toLowerCase() ===
          item.city?.toLowerCase();

      return matchesText && matchesCreatedDate && matchesUpdatedDate && matchesState && matchesCity;
    }) || [];
  }, [bookedLeads, searchQuery, createdDate, updatedDate, selectedState, selectedCity, states, citiesResult.data]);

  const totalCount = filteredLeads.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentLeads = filteredLeads.slice((localPage - 1) * itemsPerPage, localPage * itemsPerPage);

  // Reset page on filter change
  useEffect(() => {
    setLocalPage(1);
  }, [searchQuery, createdDate, updatedDate, selectedState, selectedCity]);

  // Handle checkbox selection
  const handleCheckboxChange = (leadId: number) => {
    setSelectedLeadId((prev) => (prev === leadId ? null : leadId));
  };

  // Navigate to lead details
  const handleViewDetails = () => {
    if (selectedLeadId === null) {
      toast.error("Please select a lead.");
      return;
    }
    const lead = currentLeads.find((item) => item.lead_id === selectedLeadId);
    if (lead) {
      navigate(`/booking/${lead.lead_id}`, { state: { lead } });
    } else {
      toast.error("Lead not found");
    }
  };

  // Filter handlers
  const handleSearch = (value: string) => setSearchQuery(value.trim());
  const handleCreatedDateChange = (date: string | null) => setCreatedDate(date);
  const handleUpdatedDateChange = (date: string | null) => setUpdatedDate(date);
  const handleStateChange = (value: string | null) => {
    setSelectedState(value);
    setSelectedCity(null); // Reset city when state changes
  };
  const handleCityChange = (value: string | null) => setSelectedCity(value);
  const handleClearFilters = () => {
    setSearchQuery("");
    setCreatedDate(null);
    setUpdatedDate(null);
    setSelectedState(null);
    setSelectedCity(null);
    setLocalPage(1);
  };

  // Pagination handlers
  const goToPage = (page: number) => setLocalPage(page);
  const goToPreviousPage = () => localPage > 1 && goToPage(localPage - 1);
  const goToNextPage = () => localPage < totalPages && goToPage(localPage + 1);

  const getPaginationItems = () => {
    const totalVisiblePages = 7;
    let startPage = Math.max(1, localPage - Math.floor(totalVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1);
    if (endPage - startPage + 1 < totalVisiblePages) {
      startPage = Math.max(1, endPage - totalVisiblePages + 1);
    }
    const pages: (number | "...")[] = [];
    if (startPage > 1) pages.push(1);
    if (startPage > 2) pages.push("...");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push("...");
    if (endPage < totalPages) pages.push(totalPages);
    return pages;
  };

  const leadSourceMap = Object.fromEntries(
    leadSourceOptions.map((option) => [option.value, option.label])
  );

  return (
    <div className="relative min-h-screen">
      <div className="flex justify-end">
        <PageBreadcrumb items={[{ label: "" }, { label: "Bookings Done" }]} />
      </div>
      <PageMeta title="Booked Leads" />

      <FilterBar
        className="mb-4"
        showCreatedDateFilter
        showUpdatedDateFilter
        showStateFilter
        showCityFilter
        onCreatedDateChange={handleCreatedDateChange}
        onUpdatedDateChange={handleUpdatedDateChange}
        onStateChange={handleStateChange}
        onCityChange={handleCityChange}
        onClearFilters={handleClearFilters}
        createdDate={createdDate}
        updatedDate={updatedDate}
        selectedState={selectedState}
        selectedCity={selectedCity}
      />
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by Name, Mobile, Email, Project"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <Button
          variant="primary"
          onClick={handleViewDetails}
          disabled={selectedLeadId === null}
          className="px-4 py-2 h-10"
        >
          View Details
        </Button>
      </div>
      <div className="space-y-6">
        {loading && <div className="text-center text-gray-600 py-4">Loading leads...</div>}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}
        {!loading && !error && filteredLeads.length === 0 && (
          <div className="text-center text-gray-600 py-4">No leads found.</div>
        )}
        {!loading && !error && filteredLeads.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="w-full overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="border-b border-gray-100">
                  <TableRow className="bg-blue-900 text-white">
                    <TableCell isHeader className="text-center font-medium text-xs w-[5%]">
                      Select
                    </TableCell>
                    <TableCell isHeader className="text-left font-medium text-xs w-[15%]">
                      Name
                    </TableCell>
                    <TableCell isHeader className="text-left font-medium text-xs w-[15%]">
                      Number
                    </TableCell>
                    <TableCell isHeader className="text-left font-medium text-xs w-[15%]">
                      Project
                    </TableCell>
                    <TableCell isHeader className="text-left font-medium text-xs w-[10%]">
                      Lead Type
                    </TableCell>
                    <TableCell isHeader className="text-left font-medium text-xs w-[10%]">
                      Created
                    </TableCell>
                    <TableCell isHeader className="text-left font-medium text-xs w-[10%]">
                      Updated
                    </TableCell>
                    <TableCell isHeader className="text-left font-medium text-xs w-[10%]">
                      City
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100">
                  {currentLeads.map((item) => (
                    <TableRow
                      key={item.lead_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="text-center w-[5%]">
                        <input
                          type="checkbox"
                          checked={selectedLeadId === item.lead_id}
                          onChange={() => handleCheckboxChange(item.lead_id)}
                          className="h-3 w-3 text-blue-600 border-gray-300 rounded"
                        />
                      </TableCell>
                      <TableCell className="text-left truncate max-w-[120px] w-[15%]">
                        <span title={item.customer_name || "N/A"}>{item.customer_name || "N/A"}</span>
                      </TableCell>
                      <TableCell className="text-left w-[15%]">
                        {item.customer_phone_number || "N/A"}
                      </TableCell>
                      <TableCell className="text-left truncate max-w-[120px] w-[15%]">
                        <span title={item.interested_project_name || "N/A"}>
                          {item.interested_project_name || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-left w-[10%]">
                        {leadSourceMap[item.lead_source_id] || "N/A"}
                      </TableCell>
                      <TableCell className="text-left w-[10%]">
                        {item.created_date?.split("T")[0] || "N/A"}
                      </TableCell>
                      <TableCell className="text-left w-[10%]">
                        {item.updated_date?.split("T")[0] || "N/A"}
                      </TableCell>
                      <TableCell className="text-left w-[10%]">{item.city || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        {filteredLeads.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 py-2 gap-4">
            <div className="text-sm text-gray-500">
              Showing {(localPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(localPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} entries
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                variant={localPage === 1 ? "outline" : "primary"}
                size="sm"
                onClick={goToPreviousPage}
                disabled={localPage === 1}
              >
                Previous
              </Button>
              {getPaginationItems().map((page, index) => (
                <Button
                  key={`${page}-${index}`}
                  variant={page === localPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={page === "..."}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant={localPage === totalPages ? "outline" : "primary"}
                size="sm"
                onClick={goToNextPage}
                disabled={localPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsDone;