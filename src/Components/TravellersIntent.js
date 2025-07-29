import React, { useState, useRef } from 'react';
function TravellersIntent() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [items, setItems] = useState([]);
  const [isPrintDisabled, setIsPrintDisabled] = useState(true);
  const printRef = useRef();
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  const handleAddToList = () => {
    if (!itemName || !quantity) {
      alert('Please enter item name and quantity');
      return;
    }
    const newItem = {
      id: Date.now(), // temp ID for React key
      date,
      itemName,
      quantity: parseInt(quantity),
    };
    setItems(prev => [...prev, newItem]);
    setItemName('');
    setQuantity('');
    setIsPrintDisabled(false);
  };
  const handleSaveAll = async () => {
    if (items.length === 0) {
      alert('No items to save.');
      return;
    }
    try {
      const response = await fetch(`${StoreTrustbaseurl}travellers-intent/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      });
      if (!response.ok) throw new Error('Failed to save items');
      alert('Items saved to backend!');
      setItems([]);
      setIsPrintDisabled(true);
    } catch (error) {
      console.error(error);
      alert('Something went wrong!');
    }
  };
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'height=600,width=800');
    win.document.write('<html><head><title>Items List</title>');
    win.document.write(`<style>
      table { width: 100%; border-collapse: collapse; margin-top: 10px; font-family: sans-serif; }
      th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
      th { background-color: #3498db; color: white; }
    </style>`);
    win.document.write('</head><body>');
    win.document.write('<h3>Items List</h3>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
    win.close();
    setIsPrintDisabled(true);
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Travellers Intent Form</h2>
      <div style={styles.formGroup}>
        <label style={styles.label}>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Item Name</label>
        <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter item name" style={styles.input} />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Quantity</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" style={styles.input} />
      </div>
      <div style={styles.buttonGroup}>
        <button onClick={handleAddToList} style={{ ...styles.button, backgroundColor: '#f39c12' }}>
          Add to List
        </button>
        <button onClick={handleSaveAll} style={{ ...styles.button, backgroundColor: '#3498db' }}>
          Save All
        </button>
        <button
          onClick={handlePrint}
          disabled={isPrintDisabled}
          style={{
            ...styles.button,
            backgroundColor: '#2ecc71',
            opacity: isPrintDisabled ? 0.6 : 1,
            cursor: isPrintDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          Print Item List
        </button>
      </div>
      <div style={{ marginTop: '30px' }}>
        <h3 style={styles.subheading}>Items List</h3>
        <div ref={printRef}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>Item Name</th>
                <th style={styles.th}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={item.id}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{item.itemName}</td>
                    <td style={styles.td}>{item.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.td} colSpan="3" align="center">
                    No items added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
const styles = {
  container: {
    padding: '30px',
    maxWidth: '700px',
    margin: 'auto',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '25px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '5px',
    color: '#34495e',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
  },
  buttonGroup: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  button: {
    flex: 1,
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  subheading: {
    color: '#2c3e50',
    borderBottom: '1px solid #ccc',
    paddingBottom: '8px',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
};
export default TravellersIntent;