import React from "react";
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

const BookingsDone = () => {
  const navigate = useNavigate();

  const handleViewDetails = (booking: Booking) => {
    navigate(`/bookings-done/details/${booking.id}`, { state: { booking } });
  };

  return (
    <div className="min-h-screen px-1 py-3">
      <ComponentCard title="Completed Bookings">
        <div className="w-full rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="w-full">
            <Table className="w-full text-center table-fixed ">
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
                {completedBookings.map((booking) => (
                  <TableRow key={booking.id} className="text-sm">
                    <TableCell>{booking.id}</TableCell>
                    <TableCell className="truncate">{booking.name}</TableCell>
                    <TableCell>{booking.mobile}</TableCell>
                    <TableCell className="truncate">{booking.email}</TableCell>
                    <TableCell>{booking.flat_no}</TableCell>
                    <TableCell>{booking.floor}</TableCell>
                    <TableCell>{booking.block}</TableCell>
                    <TableCell className="truncate">{booking.project_name}</TableCell>
                    <TableCell>{booking.sqft}</TableCell>
                    <TableCell>
                      <Button
                        size="xs"
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
      </ComponentCard>
    </div>
  );
};

export default BookingsDone;
