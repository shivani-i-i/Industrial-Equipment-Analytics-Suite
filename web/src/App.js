import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      // This trims invisible spaces from your Excel headers automatically
      transformHeader: (h) => h.trim(), 
      complete: (results) => {
        const parsedData = results.data.map((row, index) => {
          // --- THE CRITICAL FIXES ---
          // 1. Name: Checks both "Equipment" and "Equipment Name" then trims it
          const rawName = row["Equipment Name"] || row["Equipment"] || row.name || "Unknown";
          const name = String(rawName).trim();
          
          // 2. Flowrate: Strips units like 'm3/h' and converts to a clean number
          const flowVal = Number(String(row.Flowrate || row.load || 0).replace(/[^0-9.]/g, ''));
          
          // 3. Logic: Matches your screenshot colors (Red for > 140)
          const status = flowVal > 140 ? 'CRITICAL' : 'STABLE';
          const id = index + 1;

          return { id, name, load: flowVal, status };
        });
        setData(parsedData);
        setLoading(false);
      },
    });
  };

  const exportPDF = () => {
    if (data.length === 0) return;
    const doc = new jsPDF();
    doc.text("Chemical Equipment Analytics Report", 14, 15);
    autoTable(doc, {
      head: [["ID", "Equipment Name", "Status", "Flowrate"]],
      body: data.map(item => [item.id, item.name, item.status, item.load]),
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
    doc.save("Equipment_Analysis.pdf");
  };

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      label: 'Flowrate',
      data: data.map(d => d.load),
      backgroundColor: data.map(d => d.load > 140 ? '#ef4444' : '#6366f1'),
      borderRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        beginAtZero: true, 
        suggestedMax: 200, // Matches your successful chart scale
        ticks: { stepSize: 20 }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>GEMINI ANALYTICS</h2>
        </div>
        <nav>
          <ul>
            <li className="active">📊 Dashboard</li>
            <li onClick={exportPDF} style={{cursor: 'pointer'}}>📥 Export PDF</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="system-title">System Overview</h1>
        </header>

        <section className="upload-container">
          <div className="upload-box">
            <input type="file" accept=".csv" onChange={handleFileUpload} id="csv-upload" hidden />
            <label htmlFor="csv-upload" className="btn-primary">
              {loading ? "Processing..." : "📂 Upload CSV File"}
            </label>
            <p>Upload your chemical equipment data to generate insights.</p>
          </div>
        </section>

        {data.length > 0 && (
          <div className="results-grid">
            <div className="card chart-card">
              <h3>Flowrate Distribution</h3>
              <div style={{ height: '320px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            
            <div className="card table-card">
              <h3>Equipment Status Logs</h3>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td className="equipment-name">{item.name}</td>
                        <td>
                          <span className={`status-pill ${item.load > 140 ? 'status-critical' : 'status-stable'}`}>
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