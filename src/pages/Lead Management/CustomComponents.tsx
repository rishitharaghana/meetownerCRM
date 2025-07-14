import { Lead } from "../../types/LeadModel";

export const renderDropdown = (
  item: Lead,
  handleLeadAssign: (leadId: number) => void,
  handleViewHistory: (item: Lead) => void,
  handleMarkAsBooked: (leadId: number) => void,
  handleDelete: (leadId: number) => void,
  handleUpdateLead: (leadId: number) => void,
  dropdownRef: React.RefObject<HTMLDivElement>,
  dropdownOpen: { leadId: string; x: number; y: number } | null,
  isBuilder: boolean
) => (
  <div
    ref={dropdownRef}
    className="absolute z-50 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-2"
    style={{ top: dropdownOpen?.y, left: dropdownOpen?.x, transform: "translate(-100%, 0)" }}
  >
    <ul className="py-2">
      {isBuilder && (
          <li>
        <button
          onClick={() => handleLeadAssign(item.lead_id)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
        >
          Assign Lead
        </button>
        </li>
      )}
      
      <li>
        <button
          onClick={() => handleViewHistory(item)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
        >
          View History
        </button>
      </li>
      {isBuilder && (
        <li>
        <button
          onClick={() => handleMarkAsBooked(item.lead_id)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
        >
          Bookings Done
        </button>
      </li>
      )}
      
      {!isBuilder && (
        <li>
          <button
            onClick={() => handleUpdateLead(item.lead_id)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md"
          >
            Update Lead
          </button>
        </li>
      )}
      <li>
        <button
          onClick={() => handleDelete(item.lead_id)}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-700 transition-colors rounded-md"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
);


export const sidebarSubItems = [
  { name: "Today Leads", lead_in: "new", status: 0 },
  { name: "Open Leads", lead_in: "open", status: 1 },
  { name: "Today Follow-Ups", lead_in: "today", status: 2 },
  { name: "In Progress", lead_in: "InProgress", status: 3 },
  { name: "Site Visit Scheduled", lead_in: "SiteVisitScheduled", status: 4 },
  { name: "Site Visit Done", lead_in: "SiteVisitDone", status: 5 },
  { name: "Won Leads", lead_in: "WonLeads", status: 6 },
  { name: "Lost Leads", lead_in: "LostLeads", status: 7 },
];

export const BUILDER_USER_TYPE = 2;