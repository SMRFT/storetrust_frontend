import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
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

// Search Container
const SearchContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 400px;
`;

// Search Input
const SearchInput = styled(Input)`
  flex: 1;
  padding: 10px 12px 10px 40px;
  font-size: 14px;
`;

// Search Icon Wrapper
const SearchIconWrapper = styled.div`
  position: relative;
  flex: 1;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${accentColor};
    font-size: 16px;
  }
`;

// Header Container
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    color: ${primaryColor};
  }
`;

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  
  const StoreTrustBaseUrl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await apiRequest(`${StoreTrustBaseUrl}get_items/`, "GET");
      if (res.status === 200 && res.data.status === "success") {
        setItems(res.data.data);
        setFilteredItems(res.data.data);
      }
    } catch (err) {
      console.error("Fetch items error", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Search filter effect
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.itemName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  // Calculate stock (total_quantity - approved_quantity)
  const calculateStock = (item) => {
    const total = item.total_quantity || 0;
    const approved = item.approved_quantity || 0;
    return total - approved;
  };

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
      <HeaderContainer>
        <h2>Item Management</h2>
      </HeaderContainer>
      
      {/* Search Filter */}
      <SearchContainer>
        <SearchIconWrapper>
          <FiSearch />
          <SearchInput
            type="text"
            placeholder="Search by Item Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchIconWrapper>
      </SearchContainer>

      <Table>
        <thead>
          <tr>
            <Th>Item Name</Th>
            <Th>Stock</Th>
            <Th>Group</Th>
            <Th>Category</Th>
            <Th>Classification</Th>
            <Th>HSN</Th>
            <Th>Stock Reorder Level</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                {searchQuery ? "No items found matching your search" : "No items found"}
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => {
              const id = item._id || item.id;
              const isEditing = editingItem === id;
              const stock = calculateStock(item);
              
              return (
                <tr key={id}>
                  <Td>
                    {isEditing ? (
                      <Input 
                        value={form.itemName || ""} 
                        onChange={(e) => handleChange("itemName", e.target.value)} 
                      />
                    ) : (
                      item.itemName
                    )}
                  </Td>
                  <Td style={{ fontWeight: "600", color: stock < (item.stockReorderLevel || 0) ? "#d9534f" : "#5cb85c" }}>
                    {stock}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input 
                        value={form.group || ""} 
                        onChange={(e) => handleChange("group", e.target.value)} 
                      />
                    ) : (
                      item.group
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input 
                        value={form.Category || ""} 
                        onChange={(e) => handleChange("Category", e.target.value)} 
                      />
                    ) : (
                      item.Category
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input 
                        value={form.classification || ""} 
                        onChange={(e) => handleChange("classification", e.target.value)} 
                      />
                    ) : (
                      item.classification
                    )}
                  </Td>
                  <Td>
                    {isEditing && (!item.hsn || item.hsn.trim() === "") ? (
                      <Input
                        value={form.hsn || ""}
                        onChange={(e) => handleChange("hsn", e.target.value)}
                        placeholder="Enter HSN code"
                      />
                    ) : (
                      item.hsn || ""
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input 
                        value={form.stockReorderLevel || ""} 
                        onChange={(e) => handleChange("stockReorderLevel", e.target.value)} 
                      />
                    ) : (
                      item.stockReorderLevel
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <>
                        <ActionButton color="green" onClick={handleSave}>✅ Save</ActionButton>
                        <ActionButton color="gray" onClick={() => setEditingItem(null)}>❌ Cancel</ActionButton>
                      </>
                    ) : (
                      <>
                        <ActionButton color="blue" onClick={() => handleEdit(item)}>
                          <FiEdit />
                        </ActionButton>
                        <ActionButton color="red" onClick={() => handleDelete(id)}>
                          <FiTrash2 />
                        </ActionButton>
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