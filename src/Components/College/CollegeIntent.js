// CollegeIntent.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import apiRequest from "../apiRequest";
import {
  FaPlus,
  FaSave,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  Container,
  Header,
  Title,
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
  Subheading,
  Table,
  Th,
  Td,
  TableActionButton,
  SubTable,
  SubTh,
  SubTd,
  FiltersSection,
  FiltersGrid,
} from "../StyledComponents";

// Helper: Roman numerals
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

function CollegeIntent() {
  const [date, setDate] = useState(() =>
    new Date().toISOString().split("T")[0]
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
  const [editedItemName, setEditedItemName] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [hsnNumber, setHsnNumber] = useState("");
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const printRef = useRef();
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // Fetch items list
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const result = await apiRequest(`${StoreTrustbaseurl}items/list/`, "GET");
        if (result.success) {
          setAvailableItems(result.data || []);
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
      let url = `${StoreTrustbaseurl}college-intent/by-date-range/`;
      const params = [];
      if (filters.from_date) params.push(`from_date=${filters.from_date}`);
      if (filters.to_date) params.push(`to_date=${filters.to_date}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      const response = await apiRequest(url, "GET");
      if (response.success) {
        const parsedData = (response.data || []).map((intent) => ({
          ...intent,
          items:
            typeof intent.items === "string"
              ? JSON.parse(intent.items)
              : intent.items,
        }));
        setSavedIntents(parsedData);
      }
    } catch {
      alert("Error fetching saved data.");
    }
  }, [StoreTrustbaseurl, filters.from_date, filters.to_date]);

  useEffect(() => {
    fetchSavedData();
  }, [fetchSavedData]);

  const handleItemChange = (e) => {
    const selectedName = e.target.value;
    setSelectedItem(selectedName);
    setItemName(selectedName);
    const obj = availableItems.find((i) => i.itemName === selectedName);
    setHsnNumber(obj ? obj.hsn || "" : "");
  };

  const handleAddToList = () => {
    if (!itemName || !quantity) {
      alert("Please enter item name and quantity");
      return;
    }
    const newItem = {
      id: Date.now(),
      date,
      itemName,
      hsn: hsnNumber,
      status: "Pending",
      is_active: true,
      quantity: parseInt(quantity, 10),
    };
    setItems((prev) => [...prev, newItem]);
    setItemName("");
    setQuantity("");
    setSelectedItem("");
    setHsnNumber("");
  };

  const handleSaveAll = async () => {
    if (items.length === 0) {
      alert("No items to save.");
      return;
    }
    try {
      const currentUser =
        localStorage.getItem("username") ||
        localStorage.getItem("user") ||
        localStorage.getItem("name") ||
        "Unknown User";
      const payloadItems = items.map((it, idx) => ({
        item_id: (idx + 1).toString(),
        itemName: it.itemName,
        quantity: it.quantity,
        hsn: it.hsn,
        status: "Pending",
        is_active: true,
        lastmodified_by: currentUser,
        intent_status: null,
      }));
      const data = { date, items: payloadItems, auth_user_id: currentUser };
      const response = await apiRequest(
        `${StoreTrustbaseurl}college-intent/`,
        "POST",
        data
      );
      if (response.success) {
        alert("Saved successfully");
        setItems([]);
        fetchSavedData();
      }
    } catch {
      alert("Error saving items.");
    }
  };

  const handleEditSavedItem = (intent, item) => {
    const intentId = intent.intent_number || intent.id;
    const itemId = item.item_id || item.id;
    setEditingIntentNumber(intentId);
    setEditingDate(intent.date);
    setEditingItemId(itemId);
    setEditedItemName(item.itemName);
    setEditedQuantity(String(item.quantity));
    setHsnNumber(item.hsn || "");
  };

  const handleCancelEdit = () => {
    setEditingIntentNumber(null);
    setEditingDate(null);
    setEditingItemId(null);
    setEditedItemName("");
    setEditedQuantity("");
    setHsnNumber("");
  };

  const handleSaveEditedItem = async () => {
    try {
      const currentUser =
        localStorage.getItem("username") ||
        localStorage.getItem("user") ||
        localStorage.getItem("name") ||
        "Unknown User";
      const data = {
        intent_number: editingIntentNumber,
        date: editingDate,
        items: [
          {
            item_id: editingItemId,
            itemName: editedItemName,
            quantity: parseInt(editedQuantity, 10),
            hsn: hsnNumber || "",
            status: "Pending",
            is_active: true,
          },
        ],
        lastmodified_by: currentUser,
        auth_user_id: currentUser,
        intent_status: null,
      };
      const response = await apiRequest(
        `${StoreTrustbaseurl}college-intent/update-item/`,
        "PATCH",
        data
      );
      if (response.success) {
        alert("Item updated successfully");
        handleCancelEdit();
        fetchSavedData();
      }
    } catch {
      alert("Error updating item.");
    }
  };

  const handleDeleteSavedItem = async (intentNumber, intentDate, itemId) => {
    const confirmDelete = window.confirm("Delete this item?");
    if (!confirmDelete) return;
    try {
      const response = await apiRequest(
        `${StoreTrustbaseurl}college-intent/soft-delete-item/?intent_number=${encodeURIComponent(
          intentNumber
        )}&date=${intentDate}&item_id=${itemId}`,
        "DELETE"
      );
      if (response.success) {
        fetchSavedData();
      }
    } catch {
      alert("Error deleting item.");
    }
  };

  const handleDeleteAllByIntent = async (intentNumber, intentDate) => {
    const confirmDelete = window.confirm("Delete all items for this intent?");
    if (!confirmDelete) return;
    try {
      const response = await apiRequest(
        `${StoreTrustbaseurl}college-intent/soft-delete-intent/?intent_number=${encodeURIComponent(
          intentNumber
        )}&date=${intentDate}`,
        "DELETE"
      );
      if (response.success) {
        setExpandedIntents((prev) => {
          const setCopy = new Set(prev);
          setCopy.delete(intentNumber);
          return setCopy;
        });
        setSavedIntents((prev) =>
          prev.filter(
            (i) =>
              !(
                i.intent_number === intentNumber && i.date === intentDate
              )
          )
        );
      }
    } catch {
      alert("Error deleting intent.");
    }
  };

  const handleToggleView = (intentNumber) => {
    setExpandedIntents((prev) => {
      const newSet = new Set(prev);
      newSet.has(intentNumber)
        ? newSet.delete(intentNumber)
        : newSet.add(intentNumber);
      return newSet;
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({ from_date: "", to_date: "" });

  return (
    <Container>
      <Header>
        <Title>College Intent Form</Title>
      </Header>

      <FormRow>
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

        <FormGroup style={{ flex: 1 }}>
          <Label>Item Name</Label>
          <InputWrapper>
            <select
              value={selectedItem}
              onChange={handleItemChange}
              disabled={loadingItems}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none",
                appearance: "none",
              }}
            >
              <option value="">
                {loadingItems ? "Loading..." : "--Select Item--"}
              </option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.itemName}>
                  {item.itemName}
                </option>
              ))}
            </select>
            <FaChevronDown
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup style={{ flex: 1 }}>
          <Label>HSN Number</Label>
          <Input type="text" value={hsnNumber} readOnly />
        </FormGroup>

        <FormGroup style={{ flex: 1 }}>
          <Label>Quantity</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </FormGroup>
      </FormRow>

      <AddButtonContainer>
        <AddButton onClick={handleAddToList}>
          <FaPlus /> Add
        </AddButton>
      </AddButtonContainer>

      <div style={{ marginTop: "20px" }}>
        <Subheading>Items List</Subheading>
        <div ref={printRef}>
          <Table>
            <thead>
              <tr>
                <Th>S.No</Th>
                <Th>Item Name</Th>
                <Th>Quantity</Th>
                <Th>Delete</Th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={item.id}>
                    <Td>{index + 1}</Td>
                    <Td>{item.itemName}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>
                      <TableActionButton
                        onClick={() =>
                          setItems(items.filter((i) => i.id !== item.id))
                        }
                        color="#e74c3c"
                      >
                        <FaTrash />
                      </TableActionButton>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan="4" align="center">
                    No items added yet.
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
          <ButtonGroup>
            <Button onClick={handleSaveAll} bg="#3498db">
              <FaSave /> Save
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <Subheading>Saved College Intents</Subheading>
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
            <ButtonGroup style={{ justifyContent: "flex-end" }}>
              <Button onClick={clearFilters} bg="#f39c12">
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
              <Th>Intent Number</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {savedIntents.length > 0 ? (
              savedIntents.map((intent, idx) => {
                const intentId = intent.intent_number || intent.id;
                const isExpanded = expandedIntents.has(intentId);
                return (
                  <React.Fragment key={`${intentId}-${intent.date}`}>
                    <tr>
                      <Td>{idx + 1}</Td>
                      <Td>
                        {new Date(intent.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Td>
                      <Td>{intentId}</Td>
                      <Td>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            justifyContent: "center",
                          }}
                        >
                          <TableActionButton
                            onClick={() => handleToggleView(intentId)}
                            color="#2980b9"
                          >
                            {isExpanded ? <FaEyeSlash /> : <FaEye />}
                          </TableActionButton>
                          <TableActionButton
                            onClick={() =>
                              handleDeleteAllByIntent(intentId, intent.date)
                            }
                            color="#e74c3c"
                          >
                            <FaTrash />
                          </TableActionButton>
                        </div>
                      </Td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <Td colSpan="4">
                          <SubTable>
                            <thead>
                              <tr>
                                <SubTh>Item Name</SubTh>
                                <SubTh>Quantity</SubTh>
                                <SubTh>Actions</SubTh>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(intent.items) &&
                              intent.items.length > 0 ? (
                                intent.items.map((item, itemIdx) => {
                                  const itemKey = item.item_id || item.id;
                                  const isEditing =
                                    editingIntentNumber === intentId &&
                                    editingDate === intent.date &&
                                    editingItemId === itemKey;
                                  return (
                                    <tr key={`${intentId}-${itemKey}`}>
                                      <SubTd>
                                        {isEditing ? (
                                          <Input
                                            type="text"
                                            value={editedItemName}
                                            onChange={(e) =>
                                              setEditedItemName(e.target.value)
                                            }
                                          />
                                        ) : (
                                          `${toRomanNumeral(itemIdx + 1)}. ${
                                            item.itemName
                                          }`
                                        )}
                                      </SubTd>
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
                                                color="#27ae60"
                                              >
                                                <FaSave />
                                              </TableActionButton>
                                              <TableActionButton
                                                onClick={handleCancelEdit}
                                                color="#c0392b"
                                              >
                                                <FaTrash />
                                              </TableActionButton>
                                            </>
                                          ) : (
                                            <>
                                              <TableActionButton
                                                onClick={() =>
                                                  handleEditSavedItem(
                                                    intent,
                                                    item
                                                  )
                                                }
                                                color="#000"
                                              >
                                                <FaEdit />
                                              </TableActionButton>
                                              <TableActionButton
                                                onClick={() =>
                                                  handleDeleteSavedItem(
                                                    intentId,
                                                    intent.date,
                                                    item.item_id || item.id
                                                  )
                                                }
                                                color="#e74c3c"
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
                                    colSpan="3"
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
                <Td colSpan="4" align="center">
                  No saved intents found.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default CollegeIntent;
