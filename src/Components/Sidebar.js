"use client";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SidebarContainer,
  SidebarOverlay,
  MobileMenuToggle,
  SidebarMenu,
  SidebarItem,
  SidebarNavLink,
  DropdownButton,
  DropdownIcon,
  SubMenu,
  SubLink,
  Logo,
  MainContent,
} from "./StyledComponents";

import { FaCaretDown, FaClipboardList, FaBars, FaTimes } from "react-icons/fa";

// ─────────────────────────────────────────────────────────────────────────────
// Role → accessible routes map
// ─────────────────────────────────────────────────────────────────────────────
const ROLE_ROUTES = {
  Admin: [
    "/GRNGeneration",
    "/TravellersIntent",
    "/TravellersIntentApproval",
    "/TravellersINGRNReport",
    "/LowStockList",
    "/AddItems",
    "/AddVendor",
    "/ItemManagement",
    "/VendorManagement",
  ],
  "Store Manager": [
    "/GRNGeneration",
    "/TravellersIntentApproval",
    "/TravellersINGRNReport",
    "/LowStockList",
    "/ItemManagement",
    "/VendorManagement",
  ],
  Accounts: ["/TravellersINGRNReport"],
  Employee: ["/TravellersIntent"],
};

const ROLE_DEFAULTS = {
  Admin: "/TravellersINGRNReport",
  "Store Manager": "/GRNGeneration",
  Accounts: "/TravellersINGRNReport",
  Employee: "/TravellersIntent",
};

const TRAVELLERS_ROUTES = [
  "/GRNGeneration",
  "/TravellersIntent",
  "/TravellersIntentApproval",
  "/TravellersINGRNReport",
];

const INVENTORY_ROUTES = [
  "/ItemManagement",
  "/VendorManagement",
  "/LowStockList",
];

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar Component
// ─────────────────────────────────────────────────────────────────────────────
const Sidebar = ({ children }) => {
  const [isTravellersOpen, setIsTravellersOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ── Derive active states from current path ──────────────────────────────
  const isTravellersActive = TRAVELLERS_ROUTES.includes(location.pathname);
  const isInventoryActive = INVENTORY_ROUTES.includes(location.pathname);

  // ── Role init + default redirect ───────────────────────────────────────
  useEffect(() => {
    const role = localStorage.getItem("role") || "Employee";
    setUserRole(role);

    if (location.pathname === "/") {
      navigate(ROLE_DEFAULTS[role] ?? "/TravellersIntent", { replace: true });
    }
  }, []); // run once on mount

  // ── Guard: redirect to default if accessing unauthorized route ──────────
  useEffect(() => {
    if (!userRole || location.pathname === "/") return;
    const allowed = ROLE_ROUTES[userRole] ?? ROLE_ROUTES.Employee;
    if (!allowed.includes(location.pathname)) {
      navigate(ROLE_DEFAULTS[userRole] ?? "/TravellersIntent", {
        replace: true,
      });
    }
  }, [location.pathname, userRole, navigate]);

  // ── Close mobile sidebar on route change ───────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ── Auto-open dropdowns if a child route is active ─────────────────────
  useEffect(() => {
    if (isTravellersActive) setIsTravellersOpen(true);
    if (isInventoryActive) setIsInventoryOpen(true);
  }, [isTravellersActive, isInventoryActive]);

  // ── Menu renderers per role ────────────────────────────────────────────
  const TravellersDropdown = ({ links }) => (
    <SidebarItem>
      <DropdownButton
        onClick={() => setIsTravellersOpen((v) => !v)}
        active={isTravellersActive}
      >
        <FaClipboardList />
        <span style={{ flex: 1 }}>Travellers</span>
        <DropdownIcon open={isTravellersOpen}>
          <FaCaretDown />
        </DropdownIcon>
      </DropdownButton>
      {isTravellersOpen && (
        <SubMenu>
          {links.map(({ to, label }) => (
            <SubLink key={to} to={to}>
              {label}
            </SubLink>
          ))}
        </SubMenu>
      )}
    </SidebarItem>
  );

  const InventoryDropdown = () => (
    <SidebarItem>
      <DropdownButton
        onClick={() => setIsInventoryOpen((v) => !v)}
        active={isInventoryActive}
      >
        <FaClipboardList />
        <span style={{ flex: 1 }}>Inventory Management</span>
        <DropdownIcon open={isInventoryOpen}>
          <FaCaretDown />
        </DropdownIcon>
      </DropdownButton>
      {isInventoryOpen && (
        <SubMenu>
          <SubLink to="/ItemManagement">Item Management</SubLink>
          <SubLink to="/VendorManagement">Vendor Management</SubLink>
          <SubLink to="/LowStockList">Low Stock List</SubLink>
        </SubMenu>
      )}
    </SidebarItem>
  );

  const renderMenu = () => {
    switch (userRole) {
      case "Admin":
        return (
          <>
            <TravellersDropdown
              links={[
                { to: "/TravellersIntent", label: "Travellers Intent" },
                {
                  to: "/TravellersIntentApproval",
                  label: "Travellers Intent Approval",
                },
                { to: "/GRNGeneration", label: "GRN Generation" },
                { to: "/TravellersINGRNReport", label: "GRN Report" },
              ]}
            />
            <InventoryDropdown />
          </>
        );

      case "Store Manager":
        return (
          <>
            <TravellersDropdown
              links={[
                { to: "/GRNGeneration", label: "GRN Generation" },
                {
                  to: "/TravellersIntentApproval",
                  label: "Travellers Intent Approval",
                },
                { to: "/TravellersINGRNReport", label: "GRN Report" },
              ]}
            />
            <InventoryDropdown />
          </>
        );

      case "Accounts":
        return (
          <SidebarItem>
            <DropdownButton
              onClick={() => setIsTravellersOpen((v) => !v)}
              active={isTravellersActive}
            >
              <FaClipboardList />
              <span style={{ flex: 1 }}>GRN Report</span>
              <DropdownIcon open={isTravellersOpen}>
                <FaCaretDown />
              </DropdownIcon>
            </DropdownButton>
            {isTravellersOpen && (
              <SubMenu>
                <SubLink to="/TravellersINGRNReport">GRN Report</SubLink>
              </SubMenu>
            )}
          </SidebarItem>
        );

      case "Employee":
      default:
        return (
          <SidebarItem>
            <SidebarNavLink to="/TravellersIntent">
              <FaClipboardList />
              Travellers Intent
            </SidebarNavLink>
          </SidebarItem>
        );
    }
  };

  return (
    <>
      {/* ── Mobile hamburger toggle ─────────────────────────────────────── */}
      <MobileMenuToggle
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuToggle>

      {/* ── Backdrop (mobile only) ──────────────────────────────────────── */}
      <SidebarOverlay
        open={mobileOpen}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar panel ──────────────────────────────────────────────── */}
      <SidebarContainer open={mobileOpen} aria-label="Navigation">
        <Logo>
          <h1>TMC Stock</h1>
        </Logo>
        <SidebarMenu>{renderMenu()}</SidebarMenu>
      </SidebarContainer>

      {/* ── Main content area (shifts right on desktop) ─────────────────── */}
      {children && <MainContent>{children}</MainContent>}
    </>
  );
};

export default Sidebar;
