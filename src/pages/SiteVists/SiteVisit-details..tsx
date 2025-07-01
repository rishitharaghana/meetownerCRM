import { useLocation, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface SiteVisit {
  id: number;
  unique_property_id: string;
  property_name: string;
  user: {
    user_type: number;
    name: string;
    mobile: string;
    email?: string;
  };
  channel_partner: {
    name: string;
    mobile: string;
  };
  created_date: string;
  updated_status: string;
  budget: string;
  property_in: string;
  property_type: string;
  amenities: string[];
  feedback: string;
  next_action: string;
  state: string;
  city: string;
  locality: string;
  builder_name: string;
  build_up_area: string;
  carpet_area: string;
  around_this_property: string[];
  distance_from_property: string;
}

const SiteVisitDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const siteVisit: SiteVisit = location.state?.siteVisit;

  if (!siteVisit) {
    return <div className="p-4">No site visit data available.</div>;
  }

  const getTimelineEvents = (visit: SiteVisit): TimelineEvent[] => {
  return [
    {
      date: visit.created_date,
      title: "Lead Registered",
      description: `Lead registered for ${visit.property_name} by ${visit.user.name} (${visit.user.email || "No email"}) in ${visit.locality}, ${visit.city}, ${visit.state}.`,
    },
    {
      date: visit.created_date,
      title: "Site Visit Scheduled",
      description: `Site visit scheduled for ${visit.property_name} with ${visit.builder_name} in ${visit.locality}. Property type: ${visit.property_type}.`,
    },
    {
      date: visit.created_date,
      title: "Site Visit Completed",
      description: `Site visit completed for ${visit.property_name}. Feedback: ${visit.feedback}. Nearby landmarks: ${visit.around_this_property.join(", ") || "N/A"}.`,
    },
    {
      date: visit.created_date,
      title: "Follow-Up Planned",
      description: `Next action planned: ${visit.next_action}. Property located ${visit.distance_from_property}.`,
    },
    {
      date: visit.created_date,
      title: "Budget Discussion",
      description: `Discussed budget of ${visit.budget} for ${visit.property_name} with build-up area ${visit.build_up_area} and carpet area ${visit.carpet_area}.`,
    },
    {
      date: visit.created_date,
      title: "Amenities Reviewed",
      description: `Client reviewed amenities: ${visit.amenities.join(", ") || "N/A"} for ${visit.property_name} in ${visit.locality}.`,
    },
    {
      date: visit.created_date,
      title: "Channel Partner Assigned",
      description: `Channel partner ${visit.channel_partner.name} (Contact: ${visit.channel_partner.mobile}) assigned to handle ${visit.property_name}.`,
    },
    {
      date: visit.created_date,
      title: `Status Updated to ${visit.updated_status}`,
      description: `Lead status updated to ${visit.updated_status} for ${visit.property_name} by ${visit.builder_name} in ${visit.city}.`,
    },
  ];
};

  return (
    <div className="relative min-h-screen p-4">
      <PageMeta title="Site Visit Details" />
      <PageBreadcrumb pageTitle="Site Visit Details" />

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left 50% - Property Details */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Property Details</h2>
          <div className="space-y-2">
            <p><strong>Property ID:</strong> {siteVisit.unique_property_id || "N/A"}</p>
            <p><strong>Property Name:</strong> {siteVisit.property_name || "N/A"}</p>
            <p><strong>Budget:</strong> {siteVisit.budget || "N/A"}</p>
            <p><strong>Property In:</strong> {siteVisit.property_in || "N/A"}</p>
            <p><strong>Property Type:</strong> {siteVisit.property_type || "N/A"}</p>
            <p><strong>State:</strong> {siteVisit.state || "N/A"}</p>
            <p><strong>City:</strong> {siteVisit.city || "N/A"}</p>
            <p><strong>Locality:</strong> {siteVisit.locality || "N/A"}</p>
            <p><strong>Builder Name:</strong> {siteVisit.builder_name || "N/A"}</p>
            <p><strong>Build Up Area:</strong> {siteVisit.build_up_area || "N/A"}</p>
            <p><strong>Carpet Area:</strong> {siteVisit.carpet_area || "N/A"}</p>
            <p><strong>Amenities:</strong> {siteVisit.amenities?.join(", ") || "N/A"}</p>
            <p><strong>Around This Property:</strong> {siteVisit.around_this_property?.join(", ") || "N/A"}</p>
            <p><strong>Distance from Property:</strong> {siteVisit.distance_from_property || "N/A"}</p>
          </div>
        </div>

        {/* Right 50% - Channel Partner and Timeline */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Channel Partner & Timeline</h2>
          <div className="space-y-2 mb-6">
            <p><strong>Channel Partner Name:</strong> {siteVisit.channel_partner.name || "N/A"}</p>
            <p><strong>Channel Partner Number:</strong> {siteVisit.channel_partner.mobile || "N/A"}</p>
            <p><strong>Feedback:</strong> {siteVisit.feedback || "N/A"}</p>
            <p><strong>Next Action:</strong> {siteVisit.next_action || "N/A"}</p>
            <p><strong>Created Date:</strong> {siteVisit.created_date || "N/A"}</p>
          </div>

          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Timeline</h3>
          <div className="space-y-4">
            {getTimelineEvents(siteVisit).map((event, index, events) => (
              <div key={index} className="flex items-start relative">
                <div className="flex-shrink-0 w-4 h-4 bg-[#1D3A76] rounded-full z-10"></div>
                {index < events.length - 1 && (
                  <div className="absolute top-4 left-[7px] w-0.5 h-[calc(100%+1rem)] bg-green-500"></div>
                )}
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                  <h4 className="text-base font-medium text-gray-800 dark:text-white">{event.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default SiteVisitDetails;