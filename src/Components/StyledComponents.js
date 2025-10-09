// styledComponents.js
import styled, { keyframes, css }  from "styled-components"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { NavLink } from "react-router-dom"
import { FaBell } from "react-icons/fa"

// Theme colors with harmonious plum shades

export const primaryColor = "#662549"; 
// deep plum (great for headers, buttons)

export const backgroundColor = "#fcefee"; 
// very soft blush background

export const textColor = "#2e1a23"; 
// dark brownish-plum for strong readability

export const accentColor = "#b35478"; 
// muted rose accent for hover, borders, highlights


// =====================
// Generic Form Wrappers
// =====================
export const FormWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;           /* space between fields */
  align-items: flex-end; /* makes labels/inputs align nicely */
  flex-wrap: wrap;     /* wrap to next line if screen is too small */
  width: 100%;
`
// ✅ Each field in same row, evenly spaced
export const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr; 
  gap: 20px;
  align-items: end;
  margin-bottom: 20px;
`;


export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  background: ${backgroundColor};
  border-color: ${accentColor};
  box-shadow: 0 0 6px ${accentColor}55;
`;


export const FormContainer = styled.div`
  background-color: ${backgroundColor};  /* dark background */
  color: ${primaryColor};            /* light text */
  min-height: 100vh;
  padding: 20px;
  border-radius: 12px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const FormSection = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid${accentColor}40;
`

export const FormRow = styled.div`
display: flex;
gap: 20px;
flex-wrap: wrap;
align-items: flex-end;
`


// =====================
// Titles & Headings
// =====================
export const Title = styled.h2`
  justify-content: center;
  color: ${primaryColor};
  font-size: 28px;
  margin-bottom: 40px;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${accentColor};
    border-radius: 2px;
  }
`

export const SectionTitle = styled.h3`
  color: ${primaryColor};
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: bold;
  border-bottom: 1px solid ${accentColor}80;
  padding-bottom: 10px;
`


export const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid ${accentColor}80;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  color: ${primaryColor};

  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 3px ${primaryColor}30;
    background-color: #ffffff;
  }

  option {
    color: ${primaryColor};
    background-color: ${backgroundColor};
  }
`;


export const StyledDatePicker = styled(DatePicker)`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    border-color: ${primaryColor};
    outline: none;
    box-shadow: 0 0 0 2px ${primaryColor}30;
  }
`

export const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
`

export const RadioLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${textColor};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input {
    accent-color: ${primaryColor};
    width: 16px;
    height: 16px;
  }
`
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`

// =====================
// Tables
// =====================
export const ScrollableTableContainer = styled.div`
  max-height: 440px;
  overflow-y: auto;
  overflow-x: auto;
  scrollbar-width: thin;
  border: 1px solid ${accentColor};
  border-radius: 10px;
  background-color: #fff;
  width: 100%;
`

export const TableHeader = styled.th`
  background-color: ${primaryColor};
  color: white;
  padding: 12px 8px;
  text-align: center;
  border: 1px solid ${accentColor};
  position: sticky;
  top: 0;
  z-index: 5;
  letter-spacing: 0.5px;
`

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${backgroundColor};
  }

  &:hover {
    background-color: rgba(111, 139, 131, 0.2);
    transition: background-color 0.3s ease;
  }
`

export const TableCell = styled.td`
  padding: 12px 8px;
  color: ${textColor};
  border: 1px solid ${accentColor};
  text-align: center;
  word-break: break-word;
`

// =====================
// Misc
// =====================
export const Container = styled.div`
  background: linear-gradient(to bottom right, ${backgroundColor}, ${primaryColor});
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
`

export const BlinkingLight = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  animation: blink 1s infinite;
  margin: 0 auto;

  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`

export const ResultsInfo = styled.div`
  text-align: center;
  margin: 15px 0;
  color: ${textColor};
  font-weight: 500;
  font-size: 16px;
`

export const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: end;
`

export const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  align-items: end;

  label {
    color: ${primaryColor};
    font-weight: 600;
  }

  input,
  select {
    padding: 8px 12px;
    border: 1px solid ${accentColor}33; /* soft border using accentColor */
    border-radius: 8px;
    background: ${backgroundColor};
    color: ${primaryColor};
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: ${accentColor};
      box-shadow: 0 0 0 3px ${accentColor}22;
    }
  }

  button {
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(135deg, ${backgroundColor}, ${accentColor});
    color: ${primaryColor};
    box-shadow: 0 4px 6px -1px ${accentColor}33;
    border: none;
    transition: all 0.3s;

    &:hover {
      background: linear-gradient(135deg, ${accentColor}, ${backgroundColor});
      transform: translateY(-1px);
      box-shadow: 0 6px 12px -2px ${accentColor}44;
    }
  }
`;

// =====================
// Form Elements
// =====================
export const Label = styled.label`
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
  color: ${primaryColor};
  border-color: ${primaryColor};
`;


export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: ${primaryColor};
  font-size: 16px;
  pointer-events: none;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px 10px 36px; /* padding-left leaves room for IconWrapper */
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s ease;
  &:focus {
    border-color: ${primaryColor};
    box-shadow: 0 0 0 3px ${primaryColor}33;

  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 12px;
  border-color: ${primaryColor};
`
// =====================
// Buttons
// =====================
export const AddButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
`;

export const AddButton = styled.button`
  background: linear-gradient(135deg, ${backgroundColor}, ${accentColor});
  color: ${primaryColor};
  padding: 4px 12px; /* slightly larger than original for balance */
  font-size: 0.875rem; /* slightly smaller text */
  border-radius: 6px; /* rounded corners */
  border: none;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px ${accentColor}33;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, ${accentColor}, ${backgroundColor});
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px ${accentColor}44;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;


export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`;

export const Button = styled.button`
  background: linear-gradient(135deg, ${backgroundColor}, ${accentColor});
  color: ${primaryColor};
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px ${accentColor}33;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${accentColor}, ${backgroundColor});
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px ${accentColor}44;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
// =====================
// Headings
// =====================
export const Subheading = styled.h3`
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  margin: 20px 0 10px 0;
  color: ${primaryColor};
`;

// =====================
// Tables
// =====================
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  background: ${backgroundColor}; /* light */
  border-radius: 10px;
  overflow: hidden; /* smooth corners */
`;

// Table Header
export const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: ${"#662549"}; /* subtle contrast */
  color: ${"#fcefee"};
  border-bottom: 2px solid ${primaryColor};
  font-weight: 600;
  font-size: 14px;
`;

// Table Cell
export const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid ${accentColor};
  font-size: 14px;
  color: ${textColor};
  background: #fff; /* pure white rows for clarity */
`;

export const TableActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 4px;
  color: ${(props) =>
    props.color
      ? props.color
      : '#27ae60'}; /* default if no color is passed */

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
    transition: 0.2s ease;
  }
`;


// =====================
// Nested Tables (SubTable)
// =====================
export const SubTable = styled.table`
  width: 95%;
  margin: 10px auto;
  border-collapse: collapse;
  background: #fafafa;
  border: 1px solid #eee;
`;


export const SubTh = styled.th`
  padding: 8px;
  background: ${accentColor};
  color: white;
  font-size: 14px;
  border-bottom: 2px solid ${primaryColor};
  text-align: left;

  &:first-child {
    border-top-left-radius: 6px;
  }

  &:last-child {
    border-top-right-radius: 6px;
  }
`;

export const SubTd = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  
`;

// =====================
// Filters Section
// =====================
export const FiltersSection = styled.div`
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
`;

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
`;

export const DeleteButton = styled(TableActionButton)`
  color: red;

  &:hover {
    color: darkred; /* slightly darker on hover */
  }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// =====================
// Sidebar
// =====================


// Sidebar Container
export const SidebarContainer = styled.div`
  height: 100vh;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(
    to bottom,
    ${backgroundColor},
    ${primaryColor}
  );
  padding: 2rem 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 100;
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
  }
`;


// Logo
export const Logo = styled.div`
  padding: 0 1.5rem 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid "#2e1a23"(225, 207, 207, 0.93);
  h1 {
     font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    color:  ${primaryColor};
    margin: 0;
    font-weight: bold;
    text-align: center;
  }
`;

// Menu + Items
export const SidebarMenu = styled.ul`
  list-style-type: none;
  padding: 0 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SidebarItem = styled.li`
  position: relative;
`;

export const SidebarNavLink = styled(NavLink)`
  color: white;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;

  svg {
    margin-right: 12px;
    font-size: 1.2rem;
    color: ${backgroundColor};
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }

  &.active {
    background-color: ${accentColor};
    color: white;
    font-weight: 600;

    svg {
      color: white;
    }

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background-color: ${backgroundColor};
      border-radius: 0 4px 4px 0;
    }
  }
`;

// Dropdown Button
export const DropdownButton = styled.div`
  color: white;
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
    color: ${backgroundColor};
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }

  ${(props) =>
    props.active &&
    css`
      background-color: ${accentColor};
      color: white;
      font-weight: 600;

      svg {
        color: white;
      }
    `}
`;

// Dropdown Icon
export const DropdownIcon = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  ${(props) =>
    props.open &&
    css`
      transform: rotate(180deg);
    `}
`;

// Sub Menu + Links
export const SubMenu = styled.div`
  margin-top: 0.5rem;
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  animation: ${fadeIn} 0.3s ease forwards;
`;

export const SubLink = styled(NavLink)`
  color: white;
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
    background-color: ${accentColor};
    opacity: 0.9;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }

  &.active {
    background-color: ${accentColor};
    color: white;
    font-weight: 600;

    &::before {
      background-color: ${backgroundColor};
      opacity: 1;
    }
  }
`;


export const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(78, 215, 241, 0.2),
    0 4px 6px -2px rgba(111, 230, 252, 0.15);
  border: 1px solid rgba(168, 241, 255, 0.3);
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 640px) {
    padding: 20px;
    margin-bottom: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
  }
`;

export const CardHeader = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  background: linear-gradient(90deg, ${primaryColor}, ${primaryColor});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.4);

  @media (min-width: 640px) {
    font-size: 1.25rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }

  @media (min-width: 768px) {
    margin-bottom: 24px;
    padding-bottom: 12px;
  }
`;
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const Required = styled.span`
  color: #ef4444;
`;


export const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid ${accentColor}33; /* 20% opacity */
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;
  min-height: 80px;
  resize: vertical;
  background: ${backgroundColor};
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 16px;
    min-height: 100px;
  }

  &:focus {
    outline: 2px solid ${primaryColor};
    outline-offset: 2px;
    border-color: transparent;
    background: ${backgroundColor};
    box-shadow: 0 0 0 3px ${accentColor}1A; /* ~10% opacity */
  }
`;

export const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, ${backgroundColor}, ${accentColor});
  color: ${primaryColor};
  box-shadow: 0 4px 6px -1px ${accentColor}33;

  &:hover {
    background: linear-gradient(135deg, ${accentColor}, ${backgroundColor});
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px ${accentColor}44;
  }
`;


export const SecondaryButton = styled(Button)`
  background: linear-gradient(135deg, ${accentColor}, ${accentColor});
  color: ${primaryColor};
  box-shadow: 0 4px 6px -1px ${accentColor}33;

  &:hover {
    background: linear-gradient(135deg, ${accentColor}, ${backgroundColor});
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px ${accentColor}44;
  }
`;

export const SuccessButton = styled(Button)`
  background: linear-gradient(135deg, ${backgroundColor}, ${accentColor});
  color: ${primaryColor};
  box-shadow: 0 4px 6px -1px ${accentColor}33;

  &:hover {
    background: linear-gradient(135deg, ${accentColor}, ${backgroundColor});
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px ${accentColor}44;
  }
`;


export const DangerButton = styled(Button)`
  padding: 4px 8px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;

  @media (max-width: 640px) {
    padding: 8px 12px;
  }

  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
  }
`;

export const WarningButton = styled(Button)`
  padding: 4px 8px;
  background: linear-gradient(135deg, #fffa8d, #f59e0b);
  color: #374151;

  @media (max-width: 640px) {
    padding: 8px 12px;
  }

  &:hover {
    background: linear-gradient(135deg, #f59e0b, #fffa8d);
    transform: translateY(-1px);
  }
`;


export const TableHeaderCell = styled.th`
  padding: 8px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.4);
  font-size: 0.875rem;
  text-align: left;

  @media (min-width: 640px) {
    padding: 12px;
  }

  @media (max-width: 640px) {
    font-size: 0.75rem;
    padding: 6px;
  }
`;


export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(102, 37, 73, 0.25); /* tinted backdrop with primaryColor */
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 16px;

  @media (min-width: 1024px) {
    justify-content: center;
    padding: 0;
  }

  /* Child popup container */
  & > div {
    background-color: ${backgroundColor};
    border: 2px solid ${primaryColor};
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    padding: 24px;
    max-width: 1100px;
    width: 100%;
    overflow-y: auto;
  }
`;

export const ModalContent = styled.div`
  background: white;
  width: 100%;
  max-width: 1400px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;

  @media (min-width: 1024px) {
    width: 1400px;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
`;

export const ModalHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.3);
  background: linear-gradient(
    135deg,
    rgba(168, 241, 255, 0.1),
    rgba(255, 250, 141, 0.1)
  );
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

export const ModalBody = styled.div`
  padding: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

export const ModalFooter = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(168, 241, 255, 0.3);
  background: linear-gradient(
    135deg,
    rgba(168, 241, 255, 0.05),
    rgba(255, 250, 141, 0.05)
  );
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

// Updated styled components for modal rows with better responsive design
export const ModalRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(252, 239, 238, 0.1); /* soft blush with transparency */
  border-radius: 8px;
  border: 2px dotted ${accentColor};
  box-shadow: inset 0 0 0 1px ${primaryColor}, 0 0 0 1px rgba(179, 84, 120, 0.3);
  position: relative;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 14px;
    margin-bottom: 18px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 16px;
    margin-bottom: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  &::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px dotted ${primaryColor};
    border-radius: 8px;
    opacity: 0.7;
    pointer-events: none;
  }
`;


export const TaxRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(246, 206, 219, 0.1); /* soft blush with transparency */
  border-radius: 8px;
  border: 2px dotted ${accentColor};
  box-shadow: inset 0 0 0 1px ${primaryColor}, 0 0 0 1px rgba(179, 84, 120, 0.3);
  position: relative;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 14px;
    margin-bottom: 18px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 16px;
    margin-bottom: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(5, 1fr);
  }

  &::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px dotted ${primaryColor};
    border-radius: 8px;
    opacity: 0.7;
    pointer-events: none;
  }
`;


export const RowLabel = styled.h4`
  grid-column: 1 / -1;
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${primaryColor};
  background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 640px) {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
  }

  @media (min-width: 768px) {
    margin: 0 0 12px 0;
  }
`;

export const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${primaryColor};
  margin-bottom: 20px;
  text-align: center;
  padding-bottom: 10px;
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
`;

export const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
    gap: 16px;
    margin-bottom: 32px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export const EmptyState = styled.td`
  text-align: center;
  color: #6b7280;
  padding: 24px;

  @media (min-width: 640px) {
    padding: 32px;
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  margin: -1px; /* Prevent scrollbar from showing unnecessarily */

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background:"#652441ff"(167, 132, 191, 0.42);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(97, 19, 71, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(169, 152, 189, 0.5);
  }
`;

export const SmallModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(78, 215, 241, 0.3);
  border: 1px solid rgba(168, 241, 255, 0.3);
  width: 100%;
  max-width: 448px;
  margin: 16px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
`;

export const CloseButton = styled.button`
  color: ${primaryColor};
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: ${accentColor};
    transform: scale(1.1);
    background: rgba(179, 84, 120, 0.1); /* accentColor with transparency */
  }
`;


export const InvoiceModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

export const InvoiceContent = styled.div`
  background: white;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

export const InvoiceHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
`;

export const InvoiceBody = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.4;
`;

export const InvoiceTitle = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    font-size: 18px;
    font-weight: bold;
    color: ${primaryColor};
    margin: 0 0 5px 0;
  }

  .address {
    font-size: 11px;
    margin: 2px 0;
  }

  .document-title {
    font-size: 14px;
    font-weight: bold;
    margin: 15px 0;
    padding: 8px;
    background: ${backgroundColor};
    border: 2px solid ${primaryColor};
    color: ${primaryColor};
  }
`;

export const InvoiceDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  margin-bottom: 10px;
  border: 2px solid ${primaryColor};

  .section {
    border-right: 1px solid ${primaryColor};

    &:last-child {
      border-right: none;
    }

    .header {
      background: ${backgroundColor};
      padding: 5px 8px;
      font-weight: bold;
      border-bottom: 1px solid ${primaryColor};
      text-align: center;
      color: ${primaryColor};
    }

    .content {
      padding: 8px;

      .row {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        margin: 3px 0;
        font-size: 11px;
        line-height: 1.4;
        white-space: nowrap;

        .label {
          font-weight: bold;
          min-width: 90px;
          flex-shrink: 0;
          margin-right: 5px;
          display: inline-block;
          color: ${primaryColor};
        }

        .value {
          flex: 1;
          text-align: left;
          display: inline-block;
        }

        span {
          display: inline-block;
        }

        > * {
          display: inline-block;
        }
      }
    }
  }
`;

export const InvoiceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 10px;
  border: 2px solid ${primaryColor};

  th,
  td {
    border: 1px solid ${primaryColor};
    padding: 6px 4px;
    text-align: center;
    vertical-align: middle;
  }

  th {
    background: ${backgroundColor};
    font-weight: bold;
    color: ${primaryColor};
    font-size: 9px;
    line-height: 1.2;
  }

  td {
    font-size: 10px;
    color: ${primaryColor};
  }

  .number-cell {
    text-align: right;
    padding-right: 8px;
  }

  .center-cell {
    text-align: center;
  }

  .product-cell {
    text-align: left;
    padding-left: 8px;
  }

  th:nth-child(1),
  td:nth-child(1) { width: 30px; }
  th:nth-child(2),
  td:nth-child(2) { width: 140px; }
  th:nth-child(3),
  td:nth-child(3) { width: 70px; }
  th:nth-child(4),
  td:nth-child(4) { width: 60px; }
  th:nth-child(5),
  td:nth-child(5) { width: 60px; }
  th:nth-child(6),
  td:nth-child(6) { width: 40px; }
  th:nth-child(7),
  td:nth-child(7) { width: 40px; }
  th:nth-child(8),
  td:nth-child(8) { width: 40px; }
  th:nth-child(9),
  td:nth-child(9) { width: 60px; }
  th:nth-child(10),
  td:nth-child(10) { width: 60px; }
  th:nth-child(11),
  td:nth-child(11) { width: 60px; }
  th:nth-child(12),
  td:nth-child(12) { width: 60px; }
  th:nth-child(13),
  td:nth-child(13) { width: 70px; }

  .total-row {
    background: ${backgroundColor};
    font-weight: bold;

    td {
      background: ${backgroundColor};
      color: ${primaryColor};
    }
  }
`;


export const InvoiceSummary = styled.div`
  margin-top: 20px;

  .summary-layout {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .gst-amounts {
    flex: 1;
    border: 2px solid ${primaryColor};
    background: ${backgroundColor};
    padding: 12px;
    box-sizing: border-box;

    .gst-row {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      font-size: 11px;

      &:last-child {
        margin-bottom: 5px;
      }

      .label {
        font-weight: bold;
        color: ${primaryColor};
      }

      .amount {
        font-weight: bold;
        color: ${primaryColor};
      }
    }
  }

  .amounts-table {
    min-width: 280px;
    border: 2px solid ${primaryColor};
    box-sizing: border-box;

    .row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid ${primaryColor};
      font-size: 11px;
      margin: 0;
      line-height: 1;
      align-items: center;

      &:last-child {
        border-bottom: none;
        background: ${backgroundColor};
        font-weight: bold;
        color: ${primaryColor};
        margin-bottom: 0;
      }

      span:first-child {
        font-weight: bold;
        flex: 1;
        line-height: 1;
      }

      span:last-child {
        font-weight: bold;
        text-align: right;
        flex-shrink: 0;
        min-width: 80px;
        line-height: 1;
      }
    }
  }

  .amount-words {
    margin: 15px 0;
    padding: 12px;
    background: ${backgroundColor};
    border: 2px solid ${primaryColor};
    box-sizing: border-box;

    .label {
      font-weight: bold;
      color: ${primaryColor};
      margin-bottom: 5px;
      display: block;
    }

    div {
      font-size: 11px;
      font-weight: bold;
    }
  }
`;


export const InvoiceFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;

  .footer-item {
    flex: 1;

    .label {
      font-weight: bold;
      font-size: 11px;
      border-bottom: 1px solid #000;
      padding-bottom: 2px;
      display: inline-block;
      min-width: 150px;
    }
  }
`;
export const InvoiceModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const InvoiceSecondaryButton = styled.button`
  padding: 8px 16px;
  border: 1px solid "#662549";
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: "#662549";
  }
`;

export const InvoicePrimaryButton = styled.button`
  padding: 8px 16px;
  border: none;
  background: #662549; /* remove quotes */
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;

  &:hover {
    background: #4a1f38; /* darker shade on hover */
  }
`;

// History Modal components
export const HistoryModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;   // 👈 higher than GRN details (which is probably 50–100)
`;

export const HistoryModalContent = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  width: 95%;
  max-width: 1000px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

export const HistoryModalHeader = styled.div`
  display: flex;
  justify-content: space-between; /* fixed */
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
`;

export const HistoryModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  flex: 1;
`;

export const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse; /* cleaner alignment */
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const HistoryTableHeader = styled.thead`
  background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
`;

export const HistoryTableHeaderCell = styled.th`
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

export const HistoryTableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9fafb;
  }
  &:hover {
    background-color: #f1f5f9;
  }
`;

export const HistoryTableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-weight: ${props => (props.isPriceColumn ? 600 : undefined)};
  position: relative;
  ${props => props.isHighPrice && `
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #dc2626;
    &:after {
      content: 'HIGH';
      position: absolute;
      top: 2px;
      right: 4px;
      font-size: 9px;
      color: #dc2626;
      font-weight: bold;
    }
  `}
  ${props => props.isLowPrice && `
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    color: #059669;
    &:after {
      content: 'LOW';
      position: absolute;
      top: 2px;
      right: 4px;
      font-size: 9px;
      color: #059669;
      font-weight: bold;
    }
  `}
`


export const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  border: 2px solid #9c9fb3ff;
  border-bottom: 2px solid #828599ff;
  margin: 0 auto;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  margin-top: 8px;
  color:  ${primaryColor};
`;
// At the bottom of styledComponents.js (or near your other containers)
export const MaxWidthContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const StatusText = styled.span`
  font-weight: 600;

  ${({ status }) =>
    status === "Approved" &&
    `
    color: #27ae60; /* green */
  `}

  ${({ status }) =>
    status === "Partially Approved" &&
    `
    color: #e67e22; /* orange */
  `}

  ${({ status }) =>
    (status === "Pending" || status === "Rejected") &&
    `
    color: #e74c3c; /* red */
  `}
`;


export const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
`;


export const TopRightButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 10px;

  button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s;
    cursor: pointer;

    svg {
      vertical-align: middle;
    }
  }

  @media print {
    display: none;
  }
`;



export const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${accentColor};
  font-weight: 600;
  background: ${backgroundColor};
  border: 1px dashed ${primaryColor};
  border-radius: 8px;

  @media print {
    display: none;
  }
`;

export const ErrorMsg = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
  @media print {
    display: none;
  }
`;


export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; // Higher z-index for ViewModal
  backdrop-filter: blur(4px);
`;

export const ModalButtons = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid ${accentColor};
  border-radius: 6px;
  outline: none;
  background: ${backgroundColor};
  color: ${primaryColor};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${primaryColor};
    box-shadow: 0 0 6px ${accentColor}66;
    background: #fff; /* makes it clearer when active */
  }

  &::placeholder {
    color: ${accentColor};
    opacity: 0.7;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  @media print {
    display: none;
  }
`;

export const PopupContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  width: 80%;
  max-width: 900px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  @media print {
    display: none;
  }
`;

export const Subtitle = styled.p`
  color: ${primaryColor};
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const CustomButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  background: ${(props) =>
    props.variant === "primary"
      ? `linear-gradient(135deg, ${backgroundColor}, ${accentColor})`
      : props.variant === "secondary"
      ? `${accentColor}aa`
      : props.variant === "cancel"
      ? "#dc2626"
      : props.variant === "outline"
      ? "#ffffff"
      : `linear-gradient(135deg, ${accentColor}, ${backgroundColor})`};

  color: ${primaryColor};

  border: ${(props) =>
    props.variant === "outline" ? `1px solid ${accentColor}` : "none"};

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.variant === "primary"
        ? `linear-gradient(135deg, ${accentColor}, ${backgroundColor})`
        : props.variant === "secondary"
        ? accentColor
        : props.variant === "cancel"
        ? "#b91c1c"
        : props.variant === "outline"
        ? backgroundColor
        : `linear-gradient(135deg, ${backgroundColor}, ${accentColor})`};
    color: ${primaryColor};
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px ${accentColor}44;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const GreenButton = styled(CustomButton)`
  background: linear-gradient(135deg, ${backgroundColor}, ${accentColor});
  color: ${primaryColor};
  box-shadow: 0 4px 6px -1px ${accentColor}33;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${accentColor}, ${backgroundColor});
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px ${accentColor}44;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;


export const ActionsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const RecordsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RecordsText = styled.span`
  font-size: 14px;
  color:  ${primaryColor};
`;

export const LoadingContainer = styled.div`
  padding: 32px;
  text-align: center;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const TableHeaderRow = styled.tr``;


export const TableBody = styled.tbody`
  background-color: white;
`;

export const CustomBadge = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${(props) => (props.status === "Paid" ? "#d1fae5" : props.status === "Partially Paid" ? "#fef3c7" : "#fee2e2")};
  color: ${(props) => (props.status === "Paid" ? "#065f46" : props.status === "Partially Paid" ? "#d97706" : "#991b1b")};
`;

export const ActionButton = styled.button`
  padding: 4px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 4px;
  &:hover {
    background-color: ${(props) => {
      if (props.variant === "edit") return "#dbeafe";
      if (props.variant === "delete") return "#fecaca";
      if (props.variant === "view") return "#ecfdf5";
      if (props.variant === "pay") return "#fef3c7";
      if (props.variant === "print") return "#f3e8ff";
      return "#f3f4f6";
    }};
  }
  &.edit { color: #2563eb; }
  &.delete { color: #dc2626; }
  &.view { color: #059669; }
  &.pay { color: #d97706; }
  &.print { color: #7c3aed; }
`;

export const NoDataRow = styled.tr``;

export const NoDataCell = styled.td`
  padding: 24px;
  text-align: center;
  color: ${textColor};
  font-size: 14px;
  font-weight: 600;
`;

export const PaginationSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;

export const PaginationLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PaginationText = styled.span`
  padding: 4px 8px;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

export const PaginationRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PaginationControls = styled.div`
  display: flex;
  gap: 4px;
`;

export const PaginationButton = styled.button`
  padding: 8px;
  border: 1px solid ${primaryColor};
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover:not(:disabled) { background-color:#d1d5db; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const ModalScrollContainer = styled.div`
  max-height: 95vh;
  overflow-y: auto;
  padding: 32px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${backgroundColor};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, ${accentColor}, ${primaryColor});
    border-radius: 4px;

    &:hover {
      background: linear-gradient(180deg, ${primaryColor}, ${accentColor});
    }
  }
`;

export const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  &::before {
    content: "📋";
    font-size: 24px;
  }
`;

export const DetailSection = styled.div`
  background: linear-gradient(145deg, #ffffff, ${backgroundColor});
  border: 1px solid ${accentColor}44;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${primaryColor}, ${accentColor}, ${primaryColor});
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(102, 37, 73, 0.15); /* plum shadow */
    border-color: ${primaryColor};
  }
`;

export const DetailSectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background: linear-gradient(135deg, ${accentColor}, ${primaryColor});
    border-radius: 50%;
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: linear-gradient(145deg, ${backgroundColor}, #ffffff);
  border-radius: 12px;
  border: 1px solid ${accentColor}44;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${primaryColor};
    box-shadow: 0 4px 12px ${primaryColor}33;
    transform: translateY(-1px);
  }
`;

export const DetailLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2px;
`;

export const DetailValue = styled.span`
  font-size: 15px;
  color: #1e293b;
  font-weight: 500;
  word-break: break-word;
  &.currency {
    font-weight: 600;
    color: #059669;
    font-size: 16px;
  }
`;

export const ItemsSection = styled(DetailSection)`
  overflow-x: auto;
`;

export const ItemsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const ItemsTableHeader = styled.thead`
  background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
  color: white;
`;

export const ItemsTableRow = styled.tr`
  transition: all 0.2s ease;

  &:nth-child(even) {
    background-color: ${backgroundColor};
  }

  &:hover {
    background: linear-gradient(135deg, ${backgroundColor}, ${accentColor}22);
    transform: scale(1.01);
  }
`;
export const ItemsTableCell = styled.td`
  padding: 16px 20px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  &:first-child { font-weight: 500; color: #1f2937; }
`;

export const ItemsTableHeaderCell = styled.th`
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const HistoryButton = styled(CustomButton)`
  background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
  color: white;
  box-shadow: 0 4px 6px -1px rgba(102, 37, 73, 0.4); /* adjusted to match primaryColor */
  font-weight: 600;
  font-size: 12px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${accentColor}, ${primaryColor});
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(102, 37, 73, 0.45);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;


export const PaymentModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const PaymentModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 95%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

export const PaymentModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

export const PaymentModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
`;

export const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PaymentInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PaymentLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

export const PaymentInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${accentColor}55;
  border-radius: 8px;
  font-size: 14px;
  background: ${backgroundColor};
  color: ${primaryColor};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${accentColor};
    box-shadow: 0 0 0 2px ${accentColor}33;
    background: #fff;
  }
`;

export const PaymentSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${accentColor}55;
  border-radius: 8px;
  font-size: 14px;
  background: ${backgroundColor};
  color: ${primaryColor};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${accentColor};
    box-shadow: 0 0 0 2px ${accentColor}33;
    background: #fff;
  }
`;
export const PaymentButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;
