import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
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
  CloudCog,
} from "lucide-react";
import apiRequest from "../apiRequest";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const formatDate = (date) => {
  if (!date || new Date(date).toString() === "Invalid Date") {
    return "N/A";
  }
  return new Date(date).toISOString().split("T")[0]; // e.g., 2025-08-26
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

const formatCurrency = (value) => {
  return `₹${parseFloat(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
};

// Styled Components (unchanged)
const Container = styled.div`
  padding: 24px;
  background-color: white;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6b7280;
`;

const FiltersSection = styled.div`
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 16px;
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FilterGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 16px;
  height: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding-left: 40px;
  padding-right: 12px;
  padding-top: 8px;
  padding-bottom: 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s;
  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: transparent;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: end;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const CustomButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${(props) =>
    props.variant === "primary"
      ? "#3b82f6"
      : props.variant === "secondary"
      ? "#6b7280"
      : props.variant === "cancel"
      ? "#ef4444"
      : props.variant === "outline"
      ? "#ffffff"
      : "#059669"};
  color: ${(props) =>
    props.variant === "cancel" || props.variant === "primary" || props.variant === "secondary" || props.variant === "green"
      ? "white"
      : "#374151"};
  border: ${(props) => (props.variant === "outline" ? "1px solid #d1d5db" : "none")};
  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.variant === "primary"
        ? "#2563eb"
        : props.variant === "secondary"
        ? "#4b5563"
        : props.variant === "cancel"
        ? "#dc2626"
        : props.variant === "green"
        ? "#047857"
        : "#f3f4f6"};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GreenButton = styled(CustomButton)`
  background-color: #059669;
  &:hover:not(:disabled) {
    background-color: #047857;
  }
`;

const ActionsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const RecordsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RecordsText = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  padding: 32px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  border: 2px solid #e5e7eb;
  border-bottom: 2px solid #3b82f6;
  margin: 0 auto;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 8px;
  color: #6b7280;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHeader = styled.thead`
  background-color: #f9fafb;
`;

const TableHeaderRow = styled.tr``;

const TableHeaderCell = styled.th`
  padding: 12px 24px;
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
  &.no-print {
    @media print { display: none; }
  }
`;

const TableBody = styled.tbody`
  background-color: white;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
  &:hover { background-color: #f9fafb; }
`;

const TableCell = styled.td`
  padding: 16px 24px;
  white-space: nowrap;
  font-size: 14px;
  &.font-medium { font-weight: 500; color: #111827; }
  &.text-gray { color: #6b7280; }
  &.no-print { @media print { display: none; } }
`;

const CustomBadge = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${(props) => (props.status === "Paid" ? "#d1fae5" : props.status === "Partially Paid" ? "#fef3c7" : "#fee2e2")};
  color: ${(props) => (props.status === "Paid" ? "#065f46" : props.status === "Partially Paid" ? "#d97706" : "#991b1b")};
`;

const ActionButton = styled.button`
  padding: 4px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 4px;
  &:hover {
    background-color: ${(props) => {
      if (props.variant === "edit") return "#dbeafe";
      if (props.variant === "delete") return "#fecaca";
      if (props.variant === "view") return "#ecfdf5";
      if (props.variant === "pay") return "#fef3c7";
      if (props.variant === "print") return "#f3e8ff";
      return "#f3f4f6";
    }};
  }
  &.edit { color: #2563eb; }
  &.delete { color: #dc2626; }
  &.view { color: #059669; }
  &.pay { color: #d97706; }
  &.print { color: #7c3aed; }
`;

const NoDataRow = styled.tr``;

const NoDataCell = styled.td`
  padding: 24px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

const PaginationSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;

const PaginationLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaginationText = styled.span`
  font-size: 14px;
  color: #374151;
`;

const PaginationRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 4px;
`;

const PaginationButton = styled.button`
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover:not(:disabled) { background-color: #f9fafb; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 20px;
  padding: 0;
  width: 95%;
  max-width: 1200px;
  max-height: 95vh;
  overflow: hidden;
  margin: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8, #7c3aed);
    border-radius: 20px 20px 0 0;
  }
`;

const ModalScrollContainer = styled.div`
  max-height: 95vh;
  overflow-y: auto;
  padding: 32px;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #3b82f6, #1d4ed8);
    border-radius: 4px;
    &:hover {
      background: linear-gradient(180deg, #1d4ed8, #1e40af);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #7c3aed);
    border-radius: 1px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  &::before {
    content: "📋";
    font-size: 24px;
  }
`;

const ModalBody = styled.div`
  display: grid;
  gap: 24px;
`;

const DetailSection = styled.div`
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8, #7c3aed);
    opacity: 0.7;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
`;

const DetailSectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #1e293b, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: "";
    width: 6px;
    height: 6px;
    background: linear-gradient(135deg, #3b82f6, #7c3aed);
    border-radius: 50%;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: linear-gradient(145deg, #fefefe, #f1f5f9);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
`;

const DetailLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2px;
`;

const DetailValue = styled.span`
  font-size: 15px;
  color: #1e293b;
  font-weight: 500;
  word-break: break-word;
  &.currency {
    font-weight: 600;
    color: #059669;
    font-size: 16px;
  }
`;

const ItemsSection = styled(DetailSection)`
  overflow-x: auto;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const ItemsTableHeader = styled.thead`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
`;

const ItemsTableRow = styled.tr`
  transition: all 0.2s ease;
  &:nth-child(even) { background-color: #f8fafc; }
  &:hover {
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    transform: scale(1.01);
  }
`;

const ItemsTableCell = styled.td`
  padding: 16px 20px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  &:first-child { font-weight: 500; color: #1f2937; }
`;

const ItemsTableHeaderCell = styled.th`
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const HistoryButton = styled(CustomButton)`
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: white;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  &:hover {
    background: linear-gradient(135deg, #6b21a8, #7c3aed);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }
`;

const HistoryModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const HistoryModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 95%;
  max-width: 1000px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const HistoryModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
`;

const HistoryModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  flex: 1;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HistoryTableHeader = styled.thead`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
`;

const HistoryTableHeaderCell = styled.th`
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  text-align: left;
`;

const HistoryTableRow = styled.tr`
  &:nth-child(even) { background-color: #f8fafc; }
  &:hover { background-color: #eff6ff; }
`;

const HistoryTableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  ${(props) =>
    props.isPriceColumn &&
    `
    font-weight: 600;
    position: relative;
    ${props.isHighPrice &&
      `
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #dc2626;
      &::after {
        content: '↑ HIGH';
        position: absolute;
        top: 2px;
        right: 4px;
        font-size: 9px;
        color: #dc2626;
        font-weight: bold;
      }
    `}
    ${props.isLowPrice &&
      `
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      color: #059669;
      &::after {
        content: '↓ LOW';
        position: absolute;
        top: 2px;
        right: 4px;
        font-size: 9px;
        color: #059669;
        font-weight: bold;
      }
    `}
  `}
`;

const PaymentModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const PaymentModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 95%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

const PaymentModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const PaymentModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PaymentInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PaymentLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const PaymentInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const PaymentSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const PaymentButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const MessGRNReport = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from_date: new Date().toISOString().split("T")[0],
    to_date: new Date().toISOString().split("T")[0],
    search: "",
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
    pending_amount: 0,
  });
  const [isPaymentDirty, setIsPaymentDirty] = useState(false);
  const navigate = useNavigate();
  
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // Payment Modal Handlers
  const handleOpenPaymentModal = (record) => {
    setPaymentDetails({
      grn_number: record.grn_number,
      amount_paid: "",
      payment_method: "",
      payment_details: "",
      pending_amount: parseFloat(record.pending_amount || record.total_amount || 0),
    });
    setSelectedRecord(record);
    setShowPaymentModal(true);
    setIsPaymentDirty(false); // Reset dirty state
  };

  const handlePaymentChange = (key, value) => {
    setPaymentDetails((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "amount_paid") {
        const amountPaid = parseFloat(value) || 0;
        const pending_amount = parseFloat(prev.total_pending_amount || 0);
      }
      return updated;
    });
    setIsPaymentDirty(true); // Mark as dirty on change
  };

const handlePaymentSubmit = async (e) => {
  e.preventDefault();
  if (!paymentDetails.amount_paid || parseFloat(paymentDetails.amount_paid) <= 0) {
    toast.error("Please enter a valid payment amount");
    return;
  }
  if (!paymentDetails.payment_method) {
    toast.error("Please select a payment method");
    return;
  }
  if (["UPI", "Cheque"].includes(paymentDetails.payment_method) && !paymentDetails.payment_details) {
    toast.error(`Please provide payment details (e.g., transaction ID or cheque number) for ${paymentDetails.payment_method}`);
    return;
  }
  if (parseFloat(paymentDetails.amount_paid) > parseFloat(selectedRecord.pending_amount || selectedRecord.total_amount)) {
    toast.error("Payment amount cannot exceed pending amount");
    return;
  }

  try {
    const encodedGrnNumber = encodeURIComponent(paymentDetails.grn_number);
    const currentUser = localStorage.getItem('username') || localStorage.getItem('user') || localStorage.getItem('name') || 'Unknown User';
const totalPaid = (parseFloat(selectedRecord.total_amount_paid) || 0) + (parseFloat(paymentDetails.amount_paid) || 0);

const pendingAmount = parseFloat(selectedRecord.total_amount) - totalPaid;

const payload = {
  amount_paid: parseFloat(paymentDetails.amount_paid),
  payment_method: paymentDetails.payment_method,
  payment_details: paymentDetails.payment_method === "Cash" ? null : paymentDetails.payment_details,
  status: pendingAmount <= 0 ? "Paid" : "Partially Paid",
  paid_by: currentUser,
  pending_amount: pendingAmount,
};


    const response = await apiRequest(
      `${StoreTrustbaseurl}Mess-in/update-payment-status/?grn_number=${encodedGrnNumber}`,
      "PATCH",
      payload
    );

    if (response.success && response.data.status === "success") {
      toast.success("Payment updated successfully");
      setShowPaymentModal(false);
      setIsPaymentDirty(false);
        fetchAllData();
      } else {
        toast.error(response.error || response.data?.message || "Failed to update payment");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Network error while updating payment");
    }
  };

  const handleClosePaymentModal = () => {
    if (isPaymentDirty && !window.confirm("You have unsaved changes. Are you sure you want to close?")) {
      return;
    }
    setShowPaymentModal(false);
    setIsPaymentDirty(false);
  };

const formatPaymentHistory = (paymentStatus) => {
  if (!Array.isArray(paymentStatus) || paymentStatus.length === 0) {
    return ["N/A", "N/A", "N/A"];
  }
  // Filter valid payments (with valid timestamp) and take the last 3
  const validPayments = paymentStatus
    .filter((payment) => payment.timestamp && new Date(payment.timestamp).toString() !== "Invalid Date")
    .slice(-3); // Get the last 3 valid entries
  // Format payments
const formattedPayments = validPayments.map((payment) => {
    const date = new Date(payment.timestamp).toISOString().split("T")[0]; // e.g., 2025-08-26
    const amount = formatCurrency(payment.amount_paid);
    const method = payment.payment_method || "N/A"; // Fallback if payment_method is missing
    return `Date: ${date}<br />Paid: ${amount}<br />Method: ${method}`;
  });
  // Fill remaining slots with "No payment" to ensure exactly 3 entries
  return [
    ...formattedPayments,
    ...Array(3 - formattedPayments.length).fill("N/A")
  ];
};

  // Fetch previous purchases
  const fetchPreviousPurchases = async (hsn, itemName) => {
    setHistoryLoading(true);
    try {
      console.log(`Fetching previous purchases for HSN: ${hsn}, Item: ${itemName}`);
      const encodedHsn = encodeURIComponent(hsn);
      const encodedItemName = encodeURIComponent(itemName);
      const url = `${StoreTrustbaseurl}Mess-in/previous-purchases/?hsn=${encodedHsn}&item_name=${encodedItemName}`;
      console.log("Request URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        console.error("HTTP error:", response.status, await response.text());
        toast.error("Failed to fetch purchase history");
        return [];
      }
      const data = await response.json();
      if (data.status === "success") {
        return data.data;
      }
      toast.error(data.message || "Failed to fetch purchase history");
      return [];
    } catch (error) {
      console.error("Network error fetching previous purchases:", error);
      toast.error("Network error while fetching purchase history");
      return [];
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleShowHistory = async (item) => {
    const hsn = item.hsn?.toString().trim();
    const itemName = item.name?.toString().trim();
    if (!hsn || !itemName) {
      toast.error("HSN and item name are required for history lookup");
      return;
    }
    setSelectedItemForHistory({ hsn, name: itemName });
    setShowHistoryModal(true);
    const history = await fetchPreviousPurchases(hsn, itemName);
    setHistoryData(history);
  };

  const fetchAllData = useCallback(async (page = 1, pageSize = 100) => {
    setLoading(true);
    try {
      const response = await apiRequest(
        `${StoreTrustbaseurl}Mess-in/list/?page=${page}&page_size=${pageSize}`,
        "GET"
      );
      if (!response.success) {
        throw new Error(response.error || "API request failed");
      }
      if (response.data?.status !== "success") {
        throw new Error(response.data?.message || "Backend returned an error");
      }
      if (!Array.isArray(response.data?.data)) {
        throw new Error("Invalid data format: Expected an array");
      }
      
      const activeRecords = response.data.data.filter(
        (record) => record.is_active === true
      );
      setAllData(activeRecords);
      console.log(response)
      setFilteredData(activeRecords);
      if (activeRecords.length === 0) {
        toast.info("No active records found");
      }

    } catch (error) {
      console.error("Error fetching GRN data:", error.message);
      toast.error(error.message || "Failed to fetch GRN records");
      setAllData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [StoreTrustbaseurl]);

  const applyFilters = useCallback(() => {
    let filtered = [...allData];
    if (filters.from_date) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        const fromDate = new Date(filters.from_date);
        return itemDate >= fromDate;
      });
    }
    if (filters.to_date) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        const toDate = new Date(filters.to_date);
        return itemDate <= toDate;
      });
    }
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.grn_number?.toLowerCase().includes(searchTerm) ||
          item.invoice_no?.toLowerCase().includes(searchTerm) ||
          item.vendor?.toLowerCase().includes(searchTerm) ||
          item.purchase_category?.toLowerCase().includes(searchTerm) ||
          item.payment_details?.status?.toLowerCase().includes(searchTerm)
      );
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [allData, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    applyFilters();
  };

  const clearFilters = () => {
    setFilters({
      from_date: "",
      to_date: "",
      search: "",
    });
    setFilteredData(allData);
    setCurrentPage(1);
  };

  const handleView = async (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleEdit = (record) => {
    console.log("Edit record:", record);
    // Implement edit functionality
    // Navigate to MessIN page with GRN number as a URL parameter
    navigate(`/MessIN/${record.grn_number}`);
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Are you sure you want to delete GRN: ${record.grn_number}?`)) {
      return;
    }
    try {
      const encodedGrnNumber = encodeURIComponent(record.grn_number);
      const response = await apiRequest(
        `${StoreTrustbaseurl}Mess-in/delete/?grn_number=${encodedGrnNumber}`,
        "PATCH",
        {}
      );
      if (response.success && response.data.status === "success") {
        toast.success("Record deleted successfully");
        fetchAllData();
      } else {
        toast.error(response.error || response.data?.message || "Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Network error while deleting record");
    }
  };

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
            <div class="address">GST Number :</div>
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
                  <span>Date : ${record.date ? new Date(record.date).toLocaleDateString() : "N/A"}</span>
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
                  <span>Invoice Date : ${record.invoice_date ? new Date(record.invoice_date).toLocaleDateString() : "N/A"}</span>
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
                  <span>Approved Date : ${record.date ? new Date(record.date).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
          ${record.items && record.items.length > 0
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
                  <td class="product-cell">${item.name || "N/A"}</td>
                  <td class="number-cell">${item.hsn || "N/A"}</td>
                  <td class="center-cell">${item.batch || "N/A"}</td>
                  <td class="center-cell">${item.packing || "1"}</td>
                  <td class="center-cell">${item.quantity || "N/A"}</td>
                  <td class="number-cell">₹${parseFloat(item.unitPrice || 0).toFixed(2)}</td>
                  <td class="number-cell">₹${parseFloat(item.purchaseCost || 0).toFixed(2)}</td>
                  <td class="number-cell">₹${parseFloat(item.discountedAmt || 0).toFixed(2)}</td>
                  <td class="number-cell">₹${parseFloat(item.itemValue || item.purchaseCost || 0).toFixed(2)}</td>
                  <td class="number-cell">₹${parseFloat(item.purchaseCost || 0).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
              <tr class="total-row">
                <td colspan="10" class="center-cell">Total</td>
                <td class="number-cell">₹${parseFloat(record.total_amount || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          `
            : ""}
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
            <div class="footer-item">
              <div class="label">Verified By : Administrator</div>
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
      "GRN Number",
      "Purchase Category",
      "Vendor",
      "Date",
      "Invoice No",
      "Invoice Date",
      "Payment Method",
      "Total Amount",
      "Payment Status",
      "Amount Paid",
      "Pending Amount",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.grn_number,
          row.purchase_category,
          row.vendor,
          new Date(row.date).toLocaleDateString(),
          row.invoice_no,
          new Date(row.invoice_date).toLocaleDateString(),
          row.payment_details?.payment_method || row.payment_method || "N/A",
          parseFloat(row.total_amount || 0).toFixed(2),
          row.payment_details?.status || row.payment_status || "N/A",
          parseFloat(row.payment_details?.amount_paid || 0).toFixed(2),
          parseFloat(row.payment_details?.pending_amount || row.pending_amount || 0).toFixed(2),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GRN_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("report-table").outerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>GRN Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .no-print { display: none; }
          </style>
        </head>
        <body>
          <h1>GRN Report</h1>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // HistoryModal Component
  const HistoryModal = ({ show, onClose, item, historyData, loading }) => {
    if (!show || !item) return null;

    const getPriceStats = () => {
      if (!historyData || historyData.length === 0) return { min: 0, max: 0, avg: 0 };
      const prices = historyData.map((historyItem) => {
        const itemData = historyItem.matched_item || {};
        return parseFloat(itemData.unitPrice || 0);
      });
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      return { min, max, avg };
    };

    const priceStats = getPriceStats();

    const calculateTotalStock = () => {
      if (!historyData || historyData.length === 0) return 0;
      return historyData.reduce((total, historyItem) => {
        const itemData = historyItem.matched_item || {};
        return total + parseInt(itemData.quantity || 0);
      }, 0);
    };

    const totalStock = calculateTotalStock();

    console.log("historyData:", historyData);

    return (
      <HistoryModalOverlay onClick={onClose}>
        <HistoryModalContent onClick={(e) => e.stopPropagation()}>
          <HistoryModalHeader>
            <HistoryModalTitle>
              Purchase History - {item.name} (HSN: {item.hsn}) - Total Stock: {totalStock}
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                Price Range: ₹{priceStats.min.toFixed(2)} - ₹{priceStats.max.toFixed(2)} | Avg: ₹{priceStats.avg.toFixed(2)}
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
          ) : historyData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              No previous purchase history found for this item.
            </div>
          ) : (
            <HistoryTable>
              <HistoryTableHeader>
                <HistoryTableRow>
                  <HistoryTableHeaderCell>GRN Number</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Date</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Vendor</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>HSN</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Item Name</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Unit Price</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Purchase Cost</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Quantity</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Free</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Stock</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Batch</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>MRP</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Payment Status</HistoryTableHeaderCell>
                  <HistoryTableHeaderCell>Amount Paid</HistoryTableHeaderCell>
                </HistoryTableRow>
              </HistoryTableHeader>
              <tbody>
                {historyData.map((historyItem, index) => {
                  const itemData = historyItem.matched_item || {};
                  const unitPrice = parseFloat(itemData.unitPrice || 0);
                  const isHighPrice = unitPrice === priceStats.max && priceStats.max > priceStats.min;
                  const isLowPrice = unitPrice === priceStats.min && priceStats.max > priceStats.min;

                  const paymentStatus = historyItem.payment_details?.status || "N/A";
                  const amountPaid = parseFloat(historyItem.payment_details?.amount_paid || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  });

                  return (
                    <HistoryTableRow key={index}>
                      <HistoryTableCell>{historyItem.grn_number || "N/A"}</HistoryTableCell>
                      <HistoryTableCell>{new Date(historyItem.date).toLocaleDateString("en-IN")}</HistoryTableCell>
                      <HistoryTableCell>{historyItem.vendor || "N/A"}</HistoryTableCell>
                      <HistoryTableCell>{itemData.hsn || "N/A"}</HistoryTableCell>
                      <HistoryTableCell>{itemData.name || "N/A"}</HistoryTableCell>
                      <HistoryTableCell isPriceColumn={true} isHighPrice={isHighPrice} isLowPrice={isLowPrice}>
                        ₹{unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        ₹{parseFloat(itemData.purchaseCost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </HistoryTableCell>
                      <HistoryTableCell>{itemData.quantity || "N/A"}</HistoryTableCell>
                      <HistoryTableCell>{itemData.free || "0"}</HistoryTableCell>
                      <HistoryTableCell>{itemData.quantity || "0"}</HistoryTableCell>
                      <HistoryTableCell>{itemData.batch || "-"}</HistoryTableCell>
                      <HistoryTableCell>
                        ₹{parseFloat(itemData.mrp || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </HistoryTableCell>
                      <HistoryTableCell>{paymentStatus}</HistoryTableCell>
                      <HistoryTableCell>₹{amountPaid}</HistoryTableCell>
                    </HistoryTableRow>
                  );
                })}
              </tbody>
            </HistoryTable>
          )}
        </HistoryModalContent>
      </HistoryModalOverlay>
    );
  };

  // EnhancedViewModal Component
  const EnhancedViewModal = ({ showModal, selectedRecord, onClose }) => {
    if (!showModal || !selectedRecord) return null;
    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalScrollContainer>
            <ModalHeader>
              <ModalTitle>GRN Details - {selectedRecord.grn_number || "N/A"}</ModalTitle>
              <CustomButton variant="cancel" onClick={onClose}>
                <X size={20} />
              </CustomButton>
            </ModalHeader>
            <ModalBody>
              {/* Basic Information */}
              <DetailSection>
                <DetailSectionTitle>📊 Basic Information</DetailSectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>GRN Number</DetailLabel>
                    <DetailValue>{selectedRecord.grn_number || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Purchase Category</DetailLabel>
                    <DetailValue>{selectedRecord.purchase_category || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Vendor</DetailLabel>
                    <DetailValue>{selectedRecord.vendor || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Date</DetailLabel>
                    <DetailValue>{formatDate(selectedRecord.date)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Contact Person</DetailLabel>
                    <DetailValue>{selectedRecord.contact_person || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Phone</DetailLabel>
                    <DetailValue>{selectedRecord.phone || "N/A"}</DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              {/* Invoice Information */}
              <DetailSection>
                <DetailSectionTitle>🧾 Invoice Information</DetailSectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Invoice Number</DetailLabel>
                    <DetailValue>{selectedRecord.invoice_no || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Invoice Date</DetailLabel>
                    <DetailValue>{formatDate(selectedRecord.invoice_date)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Credit Period</DetailLabel>
                    <DetailValue>{selectedRecord.credit_period || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Due Date</DetailLabel>
                    <DetailValue>{formatDate(selectedRecord.due_date)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Payment Method</DetailLabel>
                    <DetailValue>{selectedRecord.payment_details?.payment_method || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Payment Status</DetailLabel>
                    <DetailValue>
                      <CustomBadge status={selectedRecord.payment_details?.status || "N/A"}>
                        {selectedRecord.payment_details?.status || "N/A"}
                      </CustomBadge>
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Amount Paid</DetailLabel>
                    <DetailValue className="currency">
                      {formatCurrency(selectedRecord.payment_details?.amount_paid)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Pending Amount</DetailLabel>
                    <DetailValue className="currency">
                      {formatCurrency(selectedRecord.payment_details?.pending_amount || selectedRecord.pending_amount)}
                    </DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>

              {/* Financial Information */}
              <DetailSection>
                <DetailSectionTitle>💰 Financial Breakdown</DetailSectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Non-Taxable Amount</DetailLabel>
                    <DetailValue className="currency">
                      {formatCurrency(selectedRecord.non_taxable_amount)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Taxable Amount</DetailLabel>
                    <DetailValue className="currency">
                      {formatCurrency(selectedRecord.taxable_amount)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>CGST</DetailLabel>
                    <DetailValue className="currency">
                      {formatCurrency(selectedRecord.cgst)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>SGST</DetailLabel>
                    <DetailValue className="currency">
                      {formatCurrency(selectedRecord.sgst)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>IGST</DetailLabel>
                    <DetailValue className="currency">
                      {formatCurrency(selectedRecord.igst)}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "2px solid #0284c7", boxShadow: "0 8px 25px rgba(2, 132, 199, 0.15)" }}>
                    <DetailLabel style={{ color: "#0284c7", fontWeight: "bold" }}>Total Amount</DetailLabel>
                    <DetailValue style={{ fontSize: "18px", fontWeight: "700", color: "#0284c7" }}>
                      {formatCurrency(selectedRecord.total_amount)}
                    </DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>
              <DetailSection>
              
              
<ItemsSection>
  <DetailSectionTitle>📦 Items Details</DetailSectionTitle>
  <ItemsTable>
    <ItemsTableHeader>
      <ItemsTableRow>
        <ItemsTableHeaderCell>Item Name</ItemsTableHeaderCell>
        <ItemsTableHeaderCell>HSN</ItemsTableHeaderCell>
        <ItemsTableHeaderCell>Quantity</ItemsTableHeaderCell>
        <ItemsTableHeaderCell>Unit Cost</ItemsTableHeaderCell>
        <ItemsTableHeaderCell>Purchase Cost</ItemsTableHeaderCell>
        <ItemsTableHeaderCell>History</ItemsTableHeaderCell>
      </ItemsTableRow>
    </ItemsTableHeader>
    <tbody>
      {selectedRecord.items?.length > 0 ? (
        selectedRecord.items.map((item, index) => (
          <ItemsTableRow key={index}>
            <ItemsTableCell>{item.name || item.item_name || "N/A"}</ItemsTableCell>
            <ItemsTableCell>{item.hsn || item.hsn_code || "N/A"}</ItemsTableCell>
            <ItemsTableCell>{item.quantity || item.qty || "N/A"}</ItemsTableCell>
            <ItemsTableCell>{formatCurrency(item.unitPrice || item.unit_cost || 0)}</ItemsTableCell>
            <ItemsTableCell>{formatCurrency(item.purchaseCost || item.purchase_cost || 0)}</ItemsTableCell>
            <ItemsTableCell>
              <HistoryButton onClick={() => handleShowHistory(item)}>
                <History size={14} /> History
              </HistoryButton>
            </ItemsTableCell>
          </ItemsTableRow>
        ))
      ) : (
        <ItemsTableRow>
          <ItemsTableCell colSpan="6" style={{ textAlign: "center" }}>
            No items found
          </ItemsTableCell>
        </ItemsTableRow>
      )}
    </tbody>
  </ItemsTable>
</ItemsSection>

          
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>📝 Additional Details</DetailSectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Address</DetailLabel>
                    <DetailValue>{selectedRecord.address || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Remarks</DetailLabel>
                    <DetailValue>{selectedRecord.remarks || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Created By</DetailLabel>
                    <DetailValue>{selectedRecord.created_by || "N/A"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Created Date</DetailLabel>
                    <DetailValue>{formatDateTime(selectedRecord.created_date)}</DetailValue>
                  </DetailItem>
                </DetailGrid>
              </DetailSection>
            </ModalBody>
          </ModalScrollContainer>
        </ModalContent>
      </ModalOverlay>
    );
  };

  return (
    <Container>
      <Header>
        <Title>GRN Report</Title>
        <Subtitle>Manage and view all GRN records</Subtitle>
      </Header>
      <FiltersSection>
        <FiltersGrid>
          <FilterGroup>
            <Label>From Date</Label>
            <InputWrapper>
              <IconWrapper><Calendar /></IconWrapper>
              <Input
                type="date"
                value={filters.from_date}
                onChange={(e) => handleFilterChange("from_date", e.target.value)}
              />
            </InputWrapper>
          </FilterGroup>
          <FilterGroup>
            <Label>To Date</Label>
            <InputWrapper>
              <IconWrapper><Calendar /></IconWrapper>
              <Input
                type="date"
                value={filters.to_date}
                onChange={(e) => handleFilterChange("to_date", e.target.value)}
              />
            </InputWrapper>
          </FilterGroup>
          <FilterGroup>
            <Label>Search</Label>
            <InputWrapper>
              <IconWrapper><Search /></IconWrapper>
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
              <CustomButton variant="primary" onClick={handleSearch}>Search</CustomButton>
              <CustomButton variant="secondary" onClick={clearFilters}>Clear</CustomButton>
            </ButtonContainer>
          </ButtonGroup>
        </FiltersGrid>
      </FiltersSection>

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

      <TableContainer>
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading...</LoadingText>
          </LoadingContainer>
        ) : (
<TableWrapper>
  <Table id="report-table">
    <TableHeader>
      <TableHeaderRow>
        <TableHeaderCell>Date</TableHeaderCell>
        <TableHeaderCell>GRN Number</TableHeaderCell>
        <TableHeaderCell>Purchase Category</TableHeaderCell>
        <TableHeaderCell>Vendor</TableHeaderCell>
        <TableHeaderCell>Invoice No</TableHeaderCell>
        <TableHeaderCell>Total Amount</TableHeaderCell>
        <TableHeaderCell>Payment Status</TableHeaderCell>
        <TableHeaderCell>Payment 1</TableHeaderCell>
        <TableHeaderCell>Payment 2</TableHeaderCell>
        <TableHeaderCell>Payment 3</TableHeaderCell>
        <TableHeaderCell>Amount Paid</TableHeaderCell>
        <TableHeaderCell>Pending Amount</TableHeaderCell>
        <TableHeaderCell className="no-print">Actions</TableHeaderCell>
      </TableHeaderRow>
    </TableHeader>
    <TableBody>
      {currentData.length === 0 ? (
        <NoDataRow>
          <NoDataCell colSpan="12">No records found</NoDataCell>
        </NoDataRow>
      ) : (
        currentData.map((row, index) => {
          const [payment1, payment2, payment3] = formatPaymentHistory(row.payment_status);
          return (
            <TableRow key={row.grn_number || index}>
              <TableCell className="text-gray">{formatDate(row.date)}</TableCell>
              <TableCell className="font-medium">{row.grn_number || "N/A"}</TableCell>
              <TableCell className="text-gray">{row.purchase_category || "N/A"}</TableCell>
              <TableCell className="text-gray">{row.vendor || "N/A"}</TableCell>
              <TableCell className="text-gray">{row.invoice_no || "N/A"}</TableCell>
              <TableCell className="text-gray">{formatCurrency(row.total_amount)}</TableCell>
              <TableCell className="text-gray">
                <CustomBadge status={row.payment_details?.status || "N/A"}>
                  {row.payment_details?.status || "N/A"}
                </CustomBadge>
              </TableCell>
              <TableCell className="text-gray" dangerouslySetInnerHTML={{ __html: payment1 }} />
              <TableCell className="text-gray" dangerouslySetInnerHTML={{ __html: payment2 }} />
              <TableCell className="text-gray" dangerouslySetInnerHTML={{ __html: payment3 }} />
              <TableCell className="text-gray">{formatCurrency(row.total_amount_paid)}</TableCell>
              <TableCell className="text-gray">{formatCurrency(row.pending_amount)}</TableCell>
              <TableCell className="no-print">
                <ActionButton variant="view" onClick={() => handleView(row)}>
                  <Eye size={16} />
                </ActionButton>
                <ActionButton variant="edit" onClick={() => handleEdit(row)}>
                  <Edit3 size={16} />
                </ActionButton>
                <ActionButton variant="delete" onClick={() => handleDelete(row)}>
                  <Trash2 size={16} />
                </ActionButton>
                <ActionButton variant="pay" onClick={() => handleOpenPaymentModal(row)}>
                  <CreditCard size={16} />
                </ActionButton>
                <ActionButton variant="print" onClick={() => handleGRNPrint(row)}>
                  <Printer size={16} />
                </ActionButton>
              </TableCell>
            </TableRow>
          );
        })
      )}
    </TableBody>
  </Table>
</TableWrapper>

        )}
      </TableContainer>
      <PaginationSection>
        <PaginationLeft>
          <PaginationText>Rows per page:</PaginationText>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ padding: "4px", borderRadius: "4px", border: "1px solid #d1d5db" }}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </PaginationLeft>
        <PaginationRight>
          <PaginationControls>
            <PaginationButton
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </PaginationButton>
            <PaginationText>{currentPage} of {totalPages}</PaginationText>
            <PaginationButton
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </PaginationButton>
          </PaginationControls>
        </PaginationRight>
      </PaginationSection>

      <EnhancedViewModal
        showModal={showModal}
        selectedRecord={selectedRecord}
        onClose={() => setShowModal(false)}
      />

      <HistoryModal
        show={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        item={selectedItemForHistory}
        historyData={historyData}
        loading={historyLoading}
      />

      {showPaymentModal && (
        <PaymentModalOverlay onClick={handleClosePaymentModal}>
          <PaymentModalContent onClick={(e) => e.stopPropagation()}>
            <PaymentModalHeader>
              <PaymentModalTitle>Update Payment - {paymentDetails.grn_number}</PaymentModalTitle>
              <CustomButton variant="cancel" onClick={handleClosePaymentModal}>
                <X size={20} />
              </CustomButton>
            </PaymentModalHeader>
            <PaymentForm onSubmit={handlePaymentSubmit}>
              <PaymentInputWrapper>
                <PaymentLabel>Amount Paid</PaymentLabel>
                <PaymentInput
                  type="number"
                  value={paymentDetails.amount_paid}
                  onChange={(e) => handlePaymentChange("amount_paid", e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                                    step="0.01"
                  required
                />
              </PaymentInputWrapper>
              <PaymentInputWrapper>
                <PaymentLabel>Payment Method</PaymentLabel>
                <PaymentSelect
                  value={paymentDetails.payment_method}
                  onChange={(e) => handlePaymentChange("payment_method", e.target.value)}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </PaymentSelect>
              </PaymentInputWrapper>
              {["UPI", "Cheque", "Bank Transfer"].includes(paymentDetails.payment_method) && (
                <PaymentInputWrapper>
                  <PaymentLabel>
                    {paymentDetails.payment_method === "UPI"
                      ? "UPI Transaction ID"
                      : paymentDetails.payment_method === "Cheque"
                      ? "Cheque Number"
                      : "Transaction Details"}
                  </PaymentLabel>
                  <PaymentInput
                    type="text"
                    value={paymentDetails.payment_details}
                    onChange={(e) => handlePaymentChange("payment_details", e.target.value)}
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
              <PaymentInputWrapper>
                <PaymentLabel>Pending Amount</PaymentLabel>
                <PaymentInput
                  type="number"
                  value={paymentDetails.pending_amount.toFixed(2)}
                  readOnly
                  style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                />
              </PaymentInputWrapper>
              <PaymentButtonContainer>
                <CustomButton variant="cancel" onClick={handleClosePaymentModal}>
                  Cancel
                </CustomButton>
                <CustomButton
                  variant="primary"
                  type="submit"
                  disabled={!isPaymentDirty || !paymentDetails.amount_paid || !paymentDetails.payment_method}
                >
                  Submit Payment
                </CustomButton>
              </PaymentButtonContainer>
            </PaymentForm>
          </PaymentModalContent>
        </PaymentModalOverlay>
      )}
            {showModal && selectedRecord && (
        <EnhancedViewModal
          showModal={showModal}
          selectedRecord={selectedRecord}
          onClose={() => setShowModal(false)}
        />
      )}
      {/* History Modal */}
      <HistoryModal
        show={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setHistoryData([]);
          setSelectedItemForHistory(null);
        }}
        item={selectedItemForHistory}
        historyData={historyData}
        loading={historyLoading}
      />
    </Container>
  );
};

export default MessGRNReport;