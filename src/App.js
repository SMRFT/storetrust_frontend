import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Sidebar from "./Components/Sidebar"; // Import your sidebar component
import TravellersIN from "./Components/TravellersIN/TravellersIN";
import TravellersIntent from "./Components/TravellersIN/TravellersIntent";
import TravellersIntentApproval from "./Components/TravellersIN/TravellersIntentApproval";
import CollegeIN from "./Components/College/CollegeIN";
import CollegeIntent from "./Components/College/CollegeIntent";
import CollegeIntentReport from "./Components/College/CollegeIntentReport";
import MessIN from "./Components/Mess/MessIN";
import MessIntent from "./Components/Mess/MessIntent";
import MessIntentReport from "./Components/Mess/MessIntentReport";
import CollegeGRNReport from "./Components/College/CollegeGRNReport";
import MessGRNReport from "./Components/Mess/MessGRNReport";
import TravellersINGRNReport from "./Components/TravellersIN/TravellersINGRNReport";
import AddItems from "./Components/InventoryMaster/AddItems";
import AddVendor from "./Components/InventoryMaster/AddVendor";
import NotificationBell from "./Components/Notifications";
import ItemManagement from "./Components/InventoryManagement/ItemManagement";
import VendorManagement from "./Components/InventoryManagement/VendorManagement";
import LowStockList from "./Components/LowStockList";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  margin-left: 250px; /* Same width as the sidebar */
  padding: 20px 80px;
  flex: 1;
  background-color: #f8f9fa;
`;

const App = () => {
  // Check token on app initialization
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      // Token not available, redirect to external login
      const REDIRECT_URL =
        process.env.REACT_APP_LOGIN_REDIRECT_URL || "https://shinova.in/login";
      window.location.href = REDIRECT_URL;
      return;
    }
  }, []);

  return (
    <AppContainer>
      {/* Add ToastContainer once at the top level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <NotificationBell />
      <Sidebar />
      <ContentWrapper>
        <Routes>
          {/* All routes are accessible, but sidebar controls navigation */}
          <Route path="/GRNGeneration" element={<TravellersIN />} />
          <Route path="/TravellersIntent" element={<TravellersIntent />} />
          <Route
            path="/TravellersIntentApproval"
            element={<TravellersIntentApproval />}
          />
          <Route path="/AddItems" element={<AddItems />} />
          <Route path="/AddVendor" element={<AddVendor />} />
          <Route path="/CollegeGRNReport" element={<CollegeGRNReport />} />
          <Route path="/CollegeIN" element={<CollegeIN />} />
          <Route path="/CollegeIntent" element={<CollegeIntent />} />
          <Route
            path="/CollegeIntentReport"
            element={<CollegeIntentReport />}
          />
          <Route path="/MessGRNReport" element={<MessGRNReport />} />
          <Route path="/MessIN" element={<MessIN />} />
          <Route path="/MessIntent" element={<MessIntent />} />
          <Route path="/MessIntentReport" element={<MessIntentReport />} />
          <Route
            path="/TravellersINGRNReport"
            element={<TravellersINGRNReport />}
          />
          <Route path="/ItemManagement" element={<ItemManagement />} />
          <Route path="/VendorManagement" element={<VendorManagement />} />
          <Route path="/LowStockList" element={<LowStockList />} />
        </Routes>
      </ContentWrapper>
    </AppContainer>
  );
};

const AppWithRouter = () => (
  <Router basename={process.env.PUBLIC_URL}>
    <App />
  </Router>
);

export default AppWithRouter;
