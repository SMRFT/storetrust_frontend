import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

console.log("=== STORETRUST NDEX.JS DEBUG ===");
console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEgQi4sIE1TLiwgRE5CLiwiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0QtUC1ITVNQQi1SVyIsIkhNUy1QLVZJLVIiLCJITVMtUC1JUEUtUlciLCJTVC1QLUNNVC1SVyIsIlNELVAtU0EtUlciLCJTRC1QLUhNU1RELVIiLCJITVMtUC1TVU1ELVJXIiwiSE1TLVAtVlYtUiIsIlNUUi1BUEktVElOLVIiLCJITVMtUC1DVEUtUlciLCJITVMtQVBJLURMRC1SIiwiU0QtUC1NQlBELVIiLCJITVMtUC1DVC1SVyIsIkhNUy1QLUhSSU4tUlciLCJTRC1QLUhNU1NQLVIiLCJTRC1BUEktR0QtUiIsIlNULVItQSIsIk1EQy1SLVBEQyIsIkhNUy1QLVZWRC1SVyIsIlNULVAtREVTLVJXIiwiTURDLUFQSS1TR1AtUlciLCJITVMtUC1NUklBLVJXIiwiTURDLVAtQUQtUlciLCJNREMtUC1HUFAtUiIsIlNULVAtTlRGLVIiLCJTVC1QLVNOTy1SVyIsIkhNUy1QLVhSQVktUiIsIlNELUFQSS1UTS1SVyIsIkhNUy1QLVJTSEZUIiwiSE1TLVAtVVNHQS1SVyIsIkhNUy1QLVNVTUUtUlciLCJNREMtQVBJLUwtUlciLCJTRC1QLUhNU1VDLVJXIiwiSE1TLVAtVlNFLVJXIiwiU0QtQVBJLUNOLVIiLCJITVMtUC1SRUctUlciLCJTRC1BUEktVE0tUiIsIkhNUy1QLUNUSUEtUlciLCJNREMtQVBJLUFULVIiLCJTRC1QLUhNU0JELVJXIiwiSE1TLVAtVVNHRC1SVyIsIlNELVAtUkQtUlciLCJTRC1QLUhNU0NTLVIiLCJITVMtUC1IUklORS1SIiwiSE1TLVAtVkNDLVJXIiwiSE1TLVAtVkNFLVJXIiwiSE1TLVAtTVJJRC1SVyIsIlNULUFQSS1DUkQtUlciLCJITVMtUC1JQ1QtUlciLCJTRC1QLUhNU0dQLVIiLCJNREMtUC1HT0EtUlciLCJTRC1BUEktTUJURC1SVyIsIkhNUy1BUEktRU1MLVJXIiwiSE1TLVAtV1IiLCJITVMtUC1TSURFQkFSIiwiSE1TLVAtWFJBWUUtUlciLCJNREMtUC1BQVUtUlciLCJNREMtQVBJLVBEQy1SVyIsIlNELVAtSE1TU1MtUlciLCJITVMtUC1TVU0tUlciLCJTRC1QLUhNU1BTLVJXIiwiTURDLUFQSS1QR1AtUlciLCJNREMtQVBJLUFHUC1SVyIsIlNELVAtSE1TR0MtUiIsIlNELVAtU1NVLVJXIiwiSE1TLVAtUEREUy1SVyIsIkhNUy1QLUlCLVIiLCJTRC1QLU1JUy1SIiwiU0QtUC1ITVNTRC1SIiwiSE1TLVAtVklOLVJXIiwiSE1TLVAtSU1SSS1SVyIsIkhNUy1QLVNVTUEtUlciLCJNREMtUC1HQ1AtUiIsIkhNUy1QLUlYUkFZLVJXIiwiU0QtUC1TU1UtUiIsIk1EQy1BUEktT0dQLVJXIiwiSE1TLVAtQ1RJLVJXIiwiSE1TLVAtTVJJLVIiLCJTRC1QLVRELVJXIiwiSE1TLVAtVlMtUiIsIlNULVAtQ01ULVIiLCJTVC1QLURFUy1SIiwiSE1TLVAtVkNDLVIiLCJITVMtUC1WSUUtUlciLCJTVFItQVBJLVRJTi1SVyIsIkhNUy1QLVVTR0UtUlciLCJITVMtUC1JUEQtUlciLCJTRC1QLVJHLVJXIiwiU1RSLVItRU1QIiwiU0QtUC1QT1YtUiIsIkhNUy1QLVhSQVktUlciLCJTRC1BUEktTUlTLVJXIiwiU0QtUC1TUy1SVyIsIlNELVAtTUJERi1SVyIsIk1EQy1QLVBOUFItUiIsIkhNUy1QLVNVTS1SIiwiU0QtUC1URS1SVyIsIkhNUy1QLVZDRC1SVyIsIkhNUy1QLUNULVIiLCJITVMtUC1WUy1SVyIsIkhNUy1QLVZQUCIsIkhNUy1QLUhSSU4tUiIsIlNULVAtVERMLVJXIiwiSE1TLVAtVlZFLVJXIiwiSE1TLVAtVVNHLVJXIiwiU0QtQVBJLVJCLVIiLCJITVMtUC1NUkktUlciLCJNREMtQVBJLUNHUC1SVyIsIkhNUy1QLUNERFMtUlciLCJITVMtUC1JVVNHLVJXIiwiU0QtUC1ITVNMRC1SIiwiSE1TLVAtVklORS1SVyIsIk1EQy1QLUdTUC1SIiwiU0QtUC1UREUtUlciLCJITVMtUC1IUklOQS1SVyIsIkhNUy1QLUlQLVIiLCJITVMtUC1YUkFZRC1SVyIsIlNELVAtUEQtUlciLCJITVMtUC1WVi1SVyIsIkhNUy1QLUhNUyIsIkhNUy1QLUItUlciLCJITVMtUC1JUC1SVyIsIkhNUy1QLVZJTkEtUlciLCJTRC1QLVBPVi1SVyIsIkhNUy1QLUhSSU5ELVJXIiwiSE1TLVAtVVNHLVIiLCJTVC1BUEktQU1DLVJXIiwiSE1TLVAtVkVWIiwiSE1TLUFQSS1SRC1SIiwiSE1TLVAtSFJJTlAtUlciLCJITVMtUC1DVEQtUlciLCJTRC1BUEktVFYtUiIsIk1EQy1QLUdBUC1SIiwiSE1TLVAtVkktUlciLCJTVC1SLUNEUiIsIlNULUFQSS1CUkQtUlciLCJTRC1QLVNTLVIiLCJITVMtUC1BRE0tUlciLCJPTEVUMDAyIiwiU0QtUC1NQlRWLVIiLCJTRC1QLURGLVJXIiwiSE1TLVAtVklELVJXIiwiSE1TLVAtVklOUi1SIiwiSE1TLVAtVlNELVJXIiwiSE1TLVAtSE1TSU5TIiwiU1QtUC1CUkQtUiIsIlNULVAtVERMLVIiLCJTVC1QLU5URi1SVyIsIk1EQy1QLUdPUC1SIiwiSE1TLVAtRExELVJXIiwiU1QtQVBJLUVNUC1SIiwiU0QtUi1MVCJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIiwiU0hCMDAyIl0sImhvc3BpdGFsX2NvZGUiOiJTSDAwMSIsImhtc19wYWdlcyI6WzEyOCwzLDUsNDAsNDEsMTAsNDIsMTQwLDE0MSwxNDIsNDYsMTIsMTQzLDE0NCwyMywyNCwyNSwxMjddLCJhbGxvd2VkLW91dGxldHMiOlsiT0xFVDAwMyIsIk9MRVQwMDUiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3ODQ2OTcwNzQsImV4cCI6MTc4NDc4NDA3NH0.PhAjnETIvVP3AZ9B2CZWJMR88F_9hyv_nsGAtLibzUwKdbU7Fofws7kCT5zkCz9EPdUu7I45gTeoEyWD_z7mmU2E710oHBKZqODX3sLJuXa7iP4uiBBcVDvuwKFroefrXvl0jLZCdHi3e2ilBQgjFG6HAq1ktOxf_fCEdg3Db1vLX8R0e4GgAgVoFXLKAhrVITA0tcIiZyH7oVtmxoZep8WRphP86hNV69TJfzSxrKhDpDgHbfCmLWXP-NkRxHj_YVCpUCIWMumH3wSrILxdbGIu2d-JUL8QFvFOArczXMkjJAUsq_Tz5OHzI259g4OdGcSpH6CacWDrmmvdylpxCA";
  return dev_token;
}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    console.log("🔄 Redirecting to login URL:", REDIRECT_URL);
    window.location.href = REDIRECT_URL;
  } else {
    console.error("❌ REDIRECT_URL not configured");
    // Even if REDIRECT_URL is not configured, don't show error - just redirect to a fallback
    window.location.href = "https://shinova.in/login";
  }
}

// --- Validate JWT Token Locally ---
function validate(token) {
  if (!token || token.trim() === "") {
    throw new Error("Token is empty");
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// --- Function to determine user role based on allowed-actions ---
function getUserRole(allowedActions) {
  if (!allowedActions || !Array.isArray(allowedActions)) {
    return "Admin"; // Default role
  }

  if (allowedActions.includes("STR-R-A")) {
    return "Admin";
  } else if (allowedActions.includes("STR-R-EMP")) {
    return "Employee";
  } else if (allowedActions.includes("STR-R-SM")) {
    return "Store Manager";
  } else if (allowedActions.includes("STR-R-ACT")) {
    return "Accounts";
  } else {
    return "Admin"; // Default role if none of the specific roles are found
  }
}

// --- Main execution ---
(function main() {
  try {
    console.log("Starting token validation...");

    // Retrieve token from localStorage
    let accessToken = localStorage.getItem("access_token");
    console.log("Access token from localStorage exists:", !!accessToken);

    // If no token found, try development token
    if (!accessToken) {
      console.log(
        "❌ No token found in localStorage, trying development token",
      );
      accessToken = setforlocaldev();
    }

    // If still no token (development token is empty), redirect to login
    if (!accessToken || accessToken.trim() === "") {
      console.log("❌ No valid token available, redirecting to login");
      localStorage.removeItem("access_token"); // Clean up
      redirectToLogin();
      return; // Stop execution here
    }

    // Validate the token
    const userPayload = validate(accessToken);
    console.log("✅ Token validated successfully");
    console.log("Decoded token payload:", userPayload);

    // Store the valid token and user information
    localStorage.setItem("access_token", accessToken);

    // Extract user information from token payload
    const employeeId = userPayload.aud; // Using 'aud' field as ID
    const name = userPayload.name;
    const userEmail = userPayload.email;
    const userRole = getUserRole(userPayload["allowed-actions"]);

    console.log("Employee ID:", employeeId);
    console.log("Name:", name);
    console.log("Email:", userEmail);
    console.log("User Role:", userRole);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && name);
    console.log("Is logged in:", isLoggedIn);

    if (!isLoggedIn) {
      throw new Error(
        "Missing required user data (employeeId or employeeName)",
      );
    }

    // Store user payload and extracted information for app usage
    localStorage.setItem("user_payload", JSON.stringify(userPayload));
    localStorage.setItem("employeeId", employeeId);
    localStorage.setItem("name", name);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("role", userRole);

    console.log("✅ User payload and extracted data stored in localStorage");
    console.log("Stored data:", {
      employeeId,
      name,
      userEmail,
      role: userRole,
    });

    // Token is valid, render app
    console.log("✅ Rendering milestone app...");
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );

    reportWebVitals();
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();
