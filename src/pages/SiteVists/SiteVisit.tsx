import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/ui/pagination/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";

interface SiteVisit {
  id: number;
  unique_property_id: string;
  property_name: string;
  user: {
    user_type: number;
    name: string;
    mobile: string;
    email?: string;
  };
  channel_partner: {
    name: string;
    mobile: string;
  };
  created_date: string;
  updated_status: string;
  budget: string;
  property_in: string;
  property_type: string;
  amenities: string[];
  feedback: string;
  next_action: string;
  state: string;
  city: string;
  locality: string;
  builder_name: string;
  build_up_area: string;
  carpet_area: string;
  around_this_property: string[];
  distance_from_property: string[];
}

const sampleSiteVisits: SiteVisit[] = [
  {
    id: 1,
    unique_property_id: "PROP001",
    property_name: "Sunrise Villa",
    user: {
      user_type: 5,
      name: "John Doe",
      mobile: "9876543210",
      email: "john.doe@example.com",
    },
    channel_partner: { name: "Alice Brown", mobile: "8765432109" },
    created_date: "2025-04-10",
    updated_status: "Followup",
    budget: "50L-75L",
    property_in: "Downtown",
    property_type: "Residential",
    amenities: ["Pool", "Gym", "Parking"],
    feedback: "Client is interested but needs more details on pricing.",
    next_action: "Schedule follow-up call",
    state: "Maharashtra",
    city: "Mumbai",
    locality: "Bandra",
    builder_name: "Sunrise Builders",
    build_up_area: "1500 sqft",
    carpet_area: "1200 sqft",
    around_this_property: ["School", "Hospital", "Mall"],
    distance_from_property: ["2 km to city center"],
  },
  {
    id: 2,
    unique_property_id: "PROP002",
    property_name: "Green Meadows",
    user: {
      user_type: 4,
      name: "Jane Smith",
      mobile: "8765432109",
      email: "jane.smith@example.com",
    },
    channel_partner: { name: "Bob Wilson", mobile: "7654321098" },
    created_date: "2025-04-09",
    updated_status: "Negotiation",
    budget: "1Cr-1.5Cr",
    property_in: "Suburbs",
    property_type: "Commercial",
    amenities: ["Office Space", "Parking", "Security"],
    feedback: "Client negotiating on payment terms.",
    next_action: "Discuss financing options",
    state: "Karnataka",
    city: "Bangalore",
    locality: "Whitefield",
    builder_name: "Green Meadows Ltd",
    build_up_area: "2000 sqft",
    carpet_area: "1600 sqft",
    around_this_property: ["Tech Park", "Shopping Complex"],
    distance_from_property: ["5 km to IT hub"],
  },
  {
    id: 3,
    unique_property_id: "PROP003",
    property_name: "Ocean Breeze",
    user: {
      user_type: 5,
      name: "Amit Sharma",
      mobile: "9123456789",
      email: "amit.sharma@example.com",
    },
    channel_partner: { name: "Priya Patel", mobile: "9871234567" },
    created_date: "2025-04-08",
    updated_status: "Ready to Close",
    budget: "80L-1Cr",
    property_in: "Coastal Area",
    property_type: "Residential",
    amenities: ["Beach Access", "Clubhouse", "Garden"],
    feedback: "Client satisfied with amenities and location.",
    next_action: "Finalize agreement",
    state: "Goa",
    city: "Panaji",
    locality: "Calangute",
    builder_name: "Ocean Builders",
    build_up_area: "1800 sqft",
    carpet_area: "1400 sqft",
    around_this_property: ["Beach", "Market", "Resort"],
    distance_from_property: ["1 km to beach"],
  },
  {
    id: 4,
    unique_property_id: "PROP004",
    property_name: "Hilltop Residency",
    user: {
      user_type: 4,
      name: "Ravi Kumar",
      mobile: "9012345678",
      email: "ravi.kumar@example.com",
    },
    channel_partner: { name: "Suresh Nair", mobile: "8761234567" },
    created_date: "2025-04-07",
    updated_status: "Loss Lead",
    budget: "40L-60L",
    property_in: "Hill Area",
    property_type: "Residential",
    amenities: ["Scenic View", "Parking", "Security"],
    feedback: "Client found budget too high.",
    next_action: "None",
    state: "Uttarakhand",
    city: "Dehradun",
    locality: "Mussoorie",
    builder_name: "Hilltop Developers",
    build_up_area: "1300 sqft",
    carpet_area: "1000 sqft",
    around_this_property: ["Tourist Spot", "School"],
    distance_from_property: ["10 km to city"],
  },
  {
    id: 5,
    unique_property_id: "PROP005",
    property_name: "Cityscape Towers",
    user: {
      user_type: 5,
      name: "Neha Gupta",
      mobile: "8901234567",
      email: "neha.gupta@example.com",
    },
    channel_partner: { name: "Vikram Singh", mobile: "7651234567" },
    created_date: "2025-04-06",
    updated_status: "Followup",
    budget: "60L-80L",
    property_in: "City Center",
    property_type: "Residential",
    amenities: ["Gym", "Pool", "Clubhouse"],
    feedback: "Client wants to visit again.",
    next_action: "Arrange second visit",
    state: "Delhi",
    city: "New Delhi",
    locality: "Connaught Place",
    builder_name: "Cityscape Builders",
    build_up_area: "1700 sqft",
    carpet_area: "1350 sqft",
    around_this_property: ["Metro", "Mall", "Office"],
    distance_from_property: ["0.5 km to metro"],
  },
  {
    id: 6,
    unique_property_id: "PROP006",
    property_name: "Lakeview Apartments",
    user: {
      user_type: 4,
      name: "Sonia Mehra",
      mobile: "8791234567",
      email: "sonia.mehra@example.com",
    },
    channel_partner: { name: "Rahul Verma", mobile: "7541234567" },
    created_date: "2025-04-05",
    updated_status: "Negotiation",
    budget: "90L-1.2Cr",
    property_in: "Lakeside",
    property_type: "Residential",
    amenities: ["Lake View", "Parking", "Security"],
    feedback: "Client discussing floor plan changes.",
    next_action: "Provide revised floor plan",
    state: "Telangana",
    city: "Hyderabad",
    locality: "Banjara Hills",
    builder_name: "Lakeview Constructions",
    build_up_area: "1900 sqft",
    carpet_area: "1500 sqft",
    around_this_property: ["Lake", "Park", "Hospital"],
    distance_from_property: ["3 km to city center"],
  },
  {
    id: 7,
    unique_property_id: "PROP007",
    property_name: "Skyline Plaza",
    user: {
      user_type: 5,
      name: "Kiran Patel",
      mobile: "8681234567",
      email: "kiran.patel@example.com",
    },
    channel_partner: { name: "Anita Desai", mobile: "7431234567" },
    created_date: "2025-04-04",
    updated_status: "Ready to Close",
    budget: "1.5Cr-2Cr",
    property_in: "Downtown",
    property_type: "Commercial",
    amenities: ["Office Space", "Elevator", "Security"],
    feedback: "Client ready to sign agreement.",
    next_action: "Prepare final documents",
    state: "Gujarat",
    city: "Ahmedabad",
    locality: "Navrangpura",
    builder_name: "Skyline Developers",
    build_up_area: "2500 sqft",
    carpet_area: "2000 sqft",
    around_this_property: ["Mall", "Office", "Metro"],
    distance_from_property: ["1 km to business district"],
  },
  {
    id: 8,
    unique_property_id: "PROP008",
    property_name: "Garden Heights",
    user: {
      user_type: 4,
      name: "Vivek Joshi",
      mobile: "8571234567",
      email: "vivek.joshi@example.com",
    },
    channel_partner: { name: "Meena Kapoor", mobile: "7321234567" },
    created_date: "2025-04-03",
    updated_status: "Followup",
    budget: "45L-65L",
    property_in: "Suburbs",
    property_type: "Residential",
    amenities: ["Garden", "Play Area", "Parking"],
    feedback: "Client wants more details on amenities.",
    next_action: "Provide amenities brochure",
    state: "Rajasthan",
    city: "Jaipur",
    locality: "Vaishali Nagar",
    builder_name: "Garden Builders",
    build_up_area: "1400 sqft",
    carpet_area: "1100 sqft",
    around_this_property: ["School", "Market"],
    distance_from_property: ["4 km to city center"],
  },
  {
    id: 9,
    unique_property_id: "PROP009",
    property_name: "Metro View",
    user: {
      user_type: 5,
      name: "Pooja Reddy",
      mobile: "8461234567",
      email: "pooja.reddy@example.com",
    },
    channel_partner: { name: "Sanjay Gupta", mobile: "7211234567" },
    created_date: "2025-04-02",
    updated_status: "Negotiation",
    budget: "70L-90L",
    property_in: "City Center",
    property_type: "Residential",
    amenities: ["Metro Access", "Gym", "Security"],
    feedback: "Client negotiating on maintenance charges.",
    next_action: "Discuss maintenance terms",
    state: "West Bengal",
    city: "Kolkata",
    locality: "Salt Lake",
    builder_name: "Metro Builders",
    build_up_area: "1600 sqft",
    carpet_area: "1300 sqft",
    around_this_property: ["Metro", "Park", "Mall"],
    distance_from_property: ["0.8 km to metro station"],
  },
  {
    id: 10,
    unique_property_id: "PROP010",
    property_name: "Starlight Residency",
    user: {
      user_type: 4,
      name: "Arjun Malhotra",
      mobile: "8351234567",
      email: "arjun.malhotra@example.com",
    },
    channel_partner: { name: "Ritu Sharma", mobile: "7101234567" },
    created_date: "2025-04-01",
    updated_status: "Loss Lead",
    budget: "55L-75L",
    property_in: "Suburbs",
    property_type: "Residential",
    amenities: ["Pool", "Clubhouse", "Parking"],
    feedback: "Client chose another property.",
    next_action: "None",
    state: "Tamil Nadu",
    city: "Chennai",
    locality: "Velachery",
    builder_name: "Starlight Developers",
    build_up_area: "1450 sqft",
    carpet_area: "1150 sqft",
    around_this_property: ["School", "Hospital", "Mall"],
    distance_from_property: ["6 km to IT corridor"],
  },
];

const SiteVisit: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localPage, setLocalPage] = useState<number>(1);
  const navigate = useNavigate();
  const { status } = useParams<{ status: string }>();

  const itemsPerPage = 5;
  const totalCount = sampleSiteVisits.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const filteredSiteVisits = sampleSiteVisits.filter((item) => {
    if (status && item.updated_status.toLowerCase() !== status.toLowerCase()) {
      return false;
    }
    if (!searchQuery) return true;
    const searchValue = searchQuery.toLowerCase();
    return (
      item.unique_property_id.toLowerCase().includes(searchValue) ||
      item.property_name.toLowerCase().includes(searchValue) ||
      item.user.name.toLowerCase().includes(searchValue) ||
      item.user.mobile.includes(searchValue) ||
      item.channel_partner.name.toLowerCase().includes(searchValue) ||
      item.channel_partner.mobile.includes(searchValue) ||
      item.updated_status.toLowerCase().includes(searchValue)
    );
  });

  const currentSiteVisits = filteredSiteVisits.slice(
    (localPage - 1) * itemsPerPage,
    localPage * itemsPerPage
  );

  useEffect(() => {
    setLocalPage(1);
  }, [searchQuery, status]);

  const handleSearch = (value: string) => {
    setSearchQuery(value.trim());
  };
 
  

  const handleViewDetails = (item: SiteVisit) => {
    navigate(`/site-visit/details/${item.id}`, { state: { siteVisit: item } });
  };

  const formatDate = (date: string): string => {
    if (!date) return "N/A";
    const [year, month, day] = date.split("-").map(Number);
    const dateTime = new Date(year, month - 1, day);
    return `${String(dateTime.getDate()).padStart(2, "0")}-${String(
      dateTime.getMonth() + 1
    ).padStart(2, "0")}-${dateTime.getFullYear()}`;
  };

  return (
    <div className="relative min-h-screen">
      <PageMeta title="Site Visit Management" />
      <PageBreadcrumb
        pageTitle="Site Visits"
        pagePlacHolder="Search by Customer Name, Mobile, Channel Partner, or Project"
        onFilter={handleSearch}
      />

      <div className="flex justify-between items-center gap-x-4 px-4 py-1">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Search result - {filteredSiteVisits.length}
        </h2>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Site Visits">
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
                      Channel Partner Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Channel Partner Number
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Project Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Created Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Updated Status
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
                  {currentSiteVisits.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {(localPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.user.name || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.user.mobile || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.channel_partner.name || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.channel_partner.mobile || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.property_name || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {formatDate(item.created_date)}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {item.updated_status || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md px-4 py-2 transition-colors duration-200"
                          onClick={() => handleViewDetails(item)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {filteredSiteVisits.length > itemsPerPage && (
        <div className="flex justify-end mt-4 px-4">
              <Pagination
                currentPage={localPage}
                totalPages={totalPages}
                onPageChange={(page) => setLocalPage(page)}
              />
      </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
};

export default SiteVisit;
