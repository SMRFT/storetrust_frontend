import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useOutlet } from "./OutletContext";
import { Store } from "lucide-react";

const primaryColor = "#662549";
const accentColor = "#b35478";

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  padding: 6px 14px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(102, 37, 73, 0.15);
  border: 1px solid rgba(179, 84, 120, 0.3);
  margin-right: 12px;
`;

const IconWrapper = styled.div`
  color: ${primaryColor};
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  border: none;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${primaryColor};
  outline: none;
  cursor: pointer;

  option {
    color: #2e1a23;
    font-weight: 500;
  }
`;

const OutletSelector = () => {
  const { outlets, selectedOutlet, changeOutlet, loading } = useOutlet();
  const selectRef = useRef(null);

  const handleSelect = (e) => {
    const code = e.target.value;
    const match = outlets.find((o) => o.outlet_code === code);
    if (match) {
      changeOutlet(match);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        if (selectRef.current) {
          selectRef.current.focus();
          if (typeof selectRef.current.showPicker === "function") {
            try {
              selectRef.current.showPicker();
            } catch (err) {
              // Fallback if browser security limits showPicker
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SelectorContainer title="Press F12 to change Outlet">
      <IconWrapper>
        <Store size={18} />
      </IconWrapper>
      <Select
        ref={selectRef}
        value={selectedOutlet?.outlet_code || ""}
        onChange={handleSelect}
        aria-label="Select Outlet"
        disabled={loading || outlets.length === 0}
      >
        {loading ? (
          <option value="">Loading Outlets...</option>
        ) : outlets.length === 0 ? (
          <option value="">No Outlets Available</option>
        ) : (
          outlets.map((o) => (
            <option key={o.outlet_code} value={o.outlet_code}>
              {o.outlet_name}
            </option>
          ))
        )}
      </Select>
    </SelectorContainer>
  );
};

export default OutletSelector;
