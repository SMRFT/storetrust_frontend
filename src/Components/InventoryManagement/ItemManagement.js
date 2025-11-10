import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import styled from "styled-components";
import apiRequest from "../apiRequest"; // Axios wrapper

// Theme colors
export const primaryColor = "#662549";   // deep plum
export const backgroundColor = "#fcefee"; // soft blush background
export const textColor = "#2e1a23";       // dark plum for readability
export const accentColor = "#b35478";     // muted rose accent

// Styled Table
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${backgroundColor};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(102, 37, 73, 0.15);
  font-size: 14px;
  color: ${textColor};
`;

// Table Header
const Th = styled.th`
  padding: 12px;
  border-bottom: 2px solid ${accentColor};
  background: ${primaryColor};
  color: #fff;
  font-weight: 600;
  text-align: left;
  letter-spacing: 0.3px;
`;

// Table Data Cell
const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid rgba(179, 84, 120, 0.25);
  background: #fff;
  color: ${textColor};
  transition: background 0.2s ease;

  &:nth-child(even) {
    background: ${backgroundColor};
  }

  tr:hover & {
    background: rgba(179, 84, 120, 0.05);
  }
`;

// Action Buttons (Edit / Delete Icons)
const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 8px;
  font-size: 16px;
  color: ${(props) => props.color || accentColor};
  transition: transform 0.2s ease, color 0.2s ease;

  &:hover {
    transform: scale(1.2);
    color: ${primaryColor};
  }
`;

// Input Fields
const Input = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid ${accentColor};
  border-radius: 6px;
  font-size: 13px;
  color: ${textColor};
  background: #fff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${primaryColor};
    box-shadow: 0 0 4px rgba(102, 37, 73, 0.4);
  }

  &::placeholder {
    color: #b07a8c;
  }
`;


const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  
  const StoreTrustBaseUrl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await apiRequest(`${StoreTrustBaseUrl}get_items/`, "GET");
      if (res.status === 200 && res.data.status === "success") {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error("Fetch items error", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

// Delete item (soft delete)
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this item?")) return;
  try {
    // DELETE request to backend
    await apiRequest(`${StoreTrustBaseUrl}delete_item/${id}/`, "PATCH");

    // Remove from frontend state immediately
    setItems((prevItems) => prevItems.filter((item) => item._id !== id));
  } catch (err) {
    console.error("Delete failed", err);
  }
};



  // Edit
  const handleEdit = (item) => {
    setEditingItem(item._id || item.id);
    setForm({ ...item });
  };

  // Save
  const handleSave = async () => {
    try {
      await apiRequest(`${StoreTrustBaseUrl}update_item/${editingItem}/`, "PATCH", form);
      setEditingItem(null);
      setForm({});
      fetchItems();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div>
      <h2>Item Management</h2>
      <Table>
        <thead>
          <tr>
            <Th>Item Name</Th>
            <Th>Group</Th>
            <Th>Category</Th>
            <Th>Classification</Th>
            <Th>HSN</Th>
            <Th>Stock Reorder Level</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>No items found</td>
            </tr>
          ) : (
            items.map((item) => {
              const id = item._id || item.id;
              const isEditing = editingItem === id;
              return (
                <tr key={id}>
                  <Td>{isEditing ? <Input value={form.itemName || ""} onChange={(e) => handleChange("itemName", e.target.value)} /> : item.itemName}</Td>
                  <Td>{isEditing ? <Input value={form.group || ""} onChange={(e) => handleChange("group", e.target.value)} /> : item.group}</Td>
                  <Td>{isEditing ? <Input value={form.Category || ""} onChange={(e) => handleChange("Category", e.target.value)} /> : item.Category}</Td>
                  <Td>{isEditing ? <Input value={form.classification || ""} onChange={(e) => handleChange("classification", e.target.value)} /> : item.classification}</Td>
<Td>
  {isEditing && (!item.hsn || item.hsn.trim() === "") ? (
    // Editable input only if HSN is empty
    <Input
      value={form.hsn || ""}
      onChange={(e) => handleChange("hsn", e.target.value)}
      placeholder="Enter HSN code"
    />
  ) : (
    // Display plain text (not editable)
    item.hsn || ""
  )}
</Td>


                  <Td>{isEditing ? <Input value={form.stockReorderLevel || ""} onChange={(e) => handleChange("stockReorderLevel", e.target.value)} /> : item.stockReorderLevel}</Td>
                  <Td>
                    {isEditing ? (
                      <>
                        <ActionButton color="green" onClick={handleSave}>✅ Save</ActionButton>
                        <ActionButton color="gray" onClick={() => setEditingItem(null)}>❌ Cancel</ActionButton>
                      </>
                    ) : (
                      <>
                        <ActionButton color="blue" onClick={() => handleEdit(item)}><FiEdit /></ActionButton>
                        <ActionButton color="red" onClick={() => handleDelete(id)}><FiTrash2 /></ActionButton>
                      </>
                    )}
                  </Td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ItemManagement;
