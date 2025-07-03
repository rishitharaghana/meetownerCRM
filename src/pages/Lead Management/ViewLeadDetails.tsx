import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import Button from "../../components/ui/button/Button";
import sunriseImg from "../../components/ui/Images/SunriseApartments.jpeg";
import Timeline, { TimelineEvent } from "../../components/ui/timeline/Timeline";

const ViewLeadDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;

  useEffect(() => {
    if (!property) {
      navigate("/leads");
    }
  }, [property, navigate]);

  if (!property) return null;

  const statusMap: Record<number, number> = {
    0: 0, // Lead Created
    1: 1, // Today Follow-Up
    2: 2, // Site Visit
    3: 3, // Won
    4: 3, // Lost
  };

  const currentStepIndex = statusMap[property.status] ?? 0;

  const eventStatus = (stepIndex: number): "completed" | "pending" => {
    return currentStepIndex >= stepIndex ? "completed" : "pending";
  };

 const timeline: TimelineEvent[] = [
  {
    label: "Lead Created",
    timestamp: `${property.created_date} ${property.created_time}`,
    status: eventStatus(0),
    description: `Lead created for ${property.property_name}.`,
    current: currentStepIndex === 0,
  },
  {
    label: "Today Follow-Up",
    timestamp: `${property.updated_date} ${property.updated_time}`,
    status: eventStatus(1),
    description: `Follow-up scheduled for ${property.user.name}.`,
    current: currentStepIndex === 1,
  },
  {
    label: "Site Visit",
    timestamp: `${property.updated_date} ${property.updated_time}`,
    status: eventStatus(2),
    description: `Site visit planned for ${property.property_name}.`,
    current: currentStepIndex === 2,
  },
  {
    label: property.status === 3 ? "Lead Won" : "Lead Lost",
    timestamp: `${property.updated_date} ${property.updated_time}`,
    status: eventStatus(3),
    description:
      property.status === 3
        ? `${property.property_name} lead converted.`
        : `${property.property_name} lead not converted.`,
    current: currentStepIndex === 3,
  },
];


  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-blue-9 00 dark:text-white mb-4">
        Lead Details: {property.property_name}
      </h2>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image + Info */}
        <div className="space-y-6">
          <img
            src={property.image || sunriseImg}
            alt={property.property_name}
            className="w-full rounded-lg shadow border border-gray-300 dark:border-gray-700"
          />
          <div className="space-y-2 text-[16px] text-gray-800 dark:text-gray-100 leading-relaxed">
            <p><strong>Name:</strong> {property.user.name}</p>
            <p><strong>Mobile:</strong> {property.user.mobile}</p>
            <p><strong>Email:</strong> {property.user.email || "N/A"}</p>
            <p><strong>Project:</strong> {property.property_name}</p>
            <p><strong>Type:</strong> {property.property_type}</p>
            <p><strong>Sub Type:</strong> {property.sub_type}</p>
            <p><strong>Budget:</strong> {property.budget}</p>
            <p><strong>Lead Type:</strong> {property.lead_type}</p>
            <p><strong>Lead Source:</strong> {property.lead_source}</p>
            <p><strong>Created:</strong> {property.created_date} {property.created_time}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Lead Timeline</h2>
          <Timeline data={timeline} />
        </div>
      </div>

      <div className="pt-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default ViewLeadDetails;
