import { useState } from "react";
import { useNavigate } from "react-router";
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
  company_name?: string;
  representative_name?: string;
  company_number?: string;
  aadhar_number?: string;
  pan_card?: string;
  office_number?: string;
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
    company_name: "Doe Builders",
    representative_name: "John Smith",
    company_number: "COMP123",
    aadhar_number: "1234-5678-9012",
    pan_card: "ABCDE1234F",
    office_number: "555-0123",
    created_date: "2025-01-15",
    status: 0,
  },
  {
    id: 2,
    name: "Jane Smith",
    user_type: 2,
    mobile: "8765432109",
    email: "jane.smith@example.com",
    address: "456 Oak Ave",
    city: "San Francisco",
    state: "California",
    pincode: "94102",
    gst_number: "GST987654321",
    rera_number: "RERA67890",
    company_name: "Smith Realty",
    representative_name: "Jane Wilson",
    company_number: "COMP456",
    aadhar_number: "2345-6789-0123",
    pan_card: "BCDEF2345G",
    office_number: "555-0456",
    created_date: "2025-02-10",
    status: 1,
  },
  {
    id: 3,
    name: "Michael Brown",
    user_type: 1,
    mobile: "7654321098",
    email: "michael.brown@example.com",
    address: "789 Pine Rd",
    city: "New York",
    state: "New York",
    pincode: "10001",
    gst_number: "GST112233445",
    rera_number: "RERA54321",
    company_name: "Brown Constructions",
    representative_name: "Michael Lee",
    company_number: "COMP789",
    aadhar_number: "3456-7890-1234",
    pan_card: "CDEFG3456H",
    office_number: "555-0789",
    created_date: "2025-03-05",
    status: 0,
  },
  {
    id: 4,
    name: "Emily Davis",
    user_type: 3,
    mobile: "6543210987",
    email: "emily.davis@example.com",
    address: "101 Maple Dr",
    city: "Chicago",
    state: "Illinois",
    pincode: "60601",
    gst_number: "GST556677889",
    rera_number: "RERA98765",
    company_name: "Davis Properties",
    representative_name: "Emily Clark",
    company_number: "COMP101",
    aadhar_number: "4567-8901-2345",
    pan_card: "DEFGH4567I",
    office_number: "555-1011",
    created_date: "2025-04-20",
    status: 1,
  },
  {
    id: 5,
    name: "William Taylor",
    user_type: 2,
    mobile: "5432109876",
    email: "william.taylor@example.com",
    address: "202 Cedar Ln",
    city: "Houston",
    state: "Texas",
    pincode: "77002",
    gst_number: "GST223344556",
    rera_number: "RERA11223",
    company_name: "Taylor Estates",
    representative_name: "William Harris",
    company_number: "COMP202",
    aadhar_number: "5678-9012-3456",
    pan_card: "EFGHI5678J",
    office_number: "555-2022",
    created_date: "2025-05-12",
    status: 0,
  },
  {
    id: 6,
    name: "Sarah Wilson",
    user_type: 1,
    mobile: "4321098765",
    email: "sarah.wilson@example.com",
    address: "303 Birch Blvd",
    city: "Miami",
    state: "Florida",
    pincode: "33101",
    gst_number: "GST334455667",
    rera_number: "RERA44556",
    company_name: "Wilson Homes",
    representative_name: "Sarah Adams",
    company_number: "COMP303",
    aadhar_number: "6789-0123-4567",
    pan_card: "FGHIJ6789K",
    office_number: "555-3033",
    created_date: "2025-06-01",
    status: 1,
  },
  {
    id: 7,
    name: "David Martinez",
    user_type: 3,
    mobile: "3210987654",
    email: "david.martinez@example.com",
    address: "404 Elm St",
    city: "Seattle",
    state: "Washington",
    pincode: "98101",
    gst_number: "GST445566778",
    rera_number: "RERA77889",
    company_name: "Martinez Builders",
    representative_name: "David King",
    company_number: "COMP404",
    aadhar_number: "7890-1234-5678",
    pan_card: "GHIJK7890L",
    office_number: "555-4044",
    created_date: "2025-07-15",
    status: 0,
  },
  {
    id: 8,
    name: "Laura Anderson",
    user_type: 2,
    mobile: "2109876543",
    email: "laura.anderson@example.com",
    address: "505 Spruce Way",
    city: "Boston",
    state: "Massachusetts",
    pincode: "02108",
    gst_number: "GST556677890",
    rera_number: "RERA99001",
    company_name: "Anderson Realty",
    representative_name: "Laura Evans",
    company_number: "COMP505",
    aadhar_number: "8901-2345-6789",
    pan_card: "HIJKL8901M",
    office_number: "555-5055",
    created_date: "2025-08-10",
    status: 1,
  },
  {
    id: 9,
    name: "James Thomas",
    user_type: 1,
    mobile: "1098765432",
    email: "james.thomas@example.com",
    address: "606 Willow Ct",
    city: "Phoenix",
    state: "Arizona",
    pincode: "85001",
    gst_number: "GST667788901",
    rera_number: "RERA22334",
    company_name: "Thomas Constructions",
    representative_name: "James Walker",
    company_number: "COMP606",
    aadhar_number: "9012-3456-7890",
    pan_card: "IJKLM9012N",
    office_number: "555-6066",
    created_date: "2025-09-05",
    status: 0,
  },
  {
    id: 10,
    name: "Olivia White",
    user_type: 3,
    mobile: "0987654321",
    email: "olivia.white@example.com",
    address: "707 Ash Pl",
    city: "Denver",
    state: "Colorado",
    pincode: "80202",
    gst_number: "GST778899012",
    rera_number: "RERA55667",
    company_name: "White Properties",
    representative_name: "Olivia Green",
    company_number: "COMP707",
    aadhar_number: "0123-4567-8901",
    pan_card: "JKLMN0123O",
    office_number: "555-7077",
    created_date: "2025-10-01",
    status: 1,
  },
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};


export default function PartnerScreen() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const itemsPerPage = 10;
  const categoryLabel = "Partners";

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

  const handleViewProfile = (id: number) => {
    navigate(`/partner/${id}`);
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
      console.log(
        `Reject user with ID: ${selectedUser.id}, Reason: ${rejectReason}`
      );
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
                            <span className="block font-medium text-gray-500 text-theme-sm dark:text-gray-400">
                              {user.name}
                            </span>
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
