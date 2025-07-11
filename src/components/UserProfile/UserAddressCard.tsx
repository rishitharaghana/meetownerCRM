
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function UserAddressCard() {
  const { selectedUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:shadow-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full">
          <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
            Address
          </h4>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 2xl:gap-x-32">
            <div>
              <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Country
              </p>
              <p className="text-base font-semibold text-slate-800 dark:text-white">
                India
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                City / State
              </p>
              <p className="text-base font-semibold text-slate-800 dark:text-white">
                {selectedUser?.city || "Unknown City"}, {selectedUser?.state || "Unknown State"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Location
              </p>
              <p className="text-base font-semibold text-slate-800 dark:text-white">
                {selectedUser?.location || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Address
              </p>
              <p className="text-base font-semibold text-slate-800 dark:text-white">
                {selectedUser?.address || "N/A"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Pincode
              </p>
              <p className="text-base font-semibold text-slate-800 dark:text-white">
                {selectedUser?.pincode || "N/A"}
              </p>
            </div>

            {selectedUser?.company_name && (
              <div>
                <p className="mb-1 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                  Company Name
                </p>
                <p className="text-base font-semibold text-slate-800 dark:text-white">
                  {selectedUser.company_name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}