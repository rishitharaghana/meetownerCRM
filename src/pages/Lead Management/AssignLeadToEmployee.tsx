import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { AppDispatch, RootState } from "../../store/store";
import {
  assignLeadToEmployee,
  getLeadStatuses,
  fetchTodayFollowUps,
} from "../../store/slices/leadslice";
import {
  fetchOngoingProjects,
  fetchUpcomingProjects,
} from "../../store/slices/projectSlice";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import { User as UserType } from "../../types/UserModel";
import { LeadStatus } from "../../types/LeadModel";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { getUsersByType } from "../../store/slices/userslice";
import DatePicker from "../../components/form/date-picker";

interface Project {
  property_id: string | number;
  project_name: string;
  property_type: string;
}

const AssignLeadEmployeePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { leadId } = useParams<{ leadId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { users, loading: usersLoading } = useSelector(
    (state: RootState) => state.user
  );
  const {
    leadStatuses,
    loading: statusesLoading,
    error: statusesError,
  } = useSelector((state: RootState) => state.lead);
  const {
    ongoingProjects,
    upcomingProjects,
    loading: projectsLoading,
  } = useSelector((state: RootState) => state.projects);

  const [formData, setFormData] = useState({
    assigned_user_type: "",
    assigned_id: "",
    assigned_name: "",
    assigned_emp_number: "",
    assigned_priority: "",
    status_id: "",
    followup_feedback: "",
    next_action: "",
    followup_date: "",
    action_date: "",
    interested_project_id: "",
    interested_project_name: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const userTypeOptions = [
    { value: "3", label: "Channel Partner" },
    { value: "4", label: "Sales Manager" },
    { value: "5", label: "Telecallers" },
    { value: "6", label: "Marketing Executive" },
    { value: "7", label: "Receptionists" },
  ];

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const statusOptions =
    leadStatuses?.map((status: LeadStatus) => ({
      value: status.status_id.toString(),
      label: status.status_name,
    })) || [];

  const userOptions =
    users?.map((user: UserType) => ({
      value: user.id.toString(),
      label: `${user.name} - ${user.mobile}`,
    })) || [];

  const projectOptions =
    [...ongoingProjects, ...upcomingProjects]?.map((project: Project) => ({
      value: project.property_id.toString(),
      label: `${project.project_name} - ${project.property_type}`,
    })) || [];

  useEffect(() => {
    if (user?.id) {
      dispatch(
        fetchOngoingProjects({
          admin_user_type: user.user_type,
          admin_user_id: user.id,
        })
      );
      dispatch(
        fetchUpcomingProjects({
          admin_user_type: user.user_type,
          admin_user_id: user.id,
        })
      );
      if (formData.assigned_user_type) {
        dispatch(
          getUsersByType({
            admin_user_id: user.id,
            emp_user_type: parseInt(formData.assigned_user_type),
            status: 1,
          })
        );
      }
      dispatch(getLeadStatuses());
    }
  }, [formData.assigned_user_type, user?.id, dispatch]);

  const handleInputChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => {
        if (field === "interested_project_id") {
          const selectedProject = projectOptions.find(
            (opt) => opt.value === value
          );
          return {
            ...prev,
            [field]: value,
            interested_project_name:
              selectedProject?.label.split(" - ")[0] || "",
          };
        }
        if (field === "assigned_id") {
          const selectedUser = users?.find(
            (user: UserType) => user.id.toString() === value
          );
          return {
            ...prev,
            [field]: value,
            assigned_name: selectedUser ? selectedUser.name : "",
            assigned_emp_number: selectedUser ? selectedUser.mobile : "",
          };
        }
        return { ...prev, [field]: value };
      });

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

    if (!formData.assigned_user_type)
      newErrors.assigned_user_type = "Employee type is required";
    if (!formData.assigned_id) newErrors.assigned_id = "Employee is required";
    if (!formData.assigned_priority)
      newErrors.assigned_priority = "Priority is required";
    if (!formData.followup_feedback.trim())
      newErrors.followup_feedback = "Follow-up feedback is required";
    if (!formData.next_action.trim())
      newErrors.next_action = "Next action is required";
    if (
      (formData.status_id === "2" || formData.status_id === "3") &&
      !formData.followup_date.trim()
    ) {
      newErrors.followup_date =
        "Follow-up date is required for Follow-up or In Progress status";
    }
    if (
      (formData.status_id === "2" || formData.status_id === "3") &&
      formData.followup_date < today
    ) {
      newErrors.followup_date = "Follow-up date cannot be in the past";
    }
    if (
      formData.status_id !== "2" &&
      formData.status_id !== "3" &&
      formData.status_id &&
      !formData.action_date.trim()
    ) {
      newErrors.action_date = "Action date is required";
    }
    if (
      formData.status_id !== "2" &&
      formData.status_id !== "3" &&
      formData.status_id &&
      formData.action_date < today
    ) {
      newErrors.action_date = "Action date cannot be in the past";
    }
    if (!formData.interested_project_id) {
      newErrors.interested_project_id = "Suggestion project is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!user?.id || !user?.user_type) {
      setSubmitError("User information is missing. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const submitData = {
        lead_id: parseInt(leadId || "0"),
        assigned_user_type: parseInt(formData.assigned_user_type),
        assigned_id: parseInt(formData.assigned_id),
        assigned_name: formData.assigned_name,
        assigned_emp_number: formData.assigned_emp_number,
        assigned_priority: formData.assigned_priority,
        followup_feedback: formData.followup_feedback,
        next_action: formData.next_action,
        lead_added_user_type: user.user_type,
        lead_added_user_id: user.id,
        status_id: formData.status_id
          ? parseInt(formData.status_id)
          : undefined,
        followup_date:
          formData.status_id === "2" || formData.status_id === "3"
            ? formData.followup_date
            : undefined,
        action_date:
          formData.status_id !== "2" && formData.status_id !== "3"
            ? formData.action_date
            : undefined,
        interested_project_id: parseInt(formData.interested_project_id),
        interested_project_name: formData.interested_project_name,
      };

      await dispatch(assignLeadToEmployee(submitData)).unwrap();
      setSubmitSuccess(
        `Lead assigned successfully! Lead ID: ${submitData.lead_id}`
      );
      if (
        formData.status_id === "2" &&
        formData.followup_date === new Date().toISOString().split("T")[0]
      ) {
        dispatch(
          fetchTodayFollowUps({
            admin_user_id: user.id,
            lead_added_user_type: user.user_type,
            status_id: "2",
          })
        );
      }
      navigate(-1);
    } catch (error: any) {
      setSubmitError(
        error.message || "Failed to assign lead. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen p-6">
      <PageMeta title="Assign Lead - Lead Management" />
      <PageBreadcrumb title="Assign Lead" />
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Assign Lead</h2>
        {submitSuccess && (
          <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-md">
            {submitSuccess}
          </div>
        )}
        {submitError && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
            {submitError}
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
            label="Employee Type"
            options={userTypeOptions}
            value={formData.assigned_user_type}
            onChange={handleInputChange("assigned_user_type")}
            placeholder={
              usersLoading ? "Loading types..." : "Select employee type"
            }
            error={errors.assigned_user_type}
          />
          <Select
            label="Employee"
            options={userOptions}
            value={formData.assigned_id}
            onChange={handleInputChange("assigned_id")}
            placeholder={
              usersLoading ? "Loading employees..." : "Select employee"
            }
            error={errors.assigned_id}
          />
          <Select
            label="Priority"
            options={priorityOptions}
            value={formData.assigned_priority}
            onChange={handleInputChange("assigned_priority")}
            placeholder="Select priority"
            error={errors.assigned_priority}
          />
          <Select
            label="Status (Optional)"
            options={statusOptions}
            value={formData.status_id}
            onChange={handleInputChange("status_id")}
            placeholder={
              statusesLoading
                ? "Loading statuses..."
                : "Select status (optional)"
            }
            error={errors.status_id}
          />
          <Select
            label="Suggestion Project"
            options={projectOptions}
            value={formData.interested_project_id}
            onChange={handleInputChange("interested_project_id")}
            placeholder={
              projectsLoading
                ? "Loading projects..."
                : "Select Suggestion project"
            }
            error={errors.interested_project_id}
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
                    const selected = selectedDates[0];
                    const date = selected.toLocaleDateString("en-CA");
                    handleInputChange("followup_date")(date);
                  } else {
                    handleInputChange("followup_date")("");
                  }
                }}
              />
              {errors.followup_date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.followup_date}
                </p>
              )}
            </div>
          )}
          {formData.status_id !== "2" &&
            formData.status_id !== "3" &&
            formData.status_id && (
              <div className="space-y-1">
                <DatePicker
                  id="action_date"
                  label="Action Date"
                  placeholder="Select action date"
                  defaultDate={formData.action_date}
                  minDate={new Date()}
                  onChange={(selectedDates: Date[]) => {
                    if (selectedDates.length > 0) {
                      const date = selectedDates[0].toISOString().split("T")[0];
                      handleInputChange("action_date")(date);
                    } else {
                      handleInputChange("action_date")("");
                    }
                  }}
                />
                {errors.action_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.action_date}
                  </p>
                )}
              </div>
            )}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Follow-up Feedback
            </label>
            <Input
              type="text"
              value={formData.followup_feedback}
              onChange={(e) =>
                handleInputChange("followup_feedback")(e.target.value)
              }
              placeholder="Enter follow-up feedback"
              className={errors.followup_feedback ? "border-red-500" : ""}
            />
            {errors.followup_feedback && (
              <p className="text-red-500 text-sm mt-1">
                {errors.followup_feedback}
              </p>
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
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                isSubmitting ||
                usersLoading ||
                statusesLoading ||
                projectsLoading
              }
            >
              {isSubmitting ||
              usersLoading ||
              statusesLoading ||
              projectsLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Assigning Lead...
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignLeadEmployeePage;
