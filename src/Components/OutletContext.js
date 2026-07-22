import React, { createContext, useContext, useState, useEffect } from "react";
import apiRequest from "./apiRequest";

const OutletContext = createContext();

export const OutletProvider = ({ children }) => {
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(() => {
    try {
      const stored = localStorage.getItem("store_outlet");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`${StoreTrustbaseurl}outlets/list/`, "GET");
      const outletList = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setOutlets(outletList);

      let userPermittedCodes = [];
      try {
        const payloadStr = localStorage.getItem("user_payload");
        if (payloadStr) {
          const payload = JSON.parse(payloadStr);
          const actions = payload["allowed-actions"] || [];
          const outletsArr = payload["allowed-outlets"] || [];
          userPermittedCodes = [...actions, ...outletsArr].filter(
            (code) => typeof code === "string" && code.startsWith("OLET")
          );
        }
      } catch (e) {
        userPermittedCodes = [];
      }

      const role = localStorage.getItem("role") || "";

      let savedCode = null;
      try {
        const stored = localStorage.getItem("store_outlet");
        if (stored) {
          const parsed = JSON.parse(stored);
          savedCode = parsed?.outlet_code;
        }
      } catch (e) {}

      let targetOutlet = null;

      if (savedCode) {
        const match = outletList.find((o) => o.outlet_code === savedCode);
        if (match) {
          if (role === "Admin" || userPermittedCodes.length === 0 || userPermittedCodes.includes(savedCode)) {
            targetOutlet = match;
          }
        }
      }

      if (!targetOutlet && role !== "Admin" && userPermittedCodes.length > 0) {
        targetOutlet = outletList.find((o) => userPermittedCodes.includes(o.outlet_code));
      }

      if (!targetOutlet && outletList.length > 0) {
        targetOutlet = outletList[0];
      }

      if (targetOutlet) {
        changeOutlet(targetOutlet);
      }
    } catch (err) {
      console.error("Error fetching outlets:", err);
    } finally {
      setLoading(false);
    }
  };

  const changeOutlet = (outlet) => {
    setSelectedOutlet(outlet);
    try {
      if (outlet) {
        localStorage.setItem("store_outlet", JSON.stringify(outlet));
      } else {
        localStorage.removeItem("store_outlet");
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  return (
    <OutletContext.Provider
      value={{
        outlets,
        selectedOutlet,
        changeOutlet,
        loading,
        fetchOutlets,
      }}
    >
      {children}
    </OutletContext.Provider>
  );
};

export const useOutlet = () => {
  const context = useContext(OutletContext);
  if (!context) {
    throw new Error("useOutlet must be used within an OutletProvider");
  }
  return context;
};

export default OutletContext;
