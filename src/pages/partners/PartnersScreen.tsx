// pages/PartnerScreen.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
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
import { Modal } from "../../components/ui/modal";
import Pagination from "../../components/ui/pagination/Pagination";
import { RootState, AppDispatch } from "../../store/store";
import { User } from "../../types/UserModel";
import { clearUsers, getUserById, getUsersByType } from "../../store/slices/userslice";


const userTypeMap: { [key: number]: string } = {
  3: "Channel Partner",
  4: "Sales Manager",
  5: "Telecallers",
  6: "Marketing Agent",
  7: "Receptionists",
};

export default function PartnerScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { users, loading, error } = useSelector((state: RootState) => state.user);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const itemsPerPage = 10;
  const categoryLabel = "Partners";

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(getUsersByType({ admin_user_id: user.id, emp_user_type: 3 }));
    }
    return () => {
      dispatch(clearUsers());
    };
  }, [isAuthenticated, user, dispatch]);

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

  const handleViewProfile = (id: number) => {
    if (isAuthenticated && user?.id) {
      navigate(`/partner/${id}`);
    }
    setActiveMenu(null);
  };

  const handleVerify = (id: number) => {
    console.log(`Verify user with ID: ${id}`);
    setActiveMenu(null);
  };

  const handleReject = (user: User) => {
    setSelectedUser(user);
    setIsRejectModalOpen(true);
    setActiveMenu(null);
  };

  const handleRejectSubmit = () => {
    if (selectedUser && rejectReason) {
      console.log(`Reject user with ID: ${selectedUser.id}, Reason: ${rejectReason}`);
      setIsRejectModalOpen(false);
      setRejectReason("");
      setSelectedUser(null);
    }
  };

  const toggleMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleFilter = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="relative min-h-screen">
      <PageBreadcrumbList
        pageTitle={`${categoryLabel} Table`}
        pagePlacHolder="Filter partners by name, mobile, email, city, GST, or RERA"
        onFilter={handleFilter}
      />
      <div className="space-y-6">
        <ComponentCard title={`${categoryLabel} Table`}>
          {loading && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-4">
              Loading partners...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 py-4">
              {error}
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  dispatch(getUsersByType({ admin_user_id: user!.id, emp_user_type: 3 }))
                }
                className="ml-4"
              >
                Retry
              </Button>
            </div>
          )}
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-4">
              No partners found.
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
                        ID
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[15%]"
                      >
                        Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[20%]"
                      >
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[10%]"
                      >
                        Number
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[15%]"
                      >
                        Location
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[10%]"
                      >
                        Joined
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
                    {paginatedUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[5%]">
                          {user.id}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm whitespace-nowrap w-[15%]">
                          <div className="flex items-center gap-3">
                            <div>
                              <Link
                                to={`/partner/${user.id}`}
                                className="block font-medium text-blue-600 underline hover:text-blue-800 transition-colors"
                              >
                                {user.name}
                              </Link>
                              <span className="block text-gray-500 text-theme-sm dark:text-gray-400">
                                {userTypeMap[user.user_type] || "Unknown"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[20%]">
                          {user.email}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
                          {user.mobile}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
                          {`${user.city}, ${user.state}`}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
                          {formatDate(user.created_date)}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm whitespace-nowrap w-[10%]">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 0
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {user.status === 0 ? "Pending" : "Verified"}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative whitespace-nowrap w-[10%]">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleMenu(user.id)}
                            className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                          >
                            <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                          </Button>
                          {activeMenu === user.id && (
                            <div className="absolute right-2 top-10 z-10 w-32 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                              <div className="py-2">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  onClick={() => handleViewProfile(user.id)}
                                >
                                  View Profile
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  onClick={() => handleVerify(user.id)}
                                >
                                  Verify
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  onClick={() => handleReject(user)}
                                >
                                  Reject
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
        onClose={() => setIsRejectModalOpen(false)}
        className="max-w-md p-6"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Reject Partner
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please provide a reason for rejecting {selectedUser?.name}'s
            application:
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
              onClick={() => setIsRejectModalOpen(false)}
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