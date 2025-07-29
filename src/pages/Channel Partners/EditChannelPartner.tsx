    
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../../store/store";
import { clearMessages, updateUser } from "../../store/slices/userslice";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import { setCityDetails } from "../../store/slices/propertyDetails";
import PageMeta from "../../components/common/PageMeta";

interface Option {
  value: string;
  text: string;
}

const statusOptions: Option[] = [
  { value: "0", text: "Pending" },
  { value: "1", text: "Approved" },
  { value: "2", text: "Rejected" },
];

const EditChannelPartner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { partner } = location.state || {};
  const { states } = useSelector((state: RootState) => state.property);
  const { updateLoading, updateError, updateSuccess } = useSelector(
    (state: RootState) => state.user
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const { citiesQuery } = usePropertyQueries();
//changes made
  const [selectedPartner, setSelectedPartner] = useState<any>(partner || null);
  const [feedback, setFeedback] = useState<string>(partner?.feedback || "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [selectedState, setSelectedState] = useState<string>(
    partner?.state
      ? states?.find((s: any) => s.label.toLowerCase() === partner.state.toLowerCase())?.value?.toString() || ""
      : ""
  );

  const stateOptions: Option[] =
    states?.map((state: any) => ({
      value: state.value.toString(),
      text: state.label,
    })) || [];

  const citiesResult = citiesQuery(selectedState ? parseInt(selectedState) : undefined);
  const cityOptions: Option[] =
    citiesResult?.data?.map((city: any) => ({
      value: city.value.toString(),
      text: city.label,
    })) || [];

  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  useEffect(() => {
    if (citiesResult.isError) {
      toast.error(
        `Failed to fetch cities: ${citiesResult.error?.message || "Unknown error"}`
      );
    }
  }, [citiesResult.isError, citiesResult.error]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Channel partner updated successfully");
      setTimeout(() => {
        navigate(-1);
        dispatch(clearMessages());
      }, 1000);
    }
  }, [updateSuccess, navigate, dispatch]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    }
  }, [updateError]);

  const getCityValue = (text: string) => {
    const option = cityOptions.find((opt) => opt.text.toLowerCase() === text.toLowerCase());
    return option ? option.value : "";
  };

  const getStateValue = (text: string) => {
    const option = stateOptions.find((opt) => opt.text.toLowerCase() === text.toLowerCase());
    return option ? option.value : "";
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) {
      toast.error("No partner selected");
      return;
    }
    if (!user?.user_type) {
      toast.error("User authentication data missing");
      return;
    }

    const createdUserIdRaw = localStorage.getItem("userId") || "0";
    const statusValue = parseInt(selectedPartner.status) || 0;

    if (statusValue === 2 && !feedback.trim()) {
      toast.error("Feedback is required when rejecting a partner");
      return;
    }
    if (statusValue === 1 && feedback.trim()) {
      toast.error("Feedback must be empty when status is Approved");
      return;
    }
    if (
      !selectedPartner.name ||
      !selectedPartner.mobile ||
      !selectedPartner.email ||
      !selectedPartner.state ||
      !selectedPartner.city ||
      !selectedPartner.pincode
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    const formData = new FormData();
    formData.append("name", selectedPartner.name);
    formData.append("mobile", selectedPartner.mobile);
    formData.append("email", selectedPartner.email);
    formData.append("state", selectedPartner.state);
    formData.append("city", selectedPartner.city);
    formData.append("location", selectedPartner.location || "");
    formData.append("address", selectedPartner.address || "");
    formData.append("pincode", selectedPartner.pincode);
    formData.append("company_name", selectedPartner.company_name || "");
    formData.append("company_number", selectedPartner.company_number || "");
    formData.append("company_address", selectedPartner.company_address || "");
    formData.append("representative_name", selectedPartner.representative_name || "");
    formData.append("pan_card_number", selectedPartner.pan_card_number || "");
    formData.append("aadhar_number", selectedPartner.aadhar_number || "");
    formData.append("account_number", selectedPartner.account_number || "");
    formData.append("ifsc_code", selectedPartner.ifsc_code || "");
    formData.append("rera_number", selectedPartner.rera_number || "");
    formData.append("gst_number", selectedPartner.gst_number || "");
    formData.append("status", statusValue.toString());
    formData.append("feedback", statusValue === 2 ? feedback : "");
    formData.append("created_user_id", createdUserIdRaw);
    formData.append("created_user_type", user.user_type.toString());
    if (photoFile) {
      formData.append("photo", photoFile);
    }
    if (companyLogoFile) {
      formData.append("company_logo", companyLogoFile);
    }

    dispatch(updateUser({ id: selectedPartner.id, formData }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (selectedPartner) {
      setSelectedPartner({ ...selectedPartner, [field]: value });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleCompanyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogoFile(e.target.files[0]);
    }
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    handleInputChange("city", ""); // Reset city when state changes
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!selectedPartner) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          No Partner Selected
        </h2>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <PageMeta title="Edit Channel Partner" />
      <ComponentCard title="Edit Channel Partner">
        <form onSubmit={handleSave} className="space-y-6">
          {updateSuccess && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              Channel partner updated successfully
            </div>
          )}
          {updateError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {updateError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="min-h-[80px]">
              <Label htmlFor="name">Name *</Label>
              <Input
                type="text"
                id="name"
                value={selectedPartner.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter partner name"
                disabled={updateLoading}
                required
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                type="text"
                id="mobile"
                value={selectedPartner.mobile || ""}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="Enter mobile number"
                disabled={updateLoading}
                required
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="email">Email ID *</Label>
              <Input
                type="email"
                id="email"
                value={selectedPartner.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="example@domain.com"
                disabled={updateLoading}
                required
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="state">State *</Label>
              <select
                id="state"
                value={selectedState}
                onChange={(e) => {
                  handleStateChange(e.target.value);
                  const selectedOption = stateOptions.find(
                    (opt) => opt.value === e.target.value
                  );
                  handleInputChange("state", selectedOption?.text || "");
                }}
                disabled={updateLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                required
              >
                <option value="">Select State</option>
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="city">City *</Label>
              <select
                id="city"
                value={getCityValue(selectedPartner.city || "")}
                onChange={(e) => {
                  const selectedOption = cityOptions.find(
                    (opt) => opt.value === e.target.value
                  );
                  handleInputChange("city", selectedOption?.text || "");
                }}
                disabled={updateLoading || !selectedState}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                required
              >
                <option value="">Select City</option>
                {cityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="location">Location *</Label>
              <Input
                type="text"
                id="location"
                value={selectedPartner.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter location"
                disabled={updateLoading}
                required
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                value={selectedPartner.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter address"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                type="text"
                id="pincode"
                value={selectedPartner.pincode || ""}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                placeholder="Enter pincode"
                disabled={updateLoading}
                required
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                type="text"
                id="company_name"
                value={selectedPartner.company_name || ""}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                placeholder="Enter company name"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="company_number">Company Number</Label>
              <Input
                type="text"
                id="company_number"
                value={selectedPartner.company_number || ""}
                onChange={(e) => handleInputChange("company_number", e.target.value)}
                placeholder="Enter company number"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="company_address">Company Address</Label>
              <Input
                type="text"
                id="company_address"
                value={selectedPartner.company_address || ""}
                onChange={(e) => handleInputChange("company_address", e.target.value)}
                placeholder="Enter company address"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="representative_name">Representative Name</Label>
              <Input
                type="text"
                id="representative_name"
                value={selectedPartner.representative_name || ""}
                onChange={(e) => handleInputChange("representative_name", e.target.value)}
                placeholder="Enter representative name"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="pan_card_number">PAN Card Number</Label>
              <Input
                type="text"
                id="pan_card_number"
                value={selectedPartner.pan_card_number || ""}
                onChange={(e) => handleInputChange("pan_card_number", e.target.value)}
                placeholder="Enter PAN card number"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="aadhar_number">Aadhar Number</Label>
              <Input
                type="text"
                id="aadhar_number"
                value={selectedPartner.aadhar_number || ""}
                onChange={(e) => handleInputChange("aadhar_number", e.target.value)}
                placeholder="Enter Aadhar number"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                type="text"
                id="account_number"
                value={selectedPartner.account_number || ""}
                onChange={(e) => handleInputChange("account_number", e.target.value)}
                placeholder="Enter account number"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="ifsc_code">IFSC Code</Label>
              <Input
                type="text"
                id="ifsc_code"
                value={selectedPartner.ifsc_code || ""}
                onChange={(e) => handleInputChange("ifsc_code", e.target.value)}
                placeholder="Enter IFSC code"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="rera_number">RERA Number</Label>
              <Input
                type="text"
                id="rera_number"
                value={selectedPartner.rera_number || ""}
                onChange={(e) => handleInputChange("rera_number", e.target.value)}
                placeholder="Enter RERA number"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="gst_number">GST Number</Label>
              <Input
                type="text"
                id="gst_number"
                value={selectedPartner.gst_number || ""}
                onChange={(e) => handleInputChange("gst_number", e.target.value)}
                placeholder="Enter GST number"
                disabled={updateLoading}
              />
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="photo">Photo</Label>
              <Input
                type="file"
                id="photo"
                accept=".jpg,.jpeg,.png"
                onChange={handlePhotoChange}
                disabled={updateLoading}
              />
              {selectedPartner.photo && !photoFile && (
                <img
                  src={selectedPartner.photo}
                  alt="Current partner photo"
                  className="mt-2 w-24 h-24 object-cover rounded"
                />
              )}
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="company_logo">Company Logo</Label>
              <Input
                type="file"
                id="company_logo"
                accept=".jpg,.jpeg,.png"
                onChange={handleCompanyLogoChange}
                disabled={updateLoading}
              />
              {selectedPartner.company_logo && !companyLogoFile && (
                <img
                  src={selectedPartner.company_logo}
                  alt="Current company logo"
                  className="mt-2 w-24 h-24 object-cover rounded"
                />
              )}
            </div>
            <div className="min-h-[80px]">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                value={selectedPartner.status || ""}
                onChange={(e) => handleInputChange("status", e.target.value)}
                disabled={updateLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
            {selectedPartner.status === "2" && (
              <div className="min-h-[80px]">
                <Label htmlFor="feedback">Feedback (Required for Rejected Status)</Label>
                <Input
                  type="text"
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter feedback for rejection"
                  disabled={updateLoading}
                  required
                />
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-[30%] px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={updateLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-[30%] px-4 py-2 text-white bg-[#1D3A76] rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={updateLoading}
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default EditChannelPartner;