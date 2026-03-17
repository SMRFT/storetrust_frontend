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

const InlineInput = styled(Input)`
  min-width: 80px;
  font-size: 0.78rem;
  padding: 3px 6px;
`;

// ─── Cell helper — defined OUTSIDE component to prevent remount on keystroke ──
const Cell = ({ field, value, isEditing, form, onChange, placeholder }) => (
  <Td>
    {isEditing ? (
      <InlineInput
        value={form[field] || ""}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      value || "—"
    )}
  </Td>
);

// ─────────────────────────────────────────────────────────────────────────────

const VendorManagement = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingVendor, setEditingVendor] = useState(null);
  const [form, setForm] = useState({});

  const StoreTrustBaseUrl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  const fetchVendors = async () => {
    try {
      const res = await apiRequest(`${StoreTrustBaseUrl}get_vendors/`, "GET");
      if (res.status === 200 && res.data.status === "success") {
        setVendors(res.data.data);
        setFilteredVendors(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching vendors", err);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVendors(vendors);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredVendors(
        vendors.filter((v) => v.name?.toLowerCase().includes(q)),
      );
    }
  }, [searchQuery, vendors]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await apiRequest(`${StoreTrustBaseUrl}delete_vendor/${id}/`, "PATCH");
      setVendors((prev) => prev.filter((v) => (v._id || v.id) !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor._id || vendor.id);
    setForm({ ...vendor });
  };

  const handleSave = async () => {
    try {
      await apiRequest(
        `${StoreTrustBaseUrl}vendors/update/${editingVendor}/`,
        "PATCH",
        form,
      );
      setEditingVendor(null);
      setForm({});
      fetchVendors();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Use functional update to avoid stale closure
  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Container>
      {/* ── Page Header ── */}
      <PageHeader>
        <PageTitle>🏢 Vendor Management</PageTitle>
        <Button
          onClick={() => navigate("/AddVendor")}
          style={{ fontSize: "0.82rem", padding: "6px 14px" }}
        >
          <FiPlus size={14} /> Add Vendor
        </Button>
      </PageHeader>

      <ContentArea>
        {/* ── Search ── */}
        <SearchBar>
          <FiSearch />
          <SearchInput
            type="text"
            placeholder="Search by Vendor Name…"
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
                <Th>Vendor ID</Th>
                <Th>Name</Th>
                <Th>Contact</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Supplier Type</Th>
                <Th>Address Line 1</Th>
                <Th>Address Line 2</Th>
                <Th>City</Th>
                <Th>State</Th>
                <Th>Pincode</Th>
                <Th>KGST/TIN</Th>
                <Th>GSTIN</Th>
                <Th>Payment</Th>
                <Th>Actions</Th>
              </Tr>
            </thead>
            <tbody>
              {filteredVendors.length === 0 ? (
                <Tr>
                  <Td
                    colSpan={16}
                    style={{
                      textAlign: "center",
                      padding: 28,
                      color: colors.textMuted,
                    }}
                  >
                    {searchQuery
                      ? "No vendors found matching your search"
                      : "No vendors found"}
                  </Td>
                </Tr>
              ) : (
                filteredVendors.map((vendor, idx) => {
                  const id = vendor._id || vendor.id;
                  const isEditing = editingVendor === id;

                  return (
                    <Tr key={id}>
                      <Td
                        style={{ color: colors.textMuted, fontSize: "0.78rem" }}
                      >
                        {idx + 1}
                      </Td>

                      {/* Vendor ID — never editable */}
                      <Td
                        style={{
                          fontWeight: 600,
                          color: colors.primary,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {vendor.vendor_id || "—"}
                      </Td>

                      {/* Name */}
                      <Td style={{ fontWeight: 600, minWidth: 140 }}>
                        {isEditing ? (
                          <InlineInput
                            value={form.name || ""}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                          />
                        ) : (
                          vendor.name || "—"
                        )}
                      </Td>

                      <Cell
                        field="contactPerson"
                        value={vendor.contactPerson}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />
                      <Cell
                        field="phone"
                        value={vendor.phone}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />
                      <Cell
                        field="email"
                        value={vendor.email}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />
                      <Cell
                        field="supplierType"
                        value={vendor.supplierType}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />

                      {/* Address Line 1 */}
                      <Td style={{ minWidth: 140 }}>
                        {isEditing ? (
                          <InlineInput
                            value={form.addressLine1 || ""}
                            onChange={(e) =>
                              handleChange("addressLine1", e.target.value)
                            }
                            placeholder="Address Line 1"
                          />
                        ) : (
                          vendor.addressLine1 || "—"
                        )}
                      </Td>

                      {/* Address Line 2 */}
                      <Td style={{ minWidth: 120 }}>
                        {isEditing ? (
                          <InlineInput
                            value={form.addressLine2 || ""}
                            onChange={(e) =>
                              handleChange("addressLine2", e.target.value)
                            }
                            placeholder="Address Line 2"
                          />
                        ) : (
                          vendor.addressLine2 || "—"
                        )}
                      </Td>

                      <Cell
                        field="city"
                        value={vendor.city}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />
                      <Cell
                        field="state"
                        value={vendor.state}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />
                      <Cell
                        field="pincode"
                        value={vendor.pincode}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />
                      <Cell
                        field="kgstTinNumber"
                        value={vendor.kgstTinNumber}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />
                      <Cell
                        field="gstin"
                        value={vendor.gstin}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />
                      <Cell
                        field="payment"
                        value={vendor.payment}
                        isEditing={isEditing}
                        form={form}
                        onChange={handleChange}
                      />

                      {/* Actions */}
                      <Td style={{ whiteSpace: "nowrap" }}>
                        {isEditing ? (
                          <>
                            <ActionBtn className="save" onClick={handleSave}>
                              ✅ Save
                            </ActionBtn>
                            <ActionBtn
                              className="cancel"
                              onClick={() => setEditingVendor(null)}
                            >
                              ❌ Cancel
                            </ActionBtn>
                          </>
                        ) : (
                          <>
                            <ActionBtn
                              className="edit"
                              onClick={() => handleEdit(vendor)}
                            >
                              <FiEdit />
                            </ActionBtn>
                            <ActionBtn
                              className="del"
                              onClick={() => handleDelete(id)}
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
        {filteredVendors.length > 0 && (
          <div
            style={{
              marginTop: 10,
              fontSize: "0.78rem",
              color: colors.textMuted,
            }}
          >
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
        )}
      </ContentArea>
    </Container>
  );
};

export default VendorManagement;
