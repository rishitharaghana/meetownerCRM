import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router";
import {
  Users,
  FolderKanban,
  Clock,
  MapPin,
  Headset,
  CircleUser,
  User,
  UserRound,
  BookCheck,
} from "lucide-react";
import { AppDispatch, RootState } from "../../store/store";
import { getTypesCount } from "../../store/slices/userslice";
import { getTotalLeads } from "../../store/slices/leadslice";
import toast from "react-hot-toast";

const userTypeMap: { [key: string]: string } = {
  total_leads: "Total Leads",
  today_follow_ups: "Today Follow-Ups",
  site_visit_done: "Site Visits Done",
  booked: "Bookings",
  projects: "Total Projects",
  "3": "Channel Partner",
  "4": "Sales Manager",
  "5": "Telecallers",
  "6": "Marketing Agent",
  "7": "Receptionists",
  "8": "BDE",
  "9": "BDM",
};

const userTypeRoutes: { [key: string]: string } = {
  total_leads: "/leads/new/0",
  today_follow_ups: "/leads/today/2",
  site_visit_done: "/leads/SiteVisitDone/5",
  booked: "/bookings/bookings-done",
  projects: "/projects/allprojects",
  "3": "/partners",
  "4": "/employee/4",
  "5": "/employee/5",
  "6": "/employee/6",
  "7": "/employee/7",
  "8": "/employee/8",
  "9": "/employee/9",
};

const iconMap: { [key: string]: any } = {
  total_leads: Clock,
  today_follow_ups: Clock,
  site_visit_done: MapPin,
  booked: BookCheck,
  projects: FolderKanban,
  "3": Users,
  "4": User,
  "5": Headset,
  "6": CircleUser,
  "7": UserRound,
  "8": User, // Added for BDE
  "9": User, // Added for BDM
};

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

const BUILDER_USER_TYPE = 2;
const EMPLOYEE_USER_TYPES = [3, 4, 5, 6, 7, 8, 9];

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    userCounts,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);
  const {
    totalLeads,
    loading: leadLoading,
    error: leadError,
  } = useSelector((state: RootState) => state.lead);

  const typesCountParams = useMemo(() => {
    if (!isAuthenticated || !user?.id || !user?.user_type) {
      return null;
    }
    if (user.user_type === BUILDER_USER_TYPE) {
      return {
        admin_user_id: user.id,
        admin_user_type: user.user_type,
      };
    } else if (EMPLOYEE_USER_TYPES.includes(user.user_type)) {
      return {
        admin_user_id: user.created_user_id,
        admin_user_type: BUILDER_USER_TYPE,
        emp_id: user.id,
        emp_user_type: user.user_type,
      };
    }
    return null;
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!typesCountParams) {
      toast.error("Invalid user data. Please log in again.");
      return;
    }

    if (user?.user_type !== 1) {
      dispatch(getTypesCount(typesCountParams))
        .unwrap()
        .catch((err) => {
          toast.error(err || "Failed to fetch user counts");
        });
        console.log(user?.user_type)
console.log("type",typesCountParams)
      const leadParams =
        user.user_type === 2
          ? {
              lead_added_user_id: typesCountParams.admin_user_id,
              lead_added_user_type: typesCountParams.admin_user_type,
            }
          : {
              lead_added_user_id: typesCountParams.admin_user_id,
              lead_added_user_type: typesCountParams.admin_user_type,
              assigned_id: typesCountParams.emp_id,
              assigned_user_type: typesCountParams.emp_user_type,
            };
console.log("sd",leadParams)
     dispatch(getTotalLeads({ leadParams }))

        .unwrap()
        .catch((err) => {
          toast.error(err || "Failed to fetch total leads");
        });
    }
  }, [typesCountParams, dispatch, user]);

  const projectCounts =
    userCounts?.filter((item) => item.user_type === "projects") || [];
  const employeeCounts = useMemo(() => {
    const counts =
      userCounts?.filter(
        (item) =>
          item.user_type !== "projects" && item.user_type !== "today_leads"
      ) || [];

    const totalLeadsCard =
      user?.user_type === BUILDER_USER_TYPE || EMPLOYEE_USER_TYPES.includes(user?.user_type)
        ? { user_type: "total_leads", count: totalLeads }
        : null;

    const filtered = counts.filter((item) => item.user_type !== "total_leads");

    return totalLeadsCard ? [totalLeadsCard, ...filtered] : filtered;
  }, [userCounts, totalLeads, user?.user_type]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
        <div className="text-center text-red-500">
          Please log in to view the dashboard.
        </div>
      </div>
    );
  }

  if (user.user_type === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Welcome back, {user.name || "User"}!
            </h1>
          </div>
          <p className="text-slate-600 ml-5">
            Admin dashboard under construction.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Welcome back, {user.name || "User"}!
          </h1>
        </div>
        <p className="text-slate-600 ml-5">
          Here's an overview of your team performance
        </p>
      </div>

      {(userLoading || leadLoading) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl bg-gray-200/50 border p-6"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-xl mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {(userError || leadError) && (
        <div className="text-center text-red-500 mb-8">
          {userError && <p>User data error: {userError}</p>}
          {leadError && <p>Leads data error: {leadError}</p>}
          <button
            onClick={() => {
              if (userError && typesCountParams) {
                dispatch(getTypesCount(typesCountParams))
                  .unwrap()
                  .catch((err) => {
                    toast.error(err || "Failed to fetch user counts");
                  });
              }
              if (leadError && typesCountParams) {
                dispatch(
                  getTotalLeads({
                    lead_added_user_id: typesCountParams.admin_user_id,
                    lead_added_user_type: typesCountParams.admin_user_type,
                    assigned_id: typesCountParams.emp_id,
                    assigned_user_type: typesCountParams.emp_user_type,
                  })
                )
                  .unwrap()
                  .catch((err) => {
                    toast.error(err || "Failed to fetch total leads");
                  });
              }
            }}
            className="ml-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {projectCounts.map((item, index) => {
          const IconComponent = iconMap[item.user_type] || FolderKanban;
          const route = userTypeRoutes[item.user_type] || "#";

          return (
            <Link key={index} to={route} className="group cursor-pointer">
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
                        {userTypeMap[item.user_type] || "Unknown"}
                      </h3>
                      <div className="text-4xl font-bold text-white mb-2">
                        {Number(item.count).toLocaleString()}
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
        {employeeCounts.map((item, index) => {
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
                      {userTypeMap[item.user_type] ||
                        `User Type ${item.user_type}`}
                    </h4>
                    <div className="text-2xl font-bold text-slate-800">
                      {Number(item.count).toLocaleString()}
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