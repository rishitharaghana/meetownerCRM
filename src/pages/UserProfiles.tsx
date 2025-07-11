import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
;
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import { AppDispatch, RootState } from "../store/store";
import { getUserProfile } from "../store/slices/userslice";

export default function UserProfiles() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Dispatch getUserProfile with the required parameters
    dispatch(
      getUserProfile({
        admin_user_id: 1, // Replace with actual admin_user_id (e.g., from auth state)
        admin_user_type: 1, // Replace with actual admin_user_type
        emp_id: 2, // Replace with actual emp_id
        emp_user_type: 2, // Replace with actual emp_user_type
      })
    );
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <PageMeta title="Meet Owner Admin Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}