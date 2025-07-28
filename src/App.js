import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";
import TravellersIN from "./Components/TravellersIN";


const ContentWrapper = styled.div`
  margin-left: 200px; /* Same width as the sidebar */
  padding: 20px 80px;
`;

const App = () => {
  const location = useLocation(); // Get the current route

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
    <>      
        <ContentWrapper>
          <Routes>
            {/* Default route redirects to Registration */}
            <Route path="/" element={<Navigate to="/TravellersIN" replace />} />
            <Route path="/TravellersIN" element={<TravellersIN />} />
                      </Routes>
        </ContentWrapper>
     
    </>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;