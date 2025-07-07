import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import { MoreVertical } from "lucide-react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumbList from "../../components/common/PageBreadCrumbLists";
import Pagination from "../../components/ui/pagination/Pagination";
import { RootState, AppDispatch } from "../../store/store";
import { User } from "../../types/UserModel";
import { clearUsers, getUsersByType } from "../../store/slices/userslice";

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

export default function EmployeesScreen() {
  const { status } = useParams<{ status: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { users, loading, error } = useSelector((state: RootState) => state.user);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const menuRef = useRef<HTMLDivElement>(null);

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
  }, [isAuthenticated, user, empUserType, dispatch]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredUsers = users?.filter((user) => {
    const searchableFields = [
      user.name,
      user.mobile,
      user.email,
      user.city,
      user.state,
      user.gst_number,
      user.rera_number,
    ];
    return searchableFields
      .map((field) => field?.toLowerCase() || "")
      .some((field) => field.includes(filterValue.toLowerCase()));
  }) || [];

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleView = (id: number) => {
    if (isAuthenticated && user?.id && empUserType) {
      navigate(`/employeedetails/${empUserType}/${id}`);
    }
    setActiveMenu(null);
  };

  const handleEdit = (id: number) => {
    console.log(`Edit user with ID: ${id}`);
    setActiveMenu(null);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete user with ID: ${id}`);
    setActiveMenu(null);
  };

  const handleStatusChange = (user: User) => {
    console.log(
      `Change status for user with ID: ${user.id} to ${
        user.status === 0 ? "Suspend" : "Activate"
      }`
    );
    setActiveMenu(null);
  };

  const handleFilter = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const toggleMenu = (id: number) => {
    console.log("Toggling menu for ID:", id, "Current activeMenu:", activeMenu);
    setActiveMenu(activeMenu === id ? null : id);
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
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Sl.No
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Employee
                      </TableCell>
                      {!showMobileAndEmail && (
                        <>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Mobile
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Email
                          </TableCell>
                        </>
                      )}
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Address
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        City
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        State
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Since
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {user.id}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {user.name}
                              </span>
                             
                            </div>
                          </div>
                        </TableCell>
                        {!showMobileAndEmail && (
                          <>
                            <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                              {user.mobile}
                            </TableCell>
                            <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                              {user.email}
                            </TableCell>
                          </>
                        )}
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {user.address}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {user.city}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {user.state}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {formatDate(user.created_date)}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : user.status === 2
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : user.status === 3
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {user.status === 0
                              ? "Pending"
                              : user.status === 2
                              ? "Approved"
                              : user.status === 3
                              ? "Blocked"
                              : "Rejected"}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                              toggleMenu(user.id);
                            }}
                          >
                            <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                          </Button>
                          {activeMenu === user.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-2 top-10 z-20 w-32 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                            >
                              <div className="py-2">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleView(user.id)}
                                >
                                  View
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleEdit(user.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleDelete(user.id)}
                                >
                                  Delete
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => handleStatusChange(user)}
                                >
                                  {user.status === 0 ? "Suspend" : "Activate"}
                                </button>
                              </div>
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

          {totalItems > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}