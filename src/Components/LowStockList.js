import React, { useState, useEffect } from "react";
import { FaPrint } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import apiRequest from "./apiRequest";
import {
  colors,
  Container,
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  Button,
  Loading,
  ErrorMsg,
  TopRightButtons,
  Title,
} from "./StyledComponents";
import styled from "styled-components";

import { useOutlet } from "./OutletContext";

// ─── Page-specific styled components ─────────────────────────────────────────

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
  border-radius: 0 0 8px 8px;
`;

const SummaryBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SummaryCard = styled.div`
  background: ${(p) => p.bg || "#fff3cd"};
  border: 1px solid ${(p) => p.border || "#fcd34d"};
  border-radius: 8px;
  padding: 10px 20px;
  min-width: 140px;
  text-align: center;
  flex: 1;
`;

const SummaryLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: ${(p) => p.color || "#92400e"};
  margin-bottom: 4px;
`;

const SummaryValue = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${(p) => p.color || "#92400e"};
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

const RecordCount = styled.span`
  font-size: 0.82rem;
  color: ${colors.textMuted};
  font-weight: 500;
`;

const StockBadge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${(p) => (p.critical ? "#fee2e2" : "#fff3cd")};
  color: ${(p) => (p.critical ? "#dc2626" : "#92400e")};
`;

const ReorderBadge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #e0f2fe;
  color: #0369a1;
`;

const EmptyTd = styled(Td)`
  text-align: center;
  padding: 40px;
  color: ${colors.textMuted};
  font-size: 0.88rem;
`;

// ─────────────────────────────────────────────────────────────────────────────

const LowStockList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedOutlet } = useOutlet();

  const StoreTrustbaseurl = process.env.REACT_APP_BACKEND_STORETRUST_BASE_URL;

  const fetchLowStockNotifications = async () => {
    try {
      const outletCode = selectedOutlet?.outlet_code || "";
      const response = await apiRequest(
        `${StoreTrustbaseurl}inventory/check-stock/?outlet_code=${encodeURIComponent(outletCode)}`,
        "GET",
      );
      if (response.success) {
        setNotifications(response.data);
      } else {
        toast.error(response.error || "Failed to fetch notifications");
        setError(response.error || "Failed to fetch notifications");
      }
    } catch (error) {
      toast.error("Network error fetching notifications");
      setError("Network error fetching notifications");
      console.error("Error fetching low stock notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockNotifications();
  }, [selectedOutlet?.outlet_code]);

  // ── Derived counts ─────────────────────────────────────────────────────────
  const criticalCount = notifications.filter(
    (n) => n.available_stock === 0,
  ).length;
  const lowCount = notifications.filter((n) => n.available_stock > 0).length;

  // ── Print ──────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const rows = notifications
      .map(
        (item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${item.itemName || "—"}</td>
          <td>${item.hsn || "—"}</td>
          <td style="text-align:right">${item.total_quantity ?? 0}</td>
          <td style="text-align:right">${item.approved_quantity ?? 0}</td>
          <td style="text-align:right;font-weight:700;color:${item.available_stock === 0 ? "#dc2626" : "#92400e"
          }">
            ${item.available_stock ?? 0}
          </td>
          <td style="text-align:right">${item.stockReorderLevel ?? 0}</td>
        </tr>`,
      )
      .join("");

    const printWin = window.open("", "_blank", "width=1000,height=700");
    printWin.document.write(`
      <html>
        <head>
          <title>Low Stock Report</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; margin: 30px; font-size: 13px; }
            h2 { text-align: center; color: #662549; margin-bottom: 4px; }
            p.sub { text-align: center; color: #64748b; font-size: 12px; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th {
              background: #662549; color: white; padding: 9px 10px;
              text-align: left; font-size: 11px; text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
            tr:nth-child(even) td { background: #fdf2f8; }
            .footer {
              margin-top: 30px; font-size: 11px; color: #64748b;
              display: flex; justify-content: space-between;
            }
            .summary {
              display: flex; gap: 20px; margin: 12px 0;
            }
            .summary-box {
              border: 1px solid #e2e8f0; border-radius: 6px;
              padding: 8px 16px; text-align: center; min-width: 120px;
            }
            .summary-box .val { font-size: 20px; font-weight: 800; color: #662549; }
            .summary-box .lbl { font-size: 10px; color: #64748b; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <h2>${selectedOutlet?.outlet_name || "Outlet"} Low Stock Report</h2>
          <p class="sub">Generated Date & Time: ${new Date().toLocaleString("en-IN")}</p>
          <div class="summary">
            <div class="summary-box">
              <div class="val">${notifications.length}</div>
              <div class="lbl">Total Alerts</div>
            </div>
            <div class="summary-box">
              <div class="val" style="color:#dc2626">${criticalCount}</div>
              <div class="lbl">Out of Stock</div>
            </div>
            <div class="summary-box">
              <div class="val" style="color:#92400e">${lowCount}</div>
              <div class="lbl">Low Stock</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>HSN</th>
                <th>Total Qty</th>
                <th>Approved Qty</th>
                <th>Available Stock</th>
                <th>Reorder Level</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="footer">
            <span>Total Items: ${notifications.length}</span>
            <span>Critical (0 stock): ${criticalCount} | Low Stock: ${lowCount}</span>
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (loading) return <Loading>Loading stock data…</Loading>;
  if (error) return <ErrorMsg>Error: {error}</ErrorMsg>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Container>
        {/* ── Page Header ── */}
        <PageHeader>
          <PageTitle>⚠️ Low Stock Alert</PageTitle>
          <Button onClick={handlePrint} style={{ fontSize: "0.82rem" }}>
            <FaPrint size={13} /> Print
          </Button>
        </PageHeader>

        <ContentArea>
          {/* ── Summary Cards ── */}
          {notifications.length > 0 && (
            <SummaryBar>
              <SummaryCard bg="#fee2e2" border="#fca5a5">
                <SummaryLabel color="#dc2626">Total Alerts</SummaryLabel>
                <SummaryValue color="#dc2626">
                  {notifications.length}
                </SummaryValue>
              </SummaryCard>
              <SummaryCard bg="#fee2e2" border="#fca5a5">
                <SummaryLabel color="#dc2626">Out of Stock</SummaryLabel>
                <SummaryValue color="#dc2626">{criticalCount}</SummaryValue>
              </SummaryCard>
              <SummaryCard bg="#fff3cd" border="#fcd34d">
                <SummaryLabel color="#92400e">Low Stock</SummaryLabel>
                <SummaryValue color="#92400e">{lowCount}</SummaryValue>
              </SummaryCard>
            </SummaryBar>
          )}

          {/* ── Top Bar ── */}
          <TopBar>
            <RecordCount>
              {notifications.length === 0
                ? "No low stock alerts"
                : `${notifications.length} item${notifications.length !== 1 ? "s" : ""} below reorder level`}
            </RecordCount>
          </TopBar>

          {/* ── Table ── */}
          <TableWrapper>
            <Table>
              <thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Item Name</Th>
                  <Th>HSN</Th>
                  <Th>Total Qty</Th>
                  <Th>Approved Qty</Th>
                  <Th>Available Stock</Th>
                  <Th>Reorder Level</Th>
                </Tr>
              </thead>
              <tbody>
                {notifications.length === 0 ? (
                  <tr>
                    <EmptyTd colSpan={7}>
                      ✅ All items are above reorder levels. No alerts.
                    </EmptyTd>
                  </tr>
                ) : (
                  notifications.map((item, idx) => (
                    <Tr key={`${item.hsn}-${idx}`}>
                      <Td
                        style={{
                          color: colors.textMuted,
                          fontSize: "0.75rem",
                          width: 40,
                        }}
                      >
                        {idx + 1}
                      </Td>

                      <Td style={{ fontWeight: 600, minWidth: 160 }}>
                        {item.itemName || "—"}
                      </Td>

                      <Td
                        style={{
                          fontFamily: "monospace",
                          fontSize: "0.78rem",
                        }}
                      >
                        {item.hsn || "—"}
                      </Td>

                      <Td>{item.total_quantity ?? 0}</Td>

                      <Td>{item.approved_quantity ?? 0}</Td>

                      <Td>
                        <StockBadge critical={item.available_stock === 0}>
                          {item.available_stock ?? 0}
                        </StockBadge>
                      </Td>

                      <Td>
                        <ReorderBadge>
                          {item.stockReorderLevel ?? 0}
                        </ReorderBadge>
                      </Td>
                    </Tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </ContentArea>
      </Container>
    </>
  );
};

export default LowStockList;
