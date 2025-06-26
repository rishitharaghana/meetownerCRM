import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../../components/ui/button/Button";
import { InputWithRef } from "../../components/form/input/InputField";

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
  {
    id: 5,
    project_name: "Palm Grove Estate",
    location: "Kukatpally, Hyderabad",
    developer: "Prestige Group",
    type: "Villa",
    priceRange: "₹1.8Cr - ₹3.2Cr",
    possessionDate: "11/30/2025",
    status: "Pre-Launch",
    image: "https://via.placeholder.com/600x300?text=Palm+Grove",
    amenities: ["Tennis Court", "Spa", "Jogging Track"],
  },
  {
    id: 6,
    project_name: "City Center Heights",
    location: "Park Street, Kolkata",
    developer: "Merlin Projects",
    type: "Residential",
    priceRange: "₹70L - ₹1.1Cr",
    possessionDate: "10/30/2024",
    status: "Ready to Move",
    image: "https://via.placeholder.com/600x300?text=City+Center+Heights",
    amenities: ["Gym", "Cafeteria", "Library"],
  },
  {
    id: 7,
    project_name: "Skyline Commercial Tower",
    location: "MG Road, Gurgaon",
    developer: "DLF",
    type: "Commercial",
    priceRange: "₹2Cr - ₹5Cr",
    possessionDate: "8/31/2024",
    status: "Under Construction",
    image: "https://via.placeholder.com/600x300?text=Skyline+Tower",
    amenities: ["Parking", "Business Lounge", "High-speed Elevators"],
  },
];

const AllProjects: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
    {}
  );
  const itemsPerPage = 4;
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleExpand = (id: number) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = sampleProjects.filter((p) => {
    const matchesSearch = p.project_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType === "All" || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProjects = filtered.slice(startIndex, endIndex);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const getPaginationItems = () => {
    const pages: (number | string)[] = [];
    const totalVisiblePages = 5;

    if (totalPages <= totalVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      if (currentPage <= 3) {
        start = 2;
        end = 5;
      }
      if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages - 1;
      }
      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Under Construction":
        return "bg-yellow-100 text-yellow-800";
      case "Pre-Launch":
        return "bg-blue-100 text-blue-800";
      case "Ready to Move":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const uniqueTypes = [
    "All",
    ...Array.from(new Set(sampleProjects.map((p) => p.type))),
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-3 flex-wrap">
          <InputWithRef
            ref={searchRef}
            placeholder="Search Projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />

          <select
            className="px-3 py-2 cursor-pointer rounded-md border border-gray-300 text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <Link to="/projects/add-projects">
          <Button variant="primary">Add New Project</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedProjects.map((project) => {
          const isExpanded = expandedCards[project.id];
          const initialAmenities = project.amenities.slice(0, 4);
          const hiddenAmenities = project.amenities.slice(4);

          return (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.01] w-full max-w-[500px] mx-auto"
            >
              <img
                src={project.image}
                alt={project.project_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {project.project_name}
                    </h3>
                    <p className="text-sm text-gray-500">{project.location}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p>
                    <span className="font-medium">Developer:</span>{" "}
                    {project.developer}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {project.type}
                  </p>
                  <p>
                    <span className="font-medium">Price Range:</span>{" "}
                    {project.priceRange}
                  </p>
                  <p>
                    <span className="font-medium">Possession:</span>{" "}
                    {project.possessionDate}
                  </p>
                </div>
                <div className="mb-5">
                  <p className="text-sm font-medium text-gray-700">
                    Key Amenities:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {initialAmenities.map((item) => (
                      <span
                        key={item}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                    {hiddenAmenities.length > 0 && !isExpanded && (
                      <button
                        onClick={() => toggleExpand(project.id)}
                        className="text-xs text-blue-600 underline"
                      >
                        +{hiddenAmenities.length} more
                      </button>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hiddenAmenities.map((item) => (
                        <span
                          key={item}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                      <button
                        onClick={() => toggleExpand(project.id)}
                        className="text-xs text-blue-600 underline w-full text-left"
                      >
                        Show less
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalItems > itemsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              variant={currentPage === 1 ? "outline" : "primary"}
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {getPaginationItems().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page as number)}
                  className={
                    page === currentPage
                      ? "bg-[#1D3A76] text-white"
                      : "text-gray-500"
                  }
                >
                  {page}
                </Button>
              )
            )}
            <Button
              variant={currentPage === totalPages ? "outline" : "primary"}
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjects;
