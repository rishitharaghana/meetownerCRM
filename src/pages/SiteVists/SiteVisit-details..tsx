import { useLocation, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import Timeline, { TimelineEvent } from "../../components/ui/timeline/timeline"; // Adjust path if needed

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
        label: "Lead Registered",
        timestamp: visit.created_date,
        description: `Lead registered for ${visit.property_name} by ${visit.user.name} (${visit.user.email || "No email"}) in ${visit.locality}, ${visit.city}, ${visit.state}.`,
        status: "completed",
      },
      {
        label: "Site Visit Scheduled",
        timestamp: visit.created_date,
        description: `Site visit scheduled for ${visit.property_name} with ${visit.builder_name} in ${visit.locality}. Property type: ${visit.property_type}.`,
        status: "completed",
      },
      {
        label: "Site Visit Completed",
        timestamp: visit.created_date,
        description: `Site visit completed. Feedback: ${visit.feedback}. Nearby: ${visit.around_this_property.join(", ") || "N/A"}.`,
        status: "completed",
      },
      {
        label: "Follow-Up Planned",
        timestamp: visit.created_date,
        description: `Next action: ${visit.next_action}. Property located ${visit.distance_from_property}.`,
        status: "completed",
        current: true,
      },
      {
        label: "Budget Discussion",
        timestamp: visit.created_date,
        description: `Budget of ${visit.budget}. Build-up: ${visit.build_up_area}, Carpet: ${visit.carpet_area}.`,
        status: "pending",
      },
      {
        label: "Amenities Reviewed",
        timestamp: visit.created_date,
        description: `Amenities: ${visit.amenities.join(", ") || "N/A"}.`,
        status: "pending",
      },
      {
        label: "Channel Partner Assigned",
        timestamp: visit.created_date,
        description: `Partner ${visit.channel_partner.name} (${visit.channel_partner.mobile}) assigned.`,
        status: "pending",
      },
      {
        label: `Status Updated to ${visit.updated_status}`,
        timestamp: visit.created_date,
        description: `Lead status updated to ${visit.updated_status} by ${visit.builder_name} in ${visit.city}.`,
        status: "pending",
      },
    ];
  };

  return (
    <div className="relative min-h-screen p-4">
      <PageMeta title="Site Visit Details" />
      <PageBreadcrumb pageTitle="Site Visit Details" />

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left - Property Details */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Property Details</h2>
          <div className="space-y-2 text-[15px]">
            <p><strong>Property ID:</strong> {siteVisit.unique_property_id}</p>
            <p><strong>Property Name:</strong> {siteVisit.property_name}</p>
            <p><strong>Budget:</strong> {siteVisit.budget}</p>
            <p><strong>Property In:</strong> {siteVisit.property_in}</p>
            <p><strong>Type:</strong> {siteVisit.property_type}</p>
            <p><strong>State:</strong> {siteVisit.state}</p>
            <p><strong>City:</strong> {siteVisit.city}</p>
            <p><strong>Locality:</strong> {siteVisit.locality}</p>
            <p><strong>Builder:</strong> {siteVisit.builder_name}</p>
            <p><strong>Build Up Area:</strong> {siteVisit.build_up_area}</p>
            <p><strong>Carpet Area:</strong> {siteVisit.carpet_area}</p>
            <p><strong>Amenities:</strong> {siteVisit.amenities.join(", ")}</p>
            <p><strong>Around Property:</strong> {siteVisit.around_this_property.join(", ")}</p>
            <p><strong>Distance:</strong> {siteVisit.distance_from_property}</p>
          </div>
        </div>

        {/* Right - Partner + Timeline */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Channel Partner & Timeline</h2>
          <div className="space-y-2 text-[15px] mb-6">
            <p><strong>Partner:</strong> {siteVisit.channel_partner.name}</p>
            <p><strong>Contact:</strong> {siteVisit.channel_partner.mobile}</p>
            <p><strong>Feedback:</strong> {siteVisit.feedback}</p>
            <p><strong>Next Action:</strong> {siteVisit.next_action}</p>
            <p><strong>Created:</strong> {siteVisit.created_date}</p>
          </div>

          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Timeline</h3>
          <Timeline data={getTimelineEvents(siteVisit)} />
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
