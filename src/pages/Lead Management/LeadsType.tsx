import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
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
import { clearLeads, getLeadsByUser, markLeadAsBooked } from "../../store/slices/leadslice";
import toast from "react-hot-toast";

import { BUILDER_USER_TYPE, renderDropdown,  sidebarSubItems } from "./CustomComponents";
import UpdateLeadModal from "./UpdateLeadModel";

const LeadsType: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<{ leadId: string; x: number; y: number } | null>(null);
  const [localPage, setLocalPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [statusUpdated, setStatusUpdated] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { lead_in, status } = useParams<{ lead_in: string; status: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { leads, loading, error } = useSelector((state: RootState) => state.lead);

  const isBuilder = user?.user_type === BUILDER_USER_TYPE;

  const itemsPerPage = 10;
  const statusId = parseInt(status || "0", 10);

  const sidebarItem = sidebarSubItems.find(
    (item) =>
      item.lead_in.toLowerCase() === lead_in?.toLowerCase() &&
      item.status === statusId
  );

   const leadsParams = useMemo(() => {
    if (
      !isAuthenticated ||
      !user?.id ||
      !user?.user_type ||
      statusId < 0 ||
      (!isBuilder && (!user?.created_user_id || !user?.created_user_type))
    ) {
      return null;
    }

    const params = {
      lead_added_user_id: isBuilder ? user.id : user.created_user_id,
      lead_added_user_type: isBuilder ? user.user_type : "2",
      status_id: statusId,
    };

    if (!isBuilder) {
      return {
        ...params,
        assigned_user_type: user.user_type,
        assigned_id: user.id,
      };
    }

    return params;
  }, [isAuthenticated, user, statusId, isBuilder]);

  useEffect(() => {
    if (leadsParams) {
      dispatch(getLeadsByUser(leadsParams)).unwrap().catch((err) => {
        toast.error(err || "Failed to fetch leads");
      });
    } else if (isAuthenticated && user) {
      toast.error("Invalid user data for fetching leads");
      console.warn("Invalid user data:", {
        id: user.id,
        user_type: user.user_type,
        created_user_id: user.created_user_id,
        created_user_type: "2",
        statusId,
      });
    }
    return () => {
      dispatch(clearLeads());
    };
  }, [leadsParams, dispatch, statusUpdated]);


  const filteredLeads = leads?.filter((item) => {
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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => sidebarItem?.name || "Leads";

  const handleSearch = (value: string) => setSearchQuery(value.trim());

  const goToPage = (page: number) => setLocalPage(page);

  const goToPreviousPage = () => localPage > 1 && goToPage(localPage - 1);
  const goToNextPage = () => localPage < totalPages && goToPage(localPage + 1);

  const getPaginationItems = () => {
    const pages = [];
    const totalVisiblePages = 7;
    let startPage = Math.max(1, localPage - Math.floor(totalVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1);
    if (endPage - startPage + 1 < totalVisiblePages) startPage = Math.max(1, endPage - totalVisiblePages + 1);
    if (startPage > 1) pages.push(1);
    if (startPage > 2) pages.push("...");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push("...");
    if (endPage < totalPages) pages.push(totalPages);
    return pages;
  };

  const handleViewHistory = (item: Lead) => navigate("/leads/view", { state: { property: item } });

  const handleLeadAssign = (leadId: number) => {
    navigate(`/leads/assign/${leadId}`);
    setDropdownOpen(null);
  };

  const handleUpdateModalSubmit = (data: any) => {
    setStatusUpdated(!statusUpdated);
    setIsUpdateModalOpen(false);
    setSelectedLeadId(null);
  };

  const handleMarkAsBooked = (leadId: number) => {
    if (isAuthenticated && user?.id) {
      dispatch(
        markLeadAsBooked({
          lead_id: leadId,
          lead_added_user_type: user.user_type,
          lead_added_user_id: user.id,
        })
      )
        .unwrap()
        .then(() => {
          const params = {
            lead_added_user_type: user.user_type,
            lead_added_user_id: user.id,
            status_id: statusId,
          };
          dispatch(getLeadsByUser(params));
        })
        .catch((error) => {
          toast.error(error || "Failed to mark lead as booked");
        });
    }
    setDropdownOpen(null);
  };

  const handleUpdateLead = (leadId: number) => {
    setSelectedLeadId(leadId);
    setIsUpdateModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDelete = (lead_id: number) => {
    console.log(`Delete lead: ${lead_id}`);
    setDropdownOpen(null);
  };

  return (
    <div className="relative min-h-screen">
      <PageMeta title={`Lead Management - ${getPageTitle()}`} />
      <PageBreadcrumb
        pageTitle={getPageTitle()}
        pagePlacHolder="Search by Customer Name, Mobile, Email, Project, Budget, Priority, or Status"
        onFilter={handleSearch}
      />
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
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow className="bg-blue-900 text-white">
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[5%]">
                      Sl. No
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[15%]">
                      Customer Name
                    </TableCell>
                   <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs whitespace-nowrap w-[15%]">
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
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
                        {item.customer_name || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
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
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
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
            handleUpdateLead,
            dropdownRef,
            dropdownOpen,
            isBuilder
          ),
          document.body
        )
      )}
      {isUpdateModalOpen && selectedLeadId && (
        <UpdateLeadModal
          leadId={selectedLeadId}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleUpdateModalSubmit}
        />
      )}
    </div>
  );
};

export default LeadsType;