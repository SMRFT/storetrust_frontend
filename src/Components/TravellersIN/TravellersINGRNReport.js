import React, { useState, useEffect, useCallback } from "react";
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
import { 
  HistoryModalOverlay, DetailValue, ModalOverlay, TableHeaderCell, TableCell, ActionButton,PaymentModalOverlay, PaymentInput, PaymentModalContent, CustomButton, PaymentLabel, PaymentInputWrapper, PaymentSelect, PaymentForm, PaymentModalTitle, PaymentModalHeader, PaginationButton, PaginationText, PaginationControls, PaginationRight, PaymentButtonContainer, PaginationLeft, TableActionButton, PaginationSection, TableRow, Td,Th, TableBody, NoDataRow, DetailLabel,DetailSection,DetailGrid,DetailItem,DetailRow,NoDataCell,CustomBadge,TableHeaderRow,TableHeader,Table,LoadingText,TableWrapper,LoadingSpinner,TableContainer,LoadingContainer,RecordsText,ButtonContainer,GreenButton,ButtonGroup,RecordsInfo,ActionsSection,Input,IconWrapper,InputWrapper,Label,FilterGroup,FiltersGrid,FiltersSection,Subtitle,ItemsTableRow,ItemsTableCell,ItemsTableHeaderCell,HistoryButton,ItemsTableHeader,ItemsTable,DetailSectionTitle,ItemsSection,ModalScrollContainer,ModalHeader,ModalTitle,ModalBody,ModalContent,Container,Header,Title,HistoryTableCell,HistoryTableHeaderCell,HistoryTableRow,HistoryTableHeader,HistoryTable,HistoryModalTitle,HistoryModalHeader,HistoryModalContent
} from "../StyledComponents";
import apiRequest from "../apiRequest";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

 // Update the formatDate function at the top of your component
const formatDate = (date) => {
  if (!date || new Date(date).toString() === "Invalid Date") {
    return "N/A";
  }
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`; // dd/mm/yyyy format
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



const GRNReport = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from_date: new Date().toISOString().split("T")[0],
    to_date: new Date().toISOString().split("T")[0],
    search: "",
    category: "ALL" // NEW: Added category filter
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

    const getCategoryTitle = () => {
    switch(filters.category) {
      case "TRAVELLERS IN CASH":
        return "Travellers IN Cash GRN Report";
      case "TRAVELLERS IN CREDIT":
        return "Travellers IN Credit GRN Report";
      default:
        return "Travellers INN GRN Report";
    }
  };
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
      `${StoreTrustbaseurl}travellers-in/update-payment-status/?grn_number=${encodedGrnNumber}`,
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
    console.log(
      `Fetching previous purchases for HSN: ${hsn}, Item: ${itemName}`
    );

    const encodedHsn = encodeURIComponent(hsn);
    const encodedItemName = encodeURIComponent(itemName);

    const url = `${StoreTrustbaseurl}travellers-in/previous-purchases/?hsn=${encodedHsn}&item_name=${encodedItemName}`;

    console.log("Request URL:", url);

    const result = await apiRequest(url, "GET");

    if (!result.success) {
      console.error("API error:", result.error);
      return [];
    }

    const data = result.data;
    console.log("Previous purchases response:", data);

    if (data.status === "success") {
      return data.data || [];
    } else {
      console.error("API error:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Unexpected error fetching previous purchases:", error);
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
        `${StoreTrustbaseurl}travellers-in/list/?page=${page}&page_size=${pageSize}`,
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
  (record) => record.is_active === true || record.is_active === "true" || record.is_active === 1
);

      setAllData(activeRecords);
      console.log("nn",response)
      console.log("activeRecords",activeRecords)
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
     // NEW: Apply category filter
    if (filters.category && filters.category !== "ALL") {
      filtered = filtered.filter((item) => 
        item.purchase_category?.toUpperCase() === filters.category
      );
    }
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

  // const handleSearch = () => {
  //   applyFilters();
  // };

  const clearFilters = () => {
    setFilters({
      from_date: "",
      to_date: "",
      search: "",
      category: "ALL"
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

  // Pass record as state instead of params
  navigate("/GRNGeneration", { state: { record } });
};


  const handleDelete = async (record) => {
    if (!window.confirm(`Are you sure you want to delete GRN: ${record.grn_number}?`)) {
      return;
    }
    try {
      const encodedGrnNumber = encodeURIComponent(record.grn_number);
      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-in/delete/?grn_number=${encodedGrnNumber}`,
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
                  <td class="product-cell">${item.name || "N/A"}</td>
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
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };


// Updated exportToExcel function
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
  const csvContent = [
    headers.join(","),
    ...filteredData.map((row) => {
      const [payment1] = formatPaymentHistory(row.payment_status);
      // Remove HTML tags from payment1
      const cleanPayment1 = payment1.replace(/<br\s*\/?>/gi, ' | ').replace(/<\/?[^>]+(>|$)/g, "");
      
      return [
        formatDate(row.date), // Now returns dd/mm/yyyy
        row.grn_number,
        row.vendor,
        row.invoice_no,
        parseFloat(row.total_amount || 0).toFixed(2),
        row.payment_details?.status || row.payment_status || "N/A",
        cleanPayment1,
        parseFloat(row.total_amount_paid || 0).toFixed(2),
        parseFloat(row.pending_amount || 0).toFixed(2),
      ].join(",");
    }),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const categoryName = filters.category === "ALL" ? "All" : filters.category.replace(/ /g, "_");
  a.download = `GRN_Report_${categoryName}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Updated handlePrint function
const handlePrint = () => {
  const printWindow = window.open("", "", "width=800,height=600");
  
  const tableRows = filteredData.map((row, index) => {
    const [payment1] = formatPaymentHistory(row.payment_status);
    return `
      <tr>
        <td style="white-space: nowrap;">${formatDate(row.date)}</td>
        <td style="white-space: nowrap;">${row.grn_number || "N/A"}</td>
        <td style="white-space: nowrap;">${row.vendor || "N/A"}</td>
        <td style="white-space: nowrap;">${row.invoice_no || "N/A"}</td>
        <td style="white-space: nowrap;">${formatCurrency(row.total_amount)}</td>
        <td style="white-space: nowrap;">${row.payment_details?.status || "N/A"}</td>
        <td>${payment1}</td>
        <td style="white-space: nowrap;">${formatCurrency(row.total_amount_paid)}</td>
        <td style="white-space: nowrap;">${formatCurrency(row.pending_amount)}</td>
      </tr>
    `;
  }).join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>${getCategoryTitle()}</title>
        <style>
          @page {
            size: auto;
            margin: 10mm;
          }
          
          body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 10px;
            font-size: 11px;
          }
          
          h1 {
            text-align: center;
            font-size: 16px;
            margin: 10px 0;
            word-wrap: break-word;
          }
          
          table { 
            border-collapse: collapse; 
            width: 100%; 
            table-layout: auto;
            font-size: 10px;
          }
          
          th, td { 
            border: 1px solid #ddd; 
            padding: 4px 6px; 
            text-align: left;
            vertical-align: top;
          }
          
          th { 
            background-color: #f2f2f2; 
            font-weight: bold;
            font-size: 10px;
            word-wrap: break-word;
          }
          
          td {
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          
          /* Landscape specific adjustments */
          @media print and (orientation: landscape) {
            body {
              font-size: 10px;
            }
            table {
              font-size: 9px;
            }
            th, td {
              padding: 3px 4px;
            }
          }
          
          /* Portrait specific adjustments */
          @media print and (orientation: portrait) {
            body {
              font-size: 9px;
            }
            table {
              font-size: 8px;
            }
            th, td {
              padding: 2px 3px;
            }
            h1 {
              font-size: 14px;
            }
          }
          
          @media print {
            body { 
              margin: 0;
              padding: 5px;
            }
            .no-print { 
              display: none; 
            }
            table {
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
          }
        </style>
      </head>
      <body>
        <h1>${getCategoryTitle()}</h1>
        <table>
          <thead>
            <tr>
              <th style="white-space: nowrap;">Date</th>
              <th style="white-space: nowrap;">GRN Number</th>
              <th style="white-space: nowrap;">Vendor</th>
              <th style="white-space: nowrap;">Invoice No</th>
              <th style="white-space: nowrap;">Total Amount</th>
              <th style="white-space: nowrap;">Payment Status</th>
              <th style="white-space: nowrap;">Advance</th>
              <th style="white-space: nowrap;">Amount Paid</th>
              <th style="white-space: nowrap;">Pending Amount</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
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
        return total + parseInt(itemData.totalstock || 0);
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
                  {/* <HistoryTableHeaderCell>Payment Status</HistoryTableHeaderCell> */}
                  {/* <HistoryTableHeaderCell>Amount Paid</HistoryTableHeaderCell> */}
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
                      <HistoryTableCell>{historyItem.vendor_name || "N/A"}</HistoryTableCell>
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
                      <HistoryTableCell>{itemData.totalstock || "0"}</HistoryTableCell>
                      <HistoryTableCell>{itemData.batch || "-"}</HistoryTableCell>
                      <HistoryTableCell>
                        ₹{parseFloat(itemData.mrp || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </HistoryTableCell>
                      {/* <HistoryTableCell>{paymentStatus}</HistoryTableCell> */}
                      {/* <HistoryTableCell>₹{amountPaid}</HistoryTableCell> */}
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
  const EnhancedViewModal = ({ showModal, selectedRecord, onClose, onShowHistory }) => {
    if (!showModal || !selectedRecord) return null;
    return (
     <ModalOverlay onClick={onClose} style={{ zIndex: 100 }}>
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
  <DetailValue>
    {[
      selectedRecord.addressLine1,
      selectedRecord.addressLine2,
      selectedRecord.city,
      selectedRecord.state,
      selectedRecord.address,
    ]
      .filter(Boolean)
      .join(", ")
      .replace(/, /g, ",\n") || "N/A"}
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
        <Title>{getCategoryTitle()}</Title>
        {/* <Subtitle>Manage and view all GRN records</Subtitle> */}
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
           {/* NEW: Category Dropdown */}
          <FilterGroup>
            <Label>Purchase Category</Label>
            <InputWrapper>
              <PaymentSelect
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="TRAVELLERS IN CASH">TRAVELLERS IN CASH</option>
                <option value="TRAVELLERS IN CREDIT">TRAVELLERS IN CREDIT</option>
              </PaymentSelect>
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
              {/* <CustomButton variant="primary" onClick={handleSearch}>Search</CustomButton> */}
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
    <thead>
      <TableRow>
        <Th style={{whiteSpace:"nowrap"}}>Date</Th>
        <Th style={{whiteSpace:"nowrap"}}>GRN Number</Th>
        <Th style={{whiteSpace:"nowrap"}}>Purchase Category</Th>
        <Th style={{whiteSpace:"nowrap"}}>Vendor</Th>
        <Th style={{whiteSpace:"nowrap"}}>Invoice No</Th>
        <Th style={{whiteSpace:"nowrap"}}>Total Amount</Th>
        <Th style={{whiteSpace:"nowrap"}}>Payment Status</Th>
        <Th style={{whiteSpace:"nowrap"}}>Advance</Th>
        {/* <Th style={{whiteSpace:"nowrap"}}>Payment 2</Th>
        <Th style={{whiteSpace:"nowrap"}}>Payment 3</Th> */}
        <Th style={{whiteSpace:"nowrap"}}>Amount Paid</Th>
        <Th style={{whiteSpace:"nowrap"}}>Pending Amount</Th>
           <Th className="no-print" style={{whiteSpace:"nowrap"}}>Actions</Th>
      </TableRow>
    </thead>
    <TableBody>
      {currentData.length === 0 ? (
        <TableRow>
          <Td colSpan="13">No records found</Td>
        </TableRow>
      ) : (
        currentData.map((row, index) => {
          const [payment1, payment2, payment3] = formatPaymentHistory(row.payment_status);
          return (
            <TableRow key={row.grn_number || index}>
              <Td style={{whiteSpace:"nowrap"}}>{formatDate(row.date)}</Td>
              <Td>{row.grn_number || "N/A"}</Td>
              <Td>{row.purchase_category || "N/A"}</Td>
              <Td>{row.vendor || "N/A"}</Td>
              <Td>{row.invoice_no || "N/A"}</Td>
              <Td>{formatCurrency(row.total_amount)}</Td>
              <Td style={{whiteSpace:"nowrap"}}>
                <CustomBadge status={row.payment_details?.status || "N/A"}>
                  {row.payment_details?.status || "N/A"}
                </CustomBadge>
              </Td>
              <Td dangerouslySetInnerHTML={{ __html: payment1 }} />
              {/* <Td dangerouslySetInnerHTML={{ __html: payment2 }} />
              <Td dangerouslySetInnerHTML={{ __html: payment3 }} /> */}
              <Td>{formatCurrency(row.total_amount_paid)}</Td>
              <Td>{formatCurrency(row.pending_amount)}</Td>
              <Td className="no-print" style={{whiteSpace:"nowrap"}}>
                <TableActionButton onClick={() => handleView(row)}><Eye size={16} /></TableActionButton>
                <TableActionButton onClick={() => handleEdit(row)}><Edit3 size={16} /></TableActionButton>
                <TableActionButton onClick={() => handleDelete(row)}><Trash2 size={16} /></TableActionButton>
                <TableActionButton onClick={() => handleOpenPaymentModal(row)}><CreditCard size={16} /></TableActionButton>
                <TableActionButton onClick={() => handleGRNPrint(row)}><Printer size={16} /></TableActionButton>
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
  onShowHistory={handleShowHistory} // pass handler
/>

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
  style={{ zIndex: 200 }} // always higher than EnhancedViewModal
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

export default GRNReport;