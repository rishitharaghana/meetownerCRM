import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { GroupIcon, BoxIconLine } from "../../icons"; // Adjust path as needed
import Badge from "../ui/badge/Badge";

// Mapping of user_type to user names
const userTypeMap: { [key: string]: string } = {
  "7": "Channel Partners",
  "8": "Telecaller",
  "9": "Marketing Executive",
  "10": "Sales Team",
  "11": "Reception",
};

// Define a type for the user count item
interface UserCountItem {
  user_type: string;
  count: number;
  trend?: "up" | "down";
  percentage?: number;
}

// Static data for Owner Employees
const staticOwnerEmployeesCounts: UserCountItem[] = [
  { user_type: "7", count: 25, trend: "down", percentage: 3 },
  { user_type: "8", count: 25, trend: "down", percentage: 3 },
  { user_type: "9", count: 15, trend: "up", percentage: 5 },
  { user_type: "10", count: 20, trend: "down", percentage: 3 },
  { user_type: "11", count: 18, trend: "up", percentage: 5 },
];

// Calculate total count
const totalCount = staticOwnerEmployeesCounts.reduce((sum, item) => sum + item.count, 0);

export default function Home() {
  // Static user data (mocking logged-in user)
  const user = { name: "John Doe", user_type: "1" }; // Assuming Admin for simplicity

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold text-[#1D3A76] dark:text-white">
        Welcome {user?.name}!
      </h1>

      {/* Owner Employees Section */}
      {staticOwnerEmployeesCounts && staticOwnerEmployeesCounts.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Employees Card */}
           

            {/* Existing User Type Cards */}
            {staticOwnerEmployeesCounts.map((item, index) => (
              <div
                key={item.user_type}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-default transition-shadow duration-200"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                  {index % 2 === 0 ? (
                    <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                  ) : (
                    <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
                  )}
                </div>
                <div className="flex items-end justify-between mt-5">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {userTypeMap[item.user_type] || "Unknown"}
                    </span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                      {item.count.toLocaleString()}
                    </h4>
                  </div>
                  <Badge color={index % 2 === 0 ? "success" : "error"}>
                    {index % 2 === 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    {item.percentage}%
                  </Badge>
                </div>
              </div>
            ))}

          <div
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-default transition-shadow duration-200"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Employees
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {totalCount.toLocaleString()}
                  </h4>
                </div>
                {/* Optional: You can add a badge here if you want to show a trend */}
                <Badge color="success">
                  <ArrowUpIcon />
                  0%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}