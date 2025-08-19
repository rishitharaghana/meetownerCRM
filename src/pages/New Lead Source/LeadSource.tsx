import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Target } from "lucide-react";
import Input from "../../components/form/input/InputField";
import { AppDispatch, RootState } from "../../store/store";
import { addLeadSource, getLeadSources } from "../../store/slices/leadslice";
import PageMeta from "../../components/common/PageMeta";
import toast from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface FormData {
  lead_source_name: string; 
}

interface Errors {
  lead_source_name?: string; 
}

const LeadSource: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: leadsLoading, error: leadsError } = useSelector((state: RootState) => state.lead);

  const [formData, setFormData] = useState<FormData>({ lead_source_name: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getLeadSources());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ lead_source_name: value });
    if (errors.lead_source_name) {
      setErrors({ lead_source_name: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.lead_source_name.trim()) {
      newErrors.lead_source_name = "Lead source name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill correct details");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const result = await dispatch(addLeadSource({ lead_source_name: formData.lead_source_name })).unwrap();
      setSubmitSuccess(`Lead source "${result.lead_source_name}" added successfully!`);
      setFormData({ lead_source_name: "" });
      dispatch(getLeadSources()); 
      toast.success("Lead source added successfully!");
    } catch (error: any) {
      setSubmitError(error.message || "Failed to add lead source. Please try again.");
      toast.error(error.message || "Failed to add lead source");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-realty-50 via-white to-realty-100 py-8 px-4">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", link: "/" },
            { label: "Add Lead Source", link: "/add-lead-source" },
          ]}
        />
      </div>
      <PageMeta title="Add Lead Source - Lead Management" />

      <div className="max-w-md mx-auto">
        {submitSuccess && (
          <div className="p-3 mb-6 bg-green-100 text-green-700 rounded-md">{submitSuccess}</div>
        )}
        {submitError && (
          <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-md">{submitError}</div>
        )}
        {leadsError && (
          <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-md">{leadsError}</div>
        )}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Lead Source</h1>
          <p className="text-gray-600 text-sm">Add a new source for tracking lead origins</p>
        </div>
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-realty-700 dark:text-realty-300">Lead Source Name</label>
              <Input
                type="text"
                value={formData.lead_source_name}
                onChange={handleInputChange}
                placeholder="Enter lead source name (e.g., LinkedIn Ads)"
                className={errors.lead_source_name ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.lead_source_name && <p className="text-red-500 text-sm mt-1">{errors.lead_source_name}</p>}
            </div>
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || leadsLoading}
                className="w-full py-3 bg-blue-900 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting || leadsLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding Lead Source...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Target className="w-5 h-5 text-white" />
                    Add Lead Source
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadSource;