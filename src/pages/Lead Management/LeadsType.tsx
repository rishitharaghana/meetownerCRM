import { useState, useRef, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { RootState, AppDispatch } from "../../store/store";
import { Lead } from "../../types/LeadModel";
import { clearLeads, getLeadsByUser } from "../../store/slices/leadslice";

const sidebarSubItems = [
  { name: "Today Leads", lead_in: "new", status: 0 },
  { name: "Open Leads", lead_in: "open", status: 1 },
  { name: "Today Follow-Ups", lead_in: "today", status: 2 },
  { name: "In Progress", lead_in: "InProgress", status: 3 },
  { name: "Site Visit Scheduled", lead_in: "SiteVisitScheduled", status: 4 },
  { name: "Site Visit Done", lead_in: "SiteVisitDone", status: 5 },
  { name: "Won Leads", lead_in: "WonLeads", status: 6 },
  { name: "Lost Leads", lead_in: "LostLeads", status: 7 },
];

const userTypeOptions = [
  { value: "", label: "All" },
  { value: "3", label: "Channel Partner" },
  { value: "4", label: "Sales Manager" },
  { value: "5", label: "Telecallers" },
  { value: "6", label: "Marketing Executors" },
  { value: "7", label: "Receptionists" },
];

const LeadsType: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [localPage, setLocalPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [initialSearch, setInitialSearch] = useState<string>("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { lead_in, status } = useParams<{ lead_in: string; status: string }>();
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { leads, loading, error } = useSelector((state: RootState) => state.lead);

  const itemsPerPage = 5;
  const statusId = parseInt(status || "0", 10);

  const sidebarItem = sidebarSubItems.find(
    (item) =>
      item.lead_in.toLowerCase() === lead_in?.toLowerCase() &&
      item.status === statusId
  );

  useEffect(() => {
    if (isAuthenticated && user?.id && statusId >= 0) {
      const params: {
        lead_added_user_type: number;
        lead_added_user_id: number;
        status_id: number;
        assigned_user_type?: number;
        assigned_id?: number;
      } = {
        lead_added_user_type: user.user_type,
        lead_added_user_id: user.id,
        status_id: statusId,
      };

      if (user.user_type !== 2 && selectedUserType) {
        params.assigned_user_type = parseInt(selectedUserType);
        params.assigned_id = user.id;
      }

      dispatch(getLeadsByUser(params));
    }
    return () => {
      dispatch(clearLeads());
    };
  }, [isAuthenticated, user, statusId, selectedUserType, dispatch]);

  const filteredLeads = leads?.filter((item) => {
    if (statusId !== 5 && item.status_id !== statusId) {
      return false;
    }
    if (statusId === 5 && selectedUserType && item.assigned_user_type.toString() !== selectedUserType) {
      return false;
    }
    if (!searchQuery) return true;
    const searchValue = searchQuery.toLowerCase();
    return (
      item.customer_name.toLowerCase().includes(searchValue) ||
      item.customer_phone_number.includes(searchValue) ||
      item.customer_email.toLowerCase().includes(searchValue) ||
      item.interested_project_name.toLowerCase().includes(searchValue) ||
      item.assigned_name.toLowerCase().includes(searchValue) ||
      item.assigned_emp_number.includes(searchValue) ||
      item.assigned_priority.toLowerCase().includes(searchValue) ||
      item.status_name.toLowerCase().includes(searchValue)
    );
  }) || [];

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
    setLocalPage(1);
  }, [location.pathname]);

  useEffect(() => {
    setLocalPage(1);
  }, [searchQuery, selectedUserType]);

  useEffect(() => {
    const handleStorageChange = () => {
      const currentSearch = localStorage.getItem("searchQuery") || "";
      if (currentSearch === "" && initialSearch !== "") {
        setSearchQuery("");
        setLocalPage(1);
        setInitialSearch("");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [initialSearch]);

  const getPageTitle = () => {
    return sidebarItem?.name || "Leads";
  };

  const handleDelete = (lead_id: number) => {
    console.log(`Delete lead: ${lead_id}`);
    setDropdownOpen(null);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value.trim());
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

  const handleAddNewLead = () => {
    navigate("/leads/addlead");
  };

  const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserType(e.target.value);
    setLocalPage(1);
  };

  const handleViewHistory = (item: Lead) => {
    navigate("/leads/view", { state: { property: item } });
  };

  return (
    <div className="relative min-h-screen">
      <PageMeta title={`Lead Management - ${getPageTitle()}`} />
      <PageBreadcrumb
        pageTitle={getPageTitle()}
        pagePlacHolder="Search by Customer Name, Mobile, Email, Project, Budget, Priority, or Status"
        onFilter={handleSearch}
      />
      <div className="flex justify-between items-center gap-x-4 px-4 py-1">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Search result - {filteredLeads.length}
        </h2>
        {statusId === 0 && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddNewLead}
            className="bg-blue-900 hover:bg-blue-800 text-white"
          >
            Add New Lead
          </Button>
        )}
        {statusId === 5 && (
          <div className="px-4 py-2">
            <Label htmlFor="userTypeFilter">Filter by User Type</Label>
            <select
              id="userTypeFilter"
              value={selectedUserType}
              onChange={handleUserTypeChange}
              className="w-48 p-2 border rounded dark:bg-dark-900 dark:text-white"
            >
              {userTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="space-y-6">
        <ComponentCard title={getPageTitle()}>
          {loading && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-4">
              Loading leads...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 py-4">
              {error}
            </div>
          )}
          {!loading && !error && filteredLeads.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-4">
              No leads found.
            </div>
          )}
          {!loading && !error && filteredLeads.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table className="w-full table-layout-fixed overflow-x-auto">
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow className="bg-blue-900 text-white">
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[5%]"
                      >
                        Sl. No
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[15%]"
                      >
                        Customer Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[15%]"
                      >
                        Customer Number
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[20%]"
                      >
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[20%]"
                      >
                        Interested Project
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[15%]"
                      >
                        Lead Type
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[10%]"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {currentLeads.map((item, index) => (
                      <TableRow
                        key={item.lead_id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <TableCell
                          className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[5%]"
                        >
                          {(localPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell
                          className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]"
                        >
                          {item.customer_name || "N/A"}
                        </TableCell>
                        <TableCell
                          className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]"
                        >
                          {item.customer_phone_number || "N/A"}
                        </TableCell>
                        <TableCell
                          className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[20%]"
                        >
                          {item.customer_email || "N/A"}
                        </TableCell>
                        <TableCell
                          className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[20%]"
                        >
                          {item.interested_project_name || "N/A"}
                        </TableCell>
                        <TableCell
                          className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]"
                        >
                          {item.status_name || "N/A"}
                        </TableCell>
                        <TableCell
                          className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative whitespace-nowrap w-[10%]"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-left border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                            onClick={() =>
                              setDropdownOpen(
                                dropdownOpen === item.lead_id.toString()
                                  ? null
                                  : item.lead_id.toString()
                              )
                            }
                          >
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </Button>
                          {dropdownOpen === item.lead_id.toString() && (
                            <div
                              ref={dropdownRef}
                              className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                            >
                              <ul className="py-2">
                                <li>
                                  <button
                                    // onClick={() => handleLeadAssign(item)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
                                  >
                                    Lead Assign
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => handleViewHistory(item)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
                                  >
                                    View History
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
                                  >
                                    Bookings Done
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => handleDelete(item.lead_id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700 transition-colors rounded-md"
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
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
        </ComponentCard>
      </div>
    </div>
  );
};

export default LeadsType;