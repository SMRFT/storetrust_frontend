import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  Calendar,
  Search,
  Printer,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  X,
  CreditCard,
  History,
} from "lucide-react";

import {
  Container,
  Header,
  Title,
  FiltersSection,
  FiltersGrid,
  FilterGroup,
  Label,
  InputWrapper,
  IconWrapper,
  Input,
  ActionsSection,
  RecordsInfo,
  RecordsText,
  ButtonGroup,
  ButtonContainer,
  GreenButton,
  TableContainer,
  TableWrapper,
  Table,
  TableBody,
  TableRow,
  TableActionButton,
  Th,
  Td,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  PaginationSection,
  PaginationLeft,
  PaginationRight,
  PaginationControls,
  PaginationButton,
  PaginationText,
  CustomBadge,
  CustomButton,
  ModalOverlay,
  ModalContent,
  ModalScrollContainer,
  ModalHeader,
  ModalTitle,
  ModalBody,
  DetailSection,
  DetailSectionTitle,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  ItemsSection,
  ItemsTable,
  ItemsTableHeader,
  ItemsTableRow,
  ItemsTableHeaderCell,
  ItemsTableCell,
  HistoryButton,
  PaymentModalOverlay,
  PaymentModalContent,
  PaymentModalHeader,
  PaymentModalTitle,
  PaymentForm,
  PaymentInputWrapper,
  PaymentLabel,
  PaymentInput,
  PaymentSelect,
  PaymentButtonContainer,
  HistoryModalOverlay,
  HistoryModalContent,
  HistoryModalHeader,
  HistoryModalTitle,
  HistoryTable,
  HistoryTableHeader,
  HistoryTableRow,
  HistoryTableHeaderCell,
  HistoryTableCell,
} from "../StyledComponents";

import apiRequest from "../apiRequest";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// Portal — renders children directly into <body>
// This is the key fix: modals escape the sidebar's
// stacking context entirely, so z-index always wins.
// ─────────────────────────────────────────────
const Portal = ({ children }) => ReactDOM.createPortal(children, document.body);

// ─────────────────────────────────────────────
// Utility formatters
// ─────────────────────────────────────────────
const formatDate = (date) => {
  if (!date || new Date(date).toString() === "Invalid Date") return "N/A";
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr || isNaN(new Date(dateStr))) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) =>
  `₹${parseFloat(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const convertToDateFormat = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

// ─────────────────────────────────────────────
// HistoryModal
// ─────────────────────────────────────────────
const HistoryModal = ({ show, onClose, item, historyData, loading }) => {
  if (!show || !item) return null;

  const safeHistoryData = Array.isArray(historyData) ? historyData : [];

  const prices = safeHistoryData.map((h) =>
    parseFloat(h.matched_item?.unitPrice || 0),
  );
  const priceStats =
    prices.length === 0
      ? { min: 0, max: 0, avg: 0 }
      : {
          min: Math.min(...prices),
          max: Math.max(...prices),
          avg: prices.reduce((s, p) => s + p, 0) / prices.length,
        };
  const totalStock = safeHistoryData.reduce(
    (t, h) => t + parseInt(h.matched_item?.totalstock || 0),
    0,
  );
  return (
    <Portal>
      <HistoryModalOverlay onClick={onClose} style={{ zIndex: 9999 }}>
        <HistoryModalContent onClick={(e) => e.stopPropagation()}>
          <HistoryModalHeader>
            <HistoryModalTitle>
              Purchase History — {item.itemName} (HSN: {item.hsn}) — Total
              Stock: {totalStock}
              <div
                style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
              >
                Price Range: ₹{priceStats.min.toFixed(2)} – ₹
                {priceStats.max.toFixed(2)} | Avg: ₹{priceStats.avg.toFixed(2)}
              </div>
            </HistoryModalTitle>
            <CustomButton variant="cancel" onClick={onClose}>
              <X size={20} />
            </CustomButton>
          </HistoryModalHeader>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <LoadingSpinner />
              <LoadingText>Loading history...</LoadingText>
            </div>
          ) : safeHistoryData.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
            >
              No previous purchase history found for this item.
            </div>
          ) : (
            <HistoryTable>
              <HistoryTableHeader>
                <HistoryTableRow>
                  {[
                    "GRN Number",
                    "Date",
                    "Vendor",
                    "HSN",
                    "Item Name",
                    "Unit Price",
                    "Purchase Cost",
                    "Quantity",
                    "Free",
                    "Stock",
                    "Batch",
                    "MRP",
                  ].map((h) => (
                    <HistoryTableHeaderCell key={h}>{h}</HistoryTableHeaderCell>
                  ))}
                </HistoryTableRow>
              </HistoryTableHeader>
              <tbody>
                {safeHistoryData.map((historyItem, index) => {
                  const itemData = historyItem.matched_item || {};
                  const unitPrice = parseFloat(itemData.unitPrice || 0);
                  return (
                    <HistoryTableRow key={index}>
                      <HistoryTableCell>
                        {historyItem.grn_number || "N/A"}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {new Date(historyItem.date).toLocaleDateString("en-IN")}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {historyItem.vendor_name || "N/A"}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {itemData.hsn || "N/A"}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {itemData.itemName || "N/A"}
                      </HistoryTableCell>
                      <HistoryTableCell
                        isPriceColumn
                        isHighPrice={
                          unitPrice === priceStats.max &&
                          priceStats.max > priceStats.min
                        }
                        isLowPrice={
                          unitPrice === priceStats.min &&
                          priceStats.max > priceStats.min
                        }
                      >
                        ₹
                        {unitPrice.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        ₹
                        {parseFloat(itemData.purchaseCost || 0).toLocaleString(
                          "en-IN",
                          { minimumFractionDigits: 2 },
                        )}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {itemData.quantity || "N/A"}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {itemData.free || "0"}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {itemData.totalstock || "0"}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {itemData.batch || "-"}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        ₹
                        {parseFloat(itemData.mrp || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </HistoryTableCell>
                    </HistoryTableRow>
                  );
                })}
              </tbody>
            </HistoryTable>
          )}
        </HistoryModalContent>
      </HistoryModalOverlay>
    </Portal>
  );
};

// ─────────────────────────────────────────────
// EnhancedViewModal
// ─────────────────────────────────────────────
const EnhancedViewModal = ({
  showModal,
  selectedRecord,
  onClose,
  onShowHistory,
}) => {
  if (!showModal || !selectedRecord) return null;
  return (
    <Portal>
      <ModalOverlay onClick={onClose} style={{ zIndex: 9000 }}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalScrollContainer>
            <ModalHeader>
              <ModalTitle>
                GRN Details — {selectedRecord.grn_number || "N/A"}
              </ModalTitle>
              <CustomButton variant="cancel" onClick={onClose}>
                <X size={20} />
              </CustomButton>
            </ModalHeader>

            <ModalBody>
              {/* Basic Information */}
              <DetailSection>
                <DetailSectionTitle>📊 Basic Information</DetailSectionTitle>
                <DetailGrid>
                  {[
                    ["GRN Number", selectedRecord.grn_number],
                    ["Purchase Category", selectedRecord.purchase_category],
                    ["Vendor", selectedRecord.vendor],
                    ["Date", formatDate(selectedRecord.date)],
                    ["Contact Person", selectedRecord.contact_person],
                    ["Phone", selectedRecord.phone],
                  ].map(([label, value]) => (
                    <DetailItem key={label}>
                      <DetailLabel>{label}</DetailLabel>
                      <DetailValue>{value || "N/A"}</DetailValue>
                    </DetailItem>
                  ))}
                </DetailGrid>
              </DetailSection>

              {/* Invoice Information */}
              <DetailSection>
                <DetailSectionTitle>🧾 Invoice Information</DetailSectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Invoice Number</DetailLabel>
                    <DetailValue>
                      {selectedRecord.invoice_no || "N/A"}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Invoice Date</DetailLabel>
                    <DetailValue>
                      {formatDate(selectedRecord.invoice_date)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Credit Period</DetailLabel>
                    <DetailValue>
                      {selectedRecord.credit_period || "N/A"}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Due Date</DetailLabel>
                    <DetailValue>
                      {formatDate(selectedRecord.due_date)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Payment Method</DetailLabel>
                    <DetailValue>
                      {selectedRecord.payment_details?.payment_method || "N/A"}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Payment Status</DetailLabel>
                    <DetailValue>
                      <CustomBadge
                        status={selectedRecord.payment_details?.status || "N/A"}
                      >
                        {selectedRecord.payment_details?.status || "N/A"}
                      </CustomBadge>
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Amount Paid</DetailLabel>
                    <DetailValue className="currency">
                      {formatCurrency(
                        selectedRecord.payment_details?.amount_paid,
                      )}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Pending Amount</DetailLabel>
                    <DetailValue className="currency">
                      {formatCurrency(
                        selectedRecord.payment_details?.pending_amount ??
                          selectedRecord.pending_amount,
                      )}
                    </DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              {/* Financial Breakdown */}
              <DetailSection>
                <DetailSectionTitle>💰 Financial Breakdown</DetailSectionTitle>
                <DetailGrid>
                  {[
                    ["Non-Taxable Amount", selectedRecord.non_taxable_amount],
                    ["Taxable Amount", selectedRecord.taxable_amount],
                    ["CGST", selectedRecord.cgst],
                    ["SGST", selectedRecord.sgst],
                    ["IGST", selectedRecord.igst],
                  ].map(([label, value]) => (
                    <DetailItem key={label}>
                      <DetailLabel>{label}</DetailLabel>
                      <DetailValue className="currency">
                        {formatCurrency(value)}
                      </DetailValue>
                    </DetailItem>
                  ))}
                  <DetailItem
                    style={{
                      background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
                      border: "2px solid #0284c7",
                      boxShadow: "0 8px 25px rgba(2,132,199,.15)",
                    }}
                  >
                    <DetailLabel
                      style={{ color: "#0284c7", fontWeight: "bold" }}
                    >
                      Total Amount
                    </DetailLabel>
                    <DetailValue
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#0284c7",
                      }}
                    >
                      {formatCurrency(selectedRecord.total_amount)}
                    </DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              {/* Items */}
              <DetailSection>
                <ItemsSection>
                  <DetailSectionTitle>📦 Items Details</DetailSectionTitle>
                  <ItemsTable>
                    <ItemsTableHeader>
                      <ItemsTableRow>
                        {[
                          "Item Name",
                          "HSN",
                          "Quantity",
                          "Unit Cost",
                          "Purchase Cost",
                          "History",
                        ].map((h) => (
                          <ItemsTableHeaderCell key={h}>
                            {h}
                          </ItemsTableHeaderCell>
                        ))}
                      </ItemsTableRow>
                    </ItemsTableHeader>
                    <tbody>
                      {selectedRecord.items?.length > 0 ? (
                        selectedRecord.items.map((item, index) => (
                          <ItemsTableRow key={index}>
                            <ItemsTableCell>
                              {item.itemName || "N/A"}
                            </ItemsTableCell>
                            <ItemsTableCell>{item.hsn || "N/A"}</ItemsTableCell>
                            <ItemsTableCell>
                              {item.quantity || "N/A"}
                            </ItemsTableCell>
                            <ItemsTableCell>
                              {formatCurrency(item.unitPrice || 0)}
                            </ItemsTableCell>
                            <ItemsTableCell>
                              {formatCurrency(item.purchaseCost || 0)}
                            </ItemsTableCell>
                            <ItemsTableCell>
                              <HistoryButton
                                onClick={() => onShowHistory(item)}
                              >
                                <History size={14} /> History
                              </HistoryButton>
                            </ItemsTableCell>
                          </ItemsTableRow>
                        ))
                      ) : (
                        <ItemsTableRow>
                          <ItemsTableCell
                            colSpan="6"
                            style={{ textAlign: "center" }}
                          >
                            No items found
                          </ItemsTableCell>
                        </ItemsTableRow>
                      )}
                    </tbody>
                  </ItemsTable>
                </ItemsSection>
              </DetailSection>

              {/* Additional Details */}
              <DetailSection>
                <DetailSectionTitle>📝 Additional Details</DetailSectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Address</DetailLabel>
                    <DetailValue>
                      {[
                        selectedRecord.addressLine1,
                        selectedRecord.addressLine2,
                        selectedRecord.city,
                        selectedRecord.state,
                        selectedRecord.address,
                      ]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Remarks</DetailLabel>
                    <DetailValue>{selectedRecord.remarks || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Created By</DetailLabel>
                    <DetailValue>
                      {selectedRecord.created_by && selectedRecord.created_by_id
                        ? `${selectedRecord.created_by} (ID: ${selectedRecord.created_by_id})`
                        : selectedRecord.created_by || "N/A"}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Created Date</DetailLabel>
                    <DetailValue>
                      {formatDateTime(selectedRecord.created_date)}
                    </DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>
            </ModalBody>
          </ModalScrollContainer>
        </ModalContent>
      </ModalOverlay>
    </Portal>
  );
};

// ─────────────────────────────────────────────
// PaymentModal
// ─────────────────────────────────────────────
const PaymentModal = ({
  show,
  paymentDetails,
  isPaymentDirty,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!show) return null;
  return (
    <Portal>
      <PaymentModalOverlay onClick={onClose} style={{ zIndex: 9000 }}>
        <PaymentModalContent onClick={(e) => e.stopPropagation()}>
          <PaymentModalHeader>
            <PaymentModalTitle>
              Update Payment — {paymentDetails.grn_number}
            </PaymentModalTitle>
            <CustomButton variant="cancel" onClick={onClose}>
              <X size={20} />
            </CustomButton>
          </PaymentModalHeader>

          <PaymentForm onSubmit={onSubmit}>
            {/* Payment Date */}
            <PaymentInputWrapper>
              <PaymentLabel>Payment Date *</PaymentLabel>
              <PaymentInput
                type="date"
                value={paymentDetails.payment_date}
                onChange={(e) => onChange("payment_date", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </PaymentInputWrapper>

            {/* Pending Amount — read-only, this is what will be paid */}
            <PaymentInputWrapper>
              <PaymentLabel>Pending Amount</PaymentLabel>
              <PaymentInput
                type="number"
                value={paymentDetails.pending_amount.toFixed(2)}
                readOnly
                style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
              />
            </PaymentInputWrapper>

            {/* Payment Method */}
            <PaymentInputWrapper>
              <PaymentLabel>Payment Method *</PaymentLabel>
              <PaymentSelect
                value={paymentDetails.payment_method}
                onChange={(e) => onChange("payment_method", e.target.value)}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="NEFT">NEFT</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </PaymentSelect>
            </PaymentInputWrapper>

            {/* Extra detail field only for non-Cash methods */}
            {["NEFT", "UPI", "Cheque", "Bank Transfer"].includes(
              paymentDetails.payment_method,
            ) && (
              <PaymentInputWrapper>
                <PaymentLabel>
                  {paymentDetails.payment_method === "UPI"
                    ? "UPI Transaction ID *"
                    : paymentDetails.payment_method === "Cheque"
                      ? "Cheque Number *"
                      : "Transaction Details *"}
                </PaymentLabel>
                <PaymentInput
                  type="text"
                  value={paymentDetails.payment_details}
                  onChange={(e) => onChange("payment_details", e.target.value)}
                  placeholder={`Enter ${
                    paymentDetails.payment_method === "UPI"
                      ? "UPI Transaction ID"
                      : paymentDetails.payment_method === "Cheque"
                        ? "Cheque Number"
                        : "Transaction Details"
                  }`}
                  required
                />
              </PaymentInputWrapper>
            )}

            <PaymentButtonContainer>
              <CustomButton variant="cancel" onClick={onClose}>
                Cancel
              </CustomButton>
              <CustomButton
                variant="primary"
                type="submit"
                disabled={
                  !isPaymentDirty ||
                  !paymentDetails.payment_method ||
                  !paymentDetails.payment_date
                }
              >
                Pay
              </CustomButton>
            </PaymentButtonContainer>
          </PaymentForm>
        </PaymentModalContent>
      </PaymentModalOverlay>
    </Portal>
  );
};

// ─────────────────────────────────────────────
// Main GRNReport component
// ─────────────────────────────────────────────
const GRNReport = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from_date: new Date().toISOString().split("T")[0],
    to_date: new Date().toISOString().split("T")[0],
    search: "",
    category: "ALL",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    grn_number: "",
    amount_paid: "",
    payment_method: "",
    payment_details: "",
    payment_date: "",
    pending_amount: 0,
  });
  const [isPaymentDirty, setIsPaymentDirty] = useState(false);

  const navigate = useNavigate();
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  const getCategoryTitle = () => {
    switch (filters.category) {
      case "TRAVELLERS IN CASH":
        return "Travellers IN Cash GRN Report";
      case "TRAVELLERS IN CREDIT":
        return "Travellers IN Credit GRN Report";
      default:
        return "Travellers IN GRN Report";
    }
  };

  const formatPaymentHistory = (paymentStatus) => {
    if (!Array.isArray(paymentStatus) || paymentStatus.length === 0)
      return ["N/A", "N/A", "N/A"];
    const valid = paymentStatus
      .filter((p) => p.payment_date)
      .slice(-3)
      .map(
        (p) =>
          `Date: ${p.payment_date}<br />Paid: ${formatCurrency(p.amount_paid)}<br />Method: ${p.payment_method || "N/A"}`,
      );
    return [...valid, ...Array(3 - valid.length).fill("N/A")];
  };

  // ── Fix 1: Remove is_active frontend filter in fetchAllData ──────────
  const fetchAllData = useCallback(
    async (page = 1, size = 100) => {
      setLoading(true);
      try {
        const response = await apiRequest(
          `${StoreTrustbaseurl}travellers-in/list/?from_date=${filters.from_date}&to_date=${filters.to_date}&page=${page}&page_size=${size}`,
          "GET",
        );
        if (!response.success)
          throw new Error(response.error || "API request failed");
        if (response.data?.status !== "success")
          throw new Error(response.data?.message || "Backend error");
        if (!Array.isArray(response.data?.data))
          throw new Error("Invalid data format");

        // ✅ Removed is_active filter — field no longer exists on model
        const records = response.data.data;
        setAllData(records);
        setFilteredData(records);
        if (records.length === 0) toast.info("No records found");
      } catch (error) {
        toast.error(error.message || "Failed to fetch GRN records");
        setAllData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    },
    // ✅ Fix 2: Add filters.from_date and filters.to_date as dependencies
    // so fetchAllData re-runs when dates change
    [StoreTrustbaseurl, filters.from_date, filters.to_date],
  );

  const fetchPreviousPurchases = async (item) => {
    const hsn = String(item?.hsn ?? "").trim();
    const item_id = String(item?.item_id ?? "").trim();

    if (!item_id) {
      toast.error("Please select an item first");
      return;
    }
    if (!hsn) {
      toast.error("HSN code is required");
      return;
    }

    setSelectedItemForHistory({ ...item, hsn, item_id });
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const url = `${StoreTrustbaseurl}travellers-in/previous-purchases/?hsn=${encodeURIComponent(hsn)}&item_id=${encodeURIComponent(item_id)}`;
      const r = await apiRequest(url, "GET");
      setHistoryData(
        r.success && r.data?.status === "success" ? r.data.data || [] : [],
      );
    } catch {
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ── filters ───────────────────────────────────
  const applyFilters = useCallback(() => {
    let filtered = [...allData];

    if (filters.category && filters.category !== "ALL")
      filtered = filtered.filter(
        (item) => item.purchase_category?.toUpperCase() === filters.category,
      );

    // ✅ Removed from_date / to_date filtering here — backend already filters by date
    // Only search filter remains for client-side filtering

    if (filters.search.trim()) {
      const term = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.grn_number?.toLowerCase().includes(term) ||
          item.invoice_no?.toLowerCase().includes(term) ||
          item.vendor?.toLowerCase().includes(term) ||
          item.purchase_category?.toLowerCase().includes(term) ||
          item.payment_details?.status?.toLowerCase().includes(term),
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [allData, filters]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () => {
    setFilters({ from_date: "", to_date: "", search: "", category: "ALL" });
    setFilteredData(allData);
    setCurrentPage(1);
  };

  // ── action handlers ───────────────────────────
  const handleView = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };
  const handleEdit = (record) =>
    navigate("/GRNGeneration", { state: { record } });

  const handleShowHistory = async (item) => {
    const hsn = item?.hsn?.toString().trim();
    const item_id = item?.item_id?.toString().trim();
    if (!hsn || !item_id) {
      toast.error("HSN and item ID are required");
      return;
    }
    // fetchPreviousPurchases already handles setSelectedItemForHistory,
    // setShowHistoryModal and setHistoryData internally — just call it
    await fetchPreviousPurchases(item);
  };
  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setHistoryData([]);
    setSelectedItemForHistory(null);
  };

  // ── payment handlers ──────────────────────────
  const handleOpenPaymentModal = (record) => {
    setPaymentDetails({
      grn_number: record.grn_number,
      grn_id: record.grn_id,
      amount_paid: "",
      payment_method: "",
      payment_details: "",
      payment_date: new Date().toISOString().split("T")[0],
      pending_amount: parseFloat(
        record.pending_amount || record.total_amount || 0,
      ),
    });
    setSelectedRecord(record);
    setShowPaymentModal(true);
    setIsPaymentDirty(false);
  };

  const handlePaymentChange = (key, value) => {
    setPaymentDetails((prev) => ({ ...prev, [key]: value }));
    setIsPaymentDirty(true);
  };

  const handleClosePaymentModal = () => {
    if (
      isPaymentDirty &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to close?",
      )
    )
      return;
    setShowPaymentModal(false);
    setIsPaymentDirty(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentDetails.payment_method)
      return toast.error("Please select a payment method");
    if (!paymentDetails.payment_date)
      return toast.error("Please select a payment date");
    if (
      ["NEFT", "UPI", "Cheque", "Bank Transfer"].includes(
        paymentDetails.payment_method,
      ) &&
      !paymentDetails.payment_details
    )
      return toast.error(
        `Please provide payment details for ${paymentDetails.payment_method}`,
      );

    try {
      // amount_paid is the full pending amount — status is always "Paid"
      const payload = {
        amount_paid: paymentDetails.pending_amount,
        payment_method: paymentDetails.payment_method,
        payment_details:
          paymentDetails.payment_method === "Cash"
            ? null
            : paymentDetails.payment_details,
        payment_date: convertToDateFormat(paymentDetails.payment_date), // DD/MM/YYYY
        status: "Paid",
        pending_amount: 0,
      };

      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-in/update-payment-status/?grn_number=${encodeURIComponent(paymentDetails.grn_number)}&grn_id=${paymentDetails.grn_id}`,
        "PATCH",
        payload,
      );

      if (response.success && response.data.status === "success") {
        toast.success("Payment recorded successfully");
        setShowPaymentModal(false);
        setIsPaymentDirty(false);
        fetchAllData();
      } else {
        toast.error(
          response.error ||
            response.data?.message ||
            "Failed to update payment",
        );
      }
    } catch {
      toast.error("Network error while updating payment");
    }
  };

  // ── print / export ────────────────────────────
  const handleGRNPrint = (record) => {
    const printWindow = window.open("", "", "width=800,height=600");
    const printContent = `
      <html>
        <head>
          <title>GRN Details - ${record.grn_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; line-height: 1.4; }
            .invoice-title { text-align: center; margin-bottom: 20px; }
            .invoice-title h1 { font-size: 18px; font-weight: bold; color: #1e40af; margin: 0 0 5px 0; }
            .address { font-size: 11px; margin: 2px 0; }
            .document-title { font-size: 14px; font-weight: bold; margin: 15px 0; padding: 8px; background: #e0f2fe; border: 2px solid #0ea5e9; color: #1e40af; }
            .invoice-details-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; margin-bottom: 10px; border: 2px solid #0ea5e9; }
            .section { border-right: 1px solid #0ea5e9; }
            .section:last-child { border-right: none; }
            .header { background: #e0f2fe; padding: 5px 8px; font-weight: bold; border-bottom: 1px solid #0ea5e9; text-align: center; color: #1e40af; }
            .content { padding: 8px; }
            .row { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; margin: 3px 0; font-size: 11px; line-height: 1.4; white-space: nowrap; }
            .row span { display: inline-block; }
            .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 10px; border: 2px solid #0ea5e9; }
            .invoice-table th, .invoice-table td { border: 1px solid #0ea5e9; padding: 6px 4px; text-align: center; vertical-align: middle; }
            .invoice-table th { background: #e0f2fe; font-weight: bold; color: #1e40af; font-size: 9px; line-height: 1.2; }
            .invoice-table td { font-size: 10px; }
            .number-cell { text-align: right; padding-right: 8px; }
            .center-cell { text-align: center; }
            .product-cell { text-align: left; padding-left: 8px; }
            .total-row { background: #f0f9ff; font-weight: bold; }
            .total-row td { background: #f0f9ff; }
            .invoice-summary { margin-top: 20px; }
            .summary-layout { display: flex; gap: 10px; margin-bottom: 10px; }
            .gst-amounts { flex: 1; border: 2px solid #0ea5e9; background: #e0f2fe; padding: 12px; box-sizing: border-box; }
            .gst-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 11px; }
            .gst-row .label { font-weight: bold; color: #1e40af; }
            .gst-row .amount { font-weight: bold; color: #1e40af; }
            .amounts-table { min-width: 280px; border: 2px solid #0ea5e9; box-sizing: border-box; }
            .amounts-table .row { display: flex; justify-content: space-between; border-bottom: 1px solid #0ea5e9; font-size: 11px; margin: 0; line-height: 1; align-items: center; padding: 8px 12px; }
            .amounts-table .row:last-child { border-bottom: none; background: #e0f2fe; font-weight: bold; color: #1e40af; margin-bottom: 0; }
            .amounts-table .row span:first-child { font-weight: bold; flex: 1; line-height: 1; }
            .amounts-table .row span:last-child { font-weight: bold; text-align: right; flex-shrink: 0; min-width: 80px; line-height: 1; }
            .amount-words { margin: 15px 0; padding: 12px; background: #e0f2fe; border: 2px solid #0ea5e9; box-sizing: border-box; }
            .amount-words .label { font-weight: bold; color: #1e40af; margin-bottom: 5px; display: block; }
            .amount-words div { font-size: 11px; font-weight: bold; }
            .invoice-footer { display: flex; justify-content: space-between; margin-top: 30px; padding-top: 20px; }
            .footer-item { flex: 1; }
            .footer-item .label { font-weight: bold; font-size: 11px; border-bottom: 1px solid #000; padding-bottom: 2px; display: inline-block; min-width: 150px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-title">
            <h1>SHANMUGA HOSPITAL LIMITED</h1>
            <div class="address">51/24.Saradha College Road, Salem - 636007,,</div>
            <div class="address">Phone : 04272706666,info@smrft.org</div>
            <div class="address">GSTIN : 33ABDCS8326A1ZP</div>
            <div class="document-title">GOODS RECEIPT NOTE - ${record.grn_number}</div>
          </div>
          <div class="invoice-details-grid">
            <div class="section">
              <div class="header">Basic Information</div>
              <div class="content">
                <div class="row">
                  <span>Purchase Category : ${record.purchase_category || "N/A"}</span>
                </div>
                <div class="row">
                  <span>Vendor : ${record.vendor || "N/A"}</span>
                </div>
                <div class="row">
                  <span>Date : ${formatDate(record.date)}</span>
                </div>
                <div class="row">
                  <span>Contact Person : ${record.contact_person || "N/A"}</span>
                </div>
              </div>
            </div>
            <div class="section">
              <div class="header">Invoice Information</div>
              <div class="content">
                <div class="row">
                  <span>Invoice No : ${record.invoice_no || "N/A"}</span>
                </div>
                <div class="row">
                  <span>Invoice Date : ${formatDate(record.invoice_date)}</span>
                </div>
                <div class="row">
                  <span>Payment Method : ${record.payment_details?.payment_method || record.payment_method || "N/A"}</span>
                </div>
                <div class="row">
                  <span>Payment Status : ${record.payment_details?.status || record.payment_status || "N/A"}</span>
                </div>
              </div>
            </div>
            <div class="section">
              <div class="header">Order Details</div>
              <div class="content">
                <div class="row">
                  <span>GRN Number : ${record.grn_number || "N/A"}</span>
                </div>
                <div class="row">
                  <span>Phone : ${record.phone || "N/A"}</span>
                </div>
                <div class="row">
                  <span>Total Amount : ₹${parseFloat(record.total_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="row">
                  <span>Approved Date : ${formatDate(record.date)}</span>
                </div>
              </div>
            </div>
          </div>
          ${
            record.items && record.items.length > 0
              ? `
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Sl.</th>
                <th>Product</th>
                <th>HSN</th>
                <th>Batch</th>
                <th>Pack</th>
                <th>QTY</th>
                <th>P Rate</th>
                <th>P.cost</th>
                <th>MRP</th>
                <th>Discount</th>
                <th>Taxable<br/>Amount</th>
                <th>Total<br/>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${record.items
                .map(
                  (item, index) => `
                <tr>
                  <td class="center-cell">${index + 1}.</td>
                  <td class="product-cell">${item.itemName || "N/A"}</td>
                  <td class="number-cell">${item.hsn || "N/A"}</td>
                  <td class="center-cell">${item.batch || "N/A"}</td>
                  <td class="center-cell">${item.packing || "1"}</td>
                  <td class="center-cell">${item.quantity || "N/A"}</td>
                  <td class="number-cell">₹${parseFloat(item.unitPrice || 0).toFixed(2)}</td>
                  <td class="number-cell">₹${parseFloat(item.purchaseCost || 0).toFixed(2)}</td>
                  <td class="number-cell">₹${parseFloat(item.mrp || 0).toFixed(2)}</td>
                  <td class="number-cell">₹${parseFloat(item.discountedAmt || 0).toFixed(2)}</td>
                  <td class="number-cell">₹${parseFloat(item.itemValue || item.purchaseCost || 0).toFixed(2)}</td>
                  <td class="number-cell">₹${parseFloat(item.purchaseCost || 0).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
              <tr class="total-row">
                <td colspan="10" class="center-cell">Total</td>
                <td class="number-cell">₹${parseFloat(record.total_amount || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          `
              : ""
          }
          <div class="invoice-summary">
            <div class="summary-layout">
              <div class="gst-amounts">
                <div class="gst-row">
                  <span class="label">CGST Amount</span>
                  <span class="amount">: ₹${parseFloat(record.cgst || 0).toFixed(2)}</span>
                </div>
                <div class="gst-row">
                  <span class="label">SGST Amount</span>
                  <span class="amount">: ₹${parseFloat(record.sgst || 0).toFixed(2)}</span>
                </div>
                <div class="gst-row">
                  <span class="label">IGST Amount</span>
                  <span class="amount">: ₹${parseFloat(record.igst || 0).toFixed(2)}</span>
                </div>
              </div>
              <div class="amounts-table">
                <div class="row">
                  <span>Total</span>
                  <span>₹${parseFloat(record.total_amount || 0).toFixed(2)}</span>
                </div>
                <div class="row">
                  <span>Discount</span>
                  <span>₹${parseFloat(record.total_discount || 0).toFixed(2)}</span>
                </div>
                <div class="row">
                  <span>Tax On Free</span>
                  <span>₹${parseFloat(record.tax_on_free_items || 0).toFixed(2)}</span>
                </div>
                <div class="row">
                  <span>Round off</span>
                  <span>₹${parseFloat(record.round_amount || 0).toFixed(2)}</span>
                </div>
                <div class="row">
                  <span>Total GST</span>
                  <span>₹${(parseFloat(record.cgst || 0) + parseFloat(record.sgst || 0) + parseFloat(record.igst || 0)).toFixed(2)}</span>
                </div>
                <div class="row">
                  <span>Net Amount</span>
                  <span>₹${parseFloat(record.net_invoice_amount || record.total_amount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div class="amount-words">
              <span class="label">Amount In Words</span>
              <div>Rupees ${record.total_amount ? "As Per Amount" : "Zero"} Only</div>
            </div>
          </div>
          <div class="invoice-footer">
            <div class="footer-item">
              <div class="label">Entered By : ${record.created_by || "N/A"}</div>
            </div>           
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToExcel = () => {
    const headers = [
      "Date",
      "GRN Number",
      "Vendor",
      "Invoice No",
      "Total Amount",
      "Payment Status",
      "Advance",
      "Amount Paid",
      "Pending Amount",
    ];
    const rows = filteredData.map((row) => {
      let advance = "N/A";
      if (Array.isArray(row.payment_status) && row.payment_status.length > 0) {
        const last = row.payment_status[row.payment_status.length - 1];
        advance = `Date: ${last.payment_date || "N/A"} | Paid: ${parseFloat(last.amount_paid || 0).toFixed(2)} | Method: ${last.payment_method || "N/A"}`;
      }
      return [
        formatDate(row.date),
        row.grn_number,
        row.vendor,
        row.invoice_no,
        parseFloat(row.total_amount || 0).toFixed(2),
        row.payment_details?.status || "N/A",
        advance,
        parseFloat(row.total_amount_paid || 0).toFixed(2),
        parseFloat(row.pending_amount || 0).toFixed(2),
      ].join(",");
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" }),
    );
    a.download = `GRN_Report_${filters.category === "ALL" ? "All" : filters.category.replace(/ /g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const sorted = [...filteredData].sort((a, b) =>
      (a.vendor || "").localeCompare(b.vendor || ""),
    );
    const groups = {};
    let grandTotal = 0;
    sorted.forEach((row) => {
      const v = row.vendor || "N/A";
      if (!groups[v]) groups[v] = { rows: [], total: 0 };
      groups[v].rows.push(row);
      groups[v].total += parseFloat(row.pending_amount || 0);
      grandTotal += parseFloat(row.pending_amount || 0);
    });

    let tableRows = "";
    Object.keys(groups).forEach((vendor) => {
      const g = groups[vendor];
      g.rows.sort((a, b) =>
        (a.grn_number || "").localeCompare(b.grn_number || ""),
      );
      tableRows += `<tr style="background:#f0f0f0"><td colspan="9" style="font-weight:bold;padding:8px">${vendor}</td><td rowspan="${g.rows.length + 1}" style="font-weight:bold;text-align:right;background:#fff3cd">${formatCurrency(g.total)}</td></tr>`;
      g.rows.forEach((row, i) => {
        const [p1] = formatPaymentHistory(row.payment_status);
        tableRows += `<tr>
          <td style="text-align:center">${i + 1}</td><td>${row.grn_number || "N/A"}</td>
          <td>${row.invoice_no || "N/A"}</td><td>${formatDate(row.invoice_date)}</td>
          <td style="text-align:right">${formatCurrency(row.total_amount)}</td>
          <td>${row.payment_details?.status || "N/A"}</td><td>${p1}</td>
          <td style="text-align:right">${formatCurrency(row.total_amount_paid)}</td>
          <td style="text-align:right">${formatCurrency(row.pending_amount)}</td>
        </tr>`;
      });
    });

    const from = filters.from_date ? formatDate(filters.from_date) : "N/A";
    const to = filters.to_date ? formatDate(filters.to_date) : "N/A";
    const range = from === to ? from : `${from} to ${to}`;

    printWindow.document.write(`<html><head><title>${getCategoryTitle()}</title>
      <style>
        @page{size:landscape;margin:10mm}
        body{font-family:Arial,sans-serif;margin:0;padding:5px;font-size:18px}
        h1{text-align:center;font-size:21px;margin:10px 0}
        table{border-collapse:collapse;width:100%;font-size:18px;border:1px solid #333}
        th,td{border:1px dashed #999;padding:5px 5px}
        tr td:first-child,tr th:first-child{border-left:none}
        tr td:last-child, tr th:last-child {border-right:none}
        thead tr:first-child th{border-top:none}
        th{background:#e0e0e0;font-weight:bold;text-align:center}
        @media print{body{margin:0;padding:5px}tr{page-break-inside:avoid}}
      </style></head><body>
      <h1>${getCategoryTitle()} (${range})</h1>
      <table><thead><tr>
        <th>Sl. No</th><th>GRN Number</th><th>Invoice No</th><th>Inv. Date</th>
        <th>Bill Amount</th><th>Payment Status</th><th>Advance (₹)</th>
        <th>Amount Paid</th><th>Pending Amount</th><th>Grand Total</th>
      </tr></thead><tbody>
        ${tableRows}
        <tr style="background:#d4edda;font-weight:bold">
          <td colspan="9" style="text-align:right;font-size:18px">Gross Total:</td>
          <td style="text-align:right;font-size:18px">${formatCurrency(grandTotal)}</td>
        </tr>
      </tbody></table></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  // ── effects ───────────────────────────────────
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // ── pagination ────────────────────────────────
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const currentData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <Container>
      <Header>
        <Title>{getCategoryTitle()}</Title>
      </Header>

      {/* ── Filters ── */}
      <FiltersSection>
        <FiltersGrid>
          <FilterGroup>
            <Label>From Date</Label>
            <InputWrapper>
              <IconWrapper></IconWrapper>
              <Input
                type="date"
                value={filters.from_date}
                onChange={(e) =>
                  handleFilterChange("from_date", e.target.value)
                }
              />
            </InputWrapper>
          </FilterGroup>

          <FilterGroup>
            <Label>To Date</Label>
            <InputWrapper>
              <IconWrapper></IconWrapper>
              <Input
                type="date"
                value={filters.to_date}
                onChange={(e) => handleFilterChange("to_date", e.target.value)}
              />
            </InputWrapper>
          </FilterGroup>

          <FilterGroup>
            <Label>Purchase Category</Label>
            <InputWrapper>
              <PaymentSelect
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="TRAVELLERS IN CASH">TRAVELLERS IN CASH</option>
                <option value="TRAVELLERS IN CREDIT">
                  TRAVELLERS IN CREDIT
                </option>
              </PaymentSelect>
            </InputWrapper>
          </FilterGroup>

          <FilterGroup>
            <Label>Search</Label>
            <InputWrapper>
              <IconWrapper></IconWrapper>
              <Input
                type="text"
                placeholder="GRN No, Invoice No, Vendor..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </InputWrapper>
          </FilterGroup>

          <ButtonGroup>
            <ButtonContainer>
              <CustomButton variant="secondary" onClick={clearFilters}>
                Clear
              </CustomButton>
            </ButtonContainer>
          </ButtonGroup>
        </FiltersGrid>
      </FiltersSection>

      {/* ── Actions bar ── */}
      <ActionsSection>
        <RecordsInfo>
          <RecordsText>
            {filteredData.length === 0
              ? "No records found"
              : `Showing ${currentData.length} of ${filteredData.length} records`}
          </RecordsText>
        </RecordsInfo>
        <ButtonContainer>
          <GreenButton onClick={handlePrint}>
            <Printer size={16} /> Print
          </GreenButton>
          <CustomButton variant="primary" onClick={exportToExcel}>
            <Download size={16} /> Export Excel
          </CustomButton>
        </ButtonContainer>
      </ActionsSection>

      {/* ── Table ── */}
      <TableContainer>
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading...</LoadingText>
          </LoadingContainer>
        ) : (
          <TableWrapper>
            <Table id="report-table">
              <thead>
                <TableRow>
                  {[
                    "Date",
                    "GRN Number",
                    "Purchase Category",
                    "Vendor",
                    "Invoice Date",
                    "Invoice No",
                    "Total Amount",
                    "Payment Status",
                    "Advance",
                    "Amount Paid",
                    "Pending Amount",
                  ].map((col) => (
                    <Th key={col} style={{ whiteSpace: "nowrap" }}>
                      {col}
                    </Th>
                  ))}
                  <Th className="no-print" style={{ whiteSpace: "nowrap" }}>
                    Actions
                  </Th>
                </TableRow>
              </thead>
              <TableBody>
                {currentData.length === 0 ? (
                  <TableRow>
                    <Td colSpan="12">No records found</Td>
                  </TableRow>
                ) : (
                  currentData.map((row, index) => {
                    const [payment1] = formatPaymentHistory(row.payment_status);
                    return (
                      <TableRow key={row.grn_number || index}>
                        <Td style={{ whiteSpace: "nowrap" }}>
                          {formatDate(row.date)}
                        </Td>
                        <Td>{row.grn_number || "N/A"}</Td>
                        <Td>{row.purchase_category || "N/A"}</Td>
                        <Td>{row.vendor || "N/A"}</Td>
                        <Td>{formatDate(row.invoice_date)}</Td>
                        <Td>{row.invoice_no || "N/A"}</Td>
                        <Td>{formatCurrency(row.net_invoice_amount)}</Td>
                        <Td style={{ whiteSpace: "nowrap" }}>
                          <CustomBadge
                            status={row.payment_details?.status || "N/A"}
                          >
                            {row.payment_details?.status || "N/A"}
                          </CustomBadge>
                        </Td>
                        <Td dangerouslySetInnerHTML={{ __html: payment1 }} />
                        <Td>{formatCurrency(row.total_amount_paid)}</Td>
                        <Td>{formatCurrency(row.pending_amount)}</Td>
                        <Td
                          className="no-print"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          <TableActionButton onClick={() => handleView(row)}>
                            <Eye size={16} />
                          </TableActionButton>
                          <TableActionButton
                            onClick={() =>
                              row.overall_status !== "Paid" && handleEdit(row)
                            }
                            disabled={row.overall_status === "Paid"}
                            title={
                              row.overall_status === "Paid"
                                ? "Cannot edit a paid record"
                                : "Edit"
                            }
                            style={{
                              opacity: row.overall_status === "Paid" ? 0.4 : 1,
                              cursor:
                                row.overall_status === "Paid"
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            <Edit3 size={16} />
                          </TableActionButton>
                          <TableActionButton
                            onClick={() =>
                              row.overall_status !== "Paid" &&
                              handleOpenPaymentModal(row)
                            }
                            disabled={row.overall_status === "Paid"}
                            title={
                              row.overall_status === "Paid"
                                ? "Already Paid"
                                : "Record Payment"
                            }
                            style={{
                              opacity: row.overall_status === "Paid" ? 0.4 : 1,
                              cursor:
                                row.overall_status === "Paid"
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            <CreditCard size={16} />
                          </TableActionButton>
                          <TableActionButton
                            onClick={() => handleGRNPrint(row)}
                          >
                            <Printer size={16} />
                          </TableActionButton>
                        </Td>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableWrapper>
        )}
      </TableContainer>

      {/* ── Pagination ── */}
      <PaginationSection>
        <PaginationLeft>
          <PaginationText>Rows per page:</PaginationText>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              padding: "4px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
            }}
          >
            {[10, 20, 50, 100].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </PaginationLeft>
        <PaginationRight>
          <PaginationControls>
            <PaginationButton
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </PaginationButton>
            <PaginationText>
              {currentPage} of {totalPages}
            </PaginationText>
            <PaginationButton
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </PaginationButton>
          </PaginationControls>
        </PaginationRight>
      </PaginationSection>

      {/* ── Modals — portalled above sidebar ── */}
      <EnhancedViewModal
        showModal={showModal}
        selectedRecord={selectedRecord}
        onClose={() => setShowModal(false)}
        onShowHistory={handleShowHistory}
      />

      <HistoryModal
        show={showHistoryModal}
        onClose={closeHistoryModal}
        item={selectedItemForHistory}
        historyData={historyData}
        loading={historyLoading}
      />

      <PaymentModal
        show={showPaymentModal}
        paymentDetails={paymentDetails}
        isPaymentDirty={isPaymentDirty}
        onClose={handleClosePaymentModal}
        onChange={handlePaymentChange}
        onSubmit={handlePaymentSubmit}
      />
    </Container>
  );
};

export default GRNReport;
