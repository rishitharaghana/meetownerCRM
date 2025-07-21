import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";

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
import toast from "react-hot-toast";
import PageBreadcrumbList from "../../components/common/PageBreadCrumbLists";

const BookingsDone: React.FC = () => {
  const [localPage, setLocalPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [initialSearch, setInitialSearch] = useState<string>("");
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [updatedDate, setUpdatedDate] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedLeadIdSingle, setSelectedLeadIdSingle] = useState<
    number | null
  >(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { bookedLeads, loading, error } = useSelector(
    (state: RootState) => state.lead
  );

  const itemsPerPage = 10;
  const isBuilder = user?.user_type === BUILDER_USER_TYPE;

  const leadsParams = useMemo(() => {
    if (
      !isAuthenticated ||
      !user?.id ||
      !user.user_type ||
      (!isBuilder &&
        (!user?.created_user_id || user?.created_user_type === undefined))
    ) {
      return null;
    }

    const params = {
      lead_added_user_id: isBuilder ? user.id : user.created_user_id!,
      lead_added_user_type: isBuilder
        ? user.user_type
        : Number(user.created_user_type),
    };

    if (!isBuilder) {
      console.log(
        "Channel Partner: Adding assigned_user_type and assigned_id",
        {
          assigned_user_type: user.user_type,
          assigned_id: user.id,
        }
      );
      return {
        ...params,
        assigned_user_type: user.user_type.toString(),
        assigned_id: user.id.toString(),
      };
    }

    console.log("Builder: Using params without assigned fields", params);
    return params;
  }, [isAuthenticated, user, isBuilder]);

  useEffect(() => {
    if (leadsParams) {
      console.log("Dispatching getBookedLeads with params:", leadsParams);
      dispatch(getBookedLeads(leadsParams))
        .unwrap()
        .catch((err) => {
          console.error("Failed to fetch booked leads:", err);
        });
    } else if (isAuthenticated && user) {
      console.warn("Skipping getBookedLeads: Invalid user data", {
        id: user.id,
        user_type: user.user_type,
        created_user_id: user.created_user_id,
        created_user_type: user.created_user_type,
      });
    }
    return () => {
      dispatch(clearLeads());
    };
  }, [leadsParams, dispatch]);

  const filteredLeads = useMemo(() => {
    return (
      bookedLeads?.filter((item) => {
        const matchesTextFilter = !searchQuery
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

        const matchesCreatedDate =
          !createdDate || item.created_date?.split("T")[0] === createdDate;
        const matchesUpdatedDate =
          !updatedDate || item.updated_date?.split("T")[0] === updatedDate;
        const matchesState =
          !selectedState || item.state?.toString() === selectedState;
        const matchesCity =
          !selectedCity || item.city?.toString() === selectedCity;

        return (
          matchesTextFilter &&
          matchesCreatedDate &&
          matchesUpdatedDate &&
          matchesState &&
          matchesCity
        );
      }) || []
    );
  }, [
    bookedLeads,
    searchQuery,
    createdDate,
    updatedDate,
    selectedState,
    selectedCity,
  ]);

  const totalCount = filteredLeads.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentLeads = filteredLeads.slice(
    (localPage - 1) * itemsPerPage,
    localPage * itemsPerPage
  );

  useEffect(() => {
    const savedSearch = localStorage.getItem("searchQuery") || "";
    setInitialSearch(savedSearch);
    setSearchQuery(savedSearch);
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("searchQuery");
    setSearchQuery("");
    setInitialSearch("");
    setCreatedDate(null);
    setUpdatedDate(null);
    setSelectedState(null);
    setSelectedCity(null);
    setLocalPage(1);
  }, [location.pathname]);

  useEffect(() => {
    setLocalPage(1);
  }, [searchQuery, createdDate, updatedDate, selectedState, selectedCity]);

  useEffect(() => {
    const handleStorageChange = () => {
      const currentSearch = localStorage.getItem("searchQuery") || "";
      if (currentSearch === "" && initialSearch !== "") {
        setSearchQuery("");
        setCreatedDate(null);
        setUpdatedDate(null);
        setSelectedState(null);
        setSelectedCity(null);
        setLocalPage(1);
        setInitialSearch("");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [initialSearch]);

  const handleCheckboxChange = (leadId: number) => {
    setSelectedLeadIdSingle((prev) => (prev === leadId ? null : leadId));
  };

  const handleViewDetails = () => {
    if (selectedLeadIdSingle === null) {
      toast.error("Please select a lead.");
      return;
    }
    const lead = currentLeads.find(
      (item) => item.lead_id === selectedLeadIdSingle
    );
    if (lead) {
      navigate(`/booking/${lead.lead_id}`, { state: { lead } });
    } else {
      toast.error("Lead not found");
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value.trim());
  };

  const handleCreatedDateChange = (date: string | null) => {
    setCreatedDate(date);
  };

  const handleUpdatedDateChange = (date: string | null) => {
    setUpdatedDate(date);
  };

  const handleStateChange = (value: string | null) => {
    setSelectedState(value);
    setSelectedCity(null); // Reset city when state changes
  };

  const handleCityChange = (value: string | null) => {
    setSelectedCity(value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCreatedDate(null);
    setUpdatedDate(null);
    setSelectedState(null);
    setSelectedCity(null);
    setLocalPage(1);
  };

  const goToPage = (page: number) => {
    setLocalPage(page);
  };

  const goToPreviousPage = () => localPage > 1 && goToPage(localPage - 1);
  const goToNextPage = () => localPage < totalPages && goToPage(localPage + 1);

  const getPaginationItems = () => {
    const pages = [];
    const totalVisiblePages = 7;
    let startPage = Math.max(1, localPage - Math.floor(totalVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1);
    if (endPage - startPage + 1 < totalVisiblePages) {
      startPage = Math.max(1, endPage - totalVisiblePages + 1);
    }
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
      <PageMeta title="Booked Leads" />

      <FilterBar
        className="mb-4"
        showCreatedDateFilter={true}
        showUpdatedDateFilter={true}
        showStateFilter={true}
        showCityFilter={true}
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
        <PageBreadcrumbList
          pagePlacHolder="Search by Name, Mobile, Email, Project"
          onFilter={handleSearch}
          pageTitle={""}
        />
        <Button
          variant="primary"
          onClick={handleViewDetails}
          disabled={selectedLeadIdSingle === null}
          className="px-4 py-2 h-10"
        >
          View Details
        </Button>
      </div>
      <div className="space-y-6">
        {loading && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-4">
            Loading leads...
          </div>
        )}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}
        {!loading && !error && filteredLeads.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-4">
            No leads found.
          </div>
        )}
        {!loading && !error && filteredLeads.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="w-full overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow className="bg-blue-900 text-white">
                    <TableCell
                      isHeader
                      className="text-center font-medium text-xs whitespace-nowrap w-[5%]"
                    >
                      Select
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-left font-medium text-xs whitespace-nowrap w-[15%]"
                    >
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-left font-medium text-xs whitespace-nowrap w-[15%]"
                    >
                      Number
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-left font-medium text-xs whitespace-nowrap w-[15%]"
                    >
                      Project
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-left font-medium text-xs whitespace-nowrap w-[10%]"
                    >
                      Lead Type
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-left font-medium text-xs whitespace-nowrap w-[10%]"
                    >
                      Created
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-left font-medium text-xs whitespace-nowrap w-[10%]"
                    >
                      Updated
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-left font-medium text-xs whitespace-nowrap w-[10%]"
                    >
                      City
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {currentLeads.map((item, index) => (
                    <TableRow
                      key={item.lead_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <TableCell className="text-center w-[5%]">
                        <input
                          type="checkbox"
                          checked={selectedLeadIdSingle === item.lead_id}
                          onChange={() => handleCheckboxChange(item.lead_id)}
                          className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </TableCell>
                      <TableCell className="text-left truncate max-w-[120px] w-[15%]">
                        <span title={item.customer_name || "N/A"}>
                          {item.customer_name || "N/A"}
                        </span>
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
                      <TableCell className="text-left w-[10%]">
                        {item.city || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        {filteredLeads.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 py-2 gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {(localPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(localPage * itemsPerPage, filteredLeads.length)} of{" "}
              {filteredLeads.length} entries
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
