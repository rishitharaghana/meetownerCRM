import { useParams, useNavigate } from "react-router";

import sunriseImg from "../../components/ui/Images/SunriseApartments.jpeg";
import greenValleyImg from "../../components/ui/Images/GreenValleyVillas.jpeg";
import techPlazaImg from "../../components/ui/Images/TechParkplaza.jpeg";
import blueskyImg from "../../components/ui/Images/BlueSkyResidencies.jpeg";

const sampleProjects = [
  {
    id: 1,
    project_name: "Sunrise Apartments",
    location: "Bandra West, Mumbai",
    developer: "ABC Developers",
    type: "Residential",
    priceRange: "₹75L - ₹1.2Cr",
    possessionDate: "12/31/2024",
    status: "Under Construction",
    image: sunriseImg,
    amenities: ["Swimming Pool", "Gym", "Garden", "Jogging Track", "Kids Zone"],
  },
  {
    id: 2,
    project_name: "Green Valley Villas",
    location: "Whitefield, Bangalore",
    developer: "XYZ Builders",
    type: "Villa",
    priceRange: "₹2.5Cr - ₹4Cr",
    possessionDate: "6/30/2025",
    status: "Pre-Launch",
    image: greenValleyImg,
    amenities: ["Clubhouse", "Tennis Court", "Spa", "Yoga Deck", "Pet Area"],
  },
  {
    id: 3,
    project_name: "Tech Park Plaza",
    location: "Sector 62, Noida",
    developer: "Commercial Builders",
    type: "Commercial",
    priceRange: "₹50L - ₹2Cr",
    possessionDate: "3/31/2024",
    status: "Ready to Move",
    image: techPlazaImg,
    amenities: [
      "Conference Room",
      "Cafeteria",
      "Parking",
      "High-speed Elevators",
    ],
  },
  {
    id: 4,
    project_name: "Blue Sky Residences",
    location: "Hinjewadi, Pune",
    developer: "Elite Spaces",
    type: "Apartment",
    priceRange: "₹60L - ₹90L",
    possessionDate: "5/31/2025",
    status: "Under Construction",
    image: blueskyImg,
    amenities: ["Swimming Pool", "Clubhouse", "Kids Play Area"],
  },
];

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = sampleProjects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Project not found.</p>
        <button
          onClick={() => navigate("/projects")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
   <div className="flex items-center justify-between mb-4">
  <h1 className="text-3xl font-bold">{project.project_name}</h1>
  <button
    onClick={() => navigate(-1)}
    className="ml-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-gray-300"
  >
 Back
  </button>
</div>

      <p className="text-gray-500 mb-4">{project.location}</p>
      <img
        src={project.image}
        alt={project.project_name}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
        <p><strong>Developer:</strong> {project.developer}</p>
        <p><strong>Type:</strong> {project.type}</p>
        <p><strong>Price Range:</strong> {project.priceRange}</p>
        <p><strong>Possession Date:</strong> {project.possessionDate}</p>
        <p><strong>Status:</strong> {project.status}</p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Amenities:</h3>
        <div className="flex flex-wrap gap-2">
          {project.amenities.map((a) => (
            <span
              key={a}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
