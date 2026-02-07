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

  // CSV Upload & Parsing
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map(row => ({
          id: row.id || 'N/A',
          name: row.name || 'Unknown',
          status: row.status || 'Stable',
          load: Number(row.load) || 0,
        }));
        setData(parsedData);
        setLoading(false);
      },
      error: (err) => {
        console.error("CSV Parsing Error:", err);
        setLoading(false);
        alert("Error parsing CSV file.");
      }
    });
  };

  // PDF Generation - FIXED Function
  const exportPDF = () => {
    if (!data.length) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(63, 66, 241); // Indigo
    doc.text("INDUSTRIAL EQUIPMENT ANALYTICS", 14, 20);

    // Meta Data
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Assets Analyzed: ${data.length}`, 14, 33);

    // Table Data
    const tableColumn = ["ID", "Equipment Name", "Current Status", "Load Intensity (%)"];
    const tableRows = data.map(item => [
      item.id, 
      item.name, 
      item.status.toUpperCase(), 
      `${item.load}%`
    ]);

    // Functional call to autoTable to prevent "not a function" error
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    doc.save("Equipment_Analytics_Submission.pdf");
  };

  // Chart Configuration
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      label: 'Load Percentage',
      data: data.map(d => d.load),
      backgroundColor: data.map(d => d.load >= 80 ? '#ef4444' : '#6366f1'),
      borderRadius: 6,
    }]
  };

  return (
    <div className="dashboard-container">
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2>GEMINI DASH</h2>
        <ul>
          <li className="active">📊 Overview</li>
          <li>📈 Analytics</li>
          <li>📋 Reports</li>
          <li>⚙️ Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <header>
          <h1>System Diagnostics</h1>
          {data.length > 0 && (
            <button className="btn-primary btn-export" onClick={exportPDF}>
              📥 Download PDF Report
            </button>
          )}
        </header>

        <div className="stats-grid">
          <div className="card">
            <h3>Total Assets</h3>
            <p>{data.length}</p>
          </div>
          <div className="card critical">
            <h3>Critical Alerts</h3>
            <p>{data.filter(d => d.status.toLowerCase() === 'critical' || d.load >= 80).length}</p>
          </div>
          <div className="card stable">
            <h3>System Health</h3>
            <p>{data.length ? "Optimal" : "--"}</p>
          </div>
        </div>

        <section className="upload-box">
          <input type="file" accept=".csv" onChange={handleFileUpload} id="csvInput" />
          <label htmlFor="csvInput" className="btn-primary">
            {loading ? "Processing..." : "📂 Select CSV Data"}
          </label>
        </section>

        {data.length > 0 && (
          <div className="results-container">
            <div className="chart-section">
              <h3>Load Distribution Map</h3>
              <div style={{ height: '320px' }}>
                <Bar 
                  data={chartData} 
                  options={{ 
                    maintainAspectRatio: false, 
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, max: 100 } }
                  }} 
                />
              </div>
            </div>

            <div className="table-section">
              <h3>Equipment Status Logs</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                          <span className={`status-pill ${item.status.toLowerCase() === 'critical' ? 'status-critical' : 'status-stable'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;