import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
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

const userTypeMap: { [key: number]: string } = {
  3: "Builder",
  4: "Agent",
  5: "Owner",
  6: "Channel Partner",
};

interface User {
  id: number;
  name: string;
  user_type: number;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst_number?: string;
  rera_number?: string;
  created_date: string;
  status: number;
}



const staticUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    user_type: 3,
    mobile: "9876543210",
    email: "john.doe@example.com",
    address: "123 Builder St",
    city: "Los Angeles",
    state: "California",
    pincode: "90001",
    gst_number: "GST123456789",
    rera_number: "RERA12345",
    created_date: "2025-01-15",
    status: 0,
  },
  {
    id: 2,
    name: "Jane Smith",
    user_type: 4,
    mobile: "8765432109",
    email: "jane.smith@example.com",
    address: "456 Agent Ave",
    city: "Miami",
    state: "Florida",
    pincode: "33101",
    gst_number: "GST987654321",
    rera_number: "RERA67890",
    created_date: "2025-02-10",
    status: 2,
  },
  {
    id: 3,
    name: "Mike Johnson",
    user_type: 5,
    mobile: "7654321098",
    email: "mike.johnson@example.com",
    address: "789 Owner Rd",
    city: "New York",
    state: "New York",
    pincode: "10001",
    gst_number: "GST456789123",
    rera_number: "RERA54321",
    created_date: "2025-03-05",
    status: 0,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    user_type: 6,
    mobile: "6543210987",
    email: "sarah.wilson@example.com",
    address: "101 Partner Ln",
    city: "Chicago",
    state: "Illinois",
    pincode: "60601",
    gst_number: "GST321654987",
    rera_number: "RERA09876",
    created_date: "2025-04-01",
    status: 3,
  },
  {
    id: 5,
    name: "Tom Brown",
    user_type: 3,
    mobile: "5432109876",
    email: "tom.brown@example.com",
    address: "202 Builder Blvd",
    city: "Houston",
    state: "Texas",
    pincode: "77001",
    gst_number: "GST789123456",
    rera_number: "RERA23456",
    created_date: "2025-04-15",
    status: 0,
  },
  {
    id: 6,
    name: "Lisa Davis",
    user_type: 4,
    mobile: "4321098765",
    email: "lisa.davis@example.com",
    address: "303 Agent Ct",
    city: "Seattle",
    state: "Washington",
    pincode: "98101",
    gst_number: "GST654987321",
    rera_number: "RERA78901",
    created_date: "2025-05-10",
    status: 2,
  },
  {
    id: 7,
    name: "David Lee",
    user_type: 5,
    mobile: "3210987654",
    email: "david.lee@example.com",
    address: "404 Owner Dr",
    city: "Phoenix",
    state: "Arizona",
    pincode: "85001",
    gst_number: "GST147258369",
    rera_number: "RERA34567",
    created_date: "2025-06-01",
    status: 0,
  },
  {
    id: 8,
    name: "Emily Clark",
    user_type: 6,
    mobile: "2109876543",
    email: "emily.clark@example.com",
    address: "505 Partner Pl",
    city: "Atlanta",
    state: "Georgia",
    pincode: "30301",
    gst_number: "GST258369147",
    rera_number: "RERA89012",
    created_date: "2025-06-15",
    status: 3,
  },
  {
    id: 9,
    name: "Chris Evans",
    user_type: 3,
    mobile: "1098765432",
    email: "chris.evans@example.com",
    address: "606 Builder Way",
    city: "Denver",
    state: "Colorado",
    pincode: "80201",
    gst_number: "GST369147258",
    rera_number: "RERA45678",
    created_date: "2025-07-01",
    status: 0,
  },
  {
    id: 10,
    name: "Anna Taylor",
    user_type: 4,
    mobile: "0987654321",
    email: "anna.taylor@example.com",
    address: "707 Agent St",
    city: "Portland",
    state: "Oregon",
    pincode: "97201",
    gst_number: "GST741852963",
    rera_number: "RERA90123",
    created_date: "2025-07-15",
    status: 2,
  },
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export default function EmployeesScreen() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5;

  const navigate = useNavigate();
  const userType = "3,4,5,6"; 
  const categoryLabel = "Partners";

  const showGstNumber = true;
  const showReraNumber = true;

  const showMobileAndEmail = false;

  const filteredUsers = staticUsers.filter((user) => {
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
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

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

  const toggleMenu = (id: number) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleFilter = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1);
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
                      Partner
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
                    {/* <TableCell
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
                    </TableCell> */}
                    {/* <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      State
                    </TableCell> */}

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
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {userTypeMap[user.user_type] || "Unknown"}
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
                      {/* <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {user.address}
                      </TableCell>
                      {/* <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {user.city}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                        {user.state}
                      </TableCell> */} 

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
                            ? "Active"
                            : user.status === 2
                            ? "Suspended"
                            : user.status === 3
                            ? "Blocked"
                            : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400 relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleMenu(user.id)}
                        >
                          <MoreVertical className="size-5 text-gray-500 dark:text-gray-400" />
                        </Button>
                        {activeMenu === user.id && (
                          <div className="absolute right-2 top-10 z-10 w-32 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="py-2">
                              <button
  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
  onClick={() => {
    setActiveMenu(null);
    navigate(`/employees/${user.id}`);
  }}
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
