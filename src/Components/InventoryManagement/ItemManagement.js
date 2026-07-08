import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import { History, X } from "lucide-react";
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

const HistOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const HistBox = styled.div`
  background: white;
  border-radius: 10px;
  width: 95%;
  max-width: 1100px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(102, 37, 73, 0.25);
`;

const HistHead = styled.div`
  background: ${colors.primary};
  color: white;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

const HistTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
`;

const HistSubtitle = styled.div`
  font-size: 0.72rem;
  opacity: 0.8;
  margin-top: 2px;
`;

const HistScroll = styled.div`
  overflow: auto;
  flex: 1;
  padding: 12px;
  -webkit-overflow-scrolling: touch;
`;

const HistTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  min-width: 700px;
  th {
    background: ${colors.tabBg};
    padding: 7px 10px;
    text-align: left;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: ${colors.textMain};
    white-space: nowrap;
  }
  td {
    padding: 7px 10px;
    border-bottom: 1px solid ${colors.border};
  }
  tbody tr:hover {
    background: #f9e5e8;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────

const ItemManagement = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedItemForHistory, setSelectedItemForHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

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

  const handleShowHistory = async (item) => {
    const hsn = String(item?.hsn ?? "").trim();
    const item_id = String(item?.item_id ?? "").trim();
    if (!item_id || !hsn) {
      alert("HSN and Item ID are required to view history");
      return;
    }
    setSelectedItemForHistory(item);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    setHistoryError("");
    try {
      const url = `${StoreTrustBaseUrl}travellers-in/previous-purchases/?hsn=${encodeURIComponent(hsn)}&item_id=${encodeURIComponent(item_id)}`;
      const r = await apiRequest(url, "GET");
      if (r.success && r.data?.status === "success") {
        setHistoryData(r.data.data || []);
      } else {
        setHistoryError(r.error || "Failed to fetch purchase history");
        setHistoryData([]);
      }
    } catch (err) {
      setHistoryError(err.message || "An unexpected error occurred");
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

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
                              className="history"
                              title="View purchase history"
                              onClick={() => handleShowHistory(item)}
                              style={{
                                color: item.hsn ? colors.primary : "#94a3b8",
                                cursor: item.hsn ? "pointer" : "not-allowed",
                              }}
                            >
                              <History size={14} />
                            </ActionBtn>
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
      {showHistoryModal &&
        selectedItemForHistory &&
        (() => {
          const prices = historyData.map((h) => {
            let it = h;
            try {
              const its = JSON.parse(h.items);
              const m = its.find((x) => x.hsn === selectedItemForHistory.hsn);
              if (m) it = m;
            } catch { }
            if (h.matched_item) it = h.matched_item;
            return parseFloat(it?.unitPrice || 0);
          });
          const priceStats =
            prices.length === 0
              ? { min: 0, max: 0, avg: 0 }
              : {
                min: Math.min(...prices),
                max: Math.max(...prices),
                avg: prices.reduce((s, p) => s + p, 0) / prices.length,
              };
          const totalStock = historyData.reduce((t, h) => {
            let it = h;
            try {
              const its = JSON.parse(h.items);
              const m = its.find((x) => x.hsn === selectedItemForHistory.hsn);
              if (m) it = m;
            } catch { }
            if (h.matched_item) it = h.matched_item;
            return t + parseInt(it?.totalstock || 0);
          }, 0);

          return (
            <HistOverlay
              onClick={() => {
                setShowHistoryModal(false);
                setHistoryData([]);
              }}
            >
              <HistBox onClick={(e) => e.stopPropagation()}>
                <HistHead>
                  <div>
                    <HistTitle>
                      Purchase History — {selectedItemForHistory.itemName}
                    </HistTitle>
                    <HistSubtitle>
                      HSN: {selectedItemForHistory.hsn} — Total Stock:{" "}
                      {totalStock}
                    </HistSubtitle>
                    {historyData.length > 0 && (
                      <HistSubtitle style={{ marginTop: 2 }}>
                        Price Range: ₹{priceStats.min.toFixed(2)} – ₹
                        {priceStats.max.toFixed(2)} | Avg: ₹
                        {priceStats.avg.toFixed(2)}
                      </HistSubtitle>
                    )}
                  </div>
                  <CloseBtn onClick={() => setShowHistoryModal(false)}>
                    <X size={18} />
                  </CloseBtn>
                </HistHead>

                <HistScroll>
                  {historyLoading ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: colors.textMuted,
                      }}
                    >
                      Loading history…
                    </div>
                  ) : historyError ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#dc2626",
                        fontWeight: 600,
                      }}
                    >
                      {historyError}
                    </div>
                  ) : historyData.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: colors.textMuted,
                      }}
                    >
                      No previous purchase history found.
                    </div>
                  ) : (
                    <HistTable>
                      <thead>
                        <tr>
                          {[
                            "GRN No",
                            "Date",
                            "Vendor",
                            "HSN",
                            "Item",
                            "Unit Price",
                            "Purchase Cost",
                            "Qty",
                            "Free",
                            "Stock",
                            "Batch",
                            "MRP",
                          ].map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.map((hi, i) => {
                          let it = selectedItemForHistory;
                          try {
                            const its = JSON.parse(hi.items);
                            const m = its.find(
                              (x) => x.hsn === selectedItemForHistory.hsn,
                            );
                            if (m) it = m;
                          } catch { }
                          if (hi.matched_item) it = hi.matched_item;
                          const unitPrice = parseFloat(it?.unitPrice || 0);
                          const isHigh =
                            unitPrice === priceStats.max &&
                            priceStats.max > priceStats.min;
                          const isLow =
                            unitPrice === priceStats.min &&
                            priceStats.max > priceStats.min;
                          return (
                            <tr key={i}>
                              <td>{hi.grn_number}</td>
                              <td>
                                {new Date(hi.date).toLocaleDateString("en-IN")}
                              </td>
                              <td>{hi.vendor_name}</td>
                              <td>{it.hsn || "—"}</td>
                              <td style={{ fontWeight: 600 }}>
                                {it.itemName || it.name || it.item_name || "—"}
                              </td>
                              <td
                                style={{
                                  fontWeight: 700,
                                  color: isHigh
                                    ? "#dc2626"
                                    : isLow
                                      ? "#16a34a"
                                      : colors.primary,
                                  background: isHigh
                                    ? "#fef2f2"
                                    : isLow
                                      ? "#f0fdf4"
                                      : "transparent",
                                  borderRadius: 4,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {isHigh && (
                                  <span
                                    title="Highest price"
                                    style={{ marginRight: 4 }}
                                  >
                                    🔴
                                  </span>
                                )}
                                {isLow && (
                                  <span
                                    title="Lowest price"
                                    style={{ marginRight: 4 }}
                                  >
                                    🟢
                                  </span>
                                )}
                                ₹{unitPrice.toFixed(2)}
                              </td>
                              <td>
                                ₹{parseFloat(it.purchaseCost || 0).toFixed(2)}
                              </td>
                              <td>{it.quantity}</td>
                              <td>{it.free}</td>
                              <td>{it.totalstock || 0}</td>
                              <td>{it.batch || "—"}</td>
                              <td>₹{parseFloat(it.mrp || 0).toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </HistTable>
                  )}
                </HistScroll>
              </HistBox>
            </HistOverlay>
          );
        })()}
    </Container>
  );
};

export default ItemManagement;
