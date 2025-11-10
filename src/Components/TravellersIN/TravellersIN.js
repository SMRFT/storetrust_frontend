import React, { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X, History } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { useLocation,useNavigate, useParams } from "react-router-dom";

import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaChevronDown } from "react-icons/fa"; 
import apiRequest from "../apiRequest";
import styled from "styled-components";
import {
  Card, CardHeader, FormGroup, Label, Header, Input, Td, Th, TableHeaderRow, TableHeader, TableContainer, TableRow, TableCell, Modal, ModalBody, ModalFooter, ModalHeader, Required, AddButton, Select, HistoryModalOverlay, HistoryModalContent, HistoryModalTitle, HistoryModalHeader, CloseButton,LoadingSpinner, LoadingText, HistoryTable, HistoryTableHeader, HistoryTableRow, HistoryTableHeaderCell, HistoryTableCell, Container, MaxWidthContainer, Title, FormGrid, HeaderSection, PrimaryButton, Table, TableHeaderCell, EmptyState, ActionButtons, WarningButton, DangerButton, TextArea, ActionSection, SecondaryButton, SuccessButton, ModalContent, ModalRowGrid, RowLabel, TaxRowGrid, SmallModalContent, InvoiceModal, InvoiceContent, InvoiceHeader, InvoiceBody,InvoiceTitle, InvoiceDetailsGrid, InvoiceTable, InvoiceSummary, InvoiceFooter, InvoiceModalFooter, InvoiceSecondaryButton, InvoicePrimaryButton,  
 } from "../StyledComponents";


export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  th {
    background-color: #6a1b3f;
    color: white;
    font-weight: 600;
    text-align: left;
    padding: 12px;
    font-size: 14px;
    white-space: nowrap;
  }
  td {
    padding: 10px;
    font-size: 14px;
    border-bottom: 1px solid #eaeaea;
    text-align: left;
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  tr:hover {
    background-color: #f1f1f1;
  }
  button {
    margin: 0 4px;
    padding: 6px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: none;
    font-size: 16px;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.7;
    }
    
    &.edit-btn {
      color: #2563eb; /* blue */
    }
    
    &.delete-btn {
      color: #dc2626; /* red */
    }
  }
`;


/* Empty state */
export const EmptyRow = styled.td`
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: #666;
`;

const TravellersIN = () => {

 const location = useLocation();
  const navigate = useNavigate();
  // :white_check_mark: Safely access record from navigation state
  const record = location.state?.record || null;
  console.log("record",record)
  const grn_number = record?.grn_number || null;
  console.log("Received record:", grn_number);

  const [formData, setFormData] = useState({
    purchaseCategory: "",
    vendor: "",
    vendor_id: "",
    date: new Date().toISOString().split("T")[0], // Current date
    supplierAddress: "",
    contactPerson: "",
    phone: "",
    invoiceNo: "",
    invoiceDate: "",
    creditPeriod: "",
    dueDate: "",
    paymentMode: "CHEQUE",
  });

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [items, setItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [loading, setLoading] = useState(false);
const token = localStorage.getItem("token");
const userId = localStorage.getItem("employeeId");
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const result = await apiRequest(
        `${StoreTrustbaseurl}vendors/list/`,
        "GET"
      );

      if (result.success) {
        setVendors(result.data || []);
      } else {
        console.error("Failed to fetch vendors:", result.error);
        toast.error("Failed to load vendors");
        setVendors([]);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Error loading vendors");
      setVendors([]);
    } finally {
      setLoadingVendors(false);
    }
  };

  // Fetch vendors on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const result = await apiRequest(`${StoreTrustbaseurl}items/list/`, "GET");

      if (result.success) {
        setAvailableItems(result.data || []);
      } else {
        console.error("Failed to fetch items:", result.error);
        toast.error("Failed to load items");
        setAvailableItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Error loading items");
      setAvailableItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  // Add these navigation functions
  const handleAddVendor = () => {
    navigate("/AddVendor");
  };

  const handleAddItems = () => {
    navigate("/AddItems");
  };

  // Modal form state
  const [modalForm, setModalForm] = useState({
    name: "",
    hsn: "",
    batch: "",
    expiry: "",
    packing: "",
    noOfUnit: "",
    quantity: "",
    free: "",
    totalstock: "", // Add this field
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
  });

  // Summary state
  const [summary, setSummary] = useState({
    nonTaxableAmount: 0.0,
    taxableAmount: 0.0,
    taxPaidToSupplier: 0.0,
    localTax: 0.0,
    remarks: "",
    cgst: 0.0,
    sgst: 0.0,
    igst: 0.0,
    cess: 0.0,
    centralSalesTax: 0.0,
    roundAmount: 0.0,
    totalAmount: 0.0,
    taxOnFreeItems: 0.0,
    totalDiscount: 0.0,
    netInvoiceAmount: 0.0,
    quotationRate: 0.0,
    courierTransportCharge: 0.0,
  });

//  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const calculateSummary = () => {
      // Helper to round to 2 decimal places
      const round = (value) => Math.round((parseFloat(value) || 0) * 100) / 100;

      // Calculate totals from items
      const totalItemValue = round(
        items.reduce((sum, item) => sum + (parseFloat(item.itemValue) || 0), 0)
      );
      const totalPurchaseCost = round(
        items.reduce(
          (sum, item) => sum + (parseFloat(item.purchaseCost) || 0),
          0
        )
      );
      const totalCGST = round(
        items.reduce((sum, item) => sum + (parseFloat(item.cgstAmt) || 0), 0)
      );
      const totalSGST = round(
        items.reduce((sum, item) => sum + (parseFloat(item.sgstAmt) || 0), 0)
      );
      const totalDiscount = round(
        items.reduce(
          (sum, item) => sum + (parseFloat(item.discountedAmt) || 0),
          0
        )
      );

      // Calculate derived values
      const taxPaidToSupplier = round(totalCGST + totalSGST);
      const baseNetAmount = round(
        totalPurchaseCost +
          round(summary.taxOnFreeItems || 0) +
          round(summary.courierTransportCharge || 0) +
          round(summary.localTax || 0) -
          totalDiscount
      );
      const netInvoiceAmount = round(
        baseNetAmount + round(summary.roundAmount || 0)
      );

      setSummary((prev) => ({
        ...prev,
        nonTaxableAmount: totalItemValue,
        taxableAmount: totalPurchaseCost,
        cgst: totalCGST,
        sgst: totalSGST,
        totalAmount: totalPurchaseCost,
        totalDiscount: totalDiscount,
        taxPaidToSupplier: taxPaidToSupplier,
        netInvoiceAmount: netInvoiceAmount,
      }));
    };

    calculateSummary();
  }, [
    items,
    summary.taxOnFreeItems,
    summary.courierTransportCharge,
    summary.localTax,
    summary.roundAmount,
  ]);
useEffect(() => {
    if (record) {
      console.log("Using record from state:", record);
      setFormData({
        purchaseCategory: record.purchase_category || "",
        vendor: record.vendor|| "",
        vendor_id: record.vendor_id || "",
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
      setItems(record.items || []);
    } else if (grn_number) {
      // Optional: fetch via GET endpoint if you want reload support
      const fetchRecord = async () => {
        try {
          setLoading(true);
          const result = await apiRequest(
            `${StoreTrustbaseurl}travellers-in/${grn_number}/`,
            "GET"
          );
          if (result.success) {
            const data = result.data.data;
            setFormData({
              purchaseCategory: data.purchase_category || "",
              vendor: data.vendor || "",
              vendor_id: data.vendor_id || "",
              date: data.date || new Date().toISOString().split("T")[0],
              supplierAddress: data.address || "",
              contactPerson: data.contact_person || "",
              phone: data.phone || "",
              invoiceNo: data.invoice_no || "",
              invoiceDate: data.invoice_date || "",
              creditPeriod: data.credit_period || "",
              dueDate: data.due_date || "",
              paymentMode: data.payment_mode || "CHEQUE",
            });
            setItems(data.items || []);
          } else {
            toast.error("Failed to load record for editing");
          }
        } catch (error) {
          console.error("Error fetching record:", error);
          toast.error("Failed to load record");
        } finally {
          setLoading(false);
        }
      };
      fetchRecord();
    }
  }, [record, grn_number, StoreTrustbaseurl]);

  const handleInputChange = (e, section = "form") => {
    const { name, value } = e.target;
    if (section === "form") {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Auto-fill vendor details when vendor is selected
      if (name === "vendor" && value) {
        const selectedVendor = vendors.find((vendor) => vendor.name === value);
        if (selectedVendor) {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
            supplierAddress: `${selectedVendor.addressLine1 || ""}, ${
              selectedVendor.addressLine2 || ""
            }, ${selectedVendor.city || ""}, ${selectedVendor.state || ""}, ${
              selectedVendor.pincode || ""
            }`.trim(),
            contactPerson: selectedVendor.contactPerson || "",
            phone: selectedVendor.phone || "",
            vendor_id: selectedVendor.vendor_id || "",
          }));
        }
      }
    } else if (section === "modal") {
      setModalForm((prev) => ({ ...prev, [name]: value }));
    } else if (section === "summary") {
      setSummary((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }
  };
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item.id);
      setModalForm(item);
    } else {
      setEditingItem(null);
      setModalForm({
        name: "",
        hsn: "",
        batch: "",
        expiry: "",
        packing: "",
        noOfUnit: "",
        quantity: "",
        itemValue: "",
        packingPrice: "",
        unitPrice: "",
        free: "",
        totalstock: "", // Add this field
        pRate: "",
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
      });
    }
    setShowModal(true);
  };

  
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };
const handleModalInputChange = (e) => {
  const { name, value } = e.target;

  // Handle item name selection
  if (name === "name") {
    // ✅ Filter out items without HSN before finding
    const filteredItems = availableItems.filter(
      (item) => item.hsn && item.hsn.trim() !== "" // ✅ only items with valid HSN appear in dropdown
    );

    const selectedItem = filteredItems.find((item) => item.itemName === value);

    if (selectedItem) {
      setModalForm((prev) => ({
        ...prev,
        name: value,
        hsn: selectedItem.hsn || "", // Auto-fill HSN
      }));
      return;
    } else {
      setModalForm((prev) => ({         ...prev,
        name: value,
        hsn: "",}));
      return;
    }
  }

  if (name === "tax") {
    handleTaxChange(e);
    return;
  }

    if (name === "tax") {
      handleTaxChange(e);
      return;
    }

    setModalForm((prev) => {
      const updatedForm = { ...prev, [name]: value };

      // Parse numeric values
      const packing = parseFloat(updatedForm.packing) || 0;
      const noOfUnit = parseFloat(updatedForm.noOfUnit) || 0;
      const packingPrice = parseFloat(updatedForm.packingPrice) || 0;
      const itemValue = parseFloat(updatedForm.itemValue) || 0;
      const cgstPercent = parseFloat(updatedForm.cgstPercent) || 0;
      const sgstPercent = parseFloat(updatedForm.sgstPercent) || 0;
      const purchaseDiscountPercent =
        parseFloat(updatedForm.purchaseDiscountPercent) || 0;
      const quantity = parseFloat(updatedForm.quantity) || 0;
      const free = parseFloat(updatedForm.free) || 0;

      // 1. Calculate Quantity: Packing × No of Unit
      if (name === "packing" || name === "noOfUnit") {
        updatedForm.quantity = (packing * noOfUnit).toString();
      }

      // Calculate totalstock: Quantity + Free
      const currentQuantity = parseFloat(updatedForm.quantity) || 0;
      const currentFree = parseFloat(updatedForm.free) || 0;
      updatedForm.totalstock = (currentQuantity + currentFree).toString();

      // 2. Calculate Item Value: Packing Price × No of Unit
      if (name === "packingPrice" || name === "noOfUnit") {
        const calculatedItemValue = packingPrice * noOfUnit;
        updatedForm.itemValue = calculatedItemValue.toFixed(2);

        // Also calculate unit price when item value changes
        const quantity = parseFloat(updatedForm.quantity) || 0;
        if (quantity > 0) {
          updatedForm.unitPrice = (calculatedItemValue / quantity).toFixed(2);
        }
      }

      // 3. Calculate Packing Price and Unit Price when Item Value changes
      if (name === "itemValue") {
        if (noOfUnit > 0) {
          updatedForm.packingPrice = (itemValue / noOfUnit).toFixed(2);
        }

        const quantity = parseFloat(updatedForm.quantity) || 0;
        if (quantity > 0) {
          updatedForm.unitPrice = (itemValue / quantity).toFixed(2);
        }
      }

      // 4. Calculate CGST and SGST amounts
      const currentItemValue = parseFloat(updatedForm.itemValue) || 0;
      if (currentItemValue > 0) {
        updatedForm.cgstAmt = ((currentItemValue * cgstPercent) / 100).toFixed(
          2
        );
        updatedForm.sgstAmt = ((currentItemValue * sgstPercent) / 100).toFixed(
          2
        );
      }

      // 5. Calculate Purchase Cost: Item Value + CGST Amt + SGST Amt
      const cgstAmt = parseFloat(updatedForm.cgstAmt) || 0;
      const sgstAmt = parseFloat(updatedForm.sgstAmt) || 0;
      let purchaseCost = currentItemValue + cgstAmt + sgstAmt;

      // 6. Calculate Discount and adjust Purchase Cost
      let discountedAmt = 0;
      let basePurchaseCost = purchaseCost; // Store original purchase cost before discount

      // If discount percentage is entered, calculate discount amount
      if (name === "purchaseDiscountPercent") {
        if (purchaseDiscountPercent > 0 && purchaseCost > 0) {
          discountedAmt = (purchaseCost * purchaseDiscountPercent) / 100;
          updatedForm.discountedAmt = discountedAmt.toFixed(2);
          // Final purchase cost = base cost - discount amount
          purchaseCost = basePurchaseCost - discountedAmt;
        } else {
          updatedForm.discountedAmt = "0";
          purchaseCost = basePurchaseCost; // No discount applied
        }
      }

      // If discount amount is entered directly
      else if (name === "discountedAmt") {
        const enteredDiscountAmt = parseFloat(value) || 0;
        if (enteredDiscountAmt > 0 && basePurchaseCost > 0) {
          // Calculate discount percentage based on original purchase cost
          const calculatedDiscountPercent =
            (enteredDiscountAmt / basePurchaseCost) * 100;
          updatedForm.purchaseDiscountPercent =
            calculatedDiscountPercent.toFixed(2);
          // Final purchase cost = base cost - entered discount amount
          purchaseCost = basePurchaseCost - enteredDiscountAmt;
        } else {
          updatedForm.purchaseDiscountPercent = "0";
          purchaseCost = basePurchaseCost; // No discount applied
        }
      }

      // For other field changes, use existing discount values
      else {
        const existingDiscountAmt = parseFloat(updatedForm.discountedAmt) || 0;
        const existingDiscountPercent =
          parseFloat(updatedForm.purchaseDiscountPercent) || 0;

        // If discount percentage exists, recalculate discount amount based on new purchase cost
        if (existingDiscountPercent > 0) {
          discountedAmt = (basePurchaseCost * existingDiscountPercent) / 100;
          updatedForm.discountedAmt = discountedAmt.toFixed(2);
          purchaseCost = basePurchaseCost - discountedAmt;
        }
        // If only discount amount exists, maintain it and recalculate percentage
        else if (existingDiscountAmt > 0) {
          const calculatedDiscountPercent =
            (existingDiscountAmt / basePurchaseCost) * 100;
          updatedForm.purchaseDiscountPercent =
            calculatedDiscountPercent.toFixed(2);
          purchaseCost = basePurchaseCost - existingDiscountAmt;
        }
      }

      // Set final purchase cost (after discount)
      // Set final purchase cost (after discount)
updatedForm.purchaseCost = purchaseCost.toFixed(2);

// ✅ Calculate Unit Cost (with GST)
// ✅ Always recalculate Unit Cost whenever Purchase Cost changes
// ✅ Always recalculate Unit Cost whenever Purchase Cost changes (after tax or discount)
const qty = parseFloat(updatedForm.quantity) || 0;
const purchaseCostFinal = parseFloat(updatedForm.purchaseCost) || 0;

if (qty > 0) {
  updatedForm.unitCostWithGst = (purchaseCostFinal / qty).toFixed(2);
} else {
  updatedForm.unitCostWithGst = "0.00";
}


      return updatedForm;
    });
  };

  // Enhanced handleTaxChange to trigger calculations
const handleTaxChange = (e) => {
  const taxValue = parseFloat(e.target.value) || 0;
  const cgstValue = taxValue / 2;
  const sgstValue = taxValue / 2;

  setModalForm((prev) => {
    const updatedForm = {
      ...prev,
      tax: taxValue.toString(),
      cgstPercent: cgstValue.toString(),
      sgstPercent: sgstValue.toString(),
    };

    // ✅ Calculate CGST & SGST
    const itemValue = parseFloat(updatedForm.itemValue) || 0;
    if (itemValue > 0) {
      updatedForm.cgstAmt = ((itemValue * cgstValue) / 100).toFixed(2);
      updatedForm.sgstAmt = ((itemValue * sgstValue) / 100).toFixed(2);

      const cgstAmt = parseFloat(updatedForm.cgstAmt) || 0;
      const sgstAmt = parseFloat(updatedForm.sgstAmt) || 0;

      // ✅ Recalculate Purchase Cost (Item + Tax)
      let purchaseCost = itemValue + cgstAmt + sgstAmt;

      // ✅ Apply discount if exists
      const discountPercent =
        parseFloat(updatedForm.purchaseDiscountPercent) || 0;
      if (discountPercent > 0) {
        const discountedAmt = (purchaseCost * discountPercent) / 100;
        updatedForm.discountedAmt = discountedAmt.toFixed(2);
        purchaseCost -= discountedAmt;
      }

      updatedForm.purchaseCost = purchaseCost.toFixed(2);

      // ✅ ALSO update Unit Cost (with GST)
      const qty = parseFloat(updatedForm.quantity) || 0;
      if (qty > 0) {
        updatedForm.unitCostWithGst = (purchaseCost / qty).toFixed(2);
      } else {
        updatedForm.unitCostWithGst = "0.00";
      }
    }

    return updatedForm;
  });
};

const handleEditItem = (id) => {
  const itemToEdit = items.find((item) => item.id === id);
  if (!itemToEdit) return;

  setEditingItem(id);          // Track which item is being edited
  setModalForm({ ...itemToEdit }); // Fill modal form with item data
  setShowModal(true);          // Open modal
};


  const handleAddItem = () => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem ? { ...modalForm, id: editingItem } : item
        )
      );
    } else {
      setItems((prev) => [...prev, { ...modalForm, id: Date.now() }]);
    }
    closeModal();
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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

    const convertToWords = (num) => {
      if (num === 0) return "";
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
        );
      if (num < 1000)
        return (
          ones[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 ? " " + convertToWords(num % 100) : "")
        );
      if (num < 100000)
        return (
          convertToWords(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 ? " " + convertToWords(num % 1000) : "")
        );
      if (num < 10000000)
        return (
          convertToWords(Math.floor(num / 100000)) +
          " Lakh" +
          (num % 100000 ? " " + convertToWords(num % 100000) : "")
        );
      return (
        convertToWords(Math.floor(num / 10000000)) +
        " Crore" +
        (num % 10000000 ? " " + convertToWords(num % 10000000) : "")
      );
    };

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let result = "Rupee(s) " + convertToWords(rupees);
    if (paise > 0) {
      result += " and " + convertToWords(paise) + " Paise";
    }
    result += " Only /-";

    return result;
  };

  // Update your handleSubmit function
  
  const handleSubmit = async () => {
    try {
      // Validate required fields before showing preview
      const requiredFields = {
        invoiceNo: "Invoice Number",
        purchaseCategory: "Purchase Category",
      };

      const missingFields = [];
      for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field] || formData[field].trim() === "") {
          missingFields.push(label);
        }
      }

      if (missingFields.length > 0) {
        alert(
          `Please fill in the following required fields: ${missingFields.join(
            ", "
          )}`
        );
        return;
      }

      // Show invoice preview instead of direct submission
      setShowInvoicePreview(true);
    } catch (error) {
      console.error("Validation error:", error);
      alert("Error occurred during validation. Please try again.");
    }
  };

  // Add this new function to handle actual submission
  const handleConfirmSubmit = async () => {
    try {
      // Format dates to YYYY-MM-DD if they exist
      const formatDate = (dateString) => {
        if (!dateString) return "";

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return dateString;
        }

        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          return date.toISOString().split("T")[0];
        } catch (error) {
          console.warn("Date formatting error:", error);
          return "";
        }
      };

      const submitData = {
        ...formData,
        invoiceDate: formatDate(formData.invoiceDate),
        dueDate: formatDate(formData.dueDate),
        date: formatDate(
          formData.date || new Date().toISOString().split("T")[0]
        ),

        vendor_id: formData.vendor_id?.trim() || null,
        invoiceNo: formData.invoiceNo?.trim() || null,
        purchaseCategory: formData.purchaseCategory?.trim() || null,

        items: items || [],
        summary: summary || {},
        created_date: new Date().toISOString(),
        lastmodified_date: new Date().toISOString(),
      };

      console.log("Submitting data:", submitData);

      // Use apiRequest instead of fetch
    let result;

    if (grn_number) {
      // ✅ Update existing record
      result = await apiRequest(
  `${StoreTrustbaseurl}travellers-in/${encodeURIComponent(grn_number)}/update/`,
  "PATCH",
  submitData
);

    } else {
      // ✅ Create new record
      result = await apiRequest(
        `${StoreTrustbaseurl}travellers-in/`,
        "POST",
        submitData
      );
    }

      if (result.success) {
        toast.success("Data submitted successfully!");
        setShowInvoicePreview(false);
        confirmCancel(); // Reset form after successful submission
      } else {
        // Handle different types of errors
        if (result.data?.errors) {
          const errorMessages = [];
          for (const [field, messages] of Object.entries(result.data.errors)) {
            errorMessages.push(`${field}: ${messages.join(", ")}`);
          }
          toast.error(`Validation errors:\n${errorMessages.join("\n")}`);
        } else {
          toast.error(result.error || "Unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  const handleCancel = () => {
    setShowConfirmDialog(true);
  };

  const confirmCancel = () => {
    // Reset all forms
    setFormData({
      purchaseCategory: "",
      vendor: "",
      vendor_id: "",
      date: "",
      supplierAddress: "",
      contactPerson: "",
      phone: "",
      invoiceNo: "",
      invoiceDate: "",
      creditPeriod: "",
      dueDate: "",
      paymentMode: "CHEQUE",
    });
    setItems([]);
    setSummary({
      nonTaxableAmount: 0.0,
      taxableAmount: 0.0,
      taxPaidToSupplier: 0.0,
      localTax: 0.0,
      remarks: "",
      cgst: 0.0,
      sgst: 0.0,
      igst: 0.0,
      cess: 0.0,
      centralSalesTax: 0.0,
      roundAmount: 0.0,
      totalAmount: 0.0,
      taxOnFreeItems: 0.0,
      totalDiscount: 0.0,
      netInvoiceAmount: 0.0,
      quotationRate: 0.0,
      courierTransportCharge: 0.0,
    });
    setShowConfirmDialog(false);
  };

const VendorDropdown = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Keep input in sync with parent formData.vendor
  useEffect(() => {
    if (formData.vendor && formData.vendor !== searchTerm) {
      setSearchTerm(formData.vendor);
    }
  }, [formData.vendor]); // when parent updates, sync local value

  // Filter vendors by search term
  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // When user types
  const handleInputChangeLocal = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // update input field
    setDropdownOpen(true);
  };

  // When user selects a vendor
  const handleSelectOption = (vendor) => {
    setSearchTerm(vendor.name); // show selected name in input
    setDropdownOpen(false);

    // Update formData
    handleInputChange({ target: { name: "vendor", value: vendor.name } });

    // Auto-fill vendor details
    const addressParts = [
      vendor.addressLine1,
      vendor.addressLine2,
      vendor.city,
      vendor.state,
      vendor.pincode,
    ].filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      supplierAddress: addressParts.join(", "),
      contactPerson: vendor.contactPerson || "",
      phone: vendor.phone || "",
      vendor_id: vendor.vendor_id || "",
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
<FormGroup>
  <Label style={{ display: "flex", alignItems: "center" }}>
    Vendor <Required>*</Required>
    <AddButton onClick={handleAddVendor} title="Add New Vendor">
      +
    </AddButton>
  </Label>

  <div
    style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
    }}
    ref={dropdownRef}
  >
    <input
      type="text"
      name="vendor"
      value={searchTerm}
      onChange={handleInputChangeLocal}
      onFocus={() => setDropdownOpen(true)}
      disabled={loadingVendors}
      placeholder={
        loadingVendors ? "Loading vendors..." : "Select or type a vendor"
      }
      style={{
        width: "100%",
        padding: "8px 32px 8px 8px", // right padding for the icon
        boxSizing: "border-box",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    />

    {/* Dropdown Arrow Icon */}
    <FaChevronDown
      style={{
        position: "absolute",
        right: "10px",
        pointerEvents: "none",
        color: "#666",
        fontSize: "14px",
      }}
    />

    {/* Dropdown List */}
    {dropdownOpen && filteredVendors.length > 0 && (
      <ul
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          maxHeight: "150px",
          overflowY: "auto",
          border: "1px solid #ccc",
          background: "#fff",
          zIndex: 1000,
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {filteredVendors.map((vendor) => (
          <li
            key={vendor.id}
            onMouseDown={() => handleSelectOption(vendor)}
            style={{
              padding: "8px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
          >
            {vendor.name}
          </li>
        ))}
      </ul>
    )}
  </div>
</FormGroup>
  );
};



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

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error:", response.status, errorText);
        return [];
      }

      const data = await response.json();
      console.log("Previous purchases response:", data);

      if (data.status === "success") {
        return data.data || [];
      } else {
        console.error("API error:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Network error fetching previous purchases:", error);
      return [];
    } finally {
      setHistoryLoading(false);
    }
  };

  // Handle history button click
  const handleShowHistory = async (item) => {
    // Use modalForm data when called from modal, or item data when called from table
    const hsn = item?.hsn?.toString().trim();
    const itemName =
      item?.name?.toString().trim() || item?.item_name?.toString().trim();

    console.log("History button clicked - HSN:", hsn, "Item Name:", itemName);

    // Enhanced validation with more specific messages
    if (!itemName || itemName === "") {
      toast.error(
        "Please select an item from the dropdown before viewing history"
      );
      return;
    }

    if (!hsn || hsn === "") {
      toast.error(
        "HSN code is required. Please select a valid item with HSN code"
      );
      return;
    }

    setSelectedItemForHistory({ ...item, hsn, itemName });
    setShowHistoryModal(true);

    const history = await fetchPreviousPurchases(hsn, itemName);
    setHistoryData(history);
  };

  const HistoryModal = ({ show, onClose, item, historyData, loading }) => {
    if (!show || !item) return null;

    // Calculate price statistics for highlighting
    const getPriceStats = () => {
      if (!historyData || historyData.length === 0)
        return { min: 0, max: 0, avg: 0 };

      const prices = historyData.map((historyItem) => {
        let itemData = item;
        try {
          const items = JSON.parse(historyItem.items);
          const matchingItem = items.find((i) => i.hsn === item.hsn);
          if (matchingItem) {
            itemData = matchingItem;
          }
        } catch (e) {
          if (historyItem.matched_item) {
            itemData = historyItem.matched_item;
          }
        }
        return parseFloat(itemData.unitPrice || 0);
      });

      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;

      return { min, max, avg };
    };

    const priceStats = getPriceStats();

    // Calculate total stock from all history data
    const calculateTotalStock = () => {
      if (!historyData || historyData.length === 0) return 0;

      return historyData.reduce((total, historyItem) => {
        let items = [];
        try {
          items = JSON.parse(historyItem.items);
        } catch (e) {
          if (historyItem.matched_item) {
            items = [historyItem.matched_item];
          }
        }

        const itemTotal = items
          .filter((i) => i.hsn === item.hsn)
          .reduce((sum, i) => sum + parseInt(i.totalstock || 0), 0);

        return total + itemTotal;
      }, 0);
    };
   
    const totalStock = calculateTotalStock();
    console.log("total stock",totalStock)

    return (
      <HistoryModalOverlay onClick={onClose}>
        <HistoryModalContent onClick={(e) => e.stopPropagation()}>
          <HistoryModalHeader>
            <HistoryModalTitle>
              Purchase History - {item.itemName} (HSN: {item.hsn}) - Total
              Stock: {totalStock}
              <div
                style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
              >
                Price Range: ₹{priceStats.min.toFixed(2)} - ₹
                {priceStats.max.toFixed(2)} | Avg: ₹{priceStats.avg.toFixed(2)}
              </div>
            </HistoryModalTitle>
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </HistoryModalHeader>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <LoadingSpinner />
              <LoadingText>Loading history...</LoadingText>
            </div>
          ) : historyData.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
            >
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
                </HistoryTableRow>
              </HistoryTableHeader>
              <tbody>
                {historyData.map((historyItem, index) => {
                  let itemData = item;
                  try {
                    const items = JSON.parse(historyItem.items);
                    const matchingItem = items.find((i) => i.hsn === item.hsn);
                    if (matchingItem) {
                      itemData = matchingItem;
                    }
                  } catch (e) {
                    if (historyItem.matched_item) {
                      itemData = historyItem.matched_item;
                    }
                  }

                  const unitPrice = parseFloat(itemData.unitPrice || 0);
                  const isHighPrice =
                    unitPrice === priceStats.max &&
                    priceStats.max > priceStats.min;
                  const isLowPrice =
                    unitPrice === priceStats.min &&
                    priceStats.max > priceStats.min;

                  return (
                    <HistoryTableRow key={index}>
                      <HistoryTableCell>
                        {historyItem.grn_number}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {new Date(historyItem.date).toLocaleDateString("en-IN")}
                      </HistoryTableCell>
                      <HistoryTableCell>{historyItem.vendor}</HistoryTableCell>
                      <HistoryTableCell>
                        {itemData.hsn || "N/A"}
                      </HistoryTableCell>
                      <HistoryTableCell>
                        {itemData.name || itemData.item_name || "N/A"}
                      </HistoryTableCell>
                      <HistoryTableCell
                        isPriceColumn={true}
                        isHighPrice={isHighPrice}
                        isLowPrice={isLowPrice}
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
                          { minimumFractionDigits: 2 }
                        )}
                      </HistoryTableCell>
                      <HistoryTableCell>{itemData.quantity}</HistoryTableCell>
                      <HistoryTableCell>{itemData.free}</HistoryTableCell>
                      <HistoryTableCell>
                        {itemData.totalstock || 0}
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
    );
  };

  return (
    <Container>
     <ToastContainer position="top-right" /> 
      <MaxWidthContainer>
        <Header>
        <Title>Travellers INN - GRN</Title>
        </Header>
        {/* Container 1: Basic Information */}
        <Card>
          <CardHeader>Basic Information</CardHeader>
          <FormGrid>
            <FormGroup>
              <Label>
                Purchase Category <Required>*</Required>
              </Label>
              <Select
                name="purchaseCategory"
                value={formData.purchaseCategory}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                <option value="TRAVELLERS IN CREDIT">
                  TRAVELLERS IN CREDIT
                </option>
                <option value="TRAVELLERS IN CASH">TRAVELLERS IN CASH</option>
              </Select>
            </FormGroup>

            <VendorDropdown />

            <FormGroup>
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Vendor ID</Label>
              <Input
                type="text"
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Supplier Address</Label>
              <Input
                type="text"
                name="supplierAddress"
                value={formData.supplierAddress}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Contact Person</Label>
              <Input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Invoice No <Required>*</Required>
              </Label>
              <Input
                type="text"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Invoice Date <Required>*</Required>
              </Label>
              <Input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Credit Period</Label>
              <Input
                type="text"
                name="creditPeriod"
                value={formData.creditPeriod || "45 Days"}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Due Date</Label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Payment Mode</Label>
              <Select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleInputChange}
              >
                <option value="CHEQUE">CHEQUE</option>
                <option value="CASH">CASH</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                {/* <option value="CARD">CARD</option> */}
                <option value="UPI">UPI</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </Card>

        {/* Container 2: Items Table */}
        <Card>
          <HeaderSection>
            <CardHeader
              style={{
                marginBottom: 0,
                paddingBottom: 0,
                borderBottom: "none",
              }}
            >
              Items
            </CardHeader>
            <PrimaryButton onClick={() => openModal()}>
              <Plus size={16} />
              <span>Add Item</span>
            </PrimaryButton>
          </HeaderSection>

<TableContainer>
  <StyledTable>
    <thead>
      <tr>
        <th>Sl.No</th>
        <th>Name</th>
        <th>HSN</th>
        <th>Batch</th>
        <th>Expiry</th>
        <th>Packing</th>
        <th>No of Unit</th>
        <th>Quantity</th>
        <th>Free</th>
        <th>Item Value</th>
        <th>Packing Price ₹</th>
        <th>Unit Price ₹</th>
        <th>Tax%</th>
        <th>CGST%</th>
        <th>CGST Amt ₹</th>
        <th>SGST%</th>
        <th>SGST Amt ₹</th>
        <th>IGST%</th>
        <th>IGST Amt ₹</th>
        <th>Purchase Discount%</th>
        <th>Discounted Amt ₹</th>
        <th>Purchase Cost</th>
        <th>Unit Cost(With GST)</th>
        <th>MRP ₹</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {items.length === 0 ? (
        <tr>
          <EmptyRow colSpan="24">
            No items added yet. Click "Add Item" to get started.
          </EmptyRow>
        </tr>
      ) : (
        items.map((item, index) => (
          <tr key={item.id ?? index}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.hsn}</td>
            <td>{item.batch}</td>
            <td>{item.expiry}</td>
            <td>{item.packing}</td>
            <td>{item.noOfUnit}</td>
            <td>{item.quantity}</td>
            <td>{item.free}</td>
            <td>{item.itemValue}</td>
            <td>{item.packingPrice}</td>
            <td>{item.unitPrice}</td>
            <td>{item.tax}</td>
            <td>{item.cgstPercent}</td>
            <td>{item.cgstAmt}</td>
            <td>{item.sgstPercent}</td>
            <td>{item.sgstAmt}</td>
            <td>{item.igstPercent}</td>
            <td>{item.igstAmt}</td>
            <td>{item.purchaseDiscountPercent}</td>
            <td>{item.discountedAmt}</td>
            <td>{item.purchaseCost}</td>
            <td>{item.unitCostWithGst}</td>

            <td>{item.mrp}</td>
<td>
  <button
    className="edit-btn"
    onClick={() => handleEditItem(item.id)}
  >
    <FaEdit />
  </button>
  <button
    className="delete-btn"
    onClick={() => handleDeleteItem(item.id)}
  >
    <FaTrash />
  </button>
</td>

          </tr>
        ))
      )}
    </tbody>
  </StyledTable>
</TableContainer>


        </Card>

        {/* Container 3: Summary */}
        <Card>
          <CardHeader>Summary</CardHeader>

          {/* First Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <FormGroup>
              <Label>Non Taxable Amount</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={summary.nonTaxableAmount.toFixed(2)}
                  readOnly
                  style={{ background: "#f9fafb" }}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>CGST</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={summary.cgst.toFixed(2)}
                  readOnly
                  style={{ background: "#f9fafb" }}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>SGST</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={summary.sgst.toFixed(2)}
                  readOnly
                  style={{ background: "#f9fafb" }}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Total Amount</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={summary.totalAmount.toFixed(2)}
                  readOnly
                  style={{ background: "#f9fafb" }}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Quotation Rate</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  name="quotationRate"
                  value={summary.quotationRate}
                  onChange={(e) => handleInputChange(e, "summary")}
                />
              </div>
            </FormGroup>
          </div>

          {/* Second Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <FormGroup>
              <Label>Taxable Amount</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={summary.taxableAmount.toFixed(2)}
                  readOnly
                  style={{ background: "#f9fafb" }}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>IGST</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  name="igst"
                  value={summary.igst}
                  onChange={(e) => handleInputChange(e, "summary")}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Cess</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  name="cess"
                  value={summary.cess}
                  onChange={(e) => handleInputChange(e, "summary")}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Tax On Free Items</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  name="taxOnFreeItems"
                  value={summary.taxOnFreeItems}
                  onChange={(e) => handleInputChange(e, "summary")}
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Courier/Transport Charge</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  name="courierTransportCharge"
                  value={summary.courierTransportCharge}
                  onChange={(e) => handleInputChange(e, "summary")}
                />
              </div>
            </FormGroup>
          </div>

          {/* Third Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <FormGroup>
              <Label>Tax Paid To Supplier</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={summary.taxPaidToSupplier.toFixed(2)}
                  readOnly
                  style={{ background: "#f9fafb" }}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Central Sales Tax</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  name="centralSalesTax"
                  value={summary.centralSalesTax}
                  onChange={(e) => handleInputChange(e, "summary")}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Round Amount</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Select
                  style={{ width: "60px", padding: "8px 4px" }}
                  value={summary.roundAmount >= 0 ? "+" : "-"}
                  onChange={(e) => {
                    const sign = e.target.value;
                    const absValue = Math.abs(summary.roundAmount || 0);
                    const newValue = sign === "+" ? absValue : -absValue;
                    setSummary((prev) => ({ ...prev, roundAmount: newValue }));
                  }}
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  value={Math.abs(summary.roundAmount || 0)}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    const sign = summary.roundAmount >= 0 ? 1 : -1;
                    setSummary((prev) => ({
                      ...prev,
                      roundAmount: value * sign,
                    }));
                  }}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Total Discount</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={summary.totalDiscount.toFixed(2)}
                  readOnly
                  style={{ background: "#f9fafb" }}
                />
              </div>
            </FormGroup>
            <div></div> {/* Empty space */}
          </div>

          {/* Fourth Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <FormGroup>
              <Label>Local Tax</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  name="localTax"
                  value={summary.localTax}
                  onChange={(e) => handleInputChange(e, "summary")}
                />
              </div>
            </FormGroup>
            <div></div> {/* Empty space */}
            <div></div> {/* Empty space */}
            <FormGroup>
              <Label>Net Invoice Amount</Label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    padding: "8px 12px",
                    background: "#f3f4f6",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  ₹
                </span>
                <Input
                  type="number"
                  step="0.01"
                  value={summary.netInvoiceAmount.toFixed(2)}
                  readOnly
                  style={{ background: "#f9fafb", fontWeight: "bold" }}
                />
              </div>
            </FormGroup>
            <div></div> {/* Empty space */}
          </div>

          {/* Remarks Row */}
          <div style={{ marginTop: "16px" }}>
            <FormGroup>
              <Label>Remarks</Label>
              <TextArea
                name="remarks"
                value={summary.remarks}
                onChange={(e) => handleInputChange(e, "summary")}
                rows="3"
                style={{ width: "100%" }}
              />
            </FormGroup>
          </div>
        </Card>

        {/* Action Buttons */}
        <ActionSection>
          <SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
          <SuccessButton onClick={handleSubmit}>Submit GRN</SuccessButton>
        </ActionSection>
      </MaxWidthContainer>

      {/* Modal */}
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <Title>
                {editingItem ? "Edit Item" : "Add New Item"}
              </Title>
              <CloseButton onClick={closeModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {/* Row 1 - Item Name, HSN, Batch, Expiry */}
              <ModalRowGrid>
                <RowLabel>Item Details</RowLabel>
                <FormGroup>
                  <Label style={{ display: "flex", alignItems: "center" }}>
                    <strong>Item Name</strong>
                    <AddButton onClick={handleAddItems} title="Add New Item">
                      +
                    </AddButton>
                  </Label>
<select
  name="name"
  value={modalForm.name}
  onChange={handleModalInputChange}
>
  <option value="">Select item</option>
  {availableItems
    .filter((item) => item.hsn && item.hsn.trim() !== "") // Only show items with HSN
    .map((item) => (
      <option key={item.itemName} value={item.itemName}>
        {item.itemName}
      </option>
    ))}
</select>



                </FormGroup>
                <FormGroup>
                  <Label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <strong>HSN</strong>
                    <History
                      size={20}
                      style={{
                        cursor:
                          modalForm.name && modalForm.name.trim() !== ""
                            ? "pointer"
                            : "not-allowed",
                        color:
                          modalForm.name && modalForm.name.trim() !== ""
                            ? "#2563eb"
                            : "#9ca3af",
                        transition: "all 0.2s ease",
                        padding: "2px",
                        borderRadius: "3px",
                        opacity:
                          modalForm.name && modalForm.name.trim() !== ""
                            ? 1
                            : 0.5,
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        console.log(
                          "History icon clicked. Modal form:",
                          modalForm
                        );

                        // More comprehensive validation
                        if (!modalForm.name || modalForm.name.trim() === "") {
                          toast.error(
                            "Please select an item from the dropdown first"
                          );
                          return;
                        }

                        if (!modalForm.hsn || modalForm.hsn.trim() === "") {
                          toast.error(
                            "HSN code is missing. Please ensure the selected item has a valid HSN code"
                          );
                          return;
                        }

                        handleShowHistory(modalForm);
                      }}
                      onMouseEnter={(e) => {
                        if (modalForm.name && modalForm.name.trim() !== "") {
                          e.currentTarget.style.color = "#2563eb";
                          e.currentTarget.style.backgroundColor =
                            "rgba(78, 215, 241, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (modalForm.name && modalForm.name.trim() !== "") {
                          e.currentTarget.style.color = "#2563eb";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                      title={
                        modalForm.name && modalForm.name.trim() !== ""
                          ? "View purchase history for this item"
                          : "Please select an item first"
                      }
                    />
                  </Label>
                  <Input
                    type="text"
                    name="hsn"
                    value={modalForm.hsn}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    <strong>Batch</strong>
                  </Label>
                  <Input
                    type="text"
                    name="batch"
                    value={modalForm.batch}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    <strong>Expiry</strong>
                  </Label>
                  <Input
                    type="date"
                    name="expiry"
                    value={modalForm.expiry}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
              </ModalRowGrid>

              {/* Row 2 - Packing, No.of Unit, Quantity, Free */}
              <ModalRowGrid>
                <RowLabel>Quantity Details</RowLabel>
                <FormGroup>
                  <Label>
                    <strong>Packing</strong>
                  </Label>
                  <Input
                    type="text"
                    name="packing"
                    value={modalForm.packing}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <strong>No.of Unit</strong>
                  </Label>
                  <Input
                    type="number"
                    name="noOfUnit"
                    value={modalForm.noOfUnit}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <strong>Quantity</strong>
                  </Label>
                  <Input
                    type="number"
                    name="quantity"
                    value={modalForm.quantity}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <strong>Free</strong>
                  </Label>
                  <Input
                    type="number"
                    name="free"
                    value={modalForm.free}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
              </ModalRowGrid>

              {/* Row 3 - Item Value, Packing Price, Unit Price */}
              <ModalRowGrid>
                <RowLabel>Pricing Details</RowLabel>
                <FormGroup>
                  <Label>
                    <strong>Item Value ₹</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="itemValue"
                    value={modalForm.itemValue}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    <strong>Packing Price ₹</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="packingPrice"
                    value={modalForm.packingPrice}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    <strong>Unit Price ₹</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="unitPrice"
                    value={modalForm.unitPrice}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
                <div></div> {/* Empty space for 4th column */}
              </ModalRowGrid>

              {/* Row 4 - Tax, CGST%, CGST Amt, SGST%, SGST Amt */}
              <TaxRowGrid>
                <RowLabel>Tax Details</RowLabel>
                <FormGroup>
                  <Label>
                    <strong>Tax</strong>
                  </Label>
                  <Select
                    name="tax"
                    value={modalForm.tax}
                    onChange={handleModalInputChange}
                  >
                    <option value="">Select Tax %</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>
                    <strong>CGST%</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="cgstPercent"
                    value={modalForm.cgstPercent}
                    onChange={handleModalInputChange}
                    readOnly
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <strong>CGST Amt ₹</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="cgstAmt"
                    value={modalForm.cgstAmt}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <strong>SGST%</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="sgstPercent"
                    value={modalForm.sgstPercent}
                    onChange={handleModalInputChange}
                    readOnly
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <strong>SGST Amt ₹</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="sgstAmt"
                    value={modalForm.sgstAmt}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
              </TaxRowGrid>

              {/* Row 5 - Purchase Discount (%), Discounted Amt, Purchase Cost */}
              <ModalRowGrid>
                <RowLabel>Discount & Cost Details</RowLabel>
                <FormGroup>
                  <Label>
                    <strong>Purchase Discount (%)</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="purchaseDiscountPercent"
                    value={modalForm.purchaseDiscountPercent}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <strong>Discounted Amt ₹</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="discountedAmt"
                    value={modalForm.discountedAmt}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <strong>Purchase Cost ₹</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="purchaseCost"
                    value={modalForm.purchaseCost}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
                 <FormGroup>
  <Label>
    <strong>Unit Cost (with GST) ₹</strong>
  </Label>
  <Input
    type="number"
    step="0.01"
    name="unitCostWithGst"
    value={modalForm.unitCostWithGst}
    readOnly
    style={{ background: "#f9fafb" }}
  />
</FormGroup>

                <FormGroup>
                  <Label>
                    <strong>MRP ₹</strong>
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="mrp"
                    value={modalForm.mrp}
                    onChange={handleModalInputChange}
                  />
                </FormGroup>
              </ModalRowGrid>
            </ModalBody>

            <ModalFooter>
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleAddItem}>
                {editingItem ? "Update Item" : "Add Item"}
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <Modal>
          <SmallModalContent>
            <ModalHeader>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Confirm Cancel
              </h3>
            </ModalHeader>

            <ModalBody>
              <p style={{ color: "#4b5563", margin: 0 }}>
                Are you sure you want to cancel? All unsaved data will be lost.
              </p>
            </ModalBody>

            <ModalFooter>
              <SecondaryButton onClick={() => setShowConfirmDialog(false)}>
                Keep Editing
              </SecondaryButton>
              <DangerButton onClick={confirmCancel}>Yes, Cancel</DangerButton>
            </ModalFooter>
          </SmallModalContent>
        </Modal>
      )}
      {showInvoicePreview && (
        <InvoiceModal>
          <InvoiceContent>
            <InvoiceHeader>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Invoice Preview
              </h3>
              <CloseButton onClick={() => setShowInvoicePreview(false)}>
                <X size={20} />
              </CloseButton>
            </InvoiceHeader>

            <InvoiceBody>
              <InvoiceTitle>
                <h1>SHANMUGA HOSPITAL LIMITED</h1>
                <div className="address">
                  51/24.Saradha College Road, Salem - 636007,,
                </div>
                <div className="address">
                  Phone : 04272706666,info@smrft.org
                </div>
                <div className="address">GST Number :</div>
                <div className="document-title">
                  GOODS RECEIPT NOTE - TRAVELLERS INN
                </div>
              </InvoiceTitle>

              <InvoiceDetailsGrid>
                <div className="section">
                  <div className="header">Invoice Details</div>
                  <div className="content">
                    <div className="row">
                      <span>Invoice No : {formData.invoiceNo}</span>
                    </div>
                    <div className="row">
                      <span>Invoice Date : {formData.invoiceDate}</span>
                    </div>
                    <div className="row">
                      <span>Purchase No : {formData.grn_number}</span>
                    </div>
                    <div className="row">
                      <span>Purchase Date : {formData.date}</span>
                    </div>
                  </div>
                </div>

                <div className="section">
                  <div className="header">Supplier Details</div>
                  <div className="content">
                    <div className="row">
                      <span>Supplier Name : {formData.vendor}</span>
                    </div>
                    <div className="row">
                      <span>State : {formData.supplierAddress}</span>
                    </div>
                    <div className="row">
                      <span>Phone : {formData.phone || ""}</span>
                    </div>
                    <div className="row">
                      <span>GST Number : ******</span>
                    </div>
                  </div>
                </div>

                <div className="section">
                  <div className="header">Order Details</div>
                  <div className="content">
                    <div className="row">
                      <span>Order Number :</span>
                    </div>
                    <div className="row">
                      <span>Payment Mode : {formData.paymentMode}</span>
                    </div>
                    <div className="row">
                      <span>Approved Date : {formData.date}</span>
                    </div>
                  </div>
                </div>
              </InvoiceDetailsGrid>

              <InvoiceTable>
                <thead>
                  <tr>
                    <th rowSpan="2">Sl.</th>
                    <th rowSpan="2">Product</th>
                    <th rowSpan="2">HSN</th>
                    <th rowSpan="2">Batch</th>
                    <th rowSpan="2">Expiry</th>
                    <th rowSpan="2">Pack</th>
                    <th rowSpan="2">QTY</th>
                    <th rowSpan="2">Free</th>
                    <th rowSpan="2">P Rate</th>
                    <th rowSpan="2">P.cost</th>
                    <th rowSpan="2">MRP</th>
                    <th rowSpan="2">Discount</th>
                    <th rowSpan="2">
                      Taxable
                      <br />
                      Amount
                    </th>
                    <th colSpan="2">CGST</th>
                    <th colSpan="2">SGST</th>
                    <th colSpan="2">IGST</th>
                    <th rowSpan="2">
                      Total
                      <br />
                      Amount
                    </th>
                  </tr>
                  <tr>
                    <th>Rate</th>
                    <th>Amt</th>
                    <th>Rate</th>
                    <th>Amt</th>
                    <th>Rate</th>
                    <th>Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="center-cell">{index + 1}.</td>
                      <td className="product-cell">{item.name}</td>
                      <td className="number-cell">{item.hsn}</td>
                      <td className="center-cell">{item.batch}</td>
                      <td className="center-cell">{item.expiry}</td>
                      <td className="center-cell">{item.packing}</td>
                      <td className="center-cell">{item.quantity}</td>
                      <td className="center-cell">{item.free}</td>
                      <td className="number-cell">
                        {parseFloat(item.packingPrice || 0).toFixed(2)}
                      </td>
                      <td className="number-cell">
                        {parseFloat(item.purchaseCost || 0).toFixed(2)}
                      </td>
                      <td className="number-cell">
                        {parseFloat(item.mrp || 0).toFixed(2)}
                      </td>
                      <td className="number-cell">
                        {parseFloat(item.discountedAmt || 0).toFixed(2)}
                      </td>
                      <td className="number-cell">
                        {parseFloat(item.itemValue || 0).toFixed(2)}
                      </td>
                      <td className="center-cell">{item.cgstPercent}%</td>
                      <td className="number-cell">
                        {parseFloat(item.cgstAmt || 0).toFixed(4)}
                      </td>
                      <td className="center-cell">{item.sgstPercent}%</td>
                      <td className="number-cell">
                        {parseFloat(item.sgstAmt || 0).toFixed(4)}
                      </td>
                      <td className="center-cell">Rate</td>
                      <td className="number-cell">0</td>
                      <td className="number-cell">
                        {parseFloat(item.purchaseCost || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="12" className="center-cell">
                      Total
                    </td>
                    <td className="number-cell">
                      {summary.nonTaxableAmount.toFixed(2)}
                    </td>
                    <td></td>
                    <td className="number-cell">{summary.cgst.toFixed(2)}</td>
                    <td></td>
                    <td className="number-cell">{summary.sgst.toFixed(2)}</td>
                    <td></td>
                    <td className="number-cell">0.00</td>
                    <td className="number-cell">
                      {summary.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </InvoiceTable>

              <InvoiceSummary>
                <div className="summary-layout">
                  <div className="gst-amounts">
                    <div className="gst-row">
                      <span className="label">CGST Amount</span>
                      <span className="amount">
                        : {summary.cgst.toFixed(2)}
                      </span>
                    </div>
                    <div className="gst-row">
                      <span className="label">SGST Amount</span>
                      <span className="amount">
                        : {summary.sgst.toFixed(2)}
                      </span>
                    </div>
                    <div className="gst-row">
                      <span className="label">IGST Amount</span>
                      <span className="amount">
                        : {summary.igst.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="amounts-table">
                    <div className="row">
                      <span>Total</span>
                      <span>{summary.nonTaxableAmount.toFixed(2)}</span>
                    </div>
                    <div className="row">
                      <span>Discount</span>
                      <span>{summary.totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="row">
                      <span>Tax On Free</span>
                      <span>{summary.taxOnFreeItems.toFixed(2)}</span>
                    </div>
                    <div className="row">
                      <span>Round off.</span>
                      <span>{summary.roundAmount.toFixed(2)}</span>
                    </div>
                    <div className="row">
                      <span>Total GST</span>
                      <span>
                        {(summary.cgst + summary.sgst + summary.igst).toFixed(
                          2
                        )}
                      </span>
                    </div>
                    <div className="row">
                      <span>Net Amount</span>
                      <span>{summary.netInvoiceAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="amount-words">
                  <span className="label">Amount In Words</span>
                  <div>{numberToWords(summary.netInvoiceAmount)}</div>
                </div>
              </InvoiceSummary>

              <InvoiceFooter>
<div className="footer-item">
  <div className="label">
    Verified By: {userId || "N/A"}
  </div>
</div>
              </InvoiceFooter>
            </InvoiceBody>

            <InvoiceModalFooter>
              <InvoiceSecondaryButton
                onClick={() => setShowInvoicePreview(false)}
              >
                Cancel
              </InvoiceSecondaryButton>
              <InvoicePrimaryButton onClick={handleConfirmSubmit}>
                Confirm & Submit
              </InvoicePrimaryButton>
            </InvoiceModalFooter>
          </InvoiceContent>
        </InvoiceModal>
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

export default TravellersIN;
