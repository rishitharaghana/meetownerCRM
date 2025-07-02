import { Link } from "react-router";
import {
  Users,
  FolderKanban,
  UserPlus,
  Clock,
  MapPin,
  Headset,
  CircleUser,
  User,
  UserRound,
  BookCheck,
} from "lucide-react";

const userTypeMap: { [key: string]: string } = {
  new_leads: "New Leads",
  today_leads: "Today Leads",
  site_visits: "Site Visits",
  bookings: "Bookings",
  "7": "Channel Partners",
  tele_callers: "TeleCallers",
  marketing_executors: "Marketing Executors",
  sales_manager: "Sales Manager",
  receptionist: "Receptionist",
};

const userTypeRoutes: { [key: string]: string } = {
  new_leads: "/leads/new/0",
  today_leads: "/leads/today/1",
  site_visits: "/sitevists/site-visit",
  bookings: "/bookings/bookings-done",
  "7": "/partners",
  tele_callers: "/employee/1",
  marketing_executors: "/employee/2",
  sales_manager: "/employee/3",
  receptionist: "/employee/4",
};

const projectRoutes: { [key: string]: string } = {
  total_projects: "/projects/allprojects",
};

const iconMap: { [key: string]: any } = {
  new_leads: UserPlus,
  today_leads: Clock,
  site_visits: MapPin,
  bookings: BookCheck,
  "7": Users,
  total_projects: FolderKanban,
  tele_callers: Headset,
  marketing_executors: CircleUser,
  sales_manager: User,
  receptionist: UserRound,
};

const staticOwnerEmployeesCounts = [
  { user_type: "new_leads", count: 50, trend: "up", percentage: 5 },
  { user_type: "today_leads", count: 15, trend: "up", percentage: 2 },
  { user_type: "site_visits", count: 30, trend: "down", percentage: 1 },
  { user_type: "bookings", count: 30, trend: "down", percentage: 1 },
  { user_type: "7", count: 25, trend: "down", percentage: 3 },
  { user_type: "tele_callers", count: 10, trend: "up", percentage: 5 },
  { user_type: "marketing_executors", count: 10, trend: "down", percentage: 5 },
  { user_type: "sales_manager", count: 15, trend: "up", percentage: 5 },
  { user_type: "receptionist", count: 5, trend: "up", percentage: 1 },
];

const staticProjectCounts = [
  {
    id: "total_projects",
    title: "Total Projects",
    count: 120,
    trend: "down",
    percentage: 2,
  },
];

const cardColors = [
  "from-blue-500/10 to-cyan-500/10 border-blue-200/50",
  "from-purple-500/10 to-pink-500/10 border-purple-200/50",
  "from-emerald-500/10 to-teal-500/10 border-emerald-200/50",
  "from-orange-500/10 to-red-500/10 border-orange-200/50",
  "from-indigo-500/10 to-blue-500/10 border-indigo-200/50",
];

const iconBgColors = [
  "bg-gradient-to-br from-blue-500 to-cyan-600",
  "bg-gradient-to-br from-purple-500 to-pink-600",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-indigo-500 to-blue-600",
];

export default function Home() {
  const user = { name: "John Doe", user_type: "1" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
        </div>
        <p className="text-slate-600 ml-5">
          Here's an overview of your team performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {staticProjectCounts.map((item) => {
          const IconComponent = iconMap[item.id] || FolderKanban;
          const route = projectRoutes[item.id] || "#";

          return (
            <Link key={item.id} to={route} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl shadow-slate-900/20 hover:shadow-3xl hover:-translate-y-1 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/50 to-indigo-600/50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div>
                      <h3 className="text-white/80 text-lg font-medium mb-1">
                        {item.title}
                      </h3>
                      <div className="text-4xl font-bold text-white mb-2">
                        {item.count.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block text-white/10 text-6xl font-bold">
                    #{item.count}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staticOwnerEmployeesCounts.map((item, index) => {
          const IconComponent = iconMap[item.user_type] || Users;
          const route = userTypeRoutes[item.user_type] || "#";

          return (
            <Link
              key={item.user_type}
              to={route}
              className="group cursor-pointer transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${
                  cardColors[index % cardColors.length]
                } backdrop-blur-sm border shadow-lg p-6`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative mb-6">
                  <div
                    className={`w-12 h-12 ${
                      iconBgColors[index % iconBgColors.length]
                    } rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-slate-600 text-sm font-medium mb-1">
                      {userTypeMap[item.user_type]}
                    </h4>
                    <div className="text-2xl font-bold text-slate-800">
                      {item.count.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
