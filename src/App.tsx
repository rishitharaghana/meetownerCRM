import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Toaster } from "react-hot-toast";
import { lazy } from "react";

import CreateProperty from "./pages/Project/AddProject";
import AllProjects from "./pages/Project/AllProjects";
import PartnerScreen from "./pages/Channel Partners/AllChannelPartnersScreen";
import AddChannelPartner from "./pages/Channel Partners/AddChannelPartners";
import EmployeesScreen from "./pages/Employee Management/EmployeesScreen";
import AddNewLead from "./pages/Lead Management/AddNewLeads";
import Support from "./pages/Support/Support";
import ViewLeadDetails from "./pages/Lead Management/ViewLeadDetails";
import BookingsDone from "./pages/Bookings/BookingsDone";
import EmployeeDetail from "./pages/Employee Management/EmployeeDetail";
const LeadsType = lazy(() => import("./pages/Lead Management/LeadsType"));
import ProjectDetailsPage from "./pages/Project/ProjectDetails";
import UpcomingProjects from "./pages/Project/UpComingProjects";
import OnGoingProjects from "./pages/Project/OnGoingProjects";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import ProtectedRoute from "./hooks/ProtectedRoute";
import { isTokenExpired } from "./store/slices/authSlice";
import PartnerProfile from "./pages/Channel Partners/ChannelPartnerProfileScreen";
import CreateEmployee from "./pages/Employee Management/CreateEmployee";
import AllLeadDetails from "./pages/Lead Management/AllLeadDetails";
import AssignLeadEmployeePage from "./pages/Lead Management/AssignLeadToEmployee";
import BookingDetails from "./pages/Bookings/BookingDetails";
import MarkBookingPage from "./pages/Lead Management/MarkBookingDone";
import StoppedProjectsLeads from "./pages/Project/stoppedProjects";
import AddBuilder from "./pages/Builders/AddBuilder";
import AllBuildersScreen from "./pages/Builders/AllBuilders";
import BuilderQueries from "./pages/Queries/BuilderQueries";
import BuilderDetailsScreen from "./pages/Builders/BuilderDetails";
import AllCpLeadDetails from "./pages/Lead Management/CpLeads";
import EmpLeads from "./pages/Lead Management/EmpLeads";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ChannelPartnerLink from "./pages/Channel Partners/ChannelPartnerLink";
import EditEmployee from "./pages/Employee Management/EditEmployee";
import EditChannelPartner from "./pages/Channel Partners/EditChannelPartner";
import EditBuilder from "./pages/Builders/EditBuilders";
import EditProject from "./pages/Project/EditProject";
export default function App() {
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );
// changes
  return (
    <>
      <Router>
        <ScrollToTop />

        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />

              <Route path="/leads/:lead_in/:status" element={<LeadsType />} />
              <Route path="/leads/addlead" element={<AddNewLead />} />
              <Route path="/leads/view" element={<ViewLeadDetails />} />

              <Route path="/lead/allLeads" element={<AllLeadDetails />} />
              <Route path="/lead/Leads" element={<AllCpLeadDetails />} />
              <Route path="/lead/EmpLeads" element={<EmpLeads />} />
              <Route
                path="/leads/assign/:leadId"
                element={<AssignLeadEmployeePage />}
              />

              <Route path="/partners" element={<PartnerScreen />} />
              <Route path="/partner/:id" element={<PartnerProfile />} />
              <Route
                path="/partners/addpartners"
                element={<AddChannelPartner />}
              />
              <Route path="edit-channelpartners/:id" element= {<EditChannelPartner/>} />

              <Route path="/builders" element={<AllBuildersScreen />} />
              <Route path="/builders/addbuilders" element={<AddBuilder />} />
              <Route path="/builder/queries" element={<BuilderQueries />} />
              <Route path="/builder/:id" element={<BuilderDetailsScreen />} />
              <Route path ="/builder/edit/:id" element={<EditBuilder/>}/>

              <Route
                path="/bookings/bookings-done"
                element={<BookingsDone />}
              />

              <Route path="/booking/:leadId" element={<BookingDetails />} />
              <Route path="/leads/book/:leadId" element={<MarkBookingPage />} />

              <Route path="/employee/:status" element={<EmployeesScreen />} />
              <Route path="/create-employee" element={<CreateEmployee />} />
              <Route
                path="/employeedetails/:status/:id"
                element={<EmployeeDetail />}
              />
              <Route path ="/editemployee/:status/:id"element = {<EditEmployee/>}/>

              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/support" element={<Support />} />
              <Route path='/projects/edit/:property_id' element = {<EditProject/>}/>
              <Route
                path="/projects/add-projects" 
                element={<CreateProperty />}
              />
              <Route path="/projects/allprojects" element={<AllProjects />} />
              <Route
                path="/projects/details/:id"
                element={<ProjectDetailsPage />}
              />
              <Route
                path="/projects/upcoming-projects"
                element={<UpcomingProjects />}
              />
              <Route
                path="/projects/ongoing-projects"
                element={<OnGoingProjects />}
              />
              <Route
                path="/projects/stopped-projects"
                element={<StoppedProjectsLeads />}
              />
            </Route>
          </Route>
            
            <Route path ="/channelpartner-link" 
            element ={< ChannelPartnerLink />} />

          <Route  path ='/forgot-password'
          element={<ForgotPassword/>}/>
          
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
        <Toaster
          position="top-right"
          toastOptions={{ duration: 3000, style: { zIndex: 9999 } }}
          containerStyle={{ top: "5rem" }}
        />
      </Router>
    </>
  );
}
