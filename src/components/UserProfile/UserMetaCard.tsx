import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { useState, ChangeEvent } from "react";
import { uploadUserImage } from "../../store/slices/uploadSlice";
import { toast } from "react-hot-toast";

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

export default function UserMetaCard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { uploadLoading } = useSelector((state: RootState) => state.upload);
  const dispatch = useDispatch<AppDispatch>();

  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [isEditing, setIsEditing] = useState(false);

  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedCity, setEditedCity] = useState(localStorage.getItem("city") || "");
  const [editedDesignation, setEditedDesignation] = useState(user?.user_type || 0);

  const getInitial = () => user?.name?.charAt(0).toUpperCase() || "?";

  const getDesignationText = (userType: number | undefined): string => {
    const designation = designationOptions.find(option => option.value === userType);
    return designation ? designation.text : "Unknown Designation";
  };

  const hasValidPhoto = () => user?.photo && user.photo !== "null" && user.photo !== null;

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB.");
      return;
    }

    if (!user?.user_id) {
      toast.error("User ID missing.");
      return;
    }

    try {
      const result = await dispatch(
        uploadUserImage({ user_id: user.user_id, image: file })
      ).unwrap();

      if (result.url) {
        localStorage.setItem("photo", result.url);
        window.location.reload();
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }

    setFileInputKey(Date.now());
  };

  const handleSaveChanges = () => {
    // Here you'd usually dispatch an updateUser thunk
    toast.success("Profile updated!");
    localStorage.setItem("city", editedCity);
    setIsEditing(false);
    // Ideally update redux user state too
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:shadow-2xl">
      <div className="flex flex-col xl:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl font-bold text-slate-700 dark:text-white shadow-inner ring-2 ring-slate-300 dark:ring-slate-600 group">
          {hasValidPhoto() ? (
            <img
              src={user?.photo}
              alt="User"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <span>{getInitial()}</span>
          )}
          <label
            htmlFor="photo-upload"
            className="absolute bottom-1 right-1 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
            title="Change Photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M16.732 3.732a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <input
              type="file"
              id="photo-upload"
              key={fileInputKey}
              accept=".jpg,.jpeg,.png"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadLoading}
            />
          </label>
        </div>

        <div className="flex-1 text-center xl:text-left">
          {!isEditing ? (
            <>
              <h4 className="text-2xl font-semibold text-slate-800 dark:text-white mb-1">{user?.name}</h4>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-x-2">
                <span>{getDesignationText(user?.user_type)}</span>
                <span className="hidden sm:inline-block w-px h-3 bg-slate-300 dark:bg-slate-600"></span>
                <span>{localStorage.getItem("city") || "Unknown City"}</span>
              </div>
            
            </>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                placeholder="Full Name"
              />
              <input
                type="text"
                value={editedCity}
                onChange={(e) => setEditedCity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                placeholder="City"
              />
              <select
                value={editedDesignation}
                onChange={(e) => setEditedDesignation(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 dark:bg-slate-800"
              >
                {designationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.text}
                  </option>
                ))}
              </select>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
