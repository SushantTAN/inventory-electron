import React, { useState, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';

function Dashboard() {
  const [totalSalesToday, setTotalSalesToday] = useState(0);
  const [totalPurchasesToday, setTotalPurchasesToday] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    
    const salesSql = `SELECT SUM(total_amount) as total FROM sales WHERE sale_date = ?`;
    const purchasesSql = `SELECT SUM(total_amount) as total FROM purchases WHERE purchase_date = ?`;

    try {
      const salesResult = await window.api.runQuery(salesSql, [today]);
      const purchasesResult = await window.api.runQuery(purchasesSql, [today]);

      setTotalSalesToday(salesResult[0]?.total || 0);
      setTotalPurchasesToday(purchasesResult[0]?.total || 0);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <button onClick={fetchData} title="Refresh Data">
          <FaSync />
        </button>
      </div>
      <p>Welcome to your inventory management system.</p>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', marginTop: '2rem' }}>
          <div style={summaryCardStyle}>
            <h4>Total Sales Today</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalSalesToday.toFixed(2)}</p>
          </div>
          <div style={summaryCardStyle}>
            <h4>Total Purchases Today</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalPurchasesToday.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const summaryCardStyle = {
  flex: 1,
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#f8f9fa',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center',
};

export default Dashboard;

