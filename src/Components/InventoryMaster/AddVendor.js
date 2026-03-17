import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import apiRequest from "../apiRequest";
import styled from "styled-components";
import { colors } from "../StyledComponents";

// ─── Local styled components ──────────────────────────────────────────────────
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #fcefee;
  padding: 12px;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(102, 37, 73, 0.1);
`;

const PageHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${colors.primary} 0%,
    ${colors.primaryDark} 100%
  );
  color: white;
  padding: 14px 22px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  margin-bottom: 14px;
  box-shadow: 0 1px 3px rgba(102, 37, 73, 0.06);
`;

const CardHeader = styled.div`
  background: ${colors.tabBg};
  padding: 9px 16px;
  border-bottom: 1px solid ${colors.border};
  font-weight: 600;
  font-size: 0.82rem;
  color: ${colors.primary};
  border-radius: 8px 8px 0 0;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const SectionDivider = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${colors.primary};
  padding: 8px 0 4px;
  border-bottom: 1px solid ${colors.tabBg};
  margin-bottom: 10px;
  margin-top: 6px;
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: ${(p) => p.cols || "repeat(3, 1fr)"};
  gap: 12px;
  align-items: flex-end;
  margin-bottom: ${(p) => p.mb || "12px"};
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
`;

const Lbl = styled.label`
  font-size: 0.72rem;
  margin-bottom: 3px;
  color: ${colors.textMuted};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 5px 8px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 0.82rem;
  transition: all 0.2s;
  background: white;
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
`;

const Select = styled.select`
  padding: 5px 28px 5px 8px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 0.82rem;
  background-color: white;
  cursor: pointer;
  appearance: none;
  width: 100%;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23662549' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.4rem center;
  background-repeat: no-repeat;
  background-size: 1.2em 1.2em;
  color: ${colors.textMain};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 37, 73, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 5px 8px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 0.82rem;
  transition: all 0.2s;
  min-height: 60px;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
  background: white;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 37, 73, 0.1);
  }
`;

const RequiredMark = styled.span`
  color: ${colors.danger};
  margin-left: 2px;
`;

const Button = styled.button`
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

  ${(p) =>
    p.secondary
      ? `background: ${colors.textMuted}; &:hover { background: #6b4a56; }`
      : `background: ${colors.primary}; &:hover { background: ${colors.primaryDark}; }`}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid ${colors.border};
`;

// ─── Mini Modal components ────────────────────────────────────────────────────
const MiniOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(46, 26, 35, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
`;

const MiniBox = styled.div`
  background: white;
  border-radius: 10px;
  width: 860px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(102, 37, 73, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MiniHead = styled.div`
  background: ${colors.tabBg};
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const MiniTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${colors.primary};
`;

const MiniBody = styled.div`
  padding: 20px 16px;
  overflow-y: auto;
  flex: 1;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.textMuted};
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 2px;
  &:hover {
    background: ${colors.border};
    color: ${colors.textMain};
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Shared form — used by both full page and mini modal
// ─────────────────────────────────────────────────────────────────────────────
const VendorForm = ({ onSuccess, onCancel, isModal = false }) => {
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  const [formData, setFormData] = useState({
    supplierType: "",
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    contactPerson: "",
    phone: "",
    email: "",
    kgstTinNumber: "",
    gstin: "",
    payment: "",
    terms: "",
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: "India" }),
          },
        );
        const data = await res.json();
        setStates(data.data.states);
      } catch {
        toast.error("Failed to load states");
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    setFormData((prev) => ({ ...prev, state: stateName, city: "" }));
    setCities([]);
    if (!stateName) return;
    setLoadingCities(true);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India", state: stateName }),
        },
      );
      const data = await res.json();
      setCities(data.data || []);
    } catch {
      toast.error("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  const resetForm = () => {
    setFormData({
      supplierType: "",
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      contactPerson: "",
      phone: "",
      email: "",
      kgstTinNumber: "",
      gstin: "",
      payment: "",
      terms: "",
    });
    setCities([]);
  };

  const handleSubmit = async () => {
    const required = {
      supplierType: "Supplier / Manufacturer",
      name: "Name",
      addressLine1: "Address Line 1",
      gstin: "GSTIN",
    };
    const missing = Object.entries(required)
      .filter(([f]) => !formData[f] || formData[f].trim() === "")
      .map(([, l]) => l);

    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    try {
      const result = await apiRequest(
        `${StoreTrustbaseurl}vendors/`,
        "POST",
        formData,
      );

      if (result.status === 400) {
        if (result.data) {
          Object.entries(result.data).forEach(([f, m]) =>
            toast.error(`${f}: ${Array.isArray(m) ? m.join(", ") : m}`),
          );
        } else {
          toast.error("Validation failed.");
        }
        return;
      }

      if (result.error || !result.success) {
        toast.error(result.error || "Failed to add vendor.");
        return;
      }

      if (result.success) {
        toast.success("Vendor added successfully!");
        if (isModal) {
          resetForm();
          if (onSuccess) onSuccess(result.data);
        } else {
          if (onSuccess) onSuccess();
        }
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      {/* Basic Info */}
      <SectionDivider>Basic Information</SectionDivider>
      <GridRow cols="repeat(3, 1fr)">
        <InputWrapper>
          <Lbl>
            Supplier / Manufacturer <RequiredMark>*</RequiredMark>
          </Lbl>
          <Select
            name="supplierType"
            value={formData.supplierType}
            onChange={handleInputChange}
          >
            <option value="">Select Type</option>
            <option value="Supplier">Supplier</option>
            <option value="Manufacturer">Manufacturer</option>
            <option value="Both">Both</option>
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Lbl>
            Name <RequiredMark>*</RequiredMark>
          </Lbl>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter vendor name"
          />
        </InputWrapper>

        <InputWrapper>
          <Lbl>
            GSTIN <RequiredMark>*</RequiredMark>
          </Lbl>
          <Input
            type="text"
            name="gstin"
            value={formData.gstin}
            onChange={handleInputChange}
            placeholder="Enter GSTIN"
          />
        </InputWrapper>
      </GridRow>

      {/* Address */}
      <SectionDivider>Address</SectionDivider>
      <GridRow cols="repeat(3, 1fr)">
        <InputWrapper>
          <Lbl>
            Address Line 1 <RequiredMark>*</RequiredMark>
          </Lbl>
          <Input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleInputChange}
            placeholder="Enter address line 1"
          />
        </InputWrapper>

        <InputWrapper>
          <Lbl>Address Line 2</Lbl>
          <Input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleInputChange}
            placeholder="Enter address line 2"
          />
        </InputWrapper>

        <InputWrapper>
          <Lbl>State</Lbl>
          <Select
            name="state"
            value={formData.state}
            onChange={handleStateChange}
            disabled={loadingStates}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </Select>
        </InputWrapper>
      </GridRow>

      <GridRow cols="repeat(3, 1fr)">
        <InputWrapper>
          <Lbl>City</Lbl>
          <Select
            name="city"
            value={formData.city}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, city: e.target.value }))
            }
            disabled={!formData.state || loadingCities}
          >
            <option value="">
              {loadingCities ? "Loading cities..." : "Select City"}
            </option>
            {cities.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Lbl>Pincode</Lbl>
          <Input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            placeholder="Enter pincode"
          />
        </InputWrapper>

        <InputWrapper>
          <Lbl>KGST / TIN Number</Lbl>
          <Input
            type="text"
            name="kgstTinNumber"
            value={formData.kgstTinNumber}
            onChange={handleInputChange}
            placeholder="Enter KGST/TIN number"
          />
        </InputWrapper>
      </GridRow>

      {/* Contact */}
      <SectionDivider>Contact & Payment</SectionDivider>
      <GridRow cols="repeat(3, 1fr)">
        <InputWrapper>
          <Lbl>Contact Person</Lbl>
          <Input
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleInputChange}
            placeholder="Enter contact person"
          />
        </InputWrapper>

        <InputWrapper>
          <Lbl>Phone</Lbl>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
          />
        </InputWrapper>

        <InputWrapper>
          <Lbl>Email</Lbl>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
          />
        </InputWrapper>
      </GridRow>

      <GridRow cols="repeat(3, 1fr)" mb="0">
        <InputWrapper>
          <Lbl>Payment</Lbl>
          <Select
            name="payment"
            value={formData.payment}
            onChange={handleInputChange}
          >
            <option value="">Select Payment Mode</option>
            <option value="CASH">CASH</option>
            <option value="CHEQUE">CHEQUE</option>
            <option value="UPI">UPI</option>
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
          </Select>
        </InputWrapper>

        <InputWrapper style={{ gridColumn: "span 2" }}>
          <Lbl>Terms</Lbl>
          <TextArea
            name="terms"
            value={formData.terms}
            onChange={handleInputChange}
            placeholder="Enter payment terms"
            rows={2}
          />
        </InputWrapper>
      </GridRow>

      <ButtonContainer>
        <Button secondary onClick={onCancel}>
          <X size={14} /> {isModal ? "Close" : "Cancel"}
        </Button>
        <Button onClick={handleSubmit}>
          <Save size={14} /> Save Vendor
        </Button>
      </ButtonContainer>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Mini Modal — used from TravellersIN.js
// ─────────────────────────────────────────────────────────────────────────────
export const AddVendorMiniModal = ({ onClose, onSuccess }) => (
  <MiniOverlay onClick={onClose}>
    <MiniBox onClick={(e) => e.stopPropagation()}>
      <MiniHead>
        <MiniTitle>Add New Vendor</MiniTitle>
        <CloseBtn onClick={onClose}>
          <X size={18} />
        </CloseBtn>
      </MiniHead>
      <MiniBody>
        <VendorForm
          isModal
          onSuccess={(newVendor) => {
            if (onSuccess) onSuccess(newVendor);
          }}
          onCancel={onClose}
        />
      </MiniBody>
    </MiniBox>
  </MiniOverlay>
);

// ─────────────────────────────────────────────────────────────────────────────
// Full page — /AddVendor
// ─────────────────────────────────────────────────────────────────────────────
const AddVendor = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <PageTitle>Add New Vendor</PageTitle>
          <Button
            secondary
            onClick={() => navigate(-1)}
            style={{ fontSize: "0.8rem", padding: "5px 12px" }}
          >
            <ArrowLeft size={14} /> Back
          </Button>
        </PageHeader>

        <div style={{ padding: 16 }}>
          <Card>
            <CardHeader>🏢 Vendor Details</CardHeader>
            <CardBody>
              <VendorForm
                onSuccess={() => navigate(-1)}
                onCancel={() => navigate(-1)}
              />
            </CardBody>
          </Card>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default AddVendor;
