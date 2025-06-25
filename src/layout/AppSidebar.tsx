import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { FaAd, FaFileInvoice, FaIdBadge, FaMoneyCheck,FaUser, FaUserTie } from "react-icons/fa";



type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path?: string;
    pro?: boolean;
    new?: boolean;
    data?: { lead_in: string;  status: number };
    nestedItems?: {
      name: string;
      path?: string;
      nestedItems?: {
        name: string;
        path: string;
        data?: { property_in: string; property_for: string; status: number };
      }[];
    }[];
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <CalenderIcon />,
    name: "Lead Management",
    subItems: [
      { name: "New Leads", path: "/leads/new/0", data: { "lead_in": "New", "status": 0} },
      { name: "Today Leads", path: "/leads/today/1", data: { "lead_in": "Today",  "status": 1} },
      { name: "Site Visit done", path: "/leads/site/2", data: { "lead_in": "Site", "status": 2 } },
      { name: "Won Leads", path: "/leads/won/3", data: { "lead_in": "Won",  "status": 3} },
      { name: "Loss Leads", path: "/leads/loss/4", data: { "lead_in": "Loss", "status": 4 } },
      { name: "Total Leads", path: "/leads/total/5", data: { "lead_in": "Total","status": 5 } },
      { name: "Expiry Leads", path: "/leads/expiry/6", data: { "lead_in": "Expiry","status": 6 } },
     
    ],
  },
  {
    name: "Project Management",
    icon: <FaFileInvoice />,
    subItems: [
      { name: "Add Projects", path: "/projects/add-projects", pro: false },
      { name: "All Projects", path: "/projects/allprojects", pro: false },
    ],
  },
 
  {
    icon: <FaUser />,
    name: "Partners",
    subItems: [
      { name: "New channel Partners", path: "/partners/0" },
      { name: "Add Channel Partners", path: "/partners/addpartners" },
      { name: "Top Partners", path: "/partners/1" },
    ],
  },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },
  {
    name: "Employee Management",
    icon: <FaUserTie />,
    subItems: [
      { name: "Telecallers", path: "/employee/1", pro: false },
      { name: "Marketing Executors", path: "/employee/2", pro: false },
      { name: "Sales Team", path: "/employee/3", pro: false },
      { name: "Reception", path: "/employee/4", pro: false },
    ],
  },
  
  
  
  
  {
    name: "Price sheets",
    icon: <FaMoneyCheck />,
    subItems: [
      { name: "Generate price Sheet", path: "/maps/cities", pro: false },
      { name: "Generated Price Sheet", path: "/maps/cities", pro: false },
      
    ],
  },
  {
    name: "Source",
    icon: <FaAd />,
    subItems: [
      { name: "Meta Ads", path: "/adds/all-ads", pro: false },
      { name: "Google Ads", path: "/adds/all-ads", pro: false },
      { name: "Direct Ads", path: "/adds/upload-ads", pro: false },
    ],
  },
  {
    name: "Comission Structure",
    icon: <FaIdBadge />,
    subItems: [
      { name: "Create Strucutre", path: "/packages/builder", pro: false },
      { name: "Existing Structure", path: "/packages/agents", pro: false },
     
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();


  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main"; index: number } | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<{ type: "main"; index: number; subIndex: number } | null>(null);
  const [openDeepNestedSubmenu, setOpenDeepNestedSubmenu] = useState<{ type: "main"; index: number; subIndex: number; nestedIndex: number } | null>(null);

  // const filterAccountsSubItems = (subItems: NavItem["subItems"]) => {
  //   if (!subItems) return subItems;
  //   return subItems.map(subItem => ({
  //     ...subItem,
  //     nestedItems: subItem.nestedItems?.filter(nestedItem => {
  //       if (userType === 8) {
  //         return ["Payment Failure", "Expiry Soon"].includes(nestedItem.name);
  //       }
  //       return true; // Keep all items for other user types
  //     }),
  //   }));
  // };

 
  // const filteredNavItems = navItems
  //   .filter(item => {
  //     if (userType === 7) return !["Accounts", "Pages", "Maps","Ads","Packages"].includes(item.name); // Manager
  //     if (userType === 8) return !["Pages", "Maps", "Commercial Rent", "Commercial Buy", "Residential Rent", "Residential Buy", "Employees", "Lead Management", "Users","Ads","Packages"].includes(item.name); // Telecaller
  //     if (userType === 9) return !["Accounts", "Pages", "Maps", "Employees","Ads","Packages"].includes(item.name); // Marketing Executive
  //     if (userType === 10) return !["Accounts", "Employees", "Pages", "Maps", "Lead Management", "Users","Ads","Packages"].includes(item.name); // Customer Support
  //     if (userType === 11) return !["Accounts", "Employees", "Pages", "Maps", "Lead Management", "Users","Ads","Packages"].includes(item.name); // Customer Service
  //     return true;
  //   })
  //   .map(item => {
  //     if (userType === 8 && item.name === "Accounts") {
  //       return {
  //         ...item,
  //         subItems: filterAccountsSubItems(item.subItems),
  //       };
  //     }
  //     return item;
  //   });


  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const nestedSubMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const deepNestedSubMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const [nestedSubMenuHeight, setNestedSubMenuHeight] = useState<Record<string, number>>({});
  const [deepNestedSubMenuHeight, setDeepNestedSubMenuHeight] = useState<Record<string, number>>({});

  const isActive = useCallback((path?: string) => !!path && location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem, subIndex) => {
          if (subItem.path && isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
          if (subItem.nestedItems) {
            subItem.nestedItems.forEach((nestedItem, nestedIndex) => {
              if (nestedItem.path && isActive(nestedItem.path)) {
                setOpenSubmenu({ type: "main", index });
                setOpenNestedSubmenu({ type: "main", index, subIndex });
                submenuMatched = true;
              }
              if (nestedItem.nestedItems) {
                nestedItem.nestedItems.forEach((deepNestedItem) => {
                  if (isActive(deepNestedItem.path)) {
                    setOpenSubmenu({ type: "main", index });
                    setOpenNestedSubmenu({ type: "main", index, subIndex });
                    setOpenDeepNestedSubmenu({ type: "main", index, subIndex, nestedIndex });
                    submenuMatched = true;
                  }
                });
              }
            });
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
      setOpenNestedSubmenu(null);
      setOpenDeepNestedSubmenu(null);
    }
  }, [location.pathname, isActive]);

  useLayoutEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({ ...prev, [key]: subMenuRefs.current[key]?.scrollHeight || 0 }));
      }
    }
    if (openNestedSubmenu) {
      const key = `${openNestedSubmenu.type}-${openNestedSubmenu.index}-${openNestedSubmenu.subIndex}`;
      if (nestedSubMenuRefs.current[key]) {
        setNestedSubMenuHeight((prev) => ({ ...prev, [key]: nestedSubMenuRefs.current[key]?.scrollHeight || 0 }));
      }
    }
    if (openDeepNestedSubmenu) {
      const key = `${openDeepNestedSubmenu.type}-${openDeepNestedSubmenu.index}-${openDeepNestedSubmenu.subIndex}-${openDeepNestedSubmenu.nestedIndex}`;
      if (deepNestedSubMenuRefs.current[key]) {
        setDeepNestedSubMenuHeight((prev) => ({ ...prev, [key]: deepNestedSubMenuRefs.current[key]?.scrollHeight || 0 }));
      }
    }
  }, [openSubmenu, openNestedSubmenu, openDeepNestedSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.type === "main" && prev.index === index ? null : { type: "main", index }));
  };

  const handleNestedSubmenuToggle = (index: number, subIndex: number) => {
    setOpenNestedSubmenu((prev) =>
      prev?.type === "main" && prev.index === index && prev.subIndex === subIndex ? null : { type: "main", index, subIndex }
    );
  };

  const handleDeepNestedSubmenuToggle = (index: number, subIndex: number, nestedIndex: number) => {
    setOpenDeepNestedSubmenu((prev) =>
      prev?.type === "main" && prev.index === index && prev.subIndex === subIndex && prev.nestedIndex === nestedIndex
        ? null
        : { type: "main", index, subIndex, nestedIndex }
    );
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`flex items-center w-full p-1 rounded-lg gap-1 ${
                openSubmenu?.type === "main" && openSubmenu?.index === index
                  ? "bg-gray-100 text-blue-600"
                  : "hover:bg-gray-50 text-gray-700"
              } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className="w-6 h-4 flex-shrink-4">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="flex-1 text-left">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === "main" && openSubmenu?.index === index ? "rotate-180 text-blue-600" : "text-gray-500"
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`flex items-center w-full p-2 rounded-lg ${
                  isActive(nav.path) ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className="w-6 h-6 mr-2">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="flex-1 text-left">{nav.name}</span>}
              </Link>
            )
          )}
        
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el: HTMLDivElement | null) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu?.type === "main" && openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`] || 0}px` : "0px",
              }}
            >
              <ul className="mt-1 space-y-1 ml-6">
                {nav.subItems.map((subItem, subIndex) => (
                  <li key={subItem.name}>
                    {subItem.nestedItems ? (
                      <div>
                        <button
                          onClick={() => handleNestedSubmenuToggle(index, subIndex)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg ${
                            openNestedSubmenu?.type === "main" &&
                            openNestedSubmenu?.index === index &&
                            openNestedSubmenu?.subIndex === subIndex
                              ? "bg-gray-50 text-blue-600"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span>{subItem.name}</span>
                          <ChevronDownIcon
                            className={`w-5 h-5 transition-transform duration-200 ${
                              openNestedSubmenu?.type === "main" &&
                              openNestedSubmenu?.index === index &&
                              openNestedSubmenu?.subIndex === subIndex
                                ? "rotate-180 text-blue-600"
                                : "text-gray-500"
                            }`}
                          />
                        </button>
                        <div
                          ref={(el: HTMLDivElement | null) => {
                            nestedSubMenuRefs.current[`main-${index}-${subIndex}`] = el;
                          }}
                          className="overflow-hidden transition-all duration-300"
                          style={{
                            height:
                              openNestedSubmenu?.type === "main" &&
                              openNestedSubmenu?.index === index &&
                              openNestedSubmenu?.subIndex === subIndex
                                ? `${nestedSubMenuHeight[`main-${index}-${subIndex}`] || 0}px`
                                : "0px",
                          }}
                        >
                          <ul className="mt-1 space-y-1 ml-4">
                            {subItem.nestedItems.map((nestedItem, nestedIndex) => (
                              <li key={nestedItem.name}>
                                {nestedItem.nestedItems ? (
                                  <div>
                                    <button
                                      onClick={() => handleDeepNestedSubmenuToggle(index, subIndex, nestedIndex)}
                                      className={`w-full flex items-center justify-between p-2 rounded-lg ${
                                        openDeepNestedSubmenu?.type === "main" &&
                                        openDeepNestedSubmenu?.index === index &&
                                        openDeepNestedSubmenu?.subIndex === subIndex &&
                                        openDeepNestedSubmenu?.nestedIndex === nestedIndex
                                          ? "bg-gray-50 text-blue-600"
                                          : "hover:bg-gray-50 text-gray-700"
                                      }`}
                                    >
                                      <span>{nestedItem.name}</span>
                                      <ChevronDownIcon
                                        className={`w-5 h-5 transition-transform duration-200 ${
                                          openDeepNestedSubmenu?.type === "main" &&
                                          openDeepNestedSubmenu?.index === index &&
                                          openDeepNestedSubmenu?.subIndex === subIndex &&
                                          openDeepNestedSubmenu?.nestedIndex === nestedIndex
                                            ? "rotate-180 text-blue-600"
                                            : "text-gray-500"
                                        }`}
                                      />
                                    </button>
                                    <div
                                      ref={(el: HTMLDivElement | null) => {
                                        deepNestedSubMenuRefs.current[`main-${index}-${subIndex}-${nestedIndex}`] = el;
                                      }}
                                      className="overflow-hidden transition-all duration-300"
                                      style={{
                                        height:
                                          openDeepNestedSubmenu?.type === "main" &&
                                          openDeepNestedSubmenu?.index === index &&
                                          openDeepNestedSubmenu?.subIndex === subIndex &&
                                          openDeepNestedSubmenu?.nestedIndex === nestedIndex
                                            ? `${deepNestedSubMenuHeight[`main-${index}-${subIndex}-${nestedIndex}`] || 0}px`
                                            : "0px",
                                      }}
                                    >
                                      <ul className="mt-1 space-y-1 ml-4">
                                        {nestedItem.nestedItems.map((deepNestedItem) => (
                                          <li key={deepNestedItem.name}>
                                            <Link
                                              to={deepNestedItem.path}
                                              className={`block p-2 rounded-lg ${
                                                isActive(deepNestedItem.path)
                                                  ? "bg-gray-100 text-blue-600"
                                                  : "hover:bg-gray-50 text-gray-700"
                                              }`}
                                            >
                                              {deepNestedItem.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                ) : (
                                  nestedItem.path && (
                                    <Link
                                      to={nestedItem.path}
                                      className={`block p-2 rounded-lg ${
                                        isActive(nestedItem.path) ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50 text-gray-700"
                                      }`}
                                    >
                                      {nestedItem.name}
                                    </Link>
                                  )
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      subItem.path && (
                        <Link
                          to={subItem.path}
                          className={`block p-2 rounded-lg ${
                            isActive(subItem.path) ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {subItem.name}
                          {subItem.new && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">new</span>
                          )}
                          {subItem.pro && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">pro</span>
                          )}
                        </Link>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[80px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="dark:hidden" src="/images/logo.png" alt="Logo" width={150} height={40} />
              <img className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <img src="/images/logo.png" alt="Logo" width={100} height={50} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
        <nav className="mb-6">
          <h2
            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
          </h2>
          {renderMenuItems(navItems)}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;