import React from "react";
import { X } from "lucide-react";

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Subscription Expired</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Your subscription has expired. Please subscribe for continued access to premium features.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={() => {
              window.location.href = "/subscribe";
            }}
            className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;