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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU1RSLUFQSS1UUkxSLVIiLCJTRC1QLUJURC1SIiwiTURDLVAtUkVHLVJXIiwiU0QtUC1TU1UtUlciLCJTRC1SLUEiLCJTVFItUi1BIiwiTURDLUFQSS1BVC1SIiwiU0QtUC1HUEQtUiIsIk1EQy1QLVNPUi1SIiwiSE1TLUFQSS1JWFJBWS1SVyIsIlNULVAtTlRGLVIiLCJTVFItQVBJLUlMLVIiLCJTRC1QLVNTLVJXIiwiSE1TLUFQSS1JTVJJLVIiLCJTVC1QLVNOTy1SVyIsIlNUUi1BUEktVElOLVIiLCJTRC1QLURGLVIiLCJTVFItQVBJLVZMLVIiLCJTRC1QLVBELVIiLCJITVMtQVBJLUlCLVIiLCJTVFItUC1USU5SLVJXIiwiSE1TLUFQSS1JVVNHLVJXIiwiU1QtUC1DTVQtUiIsIk1EQy1QLVBOUC1SVyIsIlNELVAtUE9WLVJXIiwiU0QtUC1QT1YtUiIsIlNELUFQSS1SQi1SIiwiSE1TLUFQSS1TVU0tUiIsIlNUUi1BUEktVkwtUlciLCJNREMtUC1DREUtUlciLCJTVC1QLU5URi1SVyIsIkhNUy1BUEktSUNULVJXIiwiU1QtUC1UREwtUiIsIk1EQy1QLVJFRy1SIiwiU1RSLUFQSS1UUkwtUiIsIkhNUy1BUEktU1VNLVJXIiwiTURDLVAtT1NCLVJXIiwiU0QtUC1CVEQtUlciLCJTVC1BUEktQU1DLVIiLCJTRC1QLVBMLVIiLCJTRC1QLUJHLVIiLCJNREMtQVBJLUxCTi1SIiwiTURDLVAtUkRFLVJXIiwiTURDLVAtQVNNLVJXIiwiSE1TLUFQSS1JQ1QtUiIsIlNELVAtTEdMVC1SIiwiU0QtQVBJLVRWLVIiLCJITVMtQVBJLUlCLVJXIiwiR1AtUC1HQ04tUiIsIk1EQy1QLVBOUC1SIiwiU1QtQVBJLUNSRC1SIiwiU1QtUC1ERVMtUiIsIkhNUy1BUEktSU1SSS1SVyIsIlNELVAtTUlTLVIiLCJNREMtUC1QVEUtUlciLCJNREMtUC1QTlBSLVIiLCJTVC1BUEktVFJMUi1SVyIsIk1EQy1QLVRSQi1SVyIsIlNELUFQSS1DTi1SIiwiU0QtUC1ERi1SVyIsIk1EQy1BUEktQ0RSLVIiLCJTVFItQVBJLVRSTC1SVyIsIlNULVAtQ01ULVJXIiwiTURDLUFQSS1QQVQtUiIsIlNUUi1QLUlDUy1SIiwiU0QtUC1TUy1SIiwiU1QtUC1CUkQtUiIsIlNELVAtVEQtUlciLCJNREMtQVBJLVRIUi1SIiwiTURDLUFQSS1SREwtUiIsIlNELVAtVEQtUiIsIk1EQy1BUEktUlRTLVIiLCJTRC1QLUNIQy1SVyIsIlNELVAtU1NVLVIiLCJTVC1BUEktQ1JELVJXIiwiTURDLUFQSS1HQVMtUiIsIk1EQy1BUEktQVQtUlciLCJTRC1SLUNFTyIsIlNUUi1QLVRJTlItUiIsIkhNUy1BUEktSVVTRy1SIiwiSE1TLUFQSS1JWFJBWS1SIiwiU0QtUC1DSEMtUiIsIlNULUFQSS1CUkQtUlciLCJTVFItQVBJLVRJTi1SVyIsIlNUUi1BUEktSUwtUlciLCJTVC1SLUVNUCIsIlNELUFQSS1URC1SIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiLCJTSEIwMDIiXSwiaXNzIjoiaHR0cHM6Ly9sYWIuc2hpbm92YS5pbi8iLCJpYXQiOjE3NjQ4MTg4ODMsImV4cCI6MTc2NDkwNTg4MywianRpIjoiNzEzMmI2OGUtMzEwMy00YjRhLWIxNTktODg4Y2ZiMjEzMzY5In0.OZ4CL_zWSqa-r5NyPY6TSFxI8hrWTxrqU2hiT8HebPZm8dbpAHWHfejTqNCzSGdDKRgq46jLycWgPD1lkIn8Gd_qbuFM1pu7yAJpnLtJIYqSnwP8jPVeGTguyt1vw9iQx-qIq8nunR6ONL6kZSTUWzQmcssDx--wWPAoQ6lli3pegFWyFgxBilxMmun3KD1-3D-Kbjtuo_VAu1HY8Fa80J8eZNbF5i80YgYwYDWa8TmprDdsvkXWqPTPe57pLr9N2SF5ct7sOafVAFo-yqwf1gcmgRGDup1UZhAq5zcUbRgzFvCQstL6M9Ec5GsaTLNLwqmzIbFcnmcV7-tz5Fx8sQ";
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
  } 
  else if (allowedActions.includes("STR-R-SM")) {
    return "Store Manager";
  }
   else if (allowedActions.includes("STR-R-ACT")) {
    return "Accounts";
  }
  else {
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
        "❌ No token found in localStorage, trying development token"
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
        "Missing required user data (employeeId or employeeName)"
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
      </React.StrictMode>
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