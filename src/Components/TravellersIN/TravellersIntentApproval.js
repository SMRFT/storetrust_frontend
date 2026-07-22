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
import { toast } from "react-toastify";
import { useOutlet } from "../OutletContext";
import * as XLSX from "xlsx";
import {
  ModalOverlay,
  PremiumHeader as Header,
  ModalContent,
  ModalInput,
  ModalButtons,
  TableCell as Td,
  PremiumStatusText as StatusText,
  Overlay,
  PopupContainer,
  Loading,
  ErrorMsg,
  Container,
  PremiumTitle as Title,
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

const getIntentDispatchStatus = (items) => {
  if (!items || items.length === 0) return "Not Dispatched";

  const dispatchStates = items.map((i) => i.is_dispatch === true);

  if (dispatchStates.every((d) => d === true)) return "Dispatched";
  if (dispatchStates.some((d) => d === true)) return "Partially Dispatched";
  return "Not Dispatched";
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

const getTotalStock = async (item_id, hsn, outletCode = "") => {
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  const url = `${StoreTrustbaseurl}travellers-stock/?item_id=${encodeURIComponent(item_id)}&hsn=${encodeURIComponent(hsn || "")}&outlet_code=${encodeURIComponent(outletCode)}`;
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
      toast.warn("Please enter a quantity greater than 0.");
      return;
    }
    if (qty >= requestedQuantity) {
      toast.warn(
        `Partially approved quantity must be less than requested quantity (${requestedQuantity}).`,
      );
      return;
    }
    if (qty > availableStock) {
      toast.warn(`Quantity cannot exceed available stock (${availableStock}).`);
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
  const { selectedOutlet } = useOutlet();
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [searchIndent, setSearchIndent] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dispatchFilter, setDispatchFilter] = useState("");
  const [expandedIntent, setExpandedIntent] = useState(null);
  const [availableStockMap, setAvailableStockMap] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({ approved: "", status: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedDispatchItems, setSelectedDispatchItems] = useState([]);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [modalData, setModalData] = useState({
    intentId: null,
    itemIndex: null,
    maxQuantity: 0,
    requestedQuantity: 0,
    availableStock: 0,
  });

  // Re-fetch whenever date filters or selected outlet changes
  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, selectedOutlet?.outlet_code]);

  useEffect(() => {
    setSelectedDispatchItems([]);
  }, [expandedIntent]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const StoreTrustbaseurl =
        process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
      const outletCode = selectedOutlet?.outlet_code || "";

      const params = new URLSearchParams();
      if (outletCode) params.append("outlet_code", outletCode);
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
    setSearchIndent("");
    setStatusFilter("");
    setDispatchFilter("");
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
      toast.error("Failed to fetch latest stock data. Please try again.");
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
    const freshStock = await getTotalStock(item.item_id, hsn, selectedOutlet?.outlet_code);
    const normStatus = normalizeStatus(item.status);
    const prevApproved =
      normStatus === "Approved"
        ? requestedQuantity
        : normStatus === "Partially Approved"
        ? Number(item.approved || 0)
        : 0;

    const effectiveAvailableStock = freshStock + prevApproved;

    if (newStatus === "Partially Approve") {
      setModalData({
        intentId,
        itemIndex,
        maxQuantity: Math.min(requestedQuantity, effectiveAvailableStock),
        requestedQuantity,
        availableStock: effectiveAvailableStock,
      });
      setModalVisible(true);
      setHasChanges(true);
      return;
    }

    let approvedQuantity = 0;
    const newStatusNorm = normalizeStatus(newStatus);

    if (newStatusNorm === "Approved") {
      if (effectiveAvailableStock < requestedQuantity) {
        toast.error(`Cannot approve. Available stock: ${effectiveAvailableStock}`);
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

      const intentRecord = intents.find((i) => i.intent_number === intentId);
      const outletCode =
        selectedOutlet?.outlet_code ||
        intentRecord?.outlet_code ||
        "";

      const data = {
        intent_number: intentId,
        date: intentDate,
        outlet_code: outletCode,
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
      toast.error("Failed to update item. Please try again.");
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

  const handleToggleDispatchItem = (itemIndex) => {
    setSelectedDispatchItems((prev) => {
      if (prev.includes(itemIndex)) {
        return prev.filter((idx) => idx !== itemIndex);
      } else {
        return [...prev, itemIndex];
      }
    });
  };

  const handleSelectAllDispatch = (dispatchableIndices) => {
    const allSelected =
      dispatchableIndices.length > 0 &&
      dispatchableIndices.every((idx) => selectedDispatchItems.includes(idx));
    if (allSelected) {
      setSelectedDispatchItems((prev) =>
        prev.filter((idx) => !dispatchableIndices.includes(idx)),
      );
    } else {
      setSelectedDispatchItems((prev) => {
        const next = [...prev];
        dispatchableIndices.forEach((idx) => {
          if (!next.includes(idx)) next.push(idx);
        });
        return next;
      });
    }
  };

  const handleBatchDispatch = async () => {
    if (selectedDispatchItems.length === 0 || !expandedIntent) return;

    try {
      setIsBatchUpdating(true);
      const intent = intents.find((i) => i.intent_number === expandedIntent);
      if (!intent) return;

      const StoreTrustbaseurl =
        process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

      const itemsToUpdate = selectedDispatchItems.map((itemIndex) => {
        const item = intent.items[itemIndex];
        return {
          item_id: item.item_id,
          is_dispatch: true,
          hsn: item.hsn || "",
        };
      });

      const outletCode =
        selectedOutlet?.outlet_code ||
        intent?.outlet_code ||
        "";

      const data = {
        intent_number: expandedIntent,
        date: intent.date,
        outlet_code: outletCode,
        items: itemsToUpdate,
      };

      console.log("Sending batch dispatch request:", data);
      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-intent/update-item/`,
        "PATCH",
        data,
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to update dispatch status.");
      }

      toast.success("Items successfully marked as dispatched!");
      setSelectedDispatchItems([]);
      await fetchData();

      // Refresh stock & dynamic calculations
      const freshIntents = intents.map((i) => {
        if (i.intent_number === expandedIntent) {
          const updatedItems = i.items.map((item, idx) => {
            if (selectedDispatchItems.includes(idx)) {
              return {
                ...item,
                is_dispatch: true,
              };
            }
            return item;
          });
          return { ...i, items: updatedItems };
        }
        return i;
      });
      setIntents(updateDynamicStock(freshIntents));

    } catch (err) {
      console.error("Failed to batch update dispatch:", err);
      toast.error(`Error updating dispatch: ${err.message}`);
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const handlePrintTable = async () => {
    const fromLabel = fromDate ? new Date(fromDate).toLocaleDateString() : "All";
    const toLabel = toDate ? new Date(toDate).toLocaleDateString() : "All";

    // ── Fetch stock for every item that hasn't been loaded yet ──
    const intentsWithStock = await Promise.all(
      filteredIntents.map(async (intent) => {
        const items = Array.isArray(intent.items) ? intent.items : [];
        const itemsWithStock = await Promise.all(
          items.map(async (item) => {
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
      body { font-family: 'Segoe UI', sans-serif; margin: 30px; color: #2e1a23; }
      .intent-section {
        margin-bottom: 50px;
        border-bottom: 2.5px dashed #e8c8d0;
        padding-bottom: 35px;
      }
      .intent-section:last-child {
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
      }
      h2 { text-align: center; margin-bottom: 25px; color: #662549; }
      
      .info-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      .info-table th, .info-table td {
        border: 1.5px solid #e8c8d0;
        padding: 10px 12px;
        font-size: 13px;
      }
      .info-table th {
        background-color: #fcefee;
        color: #662549;
        font-weight: 700;
        text-align: left;
      }
      
      .section-title {
        font-size: 13px;
        font-weight: 700;
        color: #662549;
        margin-top: 20px;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .items-table {
        width: 100%;
        border-collapse: collapse;
      }
      .items-table th, .items-table td {
        border: 1px solid rgba(232, 200, 208, 0.6);
        padding: 10px 12px;
        font-size: 13px;
        text-align: left;
      }
      .items-table th {
        background-color: #faf6f7;
        color: #662549;
        font-weight: 700;
      }
      .center { text-align: center; }
    </style>
    <h2>${selectedOutlet?.outlet_name || "Outlet"} Indent Report</h2>
  `;

    intentsWithStock.forEach((intent) => {
      const items = Array.isArray(intent.items) ? intent.items : [];
      const intentId = intent.intent_number || intent.id;
      const status = getIntentStatus(items);
      const dispatchStatus = getIntentDispatchStatus(items);

      printContent += `
        <div class="intent-section">
          <table class="info-table">
            <thead>
              <tr>
                <th>Indent Number</th>
                <th>Date</th>
                <th>Raised By</th>
                <th>Status</th>
                <th>Dispatch Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${intentId}</td>
                <td>${new Date(intent.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}</td>
                <td>${intent.created_by || "Unknown"}</td>
                <td>${status}</td>
                <td>${dispatchStatus}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="section-title">ITEMS (${items.length})</div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th class="center" style="width: 60px;">ID</th>
                <th>Item Name</th>
                <th class="center">Requested Qty</th>
                <th class="center">Approved Qty</th>
                <th>Approved/Rejected By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${items.length > 0
          ? items
            .map(
              (item, idx) => `
                  <tr>
                    <td class="center">#${idx + 1}</td>
                    <td>${item.itemName || "—"}</td>
                    <td class="center">${item.quantity}</td>
                    <td class="center">${item.status === "Reject" || item.status === "Rejected" ? 0 : (item.approved ?? item.quantity)}</td>
                    <td>${item.approved_by || "—"}</td>
                    <td>${item.status || "Pending"}</td>
                  </tr>`
            )
            .join("")
          : `<tr><td colspan="6" class="center">No items.</td></tr>`
        }
            </tbody>
          </table>
        </div>
      `;
    });

    const win = window.open("", "_blank");
    win.document.write(`
    <html>
      <head>
        <title>${selectedOutlet?.outlet_name || "Outlet"} Indent Report (${fromLabel} to ${toLabel})</title>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
    win.document.close();
  };

  const handleExportExcel = () => {
    const exportData = [];

    // 1. Report Title Row (Once at the top)
    exportData.push({
      Col1: `${selectedOutlet?.outlet_name || "Outlet"} Indent Report`,
    });
    exportData.push({});

    filteredIntents.forEach((intent) => {
      const items = Array.isArray(intent.items) ? intent.items : [];
      const status = getIntentStatus(items);
      const dispatchStatus = getIntentDispatchStatus(items);

      // 2. Details Header Row
      exportData.push({
        Col1: "Indent Number",
        Col2: "Date",
        Col3: "Raised By",
        Col4: "Status",
        Col5: "Dispatch Status",
      });

      // 3. Details Data Row
      exportData.push({
        Col1: intent.intent_number || intent.id,
        Col2: new Date(intent.date).toLocaleDateString(),
        Col3: intent.created_by || "Unknown",
        Col4: status,
        Col5: dispatchStatus,
      });

      // 4. Spacing Row
      exportData.push({});

      // 5. Items Title Row
      exportData.push({
        Col1: `ITEMS (${items.length})`,
      });

      // 6. Items Header Row
      exportData.push({
        Col1: "ID",
        Col2: "Item Name",
        Col3: "Requested Qty",
        Col4: "Approved Qty",
        Col5: "Approved/Rejected By",
        Col6: "Status",
      });

      // 7. Items Data Rows
      if (items.length > 0) {
        items.forEach((item, idx) => {
          exportData.push({
            Col1: `#${idx + 1}`,
            Col2: item.itemName || "—",
            Col3: item.quantity,
            Col4:
              item.status === "Reject" || item.status === "Rejected"
                ? 0
                : (item.approved ?? item.quantity),
            Col5: item.approved_by || "—",
            Col6: item.status || "Pending",
          });
        });
      } else {
        exportData.push({
          Col1: "No items.",
        });
      }

      // 8. Spacing Rows before next block
      exportData.push({});
      exportData.push({});
    });

    const ws = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });

    // Format column widths dynamically
    const colWidths = exportData.reduce((widths, row) => {
      Object.keys(row).forEach((key, i) => {
        const val = row[key] ? row[key].toString() : "";
        widths[i] = Math.max(widths[i] || 10, val.length);
      });
      return widths;
    }, []);
    ws["!cols"] = colWidths.map((w) => ({ wch: w + 2 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Traveller Indents");
    XLSX.writeFile(wb, "travellers_indents.xlsx");
  };

  const filteredIntents = intents.filter((intent) => {
    const intentDate = new Date(intent.date).toISOString().split("T")[0];
    if (fromDate && intentDate < fromDate) return false;
    if (toDate && intentDate > toDate) return false;

    const intentId = String(intent.intent_number || intent.id || "");
    if (
      searchIndent.trim() &&
      !intentId.toLowerCase().includes(searchIndent.toLowerCase().trim())
    ) {
      return false;
    }

    const itemsList = (() => {
      let r = intent.items;
      while (typeof r === "string") {
        try {
          r = JSON.parse(r);
        } catch {
          break;
        }
      }
      return Array.isArray(r) ? r : [];
    })();

    if (statusFilter) {
      const status = getIntentStatus(itemsList);
      if (status !== statusFilter) return false;
    }

    if (dispatchFilter) {
      const dispatchStatus = getIntentDispatchStatus(itemsList);
      if (dispatchStatus !== dispatchFilter) return false;
    }

    return true;
  });

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <ErrorMsg>Error: {error}</ErrorMsg>;

  return (
    <Container>
      <Header>
        <Title>{selectedOutlet?.outlet_name || "Outlet"} Indent Approval</Title>
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
        <FilterGroup style={{ flex: "1.5", minWidth: "200px" }}>
          <Label>Search Indent Number</Label>
          <Input
            type="text"
            placeholder="Search by Indent Number..."
            value={searchIndent}
            onChange={(e) => setSearchIndent(e.target.value)}
          />
        </FilterGroup>
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
        <FilterGroup>
          <Label>Status</Label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Partially Approved">Partially Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </FilterGroup>
        <FilterGroup>
          <Label>Dispatch Status</Label>
          <select
            value={dispatchFilter}
            onChange={(e) => setDispatchFilter(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">All Dispatch Statuses</option>
            <option value="Not Dispatched">Not Dispatched</option>
            <option value="Partially Dispatched">Partially Dispatched</option>
            <option value="Dispatched">Dispatched</option>
          </select>
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
              <Th>Indent Number</Th>
              <Th>Status</Th>
              <Th>Dispatch Status</Th>
              <Th className="no-print">Action</Th>
            </tr>
          </thead>
          <tbody>
            {filteredIntents.length > 0 ? (
              filteredIntents.map((intent, index) => {
                const intentId = intent.intent_number || intent.id;
                const itemsList = (() => {
                  let r = intent.items;
                  while (typeof r === "string") {
                    try {
                      r = JSON.parse(r);
                    } catch {
                      break;
                    }
                  }
                  return Array.isArray(r) ? r : [];
                })();

                const status = getIntentStatus(itemsList);
                const dispatchStatus = getIntentDispatchStatus(itemsList);

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
                    <Td>
                      <StatusText
                        className={`status-${dispatchStatus.toLowerCase().replace(" ", "-")}`}
                      >
                        {dispatchStatus}
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
                <Td colSpan="6" style={{ textAlign: "center" }}>
                  No data available
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {expandedIntent && (() => {
        const intent = intents.find((i) => i.intent_number === expandedIntent);
        if (!intent) return null;
        const items = Array.isArray(intent.items) ? intent.items : [];

        const dispatchableIndices = items
          .map((item, idx) => {
            const normStatus = normalizeStatus(item.status);
            const isDispatchable =
              (normStatus === "Approved" || normStatus === "Partially Approved") &&
              !item.is_dispatch;
            return isDispatchable ? idx : -1;
          })
          .filter((idx) => idx !== -1);

        const allSelected =
          dispatchableIndices.length > 0 &&
          dispatchableIndices.every((idx) => selectedDispatchItems.includes(idx));

        return (
          <Overlay>
            <PopupContainer style={{ minHeight: "450px", overflow: "auto" }}>
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
                    <SubTh style={{ minWidth: "100px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => handleSelectAllDispatch(dispatchableIndices)}
                          style={{ cursor: "pointer" }}
                        />
                        <span>Dispatch</span>
                      </div>
                    </SubTh>
                    <SubTh>Item ID</SubTh>
                    <SubTh>Item Name</SubTh>
                    <SubTh>Quantity</SubTh>
                    <SubTh>Status</SubTh>
                    <SubTh>Approved</SubTh>
                    <SubTh>Total Stock</SubTh>
                    <SubTh>Dispatch Status</SubTh>
                    <SubTh>Raised By</SubTh>
                    <SubTh>Approved By / Rejected By</SubTh>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item, itemIndex) => {
                      const isEditing =
                        editingRow?.intentId === expandedIntent &&
                        editingRow?.itemIndex === itemIndex;

                      const currentStock =
                        item.totalstock !== undefined
                          ? item.dynamicTotalStock
                          : item.totalStock || 0;

                      const requestedQty = Number(item.quantity || 0);
                      const normStatus = normalizeStatus(item.status);

                      const dropdownValue =
                        STATUS_REVERSE[item.status] || item.status || "Pending";

                      const approvedDisplay =
                        normStatus === "Partially Approved"
                          ? item.approved
                          : normStatus === "Approved"
                            ? item.quantity
                            : 0;

                      const isDispatchChecked = item.is_dispatch === true || selectedDispatchItems.includes(itemIndex);
                      const isDispatchDisabled =
                        item.is_dispatch === true ||
                        !(normStatus === "Approved" || normStatus === "Partially Approved");

                      return (
                        <tr key={item.item_id || itemIndex}>
                          <SubTd>{itemIndex + 1}</SubTd>
                          <SubTd>
                            <input
                              type="checkbox"
                              checked={isDispatchChecked}
                              disabled={isDispatchDisabled}
                              onChange={() => handleToggleDispatchItem(itemIndex)}
                              style={{ cursor: isDispatchDisabled ? "not-allowed" : "pointer" }}
                            />
                          </SubTd>
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
                                disabled={item.is_dispatch === true}
                              >
                                <option value="Pending">Pending</option>
                                <option
                                  value="Partially Approve"
                                  disabled={
                                    Number(item.quantity) <= 1 ||
                                    (normStatus !== "Approved" &&
                                     normStatus !== "Partially Approved" &&
                                     currentStock <= 0)
                                  }
                                >
                                  Partially Approve
                                </option>
                                <option
                                  value="Approve"
                                  disabled={
                                    normStatus !== "Approved" &&
                                    (currentStock <= 0 || requestedQty > currentStock)
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
                          <SubTd>
                            <StatusText
                              className={`status-${item.is_dispatch ? "dispatched" : "not-dispatched"}`}
                              style={{ padding: "2px 8px", fontSize: "0.72rem" }}
                            >
                              {item.is_dispatch ? "Dispatched" : "Not Dispatched"}
                            </StatusText>
                          </SubTd>
                          <SubTd>{intent.created_by || "Unknown"}</SubTd>
                          <SubTd>
                            {normStatus !== "Pending"
                              ? item.approved_by || "Pending"
                              : "Pending"}
                          </SubTd>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <SubTd colSpan="11" style={{ textAlign: "center" }}>
                        No items available
                      </SubTd>
                    </tr>
                  )}
                </tbody>
              </SubTable>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "16px",
                }}
              >
                <Button
                  onClick={handleBatchDispatch}
                  disabled={selectedDispatchItems.length === 0 || isBatchUpdating}
                  style={{ background: "linear-gradient(135deg, #662549 0%, #8c3b6a 100%)" }}
                >
                  {isBatchUpdating ? "Dispatching..." : "Dispatch Selected"}
                </Button>
              </div>
            </PopupContainer>
          </Overlay>
        );
      })()}

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
