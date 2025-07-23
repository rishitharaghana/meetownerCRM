// pages/PartnerProfile.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumbList from "../../components/common/PageBreadCrumbLists";
import Button from "../../components/ui/button/Button";
import { RootState, AppDispatch } from "../../store/store";
import { clearUsers, getUserById } from "../../store/slices/userslice";


export default function PartnerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { selectedUser, loading, error } = useSelector((state: RootState) => state.user);
  console.log(selectedUser+"selected user");

  useEffect(() => {
    if (isAuthenticated && user?.id && id) {
      dispatch(getUserById({ admin_user_id: user.id, emp_user_type: 3, emp_user_id: Number(id) }));
    }
    return () => {
      dispatch(clearUsers());
    };
  }, [isAuthenticated, user, id, dispatch]);

  if (loading) {
    return <div className="p-4 text-center text-gray-600 dark:text-gray-400">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            dispatch(getUserById({ admin_user_id: user!.id, emp_user_type: 3, emp_user_id: Number(id) }))
          }
          className="ml-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!selectedUser) {
    return <div className="p-4 text-center text-gray-600 dark:text-gray-400">Partner not found</div>;
  }

  return (
    <div className="relative min-h-screen p-6">
      <PageBreadcrumbList
        pageTitle={`Partner Profile - ${selectedUser.name}`}
        pagePlacHolder=""
        onFilter={() => {}}
      />
      <ComponentCard title="Partner Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.mobile}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.company_name || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Representative Name</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.representative_name || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.address || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.location || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">City</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.city || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">State</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.state || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pincode</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.pincode || "N/A"}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Number</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.company_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Aadhar Number</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.aadhar_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Number</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.account_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">IFSC Code</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.ifsc_code || "N/A"}</p>
            </div>
            <div>

              <h3 className="text-sm font-medium text-gray-500">RERA Number</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.rera_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">GST Number</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.gst_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">PAN Card Number</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.pan_card_number || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Address</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.company_address || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.created_by || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.created_date || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created Time</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.created_time || "N/A"}</p>
            </div>
           
            <div>
              <h3 className="text-sm font-medium text-gray-500">Feedback</h3>
              <p className="text-gray-800 dark:text-white">{selectedUser.feedback || "N/A"}</p>
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