import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";

// Define the type for the lead pull form data
interface LeadPullFormData {
  mobile: string;
  email: string;
  name: string;
  sourceType: string;
}

// Define the type for listing data
interface Listing {
  id: number;
  unique_property_id: string;
  property_name: string;
  sub_type: string;
  user: {
    user_type: number;
    name: string;
    mobile: string;
    email?: string;
  };
  created_date: string;
  created_time: string;
  updated_date: string;
  updated_time: string;
  location_id: string;
  lead_source?: string;
  status: number;
}

// Updated status map based on sidebar subItems
const statusMap: { [key: number]: string } = {
  0: "New",
  1: "Today",
  2: "Site Visit Done",
  3: "Won",
  4: "Loss",
  5: "Total",
};

// Sidebar subItems for mapping lead_in and status to name
const sidebarSubItems = [
  { name: "New Leads", lead_in: "new", status: 0 },
  { name: "Today Leads", lead_in: "Today", status: 1 },
  { name: "Site Visit Done", lead_in: "site", status: 2 },
  { name: "Won Leads", lead_in: "won", status: 3 },
  { name: "Loss Leads", lead_in: "loss", status: 4 },
  { name: "Total Leads", lead_in: "total", status: 5 },
];

const userTypeMap: { [key: string]: string } = {
  "1": "Admin",
  "2": "User",
  "3": "Builder",
  "4": "Agent",
  "5": "Owner",
  "6": "Channel Partner",
  "7": "Manager",
  "8": "Telecaller",
  "9": "Marketing Executive",
  "10": "Customer Support",
  "11": "Customer Service",
};

const userTypeReverseMap: { [key: string]: string } = Object.keys(userTypeMap).reduce(
  (acc, key) => {
    acc[userTypeMap[key].toLowerCase()] = key;
    return acc;
  },
  {} as { [key: string]: string }
);

const userTypeOptions = [
  { value: "", label: "All" },
  { value: "3", label: "Builder" },
  { value: "6", label: "Channel Partner" },
];

// Updated sample data with more status 5 entries
const sampleListings: Listing[] = [
  {
    id: 1,
    unique_property_id: "PROP001",
    property_name: "Sunrise Villa",
    sub_type: "Apartment",
    user: { user_type: 5, name: "John Doe", mobile: "9876543210", email: "john.doe@example.com" },
    created_date: "2025-04-10",
    created_time: "10:30:00",
    updated_date: "2025-04-12",
    updated_time: "14:45:00",
    location_id: "Downtown",
    lead_source: "Website",
    status: 0, // New
  },
  {
    id: 2,
    unique_property_id: "PROP002",
    property_name: "Green Meadows",
    sub_type: "Villa",
    user: { user_type: 4, name: "Jane Smith", mobile: "8765432109", email: "jane.smith@example.com" },
    created_date: "2025-04-09",
    created_time: "09:15:00",
    updated_date: "2025-04-11",
    updated_time: "11:20:00",
    location_id: "Suburbs",
    lead_source: "Referral",
    status: 1, // Today
  },
  {
    id: 3,
    unique_property_id: "PROP003",
    property_name: "Green Meadows",
    sub_type: "Villa",
    user: { user_type: 4, name: "Jane Smith", mobile: "8765432109", email: "jane.smith@example.com" },
    created_date: "2025-04-09",
    created_time: "09:15:00",
    updated_date: "2025-04-11",
    updated_time: "11:20:00",
    location_id: "Suburbs",
    lead_source: "Referral",
    status: 1, // Today
  },
  
  {
    id: 4,
    unique_property_id: "PROP004",
    property_name: "Lakeview Towers",
    sub_type: "Condo",
    user: { user_type: 6, name: "Mike Johnson", mobile: "6543210987", email: "mike.j@example.com" },
    created_date: "2025-04-07",
    created_time: "14:20:00",
    updated_date: "2025-04-09",
    updated_time: "10:10:00",
    location_id: "Lakeside",
    lead_source: "Social Media",
    status: 3, // Won
  },
  {
    id: 5,
    unique_property_id: "PROP005",
    property_name: "Skyline Residency",
    sub_type: "Apartment",
    user: { user_type: 1, name: "Admin User", mobile: "5432109876", email: "admin@example.com" },
    created_date: "2025-04-06",
    created_time: "16:45:00",
    updated_date: "2025-04-08",
    updated_time: "12:25:00",
    location_id: "Uptown",
    lead_source: "Direct",
    status: 4, // Loss
  },
  {
    id: 6,
    unique_property_id: "PROP006",
    property_name: "Royal Gardens",
    sub_type: "Villa",
    user: { user_type: 5, name: "Sarah Wilson", mobile: "4321098765", email: "sarah.w@example.com" },
    created_date: "2025-04-05",
    created_time: "11:30:00",
    updated_date: "2025-04-07",
    updated_time: "15:50:00",
    location_id: "Greenwich",
    lead_source: "Website",
    status: 5, // Total
  },
  {
    id: 7,
    unique_property_id: "PROP007",
    property_name: "Urban Nest",
    sub_type: "Apartment",
    user: { user_type: 4, name: "Tom Brown", mobile: "3210987654", email: "tom.b@example.com" },
    created_date: "2025-04-04",
    created_time: "13:15:00",
    updated_date: "2025-04-06",
    updated_time: "09:40:00",
    location_id: "Midtown",
    lead_source: "Referral",
    status: 0, // New
  },
  {
    id: 8,
    unique_property_id: "PROP008",
    property_name: "Paradise Homes",
    sub_type: "Condo",
    user: { user_type: 3, name: "Elite Builders", mobile: "2109876543", email: "elite@example.com" },
    created_date: "2025-04-03",
    created_time: "15:00:00",
    updated_date: "2025-04-05",
    updated_time: "11:55:00",
    location_id: "Westside",
    lead_source: "Advertisement",
    status: 5, // Total (Added for testing)
  },
  {
    id: 9,
    unique_property_id: "PROP009",
    property_name: "Blue Horizon",
    sub_type: "Penthouse",
    user: { user_type: 6, name: "Lisa Davis", mobile: "1098765432", email: "lisa.d@example.com" },
    created_date: "2025-04-02",
    created_time: "10:45:00",
    updated_date: "2025-04-04",
    updated_time: "14:15:00",
    location_id: "Eastside",
    lead_source: "Social Media",
    status: 5, // Total (Added for testing)
  },
  {
    id: 10,
    unique_property_id: "PROP010",
    property_name: "Golden Residency",
    sub_type: "Apartment",
    user: { user_type: 2, name: "Regular User", mobile: "0987654321", email: "regular@example.com" },
    created_date: "2025-04-01",
    created_time: "12:30:00",
    updated_date: "2025-04-03",
    updated_time: "16:20:00",
    location_id: "Northside",
    lead_source: "Direct",
    status: 3, // Won
  },
];

// Timeline Event type
interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

const LeadsType: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [localPage, setLocalPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [initialSearch, setInitialSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTimelinePopupOpen, setIsTimelinePopupOpen] = useState<boolean>(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [leadPullFormData, setLeadPullFormData] = useState<LeadPullFormData>({
    mobile: "",
    email: "",
    name: "",
    sourceType: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<LeadPullFormData>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timelinePopupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { lead_in, status } = useParams<{ lead_in: string; status: string }>();
  const [selectedUserType, setSelectedUserType] = useState<string>("");

  // Pagination constants
  const itemsPerPage = 5;
  const totalCount = sampleListings.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Find the sidebar item matching lead_in and status
  const sidebarItem = sidebarSubItems.find(
    (item) => item.lead_in.toLowerCase() === lead_in?.toLowerCase() && item.status === parseInt(status || "0", 10)
  );

  // Filter listings based on search query, status, and user type
  const filteredListings = sampleListings.filter((item) => {
    // Apply status filter first
    if (parseInt(status || "0", 10) !== 5 && item.status !== parseInt(status || "0", 10)) {
      return false;
    }

    // Apply user type filter only for Total Leads (status 5)
    if (parseInt(status || "0", 10) === 5 && selectedUserType && item.user.user_type.toString() !== selectedUserType) {
      return false;
    }

    // Apply search query filter
    if (!searchQuery) return true;
    const userTypeKey = userTypeReverseMap[searchQuery.toLowerCase()];
    const searchValue = userTypeKey || searchQuery.toLowerCase();
    return (
      item.unique_property_id.toLowerCase().includes(searchValue) ||
      item.property_name.toLowerCase().includes(searchValue) ||
      item.sub_type.toLowerCase().includes(searchValue) ||
      userTypeMap[item.user.user_type.toString()].toLowerCase().includes(searchValue) ||
      item.user.name.toLowerCase().includes(searchValue) ||
      item.user.mobile.includes(searchValue) ||
      (item.user.email?.toLowerCase().includes(searchValue) || false) ||
      (item.lead_source?.toLowerCase().includes(searchValue) || false)
    );
  });

  // Paginate filtered listings
  const currentListings = filteredListings.slice(
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
    return sidebarItem?.name || "Leads";
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
  }, [searchQuery, selectedUserType]);

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
      if (timelinePopupRef.current && !timelinePopupRef.current.contains(event.target as Node)) {
        setIsTimelinePopupOpen(false);
        setSelectedListing(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.addEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = (item: Listing) => {
    const editPath = `/leads/${lead_in}/${status}-edit`;
    navigate(editPath, { state: { property: item } });
    setDropdownOpen(null);
  };

  const handleDelete = (unique_property_id: string) => {
    console.log(`Delete property: ${unique_property_id}`);
    setDropdownOpen(null);
  };

  const handleApprove = (unique_property_id: string) => {
    console.log(`Approve/Reject property: ${unique_property_id}`);
    setDropdownOpen(null);
  };

  const handleLead = (item: Listing) => {
    setIsModalOpen(true);
    setDropdownOpen(null);
  };

  const handleSearch = (value: string) => {
    let searchValue = value.trim();
    const userTypeKey = userTypeReverseMap[searchValue.toLowerCase()];
    if (userTypeKey) {
      searchValue = userTypeKey;
    }
    setSearchQuery(searchValue);
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
    // Show actions for New and Today statuses
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

  // Timeline Popup Handlers
  const handleNameClick = (item: Listing) => {
    setSelectedListing(item);
    setIsTimelinePopupOpen(true);
  };

  const handleTimelinePopupClose = () => {
    setIsTimelinePopupOpen(false);
    setSelectedListing(null);
  };

  // Updated timeline events based on status
  const getTimelineEvents = (listing: Listing): TimelineEvent[] => {
    const status = listing.status;
    const events: TimelineEvent[] = [
      {
        date: formatDateTime(listing.created_date, listing.created_time),
        title: "Lead Initiated",
        description: `Property ${listing.property_name} was created by ${listing.user.name}.`,
      },
    ];

    // Add status-specific events
    if (status >= 1) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Today Lead",
        description: `Property ${listing.property_name} was marked as a today lead.`,
      });
    }
    if (status >= 2) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Site Visit Done",
        description: `Site visit completed for ${listing.property_name}.`,
      });
    }
    if (status === 3) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Won Lead",
        description: `Lead for ${listing.property_name} was won.`,
      });
    }
    if (status === 4) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Loss Lead",
        description: `Lead for ${listing.property_name} was lost.`,
      });
    }
    if (status === 5) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Total Lead",
        description: `Property ${listing.property_name} is part of total leads.`,
      });
    }

    return events;
  };

  const handleAddNewLead = () => {
    navigate('/leads/addlead');
  };

  const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Selected User Type:", value); // Debug log
    setSelectedUserType(value);
    setLocalPage(1); // Reset to first page when user type changes
  };

  return (
    <div className="relative min-h-screen">
      <PageMeta title={`Lead Management - ${getPageTitle()}`} />
      <PageBreadcrumb
        pageTitle={getPageTitle()}
        pagePlacHolder="Search by Customer Name, Mobile, Email, Project, or Lead Source"
        onFilter={handleSearch}
        inputRef={searchInputRef}
      />
      {filteredListings.length === 0 ? (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No Leads Found</h2>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center gap-x-4 px-4 py-1">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Search result - {filteredListings.length}</h2>
            {status === "0" && (
              <Button variant="primary" size="sm" onClick={handleAddNewLead}>
                Add New Lead
              </Button>
            )}
            {parseInt(status || "0", 10) === 5 && (
            <div className="px-4 py-2">
              <Label htmlFor="userTypeFilter">Filter by User Type</Label>
              <select
                id="userTypeFilter"
                value={selectedUserType}
                onChange={handleUserTypeChange}
                className="w-48 p-2 border rounded dark:bg-dark-900"
              >
                {userTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          </div>
          
          <div className="space-y-6">
            <ComponentCard title={getPageTitle()}>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Sl. No</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Customer Name</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Mobile</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Interested Project</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Lead Source</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Created Date & Time</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Location</TableCell>
                        {shouldShowActions() && (
                          <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {currentListings.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{(localPage - 1) * itemsPerPage + index + 1}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                            <span
                              className="cursor-pointer text-blue-600 hover:underline"
                              onClick={() => handleNameClick(item)}
                            >
                              {item.user.name || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.user.mobile || "N/A"}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.user.email || "N/A"}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.property_name || "N/A"}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.lead_source || "N/A"}</TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                            {formatDateTime(item.created_date, item.created_time)}
                          </TableCell>
                          <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">{item.location_id || "N/A"}</TableCell>
                          {shouldShowActions() && (
                            <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDropdownOpen(dropdownOpen === item.id.toString() ? null : item.id.toString())}
                              >
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </Button>
                              {dropdownOpen === item.id.toString() && (
                                <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                                  <button onClick={() => handleEdit(item)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Edit</button>
                                  <button onClick={() => handleDelete(item.unique_property_id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Delete</button>
                                  <button onClick={() => handleApprove(item.unique_property_id)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {parseInt(status || "0", 10) === 0 ? "Approve" : "Reject"}
                                  </button>
                                  {parseInt(status || "0", 10) === 1 && (
                                    <button onClick={() => handleLead(item)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Lead Pull</button>
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
              {filteredListings.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 py-2 gap-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {(localPage - 1) * itemsPerPage + 1} to {Math.min(localPage * itemsPerPage, filteredListings.length)} of {filteredListings.length} entries
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

      {/* Timeline Popup */}
      {isTimelinePopupOpen && selectedListing && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-none flex items-center justify-center z-20">
          <div ref={timelinePopupRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Timeline for {selectedListing.user.name}</h2>
              <button
                onClick={handleTimelinePopupClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {getTimelineEvents(selectedListing).map((event, index, events) => (
                <div key={index} className="flex items-start relative">
                  {/* Dot Icon */}
                  <div className="flex-shrink-0 w-4 h-4 bg-[#1D3A76] rounded-full z-10"></div>
                  {/* Vertical Line (only if not the last event) */}
                  {index < events.length - 1 && (
                    <div className="absolute top-4 left-[7px] w-0.5 h-[calc(100%+1rem)] bg-green-500"></div>
                  )}
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsType;