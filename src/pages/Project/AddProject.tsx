import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Dropdown from "../../components/form/Dropdown";
import { AppDispatch, RootState } from "../../store/store";
import { getCities, getStates } from "../../store/slices/propertyDetails";
import DatePicker from "../../components/form/date-picker";

interface SelectOption {
  value: string;
  label: string;
}

interface Option {
  value: string;
  text: string;
}

interface SizeEntry {
  id: string;
  buildupArea: string;
  carpetArea: string;
  floorPlan: File | null;
}

interface AroundPropertyEntry {
  place: string;
  distance: string;
}

interface FormData {
  state: string;
  city: string;
  locality: string;
  propertyType: string;
  propertySubType: string;
  projectName: string;
  builderName: string;
  sizes: SizeEntry[];
  aroundProperty: AroundPropertyEntry[];
  brochure: File | null;
  priceSheet: File | null;
  isUpcoming: boolean;
  status: "Under Construction" | "Ready to Move";
  launchDate?: string;
}

interface Errors {
  state?: string;
  city?: string;
  locality?: string;
  propertyType?: string;
  propertySubType?: string;
  projectName?: string;
  builderName?: string;
  sizes?: {
    [key: string]: {
      buildupArea?: string;
      carpetArea?: string;
      floorPlan?: string;
    };
  };
  aroundProperty?: string;
  brochure?: string;
  priceSheet?: string;
  launchDate?: string;
}

export default function AddProject() {
  const dispatch = useDispatch<AppDispatch>();
  const { cities, states } = useSelector((state: RootState) => state.property);

  const [formData, setFormData] = useState<FormData>({
    state: "",
    city: "",
    locality: "",
    propertyType: "",
    propertySubType: "",
    projectName: "",
    builderName: "",
    sizes: [
      {
        id: `${Date.now()}-1`,
        buildupArea: "",
        carpetArea: "",
        floorPlan: null,
      },
    ],
    aroundProperty: [],
    brochure: null,
    priceSheet: null,
    isUpcoming: false,
    status: "Ready to Move",
    launchDate: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [placeAroundProperty, setPlaceAroundProperty] = useState("");
  const [distanceFromProperty, setDistanceFromProperty] = useState("");

  const brochureInputRef = useRef<HTMLInputElement>(null);
  const priceSheetInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(getCities());
    dispatch(getStates());
  }, [dispatch]);

  const localityOptions: Option[] = [
    { value: "locality1", text: "Locality 1" },
    { value: "locality2", text: "Locality 2" },
    { value: "locality3", text: "Locality 3" },
  ];

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

  const propertyTypeOptions: SelectOption[] = [
    { value: "Residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
  ];

  const residentialSubTypeOptions: SelectOption[] = [
    { value: "Apartment", label: "Apartment" },
    { value: "Independent House", label: "Independent House" },
    { value: "Independent Villa", label: "Independent Villa" },
    { value: "Plot", label: "Plot" },
    { value: "Land", label: "Land" },
  ];

  const commercialSubTypeOptions: SelectOption[] = [
    { value: "Office", label: "Office" },
    { value: "Retail Shop", label: "Retail Shop" },
    { value: "Show Room", label: "Show Room" },
    { value: "Warehouse", label: "Warehouse" },
    { value: "Plot", label: "Plot" },
    { value: "Others", label: "Others" },
  ];

  const propertySubTypeOptions =
    formData.propertyType === "Residential"
      ? residentialSubTypeOptions
      : formData.propertyType === "Commercial"
      ? commercialSubTypeOptions
      : [];

  const handleDropdownChange =
    (field: "state" | "city" | "locality") => (value: string, text: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "state" && { city: "", locality: "" }),
        ...(field === "city" && { locality: "" }),
      }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSelectChange =
    (field: "propertyType" | "propertySubType") => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "propertyType" && { propertySubType: "" }),
      }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleInputChange =
    (field: "projectName" | "builderName") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSizeChange =
    (id: string, field: "buildupArea" | "carpetArea") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        sizes: prev.sizes.map((size) =>
          size.id === id ? { ...size, [field]: e.target.value } : size
        ),
      }));
      setErrors((prev) => ({
        ...prev,
        sizes: {
          ...prev.sizes,
          [id]: { ...prev.sizes?.[id], [field]: undefined },
        },
      }));
    };

  const handleFileChange =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFormData((prev) => ({
        ...prev,
        sizes: prev.sizes.map((size) =>
          size.id === id ? { ...size, floorPlan: file } : size
        ),
      }));
      setErrors((prev) => ({
        ...prev,
        sizes: {
          ...prev.sizes,
          [id]: { ...prev.sizes?.[id], floorPlan: undefined },
        },
      }));
    };

  const handleBrochureButtonClick = () => {
    if (brochureInputRef.current) {
      brochureInputRef.current.click();
    }
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!validFileTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          brochure: "Only JPEG, PNG, or PDF files are allowed",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          brochure: "File size must be less than 10MB",
        }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, brochure: file }));
    setErrors((prev) => ({ ...prev, brochure: undefined }));
  };

  const handleDeleteBrochure = () => {
    setFormData((prev) => ({ ...prev, brochure: null }));
    setErrors((prev) => ({ ...prev, brochure: undefined }));
  };

  const handleDeleteFile = (id: string) => () => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size) =>
        size.id === id ? { ...size, floorPlan: null } : size
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [id]: { ...prev.sizes?.[id], floorPlan: undefined },
      },
    }));
  };

  const handlePriceSheetButtonClick = () => {
    if (priceSheetInputRef.current) {
      priceSheetInputRef.current.click();
    }
  };

  const handlePriceSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!validFileTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          priceSheet: "Only JPEG, PNG, or PDF files are allowed",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          priceSheet: "File size must be less than 10MB",
        }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, priceSheet: file }));
    setErrors((prev) => ({ ...prev, priceSheet: undefined }));
  };

  const handleDeletePriceSheet = () => {
    setFormData((prev) => ({ ...prev, priceSheet: null }));
    setErrors((prev) => ({ ...prev, priceSheet: undefined }));
  };

  const handleDeleteSize = (id: string) => () => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size.id !== id),
    }));
    setErrors((prev) => ({
      ...prev,
      sizes: Object.fromEntries(
        Object.entries(prev.sizes || {}).filter(([key]) => key !== id)
      ),
    }));
  };

  const handleAddSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        {
          id: `${Date.now()}-${prev.sizes.length + 1}`,
          buildupArea: "",
          carpetArea: "",
          floorPlan: null,
        },
      ],
    }));
  };

  const handleAddAroundProperty = () => {
    if (placeAroundProperty.trim() && distanceFromProperty.trim()) {
      setFormData((prev) => ({
        ...prev,
        aroundProperty: [
          ...prev.aroundProperty,
          {
            place: placeAroundProperty.trim(),
            distance: distanceFromProperty.trim(),
          },
        ],
      }));
      setPlaceAroundProperty("");
      setDistanceFromProperty("");
      setErrors((prev) => ({ ...prev, aroundProperty: undefined }));
    } else {
      setErrors((prev) => ({
        ...prev,
        aroundProperty: "Both place and distance are required",
      }));
    }
  };

  const handleDeleteAroundProperty = (index: number) => () => {
    setFormData((prev) => ({
      ...prev,
      aroundProperty: prev.aroundProperty.filter((_, i) => i !== index),
    }));
  };

  const handleLaunchDateChange = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    const formattedDate = selectedDate
      ? `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      : "";
    setFormData((prev) => ({ ...prev, launchDate: formattedDate }));
    setErrors((prev) => ({ ...prev, launchDate: undefined }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.locality) newErrors.locality = "Locality is required";
    if (!formData.propertyType)
      newErrors.propertyType = "Property Type is required";
    if (!formData.propertySubType)
      newErrors.propertySubType = "Property Sub Type is required";
    if (!formData.projectName.trim())
      newErrors.projectName = "Project Name is required";
    if (!formData.builderName.trim())
      newErrors.builderName = "Builder Name is required";
    if (formData.aroundProperty.length === 0)
      newErrors.aroundProperty =
        "At least one place around property is required";
    if (formData.status === "Under Construction" && !formData.launchDate)
      newErrors.launchDate = "Expected Completion date is required";

    const sizeErrors: {
      [key: string]: {
        buildupArea?: string;
        carpetArea?: string;
        floorPlan?: string;
      };
    } = {};
    formData.sizes.forEach((size) => {
      const errorsForSize: {
        buildupArea?: string;
        carpetArea?: string;
        floorPlan?: string;
      } = {};
      if (!size.buildupArea.trim())
        errorsForSize.buildupArea = "Buildup Area is required";
      if (!size.carpetArea.trim())
        errorsForSize.carpetArea = "Carpet Area is required";
      if (!size.floorPlan) errorsForSize.floorPlan = "Floor Plan is required";
      if (Object.keys(errorsForSize).length > 0) {
        sizeErrors[size.id] = errorsForSize;
      }
    });

    if (Object.keys(sizeErrors).length > 0) {
      newErrors.sizes = sizeErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const stateName =
        stateOptions.find((option) => option.value === formData.state)?.text ||
        formData.state;
      const cityName =
        cityOptions.find((option) => option.value === formData.city)?.text ||
        formData.city;
      const localityName =
        localityOptions.find((option) => option.value === formData.locality)
          ?.text || formData.locality;

      const propertyData = {
        state: stateName,
        city: cityName,
        locality: localityName,
        propertyType: formData.propertyType,
        propertySubType: formData.propertySubType,
        projectName: formData.projectName,
        builderName: formData.builderName,
        sizes: formData.sizes.map((size) => ({
          buildupArea: size.buildupArea,
          carpetArea: size.carpetArea,
          floorPlan: size.floorPlan ? size.floorPlan.name : null,
          isUpcoming: formData.isUpcoming,
          status: formData.status,
          launchDate:
            formData.status === "Under Construction"
              ? formData.launchDate
              : null,
        })),
        aroundProperty: formData.aroundProperty,
        brochure: formData.brochure ? formData.brochure.name : null,
        priceSheet: formData.priceSheet ? formData.priceSheet.name : null,
      };

      console.log("Property Data:", propertyData);
    }
  };

  return (
    <div className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <ComponentCard title="Create Property">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="min-h-[80px] w-full max-w-md">
            <Label htmlFor="builderName">Builder Name</Label>
            <Input
              type="text"
              id="builderName"
              value={formData.builderName}
              onChange={handleInputChange("builderName")}
              placeholder="Enter builder name"
              className="dark:bg-gray-800"
            />
            {errors.builderName && (
              <p className="text-red-500 text-sm mt-1">{errors.builderName}</p>
            )}
          </div>
          <div className="min-h-[80px] w-full max-w-md">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              type="text"
              id="projectName"
              value={formData.projectName}
              onChange={handleInputChange("projectName")}
              placeholder="Enter project name"
              className="dark:bg-gray-800"
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
            )}
          </div>
          <div className="min-h-[80px] w-full max-w-md">
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

          <div className="min-h-[80px] w-full max-w-md">
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

          <div className="min-h-[80px] w-full max-w-md">
            <Dropdown
              id="locality"
              label="Select Locality"
              options={localityOptions}
              value={formData.locality}
              onChange={handleDropdownChange("locality")}
              placeholder="Search for a locality..."
              disabled={!formData.city}
              error={errors.locality}
            />
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="propertyType">Property Type *</Label>
            <div className="flex space-x-4">
              {propertyTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleSelectChange("propertyType")(option.value)
                  }
                  className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                    formData.propertyType === option.value
                      ? "bg-[#1D3A76] text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.propertyType && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
            )}
          </div>

          {formData.propertyType && (
            <div className="min-h-[80px]">
              <Label htmlFor="propertySubType">Property Sub Type *</Label>
              <div className="flex flex-wrap gap-4">
                {propertySubTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleSelectChange("propertySubType")(option.value)
                    }
                    className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      formData.propertySubType === option.value
                        ? "bg-[#1D3A76] text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.propertySubType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.propertySubType}
                </p>
              )}
            </div>
          )}

          

          <div className="min-h-[80px]">
            <Label htmlFor="status">Construction Status</Label>
            <div className="flex space-x-4">
              {["Under Construction", "Ready to Move"].map((statusOption) => (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      status: statusOption as FormData["status"],
                      launchDate:
                        statusOption === "Ready to Move" ? "" : prev.launchDate,
                    }))
                  }
                  className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                    formData.status === statusOption
                      ? "bg-[#1D3A76] text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  }`}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          </div>

          {formData.status === "Under Construction" && (
            <div className="min-h-[80px]">
              <DatePicker
                id="launchDate"
                label="Possession End Date"
                placeholder="Select date"
                defaultDate={formData.launchDate || undefined}
                onChange={handleLaunchDateChange}
              />
              {errors.launchDate && (
                <p className="text-red-500 text-sm mt-1">{errors.launchDate}</p>
              )}
            </div>
          )}

          <div className="min-h-[80px]">
            <Label htmlFor="isUpcoming">Is this an Upcoming Project?</Label>
            <div className="flex space-x-4 mb-5">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isUpcoming: true }))
                }
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  formData.isUpcoming
                    ? "bg-[#1D3A76] text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isUpcoming: false }))
                }
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  !formData.isUpcoming
                    ? "bg-[#1D3A76] text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sizes</h3>
            {formData.sizes.map((size, index) => (
              <div
                key={size.id}
                className="relative grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-md"
              >
                {index > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteSize(size.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Delete Size"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                <div className="min-h-[80px]">
                  <Label htmlFor={`buildupArea-${size.id}`}>
                    Buildup Area (sq.ft)
                  </Label>
                  <Input
                    type="text"
                    id={`buildupArea-${size.id}`}
                    value={size.buildupArea}
                    onChange={handleSizeChange(size.id, "buildupArea")}
                    placeholder="Enter buildup area"
                    className="dark:bg-gray-800"
                  />
                  {errors.sizes?.[size.id]?.buildupArea && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sizes[size.id].buildupArea}
                    </p>
                  )}
                </div>

                <div className="min-h-[80px]">
                  <Label htmlFor={`carpetArea-${size.id}`}>
                    Carpet Area (sq.ft)
                  </Label>
                  <Input
                    type="text"
                    id={`carpetArea-${size.id}`}
                    value={size.carpetArea}
                    onChange={handleSizeChange(size.id, "carpetArea")}
                    placeholder="Enter carpet area"
                    className="dark:bg-gray-800"
                  />
                  {errors.sizes?.[size.id]?.carpetArea && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sizes[size.id].carpetArea}
                    </p>
                  )}
                </div>

   <div className="min-h-[80px]">
  <Label>Floor Plan</Label>
  <div className="flex items-center space-x-2">
    <input
      type="file"
      id={`floorPlan-${size.id}`}
      accept="image/*,application/pdf"
      onChange={handleFileChange(size.id)}
      ref={(el) => (fileInputRefs.current[size.id] = el)}
      className="hidden"
    />
    <button
      type="button"
      onClick={() => fileInputRefs.current[size.id]?.click()}
      className="px-2 py-2 text-sm font-semibold text-white bg-[#1D3A76] rounded-md hover:bg-blue-900"
    >
      Choose File
    </button>
    {size.floorPlan && (
      <button
        type="button"
        onClick={handleDeleteFile(size.id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    )}
    <span className="text-sm text-gray-500 truncate max-w-[200px]">
      {size.floorPlan?.name || "No file chosen"}
    </span>
  </div>
  {errors.sizes?.[size.id]?.floorPlan && (
    <p className="text-red-500 text-sm mt-1">
      {errors.sizes[size.id].floorPlan}
    </p>
  )}
</div>


                <div className="min-h-[80px] flex items-end">
                  {size.floorPlan ? (
                    size.floorPlan.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(size.floorPlan)}
                        alt="Floor Plan Preview"
                        className="max-w-[100px] max-h-[100px] object-contain"
                      />
                    ) : (
                      <p className="text-sm text-gray-500 truncate">
                        {size.floorPlan.name}
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-gray-400"></p>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSize}
              className="px-4 py-2 text-white bg-[#1D3A76] rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Size
            </button>
          </div>

          <div className="space-y-4">
            <Label htmlFor="aroundProperty" className="mt-4">
              Around This Property *
            </Label>
            <div className="flex space-x-6 my-4 w-full">
              <Input
                type="text"
                id="aroundProperty-place"
                placeholder="Place around property"
                value={placeAroundProperty}
                onChange={(e) => setPlaceAroundProperty(e.target.value)}
                className="dark:bg-gray-800"
              />
              <Input
                type="text"
                id="aroundProperty-distance"
                placeholder="Distance from property"
                value={distanceFromProperty}
                onChange={(e) => setDistanceFromProperty(e.target.value)}
                className="dark:bg-gray-800"
              />
              <button
                type="button"
                onClick={handleAddAroundProperty}
                className="px-4 py-2 bg-[#1D3A76] text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 w-[20%]"
              >
                Add
              </button>
            </div>
            {errors.aroundProperty && (
              <p className="text-red-500 text-sm mt-1">
                {errors.aroundProperty}
              </p>
            )}
            {formData.aroundProperty.length > 0 && (
              <div className="mt-4">
                <ul className="space-y-2">
                  {formData.aroundProperty.map((entry, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <span>
                        {entry.place} - {entry.distance}
                      </span>
                      <button
                        type="button"
                        onClick={handleDeleteAroundProperty(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label >Upload Brochure</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="brochure"
                ref={brochureInputRef}
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleBrochureChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleBrochureButtonClick}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1D3A76] rounded-md hover:bg-blue-900"
              >
                Choose File
              </button>
              {formData.brochure && (
                <button
                  type="button"
                  onClick={handleDeleteBrochure}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
              <span className="text-sm text-gray-500">
                {formData.brochure ? formData.brochure.name : "No file chosen"}
              </span>
            </div>
            {errors.brochure && (
              <p className="text-red-500 text-sm mt-1">{errors.brochure}</p>
            )}
            <div className="min-h-[80px] flex items-end">
              {formData.brochure ? (
                formData.brochure.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(formData.brochure)}
                    alt="Brochure Preview"
                    className="max-w-[100px] max-h-[100px] object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500 truncate">
                    {formData.brochure.name}
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-400"></p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label >Upload Price Sheet</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="priceSheet"
                ref={priceSheetInputRef}
                accept="image/jpeg,image/png,application/pdf"
                onChange={handlePriceSheetChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handlePriceSheetButtonClick}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1D3A76] rounded-md hover:bg-blue-900"
              >
                Choose File
              </button>
              {formData.priceSheet && (
                <button
                  type="button"
                  onClick={handleDeletePriceSheet}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
              <span className="text-sm text-gray-500">
                {formData.priceSheet
                  ? formData.priceSheet.name
                  : "No file chosen"}
              </span>
            </div>
            {errors.priceSheet && (
              <p className="text-red-500 text-sm mt-1">{errors.priceSheet}</p>
            )}
            <div className="min-h-[80px] flex items-end">
              {formData.priceSheet ? (
                formData.priceSheet.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(formData.priceSheet)}
                    alt="Price Sheet Preview"
                    className="max-w-[100px] max-h-[100px] object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500 truncate">
                    {formData.priceSheet.name}
                  </p>
                )
              ) : (
                <p className="text-sm text-gray-400"></p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[60%] px-4 py-2 text-white bg-[#1D3A76] rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
