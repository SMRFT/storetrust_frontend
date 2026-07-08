import styled, { keyframes, css } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NavLink } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Breakpoints
// ─────────────────────────────────────────────────────────────────────────────
export const bp = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

export const mq = {
  xs: `@media (max-width: ${bp.xs})`,
  sm: `@media (max-width: ${bp.sm})`,
  md: `@media (max-width: ${bp.md})`,
  lg: `@media (max-width: ${bp.lg})`,
  xl: `@media (max-width: ${bp.xl})`,
  smUp: `@media (min-width: ${bp.sm})`,
  mdUp: `@media (min-width: ${bp.md})`,
  lgUp: `@media (min-width: ${bp.lg})`,
  xlUp: `@media (min-width: ${bp.xl})`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Theme Colors — plum / rose palette (UNCHANGED)
// ─────────────────────────────────────────────────────────────────────────────
export const colors = {
  primary: "#662549",
  primaryDark: "#4a1f38",
  secondary: "#b35478",
  background: "#fcefee",
  surface: "#ffffff",
  textMain: "#2e1a23",
  textMuted: "#94687a",
  border: "#e8c8d0",
  danger: "#ef4444",
  success: "#22c55e",
  tabBg: "#f9e5e8",
};

export const primaryColor = colors.primary;
export const backgroundColor = colors.background;
export const textColor = colors.textMain;
export const accentColor = colors.secondary;

// ─────────────────────────────────────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────────────────────────────────────
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────────────────────
export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  padding: 12px;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;

  ${mq.md} {
    padding: 8px;
  }

  ${mq.sm} {
    padding: 6px;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(102, 37, 73, 0.1);
  animation: ${fadeIn} 0.4s ease-out;

  ${mq.md} {
    border-radius: 6px;
  }
`;

export const MaxWidthContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;

  ${mq.sm} {
    padding: 0 10px;
  }
`;

export const FormContent = styled.div`
  padding: 16px;

  ${mq.sm} {
    padding: 10px;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px 10px;
  margin-bottom: 8px;

  ${mq.sm} {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 6px 8px;
  }

  ${mq.xs} {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;
  width: 100%;

  ${mq.sm} {
    gap: 12px;
  }
`;

export const FormSection = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(102, 37, 73, 0.05);
  border: 1px solid ${colors.border};

  ${mq.md} {
    padding: 16px;
    margin-bottom: 16px;
  }

  ${mq.sm} {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
`;

export const FormContainer = styled.div`
  background-color: ${colors.background};
  color: ${colors.primary};
  min-height: 100vh;
  padding: 20px;
  border-radius: 12px;

  ${mq.sm} {
    padding: 12px;
    border-radius: 8px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${mq.sm} {
    gap: 14px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 12px;

  ${mq.sm} {
    margin-bottom: 10px;
    padding: 8px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;

  ${mq.smUp} {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
  }
  ${mq.mdUp} {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  ${mq.lgUp} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 20px;
  align-items: end;
  margin-bottom: 20px;

  ${mq.md} {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  ${mq.sm} {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────────────────────
export const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${colors.border};
  background: ${colors.background};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Tab = styled.div`
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: ${(p) => (p.active ? "600" : "500")};
  color: ${(p) => (p.active ? colors.primary : colors.textMuted)};
  background: ${(p) => (p.active ? colors.tabBg : "transparent")};
  border-bottom: 3px solid ${(p) => (p.active ? colors.primary : "transparent")};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  top: 2px;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: ${colors.primary};
    background: ${colors.tabBg};
  }

  ${mq.sm} {
    padding: 6px 12px;
    font-size: 0.78rem;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Form Elements
// ─────────────────────────────────────────────────────────────────────────────
export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.textMain};
  margin-bottom: 3px;
  display: flex;
  align-items: center;

  ${(p) =>
    p.required &&
    `
    &::after {
      content: "*";
      color: ${colors.danger};
      margin-left: 4px;
    }
  `}
`;

export const Input = styled.input`
  padding: 5px 8px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 0.82rem;
  transition: all 0.2s;
  background: ${colors.surface};
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 37, 73, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
  }

  ${mq.sm} {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 6px 8px;
  }
`;

export const Select = styled.select`
  padding: 5px 28px 5px 8px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 0.82rem;
  transition: all 0.2s;
  background-color: ${colors.surface};
  cursor: pointer;
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23662549' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.4rem center;
  background-repeat: no-repeat;
  background-size: 1.2em 1.2em;
  color: ${colors.textMain};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 37, 73, 0.1);
  }

  option {
    color: ${colors.textMain};
    background-color: ${colors.background};
  }

  ${mq.sm} {
    font-size: 16px;
    padding: 6px 28px 6px 8px;
  }
`;

export const TextArea = styled.textarea`
  padding: 5px 8px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 0.82rem;
  transition: all 0.2s;
  min-height: 60px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
  background: ${colors.surface};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 37, 73, 0.1);
  }

  ${mq.sm} {
    font-size: 16px;
  }
`;

export const StyledDatePicker = styled(DatePicker)`
  padding: 5px 8px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 0.82rem;
  background-color: ${colors.surface};
  width: 100%;

  &:focus {
    border-color: ${colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 37, 73, 0.1);
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;

  ${mq.sm} {
    gap: 12px;
  }
`;

export const RadioLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 500;
  color: ${colors.textMain};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  input {
    accent-color: ${colors.primary};
    width: 16px;
    height: 16px;
  }
`;

export const Required = styled.span`
  color: ${colors.danger};
  margin-left: 2px;
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: ${colors.primary};
  font-size: 16px;
  pointer-events: none;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────────────────────────────────
export const Button = styled.button`
  padding: 5px 14px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.82rem;
  border: none;
  color: white;
  white-space: nowrap;

  ${(p) =>
    p.secondary
      ? `background: ${colors.textMuted}; &:hover:not(:disabled) { background: #6b4a56; }`
      : p.danger
        ? `background: ${colors.danger}; &:hover:not(:disabled) { background: #dc2626; }`
        : p.success
          ? `background: ${colors.success}; &:hover:not(:disabled) { background: #16a34a; }`
          : `background: ${colors.primary}; &:hover:not(:disabled) { background: ${colors.primaryDark}; }`}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${mq.sm} {
    padding: 6px 12px;
    font-size: 0.78rem;
  }
`;

export const AddButton = styled(Button)`
  background: linear-gradient(
    135deg,
    ${colors.background},
    ${colors.secondary}
  );
  color: ${colors.primary};
  box-shadow: 0 4px 6px -1px rgba(179, 84, 120, 0.2);

  &:hover:not(:disabled) {
    background: linear-gradient(
      135deg,
      ${colors.secondary},
      ${colors.background}
    );
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(179, 84, 120, 0.3);
  }
`;

export const PrimaryButton = styled(Button)``;

export const SecondaryButton = styled(Button)`
  background: ${colors.secondary};
  &:hover:not(:disabled) {
    background: ${colors.primaryDark};
  }
`;

export const SuccessButton = styled(Button)`
  background: ${colors.success};
  &:hover:not(:disabled) {
    background: #16a34a;
  }
`;

export const DangerButton = styled(Button)`
  padding: 4px 8px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }
`;

export const WarningButton = styled(Button)`
  padding: 4px 8px;
  background: linear-gradient(135deg, #fef08a, #f59e0b);
  color: #374151;
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #f59e0b, #fef08a);
  }
`;

export const CustomButton = styled(Button)`
  background: ${(p) =>
    p.variant === "primary"
      ? `linear-gradient(135deg, ${colors.background}, ${colors.secondary})`
      : p.variant === "secondary"
        ? `${colors.secondary}aa`
        : p.variant === "cancel"
          ? "#dc2626"
          : p.variant === "outline"
            ? "#ffffff"
            : `linear-gradient(135deg, ${colors.secondary}, ${colors.background})`};
  color: ${(p) => (p.variant === "cancel" ? "white" : colors.primary)};
  border: ${(p) =>
    p.variant === "outline" ? `1px solid ${colors.secondary}` : "none"};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(179, 84, 120, 0.3);
  }
`;

export const GreenButton = styled(Button)`
  background: linear-gradient(
    135deg,
    ${colors.background},
    ${colors.secondary}
  );
  color: ${colors.primary};
  &:hover:not(:disabled) {
    background: linear-gradient(
      135deg,
      ${colors.secondary},
      ${colors.background}
    );
    transform: translateY(-1px);
  }
`;

export const HistoryButton = styled(Button)`
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  font-size: 0.75rem;
  padding: 5px 10px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid ${colors.border};
  flex-wrap: wrap;

  ${mq.sm} {
    gap: 6px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const AddButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;

  ${mq.sm} {
    margin: 12px 0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
  flex-wrap: wrap;

  ${mq.sm} {
    gap: 6px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Section Headers & Titles
// ─────────────────────────────────────────────────────────────────────────────
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${colors.border};

  h3 {
    margin: 0;
    font-size: 0.9rem;
    color: ${colors.primary};
    font-weight: 600;
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${colors.border};

  h3 {
    margin: 0;
    font-size: 0.9rem;
    color: ${colors.primary};
    font-weight: 600;
  }
`;

export const Title = styled.h2`
  text-align: center;
  color: ${colors.primary};
  font-size: 28px;
  margin-bottom: 40px;
  font-weight: bold;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${colors.secondary};
    border-radius: 2px;
  }

  ${mq.md} {
    font-size: 22px;
    margin-bottom: 28px;
  }

  ${mq.sm} {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

export const Subheading = styled.h3`
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  margin: 20px 0 10px;
  color: ${colors.primary};

  ${mq.sm} {
    font-size: 15px;
  }
`;

export const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary};
  margin-bottom: 20px;
  text-align: center;
  padding-bottom: 10px;

  ${mq.sm} {
    font-size: 1.2rem;
    margin-bottom: 14px;
  }
`;

export const Subtitle = styled.p`
  color: ${colors.primary};
`;

export const RowLabel = styled.h4`
  grid-column: 1 / -1;
  margin: 0 0 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.primary};
  background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Controls & Search
// ─────────────────────────────────────────────────────────────────────────────
export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;

  ${mq.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-wrap: wrap;

  ${mq.md} {
    width: 100%;
  }

  ${mq.sm} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 5px 8px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 0.82rem;
  transition: all 0.2s;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 37, 73, 0.1);
  }

  ${mq.sm} {
    font-size: 16px;
    width: 100%;
  }
`;

export const SearchRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;

  ${mq.sm} {
    flex-direction: column;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  align-items: flex-end;

  label {
    color: ${colors.primary};
    font-weight: 600;
  }

  input,
  select {
    padding: 5px 8px;
    border: 1px solid ${colors.border};
    border-radius: 6px;
    background: ${colors.background};
    color: ${colors.primary};
    outline: none;
    transition: all 0.2s;
    font-size: 0.82rem;

    &:focus {
      border-color: ${colors.secondary};
      box-shadow: 0 0 0 3px rgba(179, 84, 120, 0.1);
    }
  }

  ${mq.sm} {
    gap: 10px;
    margin-bottom: 16px;

    input,
    select {
      width: 100%;
      font-size: 16px;
    }
  }
`;

export const FilterGroup = styled.div`
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;

  ${mq.sm} {
    min-width: 100%;
  }
`;

export const FiltersSection = styled.div`
  margin: 20px 0;
  padding: 15px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  background: ${colors.tabBg};

  ${mq.sm} {
    margin: 12px 0;
    padding: 10px;
  }
`;

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;

  ${mq.sm} {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Table Components
// ─────────────────────────────────────────────────────────────────────────────
export const TableWrapper = styled.div`
  margin-top: 10px;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${colors.background};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 37, 73, 0.3);
    border-radius: 4px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${colors.background};
  min-width: 500px;
`;

export const Th = styled.th`
  background: ${colors.primary};
  padding: 7px 10px;
  text-align: left;
  color: ${colors.background};
  border-bottom: 2px solid ${colors.border};
  font-weight: 600;
  font-size: 0.75rem;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 5;
  letter-spacing: 0.3px;
`;

export const Td = styled.td`
  padding: 6px 10px;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.textMain};
  font-size: 0.82rem;
  background: #fff;
`;

export const Tr = styled.tr`
  transition: background-color 0.2s;

  &:nth-child(even) td {
    background: ${colors.background};
  }
  &:hover td {
    background: rgba(179, 84, 120, 0.08);
  }
`;

export const TableHeader = styled.th`
  background-color: ${colors.primary};
  color: ${colors.background};
  padding: 12px 8px;
  text-align: center;
  border: 1px solid ${colors.secondary};
  position: sticky;
  top: 0;
  z-index: 5;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 0.82rem;
  white-space: nowrap;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${colors.background};
  }
  &:hover {
    background-color: rgba(179, 84, 120, 0.1);
    transition: background-color 0.2s ease;
  }
`;

export const TableCell = styled.td`
  padding: 10px 12px;
  color: ${colors.textMain};
  border-bottom: 1px solid ${colors.border};
  font-size: 0.82rem;
  word-break: break-word;
  background: #fff;

  ${mq.sm} {
    padding: 8px;
  }
`;

export const TableHeaderRow = styled.tr``;
export const TableBody = styled.tbody`
  background-color: white;
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${colors.background};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 37, 73, 0.3);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 37, 73, 0.5);
  }
`;

export const ScrollableTableContainer = styled.div`
  max-height: 440px;
  overflow-y: auto;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  border: 1px solid ${colors.secondary};
  border-radius: 10px;
  background-color: #fff;
  width: 100%;

  ${mq.sm} {
    max-height: 320px;
    border-radius: 8px;
  }
`;

export const TableActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin: 0 4px;
  color: ${(p) => (p.color ? p.color : colors.success)};
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

export const ActionButton = styled.button`
  padding: 4px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 4px;

  &:hover {
    background-color: ${(p) =>
      p.variant === "edit"
        ? "#f9e5e8"
        : p.variant === "delete"
          ? "#fecaca"
          : p.variant === "view"
            ? "#f9e5e8"
            : p.variant === "pay"
              ? "#fef3c7"
              : p.variant === "print"
                ? "#f9e5e8"
                : colors.tabBg};
  }
  &.edit {
    color: ${colors.primary};
  }
  &.delete {
    color: ${colors.danger};
  }
  &.view {
    color: ${colors.secondary};
  }
  &.pay {
    color: #d97706;
  }
  &.print {
    color: ${colors.primary};
  }
`;

export const DeleteButton = styled(TableActionButton)`
  color: ${colors.danger};
  &:hover {
    color: #b91c1c;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 8px;
  border-bottom: 1px solid ${colors.border};
  font-size: 0.875rem;
  text-align: left;
`;

export const SubTable = styled.table`
  width: 95%;
  margin: 10px auto;
  border-collapse: collapse;
  background: #fafafa;
  border: 1px solid ${colors.border};
`;

export const SubTh = styled.th`
  padding: 8px;
  background: ${colors.secondary};
  color: white;
  font-size: 0.82rem;
  border-bottom: 2px solid ${colors.primary};
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
  border-bottom: 1px solid ${colors.border};
  font-size: 0.8rem;
`;

export const NoDataRow = styled.tr``;
export const NoDataCell = styled.td`
  padding: 24px;
  text-align: center;
  color: ${colors.textMuted};
  font-size: 0.875rem;
  font-weight: 600;
`;

export const EmptyState = styled.td`
  text-align: center;
  color: ${colors.textMuted};
  padding: 32px;
  font-size: 0.85rem;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Modal Components
// ─────────────────────────────────────────────────────────────────────────────
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(46, 26, 35, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(4px);
  padding: 16px;

  ${mq.sm} {
    padding: 8px;
    align-items: flex-end;
  }
`;

export const ModalContainer = styled.div`
  background: ${colors.surface};
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(102, 37, 73, 0.25);
  display: flex;
  flex-direction: column;

  ${mq.md} {
    width: 95%;
    max-height: 90vh;
  }

  ${mq.sm} {
    width: 100%;
    max-height: 95vh;
    border-radius: 12px 12px 0 0;
  }
`;

export const ModalHeader = styled.div`
  padding: 14px 18px;
  border-bottom: 2px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.tabBg};
  flex-shrink: 0;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${colors.textMain};
  font-size: 1.1rem;
  font-weight: 600;

  ${mq.sm} {
    font-size: 0.95rem;
  }
`;

export const ModalBody = styled.div`
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;

  ${mq.sm} {
    padding: 12px;
  }
`;

export const ModalFooter = styled.div`
  padding: 10px 16px;
  border-top: 1px solid ${colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background: ${colors.tabBg};
  flex-shrink: 0;
  flex-wrap: wrap;

  ${mq.sm} {
    padding: 10px 12px;
    padding-bottom: env(safe-area-inset-bottom, 10px);
  }
`;

export const ModalContent = styled.div`
  background: white;
  width: 100%;
  max-width: 400px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(102, 37, 73, 0.1);
  border-radius: 12px;
`;

export const ModalScrollContainer = styled.div`
  max-height: 95vh;
  overflow-y: auto;
  padding: 32px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${colors.background};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, ${colors.secondary}, ${colors.primary});
    border-radius: 4px;
  }

  ${mq.sm} {
    padding: 16px;
  }
`;

export const Modal = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(102, 37, 73, 0.25);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 16px;

  ${mq.lgUp} {
    justify-content: center;
    padding: 0;
  }

  & > div {
    background-color: ${colors.background};
    border: 2px solid ${colors.primary};
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(102, 37, 73, 0.2);
    padding: 24px;
    max-width: 1100px;
    width: 100%;
    overflow-y: auto;

    ${mq.sm} {
      padding: 16px;
      border-radius: 8px;
    }
  }
`;

export const ModalButtons = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 0.9rem;
  border: 1px solid ${colors.secondary};
  border-radius: 6px;
  outline: none;
  background: ${colors.background};
  color: ${colors.primary};
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 6px rgba(179, 84, 120, 0.4);
    background: #fff;
  }

  &::placeholder {
    color: ${colors.secondary};
    opacity: 0.7;
  }

  ${mq.sm} {
    font-size: 16px;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.3rem;
  color: ${colors.textMuted};
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${colors.border};
    color: ${colors.textMain};
    transform: scale(1.1);
  }
`;

export const SmallModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(102, 37, 73, 0.25);
  border: 1px solid ${colors.border};
  width: 100%;
  max-width: 448px;
  margin: 16px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;

  ${mq.sm} {
    margin: 8px;
    max-width: calc(100% - 16px);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Grid Layout Helpers
// ─────────────────────────────────────────────────────────────────────────────
export const ModalRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(252, 239, 238, 0.5);
  border-radius: 8px;
  border: 1px dashed ${colors.secondary};
  width: 100%;
  box-sizing: border-box;

  ${mq.smUp} {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 14px;
  }
  ${mq.mdUp} {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 16px;
  }
  ${mq.lgUp} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const TaxRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(249, 229, 232, 0.5);
  border-radius: 8px;
  border: 1px dashed ${colors.secondary};
  width: 100%;
  box-sizing: border-box;

  ${mq.smUp} {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 14px;
  }
  ${mq.mdUp} {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 16px;
  }
  ${mq.lgUp} {
    grid-template-columns: repeat(4, 1fr);
  }
  ${mq.xlUp} {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;

  ${mq.md} {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Detail View Components
// ─────────────────────────────────────────────────────────────────────────────
export const DetailSection = styled.div`
  background: linear-gradient(145deg, #ffffff, ${colors.background});
  border: 1px solid rgba(179, 84, 120, 0.25);
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
    background: linear-gradient(
      90deg,
      ${colors.primary},
      ${colors.secondary},
      ${colors.primary}
    );
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(102, 37, 73, 0.15);
    border-color: ${colors.primary};
  }

  ${mq.sm} {
    padding: 16px;
    border-radius: 12px;
    &:hover {
      transform: none;
    }
  }
`;

export const DetailSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  ${mq.sm} {
    font-size: 0.95rem;
    margin-bottom: 14px;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: linear-gradient(145deg, ${colors.background}, #ffffff);
  border-radius: 12px;
  border: 1px solid rgba(179, 84, 120, 0.2);
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primary};
    box-shadow: 0 4px 12px rgba(102, 37, 73, 0.15);
    transform: translateY(-1px);
  }

  ${mq.sm} {
    padding: 12px;
    &:hover {
      transform: none;
    }
  }
`;

export const DetailLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const DetailValue = styled.span`
  font-size: 0.9rem;
  color: ${colors.textMain};
  font-weight: 500;
  word-break: break-word;

  &.currency {
    font-weight: 700;
    color: ${colors.primary};
    font-size: 1rem;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Items Table
// ─────────────────────────────────────────────────────────────────────────────
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
  box-shadow: 0 4px 6px -1px rgba(102, 37, 73, 0.1);
  min-width: 500px;
`;

export const ItemsTableHeader = styled.thead`
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: white;
`;

export const ItemsTableRow = styled.tr`
  transition: all 0.2s ease;
  &:nth-child(even) {
    background-color: ${colors.background};
  }
  &:hover {
    background: linear-gradient(
      135deg,
      ${colors.background},
      rgba(179, 84, 120, 0.1)
    );
  }
`;

export const ItemsTableCell = styled.td`
  padding: 14px 18px;
  font-size: 0.82rem;
  color: ${colors.textMain};
  border-bottom: 1px solid ${colors.border};
  &:first-child {
    font-weight: 500;
    color: ${colors.textMain};
  }

  ${mq.sm} {
    padding: 10px 12px;
  }
`;

export const ItemsTableHeaderCell = styled.th`
  padding: 14px 18px;
  font-size: 0.82rem;
  font-weight: 600;
  color: white;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${mq.sm} {
    padding: 10px 12px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// History Modal
// ─────────────────────────────────────────────────────────────────────────────
export const HistoryModalOverlay = styled(ModalOverlay)`
  z-index: 2000;
`;

export const HistoryModalContent = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  width: 95%;
  max-width: 1000px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(102, 37, 73, 0.15);
  display: flex;
  flex-direction: column;

  ${mq.sm} {
    width: 100%;
    padding: 16px;
    border-radius: 12px 12px 0 0;
    max-height: 90vh;
  }
`;

export const HistoryModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${colors.border};
`;

export const HistoryModalTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${colors.textMain};
  margin: 0;
  flex: 1;

  ${mq.sm} {
    font-size: 1rem;
  }
`;

export const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(102, 37, 73, 0.1);
  min-width: 500px;
`;

export const HistoryTableHeader = styled.thead`
  background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
`;

export const HistoryTableHeaderCell = styled.th`
  padding: 10px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  color: white;
  text-align: left;
  border-bottom: 1px solid ${colors.border};
  white-space: nowrap;
`;

export const HistoryTableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${colors.background};
  }
  &:hover {
    background-color: rgba(179, 84, 120, 0.08);
  }
`;

export const HistoryTableCell = styled.td`
  padding: 10px 14px;
  font-size: 0.82rem;
  color: ${colors.textMain};
  border-bottom: 1px solid ${colors.border};
  font-weight: ${(p) => (p.isPriceColumn ? 600 : undefined)};
  position: relative;

  ${(p) =>
    p.isHighPrice &&
    `
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #dc2626;
    &:after { content: 'HIGH'; position: absolute; top: 2px; right: 4px; font-size: 9px; color: #dc2626; font-weight: bold; }
  `}
  ${(p) =>
    p.isLowPrice &&
    `
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    color: #059669;
    &:after { content: 'LOW'; position: absolute; top: 2px; right: 4px; font-size: 9px; color: #059669; font-weight: bold; }
  `}
`;

// ─────────────────────────────────────────────────────────────────────────────
// Invoice Styled Components
// ─────────────────────────────────────────────────────────────────────────────
export const InvoiceModal = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(46, 26, 35, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;

  ${mq.sm} {
    padding: 0;
    align-items: flex-end;
  }
`;

export const InvoiceContent = styled.div`
  background: white;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(102, 37, 73, 0.25);

  ${mq.sm} {
    border-radius: 12px 12px 0 0;
    max-height: 95vh;
  }
`;

export const InvoiceHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.tabBg};
  flex-wrap: wrap;
  gap: 10px;

  ${mq.sm} {
    padding: 14px;
  }
`;

export const InvoiceBody = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.4;

  ${mq.sm} {
    padding: 12px;
    font-size: 11px;
  }
`;

export const InvoiceTitle = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    font-size: 18px;
    font-weight: bold;
    color: ${colors.primary};
    margin: 0 0 5px;
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
    background: ${colors.background};
    border: 2px solid ${colors.primary};
    color: ${colors.primary};
  }

  ${mq.sm} {
    h1 {
      font-size: 15px;
    }
    .document-title {
      font-size: 12px;
    }
  }
`;

export const InvoiceDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  margin-bottom: 10px;
  border: 2px solid ${colors.primary};

  .section {
    border-right: 1px solid ${colors.primary};
    &:last-child {
      border-right: none;
    }

    .header {
      background: ${colors.background};
      padding: 5px 8px;
      font-weight: bold;
      border-bottom: 1px solid ${colors.primary};
      text-align: center;
      color: ${colors.primary};
    }

    .content {
      padding: 8px;
      .row {
        display: flex;
        align-items: center;
        margin: 3px 0;
        font-size: 11px;
        .label {
          font-weight: bold;
          min-width: 90px;
          margin-right: 5px;
          color: ${colors.primary};
        }
        .value {
          flex: 1;
        }
      }
    }
  }

  ${mq.md} {
    grid-template-columns: 1fr;
    .section {
      border-right: none;
      border-bottom: 1px solid ${colors.primary};
      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

export const InvoiceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 10px;
  border: 2px solid ${colors.primary};

  th,
  td {
    border: 1px solid ${colors.primary};
    padding: 6px 4px;
    text-align: center;
    vertical-align: middle;
  }

  th {
    background: ${colors.background};
    font-weight: bold;
    color: ${colors.primary};
    font-size: 9px;
  }

  td {
    font-size: 10px;
    color: ${colors.primary};
  }

  .number-cell {
    text-align: right;
    padding-right: 8px;
  }
  .product-cell {
    text-align: left;
    padding-left: 8px;
  }

  .total-row {
    background: ${colors.background};
    font-weight: bold;
    td {
      background: ${colors.background};
      color: ${colors.primary};
    }
  }
`;

export const InvoiceSummary = styled.div`
  margin-top: 20px;

  .summary-layout {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;

    ${mq.md} {
      flex-direction: column;
    }
  }

  .gst-amounts {
    flex: 1;
    border: 2px solid ${colors.primary};
    background: ${colors.background};
    padding: 12px;

    .gst-row {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      font-size: 11px;
      .label,
      .amount {
        font-weight: bold;
        color: ${colors.primary};
      }
    }
  }

  .amounts-table {
    min-width: 280px;
    border: 2px solid ${colors.primary};

    .row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid ${colors.primary};
      font-size: 11px;
      align-items: center;

      &:last-child {
        border-bottom: none;
        background: ${colors.background};
        font-weight: bold;
        color: ${colors.primary};
      }

      span:first-child {
        font-weight: bold;
        flex: 1;
      }
      span:last-child {
        font-weight: bold;
        text-align: right;
        min-width: 80px;
      }
    }

    ${mq.md} {
      min-width: unset;
      width: 100%;
    }
  }

  .amount-words {
    margin: 15px 0;
    padding: 12px;
    background: ${colors.background};
    border: 2px solid ${colors.primary};

    .label {
      font-weight: bold;
      color: ${colors.primary};
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
  flex-wrap: wrap;
  gap: 20px;

  .footer-item {
    flex: 1;
    min-width: 140px;
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
  padding: 16px 20px;
  border-top: 1px solid ${colors.border};
  background: ${colors.tabBg};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;

  ${mq.sm} {
    padding: 12px;
    padding-bottom: env(safe-area-inset-bottom, 12px);
  }
`;

export const InvoiceSecondaryButton = styled.button`
  padding: 6px 14px;
  border: 1px solid ${colors.primary};
  background: white;
  color: ${colors.textMain};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.82rem;
  transition: all 0.2s;

  &:hover {
    background: ${colors.background};
  }
`;

export const InvoicePrimaryButton = styled.button`
  padding: 6px 14px;
  border: none;
  background: ${colors.primary};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.82rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${colors.primaryDark};
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Payment Modal
// ─────────────────────────────────────────────────────────────────────────────
export const PaymentModalOverlay = styled(ModalOverlay)``;

export const PaymentModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 95%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 20px rgba(102, 37, 73, 0.2);

  ${mq.sm} {
    width: 100%;
    padding: 16px;
    border-radius: 12px 12px 0 0;
    max-height: 90vh;
  }
`;

export const PaymentModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colors.border};
`;

export const PaymentModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.textMain};

  ${mq.sm} {
    font-size: 0.95rem;
  }
`;

export const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PaymentInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PaymentLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 500;
  color: ${colors.textMain};
`;

export const PaymentInput = styled(Input)``;
export const PaymentSelect = styled(Select)``;

export const PaymentButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar (responsive-aware, used with AppLayout)
// ─────────────────────────────────────────────────────────────────────────────
export const SidebarContainer = styled.div`
  height: 100vh;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  font-family: "Inter", sans-serif;
  background: linear-gradient(
    to bottom,
    ${colors.background},
    ${colors.primary}
  );
  padding: 2rem 0;
  box-shadow: 0 0 20px rgba(102, 37, 73, 0.15);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 200;
  transition:
    transform 0.3s ease,
    width 0.3s ease;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
  }

  /* Mobile: off-canvas by default, controlled via prop */
  ${mq.md} {
    transform: translateX(${(p) => (p.open ? "0" : "-100%")});
    box-shadow: ${(p) => (p.open ? "4px 0 24px rgba(102,37,73,0.25)" : "none")};
  }
`;

export const SidebarOverlay = styled.div`
  display: none;

  ${mq.md} {
    display: ${(p) => (p.open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(46, 26, 35, 0.45);
    z-index: 199;
    backdrop-filter: blur(2px);
  }
`;

export const MobileMenuToggle = styled.button`
  display: none;

  ${mq.md} {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 201;
    background: ${colors.primary};
    color: white;
    border: none;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(102, 37, 73, 0.3);
    transition: background 0.2s;
    font-size: 1.2rem;

    &:hover {
      background: ${colors.primaryDark};
    }
  }
`;

export const Logo = styled.div`
  padding: 0 1.5rem 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);

  h1 {
    font-size: 1.5rem;
    color: ${colors.primary};
    margin: 0;
    font-weight: bold;
    text-align: center;
  }

  ${mq.md} {
    h1 {
      font-size: 1.2rem;
    }
  }
`;

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
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;

  svg {
    margin-right: 12px;
    font-size: 1.2rem;
    color: ${colors.background};
    flex-shrink: 0;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }

  &.active {
    background-color: ${colors.secondary};
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
      background-color: ${colors.background};
      border-radius: 0 4px 4px 0;
    }
  }

  ${mq.md} {
    font-size: 0.95rem;
    padding: 0.8rem 1rem;
  }
`;

export const DropdownButton = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  svg:first-child {
    margin-right: 12px;
    font-size: 1.2rem;
    color: ${colors.background};
    flex-shrink: 0;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }

  ${(p) =>
    p.active &&
    css`
      background-color: ${colors.secondary};
      color: white;
      font-weight: 600;
      svg {
        color: white;
      }
    `}

  ${mq.md} {
    font-size: 0.95rem;
    padding: 0.8rem 1rem;
  }
`;

export const DropdownIcon = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  ${(p) =>
    p.open &&
    css`
      transform: rotate(180deg);
    `}
`;

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
  font-size: 0.9rem;
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
    background-color: ${colors.secondary};
    opacity: 0.9;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }

  &.active {
    background-color: ${colors.secondary};
    color: white;
    font-weight: 600;
    &::before {
      background-color: ${colors.background};
      opacity: 1;
    }
  }

  ${mq.md} {
    font-size: 0.85rem;
    padding: 0.6rem 1rem 0.6rem 2.2rem;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Main Content Area (shifts right on desktop when sidebar is visible)
// ─────────────────────────────────────────────────────────────────────────────
export const MainContent = styled.main`
  margin-left: 250px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;

  ${mq.md} {
    margin-left: 0;
    padding-top: 60px; /* space for mobile toggle button */
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Cards
// ─────────────────────────────────────────────────────────────────────────────
export const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 37, 73, 0.1);
  border: 1px solid ${colors.border};
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;

  ${mq.sm} {
    padding: 12px;
    border-radius: 8px;
  }
`;

export const CardHeader = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${colors.border};

  ${mq.sm} {
    font-size: 0.95rem;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Status / Badges
// ─────────────────────────────────────────────────────────────────────────────
export const StatusText = styled.span`
  font-weight: 600;
  ${({ status }) => status === "Approved" && `color: #22c55e;`}
  ${({ status }) => status === "Partially Approved" && `color: #f59e0b;`}
  ${({ status }) =>
    (status === "Pending" || status === "Rejected") &&
    `color: ${colors.danger};`}
`;

export const CustomBadge = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${(p) =>
    p.status === "Paid"
      ? "#d1fae5"
      : p.status === "Partially Paid"
        ? "#fef3c7"
        : "#fee2e2"};
  color: ${(p) =>
    p.status === "Paid"
      ? "#065f46"
      : p.status === "Partially Paid"
        ? "#d97706"
        : "#991b1b"};
  white-space: nowrap;
`;

export const BlinkingLight = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  animation: blink 1s infinite;
  margin: 0 auto;

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Loading / Feedback
// ─────────────────────────────────────────────────────────────────────────────
export const LoadingSpinner = styled.div`
  animation: ${spin} 1s linear infinite;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  border: 3px solid rgba(102, 37, 73, 0.15);
  border-top: 3px solid ${colors.primary};
  margin: 0 auto;
`;

export const LoadingText = styled.p`
  margin-top: 8px;
  color: ${colors.primary};
  text-align: center;
`;

export const LoadingContainer = styled.div`
  padding: 32px;
  text-align: center;
`;

export const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${colors.secondary};
  font-weight: 600;
  background: ${colors.background};
  border: 1px dashed ${colors.primary};
  border-radius: 8px;
  @media print {
    display: none;
  }
`;

export const ErrorMsg = styled.div`
  color: ${colors.danger};
  text-align: center;
  padding: 2rem;
  @media print {
    display: none;
  }
`;

export const ResultsInfo = styled.div`
  text-align: center;
  margin: 15px 0;
  color: ${colors.textMain};
  font-weight: 500;
  font-size: 0.9rem;
`;

export const NoResults = styled.div`
  text-align: center;
  padding: 30px 20px;
  color: ${colors.textMuted};
  font-size: 0.9rem;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Section Layout Helpers
// ─────────────────────────────────────────────────────────────────────────────
export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;

  ${mq.smUp} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  ${mq.sm} {
    gap: 10px;
    margin-bottom: 14px;
  }
`;

export const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  ${mq.smUp} {
    flex-direction: row;
    justify-content: flex-end;
    gap: 16px;
  }

  ${mq.sm} {
    gap: 8px;
    margin-bottom: 16px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-wrap: wrap;

  ${mq.smUp} {
    flex-direction: row;
  }
`;

export const ActionsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TopRightButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;

  button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s;
    cursor: pointer;
  }

  ${mq.sm} {
    gap: 8px;
    button {
      padding: 6px 10px;
      font-size: 0.78rem;
    }
  }

  @media print {
    display: none;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────
export const PaginationSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  flex-wrap: wrap;
  gap: 10px;

  ${mq.sm} {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 16px;
  }
`;

export const PaginationLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
export const PaginationRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
export const PaginationControls = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

export const PaginationText = styled.span`
  padding: 4px 8px;
  text-align: center;
  color: ${colors.primary};
  font-size: 0.82rem;
  font-weight: 600;
`;

export const PaginationButton = styled.button`
  padding: 6px 10px;
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  color: ${colors.primary};

  &:hover:not(:disabled) {
    background-color: ${colors.tabBg};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Records Info
// ─────────────────────────────────────────────────────────────────────────────
export const RecordsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
export const RecordsText = styled.span`
  font-size: 0.82rem;
  color: ${colors.primary};
`;

// ─────────────────────────────────────────────────────────────────────────────
// Misc / Overlay
// ─────────────────────────────────────────────────────────────────────────────
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(46, 26, 35, 0.4);
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
  box-shadow: 0 10px 25px rgba(102, 37, 73, 0.25);
  animation: ${fadeIn} 0.3s ease-in-out;

  ${mq.sm} {
    width: 95%;
    padding: 14px;
  }

  @media print {
    display: none;
  }
`;

export const CollapsibleSection = styled.div`
  margin-bottom: 10px;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const SectionContent = styled.div`
  padding: 10px;
  background: white;
  display: ${(p) => (p.visible ? "block" : "none")};
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0;
`;
export const Checkbox = styled.input`
  margin-right: 6px;
  cursor: pointer;
`;
export const FileInput = styled.input`
  padding: 4px 0;
  font-size: 0.78rem;
  width: 100%;
`;

export const InfoIcon = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  background: ${colors.primary};
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 14px;
  font-size: 0.65rem;
  font-weight: bold;
  cursor: help;
  margin-left: 4px;
`;

export const SearchButton = styled.button`
  width: 22px;
  height: 22px;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(20%);
  z-index: 2;

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(20%) scale(1.1);
  }
`;
export const SignOutWrapper = styled.div`
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const PremiumHeader = styled.div`
  background: linear-gradient(135deg, #662549 0%, #8c3b6a 100%);
  border-radius: 12px;
  padding: 24px 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 24px rgba(102, 37, 73, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 16px 20px;
    margin-bottom: 20px;
  }
`;

export const PremiumTitle = styled.h2`
  color: #ffffff;
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const PremiumSubheading = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #662549;
  margin-top: 30px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 4px solid #662549;
  padding-left: 12px;
`;



export const PremiumStatusText = styled.span`
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 0.76rem;
  font-weight: 700;
  display: inline-block;
  text-transform: capitalize;
  letter-spacing: 0.3px;

  &.status-approved, &.status-approve {
    background-color: #d1fae5;
    color: #065f46;
  }

  &.status-rejected, &.status-reject {
    background-color: #fee2e2;
    color: #991b1b;
  }

  &.status-partially-approved, &.status-partially-approve {
    background-color: #fef3c7;
    color: #92400e;
  }

  &.status-pending {
    background-color: #e0e7ff;
    color: #3730a3;
  }

  &.status-dispatched {
    background-color: #f3e8ff;
    color: #6b21a8;
  }

  &.status-partially-dispatched {
    background-color: #fae8ff;
    color: #86198f;
  }

  &.status-not-dispatched {
    background-color: #f3f4f6;
    color: #374151;
  }
`;
