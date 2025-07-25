import { useEffect, useState } from "react";
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
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const defaultImage = " ";
  const defaultFloorPlan = " ";

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
      ).then((response) => {
        console.log("Project data:", response.payload); // Debug fetched data
      });
    }
  }, [dispatch, isAuthenticated, user, property_id, posted_by, user_id]);

  const formatDistance = (value: string): string => {
    if (!value) return "N/A";
    const trimmed = value.trim().toLowerCase();
    const regex = /^(\d+(\.\d+)?)(\s)?(m|km)$/;
    if (regex.test(trimmed)) {
      const [, number, , , unit] = trimmed.match(regex)!;
      return `${number} ${unit.toUpperCase()}`;
    }
    return value;
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        <p>Please log in to view project details.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/projects")}
          className="mt-4 bg-blue-600 hover:bg-blue-900 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        <p>Error: {error}</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/projects/details/:id")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  if (!selectedProject || selectedProject.property_id !== Number(id)) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        <p>Project not found.</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/projects")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-xl">
      {/* Main Image Section */}
      <div className="relative w-full h-70 mb-10 overflow-hidden rounded-2xl shadow-lg">
        <img
          src={selectedProject.property_image || defaultImage}
          alt={selectedProject.project_name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">
          {selectedProject.project_name}
        </h1>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(-1)}
          className="bg-blue-900 hover:bg-blue-800 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-6 py-2 rounded-lg"
        >
          Back
        </Button>
      </div>

      {/* Project Details */}
      <div className="space-y-10 text-gray-700 dark:text-gray-200">
        {/* Details Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Project Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
            
              { label: "Builder", value: selectedProject.builder_name },
                {
                label: "Location",
                value: `${selectedProject.locality}, ${selectedProject.city}, ${selectedProject.state}`,
              },
              
              {
                label: "Type",
                value: `${selectedProject.property_type} (${selectedProject.property_subtype})`,
              },
             
              {
                label: "Possession Date",
                value: selectedProject.possession_end_date
                  ? new Date(
                      selectedProject.possession_end_date
                    ).toLocaleDateString()
                  : "Ready to Move",
              },
               { label: "Status", value: selectedProject.construction_status },
              {
                label: "RERA Registered",
                value:
                  selectedProject.rera_registered === "Yes"
                    ? `Yes (${selectedProject.rera_number})`
                    : "No",
              },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                  {item.label}
                </p>
                <p className="text-gray-800 dark:text-white text-lg font-bold">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sizes
          </h2>
          {selectedProject.sizes.map((size, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Unit {idx + 1}
              </p>
              <p className="text-gray-800 dark:text-white text-base">
                {size.plot_area &&
                  size.plotAreaUnits &&
                  `Plot Area: ${size.plot_area} ${size.plotAreaUnits}, `}
                {size.build_up_area &&
                  size.builtupAreaUnits &&
                  `Build-up: ${size.build_up_area} ${size.builtupAreaUnits}, `}
                Carpet: {size.carpet_area} sq.ft, Price: ₹{size.sqft_price}
                /sq.ft
              </p>
            </div>
          ))}
        </div>

        {/* Floor Plans Section */}
        {/* Main Floor Plan Image Section Styled Like Card */}
        <div className="w-full mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-4">
              <p className="mt-2 mb-2 text-left text-xl text-gray-700 dark:text-gray-300 font-medium">
              Floor Plan
            </p>
            <img
              src={
                selectedProject.sizes.find(
                  (s) =>
                    s.floor_plan && !s.floor_plan.toLowerCase().endsWith(".pdf")
                )?.floor_plan || defaultFloorPlan
              }
              alt="Main Floor Plan"
              className="w-full h-70 object-cover rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultFloorPlan;
              }}
            />
          
          </div>
        </div>

        {/* Nearby Amenities Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Nearby Amenities
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-wrap gap-3">
            {selectedProject.around_this.map((item, i) => (
              <span
                key={i}
                className="bg-blue-100 dark:bg-blue-900 text-gray-700 dark:text-gray-200 px-2 py-2 text-xs rounded-xl"
              >
                {item.title} ({formatDistance(item.distance)})
              </span>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Documents
          </h2>
          <div className=" rounded-xl p-6 flex gap-4">
            {selectedProject.brochure && (
              <Button
                onClick={() => window.open(selectedProject.brochure, "_blank")}
                size="sm"
                className="text-white dark:text-blue-400 hover:text-white dark:hover:text-blue-300"
              >
                View Brochure
              </Button>
            )}
            {selectedProject.price_sheet && (
              <Button
                onClick={() =>
                  window.open(selectedProject.price_sheet, "_blank")
                }
                size="sm"
                className="text-white dark:text-blue-400 hover:text-white dark:hover:text-blue-300"
              >
                View Price Sheet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
