import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

console.log("=== MILESTONE INDEX.JS DEBUG ===");
console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU1QtQVBJLUVNUC1SIiwiTURDLVAtQ0RFLVJXIiwiTURDLVAtUkRFLVJXIiwiTURDLUFQSS1USFItUiIsIk1EQy1QLVBOUC1SVyIsIlNULVAtVERMLVJXIiwiU1QtQVBJLUNSRC1SVyIsIk1EQy1QLVBOUC1SIiwiU1QtUC1DTVQtUlciLCJFUi1QLUVSUkVHLVJXIiwiTURDLUFQSS1SREwtUiIsIlNJTi1QLUlGLVIiLCJTVC1QLUNNVC1SIiwiRVItUC1FUlBELVJXIiwiTURDLVAtUFRFLVJXIiwiRVItUC1FUlAtUiIsIkVSLVAtRVJSRS1SVyIsIkVSLVAtRVJQQi1SVyIsIkVSLVAtRVJOQk4tUiIsIkVSLVAtRVJCLVJXIiwiU1QtUC1UREwtUiIsIk1EQy1QLVRSQi1SVyIsIlNUUi1QLU1FUyIsIkVSLVAtRVJELVIiLCJNREMtQVBJLVJUUy1SIiwiU1QtUC1CUkQtUiIsIlNULUFQSS1BTUMtUlciLCJTVFItUC1DTEciLCJTVC1QLU5URi1SIiwiTURDLUFQSS1HQVMtUiIsIk1EQy1QLVNPUi1SIiwiU1QtUi1BIiwiRVItUi1FUk4iLCJTVC1QLURFUy1SIiwiTURDLUFQSS1DRFItUiIsIk1EQy1QLVJFRy1SIiwiU1QtUC1ERVMtUlciLCJTVC1QLU5URi1SVyIsIlNULUFQSS1CUkQtUlciLCJNREMtUC1BU00tUlciLCJTSU4tUC1VUC1SIiwiU1RSLVItQSIsIlNJTi1QLURDLVIiLCJNREMtQVBJLUxCTi1SIiwiU1QtUC1TTk8tUlciLCJNREMtQVBJLVBBVC1SIiwiU1RSLVAtVFJMIiwiTURDLVAtUkVHLVJXIiwiTURDLVAtT1NCLVJXIiwiU0lOLVAtT1ItUiJdLCJhbGxvd2VkLWRhdGEiOlsiU0hCMDAxIl0sImlzcyI6Imh0dHBzOi8vbGFiLnNoaW5vdmEuaW4vIiwiaWF0IjoxNzUzNjc3MzQzLCJleHAiOjE3NTM3NjM3NDMsImp0aSI6ImZkOTEzMDc3LTE5MDYtNDZhZS04YjQ1LWU4YzBhMzEyODZjMiJ9.Q8hWe0Yvw6mfmo7qGYHTP78UqVoUZ43LwmOTOFhK8On1FRuKye3cBCzNPwW9w-TBx4vx0LK6Ypkr6ZlgHOj-a6bbF7PXEW5ScCtlERCSIdL3HIBvsrBl2YPd397J9DeaO_1W_FEsgKrVmZ5ifSt_-OB06r0LajvDjIWCT37Pig57rYy0dJyxcIwxXl4c3ZXQKz7qUm5p2vrqc9K6BIqu3Xoidc5zZdyrTtPzwTemWFXGICQUHxGsiUggCuXIPguNbO_hzhqdNbtjXzAU3j8_1xEHGAcNqlEXmGctJbtnQdknkFdtRW-yoK8dtDPrhSbD4t6eMJKospb-axNHI1f7rA"; // Keep empty to force redirect in development
  console.log("🔧 Development token is empty - will redirect to login");
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
    return "Employee"; // Default role
  }

  if (allowedActions.includes("STR-R-ADM")) {
    return "Admin";
  } else if (allowedActions.includes("STR-R-EMP")) {
    return "Employee";
  } else {
    return "Employee"; // Default role if none of the specific roles are found
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