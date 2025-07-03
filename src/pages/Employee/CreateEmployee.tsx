import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Users,
  KeyRound,
  Mail,
  EyeIcon,
  EyeOff,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getCities, getStates } from "../../store/slices/propertyDetails";
import { createEmployee, clearMessages } from "../../store/slices/employee";
import Input from "../../components/form/input/InputField";
import PhoneInput from "../../components/form/group-input/PhoneInput";

interface FormData {
  name: string;
  mobile: string;
  email: string;
  designation: string;
  password: string;
  city: string;
  state: string;
  pincode: string;
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
}

const CreateEmployee = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cities, states } = useSelector((state: RootState) => state.property);
  const { createLoading, createError, createSuccess } = useSelector((state: RootState) => state.employee);
  const pageUserType = useSelector((state: RootState) => state.auth.user?.user_type);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    designation: "",
    password: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);

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
        designation: "",
        password: "",
        city: "",
        state: "",
        pincode: "",
      });
      const timer = setTimeout(() => dispatch(clearMessages()), 2000);
      return () => clearTimeout(timer);
    }
  }, [createSuccess, dispatch]);

  const allDesignationOptions = [
    { value: "7", text: "Sales Manager" },
    { value: "8", text: "TeleCaller" },
    { value: "9", text: "Marketing Executive" },
    { value: "10", text: "Receptionist" },
  ];

  const designationOptions =
    pageUserType === 7
      ? allDesignationOptions.filter((option) => option.value !== "7")
      : allDesignationOptions;

  const cityOptions = cities?.map((c: any) => ({ value: c.value, text: c.label })) || [];
  const stateOptions = states?.map((s: any) => ({ value: s.value, text: s.label })) || [];

  const handleChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.designation) newErrors.designation = "Select a designation";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.city) newErrors.city = "Select a city";
    if (!formData.state) newErrors.state = "Select a state";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const createdBy = localStorage.getItem("name") || "Admin";
    const createdUserId = parseInt(localStorage.getItem("userId") || "1");
    const designationText = designationOptions.find(d => d.value === formData.designation)?.text || "";

    dispatch(
      createEmployee({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        pincode: formData.pincode,
        city: cityOptions.find(c => c.value === formData.city)?.text || formData.city,
        state: stateOptions.find(s => s.value === formData.state)?.text || formData.state,
        designation: designationText,
        user_type: parseInt(formData.designation),
        created_by: createdBy,
        created_userID: createdUserId,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-realty-50 to-white py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-4 shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Employee</h1>
          <p className="text-gray-600">Add a new team member to your organization</p>
        </div>

        {createSuccess && (
          <div className="p-3 mb-6 bg-green-100 text-green-700 rounded-md text-center">
            {createSuccess}
          </div>
        )}
        {createError && (
          <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-md text-center">
            {createError}
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><User size={16} /> Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name")(e.target.value)}
                placeholder="Enter employee name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">⚠️ {errors.name}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="text-sm font-medium text-gray-700">Mobile</label>
              <PhoneInput
                countries={[{ code: "IN", label: "+91" }]}
                value={formData.mobile}
                placeholder="Enter mobile number"
                onChange={handleChange("mobile")}
              />
              {errors.mobile && <p className="text-red-600 text-sm mt-1">⚠️ {errors.mobile}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Mail size={16} /> Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email")(e.target.value)}
                placeholder="example@domain.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">⚠️ {errors.email}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><Users size={16} /> Designation</label>
              <select
                value={formData.designation}
                onChange={(e) => handleChange("designation")(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value="" disabled>Select a designation</option>
                {designationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.text}</option>
                ))}
              </select>
              {errors.designation && <p className="text-red-600 text-sm mt-1">⚠️ {errors.designation}</p>}
            </div>

            {/* Password */}
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

            {/* City */}
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <select
                value={formData.city}
                onChange={(e) => handleChange("city")(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value="" disabled>Select city</option>
                {cityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.text}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-600 text-sm mt-1">⚠️ {errors.city}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1"><MapPin size={16} /> Pincode</label>
              <Input
                value={formData.pincode}
                onChange={(e) => handleChange("pincode")(e.target.value)}
                placeholder="Enter pincode"
              />
              {errors.pincode && <p className="text-red-600 text-sm mt-1">⚠️ {errors.pincode}</p>}
            </div>

            {/* State */}
            <div>
              <label className="text-sm font-medium text-gray-700">State</label>
              <select
                value={formData.state}
                onChange={(e) => handleChange("state")(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value="" disabled>Select state</option>
                {stateOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.text}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-600 text-sm mt-1">⚠️ {errors.state}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={createLoading}
                className="w-full py-3 bg-blue-900 text-white font-semibold rounded-xl "
              >
                {createLoading ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
