// CollegeIntentReport.js
import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaSave,
  FaTimes,
  FaPrint,
  FaFileExcel,
} from "react-icons/fa";
import apiRequest from "../apiRequest";
import * as XLSX from "xlsx";
import {
  Container,
  Header,
  Title,
  TopRightButtons,
  FilterContainer,
  FilterGroup,
  Label,
  Input,
  ButtonGroup,
  Button,
  Table,
  Th,
  Td,
  SubTable,
  SubTh,
  SubTd,
  StatusText,
  Overlay,
  PopupContainer,
  CloseButton,
  Loading,
  ErrorMsg,
} from "../StyledComponents";

// ---------- Helpers ----------
const getIntentStatus = (items) => {
  if (!items || items.length === 0) return "Pending";
  const statuses = items.map((i) => i.status || "Pending");
  if (statuses.every((s) => s === "Approved")) return "Approved";
  if (statuses.every((s) => s === "Pending")) return "Pending";
  if (
    statuses.some(
      (s) => s === "Pending" || s === "Partially Approved" || s === "Rejected"
    )
  )
    return "Partially Approved";
  return "Approved";
};

const toRoman = (num) => {
  const map = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  for (const [value, numeral] of map) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
};

const fetchHsnByItemName = async (itemName) => {
  const StoreTrustbaseurl =
    process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  const url = `${StoreTrustbaseurl}item/list/?itemName=${encodeURIComponent(
    itemName
  )}`;
  try {
    const response = await apiRequest(url, "GET");
    if (!response.success) throw new Error(response.error);
    const item = response.data.find((i) => i.itemName === itemName);
    return item ? item.hsn || "" : "";
  } catch {
    return "";
  }
};

// ---------- Component ----------
function CollegeIntentReport() {
  const today = new Date().toISOString().split("T")[0];
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [expandedIntent, setExpandedIntent] = useState(null);
  const [itemStockInfo, setItemStockInfo] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({
    itemName: "",
    quantity: "",
  });

  // Fetch intents
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const StoreTrustbaseurl =
          process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
        const url = `${StoreTrustbaseurl}college-intent/`;
        const response = await apiRequest(url, "GET");
        if (!response.success)
          throw new Error(response.error || "Failed to fetch data");

        const result = response.data;
        const activeIntents = Array.isArray(result)
          ? result.filter(
              (intent) =>
                intent.is_active !== false || intent.is_active === undefined
            )
          : [];

        const intentsWithHsn = await Promise.all(
          activeIntents.map(async (intent) => {
            const items = Array.isArray(intent.items)
              ? intent.items
              : typeof intent.items === "string"
              ? JSON.parse(intent.items)
              : [];

            const itemsWithHsn = await Promise.all(
              items.map(async (item) => {
                const hsn =
                  item.hsn || (await fetchHsnByItemName(item.itemName));
                return { ...item, hsn };
              })
            );

            return { ...intent, items: itemsWithHsn };
          })
        );

        setIntents(intentsWithHsn);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClearFilters = () => {
    setFromDate(today);
    setToDate(today);
  };

  const getTotalStock = async (itemName, hsn) => {
    const StoreTrustbaseurl =
      process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
    const url = `${StoreTrustbaseurl}college-stock/?itemName=${encodeURIComponent(
      itemName
    )}&hsn=${encodeURIComponent(hsn || "")}`;
    const response = await apiRequest(url, "GET");
    if (!response.success) throw new Error(response.error);
    return response.data.total_stock || 0;
  };

  const handleToggleView = async (intentNumber) => {
    if (expandedIntent === intentNumber) {
      setExpandedIntent(null);
      setItemStockInfo({});
      return;
    }
    setExpandedIntent(intentNumber);
    const intent = intents.find((i) => i.intent_number === intentNumber);
    if (!intent) return;
    const items = Array.isArray(intent.items)
      ? intent.items
      : typeof intent.items === "string"
      ? JSON.parse(intent.items)
      : [];
    const stockData = {};
    for (const item of items) {
      try {
        const totalStock = await getTotalStock(item.itemName, item.hsn || "");
        stockData[item.itemName] = totalStock;
      } catch {
        stockData[item.itemName] = 0;
      }
    }
    setItemStockInfo(stockData);
  };

  const handleEditRow = (intentId, itemIndex, item) => {
    setEditingRow({ intentId, itemIndex });
    setEditValues({ itemName: item.itemName, quantity: item.quantity });
  };
  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditValues({ itemName: "", quantity: "" });
  };
  const handleSaveRow = (intentId, itemIndex) => {
    setIntents((prev) =>
      prev.map((i) => {
        if (i.intent_number === intentId) {
          const items = Array.isArray(i.items)
            ? [...i.items]
            : typeof i.items === "string"
            ? JSON.parse(i.items)
            : [];
          items[itemIndex] = {
            ...items[itemIndex],
            itemName: editValues.itemName,
            quantity: editValues.quantity,
            hsn: items[itemIndex].hsn || "",
          };
          return { ...i, items };
        }
        return i;
      })
    );
    setEditingRow(null);
    setEditValues({ itemName: "", quantity: "" });
  };

  const filteredIntents = intents.filter((intent) => {
    if (!fromDate && !toDate) return true;
    const intentDate = new Date(intent.date).toISOString().split("T")[0];
    if (fromDate && intentDate < fromDate) return false;
    if (toDate && intentDate > toDate) return false;
    return true;
  });

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <ErrorMsg>Error: {error}</ErrorMsg>;

  return (
    <Container>
      <Header>
        <Title>College Intent Report</Title>
      </Header>

      <TopRightButtons>
        <Button bgColor="#007bff" bgHover="#0056b3">
          <FaPrint /> Print
        </Button>
        <Button bgColor="#28a745" bgHover="#218838">
          <FaFileExcel /> Export Excel
        </Button>
      </TopRightButtons>

      <FilterContainer>
        <FilterGroup>
          <Label>From Date</Label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </FilterGroup>
        <FilterGroup>
          <Label>To Date</Label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </FilterGroup>
        <ButtonGroup>
          <Button onClick={handleClearFilters}>Clear</Button>
        </ButtonGroup>
      </FilterContainer>

      <Table>
        <thead>
          <tr>
            <Th>S.No</Th>
            <Th>Date</Th>
            <Th>Intent Number</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredIntents.length > 0 ? (
            filteredIntents.map((intent, index) => {
              const intentId = intent.intent_number || intent.id;
              const status = getIntentStatus(intent.items);
              return (
                <tr key={`${intentId}-${intent.date}`}>
                  <Td>{index + 1}</Td>
                  <Td>{new Date(intent.date).toLocaleDateString()}</Td>
                  <Td>{intentId}</Td>
                  <Td>
                    <StatusText status={status}>{status}</StatusText>
                  </Td>
                  <Td>
                    <button
                      onClick={() => handleToggleView(intentId)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#2980b9",
                      }}
                    >
                      {expandedIntent === intentId ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </Td>
                </tr>
              );
            })
          ) : (
            <tr>
              <Td colSpan="5" style={{ textAlign: "center" }}>
                No data available
              </Td>
            </tr>
          )}
        </tbody>
      </Table>

      {expandedIntent && (
        <Overlay>
          <PopupContainer>
            <CloseButton onClick={() => setExpandedIntent(null)}>
              <FaTimes />
            </CloseButton>
            <h3 style={{ marginTop: 0 }}>Items for {expandedIntent}</h3>
            <SubTable>
              <thead>
                <tr>
                  <SubTh>S.No</SubTh>
                  <SubTh>Item ID</SubTh>
                  <SubTh>Item Name</SubTh>
                  <SubTh>Quantity</SubTh>
                  <SubTh>Status</SubTh>
                  <SubTh>Approved</SubTh>
                  <SubTh>Total Stock</SubTh>
                  <SubTh>Actions</SubTh>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const intent = intents.find(
                    (i) => i.intent_number === expandedIntent
                  );
                  if (!intent) return null;
                  const items = Array.isArray(intent.items)
                    ? intent.items
                    : typeof intent.items === "string"
                    ? JSON.parse(intent.items)
                    : [];
                  return items.length > 0 ? (
                    items.map((item, idx) => {
                      const isEditing =
                        editingRow?.intentId === expandedIntent &&
                        editingRow?.itemIndex === idx;
                      return (
                        <tr key={item.item_id || idx}>
                          <SubTd>{idx + 1}</SubTd>
                          <SubTd>{toRoman(item.item_id || idx + 1)}</SubTd>
                          <SubTd>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValues.itemName}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    itemName: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              item.itemName
                            )}
                          </SubTd>
                          <SubTd>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValues.quantity}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    quantity: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              item.quantity
                            )}
                          </SubTd>
                          <SubTd>{item.status || "Pending"}</SubTd>
                          <SubTd>{item.approved || 0}</SubTd>
                          <SubTd>{itemStockInfo[item.itemName] || 0}</SubTd>
                          <SubTd>
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleSaveRow(expandedIntent, idx)
                                  }
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#27ae60",
                                  }}
                                >
                                  <FaSave />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#e74c3c",
                                  }}
                                >
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() =>
                                  handleEditRow(expandedIntent, idx, item)
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#27ae60",
                                }}
                              >
                                <FaEdit />
                              </button>
                            )}
                          </SubTd>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <SubTd colSpan="8" style={{ textAlign: "center" }}>
                        No items available
                      </SubTd>
                    </tr>
                  );
                })()}
              </tbody>
            </SubTable>
          </PopupContainer>
        </Overlay>
      )}
    </Container>
  );
}

export default CollegeIntentReport;
