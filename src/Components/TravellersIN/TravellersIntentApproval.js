"use client";

// TravellersIntentReport.js
import { useState, useEffect, useRef } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaPrint,
  FaFileExcel,
} from "react-icons/fa";
import apiRequest from "../apiRequest";
import * as XLSX from "xlsx";
import {
  ModalOverlay,
  Header,
  ModalContent,
  ModalInput,
  ModalButtons,
  TableCell as Td,
  StatusText,
  Overlay,
  PopupContainer,
  Loading,
  ErrorMsg,
  Container,
  Title,
  TopRightButtons,
  FilterContainer,
  FilterGroup,
  Label,
  Input,
  ButtonGroup,
  Table,
  TableHeader as Th,
  CloseButton,
  SubTable,
  SubTh,
  SubTd,
  Button,
} from "../StyledComponents";

// ---------- Helper Functions ----------

// Map stored full-form status → dropdown option values (short-form)
const STATUS_REVERSE = {
  Approved: "Approve",
  Rejected: "Reject",
  "Partially Approved": "Partially Approve",
};

// Map short-form dropdown values → display labels
const STATUS_DISPLAY = {
  Approve: "Approved",
  Reject: "Rejected",
  "Partially Approve": "Partially Approved",
  Pending: "Pending",
  // Also handle if full-form arrives directly
  Approved: "Approved",
  Rejected: "Rejected",
  "Partially Approved": "Partially Approved",
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

  if (statuses.includes("Pending")) return "Pending";
  if (statuses.every((s) => s === "Approved")) return "Approved";
  if (statuses.every((s) => s === "Rejected")) return "Rejected";
  if (statuses.every((s) => s === "Partially Approved"))
    return "Partially Approved";
  if (statuses.includes("Partially Approved")) return "Partially Approved";
  if (statuses.includes("Approved") && statuses.includes("Rejected"))
    return "Partially Approved";
  if (statuses.includes("Approved")) return "Approved";
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

// Helper: normalize any status to its full-form string for logic checks
const normalizeStatus = (status) => {
  const map = {
    Approve: "Approved",
    Reject: "Rejected",
    "Partially Approve": "Partially Approved",
  };
  return map[status] || status || "Pending";
};

const getTotalStock = async (item_id, hsn) => {
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  const url = `${StoreTrustbaseurl}travellers-stock/?item_id=${encodeURIComponent(item_id)}&hsn=${encodeURIComponent(hsn || "")}`;
  try {
    const response = await apiRequest(url, "GET");
    if (!response.success) throw new Error(response.error);
    return response.data.total_stock || 0;
  } catch (error) {
    console.error(`Failed to fetch stock for item_id=${item_id}:`, error);
    return 0;
  }
};

const restoreStockInDB = async (item_id, hsn, quantity, employeeId) => {
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  try {
    const response = await apiRequest(
      `${StoreTrustbaseurl}add_back_traveller_stock/`,
      "PATCH",
      {
        item_id: item_id,
        hsn: hsn || "",
        quantity: quantity,
      },
    );
    if (!response.success) {
      console.error("Failed to restore stock:", response.error);
      return false;
    }
    console.log(
      `Successfully restored ${quantity} stock for item_id=${item_id}`,
    );
    return true;
  } catch (error) {
    console.error("Error restoring stock:", error);
    return false;
  }
};

// ---------- Modal Component ----------
function InputModal({
  title,
  visible,
  maxQuantity,
  requestedQuantity,
  availableStock,
  onSave,
  onCancel,
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!visible) setInputValue("");
  }, [visible]);

  const handleSave = () => {
    const qty = Number(inputValue);
    if (isNaN(qty) || qty <= 0) {
      alert("Please enter a quantity greater than 0.");
      return;
    }
    if (qty >= requestedQuantity) {
      alert(
        `Partially approved quantity must be less than requested quantity (${requestedQuantity}).`,
      );
      return;
    }
    if (qty > availableStock) {
      alert(`Quantity cannot exceed available stock (${availableStock}).`);
      return;
    }
    onSave(qty);
  };

  if (!visible) return null;

  return (
    <ModalOverlay>
      <ModalContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h3 id="modal-title">{title}</h3>

        <p style={{ margin: "6px 0", fontSize: "14px", color: "#555" }}>
          Requested Quantity: <strong>{requestedQuantity}</strong>
        </p>
        <p style={{ margin: "6px 0", fontSize: "14px", color: "#555" }}>
          Available Stock: <strong>{availableStock}</strong>
        </p>

        <ModalInput
          type="number"
          min="1"
          max={Math.min(requestedQuantity - 1, availableStock)}
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
function TravellersIntentApproval() {
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
  const [modalData, setModalData] = useState({
    intentId: null,
    itemIndex: null,
    maxQuantity: 0,
    requestedQuantity: 0,
    availableStock: 0,
  });

  // Re-fetch whenever date filters change
  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const StoreTrustbaseurl =
        process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

      const params = new URLSearchParams();
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);

      const url = `${StoreTrustbaseurl}travellers-intent/?${params.toString()}`;
      const response = await apiRequest(url, "GET");
      if (!response.success)
        throw new Error(response.error || "Failed to fetch data");
      const result = response.data;

      const activeIntents = Array.isArray(result)
        ? result.filter(
            (intent) =>
              intent.is_active !== false || intent.is_active === undefined,
          )
        : [];

      const intentsWithDetails = activeIntents.map((intent) => {
        let raw = intent.items;
        // Unwrap however many layers of stringification exist
        while (typeof raw === "string") {
          try {
            raw = JSON.parse(raw);
          } catch {
            break;
          }
        }
        const items = Array.isArray(raw) ? raw : [];
        const activeItems = items.filter((item) => item.is_active !== false);
        return { ...intent, items: activeItems };
      });

      setIntents(intentsWithDetails);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFromDate(today);
    setToDate(today);
  };

  const handleToggleView = async (intentNumber) => {
    if (expandedIntent === intentNumber) {
      setExpandedIntent(null);
      return;
    }

    const intent = intents.find((i) => i.intent_number === intentNumber);
    if (!intent) return;

    setExpandedIntent(intentNumber);
    setLoading(true);

    try {
      const items = Array.isArray(intent.items) ? intent.items : [];
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          const hsn = item.hsn || "";
          const freshStock = await getTotalStock(item.item_id, hsn);
          return {
            ...item,
            hsn,
            totalStock: freshStock,
            dynamicTotalStock: freshStock,
          };
        }),
      );

      const updatedIntents = intents.map((i) =>
        i.intent_number === intentNumber ? { ...i, items: updatedItems } : i,
      );

      const recalculatedIntents = updateDynamicStock(updatedIntents);
      setIntents(recalculatedIntents);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      alert("Failed to fetch latest stock data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatusAndStock = async (
    intentId,
    itemIndex,
    newStatus,
    approvedQuantity,
    updatedItem = null,
  ) => {
    const intent = intents.find((i) => i.intent_number === intentId);
    if (!intent) return;
    const items = Array.isArray(intent.items) ? [...intent.items] : [];
    const item = items[itemIndex];

    const prevApprovedQty = Number(item.approved || 0);
    const prevStatusNorm = normalizeStatus(item.status);

    const finalUpdatedItem = updatedItem || {
      ...item,
      status: newStatus,
      approved: approvedQuantity,
    };

    items[itemIndex] = finalUpdatedItem;

    let updatedIntents = intents.map((i) =>
      i.intent_number === intentId ? { ...i, items } : i,
    );

    // ── REMOVED: restoreStockInDB call and restoreStockOnRejection ──
    // Backend update_intent_item already handles stock restoration on Reject.
    // Calling add_back_traveller_stock/ here was causing double-restoration.

    updateDynamicStock(updatedIntents);
    setIntents(updatedIntents);

    await updateIntentItemsInDB(intentId, items, finalUpdatedItem, intent.date);
  };

  const updateDynamicStock = (intents) => {
    const sortedIntents = [...intents].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    const stockMap = {};

    sortedIntents.forEach((intent) => {
      intent.items.forEach((item) => {
        const key = `${item.item_id}-${item.hsn || ""}`;

        if (!(key in stockMap)) {
          stockMap[key] = Number(item.totalStock || 0);
        }

        item.dynamicTotalStock = stockMap[key];

        // Normalize status for deduction logic
        const normStatus = normalizeStatus(item.status);
        let deduction = 0;
        if (normStatus === "Approved") {
          deduction = Number(item.quantity || 0);
        } else if (normStatus === "Partially Approved") {
          deduction = Number(item.approved || 0);
        }

        stockMap[key] = Math.max(0, stockMap[key] - deduction);
      });
    });

    return sortedIntents;
  };

  const restoreStockOnRejection = (
    intentsList,
    intentId,
    itemId,
    restoredQty,
  ) => {
    const sortedIntents = [...intentsList].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    const stockMap = {};

    sortedIntents.forEach((intent) => {
      intent.items.forEach((item) => {
        const key = `${item.item_id}-${item.hsn || ""}`;

        if (!(key in stockMap)) {
          stockMap[key] = Number(item.totalStock || 0);
        }

        const normStatus = normalizeStatus(item.status);
        if (
          intent.intent_number === intentId &&
          item.item_id === itemId &&
          normStatus === "Rejected"
        ) {
          stockMap[key] += restoredQty;
        }

        item.dynamicTotalStock = stockMap[key];

        let deduction = 0;
        if (normStatus === "Approved") {
          deduction = Number(item.quantity || 0);
        } else if (normStatus === "Partially Approved") {
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

    // Normalize both for comparison so "Approved" and "Approve" are treated the same
    if (normalizeStatus(item.status) === normalizeStatus(newStatus)) return;

    const requestedQuantity = Number(item.quantity || 0);

    const hsn = item.hsn || "";
    const freshStock = await getTotalStock(item.item_id, hsn);

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
    const newStatusNorm = normalizeStatus(newStatus);

    if (newStatusNorm === "Approved") {
      if (freshStock < requestedQuantity) {
        alert(`Cannot approve. Available stock: ${freshStock}`);
        return;
      }
      approvedQuantity = requestedQuantity;
    } else if (newStatusNorm === "Rejected" || newStatusNorm === "Pending") {
      approvedQuantity = 0;
    }

    const updatedItem = {
      ...item,
      status: newStatus,
      approved: approvedQuantity,
    };
    updateStatusAndStock(
      intentId,
      itemIndex,
      newStatus,
      approvedQuantity,
      updatedItem,
    );
  };

  const updateIntentItemsInDB = async (
    intentId,
    items,
    updatedItem,
    intentDate,
  ) => {
    try {
      const StoreTrustbaseurl =
        process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

      const normStatus = normalizeStatus(updatedItem.status);
      let approvedQty = 0;
      if (normStatus === "Approved") {
        approvedQty = Number(updatedItem.quantity || 0);
      } else if (normStatus === "Partially Approved") {
        approvedQty = Number(updatedItem.approved || 0);
      }

      const data = {
        intent_number: intentId,
        date: intentDate,
        items: [
          {
            item_id: updatedItem.item_id,
            status: updatedItem.status,
            approved_qty: approvedQty,
            hsn: updatedItem.hsn || "",
          },
        ],
      };

      console.log("Sending to backend:", data);
      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-intent/update-item/`,
        "PATCH",
        data,
      );
      if (!response.success) throw new Error(response.error);

      console.log(`Successfully updated intent ${intentId} in DB`);

      await fetchData();

      setIntents((prev) => {
        const intent = prev.find((i) => i.intent_number === intentId);
        if (!intent) return prev;

        (async () => {
          const updatedItems = await Promise.all(
            (Array.isArray(intent.items) ? intent.items : []).map(
              async (item) => {
                const hsn = item.hsn || "";
                const freshStock = await getTotalStock(item.item_id, hsn);
                return {
                  ...item,
                  hsn,
                  totalStock: freshStock,
                  dynamicTotalStock: freshStock,
                };
              },
            ),
          );

          setIntents((latest) => {
            const rehydrated = latest.map((i) =>
              i.intent_number === intentId ? { ...i, items: updatedItems } : i,
            );
            return updateDynamicStock(rehydrated);
          });
        })();

        return prev;
      });
    } catch (err) {
      console.error("Failed to update items in the database:", err);
      alert("Failed to update item. Please try again.");
    }
  };

  const handleModalSave = async (approvedQty) => {
    if (!modalData.intentId) return;

    await updateStatusAndStock(
      modalData.intentId,
      modalData.itemIndex,
      "Partially Approve",
      approvedQty,
    );

    const intent = intents.find((i) => i.intent_number === modalData.intentId);
    if (intent) {
      const items = Array.isArray(intent.items) ? intent.items : [];
      const item = items[modalData.itemIndex];
      if (item) {
        const hsn = item.hsn || "";
        const freshStock = await getTotalStock(item.item_id, hsn);
        setModalData((prev) => ({
          ...prev,
          availableStock: freshStock,
        }));
      }
    }

    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handlePrintTable = async () => {
    const fromLabel = fromDate
      ? new Date(fromDate).toLocaleDateString()
      : "All";
    const toLabel = toDate ? new Date(toDate).toLocaleDateString() : "All";

    // ── Fetch stock for every item that hasn't been loaded yet ──
    const intentsWithStock = await Promise.all(
      filteredIntents.map(async (intent) => {
        const items = Array.isArray(intent.items) ? intent.items : [];
        const itemsWithStock = await Promise.all(
          items.map(async (item) => {
            // Use already-fetched value if available, otherwise call the API
            if (
              item.dynamicTotalStock !== undefined ||
              item.totalStock !== undefined
            ) {
              return item;
            }
            const hsn = item.hsn || "";
            const freshStock = await getTotalStock(item.item_id, hsn);
            return {
              ...item,
              totalStock: freshStock,
              dynamicTotalStock: freshStock,
            };
          }),
        );
        return { ...intent, items: itemsWithStock };
      }),
    );

    let printContent = `
  <style>
    body { font-family: 'Segoe UI', sans-serif; margin: 20px; }
    h2 { text-align: center; margin-bottom: 4px; }
    .date-range { text-align: center; font-size: 13px; color: #555; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid black; padding: 8px; }
    th { color: black; font-weight: bold; font-size: 14px; text-align: center; }
    td.num { text-align: right; }
    td.text { text-align: left; }
    td.center { text-align: center; }
  </style>
  <h2>Traveller Intent Report</h2>
  <div class="date-range">Date Range: ${fromLabel} &mdash; ${toLabel}</div>
  <table>
    <thead>
      <tr>
        <th>S.No</th>
        <th>Date</th>
        <th>Intent Number</th>
        <th>Item Name</th>
        <th>Quantity</th>
        <th>Approved</th>
        <th>Total Stock</th>
        <th>Item Status</th>
        <th>Raised By</th>
        <th>Approved By / Rejected By</th>
      </tr>
    </thead>
    <tbody>
  `;

    let serial = 1;
    intentsWithStock.forEach((intent) => {
      const items = Array.isArray(intent.items) ? intent.items : [];
      if (items.length > 0) {
        items.forEach((item) => {
          const totalStockDisplay =
            item.dynamicTotalStock !== undefined
              ? item.dynamicTotalStock
              : (item.totalStock ?? 0);

          printContent += `
          <tr>
            <td class="num">${serial}</td>
            <td class="center">${new Date(intent.date).toLocaleDateString()}</td>
            <td class="center">${intent.intent_number}</td>
            <td class="text">${item.itemName}</td>
            <td class="num">${item.quantity}</td>
            <td class="num">${item.approved || 0}</td>
            <td class="num">${totalStockDisplay}</td>
            <td class="text">${normalizeStatus(item.status)}</td>
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
      <head><title>Traveller Intent Report (${fromLabel} to ${toLabel})</title></head>
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
          if (item.is_active === false) return;
          exportData.push({
            "Item Name": item.itemName,
            Quantity: item.quantity,
            Approved: item.approved || 0,
            "Total Stock":
              item.dynamicTotalStock !== undefined
                ? item.dynamicTotalStock
                : (item.totalStock ?? 0),
            "Item Status": normalizeStatus(item.status),
            "Raised By ": `${intent.created_by || "N/A"} `,
            "Approved By / Rejected By": ` ${item.approved_by || "Pending"}`,
          });
        });
      } else {
        exportData.push({ "Item Name": "No items" });
      }
      exportData.push({});
    });

    const ws = XLSX.utils.json_to_sheet(exportData, { skipHeader: false });
    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (cell) {
          const columnIndices = [0, 2, 3, 4];
          const isNumericColumn = columnIndices.includes(C);
          cell.s = {
            alignment: {
              horizontal:
                R === 0 ? "center" : isNumericColumn ? "center" : "left",
              vertical: "center",
            },
          };
        }
      }
    }

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
                  (() => {
                    let r = intent.items;
                    while (typeof r === "string") {
                      try {
                        r = JSON.parse(r);
                      } catch {
                        break;
                      }
                    }
                    return Array.isArray(r) ? r : [];
                  })(),
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
                        {expandedIntent === intentId ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
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
          <PopupContainer style={{ minHeight: "400px", overflow: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, color: "#662549" }}>
                Items for {expandedIntent}
              </h3>
              <CloseButton
                onClick={() => setExpandedIntent(null)}
                title="Close"
              >
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
                  <SubTh>Approved By / Rejected By</SubTh>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const intent = intents.find(
                    (i) => i.intent_number === expandedIntent,
                  );
                  if (!intent) return null;
                  const items = Array.isArray(intent.items) ? intent.items : [];

                  return items.length > 0 ? (
                    items.map((item, itemIndex) => {
                      const isEditing =
                        editingRow?.intentId === expandedIntent &&
                        editingRow?.itemIndex === itemIndex;

                      const currentStock =
                        item.totalstock !== undefined // lowercase 's' — this was intentional as a falsy check
                          ? item.dynamicTotalStock
                          : item.totalStock || 0;

                      const requestedQty = Number(item.quantity || 0);
                      const normStatus = normalizeStatus(item.status);

                      // Value shown in dropdown must match one of the <option value="...">
                      // DB now stores full-form ("Approved") → map back to short-form option value
                      const dropdownValue =
                        STATUS_REVERSE[item.status] || item.status || "Pending";

                      // Approved quantity display
                      const approvedDisplay =
                        normStatus === "Partially Approved"
                          ? item.approved
                          : normStatus === "Approved"
                            ? item.quantity
                            : 0;

                      return (
                        <tr key={item.item_id || itemIndex}>
                          <SubTd>{itemIndex + 1}</SubTd>
                          <SubTd>
                            {toRoman(item.item_id || itemIndex + 1)}
                          </SubTd>
                          <SubTd>{item.itemName}</SubTd>
                          <SubTd>{item.quantity}</SubTd>

                          {/* ── Status Dropdown ── */}
                          <SubTd>
                            {isEditing ? (
                              <select
                                value={
                                  STATUS_REVERSE[editValues.status] ||
                                  editValues.status
                                }
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  let newApproved = editValues.approved;
                                  if (newStatus === "Approve")
                                    newApproved = item.quantity.toString();
                                  else if (
                                    newStatus === "Pending" ||
                                    newStatus === "Reject"
                                  )
                                    newApproved = "0";
                                  setEditValues({
                                    status: newStatus,
                                    approved: newApproved,
                                  });
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Partially Approve">
                                  Partially Approve
                                </option>
                                <option
                                  value="Approve"
                                  disabled={requestedQty > currentStock}
                                >
                                  Approve
                                </option>
                                <option value="Reject">Reject</option>
                              </select>
                            ) : (
                              <select
                                value={dropdownValue}
                                onChange={(e) =>
                                  handleItemStatusChange(
                                    expandedIntent,
                                    itemIndex,
                                    e.target.value,
                                  )
                                }
                                // Disable if already Rejected (full-form or short-form)
                                disabled={normStatus === "Rejected"}
                              >
                                <option value="Pending">Pending</option>
                                <option
                                  value="Partially Approve"
                                  disabled={
                                    currentStock <= 0 ||
                                    Number(item.quantity) <= 1
                                  }
                                >
                                  Partially Approve
                                </option>
                                <option
                                  value="Approve"
                                  disabled={
                                    currentStock <= 0 ||
                                    requestedQty > currentStock
                                  }
                                >
                                  Approve
                                </option>
                                <option value="Reject">Reject</option>
                              </select>
                            )}
                          </SubTd>

                          {/* ── Approved Quantity ── */}
                          <SubTd>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValues.approved}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    approved: e.target.value,
                                  }))
                                }
                                disabled={
                                  editValues.status !== "Partially Approve"
                                }
                                min={0}
                                max={Number(item.quantity)}
                                style={{
                                  backgroundColor:
                                    editValues.status === "Partially Approve"
                                      ? "white"
                                      : "#eee",
                                }}
                              />
                            ) : (
                              approvedDisplay
                            )}
                          </SubTd>

                          <SubTd>{currentStock}</SubTd>
                          <SubTd>{intent.created_by || "Unknown"}</SubTd>
                          <SubTd>
                            {normStatus !== "Pending"
                              ? item.approved_by || "Pending"
                              : "Pending"}
                          </SubTd>
                          <SubTd />
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <SubTd colSpan="9" style={{ textAlign: "center" }}>
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

export default TravellersIntentApproval;
