import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import styled from "styled-components";
import apiRequest from "../apiRequest"; // Axios instance with token

// ===== Styled Components =====
// Theme colors
export const primaryColor = "#662549";   // Deep plum
export const backgroundColor = "#fcefee"; // Soft blush background
export const textColor = "#2e1a23";       // Dark brownish-plum for readability
export const accentColor = "#b35478";     // Muted rose accent for hover/highlight

// Table Container
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${backgroundColor};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  font-size: 14px;
  color: ${textColor};
`;

// Table Header Cell
const Th = styled.th`
  padding: 12px;
  border-bottom: 2px solid ${accentColor};
  background: ${primaryColor};
  color: white;
  font-weight: 600;
  text-align: left;
  letter-spacing: 0.3px;
`;

// Table Data Cell
const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid rgba(179, 84, 120, 0.2); /* subtle accent border */
  vertical-align: top;
  background: white;
  color: ${textColor};

  &:nth-child(even) {
    background: ${backgroundColor};
  }
`;

// Action Button
const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 8px;
  font-size: 16px;
  color: ${accentColor};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
    color: ${primaryColor};
  }
`;

// Input Field
const Input = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid ${accentColor};
  border-radius: 6px;
  font-size: 13px;
  color: ${textColor};
  background: white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${primaryColor};
    box-shadow: 0 0 4px rgba(102, 37, 73, 0.3);
  }
`;


const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [editingVendor, setEditingVendor] = useState(null);
  const [form, setForm] = useState({});

  const StoreTrustBaseUrl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  // ===== Fetch Vendors =====
  const fetchVendors = async () => {
    try {
      const res = await apiRequest(`${StoreTrustBaseUrl}get_vendors/`, "GET");
      if (res.status === 200 && res.data.status === "success") {
        setVendors(res.data.data);
      } else {
        console.error("Failed to fetch vendors", res.data);
      }
    } catch (err) {
      console.error("Error fetching vendors", err);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

// ===== Delete Vendor =====
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this vendor?")) return;
  try {
    await apiRequest(`${StoreTrustBaseUrl}delete_vendor/${id}/`, "PATCH");

    // Remove the deleted vendor from state immediately
    setVendors((prevVendors) =>
      prevVendors.filter((vendor) => (vendor._id || vendor.id) !== id)
    );

  } catch (err) {
    console.error("Delete failed", err);
  }
};


  // ===== Edit Vendor =====
  const handleEdit = (vendor) => {
    setEditingVendor(vendor._id || vendor.id);
    setForm({ ...vendor });
  };

  // ===== Save Edit =====
  const handleSave = async () => {
    try {
      await apiRequest(
        `${StoreTrustBaseUrl}vendors/update/${editingVendor}/`,
        "PATCH",
        form
      );
      setEditingVendor(null);
      setForm({});
      fetchVendors();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ===== Handle Input Change =====
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Vendor Management</h2>

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Vendor ID</Th>
            <Th>Contact</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Supplier Type</Th>
            <Th>Address</Th>
            <Th>City</Th>
            <Th>State</Th>
            <Th>Pincode</Th>
            <Th>Website</Th>
            <Th>KGST/TIN</Th>
            <Th>GSTIN</Th>
            <Th>Payment</Th>
            <Th>Terms</Th>
            <Th>Credit Period</Th>
            <Th>Export Data Code</Th>
            <Th>TDS %</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {vendors.length === 0 ? (
            <tr>
              <td colSpan={18} style={{ textAlign: "center" }}>
                No vendors found
              </td>
            </tr>
          ) : (
            vendors.map((vendor) => {
              const id = vendor._id || vendor.id;
              const isEditing = editingVendor === id;
              return (
                <tr key={id}>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    ) : (
                      vendor.name || "-"
                    )}
                  </Td>
<Td>
  {vendor.vendor_id || "-"}
</Td>

                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.contactPerson}
                        onChange={(e) =>
                          handleChange("contactPerson", e.target.value)
                        }
                      />
                    ) : (
                      vendor.contactPerson || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    ) : (
                      vendor.phone || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    ) : (
                      vendor.email || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.supplierType}
                        onChange={(e) =>
                          handleChange("supplierType", e.target.value)
                        }
                      />
                    ) : (
                      vendor.supplierType || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <>
                        <Input
                          value={form.addressLine1}
                          onChange={(e) =>
                            handleChange("addressLine1", e.target.value)
                          }
                        />
                        <Input
                          value={form.addressLine2}
                          onChange={(e) =>
                            handleChange("addressLine2", e.target.value)
                          }
                          style={{ marginTop: "4px" }}
                        />
                      </>
                    ) : (
                      <>
                        {vendor.addressLine1 || "-"} <br />
                        {vendor.addressLine2 || ""}
                      </>
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                      />
                    ) : (
                      vendor.city || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                      />
                    ) : (
                      vendor.state || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.pincode}
                        onChange={(e) => handleChange("pincode", e.target.value)}
                      />
                    ) : (
                      vendor.pincode || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.url}
                        onChange={(e) => handleChange("url", e.target.value)}
                      />
                    ) : vendor.url ? (
                      <a href={vendor.url} target="_blank" rel="noreferrer">
                        {vendor.url}
                      </a>
                    ) : (
                      "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.kgstTinNumber}
                        onChange={(e) =>
                          handleChange("kgstTinNumber", e.target.value)
                        }
                      />
                    ) : (
                      vendor.kgstTinNumber || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.gstin}
                        onChange={(e) => handleChange("gstin", e.target.value)}
                      />
                    ) : (
                      vendor.gstin || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.payment}
                        onChange={(e) => handleChange("payment", e.target.value)}
                      />
                    ) : (
                      vendor.payment || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.terms}
                        onChange={(e) => handleChange("terms", e.target.value)}
                      />
                    ) : (
                      vendor.terms || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.creditPeriod}
                        onChange={(e) =>
                          handleChange("creditPeriod", e.target.value)
                        }
                      />
                    ) : (
                      vendor.creditPeriod || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.exportDataCode}
                        onChange={(e) =>
                          handleChange("exportDataCode", e.target.value)
                        }
                      />
                    ) : (
                      vendor.exportDataCode || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <Input
                        value={form.tdsPercent}
                        onChange={(e) =>
                          handleChange("tdsPercent", e.target.value)
                        }
                      />
                    ) : (
                      vendor.tdsPercent || "-"
                    )}
                  </Td>
                  <Td>
                    {isEditing ? (
                      <>
                        <ActionButton color="green" onClick={handleSave}>
                          ✅ Save
                        </ActionButton>
                        <ActionButton
                          color="gray"
                          onClick={() => setEditingVendor(null)}
                        >
                          ❌ Cancel
                        </ActionButton>
                      </>
                    ) : (
                      <>
                        <ActionButton color="blue" onClick={() => handleEdit(vendor)}>
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

export default VendorManagement;
