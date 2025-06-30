import { BrowserRouter as Router, Routes, Route } from "react-router"; // Updated import

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import BasicTables from "./pages/Tables/BasicTables";

import BasicTableOne from "./components/tables/BasicTables/BasicTableOne";
import { Toaster } from "react-hot-toast";
import { lazy } from "react";
import AllAdsPage from "./pages/Ads/AllAds";
import CreateAds from "./pages/Ads/CreateAds";
import UserActivities from "./components/tables/userActivities";
import CreateProperty from "./pages/Project/AddProject";
import AllProjects from "./pages/Project/AllProjects";
import PartnerScreen from "./pages/partners/PartnersScreen";
import AddChannelPartner from "./pages/partners/AddChannelPartners";
import EmployeesScreen from "./pages/Employee Management/EmployeesScreen";
import AddNewLead from "./pages/Lead Management/AddNewLeads";
import { PartnerProfile } from "./pages/partners/PartnerProfileScreen";
import Support from "./pages/Support/Support";
import CreateEmployee from "./pages/Employee/CreateEmployee";
import SiteVisit from "./pages/Lead Management/SiteVisit";
import ViewLeadDetails from "./pages/Lead Management/ViewLeadDetails";
import SiteVisitDetails from "./pages/Lead Management/SiteVisit-details.";
import UpComingProjects from "./pages/Project/UpComingProjects";
const LeadsType = lazy(() => import("./pages/Lead Management/LeadsType"));

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />

        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/basic-tables-one" element={<BasicTableOne />} />
            <Route path="/user-activities" element={<UserActivities />} />
            <Route path="/leads/:lead_in/:status" element={<LeadsType />} />
            <Route path="/leads/addlead" element={<AddNewLead />} />
            <Route path="/leads/site-visit" element={<SiteVisit />} />
            <Route path="/leads/view" element={<ViewLeadDetails />} />
            <Route
              path="/site-visit/details/:id"
              element={<SiteVisitDetails />}
            />
            <Route path="/partners" element={<PartnerScreen />} />
            <Route path="/partner/:id" element={<PartnerProfile />} />
            <Route
              path="/partners/addpartners"
              element={<AddChannelPartner />}
            />

            <Route
              path="/partners/addpartners"
              element={<AddChannelPartner />}
            />

            <Route path="/employee/:status" element={<EmployeesScreen />} />
            <Route path="/create-employee" element={<CreateEmployee />} />

            {/* Other Pages */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/support" element={<Support />} />

            <Route path="/projects/add-projects" element={<CreateProperty />} />
            <Route path="/projects/allprojects" element={<AllProjects />} />
            <Route
              path="/projects/upcoming-projects"
              element={<UpComingProjects />}
            />

            <Route path="/adds/all-ads" element={<AllAdsPage />} />
            <Route path="/adds/upload-ads" element={<CreateAds />} />
          </Route>

          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </Router>
    </>
  );
}
