import React, { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import MultiSelect from "../../components/form/MultiSelect";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import { EyeCloseIcon, EyeIcon, EnvelopeIcon } from "../../icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getCities, getStates } from "../../store/slices/propertyDetails";
import { createEmployee, clearMessages } from "../../store/slices/employee";
import Dropdown from "../../components/form/Dropdown";

interface FormData {
  name: string;
  mobile: string;
  email: string;
  designation: string[];
  password: string;
  city: string[];
  state: string[];
  pincode: string;
  reraFile: File | null;
  gstFile: File | null;
  bankCheque: File | null;
  address: string;
  gstNumber: string; // New field
  reraNumber: string; // New field
  bankAccountNumber: string; // New field
  ifscCode: string; // New field
  bankName: string; // New field
}

interface Errors {
  name?: string;
  mobile?: string;
  email?: string;
  designation?: string;
  password?: string;
  city?: string;
  state?: string;
  pincode?: string;
  reraFile?: string;
  gstFile?: string;
  bankCheque?: string;
  address?: string;
  gstNumber?: string; // New field
  reraNumber?: string; // New field
  bankAccountNumber?: string; // New field
  ifscCode?: string; // New field
  bankName?: string; // New field
}

interface Option {
  value: string;
  text: string;
}

export default function AddChannelPartner() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { cities, states } = useSelector((state: RootState) => state.property);
  const { createLoading, createError, createSuccess } = useSelector(
    (state: RootState) => state.employee
  );
  const pageUserType = useSelector((state: RootState) => state.auth.user?.user_type);

  useEffect(() => {
    dispatch(getCities());
    dispatch(getStates());
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess) {
      setFormData({
        name: "",
        mobile: "",
        email: "",
        designation: [],
        password: "",
        city: [],
        state: [],
        pincode: "",
        reraFile: null,
        gstFile: null,
        bankCheque: null,
        address: "",
        gstNumber: "", // New field
        reraNumber: "", // New field
        bankAccountNumber: "", // New field
        ifscCode: "", // New field
        bankName: "", // New field
      });
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [createSuccess, dispatch]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    designation: [],
    password: "",
    city: [],
    state: [],
    pincode: "",
    reraFile: null,
    gstFile: null,
    bankCheque: null,
    address: "",
    gstNumber: "", // New field
    reraNumber: "", // New field
    bankAccountNumber: "", // New field
    ifscCode: "", // New field
    bankName: "", // New field
  });

  const [errors, setErrors] = useState<Errors>({});

  // Base designation options
  const allDesignationOptions: Option[] = [
    { value: "7", text: "Manager" },
    { value: "8", text: "TeleCaller" },
    { value: "9", text: "Marketing Executive" },
    { value: "10", text: "Customer Support" },
    { value: "11", text: "Customer Service" },
  ];

  // Filter out "Manager" if pageUserType === 7
  const designationOptions: Option[] =
    pageUserType === 7
      ? allDesignationOptions.filter((option) => option.value !== "7")
      : allDesignationOptions;

  const cityOptions: Option[] =
    cities?.map((city: any) => ({
      value: city.value,
      text: city.label,
    })) || [];

  const stateOptions: Option[] =
    states?.map((state: any) => ({
      value: state.value,
      text: state.label,
    })) || [];

  // Bank Name options for dropdown
  const bankNameOptions: Option[] = [
    { value: "sbi", text: "State Bank of India" },
    { value: "hdfc", text: "HDFC Bank" },
    { value: "icici", text: "ICICI Bank" },
    { value: "axis", text: "Axis Bank" },
    { value: "kotak", text: "Kotak Mahindra Bank" },
    { value: "pnb", text: "Punjab National Bank" },
    { value: "bob", text: "Bank of Baroda" },
    { value: "union", text: "Union Bank of India" },
  ];

  const countries = [{ code: "IN", label: "+91" }];

  const handleSingleChange =
    (
      field:
        | "name"
        | "mobile"
        | "email"
        | "password"
        | "pincode"
        | "address"
        | "gstNumber" // New field
        | "reraNumber" // New field
        | "bankAccountNumber" // New field
        | "ifscCode" // New field
        | "bankName" // New field
    ) =>
    (value: string) => {
      setFormData({ ...formData, [field]: value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const handleMultiSelectChange =
    (field: "designation" | "city" | "state") => (values: string[]) => {
      setFormData({ ...formData, [field]: values });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const handleFileChange =
    (field: "reraFile" | "gstFile" | "bankCheque") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        const validFileTypes =
          field === "bankCheque"
            ? ["image/jpeg", "image/png"]
            : ["image/jpeg", "image/png", "application/pdf"];
        if (!validFileTypes.includes(file.type)) {
          setErrors({
            ...errors,
            [field]: `Only ${validFileTypes.join(", ")} files are allowed`,
          });
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          setErrors({
            ...errors,
            [field]: "File size must be less than 10MB",
          });
          return;
        }
      }
      setFormData({ ...formData, [field]: file });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const handleDeleteFile = (field: "reraFile" | "gstFile" | "bankCheque") => () => {
    setFormData({ ...formData, [field]: null });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (formData.designation.length === 0)
      newErrors.designation = "At least one designation is required";

    if (!formData.password) newErrors.password = "Password is required";
    if (formData.city.length === 0)
      newErrors.city = "At least one city is required";
    if (formData.state.length === 0)
      newErrors.state = "At least one state is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    // New validations
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = "GST Number is required";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = "Invalid GST Number (e.g., 22AAAAA0000A1Z5)";
    }
    if (!formData.reraNumber.trim()) {
      newErrors.reraNumber = "RERA Number is required";
    }
    if (!formData.bankAccountNumber.trim()) {
      newErrors.bankAccountNumber = "Bank Account Number is required";
    } else if (!/^\d{9,18}$/.test(formData.bankAccountNumber)) {
      newErrors.bankAccountNumber = "Bank Account Number must be 9 to 18 digits";
    }
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC Code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = "Invalid IFSC Code (e.g., SBIN0001234)";
    }
    if (!formData.bankName) {
      newErrors.bankName = "Bank Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const userType = localStorage.getItem("userType");
      const createdBy = localStorage.getItem("name");
      const createdUserIdRaw = localStorage.getItem("userId");

      // Map city ID to city name
      const selectedCityId = formData.city[0];
      const cityName =
        cityOptions.find((option) => option.value === selectedCityId)?.text ||
        selectedCityId;

      // Map state ID to state name
      const selectedStateId = formData.state[0];
      const stateName =
        stateOptions.find((option) => option.value === selectedStateId)?.text ||
        selectedStateId;

      // Map designation value to text
      const selectedDesignationId = formData.designation[0];
      const designationName =
        designationOptions.find((option) => option.value === selectedDesignationId)?.text ||
        selectedDesignationId;

      // Map bank name value to text
      const bankNameText =
        bankNameOptions.find((option) => option.value === formData.bankName)?.text ||
        formData.bankName;

      const employeeData = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        designation: designationName,
        password: formData.password,
        city: cityName,
        state: stateName,
        pincode: formData.pincode,
        reraFile: formData.reraFile ? formData.reraFile.name : null,
        gstFile: formData.gstFile ? formData.gstFile.name : null,
        bankCheque: formData.bankCheque ? formData.bankCheque.name : null,
        address: formData.address,
        gstNumber: formData.gstNumber, // New field
        reraNumber: formData.reraNumber, // New field
        bankAccountNumber: formData.bankAccountNumber, // New field
        ifscCode: formData.ifscCode, // New field
        bankName: bankNameText, // New field
        user_type: parseInt(selectedDesignationId),
        created_by: createdBy || "Unknown",
        created_userID: createdUserIdRaw ? parseInt(createdUserIdRaw) : 1,
      };

      console.log("Employee Data:", employeeData);
      dispatch(createEmployee(employeeData));
    }
  };

  return (
    <div className="relative min-h-screen">
      <ComponentCard title="Create Channel Partner">
        <form onSubmit={handleSubmit} className="space-y-6">
          {createSuccess && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              {createSuccess}
            </div>
          )}
          {createError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {createError}
            </div>
          )}

          <div className="min-h-[80px]">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleSingleChange("name")(e.target.value)}
              placeholder="Enter your name"
              disabled={createLoading}
              className="dark:bg-gray-800"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label>Mobile Number</Label>
            <PhoneInput
              selectPosition="start"
              countries={countries}
              value={formData.mobile}
              placeholder="Enter mobile number"
              onChange={handleSingleChange("mobile")}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="email">Email ID</Label>
            <div className="relative">
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleSingleChange("email")(e.target.value)}
                placeholder="example@domain.com"
                className="pl-[62px] dark:bg-gray-800"
                disabled={createLoading}
              />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <EnvelopeIcon className="size-6" />
              </span>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative mb-10 min-h-[80px]">
            <MultiSelect
              label="Designation"
              options={designationOptions}
              defaultSelected={formData.designation}
              onChange={handleMultiSelectChange("designation")}
              disabled={createLoading}
              singleSelect={true}
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleSingleChange("password")(e.target.value)}
                placeholder="Enter password"
                className="dark:bg-gray-800"
                disabled={createLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                disabled={createLoading}
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-main dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-main dark:fill-gray-400 size-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="relative mb-10 min-h-[80px]">
            <MultiSelect
              label="City"
              options={cityOptions}
              defaultSelected={formData.city}
              onChange={handleMultiSelectChange("city")}
              disabled={createLoading}
              singleSelect={true}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              type="text"
              id="pincode"
              value={formData.pincode}
              onChange={(e) => handleSingleChange("pincode")(e.target.value)}
              placeholder="Enter pincode"
              className="dark:bg-gray-800"
              disabled={createLoading}
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
            )}
          </div>

          <div className="relative mb-10 min-h-[80px]">
            <MultiSelect
              label="State"
              options={stateOptions}
              defaultSelected={formData.state}
              onChange={handleMultiSelectChange("state")}
              disabled={createLoading}
              singleSelect={true}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>

          {/* New GST Number Field */}
          <div className="min-h-[80px]">
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input
              type="text"
              id="gstNumber"
              value={formData.gstNumber}
              onChange={(e) => handleSingleChange("gstNumber")(e.target.value)}
              placeholder="Enter GST Number (e.g., 22AAAAA0000A1Z5)"
              className="dark:bg-gray-800"
              disabled={createLoading}
            />
            {errors.gstNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>
            )}
          </div>

          {/* New RERA Number Field */}
          <div className="min-h-[80px]">
            <Label htmlFor="reraNumber">RERA Number</Label>
            <Input
              type="text"
              id="reraNumber"
              value={formData.reraNumber}
              onChange={(e) => handleSingleChange("reraNumber")(e.target.value)}
              placeholder="Enter RERA Number"
              className="dark:bg-gray-800"
              disabled={createLoading}
            />
            {errors.reraNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.reraNumber}</p>
            )}
          </div>

          {/* New Bank Account Number Field */}
          <div className="min-h-[80px]">
            <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
            <Input
              type="text"
              id="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={(e) => handleSingleChange("bankAccountNumber")(e.target.value)}
              placeholder="Enter Bank Account Number"
              className="dark:bg-gray-800"
              disabled={createLoading}
            />
            {errors.bankAccountNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.bankAccountNumber}</p>
            )}
          </div>

          {/* New IFSC Code Field */}
          <div className="min-h-[80px]">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              type="text"
              id="ifscCode"
              value={formData.ifscCode}
              onChange={(e) => handleSingleChange("ifscCode")(e.target.value)}
              placeholder="Enter IFSC Code (e.g., SBIN0001234)"
              className="dark:bg-gray-800"
              disabled={createLoading}
            />
            {errors.ifscCode && (
              <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
            )}
          </div>

          {/* New Bank Name Dropdown */}
          <div className="min-h-[80px]">
            <Dropdown
              id="bankName"
              label="Bank Name"
              options={bankNameOptions}
              value={formData.bankName}
              onChange={handleSingleChange("bankName")}
              placeholder="Search banks..."
              disabled={createLoading}
              error={errors.bankName}
            />
          </div>

          <div className="min-h-[80px] space-y-2">
            <Label htmlFor="reraFile">RERA Document</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="reraFile"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange("reraFile")}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1D3A76] file:text-white hover:file:bg-blue-700"
                disabled={createLoading}
              />
              {formData.reraFile && (
                <button
                  type="button"
                  onClick={handleDeleteFile("reraFile")}
                  className="text-red-500 hover:text-red-700"
                  disabled={createLoading}
                >
                  Delete
                </button>
              )}
            </div>
            {errors.reraFile && (
              <p className="text-red-500 text-sm mt-1">{errors.reraFile}</p>
            )}
            <div className="min-h-[60px] flex items-end">
              {formData.reraFile ? (
                formData.reraFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(formData.reraFile)}
                    alt="RERA Document Preview"
                    className="max-w-[100px] max-h-[100px] object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500 truncate">{formData.reraFile.name}</p>
                )
              ) : (
                <p className="text-sm text-gray-400">No file selected</p>
              )}
            </div>
          </div>

          <div className="min-h-[80px] space-y-2">
            <Label htmlFor="gstFile">GST Document</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="gstFile"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange("gstFile")}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1D3A76] file:text-white hover:file:bg-blue-700"
                disabled={createLoading}
              />
              {formData.gstFile && (
                <button
                  type="button"
                  onClick={handleDeleteFile("gstFile")}
                  className="text-red-500 hover:text-red-700"
                  disabled={createLoading}
                >
                  Delete
                </button>
              )}
            </div>
            {errors.gstFile && (
              <p className="text-red-500 text-sm mt-1">{errors.gstFile}</p>
            )}
            <div className="min-h-[60px] flex items-end">
              {formData.gstFile ? (
                formData.gstFile.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(formData.gstFile)}
                    alt="GST Document Preview"
                    className="max-w-[100px] max-h-[100px] object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500 truncate">{formData.gstFile.name}</p>
                )
              ) : (
                <p className="text-sm text-gray-400">No file selected</p>
              )}
            </div>
          </div>

          <div className="min-h-[80px] space-y-2">
            <Label htmlFor="bankCheque">Bank Account Cheque</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="bankCheque"
                accept="image/jpeg,image/png"
                onChange={handleFileChange("bankCheque")}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#1D3A76] file:text-white hover:file:bg-blue-700"
                disabled={createLoading}
              />
              {formData.bankCheque && (
                <button
                  type="button"
                  onClick={handleDeleteFile("bankCheque")}
                  className="text-red-500 hover:text-red-700"
                  disabled={createLoading}
                >
                  Delete
                </button>
              )}
            </div>
            {errors.bankCheque && (
              <p className="text-red-500 text-sm mt-1">{errors.bankCheque}</p>
            )}
            <div className="min-h-[60px] flex items-end">
              {formData.bankCheque ? (
                <img
                  src={URL.createObjectURL(formData.bankCheque)}
                  alt="Bank Cheque Preview"
                  className="max-w-[100px] max-h-[100px] object-contain"
                />
              ) : (
                <p className="text-sm text-gray-400">No file selected</p>
              )}
            </div>
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="address">Address</Label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleSingleChange("address")(e.target.value)}
              placeholder="Enter address"
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              disabled={createLoading}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[60%] px-4 py-2 text-white bg-[#1D3A76] rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={createLoading}
            >
              {createLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}