import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/ui/button/Button";
import { InputWithRef } from "../../components/form/input/InputField";
import sunriseImg from "../../components/ui/Images/SunriseApartments.jpeg";
import blueskyImg from "../../components/ui/Images/BlueSkyResidencies.jpeg";

const upcomingProjects = [
  {
    id: 201,
    project_name: "Ocean View Residences",
    location: "Andheri West, Mumbai",
    developer: "DreamBuild",
    type: "Residential",
    priceRange: "₹1.2Cr - ₹2.5Cr",
    possessionDate: "12/15/2026",
    status: "Upcoming",
    image: sunriseImg,
    amenities: ["Infinity Pool", "Sky Garden", "Yoga Studio", "Gym", "Library"],
  },
  {
    id: 202,
    project_name: "Eco Tower Commercial",
    location: "Gachibowli, Hyderabad",
    developer: "GreenWorks",
    type: "Commercial",
    priceRange: "₹3Cr - ₹6Cr",
    possessionDate: "5/30/2026",
    status: "Upcoming",
    image: blueskyImg,
    amenities: ["Solar Panels", "EV Parking", "Business Lounge"],
  },
];

const UpcomingProjects: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
    {}
  );
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  const itemsPerPage = 4;

  const toggleExpand = (id: number) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = upcomingProjects.filter((p) => {
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

  const uniqueTypes = [
    "All",
    ...Array.from(new Set(upcomingProjects.map((p) => p.type))),
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedProjects.map((project) => {
          const isExpanded = expandedCards[project.id];
          const initialAmenities = project.amenities.slice(0, 4);
          const hiddenAmenities = project.amenities.slice(4);

          return (
            <div
              key={project.id}
              className="bg-white border border-blue-200 rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.01] w-full max-w-[500px] mx-auto"
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
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {project.status}
                  </span>
                </div>
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p>
                    <strong>Developer:</strong> {project.developer}
                  </p>
                  <p>
                    <strong>Type:</strong> {project.type}
                  </p>
                  <p>
                    <strong>Price Range:</strong> {project.priceRange}
                  </p>
                  <p>
                    <strong>Possession:</strong> {project.possessionDate}
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
                        className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full"
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
                          className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full"
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
                <div className="flex justify-end items-center mt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate("/projects/upcoming-projectsdetails", {
                        state: { project },
                      })
                    }
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
                      ? "bg-[#7D23E0] text-white"
                      : "text-gray-600"
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

export default UpcomingProjects;
