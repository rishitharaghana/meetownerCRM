import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {  useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { RootState, AppDispatch } from "../../store/store";
import { Lead } from "../../types/LeadModel";
import { clearLeads, getLeadsByUser } from "../../store/slices/leadslice";
import FilterBar from "../../components/common/FilterBar";

const userTypeOptions = [
  { value: "4", label: "Sales Manager" },
  { value: "5", label: "Telecallers" },
  { value: "6", label: "Marketing Executors" },
  { value: "7", label: "Receptionists" },
];

const statusOptions = [
  { value: "", label: "All" },
  { value: "0", label: "Today Leads" },
  { value: "1", label: "Open Leads" },
  { value: "2", label: "Today Follow" },
  { value: "3", label: "In Progress" },
  { value: "4", label: "Site Visit Scheduled" },
  { value: "5", label: "Site Visit Done" },
  { value: "6", label: "Won" },
  { value: "7", label: "Lost" },
  { value: "8", label: "Revoked" },
];

const renderDropdown = (
  item: Lead,
  handleLeadAssign: (leadId: number) => void,
  handleViewHistory: (item: Lead) => void,
  handleMarkAsBooked: (leadId: number) => void,
  handleDelete: (leadId: number) => void,
  dropdownRef: React.RefObject<HTMLDivElement>,
  dropdownOpen: { leadId: string; x: number; y: number } | null
) => (
  <div
    ref={dropdownRef}
    className="absolute z-50 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-2"
    style={{ top: dropdownOpen?.y, left: dropdownOpen?.x, transform: "translate(-100%, 0)" }}
  >
    <ul className="py-2">
      <li>
        <button
          onClick={() => handleLeadAssign(item.lead_id)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
        >
          Assign Lead
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
          onClick={() => handleMarkAsBooked(item.lead_id)}
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
);

const AllLeadDetails: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<{ leadId: string; x: number; y: number } | null>(null);
  const [localPage, setLocalPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [updatedDate, setUpdatedDate] = useState<string | null>(null);



  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { leads, loading, error } = useSelector((state: RootState) => state.lead);

  const { admin_user_id, admin_user_type, assigned_user_type, name } = location.state || {};

  const itemsPerPage = 10;

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const params = {
        lead_added_user_type: admin_user_type || user.user_type,
        lead_added_user_id: admin_user_id || user.id,
      };

      dispatch(getLeadsByUser(params)).unwrap().catch((err) => {
        toast.error(err || "Failed to fetch leads");
      });
    }
    return () => {
      dispatch(clearLeads());
    };
  }, [isAuthenticated, user, admin_user_id, admin_user_type, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button")
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLeads = leads?.filter((item) => {
    const matchesSearch = !searchQuery
      ? true
      : item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer_phone_number.includes(searchQuery) ||
        item.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.interested_project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assigned_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assigned_emp_number.includes(searchQuery);

    const matchesStatus = !selectedStatus
      ? true
      : item.status_id.toString() === selectedStatus;

    const matchesCreatedDate = !createdDate
      ? true
      : item.created_date.split("T")[0] === createdDate;

    const matchesUpdatedDate = !updatedDate
      ? true
      : item.updated_date?.split("T")[0] === updatedDate;

    return matchesSearch && matchesStatus && matchesCreatedDate && matchesUpdatedDate;
  }) || [];

  const totalCount = filteredLeads.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentLeads = filteredLeads.slice(
    (localPage - 1) * itemsPerPage,
    localPage * itemsPerPage
  );

  const getUserType = userTypeOptions.find((option) => option.value === assigned_user_type?.toString())?.label || "Unknown";
  const getPageTitle = () => `${getUserType} - ${name} All Leads`;

  const handleSearch = (value: string) => {
    setSearchQuery(value.trim());
    setLocalPage(1);
  };

  const handleStatusChange = (value: string | null) => {
    setSelectedStatus(value || "");
    setLocalPage(1);
  };

  const handleCreatedDateChange = (date: string | null) => {
    setCreatedDate(date);
    setLocalPage(1);
  };

  const handleUpdatedDateChange = (date: string | null) => {
    setUpdatedDate(date);
    setLocalPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setCreatedDate(null);
    setUpdatedDate(null);
    setLocalPage(1);
  };

  const goToPage = (page: number) => setLocalPage(page);

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

  const handleViewHistory = (item: Lead) => {
    navigate("/leads/view", { state: { property: item } });
    setDropdownOpen(null);
  };

  const handleLeadAssign = (leadId: number) => {
    navigate(`/leads/assign/${leadId}`);
    setDropdownOpen(null);
  };

  const handleMarkAsBooked = (leadId: number) => {
    const lead = currentLeads.find((item) => item.lead_id === leadId);
    if (lead) {
      navigate(`/leads/book/${leadId}`, {
        state: {
          leadId,
          leadAddedUserId: admin_user_id || user!.id,
          leadAddedUserType: admin_user_type || user!.user_type,
          propertyId: lead.interested_project_id || 2,
        },
      });
      setDropdownOpen(null);
    } else {
      toast.error("Lead not found");
    }
  };

  const handleDelete = (leadId: number) => {
    console.log(`Delete lead: ${leadId}`);
    setDropdownOpen(null);
  };

  return (
    <div className="relative min-h-screen">
      <PageMeta title="Lead Management - All Leads" />
      <PageBreadcrumb
        pageTitle={getPageTitle()}
        pagePlacHolder="Search by Customer Name, Mobile, Email, Project, Budget, Priority, or Status"
        onFilter={handleSearch}
      />
      <FilterBar
        showUserTypeFilter={false}
        showStatusFilter={true}
        showCreatedDateFilter={true}
        showUpdatedDateFilter={true}
        showStateFilter={false}
        showCityFilter={false}
        statusFilterOptions={statusOptions}
        onStatusChange={handleStatusChange}
        onCreatedDateChange={handleCreatedDateChange}
        onUpdatedDateChange={handleUpdatedDateChange}
        onClearFilters={handleClearFilters}
        selectedStatus={selectedStatus}
        createdDate={createdDate}
        updatedDate={updatedDate}
        className="mb-4"
      />
      {/* Display active filters */}
      {(searchQuery || selectedStatus || createdDate || updatedDate) && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 px-4">
          Filters: Search: {searchQuery || "None"} | 
          Status: {selectedStatus ? statusOptions.find((s) => s.value === selectedStatus)?.label || "All" : "All"} | 
          Created Date: {createdDate || "Any"} | 
          Updated Date: {updatedDate || "Any"}
        </div>
      )}
      <div className="space-y-6">
        {loading && <div className="text-center text-gray-600 dark:text-gray-400 py-4">Loading leads...</div>}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}
        {!loading && !error && filteredLeads.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-4">No leads found.</div>
        )}
        {!loading && !error && filteredLeads.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table className="w-full table-layout-fixed overflow-x-auto">
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-blue-900">
                  <TableRow className="text-white">
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[5%]">
                      Sl. No
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[20%]">
                      Customer Name
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[20%]">
                      Customer Number
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[20%]">
                      Email
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[20%]">
                      Interested Project
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[15%]">
                      Lead Type
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[15%]">
                      Created Date
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[15%]">
                      Updated Date
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[10%]">
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
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[5%]">
                        {(localPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm whitespace-nowrap w-[20%]">
                        {item.customer_name || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[20%]">
                        {item.customer_phone_number || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[20%]">
                        {item.customer_email || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[20%]">
                        {item.interested_project_name || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
                        {item.status_name || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
                        {item.created_date?.split("T")[0] || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
                        {item.updated_date?.split("T")[0] || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative whitespace-nowrap w-[10%]">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-left border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownOpen({
                              leadId: item.lead_id.toString(),
                              x: rect.right,
                              y: rect.top + window.scrollY,
                            });
                          }}
                        >
                          <svg
                            className="w-5 h-5 text-gray-800 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </Button>
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
      </div>
      {dropdownOpen && currentLeads.find((item) => item.lead_id.toString() === dropdownOpen.leadId) && (
        createPortal(
          renderDropdown(
            currentLeads.find((item) => item.lead_id.toString() === dropdownOpen.leadId)!,
            handleLeadAssign,
            handleViewHistory,
            handleMarkAsBooked,
            handleDelete,
            dropdownRef,
            dropdownOpen
          ),
          document.body
        )
      )}
    </div>
  );
};

export default AllLeadDetails;