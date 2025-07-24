import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import PageBreadcrumbList from "../../components/common/PageBreadCrumbLists";
import { Modal } from "../../components/ui/modal";
import Pagination from "../../components/ui/pagination/Pagination";
import FilterBar from "../../components/common/FilterBar";
import { RootState, AppDispatch } from "../../store/store";
import { User } from "../../types/UserModel";
import {
  clearUsers,
  getUsersByType,
  updateUserStatus,
} from "../../store/slices/userslice";
import { getStatusDisplay } from "../../utils/statusdisplay";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import { setCityDetails } from "../../store/slices/propertyDetails";

const statusFilterOptions = [
  { value: "0", label: "Pending" },
  { value: "1", label: "Verified" },
  { value: "2", label: "Rejected" },
];

export default function PartnerScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const { states } = useSelector((state: RootState) => state.property);
  const { citiesQuery } = usePropertyQueries();
  const [filterValue, setFilterValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [statusUpdated, setStatusUpdated] = useState<boolean>(false);
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [createdEndDate, setCreatedEndDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // Track single selected user ID
  const createdUserId = parseInt(localStorage.getItem("userId") || "1", 10);
  const itemsPerPage = 10;
  const categoryLabel = "Partners";

  // Fetch cities based on selected state
  const citiesResult = citiesQuery(
    selectedState ? parseInt(selectedState) : undefined
  );

  // Dispatch cities to Redux store
  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  // Handle errors for city fetching
  useEffect(() => {
    if (citiesResult.isError) {
      toast.error(
        `Failed to fetch cities: ${
          citiesResult.error?.message || "Unknown error"
        }`
      );
    }
  }, [citiesResult.isError, citiesResult.error]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(getUsersByType({ admin_user_id: user.id, emp_user_type: 3 }));
    }
    return () => {
      dispatch(clearUsers());
    };
  }, [isAuthenticated, user, statusUpdated, dispatch]);

  const filteredUsers =
    users?.filter((user) => {
      const matchesTextFilter = [
        user.name,
        user.mobile,
        user.email,
        user.city,
        user.state,
        user.gst_number,
        user.rera_number,
      ]
        .map((field) => field?.toLowerCase() || "")
        .some((field) => field.includes(filterValue.toLowerCase()));

      const userCreatedDate = user.created_date.split("T")[0];
      const matchesCreatedDate =
        (!createdDate || userCreatedDate >= createdDate) &&
        (!createdEndDate || userCreatedDate <= createdEndDate);

      const matchesStatus =
        selectedStatus === null || user.status === parseInt(selectedStatus);

      const matchesState =
        !selectedState ||
        user.state?.toLowerCase() ===
          states
            .find((s) => s.value.toString() === selectedState)
            ?.label.toLowerCase();
      const matchesCity =
        !selectedCity ||
        (citiesResult.data &&
          citiesResult.data
            .find((c) => c.value === selectedCity)
            ?.label.toLowerCase() === user.city?.toLowerCase());

      return (
        matchesTextFilter &&
        matchesCreatedDate &&
        matchesStatus &&
        matchesState &&
        matchesCity
      );
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
  };

  const handleAccept = async (userId: number) => {
    try {
      await dispatch(
        updateUserStatus({
          user_id: userId,
          status: 1,
          feedback: "",
          updated_by_user_id: createdUserId,
        })
      ).unwrap();
      setStatusUpdated(!statusUpdated);
      setSelectedUserId(null); // Deselect after action
    } catch (error) {
      console.error("Failed to accept user:", error);
      toast.error(error as string);
    }
  };

  const handleRejectSubmit = async () => {
    if (selectedUser && rejectReason) {
      try {
        await dispatch(
          updateUserStatus({
            user_id: selectedUser.id,
            status: 2,
            feedback: rejectReason,
            updated_by_user_id: createdUserId,
          })
        ).unwrap();
        setStatusUpdated(!statusUpdated);
        setIsRejectModalOpen(false);
        setRejectReason("");
        setSelectedUser(null);
        setSelectedUserId(null); // Deselect after action
      } catch (error) {
        console.error("Failed to reject user:", error);
        toast.error(error as string);
      }
    }
  };

  const handleFilter = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
  };

  const handleCreatedDateChange = (date: string | null) => {
    setCreatedDate(date);
    setCurrentPage(1);
  };

  const handleCreatedEndDateChange = (date: string | null) => {
    setCreatedEndDate(date);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string | null) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleStateChange = (value: string | null) => {
    setSelectedState(value);
    setSelectedCity(null);
    setCurrentPage(1);
  };

  const handleCityChange = (value: string | null) => {
    setSelectedCity(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterValue("");
    setCreatedDate(null);
    setCreatedEndDate(null);
    setSelectedStatus(null);
    setSelectedState(null);
    setSelectedCity(null);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Handle checkbox selection (single selection)
  const handleCheckboxChange = (userId: number) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId)); // Toggle or select new, deselect if same
  };

  // Handle bulk actions (adjusted for single selection)
  const handleBulkAccept = () => {
    if (selectedUserId === null) {
      toast.error("Please select a partner.");
      return;
    }
    handleAccept(selectedUserId);
  };

  const handleBulkReject = () => {
    if (selectedUserId === null) {
      toast.error("Please select a partner.");
      return;
    }
    const user = paginatedUsers.find((u) => u.id === selectedUserId);
    if (user) {
      setSelectedUser(user);
      setIsRejectModalOpen(true);
    }
  };

  const handleBulkViewProfile = () => {
    if (selectedUserId === null) {
      toast.error("Please select a partner.");
      return;
    }
    handleViewProfile(selectedUserId);
  };

  return (
    <div className="relative min-h-screen">
      <FilterBar
        showCreatedDateFilter={true}
        showCreatedEndDateFilter={true}
        showStatusFilter={true}
        showStateFilter={true}
        showCityFilter={true}
        statusFilterOptions={statusFilterOptions}
        onCreatedDateChange={handleCreatedDateChange}
        onCreatedEndDateChange={handleCreatedEndDateChange}
        onStatusChange={handleStatusChange}
        onStateChange={handleStateChange}
        onCityChange={handleCityChange}
        onClearFilters={handleClearFilters}
        createdDate={createdDate}
        createdEndDate={createdEndDate}
        selectedStatus={selectedStatus}
        selectedState={selectedState}
        selectedCity={selectedCity}
        className="mb-4"
      />
      <div className="mb-4 flex gap-2">
        <PageBreadcrumbList
          pageTitle={`${categoryLabel} Table`}
          pagePlacHolder="Filter partners by name, mobile, email, city, GST, or RERA"
          onFilter={handleFilter}
        />
        <Button
          variant="primary"
          onClick={handleBulkAccept}
          disabled={selectedUserId === null}
          className="px-4 py-1 h-10"
        >
          Accept
        </Button>
        <Button
          variant="primary"
          onClick={handleBulkReject}
          disabled={selectedUserId === null}
          className="px-4 py-1 h-10"
        >
          Reject
        </Button>
        <Button
          variant="primary"
          onClick={handleBulkViewProfile}
          disabled={selectedUserId === null}
          className="px-4 py-1 h-10"
        >
          View Profile
        </Button>
      </div>
      <div className="space-y-6">
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
                dispatch(
                  getUsersByType({ admin_user_id: user!.id, emp_user_type: 3 })
                )
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
                      Select
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[15%]"
                    >
                      Name
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
                      City
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
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {paginatedUsers.map((user) => {
                    const { text: statusText, className: statusClass } =
                      getStatusDisplay(user.status);
                    return (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[5%]">
                          <input
                            type="checkbox"
                            checked={selectedUserId === user.id}
                            onChange={() => handleCheckboxChange(user.id)}
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm whitespace-nowrap w-[15%]">
                          <div className="flex items-center gap-3">
                            <Link
                              to="/lead/Leads"
                              state={{
                                admin_user_id: createdUserId,
                                admin_user_type: 2,
                                assigned_user_type: user.user_type,
                                assigned_id: user.id,
                                lead_source_user_id: user.id,
                                name: user.name,
                              }}
                              className="block font-medium text-blue-600 underline hover:text-blue-800 transition-colors"
                            >
                              {user.name}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
                          {user.mobile}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
                          {user.city}
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
                      </TableRow>
                    );
                  })}
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
