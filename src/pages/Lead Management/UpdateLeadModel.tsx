import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getLeadStatuses, updateLeadByEmployee } from "../../store/slices/leadslice";
import { logout, isTokenExpired } from "../../store/slices/authSlice"; // Import isTokenExpired and logout
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import DatePicker from "../../components/form/date-picker";
import { LeadStatus } from "../../types/LeadModel";
import { useParams } from "react-router";
import toast ,{ Toaster } from "react-hot-toast";
 
interface UpdateLeadModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const UpdateLeadModal: React.FC<UpdateLeadModalProps> = ({ onClose, onSubmit }) => {
  const { leadId } = useParams<{ leadId: string }>();
  console.log("Lead ID:", leadId);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { leadStatuses, loading: statusesLoading, error: statusesError } = useSelector(
    (state: RootState) => state.lead
  );
  console.log("leadStatus,lead",leadStatuses)

  const [formData, setFormData] = useState({
    follow_up_feedback: "",
    next_action: "",
    status_id: "",
    followup_date: "",
    action_date: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  console.log("submitSuccess",submitSuccess)
  const [submitError, setSubmitError] = useState<string | null>(null);
const initialFormData = {
    follow_up_feedback: "",
    next_action: "",
    status_id: "",
    followup_date: "",
    action_date: "",
  };
  const statusOptions = leadStatuses?.map((status: LeadStatus) => ({
    value: status.status_id.toString(),
    label: status.status_name,
  })) || [];

  useEffect(() => {
    dispatch(getLeadStatuses());

    // Check token validity on mount
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      dispatch(logout());
      setSubmitError("Your session has expired. Please log in again.");
    }
  }, [dispatch]);

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formData.status_id) newErrors.status_id = "Status is required";

    if (!formData.follow_up_feedback.trim()) newErrors.follow_up_feedback = "Follow-up feedback is required";

    if (!formData.next_action.trim()) newErrors.next_action = "Next action is required";

    if ((formData.status_id === "2" || formData.status_id === "3") && !formData.followup_date.trim()) {
      newErrors.followup_date = "Follow-up date is required for Follow-up or In Progress status";
    }

    if ((formData.status_id === "2" || formData.status_id === "3") && formData.followup_date < today) {
      newErrors.followup_date = "Follow-up date cannot be in the past";
    }
    if (formData.status_id !== "2" && formData.status_id !== "3" && formData.status_id && !formData.action_date.trim()) {
      newErrors.action_date = "Action date is required";
    }
    if (formData.status_id !== "2" && formData.status_id !== "3" && formData.status_id && formData.action_date > today) {
      newErrors.action_date = "Action date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
console.log("trigger")
    if (!leadId) {
      setSubmitError("Invalid lead ID. Please try again.");
      return;
    }
    console.log("leadId,",leadId)

    if (!user?.id || !user?.user_type || !user?.name || !user?.mobile) {
      setSubmitError("User information is missing. Please log in again.");
      return;
    }

    console.log("checking dataa")
    const token = localStorage.getItem("token");
    console.log("tokem",token)
    console.log("Token before request:", token); // Debug token
    if (!token || isTokenExpired(token)) {
      dispatch(logout());
      setSubmitError("Your session has expired. Please log in again.");
      return;
    }
    console.log("hello token found" )


    try {
      const submitData = {
        lead_id: leadId,
        follow_up_feedback: formData.follow_up_feedback,
        next_action: formData.next_action,
        status_id: parseInt(formData.status_id),
        updated_by_emp_type: user.user_type,
        updated_by_emp_id: user.id,
        updated_by_emp_name: user.name,
        updated_emp_phone: user.mobile,
        lead_added_user_type: user.created_user_type,
        lead_added_user_id: user.created_user_id,
        followup_date: (formData.status_id === "2" || formData.status_id === "3") ? formData.followup_date : undefined,
        action_date: (formData.status_id !== "2" && formData.status_id !== "3") ? formData.action_date : undefined,
      };
console.log("submit",submitData)
      const result = await dispatch(updateLeadByEmployee(submitData)).unwrap();

      console.log("result",result)
      setSubmitSuccess(`Lead updated successfully! Lead ID: ${submitData.lead_id}`);
        setFormData(initialFormData);
     
      toast.success(`Lead updated successfully! Lead ID: ${submitData.lead_id}`)
   
    setSubmitSuccess("");
      
    } catch (error: any) {

      toast.error(error.message || "Failed to update lead. Please try again.")
    } finally {
      setIsSubmitting(false);
    }
  };

  if (statusesLoading) {
    return <div>Loading statuses...</div>;
  }

  return (
    <div className="pointer-events-auto">
      <Toaster/>
      <div className="bg-white/30 backdrop-blur-sm">
        <div className="relative flex items-center p-8 justify-center m-auto h-full">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Update Lead</h2>
            {submitSuccess && (
              <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-md">
                {submitSuccess}
              </div>
            )}
           
            {statusesError && (
              <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
                {statusesError}
              </div>
            )}
            {Object.keys(errors).length > 0 && (
              <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
                Please fix the errors in the form before submitting.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Status"
                options={statusOptions}
                value={formData.status_id}
                onChange={handleInputChange("status_id")}
                placeholder="Select status"
                error={errors.status_id}
              />
              {(formData.status_id === "2" || formData.status_id === "3") && (
                <div className="space-y-1">
                  <DatePicker
                    id="followup_date"
                    label="Follow-up Date"
                    placeholder="Select follow-up date"
                    defaultDate={formData.followup_date}
                    minDate={new Date()}
                    onChange={(selectedDates: Date[]) => {
                      if (selectedDates.length > 0) {
                        const date = selectedDates[0].toLocaleDateString("en-CA");
                        console.log("date",date)
                        handleInputChange("followup_date")(date);
                      } else {
                        handleInputChange("followup_date")("");
                      }
                    }}
                  />
                  {errors.followup_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.followup_date}</p>
                  )}
                </div>
              )}
              {formData.status_id !== "2" && formData.status_id !== "3" && formData.status_id && (
                <div className="space-y-1">
                  <DatePicker
                    id="action_date"
                    label="Action Date"
                    placeholder="Select action date"
                    defaultDate={formData.action_date}
                    minDate={new Date()}
                    onChange={(selectedDates: Date[]) => {
                      if (selectedDates.length > 0) {
                        const date = selectedDates[0].toLocaleDateString("en-CA");
                        handleInputChange("followup_date")(date);
                      } else {
                        handleInputChange("action_date")("");
                      }
                    }}
                  />
                  {errors.action_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.action_date}</p>
                  )}
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Follow-up Feedback
                </label>
                <Input
                  type="text"
                  value={formData.follow_up_feedback}
                  onChange={(e) => handleInputChange("follow_up_feedback")(e.target.value)}
                  placeholder="Enter follow-up feedback"
                  className={errors.follow_up_feedback ? "border-red-500" : ""}
                />
                {errors.follow_up_feedback && (
                  <p className="text-red-500 text-sm mt-1">{errors.follow_up_feedback}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Next Action
                </label>
                <Input
                  type="text"
                  value={formData.next_action}
                  onChange={(e) => handleInputChange("next_action")(e.target.value)}
                  placeholder="Enter next action"
                  className={errors.next_action ? "border-red-500" : ""}
                />
                {errors.next_action && (
                  <p className="text-red-500 text-sm mt-1">{errors.next_action}</p>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || statusesLoading}
                >
                  {isSubmitting || statusesLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Lead...
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateLeadModal;