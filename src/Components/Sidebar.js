"use client";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SidebarContainer,
  SidebarMenu,
  SidebarItem,
  SidebarNavLink,
  DropdownButton,
  DropdownIcon,
  SubMenu,
  SubLink,
  Logo,
} from "./StyledComponents";

import { FaCaretDown, FaClipboardList } from "react-icons/fa";

const Sidebar = () => {
  const [isTravellersDropdown, setIsTravellersDropdown] = useState(false);
  const [isCollegeDropdown, setIsCollegeDropdown] = useState(false);
  const [isMessDropdown, setIsMessDropdown] = useState(false);
   const [isInventoryDropdown, setIsInventoryDropdown] = useState(false);
  const [userRole, setUserRole] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get user role from localStorage and handle initial navigation
  useEffect(() => {
    const role = localStorage.getItem("role") || "Admin"; // Default to Employee
    setUserRole(role);
    // console.log("User role from localStorage:", role);

    // Redirect user to appropriate default route based on role if they're on root
    if (location.pathname === "/") {
      const defaultRoute = role === "Admin" ? "/GRNGeneration" : "/TravellersIntent";
      navigate(defaultRoute, { replace: true });
    }
  }, [location.pathname, navigate]);

  // Redirect if user tries to access unauthorized route
  useEffect(() => {
    if (userRole) {
      const hasAccess = checkRouteAccess(location.pathname, userRole);
      if (!hasAccess) {
        const defaultRoute = userRole === "Admin" ? "/GRNGeneration" : "/TravellersIntent";
        navigate(defaultRoute, { replace: true });
      }
    }
  }, [location.pathname, userRole, navigate]);

  // Function to check if user has access to a route
  const checkRouteAccess = (route, role) => {
    switch (role) {
      case "Admin":
        return ["/GRNGeneration", "/TravellersIntent","/TravellersIntentReport","/TravellersINGRNReport","/AddItems","/AddVendor",          "/ItemManagement",
          "/VendorManagement","/CollegeIN","/CollegeIntentReport","/CollegeIntent","/CollegeGRNReport","/MessIN","/MessIntentReport","/MessIntent","/MessGRNReport"].includes(route);
      case "Store Manager":
        return ["/TravellersIntent"].includes(route);
      case "Employee":
        return ["/TravellersIntent"].includes(route);
      default:
        return ["/TravellersIntent"].includes(route);
    }
  };

  const toggleTravellers = () => {
    setIsTravellersDropdown(!isTravellersDropdown);
  };
   const toggleInventory = () => setIsInventoryDropdown(!isInventoryDropdown);
   const isTravellersActive =
    location.pathname === "/GRNGeneration" ||
    location.pathname === "/TravellersIntent" ||
    location.pathname === "/TravellersIntentReport" ||
    location.pathname === "/TravellersINGRNReport";

  const toggleCollege = () => {
    setIsCollegeDropdown(!isCollegeDropdown);
  };
   const isCollegeActive =
    location.pathname === "/CollegeIN" ||
    location.pathname === "/CollegeIntent" ||
    location.pathname === "/CollegeIntentReport"||
    location.pathname === "/CollegeGRNReport";

  const toggleMess = () => {
    setIsMessDropdown(!isMessDropdown);
  };
   const isMessActive =
    location.pathname === "/,MessIN" ||
    location.pathname === "/MessIntent" ||
    location.pathname === "/MessIntentReport"||
    location.pathname === "/MessGRNReport";
  // Check if any travellers route is active
   const isInventoryActive =
    location.pathname === "/ItemManagement" ||
    location.pathname === "/VendorManagement";

  // Function to render menu items based on user role
  const renderMenuItems = () => {
    switch (userRole) {
      case "Admin":
        return (
          <>
            
            <SidebarItem>
              {/* Travellers */}
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
                  <SubLink to="/TravellersIntentReport">
                    <span>Travellers Intent Report</span>
                  </SubLink>
                  <SubLink to="/GRNGeneration">
                    <span>GRN Generation</span>
                  </SubLink>                  
                 <SubLink to="/TravellersINGRNReport">
                    <span>GRN Report</span>
                  </SubLink>
                </SubMenu>
              )}
              {/* College */}
              {/* <DropdownButton
                onClick={toggleCollege}
                active={isCollegeActive}
              >
                <FaClipboardList />
                <span>College</span>
                <DropdownIcon open={isCollegeDropdown}>
                  <FaCaretDown />
                </DropdownIcon>
              </DropdownButton>
              {isCollegeDropdown && (
                <SubMenu>
                  <SubLink to="/CollegeIntent">
                    <span>College Intent</span>
                  </SubLink>
                   <SubLink to="/CollegeIntentReport">
                    <span>College Intent Report</span>
                  </SubLink>
                  <SubLink to="/CollegeIN">
                    <span>College IN</span>
                  </SubLink>  
                 <SubLink to="/CollegeGRNReport">
                    <span>GRN Report</span>
                  </SubLink>               
                </SubMenu>
              )} */}
              {/* Mess */}
              {/* <DropdownButton
                onClick={toggleMess}
                active={isMessActive}
              >
                <FaClipboardList />
                <span>Mess</span>
                <DropdownIcon open={isMessDropdown}>
                  <FaCaretDown />
                </DropdownIcon>
              </DropdownButton>
              {isMessDropdown && (
                <SubMenu>
                  <SubLink to="/MessIntent">
                    <span>Mess Intent</span>
                  </SubLink>                 
                  <SubLink to="/MessIntentReport">
                    <span>Mess Intent Report</span>
                  </SubLink>
                   <SubLink to="/MessIN">
                    <span>Mess IN</span>
                  </SubLink>
                  <SubLink to="/MessGRNReport">
                    <span>GRN Report</span>
                  </SubLink>
                </SubMenu>
              )}
               */}
              {/* Inventory Management */}
              <DropdownButton
                onClick={toggleInventory}
                active={isInventoryActive}
              >
                <FaClipboardList />
                <span>Inventory Management</span>
                <DropdownIcon open={isInventoryDropdown}>
                  <FaCaretDown />
                </DropdownIcon>
              </DropdownButton>
              {isInventoryDropdown && (
                <SubMenu>
                  <SubLink to="/ItemManagement">
                    <span>Item Management</span>
                  </SubLink>
                  <SubLink to="/VendorManagement">
                    <span>Vendor Management</span>
                  </SubLink>
                </SubMenu>
              )}
            </SidebarItem>
          </>
        );

      case "Store Manager":
        return (
          <>
            
            <SidebarItem>
              {/* Travellers */}
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
                  <SubLink to="/GRNGeneration">
                    <span>GRN Generation</span>
                  </SubLink>
                  <SubLink to="/TravellersIntentReport">
                    <span>Travellers Intent Report</span>
                  </SubLink>
                 <SubLink to="/TravellersINGRNReport">
                    <span>GRN Report</span>
                  </SubLink>
                </SubMenu>
              )}
              {/* College */}
              {/* <DropdownButton
                onClick={toggleCollege}
                active={isCollegeActive}
              >
                <FaClipboardList />
                <span>College</span>
                <DropdownIcon open={isCollegeDropdown}>
                  <FaCaretDown />
                </DropdownIcon>
              </DropdownButton>
              {isCollegeDropdown && (
                <SubMenu>
                  <SubLink to="/CollegeIntent">
                    <span>College Intent</span>
                  </SubLink>
                   <SubLink to="/CollegeIntentReport">
                    <span>College Intent Report</span>
                  </SubLink>
                  <SubLink to="/CollegeIN">
                    <span>College IN</span>
                  </SubLink>  
                 <SubLink to="/CollegeGRNReport">
                    <span>GRN Report</span>
                  </SubLink>               
                </SubMenu>
              )} */}
              {/* Mess */}
              {/* <DropdownButton
                onClick={toggleMess}
                active={isMessActive}
              >
                <FaClipboardList />
                <span>Mess</span>
                <DropdownIcon open={isMessDropdown}>
                  <FaCaretDown />
                </DropdownIcon>
              </DropdownButton>
              {isMessDropdown && (
                <SubMenu>
                  <SubLink to="/MessIntent">
                    <span>Mess Intent</span>
                  </SubLink>                 
                  <SubLink to="/MessIntentReport">
                    <span>Mess Intent Report</span>
                  </SubLink>
                   <SubLink to="/MessIN">
                    <span>Mess IN</span>
                  </SubLink>
                  <SubLink to="/MessGRNReport">
                    <span>GRN Report</span>
                  </SubLink>
                </SubMenu>
              )} */}
              
              {/* Inventory Management */}
              <DropdownButton
                onClick={toggleInventory}
                active={isInventoryActive}
              >
                <FaClipboardList />
                <span>Inventory Management</span>
                <DropdownIcon open={isInventoryDropdown}>
                  <FaCaretDown />
                </DropdownIcon>
              </DropdownButton>
              {isInventoryDropdown && (
                <SubMenu>
                  <SubLink to="/ItemManagement">
                    <span>Item Management</span>
                  </SubLink>
                  <SubLink to="/VendorManagement">
                    <span>Vendor Management</span>
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