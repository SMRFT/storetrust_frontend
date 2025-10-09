import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEye, FaEyeSlash, FaEdit, FaSave, FaTimes, FaPrint, FaFileExcel } from "react-icons/fa";
import apiRequest from "../apiRequest";
import * as XLSX from "xlsx";

// ---------- Styled Components (same as TravellersIntentReport) ----------
const Container = styled.div`
  padding: 30px;
  max-width: 900px;
  margin: auto;
  background: #e6f7ff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.15);
  font-family: "Segoe UI", sans-serif;
`;

const Heading = styled.h2`
  text-align: center;
  color: #007acc;
  margin-bottom: 25px;
  @media print {
    margin-bottom: 10px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
  min-height: 70px;
  @media print {
    display: none;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 6px;
  color: #005b96;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #b3e0ff;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  background-color: #f0fbff;
  height: 36px;
  box-sizing: border-box;
  &:focus {
    border-color: #66d9ff;
    box-shadow: 0 0 5px rgba(0, 191, 255, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  align-self: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  min-width: 100px;
  height: 36px;
  background-color: ${({ bgColor }) => bgColor || "#f39c12"};
  transition: all 0.3s ease;
  &:hover {
    background-color: ${({ bgHover }) => bgHover || "#e67e22"};
  }
`;

const TopRightButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 10px;
  @media print {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  @media print {
    box-shadow: none;
    margin-top: 0;
  }
`;

const Th = styled.th`
  background-color: #00bfff;
  color: white;
  padding: 12px;
  border: 1px solid #d6f0ff;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #d6f0ff;
  text-align: left;
`;

const SubTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #f8fafc;
  margin: 10px 0;
`;

const SubTh = styled.th`
  background-color: #e0f0ff;
  color: #005b96;
  padding: 8px;
  border: 1px solid #d6f0ff;
  text-align: left;
`;

const SubTd = styled.td`
  padding: 8px;
  border: 1px solid #d6f0ff;
  text-align: left;
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: #00bfff;
  @media print {
    display: none;
  }
`;

const ErrorMsg = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 2rem;
  @media print {
    display: none;
  }
`;

const Overlay = styled.div`
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

const PopupContainer = styled.div`
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

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #e74c3c;
  cursor: pointer;
  float: right;
  margin-bottom: 10px;
  &:hover {
    color: #c0392b;
  }
`;

const StatusText = styled.span`
  font-weight: 600;
  ${({ status }) =>
    status === "Approved" &&
    `
    color: #27ae60;
  `}
  ${({ status }) =>
    status === "Pending" &&
    `
    color: #e74c3c;
  `}
  ${({ status }) =>
    status === "Partially Approved" &&
    `
    color: #f39c12;
  `}
  ${({ status }) =>
    status === "Rejected" &&
    `
    color: #8e44ad;
  `}
`;

// ---------- Helper Functions ----------
const getIntentStatus = (items) => {
  if (!items || items.length === 0) return "Pending";
  const statuses = items.map((i) => i.status || "Pending");
  if (statuses.every((s) => s === "Approved")) return "Approved";
  if (statuses.every((s) => s === "Pending")) return "Pending";
  if (statuses.some((s) => s === "Pending" || s === "Partially Approved" || s === "Rejected"))
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
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  const url = `${StoreTrustbaseurl}item/list/?itemName=${encodeURIComponent(itemName)}`;
  try {
    const response = await apiRequest(url, "GET");
    console.log(`Fetching HSN for ${itemName}:`, response);
    if (!response.success) throw new Error(response.error);
    const item = response.data.find((i) => i.itemName === itemName);
    const hsn = item ? item.hsn || "" : "";
    console.log(`HSN for ${itemName}:`, hsn);
    return hsn;
  } catch (err) {
    console.error("Failed to fetch HSN for", itemName, err);
    return "";
  }
};

// ---------- Main Component ----------
function MessIntentReport() {
  const today = new Date().toISOString().split("T")[0];
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [expandedIntent, setExpandedIntent] = useState(null);
  const [itemStockInfo, setItemStockInfo] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({ itemName: "", quantity: "" });

  // Fetch intents
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
        const url = `${StoreTrustbaseurl}mess-intent/`;
        const response = await apiRequest(url, "GET");
        if (!response.success) throw new Error(response.error || "Failed to fetch data");
        
        const result = response.data;
        const activeIntents = Array.isArray(result)
          ? result.filter((intent) => intent.is_active !== false || intent.is_active === undefined)
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
                const hsn = item.hsn || (await fetchHsnByItemName(item.itemName));
                return { ...item, hsn };
              }),
            );
            
            return { ...intent, items: itemsWithHsn };
          }),
        );
        
        setIntents(intentsWithHsn);
        console.log("Mess Intents with HSN:", intentsWithHsn);
      } catch (error) {
        setError(error.message);
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
    const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
    const url = `${StoreTrustbaseurl}mess-stock/?itemName=${encodeURIComponent(itemName)}&hsn=${encodeURIComponent(hsn || "")}`;
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
      const hsn = item.hsn || "";
      try {
        const totalStock = await getTotalStock(item.itemName, hsn);
        stockData[item.itemName] = totalStock;
      } catch (err) {
        console.error("Failed to fetch stock for", item.itemName, err);
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
          const items = Array.isArray(i.items) ? [...i.items] : typeof i.items === "string" ? JSON.parse(i.items) : [];
          items[itemIndex] = {
            ...items[itemIndex],
            itemName: editValues.itemName,
            quantity: editValues.quantity,
            hsn: items[itemIndex].hsn || "",
          };
          updateIntentItemsInDB(intentId, items);
          return { ...i, items };
        }
        return i;
      }),
    );
    setEditingRow(null);
    setEditValues({ itemName: "", quantity: "" });
  };

  const handleItemStatusChange = async (intentId, itemIndex, newStatus) => {
    const intent = intents.find((i) => i.intent_number === intentId);
    if (!intent) return;
    
    const items = Array.isArray(intent.items)
      ? [...intent.items]
      : typeof intent.items === "string"
      ? JSON.parse(intent.items)
      : [];
      
    const item = items[itemIndex];
    
    // Prevent double triggers
    if (item.status === newStatus) return;
    
    const availableStock = itemStockInfo[item.itemName] || 0;
    const requestedQuantity = Number.parseInt(item.quantity || 0);
    let approvedQuantity = 0;
    
    // Handle status logic
    if (newStatus === "Approved") {
      if (availableStock < requestedQuantity) {
        alert(`Cannot approve. Available stock: ${availableStock}`);
        return;
      }
      approvedQuantity = requestedQuantity;
    } else if (newStatus === "Partially Approved") {
      const input = prompt(
        `Enter quantity to approve (0 to ${requestedQuantity}, available: ${availableStock}):`
      );
      if (input === null) return;
      const parsed = Number.parseInt(input);
      if (isNaN(parsed) || parsed < 0 || parsed > requestedQuantity || parsed > availableStock) {
        alert("Invalid quantity. Status change cancelled.");
        return;
      }
      approvedQuantity = parsed;
    } else if (newStatus === "Rejected") {
      approvedQuantity = 0;
    }
    
    // Update local stock immediately
    if (newStatus === "Approved" || newStatus === "Partially Approved") {
      const previousApproved = Number.parseInt(item.approved || 0);
      const stockReduction = approvedQuantity - previousApproved;
      setItemStockInfo((prev) => ({
        ...prev,
        [item.itemName]: Math.max(0, (prev[item.itemName] || 0) - stockReduction),
      }));
    }
    
    // Update intent items in state
    const updatedItems = items.map((itm, idx) =>
      idx === itemIndex ? { ...itm, status: newStatus, approved: approvedQuantity } : itm
    );
    
    setIntents((prev) =>
      prev.map((i) => (i.intent_number === intentId ? { ...i, items: updatedItems } : i))
    );
    
    // Persist to backend
    const updatedItem = updatedItems[itemIndex];
    updateIntentItemsInDB(intentId, updatedItems, updatedItem, intent.date);
  };

  const updateIntentItemsInDB = async (intentId, items, updatedItem = null, intentDate = null) => {
    try {
      const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
      const intent = intents.find((i) => i.intent_number === intentId);
      if (!intent) throw new Error("Intent not found");
      
      if (updatedItem && updatedItem.status) {
        const data = {
          intent_number: intentId,
          date: intentDate || intent.date,
          items: [
            {
              item_id: updatedItem.item_id,
              status: updatedItem.status,
              approved_qty: Number.parseInt(updatedItem.approved || 0),
              hsn: updatedItem.hsn || ""
            }
          ],
          auth_user_id: localStorage.getItem("username") || "Unknown User",
        };
        
        const response = await apiRequest(`${StoreTrustbaseurl}mess-intent/update-item/`, "PATCH", data);
        if (!response.success) throw new Error(response.error);
        
        // Refresh stock after successful update
        setTimeout(() => {
          handleToggleView(intentId);
        }, 500);
      }
    } catch (err) {
      console.log("Failed to update items or reduce stock in the database.");
      console.error(err);
    }
  };

  const handlePrintTable = () => {
    let printContent = `
      <table style="width: 100%; border-collapse: collapse; font-family: 'Segoe UI', sans-serif;">
        <thead>
          <tr>
            <th style="background: #00bfff; color: white; padding: 8px; border: 1px solid #d6f0ff;">S.No</th>
            <th style="background: #00bfff; color: white; padding: 8px; border: 1px solid #d6f0ff;">Date</th>
            <th style="background: #00bfff; color: white; padding: 8px; border: 1px solid #d6f0ff;">Intent Number</th>
            <th style="background: #00bfff; color: white; padding: 8px; border: 1px solid #d6f0ff;">Item ID</th>
            <th style="background: #00bfff; color: white; padding: 8px; border: 1px solid #d6f0ff;">Item Name</th>
            <th style="background: #00bfff; color: white; padding: 8px; border: 1px solid #d6f0ff;">Quantity</th>
            <th style="background: #00bfff; color: white; padding: 8px; border: 1px solid #d6f0ff;">Approved</th>
            <th style="background: #00bfff; color: white; padding: 8px; border: 1px solid #d6f0ff;">Stock</th>
            <th style="background: #00bfff; color: white; padding: 8px; border: 1px solid #d6f0ff;">Item Status</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    let serial = 1;
    filteredIntents.forEach((intent) => {
      const items = Array.isArray(intent.items)
        ? intent.items
        : typeof intent.items === "string"
        ? JSON.parse(intent.items)
        : [];
        
      if (items.length > 0) {
        items.forEach((item, idx) => {
          printContent += `
            <tr>
              <td style="border: 1px solid #d6f0ff; padding: 6px;">
                ${idx === 0 ? serial : ""}
              </td>
              <td style="border: 1px solid #d6f0ff; padding: 6px;">
                ${idx === 0 ? new Date(intent.date).toLocaleDateString() : ""}
              </td>
              <td style="border: 1px solid #d6f0ff; padding: 6px;">
                ${idx === 0 ? intent.intent_number : ""}
              </td>
              <td style="border: 1px solid #d6f0ff; padding: 6px;">
                ${toRoman(item.item_id || idx + 1)}
              </td>
              <td style="border: 1px solid #d6f0ff; padding: 6px;">
                ${item.itemName}
              </td>
              <td style="border: 1px solid #d6f0ff; padding: 6px;">
                ${item.quantity}
              </td>
              <td style="border: 1px solid #d6f0ff; padding: 6px;">
                ${item.approved || 0}
              </td>
              <td style="border: 1px solid #d6f0ff; padding: 6px;">
                ${itemStockInfo[item.itemName] || 0}
              </td>
              <td style="border: 1px solid #d6f0ff; padding: 6px;">
                ${item.status || "Pending"}
              </td>
            </tr>
          `;
        });
      } else {
        printContent += `
          <tr>
            <td style="border: 1px solid #d6f0ff; padding: 6px;">
              ${serial}
            </td>
            <td style="border: 1px solid #d6f0ff; padding: 6px;">
              ${new Date(intent.date).toLocaleDateString()}
            </td>
            <td style="border: 1px solid #d6f0ff; padding: 6px;">
              ${intent.intent_number}
            </td>
            <td colspan="6" style="text-align:center; font-style:italic; border: 1px solid #d6f0ff;">
              No items
            </td>
          </tr>
        `;
      }
      serial++;
    });

    printContent += `
        </tbody>
      </table>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Mess Intent Report</title>
          <style>
            body { font-family: "Segoe UI", sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #d6f0ff; text-align: left; }
            th { background-color: #00bfff; color: white; }
          </style>
        </head>
        <body>
          <h2 style="text-align: center; color: #007acc;">Mess Intent Report</h2>
          <p style="text-align: center; margin-bottom: 15px;">From: ${fromDate} &nbsp;&nbsp; To: ${toDate}</p>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportExcel = () => {
    const exportData = [];
    
    filteredIntents.forEach((intent, idx) => {
      exportData.push({
        "S.No": idx + 1,
        Date: new Date(intent.date).toLocaleDateString(),
        "Intent Number": intent.intent_number,
      });
      
      if (Array.isArray(intent.items)) {
        intent.items.forEach((item, iidx) => {
          exportData.push({
            "Item ID": toRoman(item.item_id || iidx + 1).toLowerCase(),
            Date: "",
            "Intent Number": "",
            "Item Name": item.itemName,
            Quantity: item.quantity,
            Approved: item.approved || 0,
            Stock: itemStockInfo[item.itemName] || 0,
            "Item Status": item.status || "Pending",
          });
        });
      }
      
      exportData.push({});
    });
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mess Intents");
    XLSX.writeFile(wb, "mess_intents.xlsx");
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
      <Heading>Mess Intent Report</Heading>
      <TopRightButtons>
        <Button bgColor="#007bff" bgHover="#0056b3" onClick={handlePrintTable}>
          <FaPrint /> Print
        </Button>
        <Button bgColor="#28a745" bgHover="#218838" onClick={handleExportExcel}>
          <FaFileExcel /> Export Excel
        </Button>
      </TopRightButtons>
      <FilterContainer>
        <FilterGroup>
          <Label>From Date</Label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </FilterGroup>
        <FilterGroup>
          <Label>To Date</Label>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </FilterGroup>
        <ButtonGroup>
          <Button onClick={handleClearFilters}>Clear</Button>
        </ButtonGroup>
      </FilterContainer>
      <div id="printable-table">
        <Table>
          <thead>
            <tr>
              <Th>S.No</Th>
              <Th>Date</Th>
              <Th>Intent Number</Th>
              <Th>Status</Th>
              <Th className="no-print">Action</Th>
            </tr>
          </thead>
          <tbody>
            {filteredIntents.length > 0 ? (
              filteredIntents.map((intent, index) => {
                const intentId = intent.intent_number || intent.id;
                const status = getIntentStatus(
                  Array.isArray(intent.items)
                    ? intent.items
                    : typeof intent.items === "string"
                      ? JSON.parse(intent.items)
                      : [],
                );
                
                return (
                  <tr key={`${intentId}-${intent.date}`}>
                    <Td>{index + 1}</Td>
                    <Td>{new Date(intent.date).toLocaleDateString()}</Td>
                    <Td>{intentId || "Pending"}</Td>
                    <Td>
                      <StatusText status={status} className={`status-${status.toLowerCase().replace(" ", "-")}`}>
                        {status}
                      </StatusText>
                    </Td>
                    <Td className="no-print">
                      <button
                        onClick={() => handleToggleView(intentId)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#2980b9",
                          fontSize: "14px",
                        }}
                        title={expandedIntent === intentId ? "Hide" : "View"}
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
      </div>
      
      {expandedIntent && (
        <Overlay>
          <PopupContainer>
            <CloseButton onClick={() => setExpandedIntent(null)}>✖</CloseButton>
            <h3 style={{ marginTop: 0, color: "#007acc" }}>Items for {expandedIntent}</h3>
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
                  const intent = intents.find((i) => i.intent_number === expandedIntent);
                  if (!intent) return null;
                  
                  const items = Array.isArray(intent.items)
                    ? intent.items
                    : typeof intent.items === "string"
                      ? JSON.parse(intent.items)
                      : [];
                      
                  return items.length > 0 ? (
                    items.map((item, itemIndex) => {
                      const isEditing = editingRow?.intentId === expandedIntent && editingRow?.itemIndex === itemIndex;
                      const currentStock = itemStockInfo[item.itemName] || 0;
                      const requestedQuantity = Number.parseInt(item.quantity || 0);
                      const approvedQuantity = Number.parseInt(item.approved || 0);
                      const availableStock = Number.parseInt(itemStockInfo[item.itemName] || 0);
                      const isApprovedDisabled = requestedQuantity > availableStock;
                      
                      return (
                        <tr key={item.item_id || itemIndex}>
                          <SubTd>{itemIndex + 1}</SubTd>
                          <SubTd>{toRoman(item.item_id || itemIndex + 1)}</SubTd>
                          <SubTd>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValues.itemName}
                                onChange={(e) => setEditValues((prev) => ({ ...prev, itemName: e.target.value }))}
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
                                onChange={(e) => setEditValues((prev) => ({ ...prev, quantity: e.target.value }))}
                              />
                            ) : (
                              item.quantity
                            )}
                          </SubTd>
                          <SubTd>
                            <select
                              value={item.status || "Pending"}
                              onChange={(e) => handleItemStatusChange(expandedIntent, itemIndex, e.target.value)}
                              disabled={isEditing}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Partially Approved">Partially Approved</option>
                              <option value="Approved" disabled={isApprovedDisabled}>
                                Approved
                              </option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </SubTd>
                          <SubTd>{approvedQuantity}</SubTd>
                          <SubTd>{currentStock}</SubTd>
                          <SubTd>
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveRow(expandedIntent, itemIndex)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#27ae60",
                                    fontSize: "16px",
                                    marginRight: "6px",
                                  }}
                                  title="Save"
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
                                    fontSize: "16px",
                                  }}
                                  title="Cancel"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleEditRow(expandedIntent, itemIndex, item)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#27ae60",
                                  fontSize: "16px",
                                }}
                                title="Edit"
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

export default MessIntentReport;