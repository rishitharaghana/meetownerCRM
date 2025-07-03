import React from "react";
import { useNavigate } from "react-router";
import { TimelineEvent } from "../../components/ui/timeline/Timeline"; // Adjust path if needed
import Timeline from "../../components/ui/timeline/Timeline"; // Your reusable component
import Button from "../../components/ui/button/Button";

const BookingDetails = () => {
  const booking = {
    id: "12345",
    customerName: "Neha Gupta",
    mobile: "8901234567",
    email: "neha.gupta@example.com",
    channelPartner: "Vikram Singh",
    project: "Cityscape Towers",
    bookingDate: "2025-06-21",
    status: "Payment Pending",
    amount: "₹75,00,000",
  };
  const navigate = useNavigate();

// const handle

  const timelineData: TimelineEvent[] = [
    {
      label: "Booking Initiated",
      timestamp: "2025-06-20 10:00 AM",
      status: "completed",
      description: "Form submitted by the customer.",
    },
    {
      label: "Lead",
      timestamp: "2025-06-22 2:30 PM",
      status: "completed",
      description: "Lead taken by Telecaller",
    },
    {
      label: "Documents Submitted",
      timestamp: "2025-06-24 5:00 PM",
      status: "completed",
      description: "KYC and PAN uploaded.",
    },
    {
      label: "Agreement Finalization",
      timestamp: "Pending",
      status: "pending",
      description: "Draft sale agreement to be approved.",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Booking Details - #{booking.id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Section */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Summary</h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p><strong>Sl.No:</strong> {booking.id}</p>
            <p><strong>Customer Name:</strong> {booking.customerName}</p>
            <p><strong>Mobile:</strong> {booking.mobile}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Channel Partner:</strong> {booking.channelPartner}</p>
            <p><strong>Project:</strong> {booking.project}</p>
            <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <p><strong>Amount:</strong> {booking.amount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Booking Timeline</h2>
          <Timeline data={timelineData} />
        </div>

      </div>
     
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
    </div>
  );
};

export default BookingDetails;
