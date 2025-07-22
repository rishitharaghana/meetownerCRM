import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/button/Button";
import { InputWithRef } from "../../components/form/input/InputField";
import { AppDispatch, RootState } from "../../store/store";
import { fetchUpcomingProjects } from "../../store/slices/projectSlice";
import { Project } from "../../types/ProjectModel";
import toast from "react-hot-toast";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import { setCityDetails } from "../../store/slices/propertyDetails";
import FilterBar from "../../components/common/FilterBar";
const BUILDER_USER_TYPE = 2;
const UpComingProjects: React.FC = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
    {}
  );
  const [createdDate, setCreatedDate] = useState<string | null>(null);
  const [createdEndDate, setCreatedEndDate] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { upcomingProjects, loading, error } = useSelector(
    (state: RootState) => state.projects
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { citiesQuery } = usePropertyQueries();
  const itemsPerPage = 4;
  const citiesResult = citiesQuery(
    selectedState ? parseInt(selectedState) : undefined
  );
  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);
  useEffect(() => {
    if (citiesResult.isError) {
      toast.error(
        `Failed to fetch cities: ${
          citiesResult.error?.message || "Unknown error"
        }`
      );
    }
  }, [citiesResult.isError, citiesResult.error]);
  const projectParams = useMemo(() => {
    if (!isAuthenticated || !user?.id || !user?.user_type) {
      return null;
    }
    const baseParams: any = {};
    if (user.user_type === BUILDER_USER_TYPE) {
      baseParams.admin_user_type = user.user_type;
      baseParams.admin_user_id = user.id;
    } else if (user.created_user_id) {
      baseParams.admin_user_type = BUILDER_USER_TYPE;
      baseParams.admin_user_id = user.created_user_id;
    }
    return Object.keys(baseParams).length > 0 ? baseParams : null;
  }, [isAuthenticated, user]);
  useEffect(() => {
    if (projectParams) {
      dispatch(fetchUpcomingProjects(projectParams))
        .unwrap()
        .catch((err) => {
          toast.error(
            `Failed to fetch upcoming projects: ${
              err.message || "Unknown error"
            }`
          );
        });
    } else if (isAuthenticated && user) {
      toast.error("Invalid user data for fetching projects");
      console.warn("Invalid user data:", {
        id: user.id,
        user_type: user.user_type,
        created_user_id: user.created_user_id,
      });
    }
  }, [projectParams, dispatch, isAuthenticated, user]);
  const filteredProjects = useMemo(() => {
    return upcomingProjects.filter((project: Project) => {
      const matchesSearch =
        project.project_name.toLowerCase().includes(search.toLowerCase()) ||
        project.locality?.toLowerCase().includes(search.toLowerCase()) ||
        project.city?.toLowerCase().includes(search.toLowerCase()) ||
        project.state?.toLowerCase().includes(search.toLowerCase());
      const matchesCity =
        !selectedCity ||
        (citiesResult.data &&
          citiesResult.data
            .find((c) => c.label.toString() === selectedCity)
            ?.label.toLowerCase() === project.city?.toLowerCase());
      let matchesDate = true;
      if (createdDate || createdEndDate) {
        if (!project.created_date) {
          matchesDate = false;
        } else {
          try {
            const projectDate = project.created_date.split("T")[0];
            matchesDate =
              (!createdDate || projectDate >= createdDate) &&
              (!createdEndDate || projectDate <= createdEndDate);
          } catch {
            matchesDate = false;
          }
        }
      }
      return matchesSearch && matchesCity && matchesDate;
    });
  }, [
    upcomingProjects,
    search,
    selectedCity,
    createdDate,
    createdEndDate,
    citiesResult.data,
  ]);
  const toggleExpand = (id: number) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
  const goToPage = (page: number) => setCurrentPage(page);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const getPaginationItems = () => {
    const pages: (number | string)[] = [];
    const totalVisiblePages = 5;
    if (totalPages <= totalVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      if (currentPage <= 3) {
        start = 2;
        end = 5;
      }
      if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages - 1;
      }
      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  const handleClearFilters = useCallback(() => {
    setSearch("");
    setCreatedDate(null);
    setCreatedEndDate(null);
    setSelectedState(null);
    setSelectedCity(null);
    setCurrentPage(1);
    if (searchRef.current) searchRef.current.value = "";
  }, []);
  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 text-center">
        Please log in to view ongoing projects.
      </div>
    );
  }
  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <InputWithRef
            ref={searchRef}
            placeholder="Search Projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <FilterBar
            showCreatedDateFilter={true}
            showCreatedEndDateFilter={true}
            showStateFilter={true}
            showCityFilter={true}
            onCreatedDateChange={setCreatedDate}
            onCreatedEndDateChange={setCreatedEndDate}
            onStateChange={setSelectedState}
            onCityChange={setSelectedCity}
            onClearFilters={handleClearFilters}
            createdDate={createdDate}
            createdEndDate={createdEndDate}
            selectedState={selectedState}
            selectedCity={selectedCity}
            className="w-full sm:w-auto flex-1"
          />
        </div>
      </div>
      {}
      {(search ||
        selectedState ||
        selectedCity ||
        createdDate ||
        createdEndDate) && (
        <div className="text-sm text-gray-500 mb-4">
          Filters: Search: {search || "None"} | State: {selectedState || "All"}{" "}
          | City:{" "}
          {selectedCity
            ? citiesResult.data?.find(
                (c) => c.label.toString() === selectedCity
              )?.label || "All"
            : "All"}{" "}
          | Date: {createdDate || "Any"} to {createdEndDate || "Any"}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedProjects.map((project: Project) => {
          const isExpanded = expandedCards[project.property_id];
          const initialAmenities = project.around_this.slice(0, 4);
          const hiddenAmenities = project.around_this.slice(4);
          const defaultImage = " "; // Temporary placeholder


          return (
            <div
              key={project.property_id}
              className="bg-white border border-blue-200 rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.01] w-full max-w-[500px] mx-auto"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={project.property_image || defaultImage} 
                  alt={project.project_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage; 
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {project.project_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {project.locality}, {project.city}, {project.state}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {project.construction_status}
                  </span>
                </div>
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p>
                    <strong>Builder:</strong> {project.builder_name}
                  </p>
                  <p>
                    <strong>Type:</strong> {project.property_type} (
                    {project.property_subtype})
                  </p>
                  <p>
                    <strong>Possession:</strong>{" "}
                    {project.possession_end_date
                      ? new Date(
                          project.possession_end_date
                        ).toLocaleDateString()
                      : "Ready to Move"}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {project.created_date
                      ? new Date(project.created_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="mb-5">
                  <p className="text-sm font-medium text-gray-700">Nearby:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {initialAmenities.map((item) => (
                      <span
                        key={item.title}
                        className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {item.title} ({item.distance} km)
                      </span>
                    ))}
                    {hiddenAmenities.length > 0 && !isExpanded && (
                      <button
                        onClick={() => toggleExpand(project.property_id)}
                        className="text-xs text-blue-600 underline"
                      >
                        +{hiddenAmenities.length} more
                      </button>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hiddenAmenities.map((item) => (
                        <span
                          key={item.title}
                          className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {item.title} ({item.distance} km)
                        </span>
                      ))}
                      <button
                        onClick={() => toggleExpand(project.property_id)}
                        className="text-xs text-blue-600 underline w-full text-left"
                      >
                        Show less
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-end items-center mt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/projects/details/${project.property_id}`, {
                        state: {
                          property_id: project.property_id,
                          posted_by: project.posted_by,
                          user_id: project.user_id,
                        },
                      })
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {totalItems > itemsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              variant={currentPage === 1 ? "outline" : "primary"}
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {getPaginationItems().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page as number)}
                  className={
                    page === currentPage
                      ? ""
                      : ""
                  }
                >
                  {page}
                </Button>
              )
            )}
            <Button
              variant={currentPage === totalPages ? "outline" : "primary"}
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default UpComingProjects;
