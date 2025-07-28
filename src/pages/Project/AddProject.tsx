import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Dropdown from "../../components/form/Dropdown";
import { AppDispatch, RootState } from "../../store/store";
import { insertProperty } from "../../store/slices/projectSlice";
import DatePicker from "../../components/form/date-picker";
import toast from "react-hot-toast";
import Select from "../../components/form/Select";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import { useNavigate } from "react-router";
import { setCityDetails } from "../../store/slices/propertyDetails";
import { useMemo } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

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
  plotArea?: string;
  plotAreaUnits?: string;
  build_up_area?: string;
  builtupAreaUnits?: string;
  carpetArea: string;
  lengthArea?: string;
  lengthAreaUnits?: string;
  floorPlan: File | null;
  sqftPrice: string;
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
  propertyImage: File | null;
  isUpcoming: boolean;
  status: "Under Construction" | "Ready to Move";
  launchType: "Pre Launch" | "Soft Launch" | "Launched";
  launchDate?: string;
  possessionEndDate?: string;
  isReraRegistered: boolean;
  reraNumber: string;
  otpOptions: string[];
}

interface Errors {
  [key: string]: string | undefined | { [key: string]: string | undefined };
}

const AREA_UNIT_OPTIONS: SelectOption[] = [
  { value: "sq.ft", label: "Sq.ft" },
  { value: "sq.yd", label: "Sq.yd" },
  { value: "acres", label: "Acres" },
];

const PROPERTY_TYPE_OPTIONS: SelectOption[] = [
  { value: "Residential", label: "Residential" },
  { value: "Commercial", label: "Commercial" },
];

const RESIDENTIAL_SUBTYPES: SelectOption[] = [
  { value: "Apartment", label: "Apartment" },
  { value: "Independent House", label: "Independent House" },
  { value: "Independent Villa", label: "Independent Villa" },
  { value: "Plot", label: "Plot" },
  { value: "Land", label: "Land" },
];

const COMMERCIAL_SUBTYPES: SelectOption[] = [
  { value: "Office", label: "Office" },
  { value: "Retail Shop", label: "Retail Shop" },
  { value: "Show Room", label: "Show Room" },
  { value: "Warehouse", label: "Warehouse" },
  { value: "Plot", label: "Plot" },
  { value: "Others", label: "Others" },
];

const LAUNCH_TYPES: SelectOption[] = [
  { value: "Pre Launch", label: "Pre Launch" },
  { value: "Soft Launch", label: "Soft Launch" },
  { value: "Launched", label: "Launched" },
];

const PAYMENT_OPTIONS: SelectOption[] = [
  { value: "Regular", label: "Regular" },
  { value: "OTP", label: "OTP" },
  { value: "Offers", label: "Offers" },
  { value: "EMI", label: "EMI" },
];

const INITIAL_FORM_STATE: FormData = {
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
      plotArea: "",
      build_up_area: "",
      carpetArea: "",
      floorPlan: null,
      sqftPrice: "",
      lengthArea: "",
      lengthAreaUnits: "",
      builtupAreaUnits: "",
    },
  ],
  aroundProperty: [],
  brochure: null,
  priceSheet: null,
  propertyImage: null,
  isUpcoming: false,
  status: "Ready to Move",
  launchType: "Pre Launch",
  launchDate: "",
  possessionEndDate: "",
  isReraRegistered: false,
  reraNumber: "",
  otpOptions: [],
};

export default function AddProject() {
  const dispatch = useDispatch<AppDispatch>();
  const { states } = useSelector((state: RootState) => state.property);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Errors>({});
  const [placeAroundProperty, setPlaceAroundProperty] = useState("");
  const [distanceFromProperty, setDistanceFromProperty] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("m");
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const priceSheetInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const propertyImageInputRef = useRef<HTMLInputElement>(null);
  const { citiesQuery, statesQuery } = usePropertyQueries();
  const citiesResult = citiesQuery(
    formData.state ? parseInt(formData.state) : undefined
  );
  const isPlot = useMemo(
    () => formData.propertySubType === "Plot",
    [formData.propertySubType]
  );
  const isLand = useMemo(
    () => formData.propertySubType === "Land",
    [formData.propertySubType]
  );
  const propertySubTypeOptions = useMemo(() => {
    return formData.propertyType === "Residential"
      ? RESIDENTIAL_SUBTYPES
      : formData.propertyType === "Commercial"
      ? COMMERCIAL_SUBTYPES
      : [];
  }, [formData.propertyType]);
  const cityOptions: Option[] = useMemo(
    () =>
      citiesResult?.data?.map((city) => ({
        value: city.value.toString(),
        text: city.label,
      })) || [],
    [citiesResult?.data]
  );
  const stateOptions: Option[] = useMemo(
    () =>
      states?.map((state: any) => ({
        value: state.value.toString(),
        text: state.label,
      })) || [],
    [states]
  );

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      toast.error("Please log in to access this page");
      return;
    }
    if (user.user_type !== 2) {
      navigate("/");
      toast.error("Access denied: Only builders can create projects");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  useEffect(() => {
    if (citiesResult.isError) {
      toast.error(
        `Failed to fetch cities: ${
          citiesResult.error?.message || "Unknown error"
        }`
      );
    }
    if (statesQuery.isError) {
      toast.error(
        `Failed to fetch states: ${
          statesQuery.error?.message || "Unknown error"
        }`
      );
    }
  }, [
    citiesResult.isError,
    citiesResult.error,
    statesQuery.isError,
    statesQuery.error,
  ]);

  const handleDropdownChange = useCallback(
    (field: keyof FormData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "state" && { city: "", locality: "" }),
        ...(field === "city" && { locality: "" }),
        ...(field === "launchType" &&
          value !== "Launched" && { launchDate: "" }),
      }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleInputChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (field === "reraNumber" && formData.isReraRegistered) {
        setErrors((prev) => ({
          ...prev,
          reraNumber: validateReraNumber(e.target.value, formData.state),
        }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [formData.isReraRegistered, formData.state]
  );

  const handleSelectChange = useCallback(
    (field: "propertyType" | "propertySubType") => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "propertyType" && { propertySubType: "" }),
      }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleSizeChange = useCallback(
    (id: string, field: keyof SizeEntry) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
          ...prev,
          sizes: prev.sizes.map((size) =>
            size.id === id ? { ...size, [field]: e.target.value } : size
          ),
        }));
        setErrors((prev) => {
          const updatedSizes = { ...prev.sizes };
          if (updatedSizes && updatedSizes[id]) {
            updatedSizes[id] = { ...updatedSizes[id], [field]: undefined };
          }
          return { ...prev, sizes: updatedSizes };
        });
      },
    []
  );

  const handleFileChange = useCallback(
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];
        const maxSize = 10 * 1024 * 1024;
        if (!validFileTypes.includes(file.type)) {
          setErrors((prev) => {
            const updatedSizes = { ...prev.sizes };
            if (updatedSizes && updatedSizes[id]) {
              updatedSizes[id] = {
                ...updatedSizes[id],
                floorPlan: "Only JPEG, PNG, or PDF files are allowed",
              };
            }
            return { ...prev, sizes: updatedSizes };
          });
          return;
        }
        if (file.size > maxSize) {
          setErrors((prev) => {
            const updatedSizes = { ...prev.sizes };
            if (updatedSizes && updatedSizes[id]) {
              updatedSizes[id] = {
                ...updatedSizes[id],
                floorPlan: "File size must be less than 10MB",
              };
            }
            return { ...prev, sizes: updatedSizes };
          });
          return;
        }
      }
      setFormData((prev) => ({
        ...prev,
        sizes: prev.sizes.map((size) =>
          size.id === id ? { ...size, floorPlan: file } : size
        ),
      }));
      setErrors((prev) => {
        const updatedSizes = { ...prev.sizes };
        if (updatedSizes && updatedSizes[id]) {
          updatedSizes[id] = { ...updatedSizes[id], floorPlan: undefined };
        }
        return { ...prev, sizes: updatedSizes };
      });
    },
    []
  );

  const handleBrochureButtonClick = () => {
    if (brochureInputRef.current) {
      brochureInputRef.current.click();
    }
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validFileTypes = ["application/pdf"];
      if (!validFileTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          brochure: "Only PDF files are allowed for brochure",
        }));
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          brochure: "File size must be less than 20MB",
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
    if (brochureInputRef.current) {
      brochureInputRef.current.value = "";
    }
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

  const handlePropertyImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validFileTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validFileTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          propertyImage: "Only JPEG and PNG images are allowed",
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          propertyImage: "Image must be less than 5MB",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        propertyImage: file,
      }));
      setErrors((prev) => ({ ...prev, propertyImage: undefined }));
    }
  };

  const handleDeletePropertyImage = () => {
    setFormData((prev) => ({
      ...prev,
      propertyImage: null,
    }));
    setErrors((prev) => ({ ...prev, propertyImage: undefined }));
    if (propertyImageInputRef.current) {
      propertyImageInputRef.current.value = "";
    }
  };

  const handlePriceSheetButtonClick = () => {
    if (priceSheetInputRef.current) {
      priceSheetInputRef.current.click();
    }
  };

  const handlePriceSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validFileTypes = ["application/pdf"];
      if (!validFileTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          priceSheet: "Only PDF files are allowed for price sheet",
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
    if (priceSheetInputRef.current) {
      priceSheetInputRef.current.value = "";
    }
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
          plotArea: "",
          build_up_area: "",
          carpetArea: "",
          floorPlan: null,
          sqftPrice: "",
          lengthArea: "",
          lengthAreaUnits: "",
          builtupAreaUnits: "",
        },
      ],
    }));
  };

  const handleAddAroundProperty = () => {
    const trimmedPlace = placeAroundProperty.trim();
    const trimmedDistance = distanceFromProperty.trim();
    if (trimmedPlace && trimmedDistance) {
      const fullDistance = `${trimmedDistance}${distanceUnit}`;
      setFormData((prev) => ({
        ...prev,
        aroundProperty: [
          ...prev.aroundProperty,
          {
            place: trimmedPlace,
            distance: fullDistance,
          },
        ],
      }));
      setPlaceAroundProperty("");
      setDistanceFromProperty("");
      setDistanceUnit("m");
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

  const handlePossessionEndDateChange = (selectedDates: Date[]) => {
    const selectedDate = selectedDates[0];
    const formattedDate = selectedDate
      ? `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      : "";
    setFormData((prev) => ({ ...prev, possessionEndDate: formattedDate }));
    setErrors((prev) => ({ ...prev, possessionEndDate: undefined }));
  };

  const handleOtpOptionsChange = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      otpOptions: prev.otpOptions.includes(option)
        ? prev.otpOptions.filter((opt) => opt !== option)
        : [...prev.otpOptions, option],
    }));
    setErrors((prev) => ({ ...prev, otpOptions: undefined }));
  };

  const validateReraNumber = (reraNumber: string, state: string): string | undefined => {
    if (!reraNumber.trim()) {
      return "RERA Number is required when RERA is registered";
    }
    const reraRegex = /^[A-Za-z0-9-]{1,30}$/;
    if (!reraRegex.test(reraNumber)) {
      return "RERA Number must be alphanumeric with optional hyphens and up to 30 characters";
    }
    // Example state-specific validation for Maharashtra
    if (state === "27") { // Assuming '27' is Maharashtra's state code
      const maharashtraReraRegex = /^P\d{3}\d{8}$/;
      if (!maharashtraReraRegex.test(reraNumber)) {
        return "Invalid RERA Number format for Maharashtra (e.g., P51700012345)";
      }
    }
    return undefined;
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.locality.trim()) newErrors.locality = "Locality is required";
    if (!formData.propertyType)
      newErrors.propertyType = "Property Type is required";
    if (!formData.propertySubType)
      newErrors.propertySubType = "Property Sub Type is required";
    if (!formData.projectName.trim())
      newErrors.projectName = "Project Name is required";
    if (!formData.builderName.trim()) {
      newErrors.builderName = "Builder Name is required";
    } else if (!/^[A-Za-z\s&.-]+$/.test(formData.builderName.trim())) {
      newErrors.builderName =
        "Builder Name can only contain alphabets, spaces, &, ., and -";
    }
    if (formData.aroundProperty.length === 0)
      newErrors.aroundProperty =
        "At least one place around property is required";
    if (formData.isReraRegistered) {
      const reraError = validateReraNumber(formData.reraNumber, formData.state);
      if (reraError) newErrors.reraNumber = reraError;
    }
    if (formData.otpOptions.length === 0)
      newErrors.otpOptions = "At least one payment mode is required";
    if (formData.launchType === "Launched" && !formData.launchDate)
      newErrors.launchDate = "Launch Date is required";
    if (formData.status === "Under Construction" && !formData.possessionEndDate)
      newErrors.possessionEndDate = "Possession End Date is required";
    const sizeErrors: { [key: string]: { [key: string]: string | undefined } } =
      {};
    formData.sizes.forEach((size) => {
      const errorsForSize: { [key: string]: string | undefined } = {};
      if (!size.carpetArea.trim())
        errorsForSize.carpetArea = "Carpet Area is required";
      if (!size.sqftPrice.trim())
        errorsForSize.sqftPrice = "Square Foot Price is required";
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

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     const stateName =
  //       stateOptions.find((option) => option.value === formData.state)?.text ||
  //       formData.state;
  //     const cityName =
  //       cityOptions.find((option) => option.value === formData.city)?.text ||
  //       formData.city;
  //     const formDataToSend = new FormData();
  //     formDataToSend.append("project_name", formData.projectName);
  //     formDataToSend.append("property_type", formData.propertyType);
  //     formDataToSend.append("property_subtype", formData.propertySubType);
  //     formDataToSend.append("builder_name", formData.builderName);
  //     formDataToSend.append("state", stateName);
  //     formDataToSend.append("city", cityName);
  //     formDataToSend.append("locality", formData.locality);
  //     formDataToSend.append("construction_status", formData.status);
  //     formDataToSend.append(
  //       "upcoming_project",
  //       formData.isUpcoming ? "Yes" : "No"
  //     );
  //     formDataToSend.append("posted_by", user?.user_type.toString() || "2");
  //     formDataToSend.append("user_id", user?.id.toString() || "2");
  //     formDataToSend.append(
  //       "rera_registered",
  //       formData.isReraRegistered ? "Yes" : "No"
  //     );
  //     if (formData.isReraRegistered) {
  //       formDataToSend.append("rera_number", formData.reraNumber);
  //     }
  //     formDataToSend.append("launch_type", formData.launchType);
  //     if (formData.launchType === "Launched") {
  //       formDataToSend.append("launched_date", formData.launchDate || "");
  //     }
  //     if (formData.status === "Under Construction") {
  //       formDataToSend.append(
  //         "possession_end_date",
  //         formData.possessionEndDate || ""
  //       );
  //     }
  //     formDataToSend.append(
  //       "payment_mode",
  //       JSON.stringify(formData.otpOptions)
  //     );
  //     formDataToSend.append(
  //       "sizes",
  //       JSON.stringify(
  //         formData.sizes.map((size) => ({
  //           plot_area: size.plotArea,
  //           plotAreaUnits: size.plotAreaUnits,
  //           lengthArea: size.lengthArea,
  //           lengthAreaUnits: size.lengthAreaUnits,
  //           build_up_area: size.build_up_area,
  //           builtupAreaUnits: size.builtupAreaUnits,
  //           carpet_area: size.carpetArea,
  //           sqft_price: size.sqftPrice,
  //         }))
  //       )
  //     );
  //     formDataToSend.append(
  //       "around_this",
  //       JSON.stringify(
  //         formData.aroundProperty.map((entry) => ({
  //           title: entry.place,
  //           distance: entry.distance,
  //         }))
  //       )
  //     );
  //     if (formData.brochure) {
  //       formDataToSend.append("brochure", formData.brochure);
  //     }
  //     if (formData.priceSheet) {
  //       formDataToSend.append("price_sheet", formData.priceSheet);
  //     }
  //     if (formData.propertyImage) {
  //       formDataToSend.append("property_image", formData.propertyImage);
  //     }
  //     formData.sizes.forEach((size) => {
  //       if (size.floorPlan) {
  //         formDataToSend.append("floor_plan", size.floorPlan);
  //       }
  //     });
  //     dispatch(insertProperty(formDataToSend))
  //       .unwrap()
  //       .then(() => {
  //         toast.success("Property inserted successfully");
  //         setFormData(INITIAL_FORM_STATE);
  //         setPlaceAroundProperty("");
  //         setDistanceFromProperty("");
  //         if (brochureInputRef.current) brochureInputRef.current.value = "";
  //         if (priceSheetInputRef.current) priceSheetInputRef.current.value = "";
  //         Object.keys(fileInputRefs.current).forEach((key) => {
  //           if (fileInputRefs.current[key])
  //             fileInputRefs.current[key]!.value = "";
  //         });
  //       })
  //       .catch((error) => {
  //         toast.error(`Error: ${error.message || "Failed to insert property"}`);
  //       });
  //   }
  // };


  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) {
    toast.error("Please fill correct details");
    return;
  }
  const stateName =
    stateOptions.find((option) => option.value === formData.state)?.text ||
    formData.state;
  const cityName =
    cityOptions.find((option) => option.value === formData.city)?.text ||
    formData.city;
  const formDataToSend = new FormData();
  formDataToSend.append("project_name", formData.projectName);
  formDataToSend.append("property_type", formData.propertyType);
  formDataToSend.append("property_subtype", formData.propertySubType);
  formDataToSend.append("builder_name", formData.builderName);
  formDataToSend.append("state", stateName);
  formDataToSend.append("city", cityName);
  formDataToSend.append("locality", formData.locality);
  formDataToSend.append("construction_status", formData.status);
  formDataToSend.append(
    "upcoming_project",
    formData.isUpcoming ? "Yes" : "No"
  );
  formDataToSend.append("posted_by", user?.user_type.toString() || "2");
  formDataToSend.append("user_id", user?.id.toString() || "2");
  formDataToSend.append(
    "rera_registered",
    formData.isReraRegistered ? "Yes" : "No"
  );
  if (formData.isReraRegistered) {
    formDataToSend.append("rera_number", formData.reraNumber);
  }
  formDataToSend.append("launch_type", formData.launchType);
  if (formData.launchType === "Launched") {
    formDataToSend.append("launched_date", formData.launchDate || "");
  }
  if (formData.status === "Under Construction") {
    formDataToSend.append(
      "possession_end_date",
      formData.possessionEndDate || ""
    );
  }
  formDataToSend.append(
    "payment_mode",
    JSON.stringify(formData.otpOptions)
  );
  formDataToSend.append(
    "sizes",
    JSON.stringify(
      formData.sizes.map((size) => ({
        plot_area: size.plotArea,
        plotAreaUnits: size.plotAreaUnits,
        lengthArea: size.lengthArea,
        lengthAreaUnits: size.lengthAreaUnits,
        build_up_area: size.build_up_area,
        builtupAreaUnits: size.builtupAreaUnits,
        carpet_area: size.carpetArea,
        sqft_price: size.sqftPrice,
      }))
    )
  );
  formDataToSend.append(
    "around_this",
    JSON.stringify(
      formData.aroundProperty.map((entry) => ({
        title: entry.place,
        distance: entry.distance,
      }))
    )
  );
  if (formData.brochure) {
    formDataToSend.append("brochure", formData.brochure);
  }
  if (formData.priceSheet) {
    formDataToSend.append("price_sheet", formData.priceSheet);
  }
  if (formData.propertyImage) {
    formDataToSend.append("property_image", formData.propertyImage);
  }
  formData.sizes.forEach((size) => {
    if (size.floorPlan) {
      formDataToSend.append("floor_plan", size.floorPlan);
    }
  });
  dispatch(insertProperty(formDataToSend))
    .unwrap()
    .then(() => {
      toast.success("Property inserted successfully");
      setFormData(INITIAL_FORM_STATE);
      setPlaceAroundProperty("");
      setDistanceFromProperty("");
      if (brochureInputRef.current) brochureInputRef.current.value = "";
      if (priceSheetInputRef.current) priceSheetInputRef.current.value = "";
      Object.keys(fileInputRefs.current).forEach((key) => {
        if (fileInputRefs.current[key])
          fileInputRefs.current[key]!.value = "";
      });
    })
    .catch((error) => {
      toast.error(`Error: ${error.message || "Failed to insert property"}`);
    });
};

  const renderError = (error: string | undefined) =>
    error && <p className="text-red-500 text-sm mt-1">{error}</p>;

  return (
    <div className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex justify-end items-end">
          <PageBreadcrumb
            items={[
              { label: "Dashboard", link: "/" },
              { label: "Add Projects", link: "/add-projects" },
            ]}  
          />
      </div>
      <PageMeta title="Add Projects - Project Management " />
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
            {renderError(errors.builderName)}
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
            {renderError(errors.projectName)}
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
            <Label htmlFor="locality">Locality</Label>
            <Input
              type="text"
              id="locality"
              value={formData.locality}
              onChange={handleInputChange("locality")}
              placeholder="Enter locality"
              className="dark:bg-gray-800"
              disabled={!formData.city}
            />
            {renderError(errors.locality)}
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="propertyType">Property Type *</Label>
            <div className="flex space-x-4">
              {PROPERTY_TYPE_OPTIONS.map((option) => (
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
            {renderError(errors.propertyType)}
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
              {renderError(errors.propertySubType)}
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
                      ...(statusOption === "Ready to Move" &&
                      prev.launchType !== "Launched"
                        ? { launchDate: "" }
                        : {}),
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
          <div className="min-h-[80px] w-full max-w-md">
            <Select
              id="launchType"
              label="Launch Type"
              options={LAUNCH_TYPES}
              value={formData.launchType}
              onChange={handleDropdownChange("launchType")}
              placeholder="Select launch type..."
            />
          </div>
          {formData.launchType === "Launched" && (
            <div className="min-h-[80px] w-full max-w-md">
              <DatePicker
                id="launchDate"
                label="Launch Date"
                placeholder="Select launch date"
                defaultDate={formData.launchDate || undefined}
                onChange={handleLaunchDateChange}
              />
              {renderError(errors.launchDate)}
            </div>
          )}
          {formData.status === "Under Construction" && (
            <div className="min-h-[80px] w-full max-w-md">
              <DatePicker
                id="possessionEndDate"
                label="Possession End Date"
                placeholder="Select possession end date"
                defaultDate={formData.possessionEndDate || undefined}
                onChange={handlePossessionEndDateChange}
              />
              {renderError(errors.possessionEndDate)}
            </div>
          )}
          <div className="min-h-[80px]">
            <Label htmlFor="isReraRegistered">Is this RERA Registered?</Label>
            <div className="flex space-x-4 mb-5">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isReraRegistered: true }))
                }
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  formData.isReraRegistered
                    ? "bg-[#1D3A76] text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isReraRegistered: false,
                    reraNumber: "",
                  }))
                }
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  !formData.isReraRegistered
                    ? "bg-[#1D3A76] text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                No
              </button>
            </div>
          </div>
          {formData.isReraRegistered && (
            <div className="min-h-[80px] w-full max-w-md">
              <Label htmlFor="reraNumber">RERA Number</Label>
              <Input
                type="text"
                id="reraNumber"
                value={formData.reraNumber}
                onChange={handleInputChange("reraNumber")}
                placeholder="Enter RERA number (e.g., P51700012345)"
                className="dark:bg-gray-800"
              />
              {renderError(errors.reraNumber)}
            </div>
          )}
          <div className="min-h-[80px]">
            <Label htmlFor="otpOptions">Payment Modes *</Label>
            <div className="flex flex-wrap gap-4">
              {PAYMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOtpOptionsChange(option.value)}
                  className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                    formData.otpOptions.includes(option.value)
                      ? "bg-[#1D3A76] text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {renderError(errors.otpOptions)}
          </div>
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
            {formData.sizes.map((size, index) => {
              const isPlot = formData.propertySubType === "Plot";
              const isLand = formData.propertySubType === "Land";
              const isPlotOrLand = isPlot || isLand;
              return (
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
                    {isPlot ? (
                      <>
                        <Label htmlFor={`plotArea-${size.id}`}>Plot Area</Label>
                        <div className="flex w-full max-w-md border border-gray-300 rounded-md overflow-hidden">
                          <Input
                            type="number"
                            id={`plotArea-${size.id}`}
                            value={size.plotArea || ""}
                            onChange={handleSizeChange(size.id, "plotArea")}
                            placeholder="Enter plot area"
                            className="w-full px-3 py-2 text-sm border-none focus:ring-0 dark:bg-gray-800"
                          />
                          <select
                            id={`plotAreaUnits-${size.id}`}
                            value={size.plotAreaUnits || ""}
                            onChange={handleSizeChange(
                              size.id,
                              "plotAreaUnits"
                            )}
                            className="px-3 py-2 text-sm border-l border-gray-300 bg-white dark:bg-gray-800 dark:text-white"
                          >
                            <option value="">Select</option>
                            {AREA_UNIT_OPTIONS.map((unit) => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {renderError(errors.sizes?.[size.id]?.plotArea)}
                        {renderError(errors.sizes?.[size.id]?.plotAreaUnits)}
                      </>
                    ) : (
                      <>
                        <Label htmlFor={`build_up_area-${size.id}`}>
                          {isLand ? "Length Area" : "BuildUp Area"}
                        </Label>
                        <div className="flex w-full max-w-md border border-gray-300 rounded-md overflow-hidden">
                          <Input
                            type="number"
                            id={`build_up_area-${size.id}`}
                            value={size.build_up_area || ""}
                            onChange={handleSizeChange(
                              size.id,
                              "build_up_area"
                            )}
                            placeholder={`Enter ${
                              isLand ? "length area" : "built-up area"
                            }`}
                            className="w-full px-3 py-2 text-sm border-none focus:ring-0 dark:bg-gray-800"
                          />
                          <select
                            id={`builtupAreaUnits-${size.id}`}
                            value={size.builtupAreaUnits || ""}
                            onChange={handleSizeChange(
                              size.id,
                              "builtupAreaUnits"
                            )}
                            className="px-3 py-2 text-sm border-l border-gray-300 bg-white dark:bg-gray-800 dark:text-white"
                          >
                            <option value="">Select</option>
                            {AREA_UNIT_OPTIONS.map((unit) => (
                              <option key={unit.value} value={unit.value}>
                                {unit.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {renderError(errors.sizes?.[size.id]?.build_up_area)}
                        {renderError(errors.sizes?.[size.id]?.builtupAreaUnits)}
                      </>
                    )}
                  </div>
                  {isPlot && (
                    <div className="min-h-[80px]">
                      <div className="mb-2">
                        <div className="flex-1">
                          <Label htmlFor={`lengthArea-${size.id}`}>
                            Length Area
                          </Label>
                          <div className="flex w-full max-w-md border border-gray-300 rounded-md overflow-hidden">
                            <Input
                              type="number"
                              id={`lengthArea-${size.id}`}
                              value={size.lengthArea || ""}
                              onChange={handleSizeChange(size.id, "lengthArea")}
                              placeholder="Enter length area"
                              className="w-full px-3 py-2 text-sm border-none focus:ring-0 dark:bg-gray-800"
                            />
                          </div>
                          {renderError(errors.sizes?.[size.id]?.lengthArea)}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="min-h-[80px]">
                    <Label htmlFor={`carpetArea-${size.id}`}>
                      {isPlotOrLand ? "Width Area" : "Carpet Area"}
                    </Label>
                    <div className="flex w-full max-w-md border border-gray-300 rounded-md overflow-hidden">
                      <Input
                        type="number"
                        id={`carpetArea-${size.id}`}
                        value={size.carpetArea}
                        onChange={handleSizeChange(size.id, "carpetArea")}
                        placeholder={`Enter ${
                          isPlotOrLand ? "width area" : "carpet area"
                        }`}
                        className="w-full px-3 py-2 text-sm border-none focus:ring-0 dark:bg-gray-800"
                      />
                    </div>
                    {renderError(errors.sizes?.[size.id]?.carpetArea)}
                  </div>
                  <div className="min-h-[80px]">
                    <Label htmlFor={`sqftPrice-${size.id}`}>
                      Square Feet Price
                    </Label>
                    <Input
                      type="number"
                      id={`sqftPrice-${size.id}`}
                      value={size.sqftPrice}
                      onChange={handleSizeChange(size.id, "sqftPrice")}
                      placeholder="Enter square feet price"
                      className="dark:bg-gray-800"
                    />
                    {renderError(errors.sizes?.[size.id]?.sqftPrice)}
                  </div>
                  {!isPlot && (
                    <div className="mt-2 text-left">
                      <Label>Floor Plan (Optional)</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          id={`floorPlan-${size.id}`}
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={handleFileChange(size.id)}
                          ref={(el) => (fileInputRefs.current[size.id] = el)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            fileInputRefs.current[size.id]?.click()
                          }
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
                        <span className="text-sm text-gray-500 truncate max-w-[150px]">
                          {size.floorPlan?.name || "No file chosen"}
                        </span>
                      </div>
                      {renderError(errors.sizes?.[size.id]?.floorPlan)}
                    </div>
                  )}
                </div>
              );
            })}
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
              <div className="flex w-auto border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                <Input
                  type="number"
                  id="aroundProperty-distance"
                  placeholder="Distance"
                  value={distanceFromProperty}
                  onChange={(e) => setDistanceFromProperty(e.target.value)}
                  className="px-3 py-2 text-sm border-none focus:ring-0 dark:bg-gray-800 dark:text-white"
                />
                <select
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value)}
                  className="px-3 py-2 text-sm border-l border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="M">M</option>
                  <option value="KM">KM</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddAroundProperty}
                className="px-4 py-2 bg-[#1D3A76] text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 w-[20%]"
              >
                Add
              </button>
            </div>
            {renderError(errors.aroundProperty)}
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
            <Label>Upload Brochure (Optional)</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="brochure"
                ref={brochureInputRef}
                accept="application/pdf"
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
            {renderError(errors.brochure)}
          </div>
          <div className="mb-2 space-y-1">
            <Label>Upload Price Sheet (Optional)</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="priceSheet"
                ref={priceSheetInputRef}
                accept="application/pdf"
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
            {renderError(errors.priceSheet)}
          </div>
          <div className="space-y-1">
            <Label>Upload Property Image (Optional)</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="propertyImage"
                ref={propertyImageInputRef}
                accept="image/jpeg,image/png"
                onChange={handlePropertyImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => propertyImageInputRef.current?.click()}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1D3A76] rounded-md hover:bg-blue-900"
              >
                Choose Image
              </button>
              {formData.propertyImage && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 truncate max-w-[150px]">
                    {formData.propertyImage.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleDeletePropertyImage}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            {renderError(errors.propertyImage)}
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