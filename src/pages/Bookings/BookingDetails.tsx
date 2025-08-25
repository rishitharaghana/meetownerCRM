import React from "react";
import { useLocation, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumbList from "../../components/common/PageBreadCrumbLists";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { leadSourceOptions } from "../../components/common/reusedList";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

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

  // Grouped sections for better readability
  const sections = [
    {
      title: "Customer Information",
      fields: [
        { label: "Customer Name", value: lead.customer_name || "N/A" },
        { label: "Phone Number", value: lead.customer_phone_number || "N/A" },
        { label: "Email", value: lead.customer_email || "N/A" },
      ],
    },
    {
      title: "Project Information",
      fields: [
        {
          label: "Interested Project",
          value: lead.interested_project_name || "N/A",
        },
        { label: "Project Name", value: lead.project_name || "N/A" },
        { label: "Property Subtype", value: lead.property_subtype || "N/A" },
        { label: "City", value: lead.city || "N/A" },
        { label: "State", value: lead.state || "N/A" },
        {
          label: "Lead Source",
          value: leadSourceMap[lead.lead_source_id] || "N/A",
        },
      ],
    },
    {
      title: "Assignment Information",
      fields: [
        { label: "Assigned Name", value: lead.assigned_name || "N/A" },
        { label: "Employee Number", value: lead.assigned_emp_number || "N/A" },
        { label: "Priority", value: lead.assigned_priority || "N/A" },
        {
          label: "Follow-up Feedback",
          value: lead.follow_up_feedback || "N/A",
        },
        { label: "Next Action", value: lead.next_action || "N/A" },
        { label: "Assigned Date", value: lead.assigned_date || "N/A" },
        { label: "Assigned Time", value: lead.assigned_time || "N/A" },
      ],
    },
    {
      title: "Booking Information",
      fields: [
        { label: "Booked", value: lead.booked || "N/A" },
        { label: "Square Feet", value: lead.sqft || "N/A" },
        { label: "Budget", value: lead.budget || "N/A" },
        { label: "Flat Number", value: lead.flat_number || "N/A" },
        { label: "Floor Number", value: lead.floor_number || "N/A" },
        { label: "Block Number", value: lead.block_number || "N/A" },
        { label: "Asset", value: lead.asset || "N/A" },
      ],
    },
    {
      title: "Timestamps",
      fields: [
        { label: "Created Date", value: lead.created_date || "N/A" },
        { label: "Created Time", value: lead.created_time || "N/A" },
        { label: "Updated Date", value: lead.updated_date || "N/A" },
        { label: "Updated Time", value: lead.updated_time || "N/A" },
      ],
    },
  ];

  return (
    <div className="">
      <div className="flex justify-end">
        <PageBreadcrumb items={[{ label: "Bookings", link: "/bookings" }]} />
        <PageMeta title="Booking Details" />
      </div>
      <div className="relative min-h-screen p-5 space-y-6 bg-white rounded-lg shadow-md">
        {/* <PageBreadcrumbList pageTitle="Booking Details" /> */}
        {/* Loop through sections */}
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {field.label}:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Back button */}
        <div className="flex justify-end">
          <Button
            className="bg-[#1D3A76] text-white hover:bg-[#152B5A]"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
