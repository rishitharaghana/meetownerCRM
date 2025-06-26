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


interface FormData {
  name: string;
  mobile: string;
  email: string;
  password: string;
  city: string[];
  state: string[];
  pincode: string;
  panCardNumber: string; 
  companyName: string; 
  representativeName: string;
  companyAddress: string; 
  companyNumber: string;
}

interface Errors {
  name?: string;
  mobile?: string;
  email?: string;
  password?: string;
  city?: string;
  state?: string;
  pincode?: string;
  panCardNumber?: string; 
  companyName?: string;
  representativeName?: string;
  companyAddress?: string; 
  companyNumber?: string; 
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
        password: "",
        city: [],
        state: [],
        pincode: "",
        panCardNumber: "",
        companyName: "", 
        representativeName: "", 
        companyAddress: "", 
        companyNumber: "", 
      });
      
    }
  }, [createSuccess, dispatch]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    password: "",
    city: [],
    state: [],
    pincode: "",
    panCardNumber: "", 
    companyName: "", 
    representativeName: "",
    companyAddress: "", 
    companyNumber: "", 
  });

  const [errors, setErrors] = useState<Errors>({});

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

  const countries = [{ code: "IN", label: "+91" }];

  const handleSingleChange =
    (
      field:
        | "name"
        | "mobile"
        | "email"
        | "password"
        | "pincode"
        | "panCardNumber" 
        | "companyName" 
        | "representativeName" 
        | "companyAddress" 
        | "companyNumber" 
    ) =>
    (value: string) => {
      setFormData({ ...formData, [field]: value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    };

  const handleMultiSelectChange =
    (field: "city" | "state") => (values: string[]) => {
      setFormData({ ...formData, [field]: values });
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
    if (!formData.panCardNumber.trim()) {
      newErrors.panCardNumber = "PAN Card Number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNumber)) {
      newErrors.panCardNumber = "Invalid PAN Card Number (e.g., ABCDE1234F)";
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
    }
    if (!formData.representativeName.trim()) {
      newErrors.representativeName = "Representative Name is required";
    }
    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = "Company Address is required";
    }
    if (!formData.companyNumber.trim()) {
      newErrors.companyNumber = "Company Number is required";
    } else if (!/^\d{10}$/.test(formData.companyNumber)) {
      newErrors.companyNumber = "Company Number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
     
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

      const employeeData = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        city: cityName,
        state: stateName,
        pincode: formData.pincode,
        panCardNumber: formData.panCardNumber, // New field
        companyName: formData.companyName, // New field
        representativeName: formData.representativeName, // New field
        companyAddress: formData.companyAddress, // New field
        companyNumber: formData.companyNumber, // New field
        user_type: 7, // Assuming Channel Partner user_type is 7
        created_by: createdBy || "Unknown",
        created_userID: createdUserIdRaw ? parseInt(createdUserIdRaw) : 1,
      };

      console.log("Employee Data:", employeeData);
      
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

          <div className="min-h-[80px]">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => handleSingleChange("companyName")(e.target.value)}
              placeholder="Enter company name"
              className="dark:bg-gray-800"
              disabled={createLoading}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="representativeName">Representative Name</Label>
            <Input
              type="text"
              id="representativeName"
              value={formData.representativeName}
              onChange={(e) => handleSingleChange("representativeName")(e.target.value)}
              placeholder="Enter representative name"
              className="dark:bg-gray-800"
              disabled={createLoading}
            />
            {errors.representativeName && (
              <p className="text-red-500 text-sm mt-1">{errors.representativeName}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="companyAddress">Company Address</Label>
            <textarea
              id="companyAddress"
              value={formData.companyAddress}
              onChange={(e) => handleSingleChange("companyAddress")(e.target.value)}
              placeholder="Enter company address"
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              disabled={createLoading}
            />
            {errors.companyAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.companyAddress}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="companyNumber">Company Number</Label>
            <PhoneInput
              selectPosition="start"
              countries={countries}
              value={formData.companyNumber}
              placeholder="Enter company number"
              onChange={handleSingleChange("companyNumber")}
            />
            {errors.companyNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.companyNumber}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="panCardNumber">PAN Card Number</Label>
            <Input
              type="text"
              id="panCardNumber"
              value={formData.panCardNumber}
              onChange={(e) => handleSingleChange("panCardNumber")(e.target.value)}
              placeholder="Enter PAN Card Number (e.g., ABCDE1234F)"
              className="dark:bg-gray-800"
              disabled={createLoading}
            />
            {errors.panCardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.panCardNumber}</p>
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