"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, History, ShoppingBag, FileText, Package } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import apiRequest from "../apiRequest";
import styled from "styled-components";
import { AddItemMiniModal } from "../InventoryMaster/AddItems";
import { AddVendorMiniModal } from "../InventoryMaster/AddVendor";

import {
  colors,
  mq,
  PageWrapper,
  Container,
  Input,
  Select,
  TextArea,
  InputWrapper,
  Label as Lbl,
  Button,
  ButtonContainer,
  TableWrapper,
  ModalOverlay,
  ModalHeader as ModalHead,
  ModalTitle,
  ModalBody as ModalScroll,
  ModalFooter as ModalFoot,
  CloseButton as CloseBtn,
} from "../StyledComponents";

// ─────────────────────────────────────────────────────────────────────────────
// Page-specific styled components
// ─────────────────────────────────────────────────────────────────────────────

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
  flex-wrap: wrap;
  gap: 8px;
  ${mq.sm} {
    padding: 10px 14px;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  ${mq.sm} {
    font-size: 0.95rem;
  }
`;

const PageSubtitle = styled.p`
  margin: 2px 0 0;
  font-size: 0.75rem;
  opacity: 0.8;
`;

const Card = styled.div`
  background: white;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  margin-bottom: 14px;
  overflow: visible;
  box-shadow: 0 1px 3px rgba(102, 37, 73, 0.06);
`;

const CardHeader = styled.div`
  background: ${colors.tabBg};
  padding: 9px 16px;
  border-bottom: 1px solid ${colors.border};
  font-weight: 600;
  font-size: 0.82rem;
  color: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 8px 8px 0 0;
`;

const CardBody = styled.div`
  padding: 14px 16px;
  ${mq.sm} {
    padding: 10px 12px;
  }
`;

const FormContent = styled.div`
  padding: 16px;
  ${mq.sm} {
    padding: 10px;
  }
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: ${(p) => p.cols || "repeat(4, 1fr)"};
  gap: 10px;
  align-items: flex-end;
  margin-bottom: ${(p) => p.mb || "10px"};
  @media (max-width: 960px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const RequiredMark = styled.span`
  color: ${colors.danger};
  margin-left: 2px;
`;

const ReadOnlyInput = styled(Input)`
  background: #f1f5f9 !important;
  cursor: default;
  color: ${colors.textMuted};
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
  font-size: 0.75rem;
  thead tr {
    background: ${colors.primary};
  }
  th {
    background: ${colors.primary};
    color: white;
    font-weight: 600;
    text-align: left;
    padding: 8px 10px;
    font-size: 0.68rem;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  td {
    padding: 7px 10px;
    font-size: 0.75rem;
    border-bottom: 1px solid ${colors.border};
    text-align: left;
    white-space: nowrap;
    background: white;
  }
  tbody tr:nth-child(even) td {
    background: #fcefee;
  }
  tbody tr:hover td {
    background: #f9e5e8;
  }
`;

const EmptyCell = styled.td`
  text-align: center;
  padding: 32px;
  color: ${colors.textMuted};
  font-size: 0.85rem;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;
  &.edit {
    color: ${colors.primary};
    &:hover {
      background: #f9e5e8;
    }
  }
  &.del {
    color: ${colors.danger};
    &:hover {
      background: #fef2f2;
    }
  }
`;

const SumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 12px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

const SumField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const RupeeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RupeeSymbol = styled.span`
  padding: 5px 8px;
  background: ${colors.tabBg};
  border: 1px solid ${colors.border};
  border-radius: 5px 0 0 5px;
  font-size: 0.82rem;
  color: ${colors.textMuted};
  white-space: nowrap;
  flex-shrink: 0;
`;

const RupeeInput = styled(Input)`
  border-radius: 0 5px 5px 0 !important;
  border-left: none !important;
  font-size: 0.82rem;
`;

const NetAmountBox = styled.div`
  background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark});
  color: white;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NetLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
`;

const NetValue = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
`;

const RoundWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RoundSignSel = styled.button`
  width: 36px;
  height: 100%;
  min-height: 29px;
  padding: 0;
  border: 1px solid ${colors.border};
  border-right: none;
  border-radius: 5px 0 0 5px;
  background: ${colors.tabBg};
  color: ${colors.primary};
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
  user-select: none;
  &:hover {
    background: ${colors.border};
  }
`;

const RoundInput = styled(Input)`
  border-radius: 0 5px 5px 0 !important;
  border-left: none !important;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 10px;
  width: 92%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(102, 37, 73, 0.2);
  ${mq.sm} {
    width: 100%;
    max-height: 95vh;
    border-radius: 12px 12px 0 0;
  }
`;

const SectionDivider = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${colors.primary};
  padding: 6px 0 4px;
  border-bottom: 1px solid ${colors.tabBg};
  margin-bottom: 8px;
  margin-top: 4px;
`;

const AutoWrap = styled.div`
  position: relative;
`;

const DropList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 999;
  background: white;
  border: 1px solid ${colors.border};
  border-radius: 0 0 6px 6px;
  max-height: 160px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 12px rgba(102, 37, 73, 0.1);
`;

const DropItem = styled.li`
  padding: 7px 10px;
  font-size: 0.82rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  &:hover {
    background: ${colors.tabBg};
    color: ${colors.primary};
  }
  &:last-child {
    border-bottom: none;
  }
`;

const HistOverlay = styled(ModalOverlay)`
  z-index: 1100;
`;

const HistBox = styled.div`
  background: white;
  border-radius: 10px;
  width: 95%;
  max-width: 1100px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(102, 37, 73, 0.25);
  ${mq.sm} {
    width: 100%;
    border-radius: 12px 12px 0 0;
    max-height: 92vh;
  }
`;

const HistHead = styled.div`
  background: ${colors.primary};
  color: white;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

const HistTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
`;

const HistSubtitle = styled.div`
  font-size: 0.72rem;
  opacity: 0.8;
  margin-top: 2px;
`;

const HistScroll = styled.div`
  overflow: auto;
  flex: 1;
  padding: 12px;
  -webkit-overflow-scrolling: touch;
`;

const HistTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  min-width: 700px;
  th {
    background: ${colors.tabBg};
    padding: 7px 10px;
    text-align: left;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: ${colors.textMain};
    white-space: nowrap;
  }
  td {
    padding: 7px 10px;
    border-bottom: 1px solid ${colors.border};
  }
  tbody tr:hover {
    background: #f9e5e8;
  }
`;

const InvOverlay = styled(ModalOverlay)`
  z-index: 1050;
`;

const InvBox = styled.div`
  background: white;
  border-radius: 10px;
  width: 96%;
  max-width: 1000px;
  max-height: 92vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(102, 37, 73, 0.25);
  ${mq.sm} {
    width: 100%;
    border-radius: 12px 12px 0 0;
    max-height: 96vh;
  }
`;

const InvBody = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 20px 24px;
  -webkit-overflow-scrolling: touch;
  ${mq.sm} {
    padding: 12px;
  }
`;

const thStyle = (bg) => ({
  background: bg,
  color: "white",
  padding: "7px 8px",
  fontWeight: 700,
  fontSize: "0.65rem",
  textAlign: "center",
  whiteSpace: "nowrap",
  letterSpacing: 0.3,
  textTransform: "uppercase",
});

const tdBase = {
  padding: "6px 8px",
  fontSize: "0.72rem",
  borderBottom: "1px solid #e2e8f0",
};
const tdCenter = { ...tdBase, textAlign: "center" };
const tdRight = { ...tdBase, textAlign: "right" };

const GrnSavedBox = styled.div`
  background: white;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 20px 60px rgba(102, 37, 73, 0.25);
  overflow: hidden;
  ${mq.sm} {
    width: 95%;
  }
`;

const GrnSavedHead = styled.div`
  background: ${colors.primary};
  color: white;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusBadge = styled.span`
  background: ${(p) => (p.active ? "#dcfce7" : "#fef9c3")};
  color: ${(p) => (p.active ? "#166534" : "#854d0e")};
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const TravellersIN = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const record = location.state?.record || null;
  const grn_number = record?.grn_number || null;

  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  const userId = localStorage.getItem("employeeId");

  const EMPTY_FORM = {
    purchaseCategory: "",
    vendor: "",
    vendor_id: "",
    grn_id: "",
    date: new Date().toISOString().split("T")[0],
    supplierAddress: "",
    contactPerson: "",
    phone: "",
    invoiceNo: "",
    invoiceDate: "",
    creditPeriod: "",
    dueDate: "",
    paymentMode: "CHEQUE",
  };

  const EMPTY_MODAL = {
    name: "",
    hsn: "",
    batch: "",
    expiry: "",
    packing: "",
    noOfUnit: "",
    quantity: "",
    free: "",
    totalstock: "",
    itemValue: "",
    packingPrice: "",
    unitPrice: "",
    tax: "",
    cgstPercent: "",
    cgstAmt: "",
    sgstPercent: "",
    sgstAmt: "",
    purchaseDiscountPercent: "",
    discountedAmt: "",
    purchaseCost: "",
    unitCostWithGst: "",
    mrp: "",
  };

  const EMPTY_SUMMARY = {
    nonTaxableAmount: 0,
    taxableAmount: 0,
    taxPaidToSupplier: 0,
    localTax: 0,
    remarks: "",
    cgst: 0,
    sgst: 0,
    igst: 0,
    cess: 0,
    centralSalesTax: 0,
    roundAmount: 0,
    totalAmount: 0,
    taxOnFreeItems: 0,
    totalDiscount: 0,
    netInvoiceAmount: 0,
    quotationRate: 0,
    courierTransportCharge: 0,
  };

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [vendors, setVendors] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState(EMPTY_MODAL);
  const [editingItem, setEditingItem] = useState(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showGrnDialog, setShowGrnDialog] = useState(false);
  const [grnData, setGrnData] = useState({ grn_number: "", invoice_no: "" });
  const [loading, setLoading] = useState(false);
  const [roundSign, setRoundSign] = useState("+");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [roundRaw, setRoundRaw] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // ── Helper: resolve item name from availableItems ──────────────────────────
  const getItemName = (item) => {
    const matched = availableItems.find(
      (i) =>
        String(i.item_id) === String(item.item_id) ||
        String(i.hsn) === String(item.hsn),
    );
    return matched?.itemName || "—";
  };

  // ── Fetch on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchVendors();
    fetchItems();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const r = await apiRequest(`${StoreTrustbaseurl}vendors/list/`, "GET");
      if (r.success) setVendors(r.data || []);
      else {
        toast.error("Failed to load vendors");
        setVendors([]);
      }
    } catch {
      toast.error("Error loading vendors");
      setVendors([]);
    } finally {
      setLoadingVendors(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const r = await apiRequest(`${StoreTrustbaseurl}items/list/`, "GET");
      if (r.success) setAvailableItems(r.data || []);
      else {
        toast.error("Failed to load items");
        setAvailableItems([]);
      }
    } catch {
      toast.error("Error loading items");
      setAvailableItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  // ── Load record for editing ────────────────────────────────────────────────
  useEffect(() => {
    if (record) {
      setFormData({
        purchaseCategory: record.purchase_category || "",
        vendor: record.vendor || "",
        vendor_id: record.vendor_id || "",
        grn_id: record.grn_id || "",
        date: record.date || new Date().toISOString().split("T")[0],
        supplierAddress: record.address || "",
        contactPerson: record.contact_person || "",
        phone: record.phone || "",
        invoiceNo: record.invoice_no || "",
        invoiceDate: record.invoice_date || "",
        creditPeriod: record.credit_period || "",
        dueDate: record.due_date || "",
        paymentMode: record.payment_mode || "CHEQUE",
      });

      // ✅ Move here — safe because we're inside `if (record)`
      const rawVal = Math.abs(parseFloat(record.round_amount || 0));
      setRoundRaw(rawVal > 0 ? String(rawVal) : "");
      setRoundSign(parseFloat(record.round_amount || 0) < 0 ? "-" : "+");

      const parsedItems = (() => {
        if (!record.items) return [];
        if (Array.isArray(record.items)) return record.items;
        try {
          return JSON.parse(record.items);
        } catch {
          return [];
        }
      })();
      setItems(
        parsedItems.map((item, idx) => ({ ...item, _rowId: Date.now() + idx })),
      );
      setSummary({
        nonTaxableAmount: parseFloat(record.non_taxable_amount || 0),
        taxableAmount: parseFloat(record.taxable_amount || 0),
        taxPaidToSupplier: parseFloat(record.tax_paid_to_supplier || 0),
        localTax: parseFloat(record.local_tax || 0),
        remarks: record.remarks || "",
        cgst: parseFloat(record.cgst || 0),
        sgst: parseFloat(record.sgst || 0),
        igst: parseFloat(record.igst || 0),
        cess: parseFloat(record.cess || 0),
        centralSalesTax: parseFloat(record.central_sales_tax || 0),
        roundAmount: parseFloat(record.round_amount || 0),
        totalAmount: parseFloat(record.total_amount || 0),
        taxOnFreeItems: parseFloat(record.tax_on_free_items || 0),
        totalDiscount: parseFloat(record.total_discount || 0),
        netInvoiceAmount: parseFloat(record.net_invoice_amount || 0),
        quotationRate: parseFloat(record.quotation_rate || 0),
        courierTransportCharge: parseFloat(
          record.courier_transport_charge || 0,
        ),
      });
    }
  }, [record]);

  // ── Summary auto-calc ──────────────────────────────────────────────────────
  useEffect(() => {
    const round = (v) => Math.round((parseFloat(v) || 0) * 100) / 100;
    const totalItemValue = round(
      items.reduce((s, i) => s + (parseFloat(i.itemValue) || 0), 0),
    );
    const totalPurchaseCost = round(
      items.reduce((s, i) => s + (parseFloat(i.purchaseCost) || 0), 0),
    );
    const totalCGST = round(
      items.reduce((s, i) => s + (parseFloat(i.cgstAmt) || 0), 0),
    );
    const totalSGST = round(
      items.reduce((s, i) => s + (parseFloat(i.sgstAmt) || 0), 0),
    );
    const totalDiscount = round(
      items.reduce((s, i) => s + (parseFloat(i.discountedAmt) || 0), 0),
    );
    const taxPaidToSupplier = round(totalCGST + totalSGST);
    const base = round(
      totalPurchaseCost +
        (summary.taxOnFreeItems || 0) +
        (summary.courierTransportCharge || 0) +
        (summary.localTax || 0) -
        totalDiscount,
    );
    const netInvoiceAmount = round(base + (summary.roundAmount || 0));
    setSummary((prev) => ({
      ...prev,
      nonTaxableAmount: totalItemValue,
      taxableAmount: totalPurchaseCost,
      cgst: totalCGST,
      sgst: totalSGST,
      totalAmount: totalPurchaseCost,
      totalDiscount,
      taxPaidToSupplier,
      netInvoiceAmount,
    }));
  }, [
    items,
    summary.taxOnFreeItems,
    summary.courierTransportCharge,
    summary.localTax,
    summary.roundAmount,
  ]); // eslint-disable-line

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "invoiceDate") {
      // 1. Update the Invoice Date
      const newInvoiceDate = value;

      // 2. Calculate Due Date (Invoice Date + 45 Days)
      let newDueDate = "";
      if (newInvoiceDate) {
        const dateObj = new Date(newInvoiceDate);
        dateObj.setDate(dateObj.getDate() + 45);
        newDueDate = dateObj.toISOString().split("T")[0];
      }

      setFormData((p) => ({
        ...p,
        invoiceDate: newInvoiceDate,
        dueDate: newDueDate,
      }));
    } else {
      // Standard change for other fields
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSummaryChange = (e) => {
    const { name, value } = e.target;
    setSummary((p) => ({ ...p, [name]: parseFloat(value) || 0 }));
  };

  // ── Modal ──────────────────────────────────────────────────────────────────
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item._rowId); // ← use _rowId
      const matchedName =
        availableItems.find((i) => String(i.item_id) === String(item.item_id))
          ?.itemName || "";
      setModalForm({ ...EMPTY_MODAL, ...item, name: matchedName });
    } else {
      setEditingItem(null);
      setModalForm(EMPTY_MODAL);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleTaxChange = (e) => {
    const taxValue = parseFloat(e.target.value) || 0;
    const cgst = taxValue / 2;
    setModalForm((prev) => {
      const u = {
        ...prev,
        tax: String(taxValue),
        cgstPercent: String(cgst),
        sgstPercent: String(cgst),
      };
      const itemValue = parseFloat(u.itemValue) || 0;
      if (itemValue > 0) {
        u.cgstAmt = ((itemValue * cgst) / 100).toFixed(2);
        u.sgstAmt = ((itemValue * cgst) / 100).toFixed(2);
        let purchaseCost =
          itemValue + parseFloat(u.cgstAmt) + parseFloat(u.sgstAmt);
        const discP = parseFloat(u.purchaseDiscountPercent) || 0;
        if (discP > 0) {
          const da = (purchaseCost * discP) / 100;
          u.discountedAmt = da.toFixed(2);
          purchaseCost -= da;
        }
        u.purchaseCost = purchaseCost.toFixed(2);
        const qty = parseFloat(u.quantity) || 0;
        u.unitCostWithGst = qty > 0 ? (purchaseCost / qty).toFixed(2) : "0.00";
      }
      return u;
    });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const sel = availableItems
        .filter((i) => i.hsn && String(i.hsn).trim())
        .find((i) => i.itemName === value);
      setModalForm((prev) => ({
        ...prev,
        name: value,
        hsn: sel ? sel.hsn : "",
      }));
      return;
    }
    if (name === "tax") {
      handleTaxChange(e);
      return;
    }

    setModalForm((prev) => {
      const u = { ...prev, [name]: value };
      const packing = parseFloat(u.packing) || 0;
      const noOfUnit = parseFloat(u.noOfUnit) || 0;
      const packingPrice = parseFloat(u.packingPrice) || 0;
      const cgstPercent = parseFloat(u.cgstPercent) || 0;
      const sgstPercent = parseFloat(u.sgstPercent) || 0;

      if (name === "packing" || name === "noOfUnit")
        u.quantity = (packing * noOfUnit).toString();
      const qty = parseFloat(u.quantity) || 0;
      const free = parseFloat(u.free) || 0;
      u.totalstock = (qty + free).toString();

      if (name === "packingPrice" || name === "noOfUnit") {
        u.itemValue = (packingPrice * noOfUnit).toFixed(2);
        if (qty > 0) u.unitPrice = (parseFloat(u.itemValue) / qty).toFixed(2);
      }
      if (name === "itemValue") {
        if (noOfUnit > 0)
          u.packingPrice = (parseFloat(value) / noOfUnit).toFixed(2);
        if (qty > 0) u.unitPrice = (parseFloat(value) / qty).toFixed(2);
      }

      const currentItemValue = parseFloat(u.itemValue) || 0;
      u.cgstAmt = ((currentItemValue * cgstPercent) / 100).toFixed(2);
      u.sgstAmt = ((currentItemValue * sgstPercent) / 100).toFixed(2);
      let purchaseCost =
        currentItemValue + parseFloat(u.cgstAmt) + parseFloat(u.sgstAmt);

      if (name === "purchaseDiscountPercent") {
        const discP = parseFloat(value) || 0;
        const da = discP > 0 ? (purchaseCost * discP) / 100 : 0;
        u.discountedAmt = da.toFixed(2);
        purchaseCost -= da;
      } else if (name === "discountedAmt") {
        const da = parseFloat(value) || 0;
        if (da > 0 && purchaseCost > 0) {
          u.purchaseDiscountPercent = ((da / purchaseCost) * 100).toFixed(2);
          purchaseCost -= da;
        }
      } else {
        const ep = parseFloat(u.purchaseDiscountPercent) || 0;
        const ed = parseFloat(u.discountedAmt) || 0;
        if (ep > 0) {
          const da = (purchaseCost * ep) / 100;
          u.discountedAmt = da.toFixed(2);
          purchaseCost -= da;
        } else if (ed > 0) {
          u.purchaseDiscountPercent = ((ed / purchaseCost) * 100).toFixed(2);
          purchaseCost -= ed;
        }
      }

      u.purchaseCost = purchaseCost.toFixed(2);
      const currentQty = parseFloat(u.quantity) || 0;
      u.unitCostWithGst =
        currentQty > 0 ? (purchaseCost / currentQty).toFixed(2) : "0.00";
      return u;
    });
  };

  const buildItem = (form, existingItemId, existingHsn) => {
    const { id, name, itemName, ...rest } = form;

    // Only look up from master if this is a NEW item (no existingItemId)
    if (!existingItemId) {
      const matched = availableItems.find(
        (i) => i.itemName === (name || itemName),
      );
      return {
        ...rest,
        item_id: matched?.item_id
          ? String(matched.item_id)
          : String(Date.now()),
        hsn: matched?.hsn || form.hsn || "",
      };
    }

    // Normalize empty numeric fields to "0" so backend diff detects real changes
    const normalize = (val) =>
      val === "" || val === null || val === undefined ? "0" : val;

    return {
      ...rest,
      purchaseDiscountPercent: normalize(rest.purchaseDiscountPercent),
      discountedAmt: normalize(rest.discountedAmt),
      item_id: existingItemId,
      hsn: existingHsn || form.hsn || "",
    };
  };

  const handleAddItem = () => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i._rowId === editingItem
            ? { ...buildItem(modalForm, i.item_id, i.hsn), _rowId: i._rowId }
            : i,
        ),
      );
    } else {
      setItems((prev) => [
        ...prev,
        { ...buildItem(modalForm, null, null), _rowId: Date.now() },
      ]);
    }
    closeModal();
  };
  const handleDeleteItem = (_rowId) =>
    setItems((prev) => prev.filter((i) => i._rowId !== _rowId));

  // ── History ────────────────────────────────────────────────────────────────
  const handleShowHistory = async (item) => {
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

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!formData.invoiceNo?.trim()) {
      toast.error("Invoice Number is required");
      return;
    }
    if (!formData.invoiceDate?.trim()) {
      toast.error("Invoice Date is required");
      return;
    }
    if (!formData.dueDate?.trim()) {
      toast.error("Due Date is required");
      return;
    }
    if (!formData.vendor_id?.trim()) {
      toast.error("Vendor is required");
      return;
    }
    if (!formData.purchaseCategory) {
      toast.error("Purchase Category is required");
      return;
    }
    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }
    setShowInvoicePreview(true);
  };

  const handleConfirmSubmit = async () => {
    const fmt = (d) => {
      if (!d) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
      try {
        const dt = new Date(d);
        return isNaN(dt) ? "" : dt.toISOString().split("T")[0];
      } catch {
        return "";
      }
    };
    const safeItems = Array.isArray(items)
      ? items
      : (() => {
          try {
            return JSON.parse(items);
          } catch {
            return [];
          }
        })();

    const payload = {
      ...formData,
      invoiceDate: fmt(formData.invoiceDate),
      dueDate: fmt(formData.dueDate),
      date: fmt(formData.date || new Date().toISOString().split("T")[0]),
      vendor_id: formData.vendor_id?.trim() || null,
      items: safeItems,
      summary,
      created_date: new Date().toISOString(),
      lastmodified_date: new Date().toISOString(),
      force_update: true, // ← tells backend to skip "no changes" guard
    };
    setLoading(true);
    try {
      let result;
      if (grn_number && formData.grn_id) {
        result = await apiRequest(
          `${StoreTrustbaseurl}travellers-in/update/${encodeURIComponent(grn_number)}/${formData.grn_id}/`,
          "PATCH",
          payload,
        );
      } else {
        result = await apiRequest(
          `${StoreTrustbaseurl}travellers-in/`,
          "POST",
          payload,
        );
      }

      if (result.success) {
        setGrnData({
          grn_number: result.data?.grn_number || "",
          invoice_no: payload.invoiceNo,
        });
        setShowGrnDialog(true);
        setTimeout(() => setShowInvoicePreview(false), 400);
      } else {
        if (result.data?.errors) {
          Object.entries(result.data.errors).forEach(([f, m]) =>
            toast.error(`${f}: ${Array.isArray(m) ? m.join(", ") : m}`),
          );
        } else {
          toast.error(result.error || "Submission failed");
        }
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setItems([]);
    setSummary(EMPTY_SUMMARY);
    setRoundSign("+");
    setRoundRaw(""); // ← add this
    navigate("/TravellersIN", { replace: true, state: {} });
  };

  const handleGrnDialogClose = () => {
    setShowGrnDialog(false);
    resetForm();
  };

  const numberToWords = (amount) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const c = (n) => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100)
        return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
      if (n < 1000)
        return (
          ones[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + c(n % 100) : "")
        );
      if (n < 100000)
        return (
          c(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + c(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          c(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 ? " " + c(n % 100000) : "")
        );
      return (
        c(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 ? " " + c(n % 10000000) : "")
      );
    };
    const r = Math.floor(amount),
      p = Math.round((amount - r) * 100);
    return (
      "Rupee(s) " + c(r) + (p > 0 ? " and " + c(p) + " Paise" : "") + " Only /-"
    );
  };

  const R = ({ label, value, readOnly, name, onChange }) => (
    <SumField>
      <Lbl
        style={{
          fontSize: "0.72rem",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          color: colors.textMuted,
        }}
      >
        {label}
      </Lbl>
      <RupeeWrap>
        <RupeeSymbol>₹</RupeeSymbol>
        <RupeeInput
          type="number"
          step="0.01"
          name={name}
          value={typeof value === "number" ? value.toFixed(2) : value}
          readOnly={readOnly}
          onChange={onChange}
          style={
            readOnly ? { background: "#f1f5f9", color: colors.textMuted } : {}
          }
        />
      </RupeeWrap>
    </SumField>
  );

  // ── Vendor Dropdown ──────────────────────────────────────────────────────
  const VendorDropdown = () => {
    const [search, setSearch] = useState(formData.vendor || "");
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const filtered = vendors.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase()),
    );

    useEffect(() => {
      const handler = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const select = (v) => {
      setSearch(v.name);
      setOpen(false);
      const addr = [v.addressLine1, v.addressLine2, v.city, v.state, v.pincode]
        .filter(Boolean)
        .join(", ");
      setFormData((prev) => ({
        ...prev,
        vendor: v.name,
        vendor_id: v.vendor_id || "",
        supplierAddress: addr,
        contactPerson: v.contactPerson || "",
        phone: v.phone || "",
      }));
    };

    return (
      <InputWrapper>
        <Lbl
          style={{
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
            color: colors.textMuted,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Vendor <RequiredMark>*</RequiredMark>
          <button
            onClick={() => setShowAddVendorModal(true)}
            style={{
              background: "none",
              border: `1px solid ${colors.border}`,
              borderRadius: 4,
              padding: "1px 6px",
              marginLeft: 6,
              cursor: "pointer",
              fontSize: "0.75rem",
              color: colors.primary,
            }}
          >
            +
          </button>
        </Lbl>
        <AutoWrap ref={ref}>
          <div style={{ position: "relative" }}>
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={loadingVendors ? "Loading…" : "Select vendor"}
              style={{ paddingRight: 28, fontSize: "0.82rem" }}
            />
            <FaChevronDown
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: colors.textMuted,
                fontSize: 11,
                pointerEvents: "none",
              }}
            />
          </div>
          {open && filtered.length > 0 && (
            <DropList>
              {filtered.map((v) => (
                <DropItem key={v.vendor_id} onMouseDown={() => select(v)}>
                  {v.name}
                </DropItem>
              ))}
            </DropList>
          )}
        </AutoWrap>
      </InputWrapper>
    );
  };

  // ── Item Dropdown ──────────────────────────────────────────────────────────
  const ItemDropdown = () => {
    const [search, setSearch] = useState(modalForm.name || "");
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      setSearch(modalForm.name || "");
    }, [modalForm.name]);

    const filtered = availableItems
      .filter((i) => String(i.hsn ?? "").trim())
      .filter((i) => i.itemName.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.itemName.localeCompare(b.itemName));

    useEffect(() => {
      const handler = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const select = (item) => {
      setSearch(item.itemName);
      setOpen(false);
      setModalForm((prev) => ({
        ...prev,
        name: item.itemName,
        hsn: item.hsn || "",
      }));
    };

    return (
      <AutoWrap ref={ref}>
        <div style={{ position: "relative" }}>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
              if (!e.target.value) {
                setModalForm((prev) => ({ ...prev, name: "", hsn: "" }));
              }
            }}
            onFocus={() => setOpen(true)}
            placeholder={loadingItems ? "Loading…" : "Search item"}
            style={{ paddingRight: 28, fontSize: "0.82rem" }}
          />
          <FaChevronDown
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: colors.textMuted,
              fontSize: 11,
              pointerEvents: "none",
            }}
          />
        </div>
        {open && filtered.length > 0 && (
          <DropList>
            {filtered.map((i) => (
              <DropItem key={i.item_id} onMouseDown={() => select(i)}>
                {i.itemName}
              </DropItem>
            ))}
          </DropList>
        )}
        {open && search && filtered.length === 0 && (
          <DropList>
            <DropItem style={{ color: colors.textMuted, cursor: "default" }}>
              No items found
            </DropItem>
          </DropList>
        )}
      </AutoWrap>
    );
  };
  // ─────────────────────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      <Container>
        <ToastContainer position="top-right" autoClose={3000} />

        <PageHeader>
          <div>
            <PageTitle>
              <ShoppingBag size={18} /> Travellers INN — GRN
            </PageTitle>
            <PageSubtitle>Goods Receipt Note</PageSubtitle>
          </div>
          {grn_number && (
            <StatusBadge active>Editing: {grn_number}</StatusBadge>
          )}
        </PageHeader>

        <FormContent>
          {/* ── Card 1: Basic Information ── */}
          <Card>
            <CardHeader>
              <span>📋 Basic Information</span>
            </CardHeader>
            <CardBody>
              <GridRow cols="repeat(6, 1fr)">
                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Purchase Category <RequiredMark>*</RequiredMark>
                  </Lbl>
                  <Select
                    name="purchaseCategory"
                    value={formData.purchaseCategory}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Category</option>
                    <option value="TRAVELLERS IN CREDIT">
                      TRAVELLERS IN CREDIT
                    </option>
                    <option value="TRAVELLERS IN CASH">
                      TRAVELLERS IN CASH
                    </option>
                  </Select>
                </InputWrapper>

                <VendorDropdown />

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    GRN Date
                  </Lbl>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    disabled
                    style={{ fontSize: "0.82rem" }}
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Vendor ID
                  </Lbl>
                  <ReadOnlyInput
                    value={formData.vendor_id}
                    readOnly
                    placeholder="Auto-filled"
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Supplier Address
                  </Lbl>
                  <ReadOnlyInput
                    value={formData.supplierAddress}
                    readOnly
                    placeholder="Auto-filled"
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Contact Person
                  </Lbl>
                  <ReadOnlyInput
                    value={formData.contactPerson}
                    readOnly
                    placeholder="Auto-filled"
                  />
                </InputWrapper>
              </GridRow>

              <GridRow cols="repeat(6, 1fr)" mb="0">
                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Phone
                  </Lbl>
                  <ReadOnlyInput
                    value={formData.phone}
                    readOnly
                    placeholder="Auto-filled"
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Invoice No <RequiredMark>*</RequiredMark>
                  </Lbl>
                  <Input
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleFormChange}
                    placeholder="INV-001"
                    style={{ fontSize: "0.82rem" }}
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Invoice Date <RequiredMark>*</RequiredMark>
                  </Lbl>
                  <Input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleFormChange}
                    max={today}
                    style={{ fontSize: "0.82rem" }}
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Credit Period
                  </Lbl>
                  <Input
                    name="creditPeriod"
                    value={formData.creditPeriod || "45 Days"}
                    onChange={handleFormChange}
                    style={{ fontSize: "0.82rem" }}
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Due Date
                  </Lbl>
                  <Input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleFormChange}
                    style={{ fontSize: "0.82rem" }}
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Payment Mode
                  </Lbl>
                  <Select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleFormChange}
                    style={{ fontSize: "0.82rem" }}
                  >
                    <option value="CHEQUE">CHEQUE</option>
                    <option value="CASH">CASH</option>
                    <option value="NEFT">NEFT</option>
                    <option value="RTGS">RTGS</option>
                    <option value="UPI">UPI</option>
                  </Select>
                </InputWrapper>
              </GridRow>
            </CardBody>
          </Card>

          {/* ── Card 2: Items ── */}
          <Card>
            <CardHeader>
              <span>Items</span>
              <Button
                onClick={() => openModal()}
                style={{ padding: "5px 12px", fontSize: "0.78rem" }}
              >
                <Plus size={13} /> Add Item
              </Button>
            </CardHeader>
            <CardBody style={{ padding: 0 }}>
              <TableWrapper>
                <ItemsTable>
                  <thead>
                    <tr>
                      <th>Sl.</th>
                      <th>Name</th>
                      <th>HSN</th>
                      <th>Batch</th>
                      <th>Expiry</th>
                      <th>Packing</th>
                      <th>No of Unit</th>
                      <th>Qty</th>
                      <th>Free</th>
                      <th>Item Value ₹</th>
                      <th>Packing Price ₹</th>
                      <th>Unit Price ₹</th>
                      <th>Tax%</th>
                      <th>CGST%</th>
                      <th>CGST Amt ₹</th>
                      <th>SGST%</th>
                      <th>SGST Amt ₹</th>
                      <th>IGST%</th>
                      <th>IGST Amt ₹</th>
                      <th>P.Disc%</th>
                      <th>Disc Amt ₹</th>
                      <th>P.Cost ₹</th>
                      <th>Unit Cost ₹</th>
                      <th>MRP ₹</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <EmptyCell colSpan="25">
                          No items added yet. Click "Add Item" to get started.
                        </EmptyCell>
                      </tr>
                    ) : (
                      items.map((it, idx) => (
                        <tr key={it._rowId ?? idx}>
                          <td>{idx + 1}</td>
                          {/* Name resolved from availableItems */}
                          <td style={{ fontWeight: 600, minWidth: 120 }}>
                            {getItemName(it)}
                          </td>
                          <td>{it.hsn}</td>
                          <td>{it.batch}</td>
                          <td>{it.expiry}</td>
                          <td>{it.packing}</td>
                          <td>{it.noOfUnit}</td>
                          <td style={{ fontWeight: 700 }}>{it.quantity}</td>
                          <td>{it.free}</td>
                          <td>{it.itemValue}</td>
                          <td>{it.packingPrice}</td>
                          <td>{it.unitPrice}</td>
                          <td>{it.tax}</td>
                          <td>{it.cgstPercent}</td>
                          <td>{it.cgstAmt}</td>
                          <td>{it.sgstPercent}</td>
                          <td>{it.sgstAmt}</td>
                          <td>{it.igstPercent}</td>
                          <td>{it.igstAmt}</td>
                          <td>{it.purchaseDiscountPercent}</td>
                          <td>{it.discountedAmt}</td>
                          <td
                            style={{ fontWeight: 700, color: colors.primary }}
                          >
                            {it.purchaseCost}
                          </td>
                          <td style={{ color: colors.primaryDark }}>
                            {it.unitCostWithGst}
                          </td>
                          <td>{it.mrp}</td>
                          <td>
                            <ActionBtn
                              className="edit"
                              onClick={() => openModal(it)}
                            >
                              <FaEdit />
                            </ActionBtn>
                            <ActionBtn
                              className="del"
                              onClick={() => handleDeleteItem(it._rowId)}
                            >
                              <FaTrash />
                            </ActionBtn>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </ItemsTable>
              </TableWrapper>
            </CardBody>
          </Card>

          {/* ── Card 3: Summary ── */}
          <Card>
            <CardHeader>💰 Summary</CardHeader>
            <CardBody>
              <SumGrid>
                <R
                  label="Non Taxable Amount"
                  value={summary.nonTaxableAmount}
                  readOnly
                />
                <R label="CGST" value={summary.cgst} readOnly />
                <R label="SGST" value={summary.sgst} readOnly />
                <R label="Total Amount" value={summary.totalAmount} readOnly />
                <R
                  label="Quotation Rate"
                  name="quotationRate"
                  value={summary.quotationRate}
                  onChange={handleSummaryChange}
                />
              </SumGrid>
              <SumGrid>
                <R
                  label="Taxable Amount"
                  value={summary.taxableAmount}
                  readOnly
                />
                <R
                  label="IGST"
                  name="igst"
                  value={summary.igst}
                  onChange={handleSummaryChange}
                />
                <R
                  label="Cess"
                  name="cess"
                  value={summary.cess}
                  onChange={handleSummaryChange}
                />
                <R
                  label="Tax On Free Items"
                  name="taxOnFreeItems"
                  value={summary.taxOnFreeItems}
                  onChange={handleSummaryChange}
                />
                <R
                  label="Courier / Transport"
                  name="courierTransportCharge"
                  value={summary.courierTransportCharge}
                  onChange={handleSummaryChange}
                />
              </SumGrid>
              <SumGrid>
                <R
                  label="Tax Paid To Supplier"
                  value={summary.taxPaidToSupplier}
                  readOnly
                />
                <R
                  label="Central Sales Tax"
                  name="centralSalesTax"
                  value={summary.centralSalesTax}
                  onChange={handleSummaryChange}
                />
                <SumField>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Round Amount
                  </Lbl>
                  <RoundWrap>
                    <RoundSignSel
                      type="button"
                      title="Toggle sign"
                      onClick={() => {
                        const sign = roundSign === "+" ? "-" : "+";
                        setRoundSign(sign);
                        const abs = parseFloat(roundRaw) || 0;
                        if (abs > 0)
                          setSummary((prev) => ({
                            ...prev,
                            roundAmount: sign === "+" ? abs : -abs,
                          }));
                      }}
                    >
                      {roundSign}
                    </RoundSignSel>
                    <RoundInput
                      type="number"
                      step="0.01"
                      value={roundRaw}
                      placeholder="0.00"
                      onChange={(e) => {
                        const raw = e.target.value;
                        setRoundRaw(raw); // keep the string as-is
                        const v = parseFloat(raw) || 0;
                        setSummary((prev) => ({
                          ...prev,
                          roundAmount: roundSign === "+" ? v : -v,
                        }));
                      }}
                      style={{ fontSize: "0.82rem" }}
                    />
                  </RoundWrap>
                </SumField>
                <R
                  label="Total Discount"
                  value={summary.totalDiscount}
                  readOnly
                />
                <R
                  label="Local Tax"
                  name="localTax"
                  value={summary.localTax}
                  onChange={handleSummaryChange}
                />
              </SumGrid>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 14,
                }}
              >
                <NetAmountBox>
                  <NetLabel>Net Invoice Amount</NetLabel>
                  <NetValue>₹ {summary.netInvoiceAmount.toFixed(2)}</NetValue>
                </NetAmountBox>
              </div>

              <div>
                <Lbl
                  style={{
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    color: colors.textMuted,
                  }}
                >
                  Remarks
                </Lbl>
                <TextArea
                  name="remarks"
                  value={summary.remarks}
                  onChange={(e) =>
                    setSummary((prev) => ({ ...prev, remarks: e.target.value }))
                  }
                  placeholder="Any remarks…"
                  rows={3}
                  style={{ width: "100%", marginTop: 3, fontSize: "0.82rem" }}
                />
              </div>
            </CardBody>
          </Card>

          {/* ── Action Buttons ── */}
          <ButtonContainer>
            <Button secondary onClick={() => setShowConfirmDialog(true)}>
              <X size={13} /> Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {grn_number ? "Update GRN" : "Submit GRN"}
            </Button>
          </ButtonContainer>
        </FormContent>
      </Container>

      {/* ═══════════════ ADD / EDIT ITEM MODAL ═══════════════ */}
      {showModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalHead>
              <ModalTitle>
                {editingItem ? "Edit Item" : "Add New Item"}
              </ModalTitle>
              <CloseBtn onClick={closeModal}>
                <X size={18} />
              </CloseBtn>
            </ModalHead>
            <ModalScroll>
              <SectionDivider>Item Details</SectionDivider>
              <GridRow cols="repeat(5, 1fr)">
                {/* Replace the existing InputWrapper + Select for item name with this */}
                <InputWrapper style={{ gridColumn: "span 2" }}>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Item Name *
                    <button
                      onClick={() => setShowAddItemModal(true)}
                      style={{
                        background: "none",
                        border: `1px solid ${colors.border}`,
                        borderRadius: 4,
                        padding: "1px 6px",
                        marginLeft: 6,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        color: colors.primary,
                      }}
                    >
                      +
                    </button>
                  </Lbl>
                  <ItemDropdown />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    HSN Code
                    <History
                      size={15}
                      style={{
                        cursor: modalForm.name ? "pointer" : "not-allowed",
                        color: modalForm.name ? colors.primary : "#94a3b8",
                      }}
                      onClick={() => {
                        if (!modalForm.name) return;
                        const matched = availableItems.find(
                          (i) => i.itemName === modalForm.name,
                        );
                        handleShowHistory({
                          ...modalForm,
                          item_id: matched?.item_id
                            ? String(matched.item_id)
                            : modalForm.item_id || "",
                          hsn: matched?.hsn || modalForm.hsn || "",
                        });
                      }}
                      title="View purchase history"
                    />
                  </Lbl>
                  <Input
                    name="hsn"
                    value={modalForm.hsn}
                    onChange={handleModalChange}
                    style={{ fontSize: "0.82rem" }}
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Batch
                  </Lbl>
                  <Input
                    name="batch"
                    value={modalForm.batch}
                    onChange={handleModalChange}
                    style={{ fontSize: "0.82rem" }}
                  />
                </InputWrapper>

                <InputWrapper>
                  <Lbl
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      color: colors.textMuted,
                    }}
                  >
                    Expiry Date
                  </Lbl>
                  <Input
                    type="text"
                    name="expiry"
                    value={modalForm.expiry}
                    placeholder="MM/YYYY"
                    maxLength={7}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9/]/g, "");
                      // Auto-insert slash after MM
                      if (
                        val.length === 2 &&
                        !val.includes("/") &&
                        modalForm.expiry.length === 1
                      ) {
                        val = val + "/";
                      }
                      // Prevent year from exceeding 4 digits
                      const parts = val.split("/");
                      if (parts[1] && parts[1].length > 4) return;
                      // Validate month (01-12) only when fully typed
                      if (parts[0] && parts[0].length === 2) {
                        const month = parseInt(parts[0]);
                        if (month < 1 || month > 12) return;
                      }
                      handleModalChange({
                        target: { name: "expiry", value: val },
                      });
                    }}
                    style={{ fontSize: "0.82rem" }}
                  />
                </InputWrapper>
              </GridRow>

              <SectionDivider>Quantity Details</SectionDivider>
              <GridRow cols="repeat(4, 1fr)">
                {[
                  { lbl: "Packing", name: "packing", type: "text" },
                  { lbl: "No of Unit", name: "noOfUnit", type: "number" },
                  { lbl: "Quantity", name: "quantity", type: "number" },
                  { lbl: "Free", name: "free", type: "number" },
                ].map(({ lbl, name, type }) => (
                  <InputWrapper key={name}>
                    <Lbl
                      style={{
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                        color: colors.textMuted,
                      }}
                    >
                      {lbl}
                    </Lbl>
                    <Input
                      type={type}
                      name={name}
                      value={modalForm[name]}
                      onChange={handleModalChange}
                      style={{ fontSize: "0.82rem" }}
                    />
                  </InputWrapper>
                ))}
              </GridRow>

              <SectionDivider>Pricing Details</SectionDivider>
              <GridRow cols="repeat(4, 1fr)">
                {[
                  { lbl: "Item Value ₹", name: "itemValue" },
                  { lbl: "Packing Price ₹", name: "packingPrice" },
                  { lbl: "Unit Price ₹", name: "unitPrice" },
                ].map(({ lbl, name }) => (
                  <InputWrapper key={name}>
                    <Lbl
                      style={{
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                        color: colors.textMuted,
                      }}
                    >
                      {lbl}
                    </Lbl>
                    <Input
                      type="number"
                      step="0.01"
                      name={name}
                      value={modalForm[name]}
                      onChange={handleModalChange}
                      style={{ fontSize: "0.82rem" }}
                    />
                  </InputWrapper>
                ))}
              </GridRow>

              <SectionDivider>Tax Details</SectionDivider>
              <div
                style={{
                  background: "#fcefee",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  padding: "12px 14px",
                  marginBottom: 10,
                }}
              >
                <GridRow cols="repeat(5, 1fr)" mb="0">
                  <InputWrapper>
                    <Lbl
                      style={{
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                        color: colors.textMuted,
                      }}
                    >
                      Tax Rate
                    </Lbl>
                    <Select
                      name="tax"
                      value={modalForm.tax}
                      onChange={handleModalChange}
                      style={{ fontSize: "0.82rem" }}
                    >
                      <option value="">Select %</option>
                      {[0, 5, 12, 18, 28].map((r) => (
                        <option key={r} value={r}>
                          {r}%
                        </option>
                      ))}
                    </Select>
                  </InputWrapper>
                  {[
                    { lbl: "CGST %", name: "cgstPercent", readOnly: true },
                    { lbl: "CGST Amt ₹", name: "cgstAmt", readOnly: false },
                    { lbl: "SGST %", name: "sgstPercent", readOnly: true },
                    { lbl: "SGST Amt ₹", name: "sgstAmt", readOnly: false },
                  ].map(({ lbl, name, readOnly }) => (
                    <InputWrapper key={name}>
                      <Lbl
                        style={{
                          fontSize: "0.72rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                          color: colors.textMuted,
                        }}
                      >
                        {lbl}
                      </Lbl>
                      <Input
                        type="number"
                        step="0.01"
                        name={name}
                        value={modalForm[name]}
                        readOnly={readOnly}
                        onChange={readOnly ? undefined : handleModalChange}
                        style={{
                          fontSize: "0.82rem",
                          ...(readOnly ? { background: "#f9e5e8" } : {}),
                        }}
                      />
                    </InputWrapper>
                  ))}
                </GridRow>
              </div>

              <SectionDivider>Purchase Discount &amp; Cost</SectionDivider>
              <div
                style={{
                  background: "#fcefee",
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  padding: "12px 14px",
                  marginBottom: 10,
                }}
              >
                <GridRow cols="repeat(5, 1fr)" mb="0">
                  {[
                    {
                      lbl: "Discount %",
                      name: "purchaseDiscountPercent",
                      readOnly: false,
                      placeholder: "0.00",
                    },
                    {
                      lbl: "Discounted Amt ₹",
                      name: "discountedAmt",
                      readOnly: false,
                      placeholder: "0.00",
                    },
                    {
                      lbl: "Purchase Cost ₹",
                      name: "purchaseCost",
                      readOnly: false,
                      extra: { fontWeight: 700, color: colors.primary },
                    },
                    {
                      lbl: "Unit Cost (GST) ₹",
                      name: "unitCostWithGst",
                      readOnly: true,
                      extra: {
                        background: "#f9e5e8",
                        color: colors.primaryDark,
                        fontWeight: 600,
                      },
                    },
                    { lbl: "MRP ₹", name: "mrp", readOnly: false },
                  ].map(({ lbl, name, readOnly, placeholder, extra = {} }) => (
                    <InputWrapper key={name}>
                      <Lbl
                        style={{
                          fontSize: "0.72rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                          color: colors.textMuted,
                        }}
                      >
                        {lbl}
                      </Lbl>
                      <Input
                        type="number"
                        step="0.01"
                        name={name}
                        value={modalForm[name]}
                        readOnly={readOnly}
                        placeholder={placeholder}
                        onChange={readOnly ? undefined : handleModalChange}
                        style={{ fontSize: "0.82rem", ...extra }}
                      />
                    </InputWrapper>
                  ))}
                </GridRow>
              </div>
            </ModalScroll>
            <ModalFoot>
              <Button
                secondary
                onClick={closeModal}
                style={{ fontSize: "0.82rem" }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddItem} style={{ fontSize: "0.82rem" }}>
                {editingItem ? "Update Item" : "Add Item"}
              </Button>
            </ModalFoot>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ═══════════════ HISTORY MODAL ═══════════════ */}
      {showHistoryModal &&
        selectedItemForHistory &&
        (() => {
          const prices = historyData.map((h) => {
            let it = h;
            try {
              const its = JSON.parse(h.items);
              const m = its.find((x) => x.hsn === selectedItemForHistory.hsn);
              if (m) it = m;
            } catch {}
            if (h.matched_item) it = h.matched_item;
            return parseFloat(it?.unitPrice || 0);
          });
          const priceStats =
            prices.length === 0
              ? { min: 0, max: 0, avg: 0 }
              : {
                  min: Math.min(...prices),
                  max: Math.max(...prices),
                  avg: prices.reduce((s, p) => s + p, 0) / prices.length,
                };
          const totalStock = historyData.reduce((t, h) => {
            let it = h;
            try {
              const its = JSON.parse(h.items);
              const m = its.find((x) => x.hsn === selectedItemForHistory.hsn);
              if (m) it = m;
            } catch {}
            if (h.matched_item) it = h.matched_item;
            return t + parseInt(it?.totalstock || 0);
          }, 0);

          return (
            <HistOverlay
              onClick={() => {
                setShowHistoryModal(false);
                setHistoryData([]);
              }}
            >
              <HistBox onClick={(e) => e.stopPropagation()}>
                <HistHead>
                  <div>
                    <HistTitle>
                      Purchase History —{" "}
                      {getItemName(selectedItemForHistory) ||
                        selectedItemForHistory.itemName ||
                        selectedItemForHistory.name}
                    </HistTitle>
                    <HistSubtitle>
                      HSN: {selectedItemForHistory.hsn} — Total Stock:{" "}
                      {totalStock}
                    </HistSubtitle>
                    <HistSubtitle style={{ marginTop: 2 }}>
                      Price Range: ₹{priceStats.min.toFixed(2)} – ₹
                      {priceStats.max.toFixed(2)} | Avg: ₹
                      {priceStats.avg.toFixed(2)}
                    </HistSubtitle>
                  </div>
                  <CloseBtn
                    onClick={() => setShowHistoryModal(false)}
                    style={{ color: "white" }}
                  >
                    <X size={18} />
                  </CloseBtn>
                </HistHead>
                <HistScroll>
                  {historyLoading ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: colors.textMuted,
                      }}
                    >
                      Loading history…
                    </div>
                  ) : historyData.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: colors.textMuted,
                      }}
                    >
                      No previous purchase history found.
                    </div>
                  ) : (
                    <HistTable>
                      <thead>
                        <tr>
                          {[
                            "GRN No",
                            "Date",
                            "Vendor",
                            "HSN",
                            "Item",
                            "Unit Price",
                            "Purchase Cost",
                            "Qty",
                            "Free",
                            "Stock",
                            "Batch",
                            "MRP",
                          ].map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.map((hi, i) => {
                          let it = selectedItemForHistory;
                          try {
                            const its = JSON.parse(hi.items);
                            const m = its.find(
                              (x) => x.hsn === selectedItemForHistory.hsn,
                            );
                            if (m) it = m;
                          } catch {}
                          if (hi.matched_item) it = hi.matched_item;
                          const unitPrice = parseFloat(it?.unitPrice || 0);
                          const isHigh =
                            unitPrice === priceStats.max &&
                            priceStats.max > priceStats.min;
                          const isLow =
                            unitPrice === priceStats.min &&
                            priceStats.max > priceStats.min;
                          return (
                            <tr key={i}>
                              <td>{hi.grn_number}</td>
                              <td>
                                {new Date(hi.date).toLocaleDateString("en-IN")}
                              </td>
                              <td>{hi.vendor}</td>
                              <td>{it.hsn || "—"}</td>
                              <td style={{ fontWeight: 600 }}>
                                {it.name ||
                                  it.item_name ||
                                  getItemName(it) ||
                                  "—"}
                              </td>
                              <td
                                style={{
                                  fontWeight: 700,
                                  color: isHigh
                                    ? "#dc2626"
                                    : isLow
                                      ? "#16a34a"
                                      : colors.primary,
                                  background: isHigh
                                    ? "#fef2f2"
                                    : isLow
                                      ? "#f0fdf4"
                                      : "transparent",
                                  borderRadius: 4,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {isHigh && (
                                  <span
                                    title="Highest price"
                                    style={{ marginRight: 4 }}
                                  >
                                    🔴
                                  </span>
                                )}
                                {isLow && (
                                  <span
                                    title="Lowest price"
                                    style={{ marginRight: 4 }}
                                  >
                                    🟢
                                  </span>
                                )}
                                ₹{unitPrice.toFixed(2)}
                              </td>
                              <td>
                                ₹{parseFloat(it.purchaseCost || 0).toFixed(2)}
                              </td>
                              <td>{it.quantity}</td>
                              <td>{it.free}</td>
                              <td>{it.totalstock || 0}</td>
                              <td>{it.batch || "—"}</td>
                              <td>₹{parseFloat(it.mrp || 0).toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </HistTable>
                  )}
                </HistScroll>
              </HistBox>
            </HistOverlay>
          );
        })()}

      {/* ═══════════════ INVOICE PREVIEW ═══════════════ */}
      {showInvoicePreview && (
        <InvOverlay>
          <InvBox style={{ maxWidth: 1100 }}>
            <ModalHead
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                borderBottom: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText size={18} color="white" />
                </div>
                <div>
                  <ModalTitle style={{ color: "white", fontSize: "1rem" }}>
                    Invoice Preview
                  </ModalTitle>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.7)",
                      marginTop: 1,
                    }}
                  >
                    Review before confirming submission
                  </div>
                </div>
              </div>
              <CloseBtn
                onClick={() => setShowInvoicePreview(false)}
                style={{ color: "white" }}
              >
                <X size={18} />
              </CloseBtn>
            </ModalHead>

            <InvBody style={{ background: "#f9e5e8", padding: "20px 24px" }}>
              {/* Hospital Header */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  borderRadius: 10,
                  padding: "18px 24px",
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: `0 4px 15px rgba(102, 37, 73, 0.3)`,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      color: "white",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      letterSpacing: 0.5,
                    }}
                  >
                    SHANMUGA HOSPITAL LIMITED
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "0.72rem",
                      marginTop: 3,
                    }}
                  >
                    51/24, Saradha College Road, Salem - 636007
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "0.72rem",
                    }}
                  >
                    Ph: 04272706666 | info@smrft.org
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 20,
                      padding: "4px 14px",
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: 1,
                      marginBottom: 6,
                    }}
                  >
                    GOODS RECEIPT NOTE — TRAVELLERS INN
                  </div>
                  {grn_number && (
                    <div
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "0.72rem",
                      }}
                    >
                      GRN:{" "}
                      <strong style={{ color: "white" }}>{grn_number}</strong>
                    </div>
                  )}
                  <div
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "0.72rem",
                    }}
                  >
                    Date:{" "}
                    <strong style={{ color: "white" }}>{formData.date}</strong>
                  </div>
                </div>
              </div>

              {/* 3-column Info Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {[
                  {
                    title: "Invoice Details",
                    icon: <FileText size={11} />,
                    rows: [
                      ["Invoice No", formData.invoiceNo],
                      ["Invoice Date", formData.invoiceDate],
                      ["Purchase Date", formData.date],
                      ["Payment Mode", formData.paymentMode],
                      ["Credit Period", formData.creditPeriod],
                    ],
                  },
                  {
                    title: "Supplier Details",
                    icon: <ShoppingBag size={11} />,
                    rows: [
                      ["Supplier", formData.vendor],
                      ["Address", formData.supplierAddress],
                      ["Phone", formData.phone],
                      ["Vendor ID", formData.vendor_id],
                    ],
                  },
                  {
                    title: "Order Details",
                    icon: <Package size={11} />,
                    rows: [
                      ["Category", formData.purchaseCategory],
                      ["Due Date", formData.dueDate],
                    ],
                  },
                ].map(({ title, icon, rows }) => (
                  <div
                    key={title}
                    style={{
                      background: "white",
                      borderRadius: 8,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(102, 37, 73, 0.06)",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      style={{
                        background: colors.primary,
                        color: "white",
                        padding: "7px 12px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {icon} {title}
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      {rows.map(([label, val]) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "4px 0",
                            borderBottom: `1px solid ${colors.tabBg}`,
                            fontSize: "0.75rem",
                          }}
                        >
                          <span style={{ color: "#64748b" }}>{label}</span>
                          <span style={{ fontWeight: 600, color: "#1e293b" }}>
                            {val || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Items Table */}
              <div
                style={{
                  background: "white",
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(102, 37, 73, 0.06)",
                  border: `1px solid ${colors.border}`,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    background: colors.primary,
                    color: "white",
                    padding: "8px 14px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Package size={12} /> Items — {items.length} line
                  {items.length !== 1 ? "s" : ""}
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.72rem",
                      minWidth: 900,
                    }}
                  >
                    <thead>
                      <tr>
                        <th rowSpan="2" style={thStyle(colors.primary)}>
                          #
                        </th>
                        <th
                          rowSpan="2"
                          style={{
                            ...thStyle(colors.primary),
                            textAlign: "left",
                            minWidth: 130,
                          }}
                        >
                          Product
                        </th>
                        {[
                          "HSN",
                          "Batch",
                          "Expiry",
                          "Pack",
                          "Qty",
                          "Free",
                          "P Rate",
                          "MRP",
                          "Disc",
                          "Non-Taxable Amt",
                        ].map((h) => (
                          <th
                            key={h}
                            rowSpan="2"
                            style={thStyle(colors.primary)}
                          >
                            {h}
                          </th>
                        ))}
                        <th colSpan="2" style={thStyle(colors.primaryDark)}>
                          CGST
                        </th>
                        <th colSpan="2" style={thStyle(colors.secondary)}>
                          SGST
                        </th>
                        <th colSpan="2" style={thStyle("#7c3aed")}>
                          IGST
                        </th>
                        <th rowSpan="2" style={thStyle(colors.primary)}>
                          Total Amt
                        </th>
                      </tr>
                      <tr>
                        <th style={thStyle(colors.primaryDark)}>Rate</th>
                        <th style={thStyle(colors.primaryDark)}>Amt</th>
                        <th style={thStyle(colors.secondary)}>Rate</th>
                        <th style={thStyle(colors.secondary)}>Amt</th>
                        <th style={thStyle("#7c3aed")}>Rate</th>
                        <th style={thStyle("#7c3aed")}>Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, i) => (
                        <tr
                          key={it.item_id || i}
                          style={{
                            background: i % 2 === 0 ? "#fcefee" : "white",
                          }}
                        >
                          <td style={tdCenter}>{i + 1}</td>
                          {/* Name resolved from availableItems */}
                          <td
                            style={{
                              ...tdBase,
                              fontWeight: 600,
                              color: "#1e293b",
                            }}
                          >
                            {getItemName(it)}
                          </td>
                          <td style={tdCenter}>{it.hsn}</td>
                          <td style={tdCenter}>{it.batch}</td>
                          <td style={tdCenter}>{it.expiry || "—"}</td>
                          <td style={tdCenter}>{it.packing}</td>
                          <td style={{ ...tdCenter, fontWeight: 700 }}>
                            {it.quantity}
                          </td>
                          <td style={tdCenter}>{it.free}</td>
                          <td style={tdRight}>
                            {parseFloat(it.packingPrice || 0).toFixed(2)}
                          </td>
                          <td style={tdRight}>
                            {parseFloat(it.mrp || 0).toFixed(2)}
                          </td>
                          <td style={{ ...tdRight, color: "#dc2626" }}>
                            {parseFloat(it.discountedAmt || 0).toFixed(2)}
                          </td>
                          <td style={tdRight}>
                            {parseFloat(it.itemValue || 0).toFixed(2)}
                          </td>
                          <td style={tdCenter}>{it.cgstPercent}%</td>
                          <td style={tdRight}>
                            {parseFloat(it.cgstAmt || 0).toFixed(4)}
                          </td>
                          <td style={tdCenter}>{it.sgstPercent}%</td>
                          <td style={tdRight}>
                            {parseFloat(it.sgstAmt || 0).toFixed(4)}
                          </td>
                          <td style={tdCenter}>—</td>
                          <td style={tdRight}>0.00</td>
                          <td
                            style={{
                              ...tdRight,
                              fontWeight: 700,
                              color: colors.primary,
                            }}
                          >
                            {parseFloat(it.purchaseCost || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background: colors.primary }}>
                        <td
                          colSpan="11"
                          style={{
                            padding: "8px 10px",
                            fontWeight: 800,
                            color: "white",
                            fontSize: "0.72rem",
                            textAlign: "center",
                          }}
                        >
                          TOTALS
                        </td>
                        <td
                          style={{
                            ...tdRight,
                            background: colors.primary,
                            color: "white",
                            fontWeight: 700,
                          }}
                        >
                          {summary.nonTaxableAmount.toFixed(2)}
                        </td>
                        <td style={{ background: colors.primary }} />
                        <td
                          style={{
                            ...tdRight,
                            background: colors.primary,
                            color: "#fca5a5",
                            fontWeight: 700,
                          }}
                        >
                          {summary.cgst.toFixed(2)}
                        </td>
                        <td style={{ background: colors.primary }} />
                        <td
                          style={{
                            ...tdRight,
                            background: colors.primary,
                            color: "#fca5a5",
                            fontWeight: 700,
                          }}
                        >
                          {summary.sgst.toFixed(2)}
                        </td>
                        <td style={{ background: colors.primary }} />
                        <td
                          style={{
                            ...tdRight,
                            background: colors.primary,
                            color: "#fca5a5",
                            fontWeight: 700,
                          }}
                        >
                          0.00
                        </td>
                        <td
                          style={{
                            ...tdRight,
                            background: colors.primary,
                            color: "white",
                            fontWeight: 800,
                          }}
                        >
                          {summary.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary + Tax Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                {[
                  {
                    title: "Tax Summary",
                    rows: [
                      ["CGST Amount", summary.cgst],
                      ["SGST Amount", summary.sgst],
                      ["IGST Amount", summary.igst],
                      ["Total GST", summary.cgst + summary.sgst + summary.igst],
                    ],
                  },
                  {
                    title: "Amount Summary",
                    rows: [
                      ["Taxable Total", summary.taxableAmount],
                      ["Total Discount", summary.totalDiscount],
                      ["Tax on Free", summary.taxOnFreeItems],
                      ["Courier/Transport", summary.courierTransportCharge],
                      ["Round Off", summary.roundAmount],
                    ],
                  },
                ].map(({ title, rows }) => (
                  <div
                    key={title}
                    style={{
                      background: "white",
                      borderRadius: 8,
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(102, 37, 73, 0.06)",
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      style={{
                        background: colors.primary,
                        color: "white",
                        padding: "7px 12px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      {title}
                    </div>
                    <div style={{ padding: "10px 14px" }}>
                      {rows.map(([label, val]) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "4px 0",
                            borderBottom: `1px solid ${colors.tabBg}`,
                            fontSize: "0.75rem",
                          }}
                        >
                          <span style={{ color: "#64748b" }}>{label}</span>
                          <span
                            style={{ fontWeight: 600, color: colors.primary }}
                          >
                            ₹ {parseFloat(val || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Net Amount Hero */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  borderRadius: 10,
                  padding: "16px 24px",
                  marginBottom: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: `0 4px 15px rgba(102, 37, 73, 0.3)`,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 4,
                    }}
                  >
                    Amount in Words
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "0.82rem",
                      fontStyle: "italic",
                    }}
                  >
                    {numberToWords(summary.netInvoiceAmount)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginBottom: 2,
                    }}
                  >
                    Net Invoice Amount
                  </div>
                  <div
                    style={{
                      color: "white",
                      fontSize: "1.6rem",
                      fontWeight: 900,
                      lineHeight: 1,
                    }}
                  >
                    ₹ {summary.netInvoiceAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "white",
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  fontSize: "0.75rem",
                  color: "#64748b",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span>
                  Prepared by:{" "}
                  <strong style={{ color: "#1e293b" }}>
                    {userId || "N/A"}
                  </strong>
                </span>
                <span>
                  Generated on:{" "}
                  <strong style={{ color: "#1e293b" }}>
                    {new Date().toLocaleString("en-IN")}
                  </strong>
                </span>
              </div>
            </InvBody>

            <ModalFoot
              style={{
                background: "white",
                borderTop: `2px solid ${colors.border}`,
                padding: "12px 20px",
              }}
            >
              <Button secondary onClick={() => setShowInvoicePreview(false)}>
                <X size={13} style={{ marginRight: 4 }} /> Cancel
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                disabled={loading}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  minWidth: 160,
                }}
              >
                {loading ? "Submitting…" : "✓ Confirm & Submit"}
              </Button>
            </ModalFoot>
          </InvBox>
        </InvOverlay>
      )}

      {/* ═══════════════ CONFIRM CANCEL ═══════════════ */}
      {showConfirmDialog && (
        <ModalOverlay>
          <div
            style={{
              background: "white",
              borderRadius: 10,
              width: 380,
              boxShadow: "0 20px 60px rgba(102, 37, 73, 0.2)",
              overflow: "hidden",
            }}
          >
            <ModalHead>
              <ModalTitle>Confirm Cancel</ModalTitle>
            </ModalHead>
            <div
              style={{
                padding: "20px 18px",
                color: colors.textMuted,
                fontSize: "0.88rem",
              }}
            >
              Are you sure you want to cancel? All unsaved data will be lost.
            </div>
            <ModalFoot>
              <Button secondary onClick={() => setShowConfirmDialog(false)}>
                Keep Editing
              </Button>
              <Button
                danger
                onClick={() => {
                  resetForm();
                  setShowConfirmDialog(false);
                }}
              >
                Yes, Cancel
              </Button>
            </ModalFoot>
          </div>
        </ModalOverlay>
      )}

      {/* ═══════════════ GRN SAVED DIALOG ═══════════════ */}
      {showGrnDialog && (
        <ModalOverlay>
          <GrnSavedBox>
            <GrnSavedHead>
              <span style={{ fontWeight: 700 }}>GRN Saved Successfully</span>
              <CloseBtn
                onClick={handleGrnDialogClose}
                style={{ color: "white" }}
              >
                <X size={16} />
              </CloseBtn>
            </GrnSavedHead>
            <div style={{ padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "0.85rem", color: colors.textMuted }}>
                GRN Number
              </div>
              <div
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: colors.primary,
                  margin: "8px 0",
                }}
              >
                {grnData.grn_number}
              </div>
              <div style={{ fontSize: "0.82rem", color: colors.textMuted }}>
                For Invoice No: <strong>{grnData.invoice_no}</strong>
              </div>
            </div>
            <ModalFoot>
              <Button onClick={handleGrnDialogClose} style={{ width: "100%" }}>
                OK
              </Button>
            </ModalFoot>
          </GrnSavedBox>
        </ModalOverlay>
      )}

      {/* ═══════════════ MINI MODALS ═══════════════ */}
      {showAddItemModal && (
        <AddItemMiniModal
          onClose={() => setShowAddItemModal(false)}
          onSuccess={() => fetchItems()}
        />
      )}
      {showAddVendorModal && (
        <AddVendorMiniModal
          onClose={() => setShowAddVendorModal(false)}
          onSuccess={() => fetchVendors()}
        />
      )}
    </PageWrapper>
  );
};

export default TravellersIN;
