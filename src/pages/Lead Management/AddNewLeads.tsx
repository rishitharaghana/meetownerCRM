import React, { useState } from "react";
import { User, Building, Target, Users } from "lucide-react";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";

interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-realty-700 dark:text-realty-300">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-realty-primary focus:border-realty-primary transition-colors ${
        error ? "border-red-500" : "border-realty-200"
      }`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

interface FormData {
  name: string;
  mobile: string;
  email: string;
  interestedProject: string;
  leadSource: string;
  channelPartner: string;
  campaign: string;
}

interface Errors {
  name?: string;
  mobile?: string;
  email?: string;
  interestedProject?: string;
  leadSource?: string;
  channelPartner?: string;
  campaign?: string;
}

const LeadForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    interestedProject: "",
    leadSource: "",
    channelPartner: "",
    campaign: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const projectOptions = [
    { value: "luxury-towers", label: "Luxury Towers - Premium Residential" },
    { value: "garden-villas", label: "Garden Villas - Independent Houses" },
    { value: "metro-heights", label: "Metro Heights - Apartment Complex" },
    { value: "royal-estates", label: "Royal Estates - Luxury Condos" },
  ];

  const leadSourceOptions = [
    { value: "channel_partner", label: "Channel Partner" },
    { value: "campaign", label: "Marketing Campaign" },
  ];

  const channelPartnerOptions = [
    { value: "partner_1", label: "Premium Real Estate Partners" },
    { value: "partner_2", label: "Elite Property Consultants" },
    { value: "partner_3", label: "Prime Realty Associates" },
  ];

  const campaignOptions = [
    { value: "google_ads", label: "Google Ads Campaign" },
    { value: "meta_ads", label: "Meta/Facebook Ads" },
  ];

  const handleInputChange =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      console.log(`Field: ${field}, Value: ${value}`);
      setFormData((prev) => {
        if (field === "leadSource") {
          return {
            ...prev,
            [field]: value,
            channelPartner: "",
            campaign: "",
          };
        }
        return { ...prev, [field]: value };
      });

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.interestedProject) {
      newErrors.interestedProject = "Please select a project";
    }

    if (!formData.leadSource) {
      newErrors.leadSource = "Please select a lead source";
    }

    if (formData.leadSource === "channel_partner" && !formData.channelPartner) {
      newErrors.channelPartner = "Please select a channel partner";
    }

    if (formData.leadSource === "campaign" && !formData.campaign) {
      newErrors.campaign = "Please select a campaign";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess("Lead created successfully!");
      setFormData({
        name: "",
        mobile: "",
        email: "",
        interestedProject: "",
        leadSource: "",
        channelPartner: "",
        campaign: "",
      });
    } catch (error) {
      setSubmitError("Failed to create lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-realty-50 via-white to-realty-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {submitSuccess && (
          <div className="p-3 mb-6 bg-green-100 text-green-700 rounded-md">
            {submitSuccess}
          </div>
        )}
        {submitError && (
          <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-md">
            {submitError}
          </div>
        )}

        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-900 rounded-full mb-4 shadow-lg">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Add New Lead
          </h1>
          <p className="text-gray-600 text-sm ">
            Capture potential client information for your real estate projects
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-[#1D3A76]" />
                Personal Information
              </h2>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-realty-700 dark:text-realty-300">
                  Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  placeholder="Enter customer's full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-realty-700 dark:text-realty-300">
                  Mobile Number
                </label>
                <Input
                  type="tel"
                  value={formData.mobile}
                  onChange={handleInputChange("mobile")}
                  placeholder="Enter 10-digit mobile number"
                  className={errors.mobile ? "border-red-500" : ""}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-realty-700 dark:text-realty-300">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-realty-200">
              <h2 className="text-lg font-semibold text-realty-700 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Project Interest
              </h2>

              <Select
                label="Interested Project"
                options={projectOptions}
                value={formData.interestedProject}
                onChange={handleInputChange("interestedProject")}
                placeholder="Search or select a project"
                error={errors.interestedProject}
              />
            </div>

            <div className="space-y-6 pt-6 border-t border-realty-200">
              <h2 className="text-lg font-semibold text-realty-700 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Lead Source
              </h2>

              <Select
                label="Lead Source"
                options={leadSourceOptions}
                value={formData.leadSource}
                onChange={handleInputChange("leadSource")}
                placeholder="Select lead source"
                error={errors.leadSource}
              />

              {formData.leadSource === "channel_partner" && (
                <Select
                  label="Channel Partner"
                  options={channelPartnerOptions}
                  value={formData.channelPartner}
                  onChange={handleInputChange("channelPartner")}
                  placeholder="Select channel partner"
                  error={errors.channelPartner}
                />
              )}

              {formData.leadSource === "campaign" && (
                <Select
                  label="Marketing Campaign"
                  options={campaignOptions}
                  value={formData.campaign}
                  onChange={handleInputChange("campaign")}
                  placeholder="Select campaign"
                  error={errors.campaign}
                />
              )}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-900 text-white font-semibold rounded-xl  transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Lead...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-5 h-5 text-white" />
                    Create Lead
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-8 text-realty-600">
          <p className="text-sm">
            All lead information is securely stored and processed according to
            our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
