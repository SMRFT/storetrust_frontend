import React, { useState, useRef, useEffect, useCallback } from 'react';
import apiRequest from '../apiRequest';
import {
  FaPlus,
  FaSave,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaCalendarAlt,
} from 'react-icons/fa';

import{
  Container, Header,  TableHeader as thead, FormGroup,InputWrapper, IconWrapper,  
  TableCell as Td, TableActionButton, FormRow, AddButtonContainer, AddButton, ButtonGroup, Button, Title, Subheading,
  FiltersSection, FiltersGrid, Label, Input, Table, TableHeader as Th, CloseButton, SubTable, SubTh, SubTd, 
} from "../StyledComponents";

// Helper: to Roman numeral
const toRomanNumeral = (num) => {
  if (!num || num < 1) return '';
  const romanMap = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' },
  ];
  let result = '';
  for (const { value, numeral } of romanMap) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
};


// get current user info from localStorage
const getCurrentUser = () => {
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('userEmail');
  return name || email || 'Unknown User';
};
const printTableRef = (items, fromDate = "", toDate = "", createdBy = "Unknown User") => {
  const formattedFromDate = fromDate
    ? new Date(fromDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const formattedToDate = toDate
    ? new Date(toDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const tableHtml = `
<div style="text-align: center; font-weight: bold; font-size: 18px;">
  SHANMUGA HOSPITAL LIMITED
</div>
<div style="text-align: center; font-size: 14px;">
  51/24, Saradha College Road, Salem - 636007
</div>

<div style="margin: 10px 0; font-size: 14px; text-align: left;">
  ${ (formattedFromDate || formattedToDate) ? ('Date' + (formattedFromDate && formattedToDate ?  ': ' : '') + ': ' + (formattedFromDate ? formattedFromDate : '') + (formattedFromDate && formattedToDate ? '' : '') + (!formattedFromDate && formattedToDate ? formattedToDate : '')) : '' }
</div>

    <table style="width:100%; border-collapse:collapse; font-family:'Segoe UI',sans-serif; margin-top:20px;">
      <thead>
        <tr>
          <th style="background:#f2f2f2;color:black;font-weight:bold;border:1px solid #d6f0ff;padding:12px;text-align:left;">S.No</th>
          <th style="background:#f2f2f2;color:black;font-weight:bold;border:1px solid #d6f0ff;padding:12px;text-align:left;">Item Name</th>
          <th style="background:#f2f2f2;color:black;font-weight:bold;border:1px solid #d6f0ff;padding:12px;text-align:left;">Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${
          items.length > 0
            ? items
                .map(
                  (item, idx) => `
          <tr>
            <td style="border:1px solid #d6f0ff;padding:12px;text-align:left;">${idx + 1}</td>
            <td style="border:1px solid #d6f0ff;padding:12px;text-align:left;">${item.itemName}</td>
            <td style="border:1px solid #d6f0ff;padding:12px;text-align:left;">${item.quantity}</td>
          </tr>
          `
                )
                .join("")
            : `<tr>
            <td colspan="3" style="border:1px solid #d6f0ff;padding:12px;text-align:center;">No items added yet.</td>
          </tr>`
        }
      </tbody>
    </table>

    <div style="margin-top:40px; display:flex; justify-content:flex-end; font-size:14px; font-style:italic;">
      Prepared by: <b style="margin-left:6px;">${createdBy}</b>
    </div>
  `;

  const printWin = window.open("", "_blank", "width=800,height=600");
  printWin.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #d6f0ff; padding: 12px; text-align: left; }
          th { background-color: #00bfff; color: white; }
        </style>
      </head>
      <body>
        ${tableHtml}
      </body>
    </html>
  `);
  printWin.document.close();
  printWin.focus();
  printWin.print();
  printWin.close();
};


function TravellersIntent() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [items, setItems] = useState([]);
  const [savedIntents, setSavedIntents] = useState([]);
  const [filters, setFilters] = useState({
    from_date: new Date().toISOString().split('T')[0],
    to_date: new Date().toISOString().split('T')[0],
  });
  const [expandedIntents, setExpandedIntents] = useState(new Set());
  const [editingIntentNumber, setEditingIntentNumber] = useState(null);
  const [editingDate, setEditingDate] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItemName, setEditedItemName] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [hsnNumber, setHsnNumber] = useState(''); // holds the current selection's HSN
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const printRef = useRef();
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;
  const handlePrintIntent = (intent) => {
    const safeItems = Array.isArray(intent.items)
      ? intent.items
      : typeof intent.items === 'string'
      ? JSON.parse(intent.items || '[]')
      : [];

    printTableRef(safeItems, filters.from_date, filters.to_date, getCurrentUser());
  };
  // Fetch items list for dropdown
useEffect(() => {
  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const result = await apiRequest(`${StoreTrustbaseurl}items/list/`, 'GET');
      if (result.success) {
        // Filter out items with empty/null/undefined hsn
        const filteredItems = (result.data || []).filter(
          (item) => item.hsn && item.hsn.trim() !== ''
        );
        setAvailableItems(filteredItems);
      } else {
        console.error('Failed to fetch items:', result.error);
        setAvailableItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setAvailableItems([]);
    } finally {
      setLoadingItems(false);
    }
  };
  fetchItems();
}, [StoreTrustbaseurl]);


  const fetchSavedData = useCallback(async () => {
    try {
      let url = `${StoreTrustbaseurl}travellers-intent/by-date-range/`;
      const params = [];
      if (filters.from_date) params.push(`from_date=${filters.from_date}`);
      if (filters.to_date) params.push(`to_date=${filters.to_date}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await apiRequest(url, 'GET');
      if (response.success) {
const parsedData = (response.data || [])
  .filter(intent => intent.is_active !== false) // ✅ filter inactive intents
  .map((intent) => ({
    ...intent,
    items: (typeof intent.items === 'string' ? JSON.parse(intent.items) : intent.items)
      .filter((item) => item.is_active !== false), // ✅ keep only active items
  }));

setSavedIntents(parsedData);

      } else {
        console.error('Error fetching traveller intents:', response.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Something went wrong while fetching saved data.');
    }
  }, [StoreTrustbaseurl, filters.from_date, filters.to_date]);

  useEffect(() => {
    fetchSavedData();
  }, [fetchSavedData]);

  const handleItemChange = (e) => {
    const selectedName = e.target.value;
    setSelectedItem(selectedName);
    setItemName(selectedName);

    const selectedItemObj = availableItems.find((item) => item.itemName === selectedName);
    const hsnValue = selectedItemObj ? selectedItemObj.hsn || '' : '';
    setHsnNumber(hsnValue);
  };

  const handleAddToList = () => {
    if (!itemName || !quantity) {
      alert('Please enter item name and quantity');
      return;
    }
    const newItem = {
      id: Date.now(),
      date,
      itemName,
      hsn: hsnNumber, // IMPORTANT: store as 'hsn' (backend expects this key)
      status: 'Pending',
      is_active: true,
      quantity: parseInt(quantity, 10),
    };
    setItems((prev) => [...prev, newItem]);
    setItemName('');
    setQuantity('');
    setSelectedItem('');
    setHsnNumber('');
  };

  const handleSaveAll = async () => {
    if (items.length === 0) {
      alert('No items to save.');
      return;
    }

    try {
      const currentUser =
        localStorage.getItem('username') ||
        localStorage.getItem('user') ||
        localStorage.getItem('name') ||
        'Unknown User';

      // Map each local item to the exact payload shape the API expects
      const payloadItems = items.map((it, index) => ({
        item_id: (index + 1).toString(),
        itemName: it.itemName,
        quantity: it.quantity,
        hsn: it.hsn, // IMPORTANT: send 'hsn' from the item, not component-level state
        status: 'Pending',
        is_active: true,
       
        intent_status: null,
      }));

      const data = {
        date,
        items: payloadItems,
        
      };

      const response = await apiRequest(`${StoreTrustbaseurl}travellers-intent/`, 'POST', data);
      if (!response.success) throw new Error(response.error || 'Failed to save items');

      alert('Successfully saved');
      setItems([]);
      setHsnNumber('');
      fetchSavedData();
      // Print the just-saved items (use payloadItems because items state was cleared)
      printTableRef(payloadItems, filters.from_date, filters.to_date, currentUser);
    } catch (error) {
      console.error(error);
      alert('Something went wrong!');
    }
  };

  const handleDeleteSavedItem = async (intentNumber, intentDate, itemId, itemHsn) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    try {
      const currentUser =
        localStorage.getItem('username') ||
        localStorage.getItem('user') ||
        localStorage.getItem('name') ||
        'Unknown User';

      const data = {
        intent_number: intentNumber,
        date: intentDate,
        item_id: itemId,
        itemName: editedItemName,
        quantity: parseInt(editedQuantity || '0', 10),
        hsn: itemHsn || '', // forward the item's HSN (not strictly needed for delete, but harmles
        intent_status: null,
      };

      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-intent/soft-delete-item/?intent_number=${encodeURIComponent(
          intentNumber
        )}&date=${intentDate}&item_id=${itemId}`,
        'DELETE',
        data
      );

      if (response.success) {
        alert('Item soft-deleted successfully');
        await fetchSavedData();
      } else {
        alert('Failed to delete item.');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting item.');
    }
  };

  const handleDeleteAllByIntent = async (intentNumber, intentDate) => {
    if (!intentNumber || !intentDate) {
      alert('Missing intent number or date for delete-all action.');
      return;
    }

    const confirmDelete = window.confirm(`Delete all items for intent ${intentNumber}?`);
    if (!confirmDelete) return;

    try {
      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-intent/soft-delete-intent/?intent_number=${encodeURIComponent(
          intentNumber
        )}&date=${intentDate}`,
        'DELETE'
      );

      if (response.success) {
        alert('All items for this intent deleted successfully');
        setExpandedIntents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(intentNumber);
          return newSet;
        });
        setSavedIntents((prevIntents) =>
          prevIntents.filter((intent) => !(intent.intent_number === intentNumber && intent.date === intentDate))
        );
      } else {
        alert(`Failed to delete all items: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting all items for this intent.');
    }
  };

  const handleEditSavedItem = (intent, item) => {
    const intentIdentifier = intent.intent_number || intent.id;
    const itemIdentifier = item.item_id || item.id;

    if (!intentIdentifier) {
      alert('Intent identifier not found. Cannot edit item.');
      return;
    }
    if (!itemIdentifier) {
      alert('Item identifier not found. Cannot edit item.');
      return;
    }

    setEditingIntentNumber(intentIdentifier);
    setEditingDate(intent.date);
    setEditingItemId(itemIdentifier);
    setEditedItemName(item.itemName);
    setEditedQuantity(String(item.quantity));
    setHsnNumber(item.hsn || ''); // ensure edits carry the correct HSN in the PATCH payload
  };

  const handleCancelEdit = () => {
    setEditingIntentNumber(null);
    setEditingDate(null);
    setEditingItemId(null);
    setEditedItemName('');
    setEditedQuantity('');
    setHsnNumber('');
  };

  const handleSaveEditedItem = async () => {
    if (!editedItemName || !editedQuantity) {
      alert('Please enter a valid item name and quantity.');
      return;
    }

    if (!editingIntentNumber || !editingDate || !editingItemId) {
      alert('Missing required identifiers for editing. Please try again.');
      return;
    }

    try {
      const currentUser =
        localStorage.getItem('username') ||
        localStorage.getItem('user') ||
        localStorage.getItem('name') ||
        'Unknown User';

      const data = {
        intent_number: editingIntentNumber,
        date: editingDate,
        items: [
          {
            item_id: editingItemId,
            itemName: editedItemName,
            quantity: parseInt(editedQuantity, 10),
            hsn: hsnNumber || '', // send 'hsn' in edit payload
            status: 'Pending',
            is_active: true,
          },
        ],
       
        
        intent_status: null,
      };

      const response = await apiRequest(
        `${StoreTrustbaseurl}travellers-intent/update-item/`,
        'PATCH',
        data
      );

      if (response.success) {
        alert('Item updated successfully.');
        handleCancelEdit();
        await fetchSavedData();
      } else {
        console.error('Update failed:', response);
        alert(`Failed to update item: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating item.');
    }
  };

  const handleToggleView = (intentNumber) => {
    setExpandedIntents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(intentNumber)) {
        newSet.delete(intentNumber);
      } else {
        newSet.add(intentNumber);
      }
      return newSet;
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      from_date: '',
      to_date: '',
    });
  };
  
  return (
    <Container>
      <Header>
      <Title>Travellers Intent Form</Title>
      </Header>
      <FormRow>
  {/* Date */}
  <FormGroup style={{ flex: 1 }}>
    <Label>Date</Label>
    <InputWrapper>
      <IconWrapper>
        <FaCalendarAlt />
      </IconWrapper>
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ paddingLeft: '35px' }}
      />
    </InputWrapper>
  </FormGroup>

  {/* Item Name */}
{/* Item Name */}
<FormGroup style={{ flex: 1 }}>
  <Label>Item Name</Label>
  <InputWrapper className="dropdown-container" style={{ position: 'relative' }}>
    <input
      type="text"
      value={selectedItem}
      onFocus={() => setShowDropdown(true)} // 👈 show dropdown on focus
      onChange={(e) => {
        const value = e.target.value;
        setSelectedItem(value);
        setItemName(value);
        setShowDropdown(true); // 👈 keep dropdown open while typing
      }}
      placeholder={loadingItems ? 'Loading...' : 'Type or select item'}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        fontSize: '16px',
        outline: 'none',
        backgroundColor: '#F9F9F9',
      }}
    />
    <FaChevronDown
      onClick={() => setShowDropdown((prev) => !prev)} // 👈 toggle dropdown manually
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#32443fff',
      }}
    />

    {/* 👇 Dropdown list */}
    {showDropdown && (
      <div
        style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          width: '100%',
          maxHeight: '180px',
          overflowY: 'auto',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '6px',
          zIndex: 10,
        }}
      >
{availableItems
  .filter((item) =>
    item.itemName
      .toLowerCase()
      .startsWith(selectedItem.toLowerCase())
  )
  .slice(0, 30)
  .map((item) => (

            <div
              key={item.id}
              onClick={() => {
                setSelectedItem(item.itemName);
                setItemName(item.itemName);
                setHsnNumber(item.hsn || '');
                setShowDropdown(false); // 👈 close dropdown on select
              }}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                backgroundColor: '#fff',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#f5f5f5')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#fff')
              }
            >
              {item.itemName}
            </div>
          ))}
      </div>
    )}
  </InputWrapper>
</FormGroup>


  {/* HSN Number */}
  <FormGroup style={{ flex: 1 }}>
    <Label>HSN Number</Label>
    <Input type="text" value={hsnNumber} readOnly placeholder="HSN will appear here" />
  </FormGroup>

  {/* Quantity */}
  <FormGroup style={{ flex: 1 }}>
    <Label>Quantity</Label>
    <Input
      type="number"
      value={quantity}
      onChange={(e) => setQuantity(e.target.value)}
      placeholder="Enter quantity"
    />
  </FormGroup>
</FormRow>

      <AddButtonContainer>
        <AddButton onClick={handleAddToList}>
          <FaPlus /> Add
        </AddButton>
      </AddButtonContainer>

      <div style={{ marginTop: '20px' }}>
        <Subheading>Items List</Subheading>
        <div ref={printRef}>
          <Table>
            <thead>
              <tr>
                <Th>S.No</Th>
                <Th>Item Name</Th>
                <Th>Quantity</Th>
                <Th>Delete Item</Th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={item.id}>
                    <Td>{index + 1}</Td>
                    <Td>{item.itemName}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>
                      <TableActionButton
                        onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                        color="#e74c3c"
                        title="Remove"
                      >
                        <FaTrash />
                      </TableActionButton>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan="4" align="center">
                    No items added yet.
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>

          <ButtonGroup>
            <Button onClick={handleSaveAll} bg="#3498db">
              <FaSave /> Save
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <Subheading>Saved Traveller Intents</Subheading>

        <FiltersSection>
          <FiltersGrid>
            <FormGroup>
              <Label>From Date</Label>
              <InputWrapper>
                <IconWrapper>
                  <FaCalendarAlt />
                </IconWrapper>
                <Input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) => handleFilterChange('from_date', e.target.value)}
                  style={{ paddingLeft: '35px' }}
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>To Date</Label>
              <InputWrapper>
                <IconWrapper>
                  <FaCalendarAlt />
                </IconWrapper>
                <Input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) => handleFilterChange('to_date', e.target.value)}
                  style={{ paddingLeft: '35px' }}
                />
              </InputWrapper>
            </FormGroup>

            <ButtonGroup style={{ justifyContent: 'flex-end', display: 'flex', alignItems: 'flex-end' }}>
              <Button onClick={clearFilters} bg="#f39c12">
                Clear
              </Button>
            </ButtonGroup>
          </FiltersGrid>
        </FiltersSection>

        <Table>
          <thead>
            <tr>
              <Th>S.No</Th>
              <Th>Date</Th>
              <Th>Intent Number</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {savedIntents.length > 0 ? (
              savedIntents.map((intent, index) => {
                const intentId = intent.intent_number || intent.id;
                const isExpanded = expandedIntents.has(intentId);

                return (
                  <React.Fragment key={`${intentId}-${intent.date}`}>
                    <tr>
                      <Td>{index + 1}</Td>
                      <Td>
                        {new Date(intent.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Td>
                      <Td>{intentId}</Td>
                      <Td>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <TableActionButton
                            onClick={() => handleToggleView(intentId)}
                            color="#2980b9"
                            title={isExpanded ? 'Hide' : 'View'}
                          >
                            {isExpanded ? <FaEyeSlash /> : <FaEye />}
                          </TableActionButton>
                    
                          <TableActionButton
                            onClick={() => handleDeleteAllByIntent(intentId, intent.date)}
                            color="#e74c3c"
                            title="Delete All"
                          >
                            <FaTrash />
                          </TableActionButton>
                        </div>
                      </Td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <Td colSpan="4">
                          <SubTable>
                            <thead>
                              <tr>
                                <SubTh>Item Name</SubTh>
                                <SubTh>Quantity</SubTh>
                                <SubTh>Actions</SubTh>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(intent.items) && intent.items.length > 0 ? (
                                intent.items.map((item, itemIndex) => {
                                  const itemKey = item.item_id || item.id;
                                  const isEditing =
                                    editingIntentNumber === intentId &&
                                    editingDate === intent.date &&
                                    editingItemId === itemKey;

                                  return (
                                    <tr key={`${intentId}-${itemKey}`}>
                                      <SubTd>
                                          {`${toRomanNumeral(itemIndex + 1)}. ${item.itemName}`}
                                      </SubTd>
                                      <SubTd>
                                        {isEditing ? (
                                          <Input
                                            type="number"
                                            value={editedQuantity}
                                            onChange={(e) => setEditedQuantity(e.target.value)}
                                          />
                                        ) : (
                                          item.quantity
                                        )}
                                      </SubTd>
                                      <SubTd>
                                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                          {isEditing ? (
                                            <>
                                              <TableActionButton
                                                onClick={handleSaveEditedItem}
                                                color='#27ae60'
                                                title="Save"
                                              >
                                                <FaSave />
                                              </TableActionButton>
                                              <TableActionButton
                                                onClick={handleCancelEdit}
                                                color="#c0392b"
                                                title="Cancel"
                                              >
                                                <FaTrash />
                                              </TableActionButton>
                                            </>
                                          ) : (
                                            <>
                                              <TableActionButton
                                                onClick={() => handleEditSavedItem(intent, item)}
                                                color="#000000"
                                                title="Edit"
                                              >
                                                <FaEdit />
                                              </TableActionButton>
                                              <TableActionButton
                                                onClick={() =>
                                                  handleDeleteSavedItem(
                                                    intentId,
                                                    intent.date,
                                                    item.item_id || item.id,
                                                    item.hsn || ''
                                                  )
                                                }
                                                color="#e74c3c"
                                                title="Delete"
                                              >
                                                <FaTrash />
                                              </TableActionButton>
                                            </>
                                          )}
                                        </div>
                                      </SubTd>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <SubTd colSpan="3" style={{ textAlign: 'center' }}>
                                    No items available
                                  </SubTd>
                                </tr>
                              )}
                            </tbody>
                          </SubTable>
                        </Td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <Td colSpan="4" align="center">
                  No saved intents found.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
export default TravellersIntent;