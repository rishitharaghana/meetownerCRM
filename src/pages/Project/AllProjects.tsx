import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody,
    TableCell,
    TableHeader,
    TableRow, } from "../../components/ui/table";
import Button from "../../components/ui/button/Button";

import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

interface SizeEntry {
  buildupArea: string;
  carpetArea: string;
  floorPlan: string | null;
}

interface AroundPropertyEntry {
  place: string;
  distance: string;
}

// Define interface for project data
interface Project {
  id: number;
  unique_project_id: string;
  project_name: string;
  builder_name: string;
  property_type: string;
  property_sub_type: string;
  state: string;
  city: string;
  locality: string;
  sizes: SizeEntry[];
  around_property: AroundPropertyEntry[];
  created_date: string;
  created_time: string;
  updated_date: string;
  updated_time: string;
}

// Define interface for lead pull form data
interface LeadPullFormData {
  mobile: string;
  email: string;
  name: string;
  sourceType: string;
}

// Sample static data (10 example projects)
const sampleProjects: Project[] = [
  {
    id: 1,
    unique_project_id: "PROJ001",
    project_name: "Sunrise Villa",
    builder_name: "Acme Builders",
    property_type: "Residential",
    property_sub_type: "Apartment",
    state: "California",
    city: "Los Angeles",
    locality: "Downtown",
    sizes: [
      { buildupArea: "1200", carpetArea: "1000", floorPlan: "floorplan1.pdf" },
      { buildupArea: "1500", carpetArea: "1300", floorPlan: "floorplan2.pdf" },
    ],
    around_property: [
      { place: "Mall", distance: "2 km" },
      { place: "School", distance: "1 km" },
    ],
    created_date: "2025-04-10",
    created_time: "10:30:00",
    updated_date: "2025-04-12",
    updated_time: "14:45:00",
  },
  {
    id: 2,
    unique_project_id: "PROJ001",
    project_name: "Sunrise Villa",
    builder_name: "Acme Builders",
    property_type: "Residential",
    property_sub_type: "Apartment",
    state: "California",
    city: "Los Angeles",
    locality: "Downtown",
    sizes: [
      { buildupArea: "1200", carpetArea: "1000", floorPlan: "floorplan1.pdf" },
      { buildupArea: "1500", carpetArea: "1300", floorPlan: "floorplan2.pdf" },
    ],
    around_property: [
      { place: "Mall", distance: "2 km" },
      { place: "School", distance: "1 km" },
    ],
    created_date: "2025-04-10",
    created_time: "10:30:00",
    updated_date: "2025-04-12",
    updated_time: "14:45:00",
  },
  {
    id: 3,
    unique_project_id: "PROJ003",
    project_name: "City Heights",
    builder_name: "Skyline Developers",
    property_type: "Residential",
    property_sub_type: "Independent Villa",
    state: "New York",
    city: "New York City",
    locality: "Manhattan",
    sizes: [{ buildupArea: "3000", carpetArea: "2500", floorPlan: "floorplan4.pdf" }],
    around_property: [
      { place: "Park", distance: "1.5 km" },
      { place: "Hospital", distance: "3 km" },
    ],
    created_date: "2025-04-08",
    created_time: "12:00:00",
    updated_date: "2025-04-10",
    updated_time: "16:30:00",
  },
  {
    id: 4,
    unique_project_id: "PROJ004",
    project_name: "Lakeview Towers",
    builder_name: "Lakeside Realty",
    property_type: "Residential",
    property_sub_type: "Condo",
    state: "Florida",
    city: "Miami",
    locality: "South Beach",
    sizes: [
      { buildupArea: "1400", carpetArea: "1200", floorPlan: "floorplan5.pdf" },
      { buildupArea: "1600", carpetArea: "1400", floorPlan: "floorplan6.pdf" },
    ],
    around_property: [{ place: "Beach", distance: "0.2 km" }],
    created_date: "2025-04-07",
    created_time: "14:20:00",
    updated_date: "2025-04-09",
    updated_time: "10:10:00",
  },
  {
    id: 5,
    unique_project_id: "PROJ005",
    project_name: "Skyline Residency",
    builder_name: "Horizon Builders",
    property_type: "Commercial",
    property_sub_type: "Retail Shop",
    state: "Illinois",
    city: "Chicago",
    locality: "Loop",
    sizes: [{ buildupArea: "1800", carpetArea: "1600", floorPlan: "floorplan7.pdf" }],
    around_property: [
      { place: "Train Station", distance: "0.8 km" },
      { place: "Shopping Center", distance: "1 km" },
    ],
    created_date: "2025-04-06",
    created_time: "16:45:00",
    updated_date: "2025-04-08",
    updated_time: "12:25:00",
  },
  {
    id: 6,
    unique_project_id: "PROJ006",
    project_name: "Royal Gardens",
    builder_name: "Greenfield Developers",
    property_type: "Residential",
    property_sub_type: "Plot",
    state: "Georgia",
    city: "Atlanta",
    locality: "Buckhead",
    sizes: [{ buildupArea: "N/A", carpetArea: "N/A", floorPlan: null }],
    around_property: [{ place: "Golf Course", distance: "2.5 km" }],
    created_date: "2025-04-05",
    created_time: "11:30:00",
    updated_date: "2025-04-07",
    updated_time: "15:50:00",
  },
  {
    id: 7,
    unique_project_id: "PROJ007",
    project_name: "Urban Nest",
    builder_name: "Cityscape Builders",
    property_type: "Residential",
    property_sub_type: "Apartment",
    state: "Washington",
    city: "Seattle",
    locality: "Capitol Hill",
    sizes: [{ buildupArea: "1100", carpetArea: "900", floorPlan: "floorplan8.pdf" }],
    around_property: [
      { place: "University", distance: "1.2 km" },
      { place: "Cafe", distance: "0.3 km" },
    ],
    created_date: "2025-04-04",
    created_time: "13:15:00",
    updated_date: "2025-04-06",
    updated_time: "09:40:00",
  },
  {
    id: 8,
    unique_project_id: "PROJ008",
    project_name: "Paradise Homes",
    builder_name: "Paradise Realty",
    property_type: "Residential",
    property_sub_type: "Independent House",
    state: "Arizona",
    city: "Phoenix",
    locality: "Scottsdale",
    sizes: [{ buildupArea: "2200", carpetArea: "2000", floorPlan: "floorplan9.pdf" }],
    around_property: [{ place: "Resort", distance: "4 km" }],
    created_date: "2025-04-03",
    created_time: "15:00:00",
    updated_date: "2025-04-05",
    updated_time: "11:55:00",
  },
  {
    id: 9,
    unique_project_id: "PROJ009",
    project_name: "Blue Horizon",
    builder_name: "Oceanic Builders",
    property_type: "Commercial",
    property_sub_type: "Show Room",
    state: "Oregon",
    city: "Portland",
    locality: "Pearl District",
    sizes: [{ buildupArea: "2500", carpetArea: "2300", floorPlan: "floorplan10.pdf" }],
    around_property: [
      { place: "Art Gallery", distance: "0.6 km" },
      { place: "Riverfront", distance: "1 km" },
    ],
    created_date: "2025-04-02",
    created_time: "10:45:00",
    updated_date: "2025-04-04",
    updated_time: "14:15:00",
  },
  {
    id: 10,
    unique_project_id: "PROJ010",
    project_name: "Golden Residency",
    builder_name: "Golden Properties",
    property_type: "Residential",
    property_sub_type: "Apartment",
    state: "Colorado",
    city: "Denver",
    locality: "LoDo",
    sizes: [
      { buildupArea: "1300", carpetArea: "1100", floorPlan: "floorplan11.pdf" },
      { buildupArea: "1700", carpetArea: "1500", floorPlan: "floorplan12.pdf" },
    ],
    around_property: [
      { place: "Stadium", distance: "2 km" },
      { place: "Brewery", distance: "0.7 km" },
    ],
    created_date: "2025-04-01",
    created_time: "12:30:00",
    updated_date: "2025-04-03",
    updated_time: "16:20:00",
  },
];

const statusMap: { [key: number]: string } = {
  0: "Review",
  1: "Approved",
  2: "Rejected",
  3: "Deleted",
};

const AllProjects: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [localPage, setLocalPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [initialSearch, setInitialSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [leadPullFormData, setLeadPullFormData] = useState<LeadPullFormData>({
    mobile: "",
    email: "",
    name: "",
    sourceType: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<LeadPullFormData>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useParams<{ status: string }>();

  // Pagination constants
  const itemsPerPage = 5;
  const totalCount = sampleProjects.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Filter projects based on search query
  const filteredProjects = sampleProjects.filter((project) => {
    if (!searchQuery) return true;
    const searchValue = searchQuery.toLowerCase();
    return (
      project.unique_project_id.toLowerCase().includes(searchValue) ||
      project.project_name.toLowerCase().includes(searchValue) ||
      project.builder_name.toLowerCase().includes(searchValue) ||
      project.property_type.toLowerCase().includes(searchValue) ||
      project.property_sub_type.toLowerCase().includes(searchValue) ||
      project.state.toLowerCase().includes(searchValue) ||
      project.city.toLowerCase().includes(searchValue) ||
      project.locality.toLowerCase().includes(searchValue)
    );
  });

  // Paginate filtered projects
  const currentProjects = filteredProjects.slice(
    (localPage - 1) * itemsPerPage,
    localPage * itemsPerPage
  );

  useEffect(() => {
    const savedSearch = localStorage.getItem("searchQuery") || "";
    setInitialSearch(savedSearch);
    handleSearch(savedSearch);
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const getPageTitle = () => {
    return `All Projects ${statusMap[parseInt(status || "0", 10)] || "Unknown"}`;
  };

  const formatDateTime = (date: string | undefined, time: string | undefined): string => {
    if (!date || !time) return "N/A";

    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const dateTime = new Date(year, month - 1, day, hours, minutes, seconds);

    const formattedDay = String(dateTime.getDate()).padStart(2, "0");
    const formattedMonth = String(dateTime.getMonth() + 1).padStart(2, "0");
    const formattedYear = dateTime.getFullYear();

    let formattedHours = dateTime.getHours();
    const formattedMinutes = String(dateTime.getMinutes()).padStart(2, "0");
    const ampm = formattedHours >= 12 ? "PM" : "AM";
    formattedHours = formattedHours % 12 || 12;

    const formattedTime = `${String(formattedHours).padStart(2, "0")}:${formattedMinutes} ${ampm}`;
    return `${formattedDay}-${formattedMonth}-${formattedYear} ${formattedTime}`;
  };

  useEffect(() => {
    localStorage.removeItem("searchQuery");
    setSearchQuery("");
    setInitialSearch("");
    setLocalPage(1);
  }, [location.pathname]);

  useEffect(() => {
    setLocalPage(1);
  }, [searchQuery]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = (project: Project) => {
    navigate("/edit-project", { state: { project } });
    setDropdownOpen(null);
  };

  const handleDelete = (unique_project_id: string) => {
    console.log(`Delete project: ${unique_project_id}`);
    setDropdownOpen(null);
  };

  const handleApprove = (unique_project_id: string) => {
    console.log(`Approve/Reject project: ${unique_project_id}`);
    setDropdownOpen(null);
  };

  const handleLead = (project: Project) => {
    setIsModalOpen(true);
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

  const shouldShowActions = () => {
    return parseInt(status || "0", 10) === 0 || parseInt(status || "0", 10) === 1;
  };

  // Modal Form Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLeadPullFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateLeadPullForm = (): boolean => {
    const newErrors: Partial<LeadPullFormData> = {};

    if (!leadPullFormData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(leadPullFormData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!leadPullFormData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadPullFormData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!leadPullFormData.name) {
      newErrors.name = "Name is required";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLeadPullSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateLeadPullForm()) {
      console.log("Lead Pull Form Data:", leadPullFormData);
      alert("Lead pull submitted successfully!");
      setIsModalOpen(false);
      setLeadPullFormData({ mobile: "", email: "", name: "", sourceType: "" });
      setFormErrors({});
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setLeadPullFormData({ mobile: "", email: "", name: "", sourceType: "" });
    setFormErrors({});
  };

  return (
    <div className="relative min-h-screen">
      <PageMeta title={`All Projects ${getPageTitle()}`} />
      <PageBreadcrumb
        pageTitle="All Projects"
        pagePlacHolder="Search by ID, Project Name, Builder, Type, Sub Type, State, City, or Locality"
        onFilter={handleSearch}
        inputRef={searchInputRef}
      />
      {filteredProjects.length === 0 ? (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No Projects Found</h2>
        </div>
      ) : (
        <>
          <h2 className="p-2">Search result - {filteredProjects.length}</h2>
          <div className="space-y-6">
            <ComponentCard title={getPageTitle()}>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Sl. No</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Project Name</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Builder Name</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Property Type</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Property Sub Type</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Location</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          {parseInt(status || "0", 10) === 0 ? "Created Time & Date" : "Updated Time & Date"}
                        </TableCell>
                        {shouldShowActions() && (
                          <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {currentProjects.map((project, index) => (
                        <TableRow key={project.id}>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{project.unique_project_id || project.id}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{(localPage - 1) * itemsPerPage + index + 1}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{project.project_name || "N/A"}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{project.builder_name || "N/A"}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{project.property_type || "N/A"}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{project.property_sub_type || "N/A"}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                            <div
                              onMouseEnter={() => setHoveredProjectId(project.id.toString())}
                              onMouseLeave={() => setHoveredProjectId(null)}
                              className="inline-block"
                            >
                              <span style={{ color: "#1D3A76", fontWeight: "bold" }}>
                                {project.locality}
                              </span>
                              {hoveredProjectId === project.id.toString() && (
                                <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <p><strong>State:</strong> {project.state || "N/A"}</p>
                                    <p><strong>City:</strong> {project.city || "N/A"}</p>
                                    <p><strong>Locality:</strong> {project.locality || "N/A"}</p>
                                    <p><strong>Sizes:</strong> {project.sizes.map(s => `${s.buildupArea} sq.ft`).join(", ") || "N/A"}</p>
                                    <p><strong>Around Property:</strong> {project.around_property.map(ap => `${ap.place} (${ap.distance})`).join(", ") || "N/A"}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                            {parseInt(status || "0", 10) === 0
                              ? formatDateTime(project.created_date, project.created_time)
                              : formatDateTime(project.updated_date, project.updated_time)}
                          </TableCell>
                          {shouldShowActions() && (
                            <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDropdownOpen(dropdownOpen === project.id.toString() ? null : project.id.toString())}
                              >
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </Button>
                              {dropdownOpen === project.id.toString() && (
                                <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                                  <button onClick={() => handleEdit(project)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Edit</button>
                                  <button onClick={() => handleDelete(project.unique_project_id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Delete</button>
                                  <button onClick={() => handleApprove(project.unique_project_id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {parseInt(status || "0", 10) === 0 ? "Approve" : "Reject"}
                                  </button>
                                  {parseInt(status || "0", 10) === 1 && (
                                    <button onClick={() => handleLead(project)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Lead Pull</button>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {filteredProjects.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 py-2 gap-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {(localPage - 1) * itemsPerPage + 1} to {Math.min(localPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} entries
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
                    {getPaginationItems().map((page, index) => {
                      const uniqueKey = `${page}-${index}`;
                      return page === "..." ? (
                        <span key={uniqueKey} className="px-3 py-1 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={uniqueKey}
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(page as number)}
                          isActive={page === localPage}
                        >
                          {page}
                        </Button>
                      );
                    })}
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
        </>
      )}

      {/* Lead Pull Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-none flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Enter Lead Pull Details</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleLeadPullSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={leadPullFormData.name}
                  onChange={handleInputChange}
                  className="dark:bg-dark-900"
                  placeholder="Enter user name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={leadPullFormData.mobile}
                  onChange={handleInputChange}
                  className="dark:bg-dark-900"
                  placeholder="Enter 10-digit mobile number"
                />
                {formErrors.mobile && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.mobile}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={leadPullFormData.email}
                  onChange={handleInputChange}
                  className="dark:bg-dark-900"
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="sourceType">Lead Source</Label>
                <Input
                  type="text"
                  id="sourceType"
                  name="sourceType"
                  value={leadPullFormData.sourceType}
                  onChange={handleInputChange}
                  className="dark:bg-dark-900"
                  placeholder="Enter Lead source"
                />
                {formErrors.sourceType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.sourceType}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1D3A76] text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjects;