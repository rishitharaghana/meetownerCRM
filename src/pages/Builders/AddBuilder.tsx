import React, { useEffect, useState } from "react";
import { User, MapPin, KeyRound, Mail, EyeIcon, EyeOff, Landmark, Image } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import Input from "../../components/form/input/InputField";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import toast from "react-hot-toast";
import Dropdown from "../../components/form/Dropdown";
import { useNavigate } from "react-router";
import { setCityDetails } from "../../store/slices/propertyDetails";
import { insertUser, InsertUserRequest } from "../../store/slices/userslice";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface FormData {
  name: string;
  mobile: string;
  email: string;
  password: string;
  city: string;
  state: string;
  locality: string;
  pincode: string;
  panCardNumber: string;
  aadharNumber: string;
  companyName: string;
  companyAddress: string;
  companyNumber: string;
  companyLogo: File | null;
  gstNumber: string;
  reraNumber: string;
  address: string;
  photo: File | null;
}

interface Errors {
  [key: string]: string | undefined;
}

const AddBuilder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { states, cities } = useSelector((state: RootState) => state.property);
  const { loading } = useSelector((state: RootState) => state.user);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { citiesQuery } = usePropertyQueries();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    password: "",
    city: "",
    state: "",
    locality: "",
    pincode: "",
    panCardNumber: "",
    aadharNumber: "",
    companyName: "",
    companyAddress: "",
    companyNumber: "",
    companyLogo: null,
    gstNumber: "",
    reraNumber: "",
    address: "",
    photo: null,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const citiesResult = citiesQuery(formData.state ? parseInt(formData.state) : undefined);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      toast.error("Please log in to access this page");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  useEffect(() => {
    if (citiesResult.isError) {
      toast.error(`Failed to fetch cities: ${citiesResult.error?.message || "Unknown error"}`);
    }
  }, [citiesResult.isError, citiesResult.error]);

  const cityOptions = cities?.map((city: any) => ({
    value: city.value,
    text: city.label,
  })) || [];

  const stateOptions = states?.map((state: any) => ({
    value: state.value,
    text: state.label,
  })) || [];

  const handleChange = (field: keyof FormData) => (value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleDropdownChange = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "state" && { city: "" }),
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Mobile must be 10 digits";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(
        formData.password
      )
    )
      newErrors.password =
        "Password must be 8-12 characters, including uppercase, lowercase, number, and special character";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.locality.trim()) newErrors.locality = "Locality is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";
    if (formData.panCardNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNumber))
      newErrors.panCardNumber = "Invalid PAN (e.g., ABCDE1234F)";
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber))
      newErrors.aadharNumber = "Aadhar must be 12 digits";
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.companyAddress.trim()) newErrors.companyAddress = "Company address is required";
    if (!formData.companyNumber.trim()) newErrors.companyNumber = "Company number is required";
    else if (!/^\d{10}$/.test(formData.companyNumber))
      newErrors.companyNumber = "Company number must be 10 digits";
    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber))
      newErrors.gstNumber = "Invalid GST number (e.g., 22ABCDE1234F1Z5)";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (formData.companyLogo && !["image/jpeg", "image/png"].includes(formData.companyLogo.type))
      newErrors.companyLogo = "Company logo must be JPEG or PNG";
    if (formData.photo && !["image/jpeg", "image/png"].includes(formData.photo.type))
      newErrors.photo = "Photo must be JPEG or PNG";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cityName = cityOptions.find((option) => option.value === formData.city)?.text || "";
    const stateName = stateOptions.find((option) => option.value === formData.state)?.text || "";

    const payload: InsertUserRequest = {
      user_type: 2,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      password: formData.password,
      status: 1,
      state: stateName,
      city: cityName,
      location: formData.locality,
      address: formData.address,
      pincode: formData.pincode,
      gst_number: formData.gstNumber || undefined,
      rera_number: formData.reraNumber || undefined,
      created_by: user?.name || "Admin",
      created_user_id: user?.id || 1,
      created_user_type: user?.user_type || 1,
      company_name: formData.companyName,
      company_number: formData.companyNumber,
      company_address: formData.companyAddress,
      pan_card_number: formData.panCardNumber || undefined, 
      aadhar_number: formData.aadharNumber || undefined, 
      photo: formData.photo || undefined,
      company_logo: formData.companyLogo || undefined,
    };

    const formDataToSend = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataToSend.append(key, value instanceof File ? value : String(value));
      }
    });

    try {
      const result = await dispatch(insertUser(formDataToSend)).unwrap();
      toast.success(`Builder added successfully with ID: ${result.user_id}`);
      setFormData({
        name: "",
        mobile: "",
        email: "",
        password: "",
        city: "",
        state: "",
        locality: "",
        pincode: "",
        panCardNumber: "",
        aadharNumber: "",
        companyName: "",
        companyAddress: "",
        companyNumber: "",
        companyLogo: null,
        gstNumber: "",
        reraNumber: "",
        address: "",
        photo: null,
      });
      setErrors({});
    } catch (err) {
      // Error is handled in the user slice
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white py-10 px-4">
      <div className="flex justify-end">
        <PageBreadcrumb items={[{ label: "Builders", link: "/builders" }, { label: "Add Builder" }]} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Add Builder</h1>
          <p className="text-gray-600">Fill in the details below to add a new builder</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 rounded-2xl shadow-xl p-8 border border-white/30 space-y-6"
          encType="multipart/form-data"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <User size={16} /> Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name")(e.target.value)}
              placeholder="Enter name"
            />
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
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Mail size={16} /> Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email")(e.target.value)}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">⚠️ {errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Landmark size={16} /> Company Name
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) => handleChange("companyName")(e.target.value)}
              placeholder="Enter company name"
            />
            {errors.companyName && <p className="text-red-600 text-sm mt-1">⚠️ {errors.companyName}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Company Address</label>
            <textarea
              value={formData.companyAddress}
              onChange={(e) => handleChange("companyAddress")(e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-md"
              placeholder="Enter company address"
            />
            {errors.companyAddress && <p className="text-red-600 text-sm mt-1">⚠️ {errors.companyAddress}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Company Phone</label>
            <PhoneInput
              countries={[{ code: "IN", label: "+91" }]}
              value={formData.companyNumber}
              placeholder="Enter company phone number"
              onChange={handleChange("companyNumber")}
            />
            {errors.companyNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.companyNumber}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Image size={16} /> Company Logo
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleChange("companyLogo")(e.target.files?.[0] || null)}
              className="w-full p-3 border rounded-md"
            />
            {errors.companyLogo && <p className="text-red-600 text-sm mt-1">⚠️ {errors.companyLogo}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">GST Number </label>
            <Input
              value={formData.gstNumber}
              onChange={(e) => handleChange("gstNumber")(e.target.value)}
              placeholder="Enter GST number (e.g., 22ABCDE1234F1Z5)"
            />
            {errors.gstNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.gstNumber}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">RERA Number</label>
            <Input
              value={formData.reraNumber}
              onChange={(e) => handleChange("reraNumber")(e.target.value)}
              placeholder="Enter RERA number"
            />
            {errors.reraNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.reraNumber}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange("address")(e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-md"
              placeholder="Enter address"
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">⚠️ {errors.address}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Locality</label>
            <Input
              value={formData.locality}
              onChange={(e) => handleChange("locality")(e.target.value)}
              placeholder="Enter locality"
            />
            {errors.locality && <p className="text-red-600 text-sm mt-1">⚠️ {errors.locality}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">PAN Card Number </label>
            <Input
              value={formData.panCardNumber}
              onChange={(e) => handleChange("panCardNumber")(e.target.value)}
              placeholder="Enter PAN card number (e.g., ABCDE1234F)"
            />
            {errors.panCardNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.panCardNumber}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Aadhar Number </label>
            <Input
              value={formData.aadharNumber}
              onChange={(e) => handleChange("aadharNumber")(e.target.value)}
              placeholder="Enter 12-digit Aadhar number"
            />
            {errors.aadharNumber && <p className="text-red-600 text-sm mt-1">⚠️ {errors.aadharNumber}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Image size={16} /> Photo
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleChange("photo")(e.target.files?.[0] || null)}
              className="w-full p-3 border rounded-md"
            />
            {errors.photo && <p className="text-red-600 text-sm mt-1">⚠️ {errors.photo}</p>}
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <KeyRound size={16} /> Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password")(e.target.value)}
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9"
            >
              {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
            </button>
            {errors.password && <p className="text-red-600 text-sm mt-1">⚠️ {errors.password}</p>}
          </div>

          <div>
            <Dropdown
              id="state"
              label="Select State"
              options={stateOptions}
              value={formData.state}
              onChange={handleDropdownChange("state")}
              placeholder="Search for a state..."
              error={errors.state}
            />
          </div>

          <div>
            <Dropdown
              id="city"
              label="Select City"
              options={cityOptions}
              value={formData.city}
              onChange={handleDropdownChange("city")}
              placeholder="Search for a city..."
              disabled={!formData.state}
              error={errors.city}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin size={16} /> Pincode
            </label>
            <Input
              value={formData.pincode}
              onChange={(e) => handleChange("pincode")(e.target.value)}
              placeholder="Enter pincode"
            />
            {errors.pincode && <p className="text-red-600 text-sm mt-1">⚠️ {errors.pincode}</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-900 text-white font-semibold rounded-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBuilder;