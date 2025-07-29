import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./Components/Sidebar"; // Import your sidebar component
import TravellersIN from "./Components/TravellersIN";
import TravellersIntent from "./Components/TravellersIntent";

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
      <Sidebar />
      <ContentWrapper>
        <Routes>
          
          
          {/* All routes are accessible, but sidebar controls navigation */}
          <Route path="/TravellersIN" element={<TravellersIN />} />
          <Route path="/TravellersIntent" element={<TravellersIntent />} />
        
        </Routes>
      </ContentWrapper>
    </AppContainer>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;