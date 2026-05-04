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
  const dev_token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDAwMiIsImVtYWlsIjoibmFqbWFzbXJmdEBnbWFpbC5jb20iLCJuYW1lIjoiTmFqbWEgQi4sIE1TLiwgRE5CLiwiLCJhbGxvd2VkLWFjdGlvbnMiOlsiSE1TLVAtRFJNLVJXIiwiSE1TLVAtSVAtUlciLCJITVMtUC1CVC1SVyIsIlNULVAtTlRGLVJXIiwiSE1TLVAtVklOUi1SVyIsIkhNUy1QLVNVTS1SIiwiU1QtQVBJLUFNQy1SVyIsIlNULVAtQ01ULVIiLCJITVMtUC1PVE0tUiIsIlNUUi1BUEktVElOLVJXIiwiSE1TLVAtVkktUiIsIkhNUy1QLUlQS0ctUlciLCJITVMtUC1BTS1SVyIsIkhNUy1BUEktREFTSC1SVyIsIkhNUy1QLUNULVIiLCJITVMtUC1JUEtHLVIiLCJTVC1BUEktVFJMUi1SVyIsIkhNUy1QLUlQRS1SVyIsIkhNUy1QLVNVTS1SVyIsIkhNUy1QLUJURS1SVyIsIkhNUy1QLVJFRy1SVyIsIkhNUy1QLVVTRy1SIiwiSE1TLVAtT1RNQkUtUlciLCJITVMtUC1VU0ctUlciLCJTVFItQVBJLVRSTFItUiIsIkhNUy1QLUJURC1SVyIsIlNULVAtREVTLVJXIiwiU1RSLUFQSS1WTC1SVyIsIkhNUy1QLVZJTi1SVyIsIkhNUy1QLU9UU1MtUiIsIkhNUy1QLUItUlciLCJITVMtUC1JQi1SVyIsIkhNUy1QLVZWLVJXIiwiSE1TLVAtQ1RFLVJXIiwiSE1TLVAtSU1SSS1SVyIsIkhNUy1QLU1SSS1SIiwiSE1TLVAtSVAtUiIsIkhNUy1BUEktVUhJRC1SIiwiSE1TLVAtWFJBWS1SIiwiU1RSLUFQSS1UUkwtUiIsIkhNUy1QLU1SSUEtUlciLCJTVFItUi1BIiwiSE1TLVAtSVhSQVktUlciLCJITVMtUC1WVkUtUlciLCJTVC1BUEktQlJELVJXIiwiSE1TLVAtUlNIRlQiLCJITVMtUC1CVC1SIiwiU1QtQVBJLUVNUC1SIiwiSE1TLVAtVlYtUiIsIkhNUy1QLUlDVC1SVyIsIkhNUy1QLUNULVJXIiwiSE1TLVAtVVNHRS1SVyIsIlNUUi1QLVRJTlItUlciLCJITVMtUC1WSU5BLVJXIiwiSE1TLVAtREJVRFItUiIsIlNULVAtVERMLVJXIiwiSE1TLVAtU1VNRS1SVyIsIkhNUy1QLVZWRC1SVyIsIlNULVItQSIsIkhNUy1QLU9UTS1SVyIsIkhNUy1QLVhSQVlFLVJXIiwiSE1TLVAtVklOUi1SIiwiU1RSLUFQSS1JTC1SVyIsIkhNUy1QLVZJTkUtUlciLCJITVMtUC1VU0dBLVJXIiwiSE1TLVAtSVVTRy1SVyIsIkhNUy1QLUhNUyIsIkhNUy1QLU1SSS1SVyIsIkhNUy1QLURMRC1SVyIsIkhNUy1QLUNURC1SVyIsIlNUUi1BUEktVkwtUiIsIlNULVAtQ01ULVJXIiwiSE1TLVAtU0lERUJBUiIsIkhNUy1QLUFETS1SVyIsIkhNUy1QLVZJLVJXIiwiU1QtUC1CUkQtUiIsIlNULVAtTlRGLVIiLCJITVMtUC1WSU4tUiIsIkhNUy1QLU1SSUQtUlciLCJTVC1QLURFUy1SIiwiU1QtUC1TTk8tUlciLCJTVFItUC1JQ1MtUiIsIkhNUy1QLUFNRC1SVyIsIkhNUy1QLUlCRC1SVyIsIkhNUy1QLUFNLVIiLCJTVFItQVBJLVRJTi1SIiwiU1RSLUFQSS1JTCIsIkhNUy1QLVhSQVlELVJXIiwiSE1TLVAtT1RNRS1SVyIsIkhNUy1QLUlCRS1SVyIsIkhNUy1QLVZJRC1SVyIsIlNUUi1BUEktVFJMLVJXIiwiSE1TLVAtSVBELVJXIiwiSE1TLVAtWFJBWS1SVyIsIkhNUy1QLUlQS0dFLVJXIiwiSE1TLVAtVklFLVJXIiwiSE1TLVAtT1RTUy1SVyIsIkhNUy1QLVdSIiwiSE1TLVAtT1RTU0QtUlciLCJTVC1BUEktQ1JELVJXIiwiU1RSLUFQSS1JTC1SIiwiU1QtUC1UREwtUiIsIkhNUy1QLUhNU0lOUyIsIkhNUy1BUEktRExELVIiLCJTVFItUC1USU5SLVIiLCJITVMtUC1WSU5ELVJXIl0sImFsbG93ZWQtZGF0YSI6WyJTSEIwMDEiLCJTSEIwMDIiXSwiaG9zcGl0YWxfY29kZSI6IlNIMDAxIiwiaG1zX3BhZ2VzIjpbMSwyLDMsNSwxMCwxMSwxMiwxMywyMCwyMSwyMiwyMywyNCwyNSw0MCw0MSw0Miw0NSw0Niw0Nyw0OCw0OV0sImFsbG93ZWQtb3V0bGV0cyI6WyJPTEVUMDAzIiwiT0xFVDAwNSJdLCJpc3MiOiJodHRwczovL2xhYi5zaGlub3ZhLmluLyIsImlhdCI6MTc3Nzg4OTIxOCwiZXhwIjoxNzc3OTc2MjE4fQ.DDMlJhUeXxQvxM8URmj0POpm4UgcR4k4U5bPNgeV9TQrZTJnXZDAiaF0ovkfl0GkroUAUupTrh281rAvT9jv0rNxq-aKw9nxS0mRN93C4hxg0e5sNJiiywhgcP-kFWh6OVAbjhCzvU21QytbJkr_LDrY3DGzmq8_OWVkInOCsEZIibpGrtth2IkxWFwPy9bcU55MVkcOE19ujvgj1PuiRLltLW8mdG4iENfAwOd4I9UpZLvCl_gwtuV3WOprEA7Vs2eQbTrVSFFgt9htIrdAm4ZRW3q3vpje340O09mt_2muXsAAcQV_H_KSUbK0nHi38kHRjSJBq6eTNVpsUz8KOw";
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
