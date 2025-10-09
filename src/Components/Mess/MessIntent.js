import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import apiRequest from "../apiRequest";
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

// Styled Components (same as TravellersIntent)
const Container = styled.div`
  padding: 30px;
  max-width: 900px;
  margin: auto;
  background: #e6f7ff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.15);
  font-family: 'Segoe UI', sans-serif;
`;

const Heading = styled.h2`
  text-align: center;
  color: #007acc;
  margin-bottom: 25px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const SmallFormGroup = styled(FormGroup)`
  flex: 1;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #005b96;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #b3e0ff;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  background-color: #f0fbff;
  &:focus {
    border-color: #66d9ff;
    box-shadow: 0 0 5px rgba(0, 191, 255, 0.3);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  min-width: 120px;
  height: 36px;
  background-color: ${(props) => props.bg || '#00bfff'};
  transition: all 0.3s ease;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background-color: ${(props) => (props.disabled ? props.bg : '#009acd')};
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(-1px)')};
    box-shadow: ${(props) => (props.disabled ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.15)')};
  }
  &:active {
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(0)')};
  }
`;

const TableActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.color || '#2980b9'};
  font-size: 14px;
  margin: 0 4px;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  &:hover {
    background-color: #e0f0ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  &:active {
    transform: translateY(0);
  }
`;

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const AddButton = styled(Button)`
  background-color: #f39c12;
  min-width: 100px;
  &:hover {
    background-color: #e67e22;
  }
`;

const Subheading = styled.h3`
  color: #007acc;
  border-bottom: 2px solid #cceeff;
  padding-bottom: 8px;
  margin: 30px 0 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #ffffff;
  font-family: sans-serif;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #00bfff;
  color: white;
  padding: 12px;
  border: 1px solid #d6f0ff;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #d6f0ff;
  text-align: left;
`;

const SubTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #f8fafc;
  margin: 10px 0;
`;

const SubTh = styled.th`
  background-color: #e0f0ff;
  color: #005b96;
  padding: 8px;
  border: 1px solid #d6f0ff;
  text-align: left;
`;

const SubTd = styled.td`
  padding: 8px;
  border: 1px solid #d6f0ff;
  text-align: left;
`;

const FiltersSection = styled.div`
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: center;
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

function MessIntent() {
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
  const [hsnNumber, setHsnNumber] = useState('');
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [isPrintDisabled, setIsPrintDisabled] = useState(true);
  const printRef = useRef();
  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // Fetch items list for dropdown
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const result = await apiRequest(`${StoreTrustbaseurl}items/list/`, 'GET');
        if (result.success) {
          setAvailableItems(result.data || []);
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
      let url = `${StoreTrustbaseurl}mess-intent/by-date-range/`;
      const params = [];
      if (filters.from_date) params.push(`from_date=${filters.from_date}`);
      if (filters.to_date) params.push(`to_date=${filters.to_date}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiRequest(url, 'GET');
      if (response.success) {
        const parsedData = (response.data || []).map((intent) => ({
          ...intent,
          items: typeof intent.items === 'string' ? JSON.parse(intent.items) : intent.items,
        }));
        setSavedIntents(parsedData);
      } else {
        console.error('Error fetching mess intents:', response.error);
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
      hsn: hsnNumber,
      status: 'Pending',
      is_active: true,
      quantity: parseInt(quantity, 10),
    };
    setItems((prev) => [...prev, newItem]);
    setItemName('');
    setQuantity('');
    setSelectedItem('');
    setHsnNumber('');
    setIsPrintDisabled(false);
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
      
      const payloadItems = items.map((it, index) => ({
        item_id: (index + 1).toString(),
        itemName: it.itemName,
        quantity: it.quantity,
        hsn: it.hsn,
        status: 'Pending',
        is_active: true,
        lastmodified_by: currentUser,
        intent_status: null,
      }));

      const data = {
        date,
        items: payloadItems,
        auth_user_id: currentUser,
      };

      const response = await apiRequest(`${StoreTrustbaseurl}mess-intent/`, 'POST', data);
      if (!response.success) throw new Error(response.error || 'Failed to save items');
      
      alert('Successfully saved');
      setItems([]);
      setHsnNumber('');
      setIsPrintDisabled(true);
      fetchSavedData();
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
        hsn: itemHsn || '',
        lastmodified_by: currentUser,
        auth_user_id: currentUser,
        intent_status: null,
      };

      const response = await apiRequest(
        `${StoreTrustbaseurl}mess-intent/soft-delete-item/?intent_number=${encodeURIComponent(
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
        `${StoreTrustbaseurl}mess-intent/soft-delete-intent/?intent_number=${encodeURIComponent(
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
    setHsnNumber(item.hsn || '');
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
            hsn: hsnNumber || '',
            status: 'Pending',
            is_active: true,
          },
        ],
        lastmodified_by: currentUser,
        auth_user_id: currentUser,
        intent_status: null,
      };

      const response = await apiRequest(
        `${StoreTrustbaseurl}mess-intent/update-item/`,
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

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'height=600,width=800');
    win.document.write('<html><head><title>Mess Items List</title>');
    win.document.write(`<style>
      table { width: 100%; border-collapse: collapse; margin-top: 10px; font-family: sans-serif; }
      th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
      th { background-color: #00bfff; color: white; }
    </style>`);
    win.document.write('</head><body>');
    win.document.write('<h3>Mess Items List</h3>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <Container>
      <Heading>Mess Intent Form</Heading>
      <FormRow>
        <SmallFormGroup>
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
        </SmallFormGroup>
        <SmallFormGroup>
          <Label>Item Name</Label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedItem}
              onChange={handleItemChange}
              disabled={loadingItems}
              style={{
                width: '100%',
                padding: '10px 12px',
                paddingRight: '35px',
                border: '1px solid #b3e0ff',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f0fbff',
                appearance: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">{loadingItems ? 'Loading...' : '--Select Item--'}</option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.itemName}>
                  {item.itemName}
                </option>
              ))}
            </select>
            <FaChevronDown
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#005b96',
              }}
            />
          </div>
        </SmallFormGroup>
        <SmallFormGroup>
          <Label>HSN Number</Label>
          <Input type="text" value={hsnNumber} readOnly placeholder="HSN will appear here" />
        </SmallFormGroup>
        <SmallFormGroup>
          <Label>Quantity</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
        </SmallFormGroup>
      </FormRow>
      <AddButtonContainer>
        <AddButton onClick={handleAddToList}>
          <FaPlus /> Add
        </AddButton>
      </AddButtonContainer>
      <div style={{ marginTop: '30px' }}>
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
            <Button
              onClick={handlePrint}
              disabled={isPrintDisabled}
              bg="#2ecc71"
            >
              Print Item List
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div style={{ marginTop: '40px' }}>
        <Subheading>Saved Mess Intents</Subheading>
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
                                        {isEditing ? (
                                          <Input
                                            type="text"
                                            value={editedItemName}
                                            onChange={(e) => setEditedItemName(e.target.value)}
                                          />
                                        ) : (
                                          `${toRomanNumeral(itemIndex + 1)}. ${item.itemName}`
                                        )}
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
                                                color="#2980b9"
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
                                                color="#2980b9"
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

export default MessIntent;