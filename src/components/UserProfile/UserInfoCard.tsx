import React from 'react';
import {
  User2,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react';

interface Option {
  value: number;
  text: string;
}

const designationOptions: Option[] = [
  { value: 1, text: "Admin" },
  { value: 7, text: "Manager" },
  { value: 8, text: "TeleCaller" },
  { value: 9, text: "Marketing Executive" },
  { value: 10, text: "Customer Support" },
  { value: 11, text: "Customer Service" },
];

const mockUser = {
  name: "Sarah Johnson",
  email: "sarah.johnson@realestate.com",
  mobile: "9876543210",
  user_type: 7
};

export default function UserInfoCard() {
  const user = mockUser;
  const userType = mockUser.user_type;

  const getDesignationText = (userType: number | undefined): string => {
    const designation = designationOptions.find(option => option.value === userType);
    return designation ? designation.text : "Unknown Designation";
  };

  const infoItems = [
    {
      icon: User2,
      label: "Full Name",
      value: user?.name || "N/A",
      gradient: "from-sky-500 to-cyan-600"
    },
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "N/A",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: Phone,
      label: "Phone",
      value: user?.mobile ? `+91 ${user.mobile}` : "N/A",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: Briefcase,
      label: "Designation",
      value: getDesignationText(userType),
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <div className="relative rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 p-10 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Personal Information
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Professional Profile Overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex gap-4 items-start p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-all duration-300 group"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} shadow-md`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 tracking-wide">
                  {item.label}
                </p>
                <p className="mt-1 text-base font-medium text-slate-800 dark:text-white break-words">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Active Profile</span>
        </div>
        <span>Last updated: Today</span>
      </div>
    </div>
  );
}
