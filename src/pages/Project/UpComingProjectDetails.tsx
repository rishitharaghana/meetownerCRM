import { useLocation, useNavigate } from "react-router";
import Button from "../../components/ui/button/Button";

const UpcomingProjectDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const project = state?.project;

  if (!project) {
    return (
      <div className="text-center p-10 text-black">
        Project not found or invalid navigation.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
  <h1 className="text-3xl font-bold">{project.project_name}</h1>
  <button
    onClick={() => navigate(-1)}
    className="ml-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
  >
 Back
  </button>

      </div>

      <img
        src={project.image}
        alt={project.project_name}
        className="w-full h-64 object-cover rounded mb-6"
      />

      <div className="space-y-4 text-gray-700">
        <p><strong>Location:</strong> {project.location}</p>
        <p><strong>Developer:</strong> {project.developer}</p>
        <p><strong>Type:</strong> {project.type}</p>
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Price Range:</strong> {project.priceRange}</p>
        <p><strong>Possession Date:</strong> {project.possessionDate}</p>
        <p><strong>Amenities:</strong></p>
        <div className="flex flex-wrap gap-2 ">
          {project.amenities.map((a) => (
            <span
              key={a}
              className="text-xs bg-blue-50 text-gray-700 px-2 py-1 rounded-full"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingProjectDetails;
