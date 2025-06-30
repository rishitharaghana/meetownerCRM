import { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode;
  className?: string;
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode;
  className?: string;
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <table
      className={`min-w-full border-collapse bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm ${className || ""}`}
    >
      {children}
    </table>
  );
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <thead
      className={`bg-purple-600 text-white border-b border-purple-200 dark:bg-purple-800 dark:border-purple-600 ${className || ""}`}
    >
      {children}
    </thead>
  );
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return (
    <tbody
      className={`divide-y divide-purple-200 dark:divide-purple-600 ${className || ""}`}
    >
      {children}
    </tbody>
  );
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr
      className={` dark:hover:bg-purple-900 transition-colors duration-150 ${className || ""}`}
    >
      {children}
    </tr>
  );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag
      className={`${
        isHeader
          ? "px-5 py-3 font-semibold text-white text-theme-xs dark:text-white"
          : "px-5 py-4 text-purple-700 dark:text-purple-300 text-theme-sm dark:text-gray-400"
      } ${className || ""}`}
    >
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };