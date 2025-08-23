import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Target, List } from "lucide-react";
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
  const { leadSources, loading: leadsLoading, error: leadsError } = useSelector(
    (state: RootState) => state.lead
  );

  const [formData, setFormData] = useState<FormData>({ lead_source_name: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<"add" | "list">("add");

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
      const result = await dispatch(
        addLeadSource({ lead_source_name: formData.lead_source_name })
      ).unwrap();
      setSubmitSuccess(`Lead source "${result.lead_source_name}" added successfully!`);
      setFormData({ lead_source_name: "" });
      dispatch(getLeadSources());
      toast.success("Lead source added successfully!");
      setActiveTab("list"); // Switch to list tab after success
    } catch (error: any) {
      setSubmitError(error.message || "Failed to add lead source. Please try again.");
      toast.error(error.message || "Failed to add lead source");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-realty-50 via-white to-realty-100 py-8 px-4">
      <div className="flex justify-end mb-6">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", link: "/" },
            { label: "Lead Sources", link: "/lead-sources" },
          ]}
        />
      </div>
      <PageMeta title="Lead Source - Lead Management" />

      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl border border-gray-300 bg-white shadow-md overflow-hidden">
            <button
              onClick={() => setActiveTab("add")}
              className={`px-6 py-2 flex items-center gap-2 font-medium transition-all ${
                activeTab === "add"
                  ? "bg-blue-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Target className="w-5 h-5" />
              Add Lead Source
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-2 flex items-center gap-2 font-medium transition-all ${
                activeTab === "list"
                  ? "bg-blue-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
              All Lead Sources
            </button>
          </div>
        </div>

        {/* Add Lead Source Tab */}
        {activeTab === "add" && (
          <div className="mb-8">
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
            {leadsError && (
              <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-md">
                {leadsError}
              </div>
            )}
            <div className="text-center mb-6 animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Add New Lead Source
              </h1>
              <p className="text-gray-600 text-sm">
                Add a new source for tracking lead origins
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 animate-fade-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-realty-700 dark:text-realty-300">
                    Lead Source Name
                  </label>
                  <Input
                    type="text"
                    value={formData.lead_source_name}
                    onChange={handleInputChange}
                    placeholder="Enter lead source name (e.g., LinkedIn Ads)"
                    className={errors.lead_source_name ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.lead_source_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lead_source_name}
                    </p>
                  )}
                </div>
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || leadsLoading}
                    className="max-w-max py-3 px-3 bg-blue-900 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
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
        )}

        {/* All Lead Sources Tab */}
        {activeTab === "list" && (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              All Lead Sources
            </h2>
            {leadsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-3 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
                  <span className="text-gray-600 text-base font-medium">
                    Loading lead sources...
                  </span>
                </div>
              </div>
            ) : leadsError ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center text-base font-medium">
                {leadsError}
              </div>
            ) : !leadSources || leadSources.length === 0 ? (
              <div className="p-4 text-gray-500 text-center text-base font-medium">
                No lead sources available.
              </div>
            ) : (
              <ul className="space-y-3">
                {leadSources.map((source) => (
                  <li
                    key={source.lead_source_id}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-realty-50/80 transition-colors duration-200"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {source.lead_source_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(source.date_added).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadSource;
