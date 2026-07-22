import React, { useState, useRef, useEffect, useCallback } from "react";
import apiRequest from "../apiRequest";
import { toast } from "react-toastify";
import { useOutlet } from "../OutletContext";
import {
  FaPlus,
  FaSave,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaCalendarAlt,
  FaPrint,
} from "react-icons/fa";

import {
  colors,
  Container,
  PremiumHeader as Header,
  PremiumTitle as Title,
  PremiumSubheading as Subheading,
  FormRow,
  FormGroup,
  Label,
  InputWrapper,
  IconWrapper,
  Input,
  AddButtonContainer,
  AddButton,
  ButtonGroup,
  Button,
  Table,
  Th,
  Td,
  TableActionButton,
  SubTable,
  SubTh,
  SubTd,
  PremiumStatusText as StatusText,
} from "../StyledComponents";
import styled from "styled-components";

const FiltersSection = styled.div`
  background: rgba(252, 239, 238, 0.6);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid rgba(232, 200, 208, 0.5);
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StyledFormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toRomanNumeral = (num) => {
  if (!num || num < 1) return "";
  const romanMap = [
    { value: 1000, numeral: "M" },
    { value: 900, numeral: "CM" },
    { value: 500, numeral: "D" },
    { value: 400, numeral: "CD" },
    { value: 100, numeral: "C" },
    { value: 90, numeral: "XC" },
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" },
  ];
  let result = "";
  for (const { value, numeral } of romanMap) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
};

const getIntentStatus = (items) => {
  if (!items || items.length === 0) return "Pending";

  const statuses = items.map((i) => {
    switch (i.status) {
      case "Approve":
        return "Approved";
      case "Partially Approve":
        return "Partially Approved";
      case "Reject":
        return "Rejected";
      default:
        return i.status || "Pending";
    }
  });

  // If any item is still Pending → whole intent is Pending
  if (statuses.includes("Pending")) return "Pending";

  // All items same status
  if (statuses.every((s) => s === "Approved")) return "Approved";
  if (statuses.every((s) => s === "Rejected")) return "Rejected";
  if (statuses.every((s) => s === "Partially Approved"))
    return "Partially Approved";

  // Mixed statuses (no Pending) — any partial approval or mix = Partially Approved
  if (statuses.includes("Partially Approved")) return "Partially Approved";

  // Mix of Approved + Rejected only = Partially Approved
  if (statuses.includes("Approved") && statuses.includes("Rejected"))
    return "Partially Approved";

  // Fallback
  if (statuses.includes("Approved")) return "Approved";
  if (statuses.includes("Rejected")) return "Rejected";

  return "Pending";
};

const printTableRef = (
  items,
  fromDate = "",
  toDate = "",
  createdBy = "Unknown User",
  outletName = "Outlet",
) => {
  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "";

  const tableHtml = `
    <div style="text-align:center;font-weight:bold;font-size:18px;">${outletName} Indent Request</div>
    ${fromDate || toDate ? `<div style="margin:10px 0;font-size:14px;">Date: ${fmt(fromDate)}${fromDate && toDate ? " – " : ""}${fmt(toDate)}</div>` : ""}
    <table style="width:100%;border-collapse:collapse;font-family:'Segoe UI',sans-serif;margin-top:20px;">
      <thead>
        <tr>
          <th style="background:#f2f2f2;color:black;font-weight:bold;border:1px solid #d6f0ff;padding:12px;text-align:left;">S.No</th>
          <th style="background:#f2f2f2;color:black;font-weight:bold;border:1px solid #d6f0ff;padding:12px;text-align:left;">Item Name</th>
          <th style="background:#f2f2f2;color:black;font-weight:bold;border:1px solid #d6f0ff;padding:12px;text-align:left;">Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${items.length > 0
      ? items
        .map(
          (item, idx) => `
              <tr>
                <td style="border:1px solid #d6f0ff;padding:12px;">${idx + 1}</td>
                <td style="border:1px solid #d6f0ff;padding:12px;">${item.itemName || "—"}</td>
                <td style="border:1px solid #d6f0ff;padding:12px;">${item.quantity}</td>
              </tr>`,
        )
        .join("")
      : `<tr><td colspan="3" style="border:1px solid #d6f0ff;padding:12px;text-align:center;">No items added yet.</td></tr>`
    }
      </tbody>
    </table>
    <div style="margin-top:40px;display:flex;justify-content:flex-end;font-size:14px;font-style:italic;">
      Prepared by: <b style="margin-left:6px;">${createdBy}</b>
    </div>`;

  const printWin = window.open("", "_blank", "width=800,height=600");
  printWin.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #d6f0ff; padding: 12px; text-align: left; }
          th { background-color: #00bfff; color: white; }
        </style>
      </head>
      <body>${tableHtml}</body>
    </html>`);
  printWin.document.close();
  printWin.focus();
  printWin.print();
  printWin.close();
};

// ─────────────────────────────────────────────────────────────────────────────

function TravellersIntent() {
  const { selectedOutlet } = useOutlet();
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [savedIntents, setSavedIntents] = useState([]);
  const [filters, setFilters] = useState({
    from_date: new Date().toISOString().split("T")[0],
    to_date: new Date().toISOString().split("T")[0],
  });
  const [expandedIntents, setExpandedIntents] = useState(new Set());
  const [editingIntentNumber, setEditingIntentNumber] = useState(null);
  const [editingDate, setEditingDate] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [hsnNumber, setHsnNumber] = useState("");
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const printRef = useRef();
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // ── Resolve itemName from availableItems using item_id or hsn ────────────
  const getItemName = useCallback(
    (item) => {
      const matched = availableItems.find(
        (i) =>
          String(i.item_id) === String(item.item_id) ||
          (item.hsn && String(i.hsn) === String(item.hsn)),
      );
      return matched?.itemName || item.itemName || "—";
    },
    [availableItems],
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) setShowDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handlePrintIntent = (intent) => {
    const safeItems = Array.isArray(intent.items)
      ? intent.items
      : typeof intent.items === "string"
        ? JSON.parse(intent.items || "[]")
        : [];
    const printItems = safeItems.map((it) => ({
      ...it,
      itemName: getItemName(it),
    }));
    printTableRef(
      printItems,
      filters.from_date,
      filters.to_date,
      intent.created_by,
      selectedOutlet?.outlet_name || "Outlet",
    ); // ← pass created_by & outletName
  };

  // ── Fetch available items for dropdown ───────────────────────────────────
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const result = await apiRequest(
          `${StoreTrustbaseurl}items/list/`,
          "GET",
        );
        if (result.success) {
          const filtered = (result.data || []).filter(
            (item) => item.hsn && item.hsn.trim() !== "",
          );
          setAvailableItems(filtered);
        } else {
          setAvailableItems([]);
        }
      } catch {
        setAvailableItems([]);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, [StoreTrustbaseurl]);

  const fetchSavedData = useCallback(async () => {
    try {
      const outletCode = selectedOutlet?.outlet_code || "";
      let url = `${StoreTrustbaseurl}travellers-intent/by-date-range/?outlet_code=${encodeURIComponent(outletCode)}`;
      if (filters.from_date) url += `&from_date=${filters.from_date}`;
      if (filters.to_date) url += `&to_date=${filters.to_date}`;

      const response = await apiRequest(url, "GET");
      if (response.success) {
        const parsedData = (response.data || [])
          .filter((intent) => intent.is_active !== false)
          .map((intent) => ({
            ...intent,
            items: (typeof intent.items === "string"
              ? JSON.parse(intent.items)
              : intent.items
            ).filter((item) => item.is_active !== false),
          }));
        setSavedIntents(parsedData);
      }
    } catch {
      toast.error("Something went wrong while fetching saved data.");
    }
  }, [StoreTrustbaseurl, filters.from_date, filters.to_date, selectedOutlet?.outlet_code]);

  useEffect(() => {
    fetchSavedData();
  }, [fetchSavedData]);

  // ── Add item to local list ───────────────────────────────────────────────
  const handleAddToList = () => {
    if (!itemName || !quantity) {
      toast.warn("Please enter item name and quantity");
      return;
    }
    // Look up item_id from availableItems by itemName
    const matched = availableItems.find((i) => i.itemName === itemName);
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        date,
        item_id: matched?.item_id
          ? String(matched.item_id)
          : String(Date.now()),
        hsn: hsnNumber,
        status: "Pending",
        is_active: true,
        quantity: parseInt(quantity, 10),
      },
    ]);
    setItemName("");
    setQuantity("");
    setSelectedItem("");
    setHsnNumber("");
  };

  // ── Save all items to backend ────────────────────────────────────────────
  const handleSaveAll = async () => {
    if (items.length === 0) {
      toast.warn("No items to save.");
      return;
    }
    try {
      const payloadItems = items.map((it) => ({
        item_id: it.item_id,
        hsn: it.hsn,
        quantity: it.quantity,
        status: "Pending",
        is_active: true,
      }));

      const outletCode = selectedOutlet?.outlet_code || "";
      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-intent/`,
        "POST",
        { date, items: payloadItems, outlet_code: outletCode },
      );
      if (!response.success)
        throw new Error(response.error || "Failed to save items");

      toast.success("Successfully saved");
      setItems([]);
      setHsnNumber("");
      fetchSavedData();

      // ── Read current user from localStorage ──────────────────────────────
      const currentUser = localStorage.getItem("name") || "Unknown User";

      const printItems = payloadItems.map((it) => ({
        ...it,
        itemName: getItemName(it),
      }));
      printTableRef(
        printItems,
        filters.from_date,
        filters.to_date,
        currentUser,
        selectedOutlet?.outlet_name || "Outlet",
      ); // ← pass currentUser & outletName
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const handleDeleteSavedItem = async (
    intentNumber,
    intentDate,
    itemId,
    itemHsn,
  ) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-intent/soft-delete-item/?intent_number=${encodeURIComponent(intentNumber)}&date=${intentDate}&item_id=${itemId}`,
        "DELETE",
        {
          intent_number: intentNumber,
          date: intentDate,
          item_id: itemId,
          quantity: parseInt(editedQuantity || "0", 10),
          hsn: itemHsn || "",
        },
      );
      if (response.success) {
        toast.success("Item soft-deleted successfully");
        await fetchSavedData();
      } else toast.error("Failed to delete item.");
    } catch {
      toast.error("Error deleting item.");
    }
  };

  const handleDeleteAllByIntent = async (intentNumber, intentDate) => {
    if (!intentNumber || !intentDate) {
      toast.error("Missing intent number or date.");
      return;
    }
    if (!window.confirm(`Delete all items for intent ${intentNumber}?`)) return;
    try {
      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-intent/soft-delete-intent/?intent_number=${encodeURIComponent(intentNumber)}&date=${intentDate}`,
        "DELETE",
      );
      if (response.success) {
        toast.success("All items deleted successfully");
        setExpandedIntents((prev) => {
          const s = new Set(prev);
          s.delete(intentNumber);
          return s;
        });
        setSavedIntents((prev) =>
          prev.filter(
            (i) => !(i.intent_number === intentNumber && i.date === intentDate),
          ),
        );
      } else {
        toast.error(`Failed: ${response.error || "Unknown error"}`);
      }
    } catch {
      toast.error("Error deleting all items.");
    }
  };

  const handleEditSavedItem = (intent, item) => {
    const intentId = intent.intent_number || intent.id;
    const itemId = item.item_id || item.id;
    if (!intentId) {
      toast.error("Indent identifier not found.");
      return;
    }
    if (!itemId) {
      toast.error("Item identifier not found.");
      return;
    }
    setEditingIntentNumber(intentId);
    setEditingDate(intent.date);
    setEditingItemId(itemId);
    setEditedQuantity(String(item.quantity));
    setHsnNumber(item.hsn || "");
  };

  const handleCancelEdit = () => {
    setEditingIntentNumber(null);
    setEditingDate(null);
    setEditingItemId(null);
    setEditedQuantity("");
    setHsnNumber("");
  };

  const handleSaveEditedItem = async () => {
    if (!editedQuantity) {
      toast.warn("Please enter a valid quantity.");
      return;
    }
    if (!editingIntentNumber || !editingDate || !editingItemId) {
      toast.error("Missing identifiers.");
      return;
    }
    try {
      const outletCode = selectedOutlet?.outlet_code || "";
      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-intent/update-item/`,
        "PATCH",
        {
          intent_number: editingIntentNumber,
          date: editingDate,
          outlet_code: outletCode,
          items: [
            {
              item_id: editingItemId,
              quantity: parseInt(editedQuantity, 10),
              hsn: hsnNumber || "",
              status: "Pending",
              is_active: true,
            },
          ],
        },
      );
      if (response.success) {
        toast.success("Item updated successfully.");
        handleCancelEdit();
        await fetchSavedData();
      } else toast.error(`Failed to update: ${response.error || "Unknown error"}`);
    } catch {
      toast.error("Error updating item.");
    }
  };



  const handleToggleView = (intentNumber) => {
    setExpandedIntents((prev) => {
      const s = new Set(prev);
      s.has(intentNumber) ? s.delete(intentNumber) : s.add(intentNumber);
      return s;
    });
  };

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ from_date: "", to_date: "" });

  return (
    <Container>
      <Header>
        <Title>{selectedOutlet?.outlet_name || "Outlet"} Indent Form</Title>
      </Header>

      {/* ── Form Row ── */}
      <StyledFormRow>
        {/* Date */}
        <FormGroup style={{ flex: 1 }}>
          <Label>Date</Label>
          <InputWrapper>
            <IconWrapper>
              <FaCalendarAlt />
            </IconWrapper>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ paddingLeft: "35px" }}
            />
          </InputWrapper>
        </FormGroup>

        {/* Item Name */}
        <FormGroup style={{ flex: 1 }}>
          <Label>Item Name</Label>
          <InputWrapper
            className="dropdown-container"
            style={{ position: "relative" }}
          >
            <input
              type="text"
              value={selectedItem}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setSelectedItem(e.target.value);
                setItemName(e.target.value);
                setHsnNumber("");
                setShowDropdown(true);
              }}
              placeholder={loadingItems ? "Loading..." : "Type or select item"}
              style={{
                width: "100%",
                padding: "8px 32px 8px 10px",
                borderRadius: "6px",
                fontSize: "0.82rem",
                outline: "none",
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                color: colors.textMain,
              }}
            />
            <FaChevronDown
              onClick={() => setShowDropdown((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: colors.textMuted,
              }}
            />
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  left: 0,
                  width: "100%",
                  maxHeight: "180px",
                  overflowY: "auto",
                  backgroundColor: "#fff",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "6px",
                  zIndex: 10,
                  boxShadow: "0 4px 12px rgba(102,37,73,0.1)",
                }}
              >
                {availableItems
                  .filter((item) =>
                    item.itemName
                      .toLowerCase()
                      .includes(selectedItem.toLowerCase()),
                  )
                  .slice(0, 30)
                  .map((item) => (
                    <div
                      key={item.item_id || item.id}
                      onClick={() => {
                        setSelectedItem(item.itemName);
                        setItemName(item.itemName);
                        setHsnNumber(item.hsn || "");
                        setShowDropdown(false);
                      }}
                      style={{
                        padding: "8px 10px",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        color: colors.textMain,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = colors.tabBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fff")
                      }
                    >
                      {item.itemName}
                    </div>
                  ))}
              </div>
            )}
          </InputWrapper>
        </FormGroup>

        {/* HSN */}
        <FormGroup style={{ flex: 1 }}>
          <Label>HSN Number</Label>
          <Input
            type="text"
            value={hsnNumber}
            readOnly
            placeholder="HSN will appear here"
          />
        </FormGroup>

        {/* Quantity */}
        <FormGroup style={{ flex: 1 }}>
          <Label>Quantity</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
        </FormGroup>
      </StyledFormRow>

      <AddButtonContainer>
        <AddButton onClick={handleAddToList}>
          <FaPlus /> Add
        </AddButton>
      </AddButtonContainer>

      {/* ── Items List ── */}
      <div style={{ marginTop: "20px" }}>
        <Subheading>Items List</Subheading>
        <div ref={printRef}>
          <Table>
            <thead>
              <tr>
                <Th>S.No</Th>
                <Th>Item Name</Th>
                <Th>Quantity</Th>
                <Th>Delete Item</Th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={item.id}>
                    <Td>{index + 1}</Td>
                    {/* Resolve name from availableItems */}
                    <Td>{getItemName(item)}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>
                      <TableActionButton
                        onClick={() =>
                          setItems(items.filter((i) => i.id !== item.id))
                        }
                        color={colors.danger}
                        title="Remove"
                      >
                        <FaTrash />
                      </TableActionButton>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan="4" style={{ textAlign: "center" }}>
                    No items added yet.
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>

          <ButtonGroup>
            <Button onClick={handleSaveAll}>
              <FaSave /> Save
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* ── Saved Intents ── */}
      <div style={{ marginTop: "40px" }}>
        <Subheading>Saved {selectedOutlet?.outlet_name || "Outlet"} Indents</Subheading>

        <FiltersSection>
          <FiltersGrid>
            <FormGroup>
              <Label>From Date</Label>
              <InputWrapper>
                <IconWrapper>
                  <FaCalendarAlt />
                </IconWrapper>
                <Input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) =>
                    handleFilterChange("from_date", e.target.value)
                  }
                  style={{ paddingLeft: "35px" }}
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>To Date</Label>
              <InputWrapper>
                <IconWrapper>
                  <FaCalendarAlt />
                </IconWrapper>
                <Input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) =>
                    handleFilterChange("to_date", e.target.value)
                  }
                  style={{ paddingLeft: "35px" }}
                />
              </InputWrapper>
            </FormGroup>

            <ButtonGroup
              style={{
                justifyContent: "flex-end",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <Button secondary onClick={clearFilters}>
                Clear
              </Button>
            </ButtonGroup>
          </FiltersGrid>
        </FiltersSection>

        <Table>
          <thead>
            <tr>
              <Th>S.No</Th>
              <Th>Date</Th>
              <Th>Indent Number</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {savedIntents.length > 0 ? (
              savedIntents.map((intent, index) => {
                const intentId = intent.intent_number || intent.id;
                const isExpanded = expandedIntents.has(intentId);
                const intentStatus = getIntentStatus(intent.items);
                const allNonPending =
                  Array.isArray(intent.items) &&
                  intent.items.length > 0 &&
                  intent.items.every((item) => item.status !== "Pending");

                return (
                  <React.Fragment key={`${intentId}-${intent.date}`}>
                    <tr>
                      <Td>{index + 1}</Td>
                      <Td>
                        {new Date(intent.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Td>
                      <Td>{intentId}</Td>

                      {/* ── Intent Status Badge ── */}
                      <Td>
                        <span
                          style={{
                            padding: "2px 10px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            backgroundColor:
                              intentStatus === "Approved"
                                ? "#d4edda"
                                : intentStatus === "Rejected"
                                  ? "#f8d7da"
                                  : intentStatus === "Partially Approved"
                                    ? "#cce5ff"
                                    : "#fff3cd",
                            color:
                              intentStatus === "Approved"
                                ? "#155724"
                                : intentStatus === "Rejected"
                                  ? "#721c24"
                                  : intentStatus === "Partially Approved"
                                    ? "#004085"
                                    : "#856404",
                          }}
                        >
                          {intentStatus}
                        </span>
                      </Td>

                      {/* ── Actions ── */}
                      <Td>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            justifyContent: "center",
                          }}
                        >
                          {/* View / Hide */}
                          <TableActionButton
                            onClick={() => handleToggleView(intentId)}
                            color={colors.primary}
                            title={isExpanded ? "Hide" : "View"}
                          >
                            {isExpanded ? <FaEyeSlash /> : <FaEye />}
                          </TableActionButton>
                          {/* Print */}
                          <TableActionButton
                            onClick={() => handlePrintIntent(intent)}
                            color={colors.primary}
                            title="Print"
                          >
                            <FaPrint />
                          </TableActionButton>

                          {/* Delete All — disabled if all items are non-Pending */}
                          <TableActionButton
                            onClick={() =>
                              allNonPending
                                ? null
                                : handleDeleteAllByIntent(intentId, intent.date)
                            }
                            color={colors.danger}
                            title={
                              allNonPending
                                ? "Cannot delete — no Pending items"
                                : "Delete All"
                            }
                            disabled={allNonPending}
                            style={{
                              opacity: allNonPending ? 0.35 : 1,
                              cursor: allNonPending ? "not-allowed" : "pointer",
                            }}
                          >
                            <FaTrash />
                          </TableActionButton>
                        </div>
                      </Td>
                    </tr>

                    {/* ── Expanded Sub-Table ── */}
                    {isExpanded && (
                      <tr>
                        <Td colSpan="5">
                          <SubTable>
                            <thead>
                              <tr>
                                <SubTh>Item Name</SubTh>
                                <SubTh>Requested Quantity</SubTh>
                                <SubTh>Status</SubTh>
                                <SubTh>Approved Quantity</SubTh>
                                <SubTh>Dispatch Status</SubTh>
                                <SubTh>Actions</SubTh>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(intent.items) &&
                                intent.items.length > 0 ? (
                                intent.items.map((item, itemIndex) => {
                                  const itemKey = item.item_id || item.id;
                                  const isEditing =
                                    editingIntentNumber === intentId &&
                                    editingDate === intent.date &&
                                    editingItemId === itemKey;
                                  const isPending =
                                    item.status === "Pending" || !item.status;

                                  return (
                                    <tr key={`${intentId}-${itemKey}`}>
                                      {/* Item Name — resolved from availableItems */}
                                      <SubTd>
                                        {`${toRomanNumeral(itemIndex + 1)}. ${getItemName(item)}`}
                                      </SubTd>

                                      {/* Requested Quantity */}
                                      <SubTd>
                                        {isEditing ? (
                                          <Input
                                            type="number"
                                            value={editedQuantity}
                                            onChange={(e) =>
                                              setEditedQuantity(e.target.value)
                                            }
                                          />
                                        ) : (
                                          item.quantity
                                        )}
                                      </SubTd>

                                      {/* Item Status Badge */}
                                      <SubTd>
                                        <span
                                          style={{
                                            padding: "2px 8px",
                                            borderRadius: "12px",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            backgroundColor:
                                              item.status === "Approved" ||
                                                item.status === "Approve"
                                                ? "#d4edda"
                                                : item.status === "Rejected" ||
                                                  item.status === "Reject"
                                                  ? "#f8d7da"
                                                  : item.status ===
                                                    "Partially Approved" ||
                                                    item.status ===
                                                    "Partially Approve"
                                                    ? "#cce5ff"
                                                    : "#fff3cd",
                                            color:
                                              item.status === "Approved" ||
                                                item.status === "Approve"
                                                ? "#155724"
                                                : item.status === "Rejected" ||
                                                  item.status === "Reject"
                                                  ? "#721c24"
                                                  : item.status ===
                                                    "Partially Approved" ||
                                                    item.status ===
                                                    "Partially Approve"
                                                    ? "#004085"
                                                    : "#856404",
                                          }}
                                        >
                                          {item.status === "Approve"
                                            ? "Approved"
                                            : item.status === "Reject"
                                              ? "Rejected"
                                              : item.status ===
                                                "Partially Approve"
                                                ? "Partially Approved"
                                                : item.status || "Pending"}
                                        </span>
                                      </SubTd>

                                      {/* Approved Quantity */}
                                      <SubTd>
                                        <span
                                          style={{
                                            padding: "2px 8px",
                                            borderRadius: "12px",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            backgroundColor:
                                              item.approved > 0
                                                ? "#d4edda"
                                                : "#fff3cd",
                                            color:
                                              item.approved > 0
                                                ? "#155724"
                                                : "#856404",
                                          }}
                                        >
                                          {item.approved ?? 0}
                                        </span>
                                      </SubTd>

                                      {/* Dispatch Status */}
                                      <SubTd>
                                        <StatusText
                                          className={`status-${item.is_dispatch ? "dispatched" : "not-dispatched"}`}
                                          style={{ padding: "2px 8px", fontSize: "0.72rem" }}
                                        >
                                          {item.is_dispatch ? "Dispatched" : "Not Dispatched"}
                                        </StatusText>
                                      </SubTd>

                                      {/* Actions */}
                                      <SubTd>
                                        <div
                                          style={{
                                            display: "flex",
                                            gap: "4px",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {isEditing ? (
                                            <>
                                              <TableActionButton
                                                onClick={handleSaveEditedItem}
                                                color={colors.success}
                                                title="Save"
                                              >
                                                <FaSave />
                                              </TableActionButton>
                                              <TableActionButton
                                                onClick={handleCancelEdit}
                                                color={colors.danger}
                                                title="Cancel"
                                              >
                                                <FaTrash />
                                              </TableActionButton>
                                            </>
                                          ) : (
                                            <>
                                              {/* Edit — disabled if not Pending */}
                                              <TableActionButton
                                                onClick={() =>
                                                  isPending
                                                    ? handleEditSavedItem(
                                                      intent,
                                                      item,
                                                    )
                                                    : null
                                                }
                                                color={colors.textMain}
                                                title={
                                                  isPending
                                                    ? "Edit"
                                                    : "Cannot edit — not Pending"
                                                }
                                                disabled={!isPending}
                                                style={{
                                                  opacity: !isPending
                                                    ? 0.35
                                                    : 1,
                                                  cursor: !isPending
                                                    ? "not-allowed"
                                                    : "pointer",
                                                }}
                                              >
                                                <FaEdit />
                                              </TableActionButton>

                                              {/* Delete — disabled if not Pending */}
                                              <TableActionButton
                                                onClick={() =>
                                                  isPending
                                                    ? handleDeleteSavedItem(
                                                      intentId,
                                                      intent.date,
                                                      item.item_id || item.id,
                                                      item.hsn || "",
                                                    )
                                                    : null
                                                }
                                                color={colors.danger}
                                                title={
                                                  isPending
                                                    ? "Delete"
                                                    : "Cannot delete — not Pending"
                                                }
                                                disabled={!isPending}
                                                style={{
                                                  opacity: !isPending
                                                    ? 0.35
                                                    : 1,
                                                  cursor: !isPending
                                                    ? "not-allowed"
                                                    : "pointer",
                                                }}
                                              >
                                                <FaTrash />
                                              </TableActionButton>
                                            </>
                                          )}
                                        </div>
                                      </SubTd>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <SubTd
                                    colSpan="6"
                                    style={{ textAlign: "center" }}
                                  >
                                    No items available
                                  </SubTd>
                                </tr>
                              )}
                            </tbody>
                          </SubTable>
                        </Td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <Td colSpan="5" style={{ textAlign: "center" }}>
                  No saved indents found.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default TravellersIntent;
