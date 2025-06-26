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
import LocationManager from "./pages/maps/locality";
import { Toaster } from "react-hot-toast";
import { lazy } from "react";

import AllAdsPage from "./pages/Ads/AllAds";
import CreateAds from "./pages/Ads/CreateAds";

import CitiesManager from "./pages/maps/cities";
import StatesManager from "./pages/maps/state";
import UserActivities from "./components/tables/userActivities";
import CreateProperty from "./pages/Project/AddProject";
import AllProjects from "./pages/Project/AllProjects";
import PartnerScreen from "./pages/partners/PartnersScreen";
import AddChannelPartner from "./pages/partners/AddChannelPartners";
import EmployeesScreen from "./pages/Employee Management/EmployeesScreen";
import AddNewLead from "./pages/Lead Management/AddNewLeads";

const LeadsType = lazy(() => import("./pages/Lead Management/LeadsType"));

// Simple server status check component

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
            {/* leads */}
            <Route path="/leads/:lead_in/:status" element={<LeadsType />} />
            {/* leads */}
            <Route path="/leads/addlead" element={<AddNewLead />} />
            {/* Partners screen */}
            <Route path="/partners/:status" element={<PartnerScreen />} />
            <Route
              path="/partners/addpartners"
              element={<AddChannelPartner />}
            />

            <Route path="/employee/:status" element={<EmployeesScreen />} />

            {/* Other Pages */}
            <Route path="/profile" element={<UserProfiles />} />

            <Route path="/projects/add-projects" element={<CreateProperty />} />
            <Route path="/projects/allprojects" element={<AllProjects />} />

            <Route path="/maps/cities" element={<CitiesManager />} />
            <Route path="/maps/states" element={<StatesManager />} />
            <Route path="/maps/locality" element={<LocationManager />} />
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
