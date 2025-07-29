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

const allDesignationOptions: Option[] = [
  { value: "7", text: "Manager" },
  { value: "8", text: "TeleCaller" },
  { value: "9", text: "Marketing Executive" },
  { value: "10", text: "Customer Support" },
  { value: "11", text: "Customer Service" },
];

const statusOptions: Option[] = [
  { value: "1", text: "Approved" },
  { value: "2", text: "Rejected" },
];

const EditEmployee: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { employee } = location.state || {};
  const { states } = useSelector((state: RootState) => state.property);
  const { updateLoading, updateError, updateSuccess } = useSelector(
    (state: RootState) => state.user
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const { citiesQuery } = usePropertyQueries();

  const [selectedEmployee, setSelectedEmployee] = useState<any>(employee || null);
  const [feedback, setFeedback] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null); // Track photo file separately
  const [selectedState, setSelectedState] = useState<string>(
    employee?.state
      ? states?.find((s: any) => s.label.toLowerCase() === employee.state.toLowerCase())?.value?.toString() || ""
      : ""
  );

  const designationOptions: Option[] =
    user?.user_type === 7
      ? allDesignationOptions.filter((option) => option.value !== "7")
      : allDesignationOptions;

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
      toast.success("Employee updated successfully");
      setTimeout(() => {
        navigate(-1);
        dispatch(clearMessages());
      }, 1000);
    }
  }, [updateSuccess, navigate, dispatch, employee]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
    }
  }, [updateError]);

  const getDesignationValue = (text: string) => {
    const option = designationOptions.find((opt) => opt.text.toLowerCase() === text.toLowerCase());
    return option ? option.value : "";
  };

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
    if (!selectedEmployee) {
      toast.error("No employee selected");
      return;
    }
    if (!user?.user_type) {
      toast.error("User authentication data missing");
      return;
    }

    const createdUserIdRaw = localStorage.getItem("userId") || "0";
    const statusValue = parseInt(selectedEmployee.status) || 0;

    if (statusValue === 2 && !feedback.trim()) {
      toast.error("Feedback is required when rejecting an employee");
      return;
    }
    if (statusValue === 1 && feedback.trim()) {
      toast.error("Feedback must be empty when status is Approved");
      return;
    }
    if (!selectedEmployee.name || !selectedEmployee.mobile || !selectedEmployee.email || 
        !selectedEmployee.state || !selectedEmployee.city || !selectedEmployee.pincode) {
      toast.error("All required fields must be filled");
      return;
    }

    const formData = new FormData();
    formData.append("name", selectedEmployee.name);
    formData.append("mobile", selectedEmployee.mobile);
    formData.append("email", selectedEmployee.email);
    formData.append("state", selectedEmployee.state);
    formData.append("city", selectedEmployee.city);
    formData.append("location", selectedEmployee.location || "");
    formData.append("address", selectedEmployee.address || "");
    formData.append("pincode", selectedEmployee.pincode);
    formData.append("status", statusValue.toString());
    formData.append("feedback", statusValue === 2 ? feedback : "");
    formData.append("created_user_id", createdUserIdRaw);
    formData.append("created_user_type", user.user_type.toString());
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    dispatch(updateUser({ id: selectedEmployee.id, formData }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (selectedEmployee) {
      setSelectedEmployee({ ...selectedEmployee, [field]: value });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    handleInputChange("city", ""); // Reset city when state changes
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!selectedEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          No Employee Selected
        </h2>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <PageMeta title="Edit Employee" />
      <ComponentCard title="Edit Employee">
        <form onSubmit={handleSave} className="space-y-6">
          {updateSuccess && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              Employee updated successfully
            </div>
          )}
          {updateError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {updateError}
            </div>
          )}
          <div className="min-h-[80px]">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={selectedEmployee.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter employee name"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              type="text"
              id="mobile"
              value={selectedEmployee.mobile || ""}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              placeholder="Enter mobile number"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="email">Email ID</Label>
            <Input
              type="email"
              id="email"
              value={selectedEmployee.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="example@domain.com"
              disabled={updateLoading}
            />
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="designation">Designation</Label>
            <select
              id="designation"
              value={getDesignationValue(selectedEmployee.designation || "")}
              onChange={(e) => {
                const selectedOption = designationOptions.find(
                  (opt) => opt.value === e.target.value
                );
                handleInputChange("user_type", selectedOption?.value || "");
              }}
              disabled={updateLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select Designation</option>
              {designationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="state">State</Label>
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
            <Label htmlFor="city">City</Label>
            <select
              id="city"
              value={getCityValue(selectedEmployee.city || "")}
              onChange={(e) => {
                const selectedOption = cityOptions.find(
                  (opt) => opt.value === e.target.value
                );
                handleInputChange("city", selectedOption?.text || "");
              }}
              disabled={updateLoading || !selectedState}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              type="text"
              id="pincode"
              value={selectedEmployee.pincode || ""}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
              placeholder="Enter pincode"
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
            {selectedEmployee.photo && !photoFile && (
              <img
                src={selectedEmployee.photo}
                alt="Current employee photo"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={selectedEmployee.status || ""}
              onChange={(e) => handleInputChange("status", e.target.value)}
              disabled={updateLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
          {selectedEmployee.status === "2" && (
            <div className="min-h-[80px]">
              <Label htmlFor="feedback">Feedback (Required for Rejected Status)</Label>
              <Input
                type="text"
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter feedback for rejection"
                disabled={updateLoading}
              />
            </div>
          )}
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

export default EditEmployee;