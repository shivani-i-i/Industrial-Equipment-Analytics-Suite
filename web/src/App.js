import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- SMART DATA PARSING (Fixes the "Unknown" and Empty Graph issue) ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map(row => {
          // Identify columns regardless of capitalization or naming (ID, name, load)
          const id = row.id || row.ID || row.Id || 'N/A';
          const name = row.name || row.Name || row.Equipment || row.Asset || row.Service || 'Unknown';
          const loadVal = Number(row.load || row.Load || row.risk_score || row.Risk || 0);
          const status = row.status || row.Status || (loadVal >= 80 ? 'Critical' : 'Stable');

          return { id, name, load: loadVal, status };
        });
        setData(parsedData);
        setLoading(false);
      },
      error: () => {
        setLoading(false);
        alert("Error reading CSV.");
      }
    });
  };

  // --- PDF EXPORT (Final Fixed Version) ---
  const exportPDF = () => {
    if (!data.length) return;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(63, 66, 241); 
    doc.text("INDUSTRIAL EQUIPMENT ANALYTICS REPORT", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    const tableColumn = ["ID", "Equipment Name", "Status", "Load (%)"];
    const tableRows = data.map(item => [item.id, item.name, item.status.toUpperCase(), `${item.load}%`]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save("Final_Equipment_Report.pdf");
  };

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      label: 'Load (%)',
      data: data.map(d => d.load),
      backgroundColor: data.map(d => d.load >= 80 ? '#ef4444' : '#6366f1'),
      borderRadius: 6,
    }]
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2>GEMINI DASH</h2>
        <ul>
          <li className="active">📊 Overview</li>
          <li>📋 Reports</li>
          <li>⚙️ Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <header>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1>System Overview</h1>
          {data.length > 0 && (
            <button className="btn-primary" style={{backgroundColor: '#10b981'}} onClick={exportPDF}>
              📥 Export PDF
            </button>
          )}
        </header>

        <div className="stats-grid">
          <div className="card"><h3>Total Assets</h3><p>{data.length}</p></div>
          <div className="card critical"><h3>Critical Issues</h3><p>{data.filter(d => d.load >= 80).length}</p></div>
          <div className="card stable"><h3>Avg Load</h3><p>{data.length ? (data.reduce((a, b) => a + b.load, 0) / data.length).toFixed(1) : 0}%</p></div>
        </div>

        <section className="upload-box">
          <input type="file" accept=".csv" onChange={handleFileUpload} id="csv-upload" />
          <label htmlFor="csv-upload" className="btn-primary">📂 {loading ? "Analyzing..." : "Upload CSV Data"}</label>
        </section>

        {data.length > 0 && (
          <div className="results-container">
            <div className="chart-section">
              <h3>Load Distribution Map</h3>
              <div style={{ height: '300px' }}><Bar data={chartData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} /></div>
            </div>
            <div className="table-section">
              <h3>Live Status Logs</h3>
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Status</th></tr></thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td><span className={`status-pill ${item.load >= 80 ? 'status-critical' : 'status-stable'}`}>{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;