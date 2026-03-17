import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import apiRequest from "../apiRequest";
import {
  colors,
  Container,
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  Button,
  Input,
} from "../StyledComponents";
import styled from "styled-components";

// ─── Page-specific styles ─────────────────────────────────────────────────────

const PageHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${colors.primary} 0%,
    ${colors.primaryDark} 100%
  );
  color: white;
  padding: 14px 22px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
`;

const ContentArea = styled.div`
  padding: 16px;
  background: ${colors.background};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  max-width: 380px;
  position: relative;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${colors.textMuted};
    font-size: 15px;
    pointer-events: none;
  }
`;

const SearchInput = styled(Input)`
  padding-left: 32px;
  font-size: 0.82rem;
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s;
  margin-right: 4px;

  &.edit {
    color: ${colors.primary};
    &:hover {
      background: ${colors.tabBg};
    }
  }
  &.del {
    color: ${colors.danger};
    &:hover {
      background: #fee2e2;
    }
  }
  &.save {
    color: ${colors.success};
    &:hover {
      background: #dcfce7;
    }
    font-size: 0.78rem;
    font-weight: 600;
  }
  &.cancel {
    color: ${colors.textMuted};
    &:hover {
      background: ${colors.tabBg};
    }
    font-size: 0.78rem;
  }
`;

const StockBadge = styled.span`
  font-weight: 700;
  font-size: 0.82rem;
  color: ${(p) => (p.low ? colors.danger : colors.success)};
  background: ${(p) => (p.low ? "#fee2e2" : "#dcfce7")};
  padding: 2px 8px;
  border-radius: 12px;
`;

const InlineInput = styled(Input)`
  min-width: 80px;
  font-size: 0.78rem;
  padding: 3px 6px;
`;

// ─────────────────────────────────────────────────────────────────────────────

const ItemManagement = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});

  const StoreTrustBaseUrl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter((item) => item.itemName?.toLowerCase().includes(q)),
      );
    }
  }, [searchQuery, items]);

  const calculateStock = (item) =>
    (item.total_quantity || 0) +
    (item.openingStock || 0) -
    (item.approved_quantity || 0);

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiRequest(
        `${StoreTrustBaseUrl}delete_item/${item.item_id}/`,
        "PATCH",
      );
      setItems((prev) => prev.filter((i) => i.item_id !== item.item_id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id || item.id);
    setForm({ ...item });
  };

  const handleSave = async () => {
    try {
      await apiRequest(
        `${StoreTrustBaseUrl}update_item/${form.item_id}/`,
        "PATCH",
        { ...form, openingStock: parseInt(form.openingStock || 0, 10) },
      );
      setEditingItem(null);
      setForm({});
      fetchItems();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  return (
    <Container>
      {/* ── Page Header ── */}
      <PageHeader>
        <PageTitle>📦 Item Management</PageTitle>
        <Button
          onClick={() => navigate("/AddItems")}
          style={{ fontSize: "0.82rem", padding: "6px 14px" }}
        >
          <FiPlus size={14} /> Add Item
        </Button>
      </PageHeader>

      <ContentArea>
        {/* ── Search ── */}
        <SearchBar>
          <FiSearch />
          <SearchInput
            type="text"
            placeholder="Search by Item Name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>

        {/* ── Table ── */}
        <TableWrapper style={{ marginTop: 0 }}>
          <Table>
            <thead>
              <Tr>
                <Th>#</Th>
                <Th>Item Name</Th>
                <Th>Opening Stock</Th>
                <Th>Stock</Th>
                <Th>Group</Th>
                <Th>Category</Th>
                <Th>Classification</Th>
                <Th>HSN</Th>
                <Th>Reorder Level</Th>
                <Th>Actions</Th>
              </Tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <Tr>
                  <Td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: 28,
                      color: colors.textMuted,
                    }}
                  >
                    {searchQuery
                      ? "No items found matching your search"
                      : "No items found"}
                  </Td>
                </Tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const id = item._id || item.id;
                  const isEditing = editingItem === id;
                  const stock = calculateStock(item);
                  const isLow = stock < (item.stockReorderLevel || 0);

                  return (
                    <Tr key={id}>
                      <Td
                        style={{ color: colors.textMuted, fontSize: "0.78rem" }}
                      >
                        {idx + 1}
                      </Td>

                      <Td style={{ fontWeight: 600, minWidth: 140 }}>
                        {isEditing ? (
                          <InlineInput
                            value={form.itemName || ""}
                            onChange={(e) =>
                              handleChange("itemName", e.target.value)
                            }
                          />
                        ) : (
                          item.itemName
                        )}
                      </Td>

                      <Td>
                        {isEditing ? (
                          <InlineInput
                            value={form.openingStock || ""}
                            onChange={(e) =>
                              handleChange("openingStock", e.target.value)
                            }
                          />
                        ) : (
                          item.openingStock || "—"
                        )}
                      </Td>
                      <Td>
                        <StockBadge low={isLow}>{stock}</StockBadge>
                      </Td>

                      <Td>
                        {isEditing ? (
                          <InlineInput
                            value={form.group || ""}
                            onChange={(e) =>
                              handleChange("group", e.target.value)
                            }
                          />
                        ) : (
                          item.group || "—"
                        )}
                      </Td>

                      <Td>
                        {isEditing ? (
                          <InlineInput
                            value={form.category || ""}
                            onChange={(e) =>
                              handleChange("category", e.target.value)
                            }
                          />
                        ) : (
                          item.category || "—"
                        )}
                      </Td>

                      <Td>
                        {isEditing ? (
                          <InlineInput
                            value={form.classification || ""}
                            onChange={(e) =>
                              handleChange("classification", e.target.value)
                            }
                          />
                        ) : (
                          item.classification || "—"
                        )}
                      </Td>

                      <Td>
                        {isEditing && (!item.hsn || item.hsn.trim() === "") ? (
                          <InlineInput
                            value={form.hsn || ""}
                            onChange={(e) =>
                              handleChange("hsn", e.target.value)
                            }
                            placeholder="Enter HSN"
                          />
                        ) : (
                          item.hsn || "—"
                        )}
                      </Td>

                      <Td>
                        {isEditing ? (
                          <InlineInput
                            value={form.stockReorderLevel || ""}
                            onChange={(e) =>
                              handleChange("stockReorderLevel", e.target.value)
                            }
                          />
                        ) : (
                          item.stockReorderLevel || "—"
                        )}
                      </Td>

                      <Td style={{ whiteSpace: "nowrap" }}>
                        {isEditing ? (
                          <>
                            <ActionBtn className="save" onClick={handleSave}>
                              ✅ Save
                            </ActionBtn>
                            <ActionBtn
                              className="cancel"
                              onClick={() => setEditingItem(null)}
                            >
                              ❌ Cancel
                            </ActionBtn>
                          </>
                        ) : (
                          <>
                            <ActionBtn
                              className="edit"
                              onClick={() => handleEdit(item)}
                            >
                              <FiEdit />
                            </ActionBtn>
                            <ActionBtn
                              className="del"
                              onClick={() => handleDelete(item)}
                            >
                              <FiTrash2 />
                            </ActionBtn>
                          </>
                        )}
                      </Td>
                    </Tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableWrapper>

        {/* Record count */}
        {filteredItems.length > 0 && (
          <div
            style={{
              marginTop: 10,
              fontSize: "0.78rem",
              color: colors.textMuted,
            }}
          >
            Showing {filteredItems.length} of {items.length} items
          </div>
        )}
      </ContentArea>
    </Container>
  );
};

export default ItemManagement;
