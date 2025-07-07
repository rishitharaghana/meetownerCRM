import React, { useEffect, useState } from "react";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  const [userData, setUserData] = useState<{ mobile: string; userType: string } | null>(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("userData");
  if (storedUser) {
    try {
      setUserData(JSON.parse(storedUser));
    } catch (err) {
      console.error("Invalid user data in localStorage:", err);
    }
  } else {
    setUserData(null); 
  }
}, []); 

  return (
    <>
      <PageMeta title="Meet Owner Admin Profile" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>

        <div className="space-y-6">
          {/* <UserMetaCard userData={userData} />
          <UserInfoCard userData={userData} /> */}
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}
