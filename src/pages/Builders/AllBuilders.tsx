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
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumbList from "../../components/common/PageBreadCrumbLists";
import Pagination from "../../components/ui/pagination/Pagination";
import FilterBar from "../../components/common/FilterBar";
import { RootState, AppDispatch } from "../../store/store";
import { clearUsers, getUsersByType } from "../../store/slices/userslice";
import { getStatusDisplay } from "../../utils/statusdisplay";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import { setCityDetails } from "../../store/slices/propertyDetails";

export default function AllBuildersScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { users, loading, error } = useSelector((state: RootState) => state.user);
  const { states } = useSelector((state: RootState) => state.property);
  const { citiesQuery } = usePropertyQueries();

  const [filterValue, setFilterValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [createdEndDate, setCreatedEndDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const createdUserId = parseInt(localStorage.getItem("userId") || "1", 10);
  const itemsPerPage = 10;
  const categoryLabel = "Partners";

  // Fetch cities based on selected state
  const citiesResult = citiesQuery(selectedState ? parseInt(selectedState) : undefined);

  // Dispatch cities to Redux store
  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  // Handle errors for city fetching
  useEffect(() => {
    if (citiesResult.isError) {
      toast.error(`Failed to fetch cities: ${citiesResult.error?.message || "Unknown error"}`);
    }
  }, [citiesResult.isError, citiesResult.error]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(getUsersByType({
        admin_user_id: user.id,
      }));
    }
    return () => {
      dispatch(clearUsers());
    };
  }, [isAuthenticated, user, dispatch]);

  // Skip the first user in the filteredUsers array
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

    const userCreatedDate = user.created_date.split("T")[0];
    const matchesCreatedDate =
      (!createdDate || userCreatedDate >= createdDate) &&
      (!createdEndDate || userCreatedDate <= createdEndDate);

    const matchesStatus = selectedStatus === null || user.status === parseInt(selectedStatus);

    const matchesState = !selectedState || user.state?.toLowerCase() === states.find((s) => s.value.toString() === selectedState)?.label.toLowerCase();

    const matchesCity =
      !selectedCity ||
      (citiesResult.data &&
        citiesResult.data.find((c) => c.value.toString() === selectedCity)?.label.toLowerCase() ===
          user.city?.toLowerCase());

    return matchesTextFilter && matchesCreatedDate && matchesStatus && matchesState && matchesCity;
  }) || [];

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleViewProfile = (user: any) => {
    if (isAuthenticated && user?.id) {
      navigate(`/builder/${user.id}`, { state: { userDetails: user } }); // Pass user details in state
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

  return (
    <div className="relative min-h-screen">
      <PageBreadcrumbList
        pageTitle={`${categoryLabel} Table`}
        pagePlacHolder="Filter partners by name, mobile, email, city, GST, or RERA"
        onFilter={handleFilter}
      />
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
          City: {selectedCity ? citiesResult.data?.find((c) => c.value.toString() === selectedCity)?.label || "All" : "All"} | 
          Date: {createdDate || "Any"} to {createdEndDate || "Any"}
        </div>
      )}
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
                  dispatch(getUsersByType({ admin_user_id: user!.id }))
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
                              
                                {user.name}
                             
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[20%]">
                            {user.email}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
                            {user.mobile}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 whitespace-nowrap w-[10%]">
                            {`${user.city}, ${user.state}`}
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
                              onClick={() => handleViewProfile(user)} // Pass entire user object
                            >
                              View Details
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
    </div>
  );
}