import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, History } from "lucide-react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import apiRequest from "../apiRequest";

// Styled Components with Enhanced Responsive Design
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #4ed7f1 0%,
    #6fe6fc 25%,
    #a8f1ff 75%,
    #fffa8d 100%
  );
  padding: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const MaxWidthContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden; /* Prevent horizontal overflow */
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  text-align: center;

  @media (min-width: 640px) {
    font-size: 1.75rem;
    text-align: left;
  }

  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 32px;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(78, 215, 241, 0.2),
    0 4px 6px -2px rgba(111, 230, 252, 0.15);
  border: 1px solid rgba(168, 241, 255, 0.3);
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 640px) {
    padding: 20px;
    margin-bottom: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
  }
`;

const CardHeader = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  background: linear-gradient(90deg, #4ed7f1, #6fe6fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.4);

  @media (min-width: 640px) {
    font-size: 1.25rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }

  @media (min-width: 768px) {
    margin-bottom: 24px;
    padding-bottom: 12px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;

  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  min-width: 0; /* Allow shrinking */

  @media (min-width: 640px) {
    gap: 8px;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  word-wrap: break-word;
`;

const Required = styled.span`
  color: #ef4444;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid rgba(168, 241, 255, 0.5);
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
  box-sizing: border-box;
  min-width: 0; /* Allow shrinking */

  @media (max-width: 640px) {
    padding: 10px 12px; /* Slightly larger touch targets on mobile */
    font-size: 16px; /* Prevent zoom on iOS */
  }

  &:focus {
    outline: 2px solid #4ed7f1;
    outline-offset: 2px;
    border-color: transparent;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(78, 215, 241, 0.1);
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid rgba(168, 241, 255, 0.5);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  outline: none;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 16px;
  }

  &:focus {
    outline: 2px solid #4ed7f1;
    outline-offset: 2px;
    border-color: transparent;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(78, 215, 241, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid rgba(168, 241, 255, 0.5);
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;
  min-height: 80px;
  resize: vertical;
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 16px;
    min-height: 100px;
  }

  &:focus {
    outline: 2px solid #4ed7f1;
    outline-offset: 2px;
    border-color: transparent;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(78, 215, 241, 0.1);
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;

  @media (max-width: 640px) {
    padding: 10px 16px;
    font-size: 14px;
    width: 100%; /* Full width buttons on mobile */
  }

  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #4ed7f1, #6fe6fc);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(78, 215, 241, 0.3);

  &:hover {
    background: linear-gradient(135deg, #6fe6fc, #4ed7f1);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(78, 215, 241, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: linear-gradient(135deg, #a8f1ff, #6fe6fc);
  color: #374151;
  box-shadow: 0 4px 6px -1px rgba(168, 241, 255, 0.3);

  &:hover {
    background: linear-gradient(135deg, #6fe6fc, #a8f1ff);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(168, 241, 255, 0.4);
  }
`;

const SuccessButton = styled(Button)`
  background: linear-gradient(135deg, #fffa8d, #a8f1ff);
  color: #374151;
  box-shadow: 0 4px 6px -1px rgba(255, 250, 141, 0.3);

  &:hover {
    background: linear-gradient(135deg, #a8f1ff, #fffa8d);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(255, 250, 141, 0.4);
  }
`;

const DangerButton = styled(Button)`
  padding: 4px 8px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;

  @media (max-width: 640px) {
    padding: 8px 12px;
  }

  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
  }
`;

const WarningButton = styled(Button)`
  padding: 4px 8px;
  background: linear-gradient(135deg, #fffa8d, #f59e0b);
  color: #374151;

  @media (max-width: 640px) {
    padding: 8px 12px;
  }

  &:hover {
    background: linear-gradient(135deg, #f59e0b, #fffa8d);
    transform: translateY(-1px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(78, 215, 241, 0.2),
    0 4px 6px -2px rgba(111, 230, 252, 0.15);
  font-size: 0.875rem;

  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #a8f1ff, #6fe6fc);
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;

  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.3);
  font-size: 0.875rem;
  word-break: break-word;

  @media (min-width: 640px) {
    padding: 12px;
  }

  @media (max-width: 640px) {
    font-size: 0.75rem;
    padding: 6px;
  }
`;

const TableHeaderCell = styled.th`
  padding: 8px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.4);
  font-size: 0.875rem;
  text-align: left;

  @media (min-width: 640px) {
    padding: 12px;
  }

  @media (max-width: 640px) {
    font-size: 0.75rem;
    padding: 6px;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: rgba(168, 241, 255, 0.1);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 16px;

  @media (min-width: 1024px) {
    justify-content: center;
    padding: 0;
  }
`;

const ModalContent = styled.div`
  background: white;
  width: 100%;
  max-width: 1200px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;

  @media (min-width: 1024px) {
    width: 1200px;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
`;

const ModalHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.3);
  background: linear-gradient(
    135deg,
    rgba(168, 241, 255, 0.1),
    rgba(255, 250, 141, 0.1)
  );
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const ModalBody = styled.div`
  padding: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const ModalFooter = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(168, 241, 255, 0.3);
  background: linear-gradient(
    135deg,
    rgba(168, 241, 255, 0.05),
    rgba(255, 250, 141, 0.05)
  );
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

// Updated styled components for modal rows with better responsive design
const ModalRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(168, 241, 255, 0.05);
  border-radius: 8px;
  border: 2px dotted #a8f1ff;
  box-shadow: inset 0 0 0 1px #fffa8d, 0 0 0 1px rgba(168, 241, 255, 0.3);
  position: relative;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 14px;
    margin-bottom: 18px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 16px;
    margin-bottom: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  &::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px dotted #fffa8d;
    border-radius: 8px;
    opacity: 0.7;
    pointer-events: none;
  }
`;

const TaxRowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(168, 241, 255, 0.05);
  border-radius: 8px;
  border: 2px dotted #a8f1ff;
  box-shadow: inset 0 0 0 1px #fffa8d, 0 0 0 1px rgba(168, 241, 255, 0.3);
  position: relative;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 14px;
    margin-bottom: 18px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 16px;
    margin-bottom: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(5, 1fr);
  }

  &::after {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px dotted #fffa8d;
    border-radius: 8px;
    opacity: 0.7;
    pointer-events: none;
  }
`;

const RowLabel = styled.h4`
  grid-column: 1 / -1;
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  background: linear-gradient(90deg, #4ed7f1, #6fe6fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 640px) {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
  }

  @media (min-width: 768px) {
    margin: 0 0 12px 0;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
    gap: 16px;
    margin-bottom: 32px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const EmptyState = styled.td`
  text-align: center;
  color: #6b7280;
  padding: 24px;

  @media (min-width: 640px) {
    padding: 32px;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin: -1px; /* Prevent scrollbar from showing unnecessarily */

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(168, 241, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(78, 215, 241, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(78, 215, 241, 0.5);
  }
`;

const SmallModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(78, 215, 241, 0.3);
  border: 1px solid rgba(168, 241, 255, 0.3);
  width: 100%;
  max-width: 448px;
  margin: 16px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
`;

const CloseButton = styled.button`
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: #4ed7f1;
    transform: scale(1.1);
    background: rgba(78, 215, 241, 0.1);
  }
`;

const InvoiceModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

const InvoiceContent = styled.div`
  background: white;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const InvoiceHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
`;

const InvoiceBody = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.4;
`;

const InvoiceTitle = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    font-size: 18px;
    font-weight: bold;
    color: #1e40af;
    margin: 0 0 5px 0;
  }

  .address {
    font-size: 11px;
    margin: 2px 0;
  }

  .document-title {
    font-size: 14px;
    font-weight: bold;
    margin: 15px 0;
    padding: 8px;
    background: #e0f2fe;
    border: 2px solid #0ea5e9;
    color: #1e40af;
  }
`;

const InvoiceDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  margin-bottom: 10px;
  border: 2px solid #0ea5e9;

  .section {
    border-right: 1px solid #0ea5e9;

    &:last-child {
      border-right: none;
    }

    .header {
      background: #e0f2fe;
      padding: 5px 8px;
      font-weight: bold;
      border-bottom: 1px solid #0ea5e9;
      text-align: center;
      color: #1e40af;
    }

    .content {
      padding: 8px;

      .row {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        margin: 3px 0;
        font-size: 11px;
        line-height: 1.4;
        white-space: nowrap;

        .label {
          font-weight: bold;
          min-width: 90px;
          flex-shrink: 0;
          margin-right: 5px;
          display: inline-block;
        }

        .value {
          flex: 1;
          text-align: left;
          display: inline-block;
        }

        /* Fallback for any span without class */
        span {
          display: inline-block;
        }

        /* Force all children to be inline */
        > * {
          display: inline-block;
        }
      }
    }
  }
`;
const InvoiceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 10px;
  border: 2px solid #0ea5e9;

  th,
  td {
    border: 1px solid #0ea5e9;
    padding: 6px 4px;
    text-align: center;
    vertical-align: middle;
  }

  th {
    background: #e0f2fe;
    font-weight: bold;
    color: #1e40af;
    font-size: 9px;
    line-height: 1.2;
  }

  td {
    font-size: 10px;
  }

  .number-cell {
    text-align: right;
    padding-right: 8px;
  }

  .center-cell {
    text-align: center;
  }

  .product-cell {
    text-align: left;
    padding-left: 8px;
  }

  /* Specific column widths to match the image */
  th:nth-child(1),
  td:nth-child(1) {
    width: 30px;
  } /* Sl. */
  th:nth-child(2),
  td:nth-child(2) {
    width: 140px;
  } /* Product */
  th:nth-child(3),
  td:nth-child(3) {
    width: 70px;
  } /* HSN */
  th:nth-child(4),
  td:nth-child(4) {
    width: 60px;
  } /* Batch */
  th:nth-child(5),
  td:nth-child(5) {
    width: 60px;
  } /* Expiry */
  th:nth-child(6),
  td:nth-child(6) {
    width: 40px;
  } /* Pack */
  th:nth-child(7),
  td:nth-child(7) {
    width: 40px;
  } /* QTY */
  th:nth-child(8),
  td:nth-child(8) {
    width: 40px;
  } /* Free */
  th:nth-child(9),
  td:nth-child(9) {
    width: 60px;
  } /* P Rate */
  th:nth-child(10),
  td:nth-child(10) {
    width: 60px;
  } /* P.cost */
  th:nth-child(11),
  td:nth-child(11) {
    width: 60px;
  } /* MRP */
  th:nth-child(12),
  td:nth-child(12) {
    width: 60px;
  } /* Discount */
  th:nth-child(13),
  td:nth-child(13) {
    width: 70px;
  } /* Taxable Amount */

  /* Total row styling */
  .total-row {
    background: #f0f9ff;
    font-weight: bold;

    td {
      background: #f0f9ff;
    }
  }
`;

const InvoiceSummary = styled.div`
  margin-top: 20px;

  .summary-layout {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .gst-amounts {
    flex: 1;
    border: 2px solid #0ea5e9;
    background: #e0f2fe;
    padding: 12px;
    box-sizing: border-box; /* Prevents border overflow */

    .gst-row {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      font-size: 11px;

      /* Ensure consistent bottom margin for all rows */
      &:last-child {
        margin-bottom: 5px;
      }

      .label {
        font-weight: bold;
        color: #1e40af;
      }

      .amount {
        font-weight: bold;
        color: #1e40af;
      }
    }
  }

  .amounts-table {
    min-width: 280px;
    border: 2px solid #0ea5e9;
    box-sizing: border-box; /* Prevents border overflow */

    .row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #0ea5e9;
      font-size: 11px;
      margin: 0; /* Remove any default margins */
      line-height: 1; /* Consistent line height */
      align-items: center; /* Vertical center alignment */

      &:last-child {
        border-bottom: none;
        background: #e0f2fe;
        font-weight: bold;
        color: #1e40af;
        margin-bottom: 0; /* Ensure no extra margin on last row */
      }

      span:first-child {
        font-weight: bold;
        flex: 1; /* Take available space */
        line-height: 1; /* Consistent line height for label */
      }

      span:last-child {
        font-weight: bold;
        text-align: right;
        flex-shrink: 0; /* Prevent shrinking */
        min-width: 80px; /* Minimum width for amount column */
        line-height: 1; /* Consistent line height for amount */
      }
    }
  }

  .amount-words {
    margin: 15px 0;
    padding: 12px;
    background: #e0f2fe;
    border: 2px solid #0ea5e9;
    box-sizing: border-box; /* Prevents border overflow */

    .label {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 5px;
      display: block;
    }

    div {
      font-size: 11px;
      font-weight: bold;
    }
  }
`;

const InvoiceFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;

  .footer-item {
    flex: 1;

    .label {
      font-weight: bold;
      font-size: 11px;
      border-bottom: 1px solid #000;
      padding-bottom: 2px;
      display: inline-block;
      min-width: 150px;
    }
  }
`;
const InvoiceModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const InvoiceSecondaryButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #f9fafb;
  }
`;

const InvoicePrimaryButton = styled.button`
  padding: 8px 16px;
  border: none;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #2563eb;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
  margin-left: 8px;

  &:hover {
    background: linear-gradient(135deg, #0ea5e9, #2563eb);
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid #1e40af;
    outline-offset: 2px;
  }
`;
// History Modal components
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
  animation: fadeIn 0.2s ease-out;
`;

const HistoryModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 95%; // Increased width to accommodate more columns
  max-width: 1000px; // Increased max-width
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;
const HistoryModalHeader = styled.div`
  display: flex;
  justify-content: between;
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
  &:nth-child(even) {
    background-color: #f8fafc;
  }
  &:hover {
    background-color: #eff6ff;
  }
`;

const HistoryTableCell = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;

  /* Price highlighting for Unit Price column (6th column) */
  ${(props) =>
    props.isPriceColumn &&
    `
    font-weight: 600;
    position: relative;
    
    ${
      props.isHighPrice &&
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
    `
    }
    
    ${
      props.isLowPrice &&
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
    `
    }
  `}
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 8px;
  color: #6b7280;
`;

const TravellersIN = () => {
  // Form state for main form
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
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [items, setItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

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

  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

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
      const selectedItem = availableItems.find(
        (item) => item.itemName === value
      );
      if (selectedItem) {
        setModalForm((prev) => ({
          ...prev,
          name: value,
          hsn: selectedItem.hsn || "", // Auto-fill HSN
        }));
        return;
      } else {
        setModalForm((prev) => ({ ...prev, [name]: value }));
        return;
      }
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
      updatedForm.purchaseCost = purchaseCost.toFixed(2);

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

      // Recalculate CGST and SGST amounts
      const itemValue = parseFloat(updatedForm.itemValue) || 0;
      if (itemValue > 0) {
        updatedForm.cgstAmt = ((itemValue * cgstValue) / 100).toFixed(2);
        updatedForm.sgstAmt = ((itemValue * sgstValue) / 100).toFixed(2);

        // Recalculate Purchase Cost
        const cgstAmt = parseFloat(updatedForm.cgstAmt) || 0;
        const sgstAmt = parseFloat(updatedForm.sgstAmt) || 0;
        let purchaseCost = itemValue + cgstAmt + sgstAmt;

        // Apply discount if exists
        const purchaseDiscountPercent =
          parseFloat(updatedForm.purchaseDiscountPercent) || 0;
        if (purchaseDiscountPercent > 0) {
          const discountedAmt = (purchaseCost * purchaseDiscountPercent) / 100;
          updatedForm.discountedAmt = discountedAmt.toFixed(2);
          purchaseCost = purchaseCost - discountedAmt;
        }

        updatedForm.purchaseCost = purchaseCost.toFixed(2);
      }

      return updatedForm;
    });
  };

  const handleAddItem = () => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem ? { ...modalForm, id: editingItem } : item
        )
      );
    } else {
      const newItem = { ...modalForm, id: Date.now() };
      setItems((prev) => [...prev, newItem]);
    }
    closeModal();
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
      const result = await apiRequest(
        `${StoreTrustbaseurl}travellers-in/`,
        "POST",
        submitData
      );

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

  const VendorDropdown = () => (
    <FormGroup>
      <Label style={{ display: "flex", alignItems: "center" }}>
        Vendor <Required>*</Required>
        <AddButton onClick={handleAddVendor} title="Add New Vendor">
          +
        </AddButton>
      </Label>
      <Select
        name="vendor"
        value={formData.vendor}
        onChange={handleInputChange}
        disabled={loadingVendors}
      >
        <option value="">
          {loadingVendors ? "Loading vendors..." : "Select Vendor"}
        </option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.name}>
            {vendor.name}
          </option>
        ))}
      </Select>
    </FormGroup>
  );
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
      <MaxWidthContainer>
        <Title>MessINN - GRN</Title>

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
                <option value="MessIN CREDIT">
                  MessIN CREDIT
                </option>
                <option value="MessIN CASH">MessIN CASH</option>
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
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Sl.No</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>HSN</TableHeaderCell>
                  <TableHeaderCell>Batch</TableHeaderCell>
                  <TableHeaderCell>Expiry</TableHeaderCell>
                  <TableHeaderCell>Packing</TableHeaderCell>
                  <TableHeaderCell>No of Unit</TableHeaderCell>
                  <TableHeaderCell>Quantity</TableHeaderCell>
                  <TableHeaderCell>Free</TableHeaderCell>
                  <TableHeaderCell>Item Value</TableHeaderCell>
                  <TableHeaderCell>Packing Price ₹</TableHeaderCell>
                  <TableHeaderCell>Unit Price ₹</TableHeaderCell>
                  <TableHeaderCell>Tax%</TableHeaderCell>
                  <TableHeaderCell>CGST%</TableHeaderCell>
                  <TableHeaderCell>CGST Amt ₹</TableHeaderCell>
                  <TableHeaderCell>SGST%</TableHeaderCell>
                  <TableHeaderCell>SGST Amt ₹</TableHeaderCell>
                  <TableHeaderCell>IGST%</TableHeaderCell>
                  <TableHeaderCell>IGST Amt ₹</TableHeaderCell>
                  <TableHeaderCell>Purchase Discount%</TableHeaderCell>
                  <TableHeaderCell>Discounted Amt ₹</TableHeaderCell>
                  <TableHeaderCell>Purchase Cost</TableHeaderCell>
                  <TableHeaderCell>MRP ₹</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <EmptyState colSpan="24">
                      No items added yet. Click "Add Item" to get started.
                    </EmptyState>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.hsn}</TableCell>
                      <TableCell>{item.batch}</TableCell>
                      <TableCell>{item.expiry}</TableCell>
                      <TableCell>{item.packing}</TableCell>
                      <TableCell>{item.noOfUnit}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.free}</TableCell>
                      <TableCell>{item.itemValue}</TableCell>
                      <TableCell>{item.packingPrice}</TableCell>
                      <TableCell>{item.unitPrice}</TableCell>
                      <TableCell>{item.tax}</TableCell>
                      <TableCell>{item.cgstPercent}</TableCell>
                      <TableCell>{item.cgstAmt}</TableCell>
                      <TableCell>{item.sgstPercent}</TableCell>
                      <TableCell>{item.sgstAmt}</TableCell>
                      <TableCell>{item.igstPercent}</TableCell>
                      <TableCell>{item.igstAmt}</TableCell>
                      <TableCell>{item.purchaseDiscountPercent}</TableCell>
                      <TableCell>{item.discountedAmt}</TableCell>
                      <TableCell>{item.purchaseCost}</TableCell>
                      <TableCell>{item.mrp}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <WarningButton onClick={() => openModal(item)}>
                            <Edit2 size={12} />
                          </WarningButton>
                          <DangerButton
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 size={12} />
                          </DangerButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </tbody>
            </Table>
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
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                {editingItem ? "Edit Item" : "Add New Item"}
              </h3>
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
                  <Select
                    name="name"
                    value={modalForm.name}
                    onChange={handleModalInputChange}
                    disabled={loadingItems}
                  >
                    <option value="">
                      {loadingItems ? "Loading items..." : "Select Item"}
                    </option>
                    {availableItems.map((item) => (
                      <option key={item.id} value={item.itemName}>
                        {item.itemName}
                      </option>
                    ))}
                  </Select>
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
                  GOODS RECEIPT NOTE - MessINN
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
                  <div className="label">Entered By : xxx</div>
                </div>
                <div className="footer-item">
                  <div className="label">Verified By :yyy</div>
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