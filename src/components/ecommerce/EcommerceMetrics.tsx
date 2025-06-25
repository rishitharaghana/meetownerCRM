import {
  ArrowUp,
  ArrowDown,
  Users,
  UserCheck,
  Headphones,
  Megaphone,
  ShoppingCart,
  Phone,
  Briefcase,
  FolderKanban,
} from "lucide-react";

const userTypeMap: { [key: string]: string } = {
  "7": "Channel Partners",
  "8": "Telecaller",
  "9": "Marketing Executive",
  "10": "Sales Team",
  "11": "Reception",
};

const iconMap: { [key: string]: any } = {
  "7": Users,
  "8": Headphones,
  "9": Megaphone,
  "10": ShoppingCart,
  "11": Phone,
  "active_projects": Briefcase,
  "total_projects": FolderKanban,
};

interface UserCountItem {
  user_type: string;
  count: number;
  trend?: "up" | "down";
  percentage?: number;
}

interface ProjectCountItem {
  id: string;
  title: string;
  count: number;
  trend?: "up" | "down";
  percentage?: number;
}

const staticOwnerEmployeesCounts: UserCountItem[] = [
  { user_type: "7", count: 25, trend: "down", percentage: 3 },
  { user_type: "8", count: 25, trend: "down", percentage: 3 },
  { user_type: "9", count: 15, trend: "up", percentage: 5 },
  { user_type: "10", count: 20, trend: "down", percentage: 3 },
  { user_type: "11", count: 18, trend: "up", percentage: 5 },
];

const staticProjectCounts: ProjectCountItem[] = [
  { id: "active_projects", title: "Active Projects", count: 42, trend: "up", percentage: 8 },
  { id: "total_projects", title: "Total Projects", count: 120, trend: "down", percentage: 2 },
];

const totalCount = staticOwnerEmployeesCounts.reduce((sum, item) => sum + item.count, 0);

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Welcome back, {user?.name}!
          </h1>
        </div>
        <p className="text-slate-600 ml-5">Here's an overview of your team performance</p>
      </div>

      {/* Row 1: Project Cards in Dark Style (Team Members Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {staticProjectCounts.map((item, index) => {
          const IconComponent = iconMap[item.id] || FolderKanban;
          const isPositiveTrend = item.trend === "up";
          return (
            <div key={item.id} className="group cursor-default">
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
                      <h3 className="text-white/80 text-lg font-medium mb-1">{item.title}</h3>
                      <div className="text-4xl font-bold text-white mb-2">{item.count.toLocaleString()}</div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${isPositiveTrend ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {isPositiveTrend ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                          <span className="text-sm font-semibold">{item.percentage}%</span>
                        </div>
                        <span className="text-white/60 text-sm">this month</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block text-white/10 text-6xl font-bold">#{item.count}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="group cursor-default transition-all duration-300 hover:-translate-y-2">
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cardColors[0]} backdrop-blur-sm border shadow-lg shadow-black/5 hover:shadow-xl p-6`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative mb-6">
              <div className={`w-12 h-12 ${iconBgColors[0]} rounded-xl flex items-center justify-center shadow-lg`}>
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-slate-600 text-sm font-medium mb-1">Total Team Members</h4>
                <div className="text-2xl font-bold text-slate-800">{totalCount.toLocaleString()}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  <ArrowUp className="w-3 h-3" /> 12%
                </div>
                <div className="text-xs text-slate-500">vs last month</div>
              </div>
            </div>
          </div>
        </div>

        {staticOwnerEmployeesCounts.map((item, index) => {
          const IconComponent = iconMap[item.user_type] || Users;
          const isPositiveTrend = item.trend === "up";
          return (
            <div key={item.user_type} className="group cursor-default transition-all duration-300 hover:-translate-y-2">
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cardColors[(index + 1) % cardColors.length]} backdrop-blur-sm border shadow-lg p-6`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative mb-6">
                  <div className={`w-12 h-12 ${iconBgColors[(index + 1) % iconBgColors.length]} rounded-xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-slate-600 text-sm font-medium mb-1">{userTypeMap[item.user_type] || "Unknown"}</h4>
                    <div className="text-2xl font-bold text-slate-800">{item.count.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isPositiveTrend ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isPositiveTrend ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {item.percentage}%
                    </div>
                    <div className="text-xs text-slate-500">this month</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}