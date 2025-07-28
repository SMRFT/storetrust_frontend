import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

// Global Styles
const GlobalStyles = {
  container: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6",
  card: "bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6",
  cardHeader: "text-xl font-semibold text-slate-800 mb-6 pb-3 border-b border-slate-200",
  formGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4",
  formGroup: "flex flex-col space-y-2",
  label: "text-sm font-medium text-slate-700",
  required: "text-red-500",
  input: "px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
  select: "px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white",
  button: {
    primary: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium",
    secondary: "px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200 font-medium",
    success: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 font-medium",
    danger: "px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200",
    warning: "px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
  },
  table: "w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm",
  tableHeader: "bg-slate-100 text-slate-700 font-semibold text-sm",
  tableCell: "px-3 py-2 border-b border-slate-200 text-sm",
  modal: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
  modalContent: "bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto",
  modalHeader: "px-6 py-4 border-b border-slate-200 flex justify-between items-center",
  modalBody: "px-6 py-4",
  modalFooter: "px-6 py-4 border-t border-slate-200 flex justify-end space-x-3"
};

const TravellersIN = () => {
  // Form state for main form
  const [formData, setFormData] = useState({
    purchaseCategory: 'TRAVELLERS IN',
    vendor: 'A CARE MEDICO',
    date: '07/26/2025',
    supplierAddress: 'NO.12,NORTH KIR',
    contactPerson: '',
    phone: '',
    invoiceNo: '001',
    invoiceDate: '07/26/2025',
    creditPeriod: '',
    dueDate: '07/26/2025',
    reference: 'New',
    paymentMode: 'CHEQUE'
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

  const handleSave = () => {
    console.log('Saving data:', { formData, items, summary });
    alert('Data saved successfully!');
  };

  const handleCancel = () => {
    setShowConfirmDialog(true);
  };

  const confirmCancel = () => {
    // Reset all forms
    setFormData({
      purchaseCategory: 'TRAVELLERS IN',
      vendor: 'A CARE MEDICO',
      date: '07/26/2025',
      supplierAddress: 'NO.12,NORTH KIR',
      contactPerson: '',
      phone: '',
      invoiceNo: '001',
      invoiceDate: '07/26/2025',
      creditPeriod: '',
      dueDate: '07/26/2025',
      reference: 'New',
      paymentMode: 'CHEQUE'
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
    <div className={GlobalStyles.container}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Travellers IN</h1>
        
        {/* Container 1: Basic Information */}
        <div className={GlobalStyles.card}>
          <h2 className={GlobalStyles.cardHeader}>Basic Information</h2>
          <div className={GlobalStyles.formGrid}>
            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>
                Purchase Category <span className={GlobalStyles.required}>*</span>
              </label>
              <select
                name="purchaseCategory"
                value={formData.purchaseCategory}
                onChange={handleInputChange}
                className={GlobalStyles.select}
              >
                <option value="TRAVELLERS IN">TRAVELLERS IN</option>
              </select>
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>
                Vendor <span className={GlobalStyles.required}>*</span>
              </label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className={GlobalStyles.select}
              >
                <option value="A CARE MEDICO">A CARE MEDICO</option>
              </select>
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={GlobalStyles.input}
              />
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>Supplier Address</label>
              <input
                type="text"
                name="supplierAddress"
                value={formData.supplierAddress}
                onChange={handleInputChange}
                className={GlobalStyles.input}
              />
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className={GlobalStyles.input}
              />
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={GlobalStyles.input}
              />
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>
                Invoice No <span className={GlobalStyles.required}>*</span>
              </label>
              <input
                type="text"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleInputChange}
                className={GlobalStyles.input}
              />
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>
                Invoice Date <span className={GlobalStyles.required}>*</span>
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                className={GlobalStyles.input}
              />
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>Credit Period</label>
              <input
                type="text"
                name="creditPeriod"
                value={formData.creditPeriod}
                onChange={handleInputChange}
                className={GlobalStyles.input}
              />
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className={GlobalStyles.input}
              />
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>Reference</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className={GlobalStyles.input}
              />
            </div>

            <div className={GlobalStyles.formGroup}>
              <label className={GlobalStyles.label}>Payment Mode</label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleInputChange}
                className={GlobalStyles.select}
              >
                <option value="CHEQUE">CHEQUE</option>
                <option value="CASH">CASH</option>
                <option value="CARD">CARD</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>
        </div>

        {/* Container 2: Items Table */}
        <div className={GlobalStyles.card}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Items</h2>
            <button
              onClick={() => openModal()}
              className={`${GlobalStyles.button.primary} flex items-center space-x-2`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className={GlobalStyles.table}>
              <thead>
                <tr className={GlobalStyles.tableHeader}>
                  <th className={GlobalStyles.tableCell}>Sl.No</th>
                  <th className={GlobalStyles.tableCell}>Name</th>
                  <th className={GlobalStyles.tableCell}>Batch</th>
                  <th className={GlobalStyles.tableCell}>Packing</th>
                  <th className={GlobalStyles.tableCell}>Quantity</th>
                  <th className={GlobalStyles.tableCell}>Free</th>
                  <th className={GlobalStyles.tableCell}>Expiry</th>
                  <th className={GlobalStyles.tableCell}>S.Rate</th>
                  <th className={GlobalStyles.tableCell}>CGST%</th>
                  <th className={GlobalStyles.tableCell}>CGST Amt</th>
                  <th className={GlobalStyles.tableCell}>SGST%</th>
                  <th className={GlobalStyles.tableCell}>SGST Amt</th>
                  <th className={GlobalStyles.tableCell}>IGST%</th>
                  <th className={GlobalStyles.tableCell}>IGST Amt</th>
                  <th className={GlobalStyles.tableCell}>P.Cost</th>
                  <th className={GlobalStyles.tableCell}>Value</th>
                  <th className={GlobalStyles.tableCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="17" className={`${GlobalStyles.tableCell} text-center text-slate-500 py-8`}>
                      No items added yet. Click "Add Item" to get started.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className={GlobalStyles.tableCell}>{index + 1}</td>
                      <td className={GlobalStyles.tableCell}>{item.name}</td>
                      <td className={GlobalStyles.tableCell}>{item.batch}</td>
                      <td className={GlobalStyles.tableCell}>{item.packing}</td>
                      <td className={GlobalStyles.tableCell}>{item.quantity}</td>
                      <td className={GlobalStyles.tableCell}>{item.free}</td>
                      <td className={GlobalStyles.tableCell}>{item.expiry}</td>
                      <td className={GlobalStyles.tableCell}>{item.sRate}</td>
                      <td className={GlobalStyles.tableCell}>{item.cgstPercent}</td>
                      <td className={GlobalStyles.tableCell}>{item.cgstAmt}</td>
                      <td className={GlobalStyles.tableCell}>{item.sgstPercent}</td>
                      <td className={GlobalStyles.tableCell}>{item.sgstAmt}</td>
                      <td className={GlobalStyles.tableCell}>{item.igstPercent}</td>
                      <td className={GlobalStyles.tableCell}>{item.igstAmt}</td>
                      <td className={GlobalStyles.tableCell}>{item.pCost}</td>
                      <td className={GlobalStyles.tableCell}>{item.value}</td>
                      <td className={GlobalStyles.tableCell}>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(item)}
                            className={GlobalStyles.button.warning}
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className={GlobalStyles.button.danger}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Container 3: Summary */}
        <div className={GlobalStyles.card}>
          <h2 className={GlobalStyles.cardHeader}>Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.keys(summary).map((key) => (
              <div key={key} className={GlobalStyles.formGroup}>
                <label className={GlobalStyles.label}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                {key === 'remarks' ? (
                  <textarea
                    name={key}
                    value={summary[key]}
                    onChange={(e) => handleInputChange(e, 'summary')}
                    className={`${GlobalStyles.input} min-h-[80px]`}
                    rows="3"
                  />
                ) : (
                  <input
                    type="number"
                    step="0.01"
                    name={key}
                    value={summary[key]}
                    onChange={(e) => handleInputChange(e, 'summary')}
                    className={GlobalStyles.input}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-8">
          <button
            onClick={handleCancel}
            className={GlobalStyles.button.secondary}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={GlobalStyles.button.success}
          >
            Save GRN
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={GlobalStyles.modal}>
          <div className={GlobalStyles.modalContent}>
            <div className={GlobalStyles.modalHeader}>
              <h3 className="text-lg font-semibold text-slate-800">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={GlobalStyles.modalBody}>
              <div className={GlobalStyles.formGrid}>
                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={modalForm.name}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>Batch</label>
                  <input
                    type="text"
                    name="batch"
                    value={modalForm.batch}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>Packing</label>
                  <input
                    type="text"
                    name="packing"
                    value={modalForm.packing}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={modalForm.quantity}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>Free</label>
                  <input
                    type="number"
                    name="free"
                    value={modalForm.free}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>Expiry</label>
                  <input
                    type="date"
                    name="expiry"
                    value={modalForm.expiry}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>S.Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    name="sRate"
                    value={modalForm.sRate}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>CGST%</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgstPercent"
                    value={modalForm.cgstPercent}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>CGST Amt</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgstAmt"
                    value={modalForm.cgstAmt}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>SGST%</label>
                  <input
                    type="number"
                    step="0.01"
                    name="sgstPercent"
                    value={modalForm.sgstPercent}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>SGST Amt</label>
                  <input
                    type="number"
                    step="0.01"
                    name="sgstAmt"
                    value={modalForm.sgstAmt}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>IGST%</label>
                  <input
                    type="number"
                    step="0.01"
                    name="igstPercent"
                    value={modalForm.igstPercent}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>IGST Amt</label>
                  <input
                    type="number"
                    step="0.01"
                    name="igstAmt"
                    value={modalForm.igstAmt}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>P.Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    name="pCost"
                    value={modalForm.pCost}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>

                <div className={GlobalStyles.formGroup}>
                  <label className={GlobalStyles.label}>Value</label>
                  <input
                    type="number"
                    step="0.01"
                    name="value"
                    value={modalForm.value}
                    onChange={(e) => handleInputChange(e, 'modal')}
                    className={GlobalStyles.input}
                  />
                </div>
              </div>
            </div>

            <div className={GlobalStyles.modalFooter}>
              <button
                onClick={closeModal}
                className={GlobalStyles.button.secondary}
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className={GlobalStyles.button.primary}
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className={GlobalStyles.modal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className={GlobalStyles.modalHeader}>
              <h3 className="text-lg font-semibold text-slate-800">Confirm Cancel</h3>
            </div>
            
            <div className={GlobalStyles.modalBody}>
              <p className="text-slate-600">
                Are you sure you want to cancel? All unsaved data will be lost.
              </p>
            </div>

            <div className={GlobalStyles.modalFooter}>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className={GlobalStyles.button.secondary}
              >
                Keep Editing
              </button>
              <button
                onClick={confirmCancel}
                className={GlobalStyles.button.danger}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravellersIN;