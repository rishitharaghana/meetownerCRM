import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import Button from "../../components/ui/button/Button";
import sunriseImg from "../../components/ui/Images/SunriseApartments.jpeg";

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

  const statusMap = {
    0: 0, // Lead Created
    1: 1, // Today Follow-Up
    2: 2, // Site Visit
    3: 3, // Won
    4: 3, // Lost
  };

  const currentStepIndex = statusMap[property.status] ?? 0;

  const timeline = [
    {
      date: `${property.created_date} ${property.created_time}`,
      title: "Lead Created",
      description: `Lead created for ${property.property_name}.`,
    },
    {
      date: `${property.updated_date} ${property.updated_time}`,
      title: "Today Follow-Up",
      description: `Follow-up scheduled for ${property.user.name}.`,
    },
    {
      date: `${property.updated_date} ${property.updated_time}`,
      title: "Site Visit",
      description: `Site visit planned for ${property.property_name}.`,
    },
    {
      date: `${property.updated_date} ${property.updated_time}`,
      title: property.status === 3 ? "Lead Won" : "Lead Lost",
      description:
        property.status === 3
          ? `${property.property_name} lead converted.`
          : `${property.property_name} lead not converted.`,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-purple-800 dark:text-white mb-4">
        Lead Details: {property.property_name}
      </h2>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image + Details */}
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

        {/* Right: Timeline */}
        <div className="relative pl-8">
          {timeline.map((step, i) => {
            const isCurrent = i === currentStepIndex;
            const isLast = i === timeline.length - 1;

            return (
              <div key={i} className="relative pb-10">
                {/* Vertical connector */}
                {!isLast && (
                  <span className="absolute left-1.5 top-3 h-full w-0.5 bg-purple-500" />
                )}

                {/* Step dot */}
                <span
                  className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 z-10
                    ${isCurrent ? "bg-green-500 border-green-300 animate-pulse" : "bg-purple-600 border-white"}
                  `}
                />

                <div className="ml-6">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {step.date}
                    {isCurrent && (
                      <span className="ml-2 text-green-600 font-semibold">(Current)</span>
                    )}
                  </p>
                  <h4 className={`text-base font-semibold ${isCurrent ? "text-green-700 dark:text-green-300" : "text-gray-800 dark:text-gray-100"}`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
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
