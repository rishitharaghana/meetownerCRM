import { useNavigate } from "react-router";
import { TimelineEvent } from "../../components/ui/timeline/Timeline";
import Timeline from "../../components/ui/timeline/Timeline";
import Button from "../../components/ui/button/Button";
import sunriseImg from "../../components/ui/Images/SunriseApartments.jpeg";

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
      label: "Lead Status",
      timestamp: "2025-06-24 5:00 PM",
      status: "completed",
      description: "Lead Added Successfully",
    },
    {
      label: "Agreement Of Sale",
      timestamp: "2025-06-24 5:00 PM",
      status: "completed",
      description: "Agreement",
    },
    {
      label: "Payment",
      timestamp: "Pending",
      status: "pending",
      description: "3% of Payment to be Made",
    },
    {
      label: "Agreement Finalization",
      timestamp: "Pending",
      status: "pending",
      description: "Draft sale agreement to be approved.",
    },
    {
      label: "Agreement Finalization",
      timestamp: "Pending",
      status: "pending",
      description: "Draft sale agreement to be approved.",
    },
  ];

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        Booking Details - #{booking.id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="relative overflow-hidden rounded-lg mb-6">
            <img
              src={sunriseImg}
              alt="Booking Preview"
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Booking Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-4 text-sm">
            {[
              { label: "Sl.No", value: booking.id },
              { label: "Customer Name", value: booking.customerName },
              { label: "Mobile", value: booking.mobile },
              { label: "Email", value: booking.email },
              { label: "Channel Partner", value: booking.channelPartner },
              { label: "Project", value: booking.project },
              { label: "Booking Date", value: booking.bookingDate },
              {
                label: "Status",
                value: (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {booking.status}
                  </span>
                ),
              },
              {
                label: "Amount",
                value: (
                  <span className="text-base font-semibold text-green-600 dark:text-green-400">
                    {booking.amount}
                  </span>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="space-y-1 overflow-hidden">
                <p className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Booking Timeline</h2>
          <Timeline data={timelineData} />
        </div>
      </div>

      <Button
        variant="outline"
        size="md"
        className="mt-2 px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </div>
  );
};

export default BookingDetails;