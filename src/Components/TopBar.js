import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import OutletSelector from "./OutletSelector";
import Notifications from "./Notifications";
import { useOutlet } from "./OutletContext";
import { ShieldCheck } from "lucide-react";

const primaryColor = "#662549";

const TopBarContainer = styled.header`
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(102, 37, 73, 0.1);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 800;
  box-shadow: 0 2px 12px rgba(102, 37, 73, 0.05);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PageTitle = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${primaryColor};
  letter-spacing: -0.2px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fcefee;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid rgba(179, 84, 120, 0.2);
`;

const UserRoleText = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${primaryColor};
  text-transform: capitalize;
`;

const TopBar = () => {
  const location = useLocation();
  const { selectedOutlet } = useOutlet();
  const [role, setRole] = useState("Employee");

  useEffect(() => {
    const savedRole = localStorage.getItem("role") || "Employee";
    setRole(savedRole);
  }, []);

  const isAdmin = role.toLowerCase() === "admin";
  const outletName = selectedOutlet?.outlet_name || "Outlet";

  const getDynamicTitle = (pathname) => {
    switch (pathname) {
      case "/GRNGeneration":
        return `${outletName} GRN Generation`;
      case "/TravellersIntent":
        return `${outletName} Indent`;
      case "/TravellersIntentApproval":
        return `${outletName} Indent Approval`;
      case "/TravellersINGRNReport":
        return `${outletName} GRN Report`;
      case "/LowStockList":
        return `${outletName} Low Stock List`;
      case "/ItemManagement":
        return "Item Management";
      case "/VendorManagement":
        return "Vendor Management";
      case "/AddItems":
        return "Add Items";
      case "/AddVendor":
        return "Add Vendor";
      default:
        return "Dashboard";
    }
  };

  const currentTitle = getDynamicTitle(location.pathname);

  return (
    <TopBarContainer>
      <LeftSection>
        <PageTitle>{currentTitle}</PageTitle>
      </LeftSection>

      <RightSection>
        {isAdmin && (
          <>
            <OutletSelector />
            <Notifications />
          </>
        )}
        <UserBadge>
          <ShieldCheck size={16} color={primaryColor} />
          <UserRoleText>{role}</UserRoleText>
        </UserBadge>
      </RightSection>
    </TopBarContainer>
  );
};

export default TopBar;
