import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useNavigate } from "react-router";
import Button from "../../components/ui/button/Button";
import Pagination from "../../components/ui/pagination/Pagination";

interface Booking {
  id: number;
  name: string;
  mobile: string;
  email: string;
  flat_no: string;
  floor: string;
  block: string;
  property_name: string;
  project_name: string;
  sqft: string;
}

const completedBookings: Booking[] = [
  {
    id: 1,
    name: "John Doe",
    mobile: "9876543210",
    email: "john.doe@example.com",
    flat_no: "101",
    floor: "2",
    block: "B",
    property_name: "Sunrise Villa",
    project_name: "Sunrise Phase 1",
    sqft: "2000",
  },

];

const ITEMS_PER_PAGE = 10;

const BookingsDone = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(completedBookings.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedBookings = completedBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewDetails = (booking: any) => {
    navigate(`/bookings-done/details/${booking.id}`, { state: { booking } });
  };

  return (
    <div className="min-h-screen px-1 py-3">
      <ComponentCard title="Completed Bookings">
        <div className="w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="w-full">
            <Table className="w-full text-center table-fixed">
              <TableHeader className="border-b text-center border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader>Sl.No</TableCell>
                  <TableCell isHeader>Customer</TableCell>
                  <TableCell isHeader>Mobile</TableCell>
                  <TableCell isHeader>Email</TableCell>
                  <TableCell isHeader>Flat No</TableCell>
                  <TableCell isHeader>Floor</TableCell>
                  <TableCell isHeader>Block</TableCell>
                  <TableCell isHeader>Project</TableCell>
                  <TableCell isHeader>Sqft</TableCell>
                  <TableCell isHeader>Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings.map((booking, index) => (
                  <TableRow key={`${booking.id}-${index}`} className="text-sm">
                    <TableCell>
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell className="truncate">{booking.name}</TableCell>
                    <TableCell>{booking.mobile}</TableCell>
                    <TableCell className="truncate">{booking.email}</TableCell>
                    <TableCell>{booking.flat_no}</TableCell>
                    <TableCell>{booking.floor}</TableCell>
                    <TableCell>{booking.block}</TableCell>
                    <TableCell className="truncate">
                      {booking.project_name}
                    </TableCell>
                    <TableCell>{booking.sqft}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-blue-900 hover:bg-blue-900 text-white font-medium rounded-md px-3 py-1 transition-colors duration-200"
                        onClick={() => handleViewDetails(booking)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {completedBookings.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </ComponentCard>
    </div>
  );
};

export default BookingsDone;
