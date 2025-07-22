import { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/button/Button";
import { AppDispatch, RootState } from "../../store/store";
import { fetchProjectById } from "../../store/slices/projectSlice";


const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProject, loading, error } = useSelector(
    (state: RootState) => state.projects
  );
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

const defaultImage = "https://via.placeholder.com/400x300"; 


  const { property_id, posted_by, user_id } = (location.state || {}) as {
    property_id?: number;
    posted_by?: string;
    user_id?: string;
  };

  useEffect(() => {
    if (isAuthenticated && user && property_id && posted_by && user_id) {
      dispatch(
        fetchProjectById({
          property_id: Number(property_id),
          admin_user_type: Number(posted_by),
          admin_user_id: Number(user_id),
        })
      );
    }
  }, [dispatch, isAuthenticated, user, property_id, posted_by, user_id]);

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Please log in to view project details.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/projects")}
          className="mt-4"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error: {error}</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/projects")}
          className="mt-4"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  if (!selectedProject || selectedProject.property_id !== Number(id)) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Project not found.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/projects")}
          className="mt-4"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Image Section */}
      <div className="relative w-full h-64 mb-6 overflow-hidden rounded-lg shadow-md">
        <img
          src={selectedProject.property_image || defaultImage} // Use project image or fallback
          alt={selectedProject.project_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage; // Fallback if image fails
          }}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{selectedProject.project_name}</h1>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(-1)}
          className="ml-4"
        >
          Back
        </Button>
      </div>

      <div className="space-y-4 text-gray-700">
        <p>
          <strong>Location:</strong> {selectedProject.locality}, {selectedProject.city}, {selectedProject.state}
        </p>
        <p>
          <strong>Builder:</strong> {selectedProject.builder_name}
        </p>
        <p>
          <strong>Type:</strong> {selectedProject.property_type} ({selectedProject.property_subtype})
        </p>
        <p>
          <strong>Status:</strong> {selectedProject.construction_status}
        </p>
        <p>
          <strong>Possession Date:</strong>{" "}
          {selectedProject.possession_end_date
            ? new Date(selectedProject.possession_end_date).toLocaleDateString()
            : "Ready to Move"}
        </p>
        <p>
          <strong>Sizes:</strong>
        </p>
        <ul className="list-disc pl-5">
          {selectedProject.sizes.map((size, index) => (
            <li key={index}>
              Build-up: {size.build_up_area} sqft, Carpet: {size.carpet_area} sqft
            </li>
          ))}
        </ul>
        <p>
          <strong>Nearby Amenities:</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedProject.around_this.map((a) => (
            <span
              key={a.title}
              className="text-xs bg-blue-50 text-gray-700 px-2 py-1 rounded-full"
            >
              {a.title} ({a.distance} km)
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {selectedProject.brochure && (
            <a
              href={selectedProject.brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View Brochure
            </a>
          )}
          {selectedProject.price_sheet && (
            <a
              href={selectedProject.price_sheet}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View Price Sheet
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;