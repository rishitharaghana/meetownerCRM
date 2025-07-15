import React from "react";
import { useLocation, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumbList from "../../components/common/PageBreadCrumbLists";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { leadSourceOptions } from "../../components/common/reusedList";



const BookingDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lead = location.state?.lead;

  if (!lead) {
    return (
      <div className="relative min-h-screen p-4">
        <PageMeta title="Booking Details" />
        <PageBreadcrumbList pageTitle="Booking Details" />
        <div className="text-center text-red-500 py-4">
          No lead details available.
        </div>
      </div>
    );
  }

  const leadSourceMap = Object.fromEntries(
  leadSourceOptions.map((option) => [option.value, option.label])
);

  const details = [
    
    { label: "Customer Name", value: lead.customer_name || "N/A" },
    { label: "Customer Phone Number", value: lead.customer_phone_number || "N/A" },
    { label: "Customer Email", value: lead.customer_email || "N/A" },
   
    { label: "Interested Project Name", value: lead.interested_project_name || "N/A" },
   { label: "Lead Source", value: leadSourceMap[lead.lead_source_id] || "N/A" },
    { label: "Created Date", value: lead.created_date || "N/A" },
    { label: "Created Time", value: lead.created_time || "N/A" },
    { label: "Updated Date", value: lead.updated_date || "N/A" },
    { label: "Updated Time", value: lead.updated_time || "N/A" },

    { label: "Assigned Name", value: lead.assigned_name || "N/A" },
    { label: "Assigned Employee Number", value: lead.assigned_emp_number || "N/A" },
    { label: "Assigned Priority", value: lead.assigned_priority || "N/A" },
    { label: "Follow-up Feedback", value: lead.follow_up_feedback || "N/A" },
    { label: "Next Action", value: lead.next_action || "N/A" },
    { label: "Assigned Date", value: lead.assigned_date || "N/A" },
    { label: "Assigned Time", value: lead.assigned_time || "N/A" },
    { label: "Booked", value: lead.booked || "N/A" },
  
    { label: "Square Feet", value: lead.sqft || "N/A" },
    { label: "Budget", value: lead.budget || "N/A" },
  
    { label: "Flat Number", value: lead.flat_number || "N/A" },
    { label: "Floor Number", value: lead.floor_number || "N/A" },
    { label: "Block Number", value: lead.block_number || "N/A" },
    { label: "Asset", value: lead.asset || "N/A" },
    { label: "Project Name", value: lead.project_name || "N/A" },
    { label: "Property Subtype", value: lead.property_subtype || "N/A" },
    { label: "city", value: lead.city || "N/A" },
      { label: "state", value: lead.state || "N/A" },
  ];

  return (
    <div className="relative min-h-screen p-4">
      <PageMeta title="Booking Details" />
      <PageBreadcrumbList pageTitle="Booking Details" />
      <ComponentCard title={`Booking Details - Lead ID: ${lead.lead_id}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div key={index} className="flex flex-col">
              <span className="font-semibold text-gray-800 dark:text-white">{detail.label}:</span>
              <span className="text-gray-600 dark:text-gray-400">{detail.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </ComponentCard>
    </div>
  );
};

export default BookingDetails;