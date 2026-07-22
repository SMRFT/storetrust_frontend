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
  SignOutWrapper,
} from "./StyledComponents";

import {
  FaCaretDown,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

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

const INDENT_ROUTES = [
  "/TravellersIntent",
  "/TravellersIntentApproval",
];

const GRN_ROUTES = [
  "/GRNGeneration",
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
  const [isIndentOpen, setIsIndentOpen] = useState(false);
  const [isGRNOpen, setIsGRNOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [allowedActions, setAllowedActions] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ── Derive active states from current path ──────────────────────────────
  const isIndentActive = INDENT_ROUTES.includes(location.pathname);
  const isGRNActive = GRN_ROUTES.includes(location.pathname);
  const isInventoryActive = INVENTORY_ROUTES.includes(location.pathname);

  // ── Role init + default redirect ───────────────────────────────────────
  useEffect(() => {
    const role = localStorage.getItem("role") || "Employee";
    setUserRole(role);

    try {
      const userPayloadStr = localStorage.getItem("user_payload");
      if (userPayloadStr) {
        const payload = JSON.parse(userPayloadStr);
        const actions = payload["allowed-actions"] || [];
        const outletsArr = payload["allowed-outlets"] || [];
        setAllowedActions([...actions, ...outletsArr]);
      }
    } catch (e) {
      setAllowedActions([]);
    }

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
    if (isIndentActive) setIsIndentOpen(true);
    if (isGRNActive) setIsGRNOpen(true);
    if (isInventoryActive) setIsInventoryOpen(true);
  }, [isIndentActive, isGRNActive, isInventoryActive]);

  // ── Menu renderers ─────────────────────────────────────────────────────
  const IndentDropdown = ({ links }) => (
    <SidebarItem>
      <DropdownButton
        onClick={() => setIsIndentOpen((v) => !v)}
        active={isIndentActive}
      >
        <FaClipboardList />
        <span style={{ flex: 1 }}>Indent Management</span>
        <DropdownIcon open={isIndentOpen}>
          <FaCaretDown />
        </DropdownIcon>
      </DropdownButton>
      {isIndentOpen && (
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

  const GRNDropdown = ({ links }) => (
    <SidebarItem>
      <DropdownButton
        onClick={() => setIsGRNOpen((v) => !v)}
        active={isGRNActive}
      >
        <FaClipboardList />
        <span style={{ flex: 1 }}>GRN Management</span>
        <DropdownIcon open={isGRNOpen}>
          <FaCaretDown />
        </DropdownIcon>
      </DropdownButton>
      {isGRNOpen && (
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
            <IndentDropdown
              links={[
                { to: "/TravellersIntent", label: "Indent" },
                {
                  to: "/TravellersIntentApproval",
                  label: "Indent Approval",
                },
              ]}
            />
            <GRNDropdown
              links={[
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
            <IndentDropdown
              links={[
                {
                  to: "/TravellersIntentApproval",
                  label: "Indent Approval",
                },
              ]}
            />
            <GRNDropdown
              links={[
                { to: "/GRNGeneration", label: "GRN Generation" },
                { to: "/TravellersINGRNReport", label: "GRN Report" },
              ]}
            />
            <InventoryDropdown />
          </>
        );

      case "Accounts":
        return (
          <GRNDropdown
            links={[{ to: "/TravellersINGRNReport", label: "GRN Report" }]}
          />
        );

      case "Employee":
      default: {
        const hasPermission =
          userRole === "Employee" ||
          allowedActions.length === 0 ||
          allowedActions.some(
            (a) => typeof a === "string" && (a.startsWith("OLET") || a.includes("EMP") || a.includes("INTENT") || a.includes("STR"))
          );

        if (!hasPermission) return null;

        return (
          <IndentDropdown
            links={[{ to: "/TravellersIntent", label: "Indent" }]}
          />
        );
      }
    }
  };

  // ── Sign out handler ───────────────────────────────────────────────────
  const handleSignOut = () => {
    setMobileOpen(false);
    window.location.href = "/Secure";
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

        {/* ── Exit ───────────────────────────────────────────────────── */}
        <SignOutWrapper>
          <SidebarNavLink to="#" onClick={handleSignOut}>
            <FaSignOutAlt />
            Exit
          </SidebarNavLink>
        </SignOutWrapper>
      </SidebarContainer>

      {/* ── Main content area (shifts right on desktop) ─────────────────── */}
      {children && <MainContent>{children}</MainContent>}
    </>
  );
};

export default Sidebar;
