"use client";
import { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCaretDown,
  FaClipboardList,
} from "react-icons/fa";

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const SidebarContainer = styled.div`
  height: 100vh;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom, #4ED7F1, #6FE6FC, #A8F1FF, #FFFA8D);
  padding: 2rem 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 100;
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
  }
`;

const Logo = styled.div`
  padding: 0 1.5rem 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  h1 {
    font-family: "Baloo Tamma 2", cursive;
    font-size: 1.5rem;
    color: #333;
    margin: 0;
  }
`;

const SidebarMenu = styled.ul`
  list-style-type: none;
  padding: 0 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SidebarItem = styled.li`
  position: relative;
`;

const SidebarNavLink = styled(NavLink)`
  color: #333;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1rem;
  font-family: "Baloo Tamma 2", cursive;
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;

  svg {
    margin-right: 12px;
    font-size: 1.2rem;
    color: #007e91; /* dark aqua */
  }

  &:hover {
    background-color: rgba(255, 250, 141, 0.3); /* light yellow glow */
    transform: translateX(5px);
  }

  &.active {
    background-color: #FFFA8D;
    color: #000;
    font-weight: 600;

    svg {
      color: #000;
    }

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background-color: #007e91;
      border-radius: 0 4px 4px 0;
    }
  }
`;

const DropdownButton = styled.div`
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  font-family: "Baloo Tamma 2", cursive;
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  svg:first-child {
    margin-right: 12px;
    font-size: 1.2rem;
    color: #007e91;
  }

  &:hover {
    background-color: rgba(255, 250, 141, 0.3);
    transform: translateX(5px);
  }

  ${(props) =>
    props.active &&
    css`
      background-color: #FFFA8D;
      color: #000;
      font-weight: 600;

      svg {
        color: #000;
      }

      &::before {
        background-color: #007e91;
      }
    `}
`;

const DropdownIcon = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  ${(props) =>
    props.open &&
    css`
      transform: rotate(180deg);
    `}
`;

const SubMenu = styled.div`
  margin-top: 0.5rem;
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  animation: ${fadeIn} 0.3s ease forwards;
`;

const SubLink = styled(NavLink)`
  color: #333;
  padding: 0.7rem 1rem 0.7rem 2.5rem;
  font-size: 0.95rem;
  font-family: "Baloo Tamma 2", cursive;
  text-decoration: none;
  display: block;
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #007e91;
    opacity: 0.7;
  }

  &:hover {
    background-color: rgba(255, 250, 141, 0.3);
    transform: translateX(5px);
  }

  &.active {
    background-color: #FFFA8D;
    color: #000;
    font-weight: 600;

    &::before {
      background-color: #000;
      opacity: 1;
    }
  }
`;

const Sidebar = () => {
  const [isTravellersDropdown, setIsTravellersDropdown] = useState(false);
  const [userRole, setUserRole] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get user role from localStorage and handle initial navigation
  useEffect(() => {
    const role = localStorage.getItem("role") || "Employee"; // Default to Employee
    setUserRole(role);
    console.log("User role from localStorage:", role);

    // Redirect user to appropriate default route based on role if they're on root
    if (location.pathname === "/") {
      const defaultRoute = role === "Admin" ? "/TravellersIN" : "/TravellersIntent";
      navigate(defaultRoute, { replace: true });
    }
  }, [location.pathname, navigate]);

  // Redirect if user tries to access unauthorized route
  useEffect(() => {
    if (userRole) {
      const hasAccess = checkRouteAccess(location.pathname, userRole);
      if (!hasAccess) {
        const defaultRoute = userRole === "Admin" ? "/TravellersIN" : "/TravellersIntent";
        navigate(defaultRoute, { replace: true });
      }
    }
  }, [location.pathname, userRole, navigate]);

  // Function to check if user has access to a route
  const checkRouteAccess = (route, role) => {
    switch (role) {
      case "Admin":
        return ["/TravellersIN", "/TravellersIntent"].includes(route);
      case "Employee":
        return ["/TravellersIntent"].includes(route);
      default:
        return ["/TravellersIntent"].includes(route);
    }
  };

  const toggleTravellers = () => {
    setIsTravellersDropdown(!isTravellersDropdown);
  };

  // Check if any travellers route is active
  const isTravellersActive =
    location.pathname === "/TravellersIN" ||
    location.pathname === "/TravellersIntent";

  // Function to render menu items based on user role
  const renderMenuItems = () => {
    switch (userRole) {
      case "Admin":
        return (
          <>
            {/* Travellers */}
            <SidebarItem>
              <DropdownButton
                onClick={toggleTravellers}
                active={isTravellersActive}
              >
                <FaClipboardList />
                <span>Travellers</span>
                <DropdownIcon open={isTravellersDropdown}>
                  <FaCaretDown />
                </DropdownIcon>
              </DropdownButton>
              {isTravellersDropdown && (
                <SubMenu>
                  <SubLink to="/TravellersIntent">
                    <span>Travellers Intent</span>
                  </SubLink>
                  <SubLink to="/TravellersIN">
                    <span>Travellers IN</span>
                  </SubLink>
                </SubMenu>
              )}
            </SidebarItem>
          </>
        );

      case "Employee":
        return (
          <>
            {/* Travellers Intent (Employee only) */}
            <SidebarItem>
              <SidebarNavLink to="/TravellersIntent">
                <FaClipboardList />
                Travellers Intent
              </SidebarNavLink>
            </SidebarItem>
          </>
        );

      default:
        // Default case - show Employee menu
        return (
          <>
            <SidebarItem>
              <SidebarNavLink to="/TravellersIntent">
                <FaClipboardList />
                Travellers Intent
              </SidebarNavLink>
            </SidebarItem>
          </>
        );
    }
  };

  return (
    <SidebarContainer>
      <Logo>
        <h1>TMC Stock</h1>
      </Logo>
      <SidebarMenu>{renderMenuItems()}</SidebarMenu>
    </SidebarContainer>
  );
};

export default Sidebar;