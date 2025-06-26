import { useNavigate, useParams } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumbList from "../../components/common/PageBreadCrumbLists";
import Button from "../../components/ui/button/Button";

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
  status: number; // 0: Pending, 1: Verified
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

export function PartnerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = staticUsers.find((u) => u.id === parseInt(id || "0"));

  if (!user) {
    return <div className="p-4">Partner not found</div>;
  }

  return (
    <div className="relative min-h-screen p-6">
      <PageBreadcrumbList
        pageTitle={`Partner Profile - ${user.name}`}
        pagePlacHolder=""
        onFilter={() => {}}
      />
      <ComponentCard title="Partner Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-gray-800 dark:text-white">{user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-gray-800 dark:text-white">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
              <p className="text-gray-800 dark:text-white">{user.mobile}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
              <p className="text-gray-800 dark:text-white">{user.company_name || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Representative Name</h3>
              <p className="text-gray-800 dark:text-white">{user.representative_name || "N/A"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Number</h3>
              <p className="text-gray-800 dark:text-white">{user.company_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Aadhar Number</h3>
              <p className="text-gray-800 dark:text-white">{user.aadhar_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">RERA Number</h3>
              <p className="text-gray-800 dark:text-white">{user.rera_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">GST Number</h3>
              <p className="text-gray-800 dark:text-white">{user.gst_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">PAN Card</h3>
              <p className="text-gray-800 dark:text-white">{user.pan_card || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Office Number</h3>
              <p className="text-gray-800 dark:text-white">{user.office_number || "N/A"}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
}