import React from "react";
import { CheckCircle, Clock } from "lucide-react";

interface BookingEvent {
  label: string;
  timestamp: string;
  status: "completed" | "pending";
  description?: string;
}

const BookingDetails = () => {
  const booking = {
    id: "",
    customerName: "Neha Gupta",
    mobile: "8901234567",
    email: "neha.gupta@example.com",
    channelPartner: "Vikram Singh",
    project: "Cityscape Towers",
    bookingDate: "2025-06-21",
    status: "Payment Pending",
    amount: "₹75,00,000",
  };

  const timelineData: BookingEvent[] = [
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
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Summary</h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
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

        {/* Booking Timeline */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Booking Timeline</h2>
          <ol className="relative border-l border-purple-300 dark:border-purple-600">
            {timelineData.map((event, index) => (
              <li key={index} className="mb-10 ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white ring-4 ring-white dark:ring-gray-900">
                  {event.status === "completed" ? <CheckCircle size={14} /> : <Clock size={14} />}
                </span>
                <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {event.label}
                  {event.status === "pending" && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded ml-2">
                      Pending
                    </span>
                  )}
                </h3>
                <time className="block mb-2 text-xs text-gray-400 dark:text-gray-500">
                  {event.timestamp}
                </time>
                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
