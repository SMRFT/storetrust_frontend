// TravellersIntentReport.js
import { useState, useEffect, useRef } from "react";
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
import{
  TableContainer, TableBody as tbody,  TableHeader as thead, ModalOverlay, Header,ModalContent, ModalInput, ModalButtons,  TableCell as Td, TableRow as tr, StatusText, Overlay, PopupContainer, Loading, ErrorMsg, Container, Title, TopRightButtons, FilterContainer, FilterGroup, Label, Input, ButtonGroup, Table, TableHeader as Th, CloseButton, SubTable, SubTh, SubTd, Button,
} from "../StyledComponents";

// ---------- Helper Functions ----------
const getIntentStatus = (items) => {
  if (!items || items.length === 0) return "Pending";

  // Normalize wording
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

  // Rule: if ANY item is Pending → main = Pending
  if (statuses.includes("Pending")) return "Pending";

  // If all the same
  if (statuses.every((s) => s === "Approved")) return "Approved";
  if (statuses.every((s) => s === "Rejected")) return "Rejected";
  if (statuses.every((s) => s === "Partially Approved"))
    return "Partially Approved";

  // Mixed cases (no Pending left, but different statuses)
  if (statuses.includes("Approved")) return "Approved";
  if (statuses.includes("Partially Approved")) return "Partially Approved";
  if (statuses.includes("Rejected")) return "Rejected";

  return "Pending";
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

const getTotalStock = async (itemName, hsn) => {
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  const url = `${StoreTrustbaseurl}travellers-stock/?itemName=${encodeURIComponent(itemName)}&hsn=${encodeURIComponent(hsn || "")}`;
  try {
    const response = await apiRequest(url, "GET");
    if (!response.success) throw new Error(response.error);
    return response.data.total_stock || 0;
  } catch (error) {
    console.error(`Failed to fetch stock for ${itemName}:`, error);
    return 0;
  }
};

// New function to restore stock when rejecting approved items
const restoreStockInDB = async (itemName, hsn, quantity, employeeId) => {
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  try {
    const response = await apiRequest(`${StoreTrustbaseurl}add_back_traveller_stock/`, "PATCH", {
      itemName: itemName,
      hsn: hsn || "",
      quantity: quantity,
      "auth-user-id": employeeId || "Unknown User",
    });
    
    if (!response.success) {
      console.error("Failed to restore stock:", response.error);
      return false;
    }
    
    console.log(`Successfully restored ${quantity} stock for ${itemName}`);
    return true;
  } catch (error) {
    console.error("Error restoring stock:", error);
    return false;
  }
};

// ---------- Modal Component ----------
function InputModal({ title, visible, maxQuantity, requestedQuantity, availableStock, onSave, onCancel }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!visible) setInputValue("");
  }, [visible]);

  const handleSave = () => {
    const qty = Number(inputValue);
    if (isNaN(qty) || qty < 0 || qty > maxQuantity) {
      alert(`Please enter a number between 0 and ${maxQuantity}`);
      return;
    }
    onSave(qty);
  };

  if (!visible) return null;

  return (
    <ModalOverlay>
      <ModalContent role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h3 id="modal-title">{title}</h3>

        <p style={{ margin: "6px 0", fontSize: "14px", color: "#555" }}>
          Requested Quantity: <strong>{requestedQuantity}</strong>
        </p>
        <p style={{ margin: "6px 0", fontSize: "14px", color: "#555" }}>
          Available Stock: <strong>{availableStock}</strong>
        </p>

        <ModalInput
          type="number"
          min="0"
          max={maxQuantity}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />

        <ModalButtons>
          <Button bgColor="#e74c3c" bgHover="#c0392b" onClick={onCancel}>
            Cancel
          </Button>
          <Button bgColor="#27ae60" bgHover="#1e8449" onClick={handleSave}>
            Save
          </Button>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
}

// ---------- Main Component ----------
function TravellersIntentReport() {
  const today = new Date().toISOString().split("T")[0];
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [expandedIntent, setExpandedIntent] = useState(null);
  const [availableStockMap, setAvailableStockMap] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({ approved: "", status: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fetchedRef = useRef(false);
  const [modalData, setModalData] = useState({
    intentId: null,
    itemIndex: null,
    maxQuantity: 0,
  });

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
    const url = `${StoreTrustbaseurl}travellers-intent/`;
    const response = await apiRequest(url, "GET");
    if (!response.success) throw new Error(response.error || "Failed to fetch data");
    const result = response.data;

    // Filter active intents
    const activeIntents = Array.isArray(result)
      ? result.filter((intent) => intent.is_active !== false || intent.is_active === undefined)
      : [];

    // Collect all items across intents
    const allItems = [];
    activeIntents.forEach((intent) => {
      const items = Array.isArray(intent.items)
        ? intent.items
        : typeof intent.items === "string"
        ? JSON.parse(intent.items)
        : [];
      allItems.push(...items);
    });

    // Deduplicate by itemName + hsn
    const uniqueItems = Array.from(
      new Map(allItems.map((i) => [`${i.itemName}-${i.hsn || ""}`, i])).values()
    );

    // Fetch stocks once per unique item
    const stockResults = await Promise.all(
      uniqueItems.map(async (i) => {
        const hsn = i.hsn || (await fetchHsnByItemName(i.itemName));
        const stock = await getTotalStock(i.itemName, hsn);
        return { key: `${i.itemName}-${hsn}`, hsn, stock };
      })
    );

    // Build lookup
    const stockMap = {};
    stockResults.forEach(({ key, hsn, stock }) => {
      stockMap[key] = { hsn, stock };
    });

    // Attach stock back to intents
const intentsWithDetails = activeIntents.map((intent) => {
  const items = Array.isArray(intent.items)
    ? intent.items
    : typeof intent.items === "string"
    ? JSON.parse(intent.items)
    : [];

  // Filter out inactive items
  const activeItems = items.filter((item) => item.is_active !== false);

  const itemsWithDetails = activeItems.map((item) => {
    const key = `${item.itemName}-${item.hsn || ""}`;
    const { hsn, stock } = stockMap[key] || {};
    return { ...item, hsn: hsn || item.hsn, totalStock: stock || 0 };
  });
  return { ...intent, items: itemsWithDetails };
});

    // Sort intents by date for sequential stock calculation
    intentsWithDetails.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Update state
    setIntents(intentsWithDetails);
  } catch (err) {
    setError(err.message || "Failed to fetch data");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!fetchedRef.current) {
    fetchData();
    fetchedRef.current = true;
  }
}, []);

  const handleClearFilters = () => {
    setFromDate(today);
    setToDate(today);
  };

  const handleToggleView = async (intentNumber) => {
    if (expandedIntent === intentNumber) {
      setExpandedIntent(null);
      return;
    }
    setExpandedIntent(intentNumber);
  };

  const handleEditRow = (intentId, itemIndex, item) => {
    setEditingRow({ intentId, itemIndex });
    setEditValues({ approved: item.approved?.toString() || "", status: item.status || "Pending" });
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditValues({ approved: "", status: "" });
  };

  const handleSaveRow = async (intentId, itemIndex) => {
    const intent = intents.find((i) => i.intent_number === intentId);
    if (!intent) return;
    const items = Array.isArray(intent.items) ? [...intent.items] : [];
    const item = items[itemIndex];
    const approvedQty = Number(editValues.approved || 0);
    const requestedQuantity = Number(item.quantity || 0);
    const availableStock = Number(item.dynamicTotalStock || 0);

    if (editValues.status === "Partially Approved") {
      if (approvedQty < 0 || approvedQty > requestedQuantity || approvedQty > availableStock) {
        alert(`Invalid approved quantity. Must be between 0 and ${Math.min(requestedQuantity, availableStock)}.`);
        return;
      }
    } else if (editValues.status === "Approved") {
      if (requestedQuantity > availableStock) {
        alert(`Cannot approve. Available stock: ${availableStock}`);
        return;
      }
    }

    const updatedItem = {
      ...item,
      approved: editValues.status === "Approved" ? requestedQuantity : editValues.status === "Partially Approved" ? approvedQty : 0,
      status: editValues.status,
    };

    items[itemIndex] = updatedItem;

    // Update intents and recalculate dynamic stock
    const updatedIntents = intents.map((i) => (i.intent_number === intentId ? { ...i, items } : i));
    updateDynamicStock(updatedIntents, intentId, item.itemName, updatedItem.approved);

    setIntents(updatedIntents);
    await updateIntentItemsInDB(intentId, items, updatedItem, intent.date);
    setEditingRow(null);
    setEditValues({ approved: "", status: "" });
  };

const updateStatusAndStock = async (intentId, itemIndex, newStatus, approvedQuantity, updatedItem = null) => {
  const intent = intents.find((i) => i.intent_number === intentId);
  if (!intent) return;
  const items = Array.isArray(intent.items) ? [...intent.items] : [];
  const item = items[itemIndex];

  // Store previous approved quantity and status
  const prevApprovedQty = Number(item.approved || 0);
  const prevStatus = item.status;

  // Use provided updatedItem or create new one
  const finalUpdatedItem = updatedItem || {
    ...item,
    status: newStatus,
    approved: approvedQuantity
  };

  items[itemIndex] = finalUpdatedItem;

  // Update intents immediately
  let updatedIntents = intents.map((i) =>
    i.intent_number === intentId ? { ...i, items } : i
  );

  // Handle stock restoration when rejecting previously approved items
  if (newStatus === "Rejected" && prevApprovedQty > 0 && 
      (prevStatus === "Approved" || prevStatus === "Approve" || 
       prevStatus === "Partially Approved" || prevStatus === "Partially Approve")) {
    
    console.log(`Rejecting item: ${item.itemName}, restoring ${prevApprovedQty} stock`);
    
    // Restore stock in database
    const employeeId = localStorage.getItem("username") || "Unknown User";
    const restoreSuccess = await restoreStockInDB(
      item.itemName, 
      item.hsn || "", 
      prevApprovedQty, 
      employeeId
    );
    
    if (!restoreSuccess) {
      alert(`Warning: Failed to restore stock for ${item.itemName}. Please check manually.`);
    }
    
    // Update dynamic stock to reflect restoration
    updatedIntents = restoreStockOnRejection(updatedIntents, intentId, item.itemName, prevApprovedQty);
  }

  // Recalculate sequential stock for all intents
  updateDynamicStock(updatedIntents);

  setIntents(updatedIntents);

  // Call backend to update intent status
  await updateIntentItemsInDB(intentId, items, finalUpdatedItem, intent.date);
};

const updateDynamicStock = (intents) => {
  const sortedIntents = [...intents].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const stockMap = {};

  sortedIntents.forEach((intent) => {
    intent.items.forEach((item) => {
      const key = `${item.itemName}-${item.hsn || ""}`;

      if (!(key in stockMap)) {
        stockMap[key] = Number(item.totalStock || 0); // initial stock from backend
      }

      // Stock available before deduction
      item.dynamicTotalStock = stockMap[key];

      // Deduct based on current status only
      let deduction = 0;
      if (item.status === "Approved" || item.status === "Approve") {
        deduction = Number(item.quantity || 0);
      } else if (
        item.status === "Partially Approved" ||
        item.status === "Partially Approve"
      ) {
        deduction = Number(item.approved || 0);
      } else {
        deduction = 0; // Pending or Rejected → no deduction
      }

      stockMap[key] = Math.max(0, stockMap[key] - deduction);
    });
  });

  return sortedIntents;
};

const restoreStockOnRejection = (intentsList, intentId, itemName, restoredQty) => {
  // Sort intents by date
  const sortedIntents = [...intentsList].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const stockMap = {};

  sortedIntents.forEach((intent) => {
    intent.items.forEach((item) => {
      const key = `${item.itemName}-${item.hsn || ""}`;

      if (!(key in stockMap)) {
        stockMap[key] = Number(item.totalStock || 0);
      }

      // Restore stock **before deduction** for the rejected item
      if (intent.intent_number === intentId && item.itemName === itemName && item.status === "Rejected") {
        stockMap[key] += restoredQty;
      }

      // Stock before deduction
      item.dynamicTotalStock = stockMap[key];

      // Deduct based on approved or partially approved
      let deduction = 0;
      if (item.status === "Approved" || item.status === "Approve") {
        deduction = Number(item.quantity || 0);
      } else if (item.status === "Partially Approved" || item.status === "Partially Approve") {
        deduction = Number(item.approved || 0);
      }
      stockMap[key] = Math.max(0, stockMap[key] - deduction);
    });
  });

  return sortedIntents;
};

const handleItemStatusChange = async (intentId, itemIndex, newStatus) => {
  const intent = intents.find((i) => i.intent_number === intentId);
  if (!intent) return;
  const items = Array.isArray(intent.items) ? [...intent.items] : [];
  const item = items[itemIndex];

  if (item.status === newStatus) return;

  const requestedQuantity = Number(item.quantity || 0);

  // Always fetch live stock from backend
  const hsn = item.hsn || (await fetchHsnByItemName(item.itemName));
  const freshStock = await getTotalStock(item.itemName, hsn);

  if (newStatus === "Partially Approve") {
    setModalData({
      intentId,
      itemIndex,
      maxQuantity: Math.min(requestedQuantity, freshStock),
      requestedQuantity,
      availableStock: freshStock,
    });
    setModalVisible(true);
    setHasChanges(true);
    return;
  }

   let approvedQuantity = 0;
  if (newStatus === "Approved" || newStatus === "Approve") {
    if (freshStock < requestedQuantity) {
      alert(`Cannot approve. Available stock: ${freshStock}`);
      return;
    }
    approvedQuantity = requestedQuantity;
  } else if (newStatus === "Rejected" || newStatus === "Pending") {
    approvedQuantity = 0;
  }

  // FIXED: Update the item's approved field before calling updateStatusAndStock
  const updatedItem = { ...item, status: newStatus, approved: approvedQuantity };
  updateStatusAndStock(intentId, itemIndex, newStatus, approvedQuantity, updatedItem);
};
const updateIntentItemsInDB = async (intentId, items, updatedItem, intentDate) => {
    try {
      const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
      
      // FIXED: Calculate correct approved_qty based on status
      let approvedQty = 0;
      if (updatedItem.status === "Approve" || updatedItem.status === "Approved") {
        approvedQty = Number(updatedItem.quantity || 0); // Full quantity when approved
      } else if (updatedItem.status === "Partially Approve" || updatedItem.status === "Partially Approved") {
        approvedQty = Number(updatedItem.approved || 0); // Use the approved field for partial
      } else {
        approvedQty = 0; // 0 for Pending or Rejected
      }
      
      const data = {
        intent_number: intentId,
        date: intentDate,
        items: [
          {
            item_id: updatedItem.item_id,
            status: updatedItem.status,
            approved_qty: approvedQty, // FIXED: Use calculated value
            hsn: updatedItem.hsn || "",
          },
        ],
        auth_user_id: localStorage.getItem("username") || "Unknown User",
      };
      
      console.log("Sending to backend:", data); // Add this for debugging
      const response = await apiRequest(`${StoreTrustbaseurl}travellers-intent/update-item/`, "PATCH", data);
      if (!response.success) throw new Error(response.error);
      
      console.log(`Successfully updated intent ${intentId} in DB`);
      await fetchData();
    } catch (err) {
      console.error("Failed to update items in the database:", err);
      alert("Failed to update item. Please try again.");
    }
  };

  const handleModalSave = async (approvedQty) => {
    if (!modalData.intentId) return;
    await updateStatusAndStock(modalData.intentId, modalData.itemIndex, "Partially Approve", approvedQty);
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

const handlePrintTable = () => {
  let printContent = `
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        margin: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid black;
        padding: 8px;
      }
      th {
        color: black;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
      }
      td.num {
        text-align: right;
      }
      td.text {
        text-align: left;
      }
      td.center {
        text-align: center;
      }
    </style>
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Item ID</th>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Approved</th>
          <th>Total Stock</th>
          <th>Item Status</th>
          <th>Raised By</th>
          <th>Approved By/ Rejected By</th>
        </tr>
      </thead>
      <tbody>
  `;

  let serial = 1;
  filteredIntents.forEach((intent) => {
    const items = Array.isArray(intent.items) ? intent.items : [];
    if (items.length > 0) {
      items.forEach((item, idx) => {
        const totalStockDisplay =
          item.dynamicTotalStock !== undefined
            ? item.dynamicTotalStock
            : item.totalStock ?? 0;

        printContent += `
          <tr>
            <td class="num">${serial}</td>
            <td class="center">${toRoman(item.item_id || idx + 1)}</td>
            <td class="text">${item.itemName}</td>
            <td class="num">${item.quantity}</td>
            <td class="num">${item.approved || 0}</td>
            <td class="num">${totalStockDisplay}</td>
            <td class="text">${item.status || "Pending"}</td>
            <td class="text">${intent.created_by || "Unknown"}</td>
            <td class="text">${item.approved_by || "Pending"}</td>
          </tr>
        `;
        serial++;
      });
    } else {
      printContent += `
        <tr>
          <td class="num">${serial}</td>
          <td colspan="8" style="text-align:center; font-style:italic;">No items</td>
        </tr>
      `;
      serial++;
    }
  });

  printContent += `</tbody></table>`;

  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head><title>Traveller Intent Report</title></head>
      <body>${printContent}</body>
    </html>
  `);
  win.document.close();
  win.print();
};


const handleExportExcel = () => {
  const exportData = [];
  filteredIntents.forEach((intent, idx) => {
    exportData.push({
      "S.No": idx + 1,
      Date: new Date(intent.date).toLocaleDateString(),
      "Intent Number": intent.intent_number,
    });
    const items = Array.isArray(intent.items) ? intent.items : [];
    if (items.length > 0) {
      items.forEach((item, iidx) => {
        if (item.is_active === false) return; // Skip inactive items
        exportData.push({
          "Item ID": toRoman(item.item_id || iidx + 1),
          "Item Name": item.itemName,
          Quantity: item.quantity,
          Approved: item.approved || 0,
          "Total Stock":
            item.dynamicTotalStock !== undefined
              ? item.dynamicTotalStock
              : item.totalStock ?? 0,
          "Item Status": item.status || "Pending",
          "Raised By ": `${intent.created_by || "N/A"} `,
          "Approved By / Rejected By": ` ${item.approved_by || "Pending"}`,
        });
      });
    } else {
      exportData.push({ "Item Name": "No items" });
    }
    exportData.push({}); // blank row between intents
  });

  const ws = XLSX.utils.json_to_sheet(exportData, { skipHeader: false });
  const range = XLSX.utils.decode_range(ws["!ref"]);

  // Apply alignment to specific columns
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellAddress];
      if (cell) {
        // Define column indices (0-based: S.No=0, Quantity=2, Approved=3, Total Stock=4)
        const columnIndices = [0, 2, 3, 4]; // S.No, Quantity, Approved, Total Stock
        const isNumericColumn = columnIndices.includes(C);

        cell.s = {
          alignment: {
            // Center header row
            horizontal: R === 0 ? "center" : isNumericColumn ? "center" : "left",
            vertical: "center",
          },
        };
      }
    }
  }

  // Auto column widths
  const colWidths = exportData.reduce((widths, row) => {
    Object.keys(row).forEach((key, i) => {
      const val = row[key] ? row[key].toString() : "";
      widths[i] = Math.max(widths[i] || key.length, val.length);
    });
    return widths;
  }, []);
  ws["!cols"] = colWidths.map((w) => ({ wch: w + 2 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Traveller Intents");
  XLSX.writeFile(wb, "travellers_intents.xlsx");
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
      <Title>Traveller Intent Report</Title>
      </Header>
      <TopRightButtons>
        <Button bgColor="#662549" bgHover="#662549" onClick={handlePrintTable}>
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
                    : []
                );
                return (
                  <tr key={`${intentId}-${intent.date}`}>
                    <Td>{index + 1}</Td>
                    <Td>{new Date(intent.date).toLocaleDateString()}</Td>
                    <Td>{intentId || "Pending"}</Td>
                    <Td>
                      <StatusText
                        status={status}
                        className={`status-${status.toLowerCase().replace(" ", "-")}`}
                      >
                        {status}
                      </StatusText>
                    </Td>
                    <Td className="no-print">
                      <Button
                        onClick={() => handleToggleView(intentId)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#662549",
                          fontSize: "14px",
                        }}
                        title={expandedIntent === intentId ? "Hide" : "View"}
                      >
                        {expandedIntent === intentId ? <FaEyeSlash /> : <FaEye />}
                      </Button>
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
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  }}>

    {/* Title */}
    <h3 style={{ margin: 0, color: "#662549" }}>
      Items for {expandedIntent}
    </h3>

    {/* Right Cancel Button */}
    <CloseButton onClick={() => setExpandedIntent(null)} title="Close">
      <FaTimes />
    </CloseButton>
  </div>
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
                  <SubTh>Raised By</SubTh> 
                  <SubTh>Approved By / Rejected by</SubTh>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const intent = intents.find((i) => i.intent_number === expandedIntent);
                  if (!intent) return null;
                  const items = Array.isArray(intent.items) ? intent.items : [];
                  return items.length > 0 ? (
                    items.map((item, itemIndex) => {
                      const isEditing = editingRow?.intentId === expandedIntent && editingRow?.itemIndex === itemIndex;
                      const currentStock = item.totalstock !== undefined ? item.dynamicTotalStock : item.totalStock || 0;
                      const requestedQty = Number(item.quantity || 0);
                      const isApprovedDisabled = requestedQty > currentStock;

                      return (
                        <tr key={item.item_id || itemIndex}>
                          <SubTd>{itemIndex + 1}</SubTd>
                          <SubTd>{toRoman(item.item_id || itemIndex + 1)}</SubTd>
                          <SubTd>{item.itemName}</SubTd>
                          <SubTd>{item.quantity}</SubTd>
                          <SubTd>
                            {isEditing ? (
                              <select
                                value={editValues.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  let newApproved = editValues.approved;
                                  if (newStatus === "Approve") newApproved = item.quantity.toString();
                                  else if (newStatus === "Pending" || newStatus === "Rejecte") newApproved = "0";
                                  setEditValues({ status: newStatus, approved: newApproved });
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Partially Approve">Partially Approve</option>
                                <option value="Approve" disabled={isApprovedDisabled}>
                                  Approve
                                </option>
                                <option value="Reject" >Reject</option>
                              </select>
                            ) : (
<select
  value={item.status || "Pending"}
  onChange={(e) => handleItemStatusChange(expandedIntent, itemIndex, e.target.value)}
  disabled={item.status === "Rejected"}
>
  <option value="Pending">Pending</option>
  <option
    value="Partially Approve"
    disabled={currentStock <= 0 || Number(item.quantity) <= 1}
  >
    Partially Approve
  </option>
  <option
    value="Approve"
    disabled={currentStock <= 0 || requestedQty > currentStock}
  >
    Approve
  </option>
  <option value="Reject">Reject</option>
</select>

                            )}
                          </SubTd>
<SubTd>
  {isEditing ? (
    <input
      type="number"
      value={editValues.approved}
      onChange={(e) =>
        setEditValues((prev) => ({ ...prev, approved: e.target.value }))
      }
      disabled={editValues.status !== "Partially Approve"}
      min={0}
      max={Number(item.quantity)}
      style={{
        backgroundColor:
          editValues.status === "Partially Approve" ? "white" : "#eee",
      }}
    />
  ) : item.status === "Partially Approve"
  ? item.approved
  : item.status === "Approved" || item.status === "Approve"
  ? item.quantity
  : 0}
</SubTd>


                          <SubTd>{currentStock}</SubTd>
                          <SubTd>{intent.created_by || "Unknown"}</SubTd>
                         <SubTd>{item.status && item.status !== "Pending" ? item.approved_by || "Pending" : "Pending"}</SubTd>    
                          <SubTd>
                            {isEditing ? (
                              <>
                                <Button
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
                                </Button>
                                <Button
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
                                </Button>
                              </>
                            ) : (
                              
                              <Button
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
                              </Button>
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

<InputModal
  title="Enter approved quantity"
  visible={modalVisible}
  maxQuantity={modalData.maxQuantity}
  requestedQuantity={modalData.requestedQuantity}
  availableStock={modalData.availableStock}
  onSave={handleModalSave}
  onCancel={handleModalCancel}
/>

    </Container>
  );
}

export default TravellersIntentReport;