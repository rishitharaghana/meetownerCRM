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
import { Modal } from "../../components/ui/modal";

interface LeadPullFormData {
  channelPartnerName: string;
  channelPartnerNumber: string;
  leadPriority: string;
}

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
  budget: string;
  property_type: string;
  lead_type: string;
}

const sidebarSubItems = [
  { name: "New Leads", lead_in: "new", status: 0 },
  { name: "Today Follow-Ups", lead_in: "today", status: 1 },
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

const userTypeReverseMap: { [key: string]: string } = Object.keys(
  userTypeMap
).reduce((acc, key) => {
  acc[userTypeMap[key].toLowerCase()] = key;
  return acc;
}, {} as { [key: string]: string });

const userTypeOptions = [
  { value: "", label: "All" },
  { value: "3", label: "Builder" },
  { value: "6", label: "Channel Partner" },
];

const leadSourceOptions = [
  "Google Ads",
  "Meta Ads",
  "X Ads",
  "Website",
  "Referral",
  "Walk-in",
];
const leadTypeOptions = ["Contacted", "Interested"];
const priorityOptions = ["High Priority", "Medium Priority", "Low Priority"];

const sampleListings: Listing[] = [
  {
    id: 1,
    unique_property_id: "PROP001",
    property_name: "Sunrise Villa",
    sub_type: "Apartment",
    user: {
      user_type: 5,
      name: "John Doe",
      mobile: "9876543210",
      email: "john.doe@example.com",
    },
    created_date: "2025-04-10",
    created_time: "10:30:00",
    updated_date: "2025-04-12",
    updated_time: "14:45:00",
    location_id: "Downtown",
    lead_source: "Google Ads",
    status: 0,
    budget: "50L-75L",
    property_type: "Residential",
    lead_type: "Contacted",
  },
  {
    id: 2,
    unique_property_id: "PROP002",
    property_name: "Green Meadows",
    sub_type: "Villa",
    user: {
      user_type: 4,
      name: "Jane Smith",
      mobile: "8765432109",
      email: "jane.smith@example.com",
    },
    created_date: "2025-04-09",
    created_time: "09:15:00",
    updated_date: "2025-04-11",
    updated_time: "11:20:00",
    location_id: "Suburbs",
    lead_source: "Referral",
    status: 1,
    budget: "1Cr-1.5Cr",
    property_type: "Commercial",
    lead_type: "Interested",
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
  const [isTimelinePopupOpen, setIsTimelinePopupOpen] =
    useState<boolean>(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [leadPullFormData, setLeadPullFormData] = useState<LeadPullFormData>({
    channelPartnerName: "",
    channelPartnerNumber: "",
    leadPriority: "",
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

  // Find the sidebar item
  const sidebarItem = sidebarSubItems.find(
    (item) =>
      item.lead_in.toLowerCase() === lead_in?.toLowerCase() &&
      item.status === parseInt(status || "0", 10)
  );

  // Filter listings
  const filteredListings = sampleListings.filter((item) => {
    if (
      parseInt(status || "0", 10) !== 5 &&
      item.status !== parseInt(status || "0", 10)
    ) {
      return false;
    }
    if (
      parseInt(status || "0", 10) === 5 &&
      selectedUserType &&
      item.user.user_type.toString() !== selectedUserType
    ) {
      return false;
    }
    if (!searchQuery) return true;
    const userTypeKey = userTypeReverseMap[searchQuery.toLowerCase()];
    const searchValue = userTypeKey || searchQuery.toLowerCase();
    return (
      item.unique_property_id.toLowerCase().includes(searchValue) ||
      item.property_name.toLowerCase().includes(searchValue) ||
      item.sub_type.toLowerCase().includes(searchValue) ||
      userTypeMap[item.user.user_type.toString()]
        .toLowerCase()
        .includes(searchValue) ||
      item.user.name.toLowerCase().includes(searchValue) ||
      item.user.mobile.includes(searchValue) ||
      item.user.email?.toLowerCase().includes(searchValue) ||
      false ||
      item.lead_source?.toLowerCase().includes(searchValue) ||
      false ||
      item.budget.toLowerCase().includes(searchValue) ||
      item.property_type.toLowerCase().includes(searchValue) ||
      item.lead_type.toLowerCase().includes(searchValue)
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
    setSearchQuery(savedSearch);
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const getPageTitle = () => {
    return sidebarItem?.name || "Leads";
  };

  const formatDateTime = (
    date: string | undefined,
    time: string | undefined
  ): string => {
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
    return `${formattedDay}-${formattedMonth}-${formattedYear} ${String(
      formattedHours
    ).padStart(2, "0")}:${formattedMinutes} ${ampm}`;
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }
      if (
        timelinePopupRef.current &&
        !timelinePopupRef.current.contains(event.target as Node)
      ) {
        setIsTimelinePopupOpen(false);
        setSelectedListing(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (unique_property_id: string) => {
    console.log(`Delete property: ${unique_property_id}`);
    setDropdownOpen(null);
  };

  const handleLeadAssign = (item: Listing) => {
    setSelectedListing(item);
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

  // Modal Form Handlers
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLeadPullFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateLeadPullForm = (): boolean => {
    const newErrors: Partial<LeadPullFormData> = {};
    if (!leadPullFormData.channelPartnerName) {
      newErrors.channelPartnerName = "Employee Name is required";
    }
    if (!leadPullFormData.channelPartnerNumber) {
      newErrors.channelPartnerNumber = "Employee Number is required";
    } else if (!/^\d{10}$/.test(leadPullFormData.channelPartnerNumber)) {
      newErrors.channelPartnerNumber =
        "Mobile number must be exactly 10 digits";
    }
    if (!leadPullFormData.leadPriority) {
      newErrors.leadPriority = "Lead Priority is required";
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLeadPullSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateLeadPullForm()) {
      console.log("Lead Assign Form Data:", leadPullFormData);
      alert("Lead assigned successfully!");
      setIsModalOpen(false);
      setLeadPullFormData({
        channelPartnerName: "",
        channelPartnerNumber: "",
        leadPriority: "",
      });
      setFormErrors({});
      setSelectedListing(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setLeadPullFormData({
      channelPartnerName: "",
      channelPartnerNumber: "",
      leadPriority: "",
    });
    setFormErrors({});
    setSelectedListing(null);
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

  // Timeline events
  const getTimelineEvents = (listing: Listing): TimelineEvent[] => {
    const events: TimelineEvent[] = [
      {
        date: formatDateTime(listing.created_date, listing.created_time),
        title: "Lead Initiated",
        description: `Property ${listing.property_name} was created by ${listing.user.name}.`,
      },
    ];
    if (listing.status >= 1) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Today Follow-Ups",
        description: `Property ${listing.property_name} was marked as a today lead.`,
      });
    }
    if (listing.status >= 2) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Site Visit Done",
        description: `Site visit completed for ${listing.property_name}.`,
      });
    }
    if (listing.status === 3) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Won Lead",
        description: `Lead for ${listing.property_name} was won.`,
      });
    }
    if (listing.status === 4) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Loss Lead",
        description: `Lead for ${listing.property_name} was lost.`,
      });
    }
    if (listing.status === 5) {
      events.push({
        date: formatDateTime(listing.updated_date, listing.updated_time),
        title: "Total Lead",
        description: `Property ${listing.property_name} is part of total leads.`,
      });
    }
    return events;
  };

  const handleAddNewLead = () => {
    navigate("/leads/addlead");
  };

  const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserType(e.target.value);
    setLocalPage(1);
  };
  const [propertyViewModal, setPropertyViewModal] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<Listing | null>(null);

  const handleViewProperty = (item: Listing) => {
    setPropertyDetails(item);
    setPropertyViewModal(true);
    navigate("/leads/view", { state: { property: item } });
  };

  return (
    <div className="relative min-h-screen">
      <PageMeta title={`Lead Management - ${getPageTitle()}`} />
      <PageBreadcrumb
        pageTitle={getPageTitle()}
        pagePlacHolder="Search by Customer Name, Mobile, Email, Project, Budget, Property Type, or Lead Source"
        onFilter={handleSearch}
        inputRef={searchInputRef}
      />

      <>
        <div className="flex justify-between items-center gap-x-4 px-4 py-1">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Search result - {filteredListings.length}
          </h2>
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
                className="w-48 p-2 border rounded dark:bg-dark-900 dark:text-white"
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
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Sl. No
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Customer Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Customer Number
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Interested Project
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Lead Type
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
                    {currentListings.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {(localPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          <span
                            className="cursor-pointer text-blue-600 hover:underline"
                            onClick={() => handleNameClick(item)}
                          >
                            {item.user.name || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {item.user.mobile || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {item.user.email || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {item.property_name || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                          {item.lead_type || "N/A"}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-left"
                            onClick={() =>
                              setDropdownOpen(
                                dropdownOpen === item.id.toString()
                                  ? null
                                  : item.id.toString()
                              )
                            }
                          >
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </Button>
                          {dropdownOpen === item.id.toString() && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
                            >
                              <button
                                onClick={() => handleLeadAssign(item)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Lead Assign
                              </button>
                              <button
                                onClick={() => handleViewProperty(item)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                View History
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(item.unique_property_id)
                                }
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            {filteredListings.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 py-2 gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(localPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(localPage * itemsPerPage, filteredListings.length)}{" "}
                  of {filteredListings.length} entries
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
                      onClick={() => goToPage(page as number)}
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
          </ComponentCard>
        </div>
      </>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        className="max-w-md p-6"
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Assign Lead
          </h2>
          <form onSubmit={handleLeadPullSubmit} className="space-y-4">
            <div>
              <Label htmlFor="channelPartnerName">Employee Name</Label>
              <Input
                type="text"
                id="channelPartnerName"
                name="channelPartnerName"
                value={leadPullFormData.channelPartnerName}
                onChange={handleInputChange}
                className="dark:bg-dark-900"
                placeholder="Enter employee name"
              />
              {formErrors.channelPartnerName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {formErrors.channelPartnerName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="channelPartnerNumber">Employee Number</Label>
              <Input
                type="text"
                id="channelPartnerNumber"
                name="channelPartnerNumber"
                value={leadPullFormData.channelPartnerNumber}
                onChange={handleInputChange}
                className="dark:bg-dark-900"
                placeholder="Enter 10-digit mobile number"
              />
              {formErrors.channelPartnerNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {formErrors.channelPartnerNumber}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="leadPriority">Lead Priority</Label>
              <select
                id="leadPriority"
                name="leadPriority"
                value={leadPullFormData.leadPriority}
                onChange={handleInputChange}
                className="w-full p-2 border rounded  cursor-pointer dark:bg-dark-900 dark:text-white"
              >
                <option value="">Select Priority</option>
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {formErrors.leadPriority && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {formErrors.leadPriority}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" size="sm" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {isTimelinePopupOpen && selectedListing && (
        <Modal
          isOpen={isTimelinePopupOpen}
          onClose={handleTimelinePopupClose}
          className="max-w-md p-6"
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Timeline for {selectedListing.user.name}
            </h2>
            {getTimelineEvents(selectedListing).map((event, index, events) => (
              <div key={index} className="flex items-start relative">
                <div className="flex-shrink-0 w-4 h-4 bg-[#1D3A76] rounded-full z-10"></div>
                {index < events.length - 1 && (
                  <div className="absolute top-4 left-[7px] w-0.5 h-[calc(100%+1rem)] bg-green-500"></div>
                )}
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.date}
                  </p>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {propertyViewModal && propertyDetails && (
  <Modal isOpen={propertyViewModal} onClose={() => setPropertyViewModal(false)} className="max-w-md p-6">
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Property Details</h2>
      <p><strong>Budget:</strong> {propertyDetails.budget || "N/A"}</p>
      <p><strong>Property Type:</strong> {propertyDetails.property_type || "N/A"}</p>
      <p><strong>Lead Source:</strong> {propertyDetails.lead_source || "N/A"}</p>
      <p><strong>Created On:</strong> {formatDateTime(propertyDetails.created_date, propertyDetails.created_time)}</p>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setPropertyViewModal(false)}>Close</Button>
      </div>
    </div>
  </Modal>
)}

    </div>
    
  );
};

export default LeadsType;
