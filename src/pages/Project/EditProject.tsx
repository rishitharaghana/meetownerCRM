import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Dropdown from "../../components/form/Dropdown";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/date-picker";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../../store/store";
import { updateProperty } from "../../store/slices/projectSlice";
import { usePropertyQueries } from "../../hooks/PropertyQueries";
import { setCityDetails } from "../../store/slices/propertyDetails";
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
  plot_area?: string;
  plotAreaUnits?: string;
  build_up_area?: string;
  builtupAreaUnits?: string;
  carpet_area: string;
  lengthArea?: string;
  lengthAreaUnits?: string;
  floor_plan: File | string | null;
  sqft_price: string;
}

interface AroundThisEntry {
  title: string;
  distance: string;
}

interface FormData {
  property_id: number;
  state: string;
  city: string;
  locality: string;
  property_type: string;
  property_subtype: string;
  project_name: string;
  builder_name: string;
  sizes: SizeEntry[];
  around_this: AroundThisEntry[];
  brochure: File | string | null;
  price_sheet: File | string | null;
  property_image: File | string | null;
  is_upcoming: boolean;
  construction_status: "Under Construction" | "Ready to Move";
  launch_type: "Pre Launch" | "Soft Launch" | "Launched";
  launched_date?: string;
  possessionEndDate?: string;
  is_rera_registered: boolean;
  rera_number: string;
  payment_mode: string[];
}

interface Errors {
  [key: string]: string | undefined | { [key: string]: string | undefined };
}

const PROPERTY_TYPE_OPTIONS: SelectOption[] = [
  { value: "Residential", label: "Residential" },
  { value: "Commercial", label: "Commercial" },
];

const RESIDENTIAL_SUBTYPES: SelectOption[] = [
  { value: "Apartment", label: "Apartment" },
  { value: "Independent House", label: "Independent House" },
  { value: "Independent Villa", label: "Independent Villa" },
  { value: "Duplex", label: "Duplex" },
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

const AREA_UNIT_OPTIONS: SelectOption[] = [
  { value: "sq.ft", label: "Sq.ft" },
  { value: "sq.yd", label: "Sq.yd" },
  { value: "acres", label: "Acres" },
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

const EditProject: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state || {};
  const { states } = useSelector((state: RootState) => state.property);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { citiesQuery } = usePropertyQueries();

 const [formData, setFormData] = useState<FormData>(() => {
  if (!project) {
    return {
      property_id: 0,
      project_name: "",
      property_type: "",
      property_subtype: "",
      builder_name: "",
      state: "",
      city: "",
      locality: "",
      construction_status: "Ready to Move",
      is_upcoming: false,
      is_rera_registered: false,
      rera_number: "",
      payment_mode: [],
      launch_type: "Pre Launch",
      launched_date: "",
      possessionEndDate: "",
      sizes: [
        {
          id: `${Date.now()}-1`,
          plot_area: "",
          plotAreaUnits: "",
          build_up_area: "",
          builtupAreaUnits: "",
          carpet_area: "",
          lengthArea: "",
          lengthAreaUnits: "",
          floor_plan: null,
          sqft_price: "",
        },
      ],
      around_this: [],
      brochure: null,
      price_sheet: null,
      property_image: null,
    };
  }

  const sizes = Array.isArray(project.sizes)
    ? project.sizes.map((size: any, index: number) => ({
        id: `${Date.now()}-${index + 1}`,
        plot_area: size.plot_area || "",
        plotAreaUnits: size.plotAreaUnits || "",
        build_up_area: size.build_up_area || "",
        builtupAreaUnits: size.builtupAreaUnits || "",
        carpet_area: size.carpet_area || "",
        lengthArea: size.lengthArea || "",
        lengthAreaUnits: size.lengthAreaUnits || "",
        floor_plan: size.floor_plan || null,
        sqft_price: size.sqft_price || "",
      }))
    : [
        {
          id: `${Date.now()}-1`,
          plot_area: "",
          plotAreaUnits: "",
          build_up_area: "",
          builtupAreaUnits: "",
          carpet_area: "",
          lengthArea: "",
          lengthAreaUnits: "",
          floor_plan: null,
          sqft_price: "",
        },
      ];

  return {
    property_id: parseInt(project.property_id) || 0,
    project_name: project.project_name || "",
    property_type: project.property_type || "",
    property_subtype: project.property_subtype || "",
    builder_name: project.builder_name || "",
    state:
      states?.find((s: any) => s.label.toLowerCase() === (project.state || "").toLowerCase())?.value?.toString() || "",
    city: "", // City will be set in useEffect based on cityOptions
    locality: project.locality || "",
    construction_status: project.construction_status || "Ready to Move",
    is_upcoming: project.upcoming_project === "Yes",
    is_rera_registered: project.rera_registered === "Yes",
    rera_number: project.rera_number || "",
    payment_mode: Array.isArray(project.payment_mode)
      ? project.payment_mode.filter((mode: string) => PAYMENT_OPTIONS.some((opt) => opt.value === mode))
      : [],
    launch_type: project.launch_type || "Pre Launch",
    launched_date: project.launched_date && /^\d{4}-\d{2}-\d{2}$/.test(project.launched_date)
      ? project.launched_date
      : "",
    possessionEndDate: project.possessionEndDate && /^\d{4}-\d{2}-\d{2}$/.test(project.possessionEndDate)
      ? project.possessionEndDate
      : "",
    sizes,
    around_this: Array.isArray(project.around_this)
      ? project.around_this.map((entry: any) => ({
          title: entry.title || "",
          distance: entry.distance || "",
        }))
      : [],
    brochure: project.brochure || null,
    price_sheet: project.price_sheet || null,
    property_image: project.property_image || null,
  };
});
  const [errors, setErrors] = useState<Errors>({});
  const [placeAroundProperty, setPlaceAroundProperty] = useState("");
  const [distanceFromProperty, setDistanceFromProperty] = useState("");
  const [distanceUnit, setDistanceUnit] = useState("M");
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const priceSheetInputRef = useRef<HTMLInputElement>(null);
  const propertyImageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const isMounted = useRef(true);

  const citiesResult = citiesQuery(formData.state ? parseInt(formData.state) : undefined);
  const stateOptions: Option[] = useMemo(
    () =>
      Array.isArray(states)
        ? states.map((state: any) => ({
            value: state.value.toString(),
            text: state.label,
          }))
        : [],
    [states]
  );
  const cityOptions: Option[] = useMemo(() => {
    if (!citiesResult?.data || !Array.isArray(citiesResult.data)) return [];
    const cityValue = project?.city
      ? citiesResult.data.find((c: any) => c.label.toLowerCase() === (project.city || "").toLowerCase())?.value?.toString()
      : "";
    if (cityValue && formData.city !== cityValue) {
      setFormData((prev) => ({ ...prev, city: cityValue }));
    }
    return citiesResult.data.map((city: any) => ({
      value: city.value.toString(),
      text: city.label,
    }));
  }, [citiesResult?.data, project?.city]);

  const propertySubTypeOptions = useMemo(() => {
    return formData.property_type === "Residential"
      ? RESIDENTIAL_SUBTYPES
      : formData.property_type === "Commercial"
      ? COMMERCIAL_SUBTYPES
      : [];
  }, [formData.property_type]);
  const isPlot = useMemo(() => formData.property_subtype === "Plot", [formData.property_subtype]);
  const isLand = useMemo(() => formData.property_subtype === "Land", [formData.property_subtype]);
  const isPlotOrLand = isPlot || isLand;

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      toast.error("Please log in to access this page");
      return;
    }
    if (user.user_type !== 2) {
      navigate("/");
      toast.error("Access denied: Only builders can edit projects");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isMounted.current && citiesResult.data) {
      dispatch(setCityDetails(citiesResult.data));
    }
  }, [citiesResult.data, dispatch]);

  useEffect(() => {
    if (citiesResult.isError && isMounted.current) {
      toast.error(`Failed to fetch cities: ${citiesResult.error?.message || "Unknown error"}`);
    }
  }, [citiesResult.isError, citiesResult.error]);

 const handleDropdownChange = useCallback(
  (field: keyof FormData) => (value: string) => {
    setFormData((prev) => {
      // Only clear launched_date if changing from Launched to non-Launched
      const shouldClearLaunchedDate =
        field === "launch_type" &&
        value !== "Launched" &&
        prev.launch_type === "Launched" &&
        prev.launched_date;
      // Only clear possessionEndDate if changing to Ready to Move
      const shouldClearPossessionDate =
        field === "construction_status" &&
        value === "Ready to Move" &&
        prev.construction_status !== "Ready to Move" &&
        prev.possessionEndDate;

      return {
        ...prev,
        [field]: value,
        ...(field === "state" && { city: "", locality: "" }),
        ...(field === "city" && { locality: "" }),
        ...(shouldClearLaunchedDate && { launched_date: "" }),
        ...(shouldClearPossessionDate && { possessionEndDate: "" }),
      };
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  },
  []
);

  const handleInputChange = useCallback(
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (field === "rera_number" && formData.is_rera_registered) {
        setErrors((prev) => ({
          ...prev,
          rera_number: validateReraNumber(e.target.value, formData.state),
        }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [formData.is_rera_registered, formData.state]
  );

  const handleSelectChange = useCallback(
    (field: "property_type" | "property_subtype") => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "property_type" && { property_subtype: "" }),
      }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleSizeChange = useCallback(
    (id: string, field: keyof SizeEntry) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                floor_plan: "Only JPEG, PNG, or PDF files are allowed",
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
                floor_plan: "File size must be less than 10MB",
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
          size.id === id ? { ...size, floor_plan: file } : size
        ),
      }));
      setErrors((prev) => {
        const updatedSizes = { ...prev.sizes };
        if (updatedSizes && updatedSizes[id]) {
          updatedSizes[id] = { ...updatedSizes[id], floor_plan: undefined };
        }
        return { ...prev, sizes: updatedSizes };
      });
    },
    []
  );

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

  const handlePriceSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validFileTypes = ["application/pdf"];
      if (!validFileTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          price_sheet: "Only PDF files are allowed for price sheet",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          price_sheet: "File size must be less than 10MB",
        }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, price_sheet: file }));
    setErrors((prev) => ({ ...prev, price_sheet: undefined }));
  };

  const handleDeletePriceSheet = () => {
    setFormData((prev) => ({ ...prev, price_sheet: null }));
    setErrors((prev) => ({ ...prev, price_sheet: undefined }));
    if (priceSheetInputRef.current) {
      priceSheetInputRef.current.value = "";
    }
  };

  const handlePropertyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validFileTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024;
      if (!validFileTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          property_image: "Only JPEG and PNG images are allowed",
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          property_image: "Image must be less than 5MB",
        }));
        return;
      }
    }
    setFormData((prev) => ({ ...prev, property_image: file }));
    setErrors((prev) => ({ ...prev, property_image: undefined }));
  };

  const handleDeletePropertyImage = () => {
    setFormData((prev) => ({ ...prev, property_image: null }));
    setErrors((prev) => ({ ...prev, property_image: undefined }));
    if (propertyImageInputRef.current) {
      propertyImageInputRef.current.value = "";
    }
  };

  const handleDeleteFile = (id: string) => () => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size) =>
        size.id === id ? { ...size, floor_plan: null } : size
      ),
    }));
    setErrors((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [id]: { ...prev.sizes?.[id], floor_plan: undefined },
      },
    }));
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id]!.value = "";
    }
  };

  const handleAddSize = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        {
          id: `${Date.now()}-${prev.sizes.length + 1}`,
          plot_area: "",
          plotAreaUnits: "",
          build_up_area: "",
          builtupAreaUnits: "",
          carpet_area: "",
          lengthArea: "",
          lengthAreaUnits: "",
          floor_plan: null,
          sqft_price: "",
        },
      ],
    }));
  }, []);

  const handleDeleteSize = (id: string) => () => {
    if (formData.sizes.length === 1) {
      toast.error("At least one size entry is required");
      return;
    }
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

  const handleAddAroundProperty = () => {
    const trimmedPlace = placeAroundProperty.trim();
    const trimmedDistance = distanceFromProperty.trim();
    if (trimmedPlace && trimmedDistance) {
      const fullDistance = `${trimmedDistance}${distanceUnit}`;
      setFormData((prev) => ({
        ...prev,
        around_this: [
          ...prev.around_this,
          { title: trimmedPlace, distance: fullDistance },
        ],
      }));
      setPlaceAroundProperty("");
      setDistanceFromProperty("");
      setDistanceUnit("M");
      setErrors((prev) => ({ ...prev, around_this: undefined }));
    } else {
      setErrors((prev) => ({
        ...prev,
        around_this: "Both place and distance are required",
      }));
    }
  };

  const handleDeleteAroundProperty = (index: number) => () => {
    setFormData((prev) => ({
      ...prev,
      around_this: prev.around_this.filter((_, i) => i !== index),
    }));
  };

const handleLaunchDateChange = (selectedDates: Date[] | null) => {
  const selectedDate = selectedDates && selectedDates[0] ? selectedDates[0] : null;
  const formattedDate = selectedDate
    ? `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : formData.launched_date; // Retain existing value if no date is selected
  setFormData((prev) => ({
    ...prev,
    launched_date: formattedDate,
  }));
  setErrors((prev) => ({
    ...prev,
    launched_date:
      prev.launch_type === "Launched" && !formattedDate
        ? "Launch Date is required"
        : undefined,
  }));
};
  const handlePossessionEndDateChange = (selectedDates: Date[] | null) => {
  const selectedDate = selectedDates && selectedDates[0] ? selectedDates[0] : null;
  const formattedDate = selectedDate
    ? `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : formData.possessionEndDate; // Retain existing value if no date is selected
  setFormData((prev) => ({ ...prev, possessionEndDate: formattedDate }));
  setErrors((prev) => ({
    ...prev,
    possessionEndDate:
      prev.construction_status === "Under Construction" && !formattedDate
        ? "Possession End Date is required"
        : undefined,
  }));
};


  const handlePaymentModeChange = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      payment_mode: prev.payment_mode.includes(option)
        ? prev.payment_mode.filter((opt) => opt !== option)
        : [...prev.payment_mode, option],
    }));
    setErrors((prev) => ({ ...prev, payment_mode: undefined }));
  };

  const validateReraNumber = (reraNumber: string, state: string): string | undefined => {
    if (!reraNumber.trim()) {
      return "RERA Number is required when RERA is registered";
    }
    const reraRegex = /^[A-Za-z0-9-]{1,30}$/;
    if (!reraRegex.test(reraNumber)) {
      return "RERA Number must be alphanumeric with optional hyphens and up to 30 characters";
    }
    if (state === "27") {
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
  if (!formData.property_type) newErrors.property_type = "Property Type is required";
  if (!formData.property_subtype) newErrors.property_subtype = "Property Sub Type is required";
  if (!formData.project_name.trim()) newErrors.project_name = "Project Name is required";
  if (!formData.builder_name.trim()) {
    newErrors.builder_name = "Builder Name is required";
  } else if (!/^[A-Za-z\s&.-]+$/.test(formData.builder_name.trim())) {
    newErrors.builder_name = "Builder Name can only contain alphabets, spaces, &, ., and -";
  }
  if (formData.around_this.length === 0)
    newErrors.around_this = "At least one place around property is required";
  if (formData.is_rera_registered) {
    const reraError = validateReraNumber(formData.rera_number, formData.state);
    if (reraError) newErrors.rera_number = reraError;
  }
  if (formData.payment_mode.length === 0)
    newErrors.payment_mode = "At least one payment mode is required";
  if (formData.launch_type === "Launched" && !formData.launched_date) {
    newErrors.launched_date = "Launch Date is required for Launched projects";
  } else if (formData.launched_date && !/^\d{4}-\d{2}-\d{2}$/.test(formData.launched_date)) {
    newErrors.launched_date = "Launch Date must be in YYYY-MM-DD format";
  }
  if (
    formData.construction_status === "Under Construction" &&
    !formData.possessionEndDate
  ) {
    newErrors.possessionEndDate = "Possession End Date is required for Under Construction";
  } else if (
    formData.possessionEndDate &&
    !/^\d{4}-\d{2}-\d{2}$/.test(formData.possessionEndDate)
  ) {
    newErrors.possessionEndDate = "Possession End Date must be in YYYY-MM-DD format";
  }
  const sizeErrors: { [key: string]: { [key: string]: string | undefined } } = {};
  formData.sizes.forEach((size) => {
    const errorsForSize: { [key: string]: string | undefined } = {};
    if (!size.carpet_area.trim())
      errorsForSize.carpet_area = isPlotOrLand ? "Width Area is required" : "Carpet Area is required";
    if (!size.sqft_price.trim()) errorsForSize.sqft_price = "Square Foot Price is required";
    if (isPlot) {
      if (!size.plot_area?.trim()) errorsForSize.plot_area = "Plot Area is required";
      if (!size.plotAreaUnits) errorsForSize.plotAreaUnits = "Plot Area Units is required";
      if (!size.lengthArea?.trim()) errorsForSize.lengthArea = "Length Area is required";
      if (!size.lengthAreaUnits) errorsForSize.lengthAreaUnits = "Length Area Units is required";
    } else if (!isLand) {
      if (!size.build_up_area?.trim()) errorsForSize.build_up_area = "Build-Up Area is required";
      if (!size.builtupAreaUnits) errorsForSize.builtupAreaUnits = "Build-Up Area Units is required";
    }
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
 const handleSubmit = useCallback(
  async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill correct details");
      return;
    }
    if (!isAuthenticated || !user?.id || !user?.user_type) {
      toast.error("User authentication data missing");
      return;
    }
    if (!formData.property_id) {
      toast.error("Property ID is missing");
      return;
    }

    const stateName = stateOptions.find((option) => option.value === formData.state)?.text || formData.state;
    const cityName = cityOptions.find((option) => option.value === formData.city)?.text || formData.city;
    const formDataToSend = new FormData();
    formDataToSend.append("property_id", formData.property_id.toString());
    formDataToSend.append("project_name", formData.project_name);
    formDataToSend.append("property_type", formData.property_type);
    formDataToSend.append("property_subtype", formData.property_subtype);
    formDataToSend.append("builder_name", formData.builder_name);
    formDataToSend.append("state", stateName);
    formDataToSend.append("city", cityName);
    formDataToSend.append("locality", formData.locality);
    formDataToSend.append("construction_status", formData.construction_status);
    formDataToSend.append("upcoming_project", formData.is_upcoming ? "Yes" : "No");
    formDataToSend.append("posted_by", user.user_type.toString());
    formDataToSend.append("user_id", user.id.toString());
    formDataToSend.append("rera_registered", formData.is_rera_registered ? "Yes" : "No");
    if (formData.is_rera_registered) {
      formDataToSend.append("rera_number", formData.rera_number);
    }
    formDataToSend.append("launch_type", formData.launch_type);
    if (formData.launch_type === "Launched" && formData.launched_date) {
  formDataToSend.append("launched_date", formData.launched_date);
}
    if (formData.construction_status === "Under Construction" && formData.possessionEndDate) {
      formDataToSend.append("possession_end_date", formData.possessionEndDate);
    }
    formDataToSend.append("payment_mode", JSON.stringify(formData.payment_mode));
    formDataToSend.append(
      "sizes",
      JSON.stringify(
        formData.sizes.map((size) => ({
          plot_area: size.plot_area,
          plotAreaUnits: size.plotAreaUnits,
          build_up_area: size.build_up_area,
          builtupAreaUnits: size.builtupAreaUnits,
          carpet_area: size.carpet_area,
          lengthArea: size.lengthArea,
          lengthAreaUnits: size.lengthAreaUnits,
          sqft_price: size.sqft_price,
        }))
      )
    );
    formDataToSend.append("around_this", JSON.stringify(formData.around_this));
    if (formData.brochure instanceof File) {
      formDataToSend.append("brochure", formData.brochure);
    }
    if (formData.price_sheet instanceof File) {
      formDataToSend.append("price_sheet", formData.price_sheet);
    }
    if (formData.property_image instanceof File) {
      formDataToSend.append("property_image", formData.property_image);
    }
    const floorPlanFiles = formData.sizes
      .map((size) => size.floor_plan)
      .filter((fp): fp is File => fp instanceof File);
    if (floorPlanFiles.length > 0 && floorPlanFiles.length !== formData.sizes.length) {
      toast.error("Number of floor plan files must match number of sizes entries");
      return;
    }
    floorPlanFiles.forEach((fp) => formDataToSend.append("floor_plan", fp));

    try {
      await dispatch(
        updateProperty({ property_id: formData.property_id, formData: formDataToSend })
      ).unwrap();
      toast.success("Project updated successfully");
      setTimeout(() => navigate(-1), 1000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update project");
    }
  },
  [dispatch, navigate, formData, isAuthenticated, user, stateOptions, cityOptions]
);

  const handleCancel = useCallback(() => {
    navigate("/projects/allprojects");
  }, [navigate]);

  const renderError = (error: string | undefined) =>
    error && <p className="text-red-500 text-sm mt-1">{error}</p>;

  if (!project || !formData.property_id) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          No Project Selected
        </h2>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex justify-end items-end">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", link: "/" },
            { label: "All Projects", link: "/projects" },
            { label: "Edit Project", link: "" },
          ]}
        />
      </div>
      <PageMeta title="Edit Project - Project Management" />
      <ComponentCard title="Edit Project">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="min-h-[80px] w-full max-w-md">
            <Label htmlFor="builder_name">Builder Name *</Label>
            <Input
              type="text"
              id="builder_name"
              value={formData.builder_name}
              onChange={handleInputChange("builder_name")}
              placeholder="Enter builder name"
              className="dark:bg-gray-800"
            />
            {renderError(errors.builder_name)}
          </div>
          <div className="min-h-[80px] w-full max-w-md">
            <Label htmlFor="project_name">Project Name *</Label>
            <Input
              type="text"
              id="project_name"
              value={formData.project_name}
              onChange={handleInputChange("project_name")}
              placeholder="Enter project name"
              className="dark:bg-gray-800"
            />
            {renderError(errors.project_name)}
          </div>
          <div className="min-h-[80px] w-full max-w-md">
            <Dropdown
              id="state"
              label="Select State *"
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
              label="Select City *"
              options={cityOptions}
              value={formData.city}
              onChange={handleDropdownChange("city")}
              placeholder="Search for a city..."
              disabled={!formData.state}
              error={errors.city}
            />
          </div>
          <div className="min-h-[80px] w-full max-w-md">
            <Label htmlFor="locality">Locality *</Label>
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
            <Label htmlFor="property_type">Property Type *</Label>
            <div className="flex space-x-4">
              {PROPERTY_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectChange("property_type")(option.value)}
                  className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                    formData.property_type === option.value
                      ? "bg-[#1D3A76] text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {renderError(errors.property_type)}
          </div>
          {formData.property_type && (
            <div className="min-h-[80px]">
              <Label htmlFor="property_subtype">Property Sub Type *</Label>
              <div className="flex flex-wrap gap-4">
                {propertySubTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelectChange("property_subtype")(option.value)}
                    className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                      formData.property_subtype === option.value
                        ? "bg-[#1D3A76] text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {renderError(errors.property_subtype)}
            </div>
          )}
          <div className="min-h-[80px]">
            <Label htmlFor="construction_status">Construction Status *</Label>
            <div className="flex space-x-4">
              {["Under Construction", "Ready to Move"].map((statusOption) => (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() => handleDropdownChange("construction_status")(statusOption)}
                  className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                    formData.construction_status === statusOption
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
              id="launch_type"
              label="Launch Type *"
              options={LAUNCH_TYPES}
              value={formData.launch_type}
              onChange={handleDropdownChange("launch_type")}
              placeholder="Select launch type..."
            />
          </div>
          {formData.launch_type === "Launched" && (
            <div className="min-h-[80px] w-full max-w-md">
              <DatePicker
                id="launched_date"
                label="Launch Date *"
                placeholder="Select launch date"
                defaultDate={formData.launched_date ? new Date(formData.launched_date) : undefined}
                onChange={handleLaunchDateChange}
              />
              {renderError(errors.launched_date)}
            </div>
          )}
         {formData.construction_status === "Under Construction" && (
  <div className="min-h-[80px] w-full max-w-md">
    <DatePicker
      id="possessionEndDate"
      label="Possession End Date *"
      placeholder="Select possession end date"
      defaultDate={formData.possessionEndDate ? new Date(formData.possessionEndDate) : undefined}
      onChange={handlePossessionEndDateChange}
  
    
    />
    {renderError(errors.possessionEndDate)}
  </div>
)}
          <div className="min-h-[80px]">
            <Label htmlFor="is_rera_registered">Is this RERA Registered? *</Label>
            <div className="flex space-x-4 mb-5">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, is_rera_registered: true }))}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  formData.is_rera_registered
                    ? "bg-[#1D3A76] text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, is_rera_registered: false, rera_number: "" }))
                }
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  !formData.is_rera_registered
                    ? "bg-[#1D3A76] text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                No
              </button>
            </div>
          </div>
          {formData.is_rera_registered && (
            <div className="min-h-[80px] w-full max-w-md">
              <Label htmlFor="rera_number">RERA Number *</Label>
              <Input
                type="text"
                id="rera_number"
                value={formData.rera_number}
                onChange={handleInputChange("rera_number")}
                placeholder="Enter RERA number (e.g., P51700012345)"
                className="dark:bg-gray-800"
              />
              {renderError(errors.rera_number)}
            </div>
          )}
          <div className="min-h-[80px]">
            <Label htmlFor="payment_mode">Payment Modes *</Label>
          <div className="flex flex-wrap gap-4">
  {PAYMENT_OPTIONS.map((option) => (
    <button
      key={option.value}
      type="button"
      onClick={() => handlePaymentModeChange(option.value)}
      className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
        formData.payment_mode.includes(option.value)
          ? "bg-[#1D3A76] text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      }`}
    >
      {option.label}
    </button>
  ))}
</div>
            {renderError(errors.payment_mode)}
          </div>
          <div className="min-h-[80px]">
            <Label htmlFor="is_upcoming">Is this an Upcoming Project? *</Label>
            <div className="flex space-x-4 mb-5">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, is_upcoming: true }))}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  formData.is_upcoming
                    ? "bg-[#1D3A76] text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, is_upcoming: false }))}
                className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                  !formData.is_upcoming
                    ? "bg-[#1D3A76] text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sizes *</h3>
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
                {isPlot ? (
                  <>
                    <div className="min-h-[80px]">
                      <Label htmlFor={`plot_area-${size.id}`}>Plot Area *</Label>
                      <div className="flex w-full max-w-md border border-gray-300 rounded-md overflow-hidden">
                        <Input
                          type="number"
                          id={`plot_area-${size.id}`}
                          value={size.plot_area || ""}
                          onChange={handleSizeChange(size.id, "plot_area")}
                          placeholder="Enter plot area"
                          className="w-full px-3 py-2 text-sm border-none focus:ring-0 dark:bg-gray-800"
                        />
                        <select
                          id={`plotAreaUnits-${size.id}`}
                          value={size.plotAreaUnits || ""}
                          onChange={handleSizeChange(size.id, "plotAreaUnits")}
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
                      {renderError(errors.sizes?.[size.id]?.plot_area)}
                      {renderError(errors.sizes?.[size.id]?.plotAreaUnitss)}
                    </div>
                    <div className="min-h-[80px]">
                      <Label htmlFor={`lengthArea-${size.id}`}>Length Area *</Label>
                      <div className="flex w-full max-w-md border border-gray-300 rounded-md overflow-hidden">
                        <Input
                          type="number"
                          id={`lengthArea-${size.id}`}
                          value={size.lengthArea || ""}
                          onChange={handleSizeChange(size.id, "lengthArea")}
                          placeholder="Enter length area"
                          className="w-full px-3 py-2 text-sm border-none focus:ring-0 dark:bg-gray-800"
                        />
                        <select
                          id={`lengthAreaUnits-${size.id}`}
                          value={size.lengthAreaUnits || ""}
                          onChange={handleSizeChange(size.id, "lengthAreaUnits")}
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
                      {renderError(errors.sizes?.[size.id]?.lengthArea)}
                      {renderError(errors.sizes?.[size.id]?.lengthAreaUnits)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="min-h-[80px]">
                      <Label htmlFor={`build_up_area-${size.id}`}>
                        {isLand ? "Length Area *" : "Build-Up Area *"}
                      </Label>
                      <div className="flex w-full max-w-md border border-gray-300 rounded-md overflow-hidden">
                        <Input
                          type="number"
                          id={`build_up_area-${size.id}`}
                          value={size.build_up_area || ""}
                          onChange={handleSizeChange(size.id, "build_up_area")}
                          placeholder={`Enter ${isLand ? "length area" : "built-up area"}`}
                          className="w-full px-3 py-2 text-sm border-none focus:ring-0 dark:bg-gray-800"
                        />
                        <select
                          id={`builtupAreaUnits-${size.id}`}
                          value={size.builtupAreaUnits || ""}
                          onChange={handleSizeChange(size.id, "builtupAreaUnits")}
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
                    </div>
                  </>
                )}
                <div className="min-h-[80px]">
                  <Label htmlFor={`carpet_area-${size.id}`}>
                    {isPlotOrLand ? "Width Area *" : "Carpet Area *"}
                  </Label>
                  <Input
                    type="number"
                    id={`carpet_area-${size.id}`}
                    value={size.carpet_area}
                    onChange={handleSizeChange(size.id, "carpet_area")}
                    placeholder={`Enter ${isPlotOrLand ? "width area" : "carpet area"}`}
                    className="dark:bg-gray-800"
                  />
                  {renderError(errors.sizes?.[size.id]?.carpet_area)}
                </div>
                <div className="min-h-[80px]">
                  <Label htmlFor={`sqft_price-${size.id}`}>Square Feet Price *</Label>
                  <Input
                    type="number"
                    id={`sqft_price-${size.id}`}
                    value={size.sqft_price}
                    onChange={handleSizeChange(size.id, "sqft_price")}
                    placeholder="Enter square feet price"
                    className="dark:bg-gray-800"
                  />
                  {renderError(errors.sizes?.[size.id]?.sqft_price)}
                </div>
                {!isPlot && (
                  <div className="mt-2 text-left">
                    <Label>Floor Plan (Optional)</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id={`floor_plan-${size.id}`}
                        accept="image/jpeg,image/png,application/pdf"
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
                      {size.floor_plan && (
                        <>
                          <span className="text-sm text-gray-500 truncate max-w-[150px]">
                            {typeof size.floor_plan === "string"
                              ? size.floor_plan.split("/").pop()
                              : size.floor_plan?.name || "No file chosen"}
                          </span>
                          <button
                            type="button"
                            onClick={handleDeleteFile(size.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {typeof size.floor_plan === "string" && (
                        <a
                          href={size.floor_plan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          View
                        </a>
                      )}
                    </div>
                    {renderError(errors.sizes?.[size.id]?.floor_plan)}
                  </div>
                )}
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
            <Label htmlFor="around_this" className="mt-4">
              Around This Property *
            </Label>
            <div className="flex space-x-6 my-4 w-full">
              <Input
                type="text"
                id="around_this-place"
                placeholder="Place around property"
                value={placeAroundProperty}
                onChange={(e) => setPlaceAroundProperty(e.target.value)}
                className="dark:bg-gray-800"
              />
              <div className="flex w-auto border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                <Input
                  type="number"
                  id="around_this-distance"
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
            {renderError(errors.around_this)}
            {formData.around_this.length > 0 && (
              <div className="mt-4">
                <ul className="space-y-2">
                  {formData.around_this.map((entry, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <span>
                        {entry.title} - {entry.distance}
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
                onClick={() => brochureInputRef.current?.click()}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1D3A76] rounded-md hover:bg-blue-900"
              >
                Choose File
              </button>
              {formData.brochure && (
                <>
                  <span className="text-sm text-gray-500">
                    {typeof formData.brochure === "string"
                      ? formData.brochure.split("/").pop()
                      : formData.brochure?.name || "No file chosen"}
                  </span>
                  <button
                    type="button"
                    onClick={handleDeleteBrochure}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
              {typeof formData.brochure === "string" && (
                <a
                  href={formData.brochure}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View
                </a>
              )}
            </div>
            {renderError(errors.brochure)}
          </div>
          <div className="space-y-1">
            <Label>Upload Price Sheet (Optional)</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="price_sheet"
                ref={priceSheetInputRef}
                accept="application/pdf"
                onChange={handlePriceSheetChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => priceSheetInputRef.current?.click()}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#1D3A76] rounded-md hover:bg-blue-900"
              >
                Choose File
              </button>
              {formData.price_sheet && (
                <>
                  <span className="text-sm text-gray-500">
                    {typeof formData.price_sheet === "string"
                      ? formData.price_sheet.split("/").pop()
                      : formData.price_sheet?.name || "No file chosen"}
                  </span>
                  <button
                    type="button"
                    onClick={handleDeletePriceSheet}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
              {typeof formData.price_sheet === "string" && (
                <a
                  href={formData.price_sheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View
                </a>
              )}
            </div>
            {renderError(errors.price_sheet)}
          </div>
          <div className="space-y-1">
            <Label>Upload Property Image (Optional)</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="property_image"
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
              {formData.property_image && (
                <>
                  <span className="text-sm text-gray-500 truncate max-w-[150px]">
                    {typeof formData.property_image === "string"
                      ? formData.property_image.split("/").pop()
                      : formData.property_image?.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleDeletePropertyImage}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
              {typeof formData.property_image === "string" && (
                <img
                  src={formData.property_image}
                  alt="Current property image"
                  className="mt-2 w-24 h-24 object-cover rounded"
                />
              )}
            </div>
            {renderError(errors.property_image)}
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-[30%] px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-[30%] px-4 py-2 text-white bg-[#1D3A76] rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default EditProject;