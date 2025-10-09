import React, { useState, useEffect } from 'react'; 
import { FaBell, FaTimes } from 'react-icons/fa'; 
import styled, { keyframes, css } from 'styled-components'; 
import { toast } from 'react-toastify'; 
import apiRequest from './apiRequest'; 

// Theme colors
const primaryColor = "#662549"; 
const backgroundColor = "#fcefee"; 
const textColor = "#2e1a23"; 
const accentColor = "#b35478"; 

// Keyframe animations
const ringBell = keyframes`
  0% { transform: rotate(0deg); }
  10% { transform: rotate(10deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(8deg); }
  40% { transform: rotate(-6deg); }
  50% { transform: rotate(6deg); }
  60% { transform: rotate(-4px deg); }
  70% { transform: rotate(4deg); }
  80% { transform: rotate(-2deg); }
  90% { transform: rotate(2deg); }
  100% { transform: rotate(0deg); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { 
    transform: scale(1); 
    box-shadow: 0 3px 8px rgba(179, 84, 120, 0.4); 
  }
  50% { 
    transform: scale(1.15); 
    box-shadow: 0 6px 16px rgba(179, 84, 120, 0.7); 
  }
  100% { 
    transform: scale(1); 
    box-shadow: 0 3px 8px rgba(179, 84, 120, 0.4); 
  }
`;

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-15px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// Styled components
const NotificationsWrapper = styled.div`
  position: fixed; 
  top: 20px; 
  right: 20px; 
  z-index: 1000; 
`; 
 
const BellContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const BellIcon = styled(FaBell)` 
  font-size: ${props => props.$hasNotifications ? '32px' : '28px'}; 
  background: ${props => props.$hasNotifications ? 
    `linear-gradient(45deg, ${primaryColor}, ${accentColor}, #ff6b35, #ffd23f)` : 
    `linear-gradient(45deg, ${primaryColor}, ${accentColor})`};
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer; 
  transition: all 0.3s ease; 
  ${props => props.$hasNotifications && css`
    animation: ${ringBell} 2s ease-in-out infinite, ${gradientShift} 4s ease-in-out infinite;
  `}
  ${props => !props.$hasNotifications && css`
    animation: ${gradientShift} 6s ease-in-out infinite;
  `}
  
  &:hover { 
    background: linear-gradient(45deg, ${accentColor}, ${primaryColor}, #ff6b35, #06ffa5);
    background-size: 400% 400%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transform: scale(1.2);
    filter: drop-shadow(0 0 8px ${accentColor}66);
  }
  
  &:active {
    transform: scale(0.9);
  }
`; 
 
const NotificationBadge = styled.span` 
  position: absolute; 
  top: -10px; 
  right: -10px; 
  background: linear-gradient(45deg, ${primaryColor}, ${accentColor}, #ff6b35, #ffd23f);
  background-size: 300% 300%;
  animation: ${gradientShift} 3s ease-in-out infinite, ${pulse} 2s ease-in-out infinite;
  color: white; 
  border-radius: 50%; 
  padding: 4px 8px; 
  font-size: 12px; 
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.4);
  min-width: 20px;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
`; 
 
const Dropdown = styled.div` 
  position: absolute; 
  top: 45px; 
  right: 0; 
  background: linear-gradient(135deg, ${backgroundColor}, #ffffff);
  border-radius: 12px; 
  box-shadow: 0 10px 40px rgba(102, 37, 73, 0.15), 0 0 20px rgba(179, 84, 120, 0.1); 
  width: 320px; 
  max-height: 420px; 
  overflow-y: auto; 
  display: ${props => (props.$isOpen ? 'block' : 'none')}; 
  z-index: 1000;
  ${props => props.$isOpen && css`
    animation: ${slideIn} 0.4s ease-out;
  `}
  border: 2px solid transparent;
  background-clip: padding-box;
  backdrop-filter: blur(15px);
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, ${primaryColor}, ${accentColor});
    background-size: 300% 300%;
    animation: ${gradientShift} 4s ease-in-out infinite;
    border-radius: 14px;
    z-index: -1;
  }
`; 
 
const DropdownHeader = styled.div` 
  padding: 15px 45px 15px 20px; 
  background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
  background-size: 300% 300%;
  animation: ${gradientShift} 5s ease-in-out infinite;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2); 
  font-weight: bold; 
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 4px 16px rgba(102, 37, 73, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`; 

const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateY(-50%) scale(1.1);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const CloseIcon = styled(FaTimes)`
  font-size: 14px;
`;
 
const List = styled.ul` 
  list-style-type: none; 
  padding: 0; 
  margin: 0; 
`; 
 
const ListItem = styled.li` 
  background: linear-gradient(135deg, ${backgroundColor}, rgba(255, 255, 255, 0.9));
  background-size: 300% 300%;
  animation: ${gradientShift} 6s ease-in-out infinite;
  padding: 15px; 
  margin: 10px; 
  border-radius: 10px; 
  color: ${textColor}; 
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 12px rgba(179, 84, 120, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: linear-gradient(45deg, ${primaryColor}, ${accentColor});
    background-size: 300% 300%;
    animation: ${gradientShift} 3s ease-in-out infinite;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(179, 84, 120, 0.1), ${backgroundColor});
    background-size: 400% 400%;
    transform: translateX(8px) scale(1.03);
    box-shadow: 0 8px 24px rgba(179, 84, 120, 0.4);
    border-color: rgba(179, 84, 120, 0.3);
  }
`; 
 
const NoNotifications = styled.p` 
  padding: 25px; 
  margin: 10px; 
  color: ${textColor}; 
  text-align: center;
  font-style: italic;
  font-weight: 500;
  background: linear-gradient(135deg, ${backgroundColor}, rgba(179, 84, 120, 0.1));
  background-size: 300% 300%;
  animation: ${gradientShift} 8s ease-in-out infinite;
  border-radius: 8px;
  border: 2px solid rgba(179, 84, 120, 0.2);
  backdrop-filter: blur(5px);
`; 

const LoadingWrapper = styled.div`
  color: ${textColor};
  font-size: 14px;
  padding: 8px 15px;
  background: linear-gradient(135deg, ${backgroundColor}, rgba(255, 255, 255, 0.9));
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(102, 37, 73, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(179, 84, 120, 0.3);
`;
 
const Notifications = () => { 
  const [notifications, setNotifications] = useState([]); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL; 
 
  const fetchLowStockNotifications = async () => { 
    try { 
      const response = await apiRequest(`${StoreTrustbaseurl}inventory/check-stock/`, 'GET'); 
      if (response.success) { 
        setNotifications(response.data); 
      } else { 
        toast.error(response.error || 'Failed to fetch notifications'); 
      } 
    } catch (error) { 
      toast.error('Network error fetching notifications'); 
      console.error('Error fetching low stock notifications:', error); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  useEffect(() => { 
    fetchLowStockNotifications(); 
    const interval = setInterval(fetchLowStockNotifications, 300000); // every 5 mins 
    return () => clearInterval(interval); 
  }, []); 
 
  const toggleDropdown = () => { 
    setIsDropdownOpen(!isDropdownOpen); 
  }; 

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
 
  if (loading) return <LoadingWrapper>Loading notifications...</LoadingWrapper>; 
 
  return ( 
    <NotificationsWrapper> 
      <BellContainer> 
        <BellIcon 
          onClick={toggleDropdown} 
          data-testid="bell-icon" 
          aria-label="Notifications"
          $hasNotifications={notifications.length > 0}
        /> 
        {notifications.length > 0 && ( 
          <NotificationBadge>{notifications.length}</NotificationBadge> 
        )} 
      </BellContainer> 
      <Dropdown $isOpen={isDropdownOpen}> 
        <DropdownHeader>
          <span>Low Stock Notifications</span>
          <CloseButton 
            onClick={closeDropdown}
            aria-label="Close notifications"
            data-testid="close-button"
          >
            <CloseIcon />
          </CloseButton>
        </DropdownHeader> 
        {notifications.length > 0 ? ( 
          <List> 
            {notifications.map((notification, index) => ( 
              <ListItem key={index}> 
                {notification.message} 
              </ListItem> 
            ))} 
          </List> 
        ) : ( 
          <NoNotifications>No low stock items at the moment.</NoNotifications> 
        )} 
      </Dropdown> 
    </NotificationsWrapper> 
  ); 
}; 
 
export default Notifications;