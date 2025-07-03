import React from "react";
import { useNavigate } from "react-router";

const user = {
  id: 1,
  name: "John Doe",
  user_type: 3,
  mobile: "9876543210",
  email: "john.doe@example.com",
  address: "123 Builder St",
  city: "Los Angeles",
  state: "California",
  pincode: "90001",
  gst_number: "GST123456789",
  rera_number: "RERA12345",
  created_date: "2025-01-15",
  status: 0,
};

const userTypeMap: { [key: number]: string } = {
  3: "Builder",
  4: "Agent",
  5: "Owner",
  6: "Channel Partner",
};

const statusText = (status: number) => {
  switch (status) {
    case 0:
      return "Active";
    case 2:
      return "Suspended";
    case 3:
      return "Blocked";
    default:
      return "Inactive";
  }
};

const statusClass = (status: number) => {
  switch (status) {
    case 0:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case 2:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case 3:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  }
};

const EmployeeDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 sm:p-10 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
          Employee Details
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition-all"
        >
          Back
        </button>
      </div>

      <div className="rounded-xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-8">
          <Info label="Name" value={user.name} />
          <Info label="User Type" value={userTypeMap[user.user_type]} />
          <Info label="Mobile" value={user.mobile} />
          <Info label="Email" value={user.email} />
          <Info label="Address" value={user.address} />
          <Info label="City" value={user.city} />
          <Info label="State" value={user.state} />
          <Info label="Pincode" value={user.pincode} />
          <Info label="GST Number" value={user.gst_number} />
          <Info label="RERA Number" value={user.rera_number} />
          <Info
            label="Status"
            value={
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClass(
                  user.status
                )}`}
              >
                {statusText(user.status)}
              </span>
            }
          />
          <Info
            label="Created On"
            value={new Date(user.created_date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        </div>
      </div>
    </div>
  );
};

const Info = ({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-base font-medium text-gray-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default EmployeeDetail;
