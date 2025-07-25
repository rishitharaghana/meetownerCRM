import { useLocation, useNavigate } from "react-router";

import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";
import { getStatusDisplay } from "../../utils/statusdisplay";

export default function BuilderDetailsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = location.state?.userDetails; // Retrieve user details from route state

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  if (!userDetails) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-4">
        No user details found.
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/builders")}
          className="ml-4"
        >
          Back to builders
        </Button>
      </div>
    );
  }

  const { text: statusText, className: statusClass } = getStatusDisplay(userDetails.status);

  return (
    <div className="relative min-h-screen p-4">
      <ComponentCard title={`Partner Details - ${userDetails.name}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
            <p><strong>ID:</strong> {userDetails.id}</p>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Mobile:</strong> {userDetails.mobile}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                {statusText}
              </span>
            </p>
            <p><strong>Joined:</strong> {formatDate(userDetails.created_date)}</p>
            <p>
              <strong>Location:</strong> {userDetails.location}, {userDetails.city}, {userDetails.state}
            </p>
            <p><strong>Address:</strong> {userDetails.address || "N/A"}</p>
            <p><strong>Pincode:</strong> {userDetails.pincode || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Company Information</h3>
            <p><strong>Company Name:</strong> {userDetails.company_name || "N/A"}</p>
            <p><strong>Company Number:</strong> {userDetails.company_number || "N/A"}</p>
            <p><strong>Company Address:</strong> {userDetails.company_address || "N/A"}</p>
            <p><strong>GST Number:</strong> {userDetails.gst_number || "N/A"}</p>
            <p><strong>RERA Number:</strong> {userDetails.rera_number || "N/A"}</p>
            <p><strong>Representative Name:</strong> {userDetails.representative_name || "N/A"}</p>
            <p><strong>PAN Card Number:</strong> {userDetails.pan_card_number || "N/A"}</p>
            <p><strong>Aadhar Number:</strong> {userDetails.aadhar_number || "N/A"}</p>
          </div>
        </div>
        {userDetails.photo && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Photo</h3>
            <img src={userDetails.photo} alt="User Photo" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
        {userDetails.company_logo && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Company Logo</h3>
            <img src={userDetails.company_logo} alt="Company Logo" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
        {userDetails.feedback && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Feedback</h3>
            <p>{userDetails.feedback}</p>
          </div>
        )}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Bank Details</h3>
          <p><strong>Account Number:</strong> {userDetails.account_number || "N/A"}</p>
          <p><strong>IFSC Code:</strong> {userDetails.ifsc_code || "N/A"}</p>
        </div>
        <div className="mt-6">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/builders")} // Navigate back to the list
          >
            Back to Partners
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
}