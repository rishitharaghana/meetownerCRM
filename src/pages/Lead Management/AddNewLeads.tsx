import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { AppDispatch, RootState } from "../../store/store";
import { getAllApprovedListing } from "../../store/slices/approve_listings";
import PageMeta from "../../components/common/PageMeta";
import MultiSelect from "../../components/form/MultiSelect";

// Define interfaces for form data and errors
interface FormData {
  name: string;
  mobile: string;
  email: string;
  interestedProject: string; // Stores unique_property_id
  leadSource: string;
  channelPartner: string; // Selected channel partner
  campaign: string; // Selected campaign
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

interface Option {
  value: string;
  text: string;
}

export default function AddNewLead() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { lead_in, status } = useParams<{ lead_in: string; status: string }>();
  const { listings } = useSelector((state: RootState) => state.approved); // Access approved listings from Redux

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

  // Fetch approved listings on mount
  useEffect(() => {
    dispatch(getAllApprovedListing());
  }, [dispatch]);

  // Options for Interested Project (from approved listings)
  const projectOptions: Option[] = listings.map((property) => ({
    value: property.unique_property_id,
    text: `${property.unique_property_id} - ${property.property_name || "Unnamed Property"}`,
  }));

  // Options for Lead Source
  const leadSourceOptions: Option[] = [
    { value: "channel_partner", text: "Channel Partner" },
    { value: "campaign", text: "Campaign" },
  ];

  // Options for Channel Partners
  const channelPartnerOptions: Option[] = [
    { value: "channel_partner_1", text: "Channel Partner 1" },
    { value: "channel_partner_2", text: "Channel Partner 2" },
    { value: "channel_partner_3", text: "Channel Partner 3" },
  ];

  // Options for Campaigns
  const campaignOptions: Option[] = [
    { value: "google_ads", text: "Google Ads" },
    { value: "meta_ads", text: "Meta Ads" },
  ];

  // Handle input changes
  const handleInputChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => {
      // Reset secondary fields when leadSource changes
      if (field === "leadSource") {
        return {
          ...prev,
          [field]: value,
          channelPartner: "",
          campaign: "",
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // Validate form
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
      newErrors.interestedProject = "Interested project is required";
    }

    if (!formData.leadSource) {
      newErrors.leadSource = "Lead source is required";
    }

    if (formData.leadSource === "channel_partner" && !formData.channelPartner) {
      newErrors.channelPartner = "Channel partner selection is required";
    }

    if (formData.leadSource === "campaign" && !formData.campaign) {
      newErrors.campaign = "Campaign selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedProject = projectOptions.find(
        (option) => option.value === formData.interestedProject
      );
      const selectedLeadSource = leadSourceOptions.find(
        (option) => option.value === formData.leadSource
      );
      const selectedChannelPartner = channelPartnerOptions.find(
        (option) => option.value === formData.channelPartner
      );
      const selectedCampaign = campaignOptions.find(
        (option) => option.value === formData.campaign
      );

      const leadData = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        interested_project_id: formData.interestedProject,
        interested_project_name: selectedProject ? selectedProject.text.split(" - ")[1] : "",
        lead_source: selectedLeadSource ? selectedLeadSource.text : formData.leadSource,
        channel_partner: selectedChannelPartner ? selectedChannelPartner.text : "",
        campaign: selectedCampaign ? selectedCampaign.text : "",
      };

      console.log("New Lead Data:", leadData);
      alert("Lead submitted successfully!");
      navigate(`/leads/${lead_in}/${status}`); // Navigate back to the leads page
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(`/leads/${lead_in}/${status}`);
  };

  return (
    <div className="relative min-h-screen">
      <PageMeta title={`Lead Management - Add New Lead`} />
      <ComponentCard title="Add New Lead">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="min-h-[80px]">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder="Enter customer name"
              className="dark:bg-dark-900"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              type="text"
              id="mobile"
              value={formData.mobile}
              onChange={handleInputChange("mobile")}
              placeholder="Enter 10-digit mobile number"
              className="dark:bg-dark-900"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          <div className="min-h-[80px]">
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              placeholder="Enter email address"
              className="dark:bg-dark-900"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="min-h-[80px]">
  <MultiSelect
    label="Interested Project"
    options={projectOptions}
    defaultSelected={formData.interestedProject ? [formData.interestedProject] : []} // Use interestedProject, not name
    onChange={(value) => {
      // Assuming MultiSelect with singleSelect={true} returns a single value or an array
      const selectedValue = Array.isArray(value) ? value[0] || "" : value || "";
      setFormData((prev) => ({
        ...prev,
        interestedProject: selectedValue,
      }));
      if (errors.interestedProject) {
        setErrors((prev) => ({ ...prev, interestedProject: undefined }));
      }
    }}
    singleSelect={true}
  />
  {errors.interestedProject && (
    <p className="text-red-500 text-sm mt-1">{errors.interestedProject}</p>
  )}
</div>
          <div className="min-h-[80px]">
            <Label htmlFor="leadSource">Lead Source</Label>
            <select
              id="leadSource"
              value={formData.leadSource}
              onChange={handleInputChange("leadSource")}
              className="w-full p-2 border rounded-lg dark:bg-dark-900 dark:text-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a lead source</option>
              {leadSourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
            {errors.leadSource && (
              <p className="text-red-500 text-sm mt-1">{errors.leadSource}</p>
            )}
          </div>

          {formData.leadSource === "channel_partner" && (
            <div className="min-h-[80px]">
              <Label htmlFor="channelPartner">Channel Partner</Label>
              <select
                id="channelPartner"
                value={formData.channelPartner}
                onChange={handleInputChange("channelPartner")}
                className="w-full p-2 border rounded-lg dark:bg-dark-900 dark:text-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a channel partner</option>
                {channelPartnerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
              {errors.channelPartner && (
                <p className="text-red-500 text-sm mt-1">{errors.channelPartner}</p>
              )}
            </div>
          )}

          {formData.leadSource === "campaign" && (
            <div className="min-h-[80px]">
              <Label htmlFor="campaign">Campaign</Label>
              <select
                id="campaign"
                value={formData.campaign}
                onChange={handleInputChange("campaign")}
                className="w-full p-2 border rounded-lg dark:bg-dark-900 dark:text-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a campaign</option>
                {campaignOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
              {errors.campaign && (
                <p className="text-red-500 text-sm mt-1">{errors.campaign}</p>
              )}
            </div>
          )}

          <div className="flex justify-center space-x-4">
            
            <button
              type="submit"
              className="px-4 py-2 bg-[#1D3A76] text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}