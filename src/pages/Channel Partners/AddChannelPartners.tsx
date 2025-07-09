import React, { useEffect, useState } from "react";
import {
  User,
  MapPin,
  KeyRound,
  Mail,
  EyeIcon,
  EyeOff,
  Landmark,
  Building2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

import Input from "../../components/form/input/InputField";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  mobile: string;
  email: string;
  password: string;
  city: string;
  state: string;
  pincode: string;
  panCardNumber: string;
  aadharNumber: string;
  companyName: string;
  representativeName: string;
  companyAddress: string;
  companyNumber: string;
}

interface Errors {
  [key: string]: string | undefined;
}

const AddChannelPartner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cities, states } = useSelector((state: RootState) => state.property);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    password: "",
    city: "",
    state: "",
    pincode: "",
    panCardNumber: "",
    aadharNumber: "",
    companyName: "",
    representativeName: "",
    companyAddress: "",
    companyNumber: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
   const { citiesQuery, statesQuery } = usePropertyQueries();

   useEffect(() => {
    if (citiesQuery.isError) {
      toast.error(`Failed to fetch cities: ${citiesQuery.error?.message || 'Unknown error'}`);
    }
    if (statesQuery.isError) {
      toast.error(`Failed to fetch states: ${statesQuery.error?.message || 'Unknown error'}`);
    }
  }, [citiesQuery.isError, citiesQuery.error, statesQuery.isError, statesQuery.error]);

  const cityOptions =
    cities?.map((city: any) => ({ value: city.value, text: city.label })) || [];

  const stateOptions =
    states?.map((state: any) => ({ value: state.value, text: state.label })) || [];

  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!formData.panCardNumber.trim()) {
      newErrors.panCardNumber = "PAN Card is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNumber)) {
      newErrors.panCardNumber = "Invalid PAN (ABCDE1234F)";
    }
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = "Aadhar is required";
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = "Aadhar must be 12 digits";
    }
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.representativeName.trim())
      newErrors.representativeName = "Representative is required";
    if (!formData.companyAddress.trim())
      newErrors.companyAddress = "Company address is required";
    if (!formData.companyNumber.trim()) {
      newErrors.companyNumber = "Company number is required";
    } else if (!/^\d{10}$/.test(formData.companyNumber)) {
      newErrors.companyNumber = "Company number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const createdBy = localStorage.getItem("name") || "Admin";
    const createdUserId = parseInt(localStorage.getItem("userId") || "1");

    const cityName =
      cityOptions.find((option) => option.value === formData.city)?.text || formData.city;

    const stateName =
      stateOptions.find((option) => option.value === formData.state)?.text || formData.state;

    const payload = {
      ...formData,
      city: cityName,
      state: stateName,
      user_type: 7, 
      created_by: createdBy,
      created_userID: createdUserId,
    };

    console.log("Channel Partner Data Submitted:", payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-900 rounded-full mb-4 shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Add Channel Partner</h1>
          <p className="text-gray-600">Fill in the details below to add a new partner</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><User size={16} /> Name</label>
            <Input value={formData.name} onChange={(e) => handleChange("name")(e.target.value)} placeholder="Enter name" />
            {errors.name && <p className="text-red-600 text-sm mt-1">⚠️ {errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mobile</label>
            <PhoneInput
              countries={[{ code: "IN", label: "+91" }]}
              value={formData.mobile}
              placeholder="Enter mobile"
              onChange={handleChange("mobile")}
            />
            {errors.mobile && <p className="text-red-600 text-sm mt-1">⚠️ {errors.mobile}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Mail size={16} /> Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email")(e.target.value)}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">⚠️ {errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700"><Landmark size={16} className="inline" /> Company Name</label>
            <Input value={formData.companyName} onChange={(e) => handleChange("companyName")(e.target.value)} />
            {errors.companyName && <p className="text-red-600 text-sm mt-1">⚠️ {errors.companyName}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Representative Name</label>
            <Input value={formData.representativeName} onChange={(e) => handleChange("representativeName")(e.target.value)} />
            {errors.representativeName && <p className="text-red-600 text-sm mt-1">⚠️ {errors.representativeName}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Company Address</label>
            <textarea
              value={formData.companyAddress}
              onChange={(e) => handleChange("companyAddress")(e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-md dark:bg-gray-800"
            />
            {errors.companyAddress && <p className="text-red-600 text-sm mt-1">⚠️ {errors.companyAddress}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Company Phone</label>
            <PhoneInput
              countries={[{ code: "IN", label: "+91" }]}
              value={formData.companyNumber}
              placeholder="Enter phone number"
              onChange={handleChange("companyNumber")}
            />
            {errors.companyNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.companyNumber}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">PAN Card Number</label>
            <Input value={formData.panCardNumber} onChange={(e) => handleChange("panCardNumber")(e.target.value)} />
            {errors.panCardNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.panCardNumber}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Aadhar Number</label>
            <Input value={formData.aadharNumber} onChange={(e) => handleChange("aadharNumber")(e.target.value)} />
            {errors.aadharNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.aadharNumber}</p>}
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><KeyRound size={16} /> Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password")(e.target.value)}
              placeholder="Enter password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9">
              {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
            </button>
            {errors.password && <p className="text-red-600 text-sm mt-1">⚠️ {errors.password}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <select
              value={formData.city}
              onChange={(e) => handleChange("city")(e.target.value)}
              className="w-full p-3 border rounded-md dark:bg-gray-800"
            >
              <option value="" disabled>Select a city</option>
              {cityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </select>
            {errors.city && <p className="text-red-600 text-sm mt-1">⚠️ {errors.city}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><MapPin size={16} /> Pincode</label>
            <Input
              value={formData.pincode}
              onChange={(e) => handleChange("pincode")(e.target.value)}
              placeholder="Enter pincode"
            />
            {errors.pincode && <p className="text-red-600 text-sm mt-1">⚠️ {errors.pincode}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">State</label>
            <select
              value={formData.state}
              onChange={(e) => handleChange("state")(e.target.value)}
              className="w-full p-3 border rounded-md dark:bg-gray-800"
            >
              <option value="" disabled>Select a state</option>
              {stateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </select>
            {errors.state && <p className="text-red-600 text-sm mt-1">⚠️ {errors.state}</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-900 text-white font-semibold rounded-xl "
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChannelPartner;
