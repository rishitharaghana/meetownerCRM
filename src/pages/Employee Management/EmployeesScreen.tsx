import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumbList from "../../components/common/PageBreadCrumbLists";
import { Modal } from "../../components/ui/modal";
import Pagination from "../../components/ui/pagination/Pagination";
import { RootState, AppDispatch } from "../../store/store";
import { User } from "../../types/UserModel";
import { clearUsers, getUsersByType } from "../../store/slices/userslice";
import { getStatusDisplay } from "../../utils/statusdisplay";

const userTypeMap: { [key: number]: string } = {
  4: "Sales Manager",
  5: "Telecallers",
  6: "Marketing Executors",
  7: "Receptionists",
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const renderDropdown = (
  user: User,
 
  handleViewProfile: (userId: number) => void,
  dropdownRef: React.RefObject<HTMLDivElement>,
  dropdownOpen: { userId: string; x: number; y: number } | null
) => (
  <div
    ref={dropdownRef}
    className="absolute z-50 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-2"
    style={{ top: dropdownOpen?.y, left: dropdownOpen?.x }}
  >
    <ul className="py-2">
      
      <li>
        <button
          onClick={() => handleViewProfile(user.id)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
        >
          View Profile
        </button>
      </li>
      {/* <li>
        <button
          onClick={() => handleViewProfile(user.id)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
        >
          Delete profile
        </button>
      </li> */}
    </ul>
  </div>
);

export default function EmployeesScreen() {
  const { status } = useParams<{ status: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { users, loading, error } = useSelector((state: RootState) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState<{ userId: string; x: number; y: number } | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const createdUserId = parseInt(localStorage.getItem("userId") || "1", 10); 
  const itemsPerPage = 10;
  const empUserType = Number(status);
  const categoryLabel = userTypeMap[empUserType] || "Employees";
  const showMobileAndEmail = false;

  useEffect(() => {
    if (isAuthenticated && user?.id && empUserType) {
      dispatch(getUsersByType({ admin_user_id: user.id, emp_user_type: empUserType }));
    }
    return () => {
      dispatch(clearUsers());
    };
  }, [isAuthenticated, user, empUserType, statusUpdated, dispatch]);

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

  const filteredUsers = users?.filter((user) =>
    [
      user.name,
      user.mobile,
      user.email,
      user.city,
      user.state,
      user.gst_number,
      user.rera_number,
    ]
      .map((field) => field?.toLowerCase() || "")
      .some((field) => field.includes(filterValue.toLowerCase()))
  ) || [];

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleViewProfile = (id: number) => {
    if (isAuthenticated && user?.id && empUserType) {
      navigate(`/employeedetails/${empUserType}/${id}`);
    }
    setDropdownOpen(null);
  };

  

 

  const handleFilter = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  return (
    <div className="relative min-h-screen">
      <PageBreadcrumbList
        pageTitle={`${categoryLabel} Table`}
        pagePlacHolder="Filter employees by name, mobile, email, city, GST, or RERA"
        onFilter={handleFilter}
      />
      <div className="space-y-6">
        <ComponentCard title={`${categoryLabel} Table`}>
          {loading && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-4">
              Loading employees...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 py-4">
              {error}
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  dispatch(getUsersByType({ admin_user_id: user!.id, emp_user_type: empUserType }))
                }
                className="ml-4"
              >
                Retry
              </Button>
            </div>
          )}
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-4">
              No employees found.
            </div>
          )}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table className="w-full table-layout-fixed overflow-x-auto">
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-blue-900">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[5%]"
                      >
                        Sl.No
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[15%]"
                      >
                        Employee
                      </TableCell>
                      {showMobileAndEmail && (
                        <>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[15%]"
                          >
                            Mobile
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[20%]"
                          >
                            Email
                          </TableCell>
                        </>
                      )}
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[15%]"
                      >
                        Address
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[10%]"
                      >
                        City
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[10%]"
                      >
                        State
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[10%]"
                      >
                        Since
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[10%]"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[10%]"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {paginatedUsers.map((user) => {
                      const { text: statusText, className: statusClass } = getStatusDisplay(user.status);
                      return (
                        <TableRow
                          key={user.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[5%]">
                            {user.id}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm whitespace-nowrap w-[15%]">
                            <div className="flex items-center gap-3">
                              <Link
                                to={`/employeedetails/${empUserType}/${user.id}`}
                                className="block font-medium text-blue-600 underline hover:text-blue-800 transition-colors"
                              >
                                {user.name}
                              </Link>
                            </div>
                          </TableCell>
                          {showMobileAndEmail && (
                            <>
                              <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
                                {user.mobile}
                              </TableCell>
                              <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[20%]">
                                {user.email}
                              </TableCell>
                            </>
                          )}
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
                            {user.address}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
                            {user.city}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
                            {user.state}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
                            {formatDate(user.created_date)}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm whitespace-nowrap w-[10%]">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
                            >
                              {statusText}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative whitespace-nowrap w-[10%]">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-left border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setDropdownOpen({
                                  userId: user.id.toString(),
                                  x: rect.right - 192,
                                  y: rect.bottom + window.scrollY,
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
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          {dropdownOpen &&
            paginatedUsers.find((user) => user.id.toString() === dropdownOpen.userId) &&
            createPortal(
              renderDropdown(
                paginatedUsers.find((user) => user.id.toString() === dropdownOpen.userId)!,
                handleViewProfile,
               
                dropdownRef,
                dropdownOpen
              ),
              document.body
            )}
          {totalItems > itemsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 py-2 gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </ComponentCard>
      </div>
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectReason("");
          setSelectedUser(null);
        }}
        className="max-w-md p-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Reject Employee</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please provide a reason for rejecting {selectedUser?.name}'s application:
          </p>
          <textarea
            className="w-full h-24 p-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason("");
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRejectSubmit}
              disabled={!rejectReason}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}