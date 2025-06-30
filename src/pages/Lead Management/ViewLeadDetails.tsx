import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import Button from "../../components/ui/button/Button";

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

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Lead Details for: {property.property_name}
      </h2>
      {property.image && (
  <img
    src={property.image}
    alt={property.property_name}
    className="w-full max-w-md rounded shadow"
  />
)}

      <p><strong>Customer Name:</strong> {property.user.name}</p>
      <p><strong>Customer Number:</strong> {property.user.mobile}</p>
      <p><strong>Email:</strong> {property.user.email || "N/A"}</p>
      <p><strong>Interested Project:</strong> {property.property_name}</p>
      <p><strong>Property Type:</strong> {property.property_type}</p>
      <p><strong>Sub Type:</strong> {property.sub_type}</p>
      <p><strong>Budget:</strong> {property.budget}</p>
      <p><strong>Lead Type:</strong> {property.lead_type}</p>
      <p><strong>Lead Source:</strong> {property.lead_source}</p>
      <p><strong>Created On:</strong> {property.created_date} {property.created_time}</p>
      <div className="pt-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default ViewLeadDetails;
