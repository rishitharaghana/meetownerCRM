import { Link } from "react-router"; // Use react-router-dom for TypeScript compatibility

interface BreadcrumbItem {
  label: string;
  link?: string; // Optional link for clickable items; omit for current page
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]; // Array of breadcrumb items
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ items = [] }) => {
  return (
    <nav className="text-sm text-gray-500 dark:text-gray-400 pb-5">
      <ol className="flex items-center gap-1.5">
        {/* Home breadcrumb */}
        <li>
          <Link className="inline-flex items-center gap-1.5" to="/">
            Home
            <svg
              className="stroke-current"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </li>
        {/* Dynamic breadcrumb items */}
        {items.map((item, index) => (
          <li
            key={item.label}
            className={
              index === items.length - 1
                ? "text-gray-800 dark:text-white/90"
                : "text-gray-500 dark:text-gray-400"
            }
          >
            {item.link && index !== items.length - 1 ? (
              <Link className="inline-flex items-center gap-1.5" to={item.link}>
                {item.label}
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ) : item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="inline-flex items-center gap-1.5"
                >
                  {item.label}
                
                </button>
              ):(
              item.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default PageBreadcrumb; 