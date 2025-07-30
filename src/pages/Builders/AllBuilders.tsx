// src/pages/AllBuildersScreen.tsx
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
import Pagination from "../../components/ui/pagination/Pagination";
import FilterBar from "../../components/common/FilterBar";
import { RootState, AppDispatch } from "../../store/store";
import { User } from "../../types/UserModel";
import {
  clearUsers,
  getUsersByType,
  deleteUser,
} from "../../store/slices/userslice";
import { getStatusDisplay } from "../../utils/statusdisplay";
import ConfirmDeleteUserModal from "../../components/common/ConfirmDeleteUserModal";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import { setCityDetails } from "../../store/slices/propertyDetails";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export default function AllBuildersScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { users, loading, error } = useSelector((state: RootState) => state.user);
  const { states } = useSelector((state: RootState) => state.property);
  const { citiesQuery } = usePropertyQueries();

  const [filterValue, setFilterValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statusUpdated, setStatusUpdated] = useState<boolean>(false);
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [createdEndDate, setCreatedEndDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const createdUserId = parseInt(localStorage.getItem("userId") || user?.id?.toString() || "1", 10);
  const itemsPerPage = 10;
  const categoryLabel = "Partners";

  const citiesResult = citiesQuery(selectedState ? parseInt(selectedState) : undefined);

  // Map state options
  const stateOptions =
    states?.map((state: any) => ({
      value: state.value.toString(),
      text: state.label,
    })) || [];

  // Map city options
  const cityOptions =
    citiesResult?.data?.map((city: any) => ({
      value: city.value,
      text: city.label,
    })) || [];

  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  useEffect(() => {
    if (citiesResult.isError) {
      toast.error(`Failed to fetch cities: ${citiesResult.error?.message || "Unknown error"}`);
    }
  }, [citiesResult.isError, citiesResult.error]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(getUsersByType({ admin_user_id: user.id }));
    }
    return () => {
      dispatch(clearUsers());
    };
  }, [isAuthenticated, user, statusUpdated, dispatch]);

  const filteredUsers = users?.filter((user, index) => {
    if (index === 0) return false; // Skip the first user
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

    const userCreatedDate = formatDate(user.created_date);
    const matchesCreatedDate =
      (!createdDate || userCreatedDate >= createdDate) &&
      (!createdEndDate || userCreatedDate <= createdEndDate);

    const matchesStatus = selectedStatus === null || user.status === parseInt(selectedStatus);

    const matchesState =
      !selectedState ||
      user.state?.toLowerCase() ===
        states.find((s) => s.value.toString() === selectedState)?.label.toLowerCase();

    const matchesCity =
      !selectedCity ||
      (citiesResult.data &&
        user.city &&
        citiesResult.data.find((c) => c.value === selectedCity)?.label.toLowerCase() ===
          user.city.toLowerCase());

    return matchesTextFilter && matchesCreatedDate && matchesStatus && matchesState && matchesCity;
  }) || [];

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleViewProfile = (id: number) => {
    if (isAuthenticated && user?.id) {
      navigate(`/builder/${id}`, { state: { userDetails: paginatedUsers.find((u) => u.id === id) } });
    }
  };

  const handleEdit = (user: User) => {
    if (isAuthenticated && user?.id) {
      navigate(`/builder/edit/${user.id}`, { state: { userDetails: user } });
    }
  };

  const handleBulkEdit = () => {
    if (selectedUserId === null) {
      toast.error("Please select a partner.");
      return;
    }
    const user = paginatedUsers.find((u) => u.id === selectedUserId);
    if (user) {
      handleEdit(user);
    }
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser && user?.user_type) {
      try {
        await dispatch(
          deleteUser({
            id: selectedUser.id,
            created_user_id: createdUserId,
            created_user_type: user.user_type,
          })
        ).unwrap();
        setStatusUpdated(!statusUpdated);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        setSelectedUserId(null);
        toast.success("Partner deleted successfully");
      } catch (error) {
        console.error("Failed to delete partner:", error);
        toast.error((error as any).message || "Failed to delete partner");
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleBulkViewProfile = () => {
    if (selectedUserId === null) {
      toast.error("Please select a partner.");
      return;
    }
    handleViewProfile(selectedUserId);
  };

  const handleBulkDelete = () => {
    if (selectedUserId === null) {
      toast.error("Please select a partner.");
      return;
    }
    const user = paginatedUsers.find((u) => u.id === selectedUserId);
    if (user) {
      handleDelete(user);
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

  const handleCheckboxChange = (userId: number) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  return (
    <div className="relative min-h-screen">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Builders", link: "/builders" },
            { label: "All Builders" },
          ]}
        />
      </div>
      <PageMeta title="All Builders - Partner Management" />
      <FilterBar
        showCreatedDateFilter={true}
        showCreatedEndDateFilter={true}
        showStatusFilter={true}
        showStateFilter={true}
        showCityFilter={true}
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
      {(filterValue || selectedStatus || selectedState || selectedCity || createdDate || createdEndDate) && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 px-4">
          Filters: Search: {filterValue || "None"} | 
          State: {selectedState ? states.find((s) => s.value.toString() === selectedState)?.label || "All" : "All"} | 
          City: {selectedCity ? citiesResult.data?.find((c) => c.value === selectedCity)?.label || "All" : "All"} | 
          Date: {createdDate || "Any"} to {createdEndDate || "Any"}
        </div>
      )}
      <div className="mb-2 flex gap-2">
        <PageBreadcrumbList
          pageTitle={`${categoryLabel} Table`}
          pagePlacHolder="Filter partners by name, mobile, email, city, GST, or RERA"
          onFilter={handleFilter}
        />
        <Button
          variant="primary"
          onClick={handleBulkViewProfile}
          disabled={selectedUserId === null}
          className="px-4 py-1 h-10"
        >
          View Profile
        </Button>
        <Button
          variant="primary"
          onClick={handleBulkEdit}
          disabled={selectedUserId === null}
          className="px-4 py-1 h-10"
        >
          Edit
        </Button>
        <Button
          variant="primary"
          onClick={handleBulkDelete}
          disabled={selectedUserId === null}
          className="px-4 py-1 h-10"
        >
          Delete
        </Button>
      </div>
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table className="w-full table-layout-fixed overflow-x-auto">
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-blue-900">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[10%]"
                  >
                    Select
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[15%]"
                  >
                    Partner
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-white text-start text-theme-xs whitespace-nowrap w-[15%]"
                  >
                    Mobile
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
                    Since
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
                  const { text: statusText, className: statusClass } = getStatusDisplay(user.status);
                  return (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
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
                            to={`/builder/${user.id}`}
                            state={{
                              userDetails: user,
                            }}
                            className="block font-medium text-blue-600 underline hover:text-blue-800 transition-colors"
                          >
                            {user.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[15%]">
                        {user.mobile}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
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
      <ConfirmDeleteUserModal
        isOpen={isDeleteModalOpen}
        userName={selectedUser?.name || ""}
        description="Are you sure you want to delete?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}