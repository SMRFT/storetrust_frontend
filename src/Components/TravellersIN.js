import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import styled from 'styled-components';
import apiRequest from "./apiRequest";

// Styled Components with Custom Gradient
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #4ED7F1 0%, #6FE6FC 25%, #A8F1FF 75%, #FFFA8D 100%);
  padding: 24px;
`;

const MaxWidthContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(135deg, #4ED7F1, #6FE6FC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(78, 215, 241, 0.2), 0 4px 6px -2px rgba(111, 230, 252, 0.15);
  border: 1px solid rgba(168, 241, 255, 0.3);
  padding: 24px;
  margin-bottom: 24px;
`;

const CardHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(90deg, #4ED7F1, #6FE6FC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.4);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
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
  
  &:focus {
    outline: 2px solid #4ED7F1;
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
  
  &:focus {
    outline: 2px solid #4ED7F1;
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
  
  &:focus {
    outline: 2px solid #4ED7F1;
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
  gap: 8px;
  
  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #4ED7F1, #6FE6FC);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(78, 215, 241, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #6FE6FC, #4ED7F1);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(78, 215, 241, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: linear-gradient(135deg, #A8F1FF, #6FE6FC);
  color: #374151;
  box-shadow: 0 4px 6px -1px rgba(168, 241, 255, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #6FE6FC, #A8F1FF);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(168, 241, 255, 0.4);
  }
`;

const SuccessButton = styled(Button)`
  background: linear-gradient(135deg, #FFFA8D, #A8F1FF);
  color: #374151;
  box-shadow: 0 4px 6px -1px rgba(255, 250, 141, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #A8F1FF, #FFFA8D);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(255, 250, 141, 0.4);
  }
`;

const DangerButton = styled(Button)`
  padding: 4px 8px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
  }
`;

const WarningButton = styled(Button)`
  padding: 4px 8px;
  background: linear-gradient(135deg, #FFFA8D, #f59e0b);
  color: #374151;
  
  &:hover {
    background: linear-gradient(135deg, #f59e0b, #FFFA8D);
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
  box-shadow: 0 10px 15px -3px rgba(78, 215, 241, 0.2), 0 4px 6px -2px rgba(111, 230, 252, 0.15);
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #A8F1FF, #6FE6FC);
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.3);
  font-size: 0.875rem;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.4);
  font-size: 0.875rem;
  text-align: left;
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
  justify-content: flex-end;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  width: 1200px;
  height: 100vh;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(168, 241, 255, 0.3);
  background: linear-gradient(135deg, rgba(168, 241, 255, 0.1), rgba(255, 250, 141, 0.1));
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ModalFooter = styled.div`
  padding: 24px;
  border-top: 1px solid rgba(168, 241, 255, 0.3);
  background: linear-gradient(135deg, rgba(168, 241, 255, 0.05), rgba(255, 250, 141, 0.05));
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 32px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const EmptyState = styled.td`
  text-align: center;
  color: #6b7280;
  padding: 32px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const SmallModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(78, 215, 241, 0.3);
  border: 1px solid rgba(168, 241, 255, 0.3);
  max-width: 448px;
  width: 100%;
  margin: 16px;
`;

const CloseButton = styled.button`
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #4ED7F1;
    transform: scale(1.1);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;


const TravellersIN = () => {
  // Form state for main form
const [formData, setFormData] = useState({
  purchaseCategory: '',
  vendor: '',
  date: new Date().toISOString().split('T')[0], // Current date
  supplierAddress: '',
  contactPerson: '',
  phone: '',
  invoiceNo: '',
  invoiceDate: '',
  creditPeriod: '',
  dueDate: '',
  reference: '',
  paymentMode: ''
});

  // Items state
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Modal form state
  const [modalForm, setModalForm] = useState({
    name: '',
    batch: '',
    packing: '',
    quantity: '',
    free: '',
    expiry: '',
    sRate: '',
    cgstPercent: '',
    cgstAmt: '',
    sgstPercent: '',
    sgstAmt: '',
    igstPercent: '',
    igstAmt: '',
    pCost: '',
    value: ''
  });

  // Summary state
  const [summary, setSummary] = useState({
    nonTaxableAmount: 0.00,
    taxableAmount: 0.00,
    taxPaidToSupplier: 0.00,
    localTax: 0.00,
    remarks: '',
    cgst: 0.00,
    sgst: 0.00,
    igst: 0.00,
    cess: 0.00,
    centralSalesTax: 0.00,
    roundAmount: 0.00,
    totalAmount: 0.00,
    taxOnFreeItems: 0.00,
    totalDiscount: 0.00,
    netInvoiceAmount: 0.00,
    quotationRate: 0.00,
    courierTransportCharge: 0.00
  });

  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleInputChange = (e, section = 'form') => {
    const { name, value } = e.target;
    if (section === 'form') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (section === 'modal') {
      setModalForm(prev => ({ ...prev, [name]: value }));
    } else if (section === 'summary') {
      setSummary(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item.id);
      setModalForm(item);
    } else {
      setEditingItem(null);
      setModalForm({
        name: '',
        batch: '',
        packing: '',
        quantity: '',
        free: '',
        expiry: '',
        sRate: '',
        cgstPercent: '',
        cgstAmt: '',
        sgstPercent: '',
        sgstAmt: '',
        igstPercent: '',
        igstAmt: '',
        pCost: '',
        value: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleAddItem = () => {
    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem ? { ...modalForm, id: editingItem } : item
      ));
    } else {
      const newItem = { ...modalForm, id: Date.now() };
      setItems(prev => [...prev, newItem]);
    }
    closeModal();
  };

  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

const handleSubmit = async () => {
  try {
    // Validate required fields before submission
    const requiredFields = {     
      invoiceNo: 'Invoice Number',
      purchaseCategory: 'Purchase Category'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === '') {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Format dates to YYYY-MM-DD if they exist
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      // Try to parse and format the date
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      } catch (error) {
        console.warn('Date formatting error:', error);
        return '';
      }
    };

    const submitData = {
      ...formData,
      // Ensure dates are in correct format
      invoiceDate: formatDate(formData.invoiceDate),
      dueDate: formatDate(formData.dueDate),
      date: formatDate(formData.date || new Date().toISOString().split('T')[0]),
      
      // Ensure required fields are not empty strings
      vendor: formData.vendor?.trim() || null,
      invoiceNo: formData.invoiceNo?.trim() || null,
      purchaseCategory: formData.purchaseCategory?.trim() || null,
      
      items: items || [],
      summary: summary || {},
      created_date: new Date().toISOString(),
      lastmodified_date: new Date().toISOString()
    };

    console.log('Submitting data:', submitData); // Debug log

    const response = await fetch(`${StoreTrustbaseurl}travellers-in/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Data submitted successfully!');
      // Reset form after successful submission
      confirmCancel();
    } else {
      // Show detailed error messages
      if (result.errors) {
        const errorMessages = [];
        for (const [field, messages] of Object.entries(result.errors)) {
          errorMessages.push(`${field}: ${messages.join(', ')}`);
        }
        alert(`Validation errors:\n${errorMessages.join('\n')}`);
      } else {
        alert(`Error: ${result.message || 'Unknown error occurred'}`);
      }
    }
  } catch (error) {
    console.error('Submit error:', error);
    alert('Network error. Please check your connection and try again.');
  }
};
  const handleCancel = () => {
    setShowConfirmDialog(true);
  };

  const confirmCancel = () => {
    // Reset all forms
    setFormData({
      purchaseCategory: '',
      vendor: '',
      date: '',
      supplierAddress: '',
      contactPerson: '',
      phone: '',
      invoiceNo: '',
      invoiceDate: '',
      creditPeriod: '',
      dueDate: '',
      reference: '',
      paymentMode: ''
    });
    setItems([]);
    setSummary({
      nonTaxableAmount: 0.00,
      taxableAmount: 0.00,
      taxPaidToSupplier: 0.00,
      localTax: 0.00,
      remarks: '',
      cgst: 0.00,
      sgst: 0.00,
      igst: 0.00,
      cess: 0.00,
      centralSalesTax: 0.00,
      roundAmount: 0.00,
      totalAmount: 0.00,
      taxOnFreeItems: 0.00,
      totalDiscount: 0.00,
      netInvoiceAmount: 0.00,
      quotationRate: 0.00,
      courierTransportCharge: 0.00
    });
    setShowConfirmDialog(false);
  };

  return (
    <Container>
      <MaxWidthContainer>
        <Title>Travellers IN</Title>
        
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
    <option value="TRAVELLERS IN CREDIT">TRAVELLERS IN CREDIT</option>
    <option value="TRAVELLERS IN CASH">TRAVELLERS IN CASH</option>
  </Select>
</FormGroup>

            <FormGroup>
              <Label>
                Vendor <Required>*</Required>
              </Label>
              <Select
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
              >
                <option value="A CARE MEDICO">A CARE MEDICO</option>
              </Select>
            </FormGroup>

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
                value={formData.creditPeriod}
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
              <Label>Reference</Label>
              <Input
                type="text"
                name="reference"
                value={formData.reference}
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
                <option value="CARD">CARD</option>
                <option value="UPI">UPI</option>
              </Select>
            </FormGroup>
          </FormGrid>
        </Card>

        {/* Container 2: Items Table */}
        <Card>
          <HeaderSection>
            <CardHeader style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>Items</CardHeader>
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
                  <TableHeaderCell>Batch</TableHeaderCell>
                  <TableHeaderCell>Packing</TableHeaderCell>
                  <TableHeaderCell>Quantity</TableHeaderCell>
                  <TableHeaderCell>Free</TableHeaderCell>
                  <TableHeaderCell>Expiry</TableHeaderCell>
                  <TableHeaderCell>S.Rate</TableHeaderCell>
                  <TableHeaderCell>CGST%</TableHeaderCell>
                  <TableHeaderCell>CGST Amt</TableHeaderCell>
                  <TableHeaderCell>SGST%</TableHeaderCell>
                  <TableHeaderCell>SGST Amt</TableHeaderCell>
                  <TableHeaderCell>IGST%</TableHeaderCell>
                  <TableHeaderCell>IGST Amt</TableHeaderCell>
                  <TableHeaderCell>P.Cost</TableHeaderCell>
                  <TableHeaderCell>Value</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <EmptyState colSpan="17">
                      No items added yet. Click "Add Item" to get started.
                    </EmptyState>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.batch}</TableCell>
                      <TableCell>{item.packing}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.free}</TableCell>
                      <TableCell>{item.expiry}</TableCell>
                      <TableCell>{item.sRate}</TableCell>
                      <TableCell>{item.cgstPercent}</TableCell>
                      <TableCell>{item.cgstAmt}</TableCell>
                      <TableCell>{item.sgstPercent}</TableCell>
                      <TableCell>{item.sgstAmt}</TableCell>
                      <TableCell>{item.igstPercent}</TableCell>
                      <TableCell>{item.igstAmt}</TableCell>
                      <TableCell>{item.pCost}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <WarningButton onClick={() => openModal(item)}>
                            <Edit2 size={12} />
                          </WarningButton>
                          <DangerButton onClick={() => handleDeleteItem(item.id)}>
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
          <SummaryGrid>
            {Object.keys(summary).map((key) => (
              <FormGroup key={key}>
                <Label>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
                {key === 'remarks' ? (
                  <TextArea
                    name={key}
                    value={summary[key]}
                    onChange={(e) => handleInputChange(e, 'summary')}
                    rows="3"
                  />
                ) : (
                  <Input
                    type="number"
                    step="0.01"
                    name={key}
                    value={summary[key]}
                    onChange={(e) => handleInputChange(e, 'summary')}
                  />
                )}
              </FormGroup>
            ))}
          </SummaryGrid>
        </Card>

        {/* Action Buttons */}
        <ActionSection>
          <SecondaryButton onClick={handleCancel}>
            Cancel
          </SecondaryButton>
          <SuccessButton onClick={handleSubmit}>
  Submit GRN
</SuccessButton>
        </ActionSection>
      </MaxWidthContainer>

      {/* Modal */}
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <CloseButton onClick={closeModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <FormGrid>
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={modalForm.name}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Batch</Label>
                  <Input
                    type="text"
                    name="batch"
                    value={modalForm.batch}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Packing</Label>
                  <Input
                    type="text"
                    name="packing"
                    value={modalForm.packing}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    name="quantity"
                    value={modalForm.quantity}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Free</Label>
                  <Input
                    type="number"
                    name="free"
                    value={modalForm.free}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Expiry</Label>
                  <Input
                    type="date"
                    name="expiry"
                    value={modalForm.expiry}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>S.Rate</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="sRate"
                    value={modalForm.sRate}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>CGST%</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="cgstPercent"
                    value={modalForm.cgstPercent}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>CGST Amt</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="cgstAmt"
                    value={modalForm.cgstAmt}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>SGST%</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="sgstPercent"
                    value={modalForm.sgstPercent}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>SGST Amt</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="sgstAmt"
                    value={modalForm.sgstAmt}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>IGST%</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="igstPercent"
                    value={modalForm.igstPercent}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>IGST Amt</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="igstAmt"
                    value={modalForm.igstAmt}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>P.Cost</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="pCost"
                    value={modalForm.pCost}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Value</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="value"
                    value={modalForm.value}
                    onChange={(e) => handleInputChange(e, 'modal')}
                  />
                </FormGroup>
              </FormGrid>
            </ModalBody>

            <ModalFooter>
              <SecondaryButton onClick={closeModal}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleAddItem}>
                {editingItem ? 'Update Item' : 'Add Item'}
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
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>Confirm Cancel</h3>
            </ModalHeader>
            
            <ModalBody>
              <p style={{ color: '#4b5563', margin: 0 }}>
                Are you sure you want to cancel? All unsaved data will be lost.
              </p>
            </ModalBody>

            <ModalFooter>
              <SecondaryButton onClick={() => setShowConfirmDialog(false)}>
                Keep Editing
              </SecondaryButton>
              <DangerButton onClick={confirmCancel}>
                Yes, Cancel
              </DangerButton>
            </ModalFooter>
          </SmallModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default TravellersIN;