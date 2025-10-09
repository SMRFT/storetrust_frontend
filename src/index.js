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
  const dev_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI1MDg4NyIsImVtYWlsIjoic2l2YXN1bmRhcmlzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiU2l2YXN1bmRhcmkiLCJhbGxvd2VkLWFjdGlvbnMiOlsiU0lOLUFQSS1GVS1SVyIsIkVSLVAtRVJQLVIiLCJTRC1QLURGLVIiLCJTVC1QLUNNVC1SVyIsIlNJTi1QLUlDRS1SIiwiU0QtUC1QRC1SIiwiRVItUC1FUlJFLVJXIiwiU0lOLUFQSS1PUi1SVyIsIlNULVAtQ01ULVIiLCJFUi1QLUVSUkVHLVJXIiwiU0QtUC1CVEQtUiIsIlNELVAtUE9WLVJXIiwiU0QtQVBJLU9BUi1SIiwiU0QtUC1TU1UtUlciLCJFUi1QLUVSTkJOLVIiLCJFUi1QLUVSRC1SIiwiU0QtUC1TUy1SIiwiU0QtUC1QT1YtUiIsIlNULVAtQlJELVIiLCJTSU4tQVBJLUlGLVIiLCJTVC1QLVRETC1SVyIsIlNELUFQSS1UVi1SIiwiU0QtUC1URC1SVyIsIlNULVAtREVTLVJXIiwiU1QtUi1BIiwiU0QtUi1BIiwiU0lOLUFQSS1TRi1SIiwiU0QtQVBJLVJCLVIiLCJFUi1QLUVSUi1SVyIsIlNULVAtREVTLVIiLCJTSU4tQVBJLUlGLVJXIiwiU1QtQVBJLUVNUC1SIiwiU1QtUC1OVEYtUlciLCJTRC1QLVRELVIiLCJTVFItUi1BIiwiU0QtUC1NSVMtUiIsIkVSLVItRVJOIiwiU0QtUC1HUEQtUiIsIlNUUi1QLUNMRyIsIlNELUFQSS1DTi1SIiwiU1QtUC1UREwtUiIsIkVSLVAtRVJQRC1SVyIsIkVSLVAtRVJQQi1SVyIsIlNJTi1QLUdJQy1SIiwiRVItUC1FUkItUlciLCJTRC1QLUJURC1SVyIsIlNELVAtU1NVLVIiLCJTVC1BUEktQ1JELVJXIiwiU0QtUC1ERi1SVyIsIlNULVAtTlRGLVIiLCJTVFItUC1NRVMiLCJTVFItUC1UUkwtUiIsIlNELVAtUEwtUiIsIlNELVAtQkctUiIsIlNUUi1QLVRSTC1SVyIsIlNULUFQSS1CUkQtUlciLCJTVFItQVBJLVRJTi1SVyIsIlNULUFQSS1BTUMtUlciLCJTRC1QLVNTLVJXIiwiU1QtUC1TTk8tUlciLCJTVFItQVBJLVRJTi1SIiwiU0QtQVBJLVRELVIiXSwiYWxsb3dlZC1kYXRhIjpbIlNIQjAwMSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc1OTk4ODUwOCwiZXhwIjoxNzYwMDc1NTA4LCJqdGkiOiI4MzAwNTk5Ny01Yjg5LTQ2MzItYjkyMS1iZmFkOWVmNGRhMWQifQ.O3usrDpZg-uLy5jz1LdFH0jyVhg0dEjfkAM5pN_yvczHyytdPFgmNmE_w-UxwmOwwzw6wHHmgTxgIDV9qaKpT9rSVys4Jd1vDqfKiZDj51N2PJZ0UVx1jVtAplLK-7JbRZ7GgDCP9Uol0I0pQe8RP_cZKS1RLsYJZ8AMtCbXHthY_GpL3UIvSTk5hP5iA0ihWGKo-3w9RZ27tvblaRf0u8F5aLIjYJrpX8GI7P-lLab1sQhpK0bHiY5TDF06xsWnJT4sVEFzyawScvxtVqWvfnBLwzz-wXVv3kCYa3UQpcRmogIT73xCZCbaBl5lD5r_0u5OZSRwmYQR-yZcZtBg2w";
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

  if (allowedActions.includes("STR-R-A")) {
    return "Admin";
  } else if (allowedActions.includes("STR-R-EMP")) {
    return "Employee";
  } 
  else if (allowedActions.includes("STR-R-SM")) {
    return "Store Manager";
  }else {
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