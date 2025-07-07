import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"; 
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import BasicTables from "./pages/Tables/BasicTables";

import { Toaster } from "react-hot-toast";
import { lazy } from "react";
import UserActivities from "./components/tables/userActivities";
import CreateProperty from "./pages/Project/AddProject";
import AllProjects from "./pages/Project/AllProjects";
import PartnerScreen from "./pages/partners/PartnersScreen";
import AddChannelPartner from "./pages/partners/AddChannelPartners";
import EmployeesScreen from "./pages/Employee Management/EmployeesScreen";
import AddNewLead from "./pages/Lead Management/AddNewLeads";

import Support from "./pages/Support/Support";
import CreateEmployee from "./pages/Employee/CreateEmployee";
import SiteVisit from "./pages/SiteVists/SiteVisit";
import ViewLeadDetails from "./pages/Lead Management/ViewLeadDetails";
import SiteVisitDetails from "./pages/SiteVists/SiteVisit-details.";
import UpComingProjects from "./pages/Project/UpComingProjects";
import BookingsDone from "./pages/Bookings/BookingsDone";
import BookingDetails from "./pages/Bookings/BookingDetails";
import AllEmployees from "./pages/Employee/AllEmployees";
import EmployeeDetail from "./pages/Employee Management/EmployeeDetail";
const LeadsType = lazy(() => import("./pages/Lead Management/LeadsType"));
import Filter from "./components/ui/filter/Filter";
import ProjectDetailsPage from "./pages/Project/ProjectDetails"
import UserDetailsPage from "./pages/partners/UserDetails";
import UpcomingProjectDetails from './pages/Project/UpComingProjectDetails'
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import ProtectedRoute from "./hooks/ProtectedRoute";
import { isTokenExpired } from "./store/slices/authSlice";
import PartnerProfile from "./pages/partners/PartnerProfileScreen";

export default function App() {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Toaster />

        <Routes>
         
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/basic-tables" element={<BasicTables />} />
              {/* <Route path="/basic-tables-one" element={<BasicTableOne />} /> */}
              <Route path="/user-activities" element={<UserActivities />} />
              <Route path="/leads/:lead_in/:status" element={<LeadsType />} />
              <Route path="/leads/addlead" element={<AddNewLead />} />
              <Route path="/sitevists/site-visit" element={<SiteVisit />} />
              <Route path="/leads/view" element={<ViewLeadDetails />} />
              <Route path="/leads/user-details" element={<UserDetailsPage />} />
              <Route path="/site-visit/details/:id" element={<SiteVisitDetails />} />
              <Route path="/partners" element={<PartnerScreen />} />
              <Route path="/partner/:id" element={<PartnerProfile />} />
              <Route path="/partners/addpartners" element={<AddChannelPartner />} />
              <Route path="/filter" element={<Filter />} />
              <Route path="/bookings/bookings-done" element={<BookingsDone />} />
              <Route path="/bookings-done/details/:id" element={<BookingDetails />} />
              <Route path="/employee/:status" element={<EmployeesScreen />} />
              {/* <Route path="/create-employee" element={<CreateEmployee />} /> */}
              <Route  path="/employeedetails/:status/:id"  element={<EmployeeDetail />} />
              <Route path="/employee/employees" element={<AllEmployees />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/support" element={<Support />} />
              <Route path="/projects/add-projects" element={<CreateProperty />} />
              <Route path="/projects/allprojects" element={<AllProjects />} />
              <Route path="/project/:id" element={<ProjectDetailsPage />} />
              <Route path="/projects/upcoming-projects" element={<UpComingProjects />} />
              <Route path="/projects/upcoming-projectsdetails" element={<UpcomingProjectDetails />} />
            </Route>
          </Route>

          
          <Route
            path="/signin"
            element={
              isAuthenticated && token && !isTokenExpired(token) ? (
                <Navigate to="/" replace />
              ) : (
                <SignIn />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
