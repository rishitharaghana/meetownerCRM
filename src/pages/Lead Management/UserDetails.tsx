import sunriseImg from "../../components/ui/Images/SunriseApartments.jpeg";
import greenValley from "../../components/ui/Images/GreenValleyVillas.jpeg";
import blueSky from "../../components/ui/Images/BlueSkyResidencies.jpeg";
import techPlaza from "../../components/ui/Images/TechParkplaza.jpeg";

const sampleListings = [
  {
    id: 1,
    property_name: "Sunrise Villa",
    lead_type: "Contacted",
    budget: "75L-1Cr",
    created_date: "05-05-2025",
    registerd_by: "John Doe",
    image: sunriseImg,
  },
  {
    id: 2,
    property_name: "Green Meadows",
    lead_type: "Contacted",
    budget: "75L-1Cr",
    created_date: "06-05-2025",
    registerd_by: "John Doe",
    image: greenValley,
  },
  {
    id: 3,
    property_name: "Blue Sky Residency",
    lead_type: "Contacted",
    budget: "75L-1Cr",
    created_date: "05-06-2025",
    registerd_by: "John Doe",
    image: blueSky,
  },
  {
    id: 3,
    property_name: "Blue Sky Residency",
    lead_type: "Contacted",
    budget: "75L-1Cr",
    created_date: "05-06-2025",
    registerd_by: "John Doe",
    image: techPlaza,
  },
];

const UserDetailsPage = () => {
  const personName = "John Doe";

  const userLeads = sampleListings.filter(
    (lead) => lead.registerd_by === personName
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        Registrations Done By:{" "}
        <span className="underline text-blue-600">{personName}</span>
      </h1>
      <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
        Total Registrations: {userLeads.length}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userLeads.map((lead, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <img
              src={lead.image}
              alt={lead.property_name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {lead.property_name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <strong>Lead Type:</strong> {lead.lead_type}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <strong>Budget:</strong> {lead.budget}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Created On:</strong> {lead.created_date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetailsPage;
