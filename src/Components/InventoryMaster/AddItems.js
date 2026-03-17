import React, { useState, useEffect } from "react";
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
  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
    color: ${colors.textMuted};
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
  width: 620px;
  box-shadow: 0 20px 60px rgba(102, 37, 73, 0.25);
  overflow: hidden;
`;

const MiniHead = styled.div`
  background: ${colors.tabBg};
  padding: 12px 16px;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MiniTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${colors.primary};
`;

const MiniBody = styled.div`
  padding: 20px 16px;
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
// ItemForm — one API call, all filtering done client-side
// ─────────────────────────────────────────────────────────────────────────────
const ItemForm = ({ onSuccess, onCancel, isModal = false }) => {
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  const EMPTY_FORM = {
    itemName: "",
    group: "",
    group_type: "",
    category: "",
    classification: "",
    hsn: "",
    stockReorderLevel: "",
  };

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // ── Raw data from single API call ────────────────────────────────────────
  const [allData, setAllData] = useState({
    groups: [], // [{ group, category, classification }] — raw items
    categories: [],
    classifications: [],
  });

  // ── Fetch ALL dropdown data once on mount ────────────────────────────────
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const result = await apiRequest(
          `${StoreTrustbaseurl}items/dropdowns/`,
          "GET",
        );
        if (result.success) {
          setAllData({
            groups: result.data.groups || [],
            categories: result.data.categories || [],
            classifications: result.data.classifications || [],
          });
        } else {
          toast.error("Failed to load dropdown options");
        }
      } catch {
        toast.error("Network error loading dropdowns");
      }
    };
    fetchDropdowns();
  }, [StoreTrustbaseurl]);

  const filteredCategories = formData.group
    ? [
        ...new Set(
          allData.categories
            .filter((c) => c.group === formData.group)
            .map((c) => c.category)
            .filter(Boolean),
        ),
      ]
    : [...new Set(allData.categories.map((c) => c.category).filter(Boolean))];

  const filteredClassifications = [
    ...new Set(
      allData.classifications
        .filter((c) => (formData.group ? c.group === formData.group : true))
        .filter((c) =>
          formData.category ? c.category === formData.category : true,
        )
        .map((c) => c.classification)
        .filter(Boolean),
    ),
  ];

  // ── Handle field change ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "group") {
      // Reset dependent fields when group changes
      setFormData((prev) => ({
        ...prev,
        group: value,
        category: "",
        classification: "",
      }));
      return;
    }

    if (name === "category") {
      // Reset classification when category changes
      setFormData((prev) => ({
        ...prev,
        category: value,
        classification: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData(EMPTY_FORM);

  const handleSubmit = async () => {
    const required = {
      itemName: "Item Name",
      group: "Group",
      group_type: "Group Type",
      category: "Category",
      classification: "Classification",
      stockReorderLevel: "Stock Reorder Level",
    };
    const missing = Object.entries(required)
      .filter(([f]) => !formData[f] || formData[f].trim() === "")
      .map(([, l]) => l);

    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    try {
      setSubmitting(true);
      const result = await apiRequest(
        `${StoreTrustbaseurl}items/`,
        "POST",
        formData,
      );
      if (result.success) {
        toast.success("Item added successfully!");
        if (isModal) {
          resetForm();
          if (onSuccess) onSuccess(result.data);
        } else {
          if (onSuccess) onSuccess();
        }
      } else {
        if (result.data?.errors) {
          Object.entries(result.data.errors).forEach(([f, m]) =>
            toast.error(`${f}: ${Array.isArray(m) ? m.join(", ") : m}`),
          );
        } else {
          toast.error(result.error || "Unknown error occurred");
        }
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Row 1: Item Name, Group Type, Group ── */}
      <GridRow cols="repeat(3, 1fr)">
        <InputWrapper>
          <Lbl>
            Item Name <RequiredMark>*</RequiredMark>
          </Lbl>
          <Input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Enter item name"
          />
        </InputWrapper>

        <InputWrapper>
          <Lbl>
            Group Type <RequiredMark>*</RequiredMark>
          </Lbl>
          <Select
            name="group_type"
            value={formData.group_type}
            onChange={handleChange}
          >
            <option value="">Select Group Type</option>
            <option value="Service">Service</option>
            <option value="Product">Product</option>
            <option value="Asset">Asset</option>
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Lbl>
            Group <RequiredMark>*</RequiredMark>
          </Lbl>
          <Select name="group" value={formData.group} onChange={handleChange}>
            <option value="">Select Group</option>
            {allData.groups.map((g, i) => (
              <option key={i} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </InputWrapper>
      </GridRow>

      {/* ── Row 2: Category, Classification, HSN, Reorder Level ── */}
      <GridRow cols="repeat(4, 1fr)" mb="0">
        <InputWrapper>
          <Lbl>
            Category <RequiredMark>*</RequiredMark>
          </Lbl>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={!formData.group}
          >
            <option value="">
              {formData.group ? "Select Category" : "Select Group first"}
            </option>
            {filteredCategories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Lbl>
            Classification <RequiredMark>*</RequiredMark>
          </Lbl>
          <Select
            name="classification"
            value={formData.classification}
            onChange={handleChange}
            disabled={!formData.group}
          >
            <option value="">
              {formData.group ? "Select Classification" : "Select Group first"}
            </option>
            {filteredClassifications.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Lbl>HSN</Lbl>
          <Input
            type="text"
            name="hsn"
            value={formData.hsn}
            onChange={handleChange}
            placeholder="Enter HSN code"
          />
        </InputWrapper>

        <InputWrapper>
          <Lbl>
            Stock Reorder Level <RequiredMark>*</RequiredMark>
          </Lbl>
          <Input
            type="number"
            name="stockReorderLevel"
            value={formData.stockReorderLevel}
            onChange={handleChange}
            placeholder="Enter level"
          />
        </InputWrapper>
      </GridRow>

      <ButtonContainer>
        <Button secondary onClick={onCancel}>
          <X size={14} /> {isModal ? "Close" : "Cancel"}
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          <Save size={14} /> {submitting ? "Saving…" : "Save Item"}
        </Button>
      </ButtonContainer>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Mini Modal export
// ─────────────────────────────────────────────────────────────────────────────
export const AddItemMiniModal = ({ onClose, onSuccess }) => (
  <MiniOverlay onClick={onClose}>
    <MiniBox onClick={(e) => e.stopPropagation()}>
      <MiniHead>
        <MiniTitle>Add New Item</MiniTitle>
        <CloseBtn onClick={onClose}>
          <X size={18} />
        </CloseBtn>
      </MiniHead>
      <MiniBody>
        <ItemForm
          isModal
          onSuccess={(newItem) => {
            if (onSuccess) onSuccess(newItem);
          }}
          onCancel={onClose}
        />
      </MiniBody>
    </MiniBox>
  </MiniOverlay>
);

// ─────────────────────────────────────────────────────────────────────────────
// Full page
// ─────────────────────────────────────────────────────────────────────────────
const AddItems = () => {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <PageTitle>Add New Item</PageTitle>
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
            <CardHeader>📦 Item Details</CardHeader>
            <CardBody>
              <ItemForm
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

export default AddItems;
