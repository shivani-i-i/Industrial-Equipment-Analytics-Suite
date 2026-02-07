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
      complete: (results) => {
        const parsedData = results.data.map(row => {
          const id = row.id || row.ID || row.Equipment_ID || 'N/A';
          const name = row.name || row.Equipment || row.Asset || 'Unknown';
          const loadVal = Number(row.load || row.Load || row.risk_score || 0);
          const status = row.status || (loadVal >= 80 ? 'CRITICAL' : 'STABLE');
          return { id, name, load: loadVal, status };
        });
        setData(parsedData);
        setLoading(false);
      },
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Equipment Analytics Report", 14, 15);
    autoTable(doc, {
      head: [["ID", "Name", "Status", "Load (%)"]],
      body: data.map(item => [item.id, item.name, item.status, `${item.load}%`]),
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [63, 66, 241] }
    });
    doc.save("Report.pdf");
  };

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      label: 'Load (%)',
      data: data.map(d => d.load),
      backgroundColor: data.map(d => d.load >= 80 ? '#ef4444' : '#6366f1'),
    }]
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2>GEMINI ANALYTICS</h2>
        <ul><li className="active">📊 Dashboard</li><li onClick={exportPDF}>📥 Export PDF</li></ul>
      </aside>
      <main className="main-content">
        <header>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1>System Overview</h1>
        </header>
        <section className="upload-box">
          <input type="file" accept=".csv" onChange={handleFileUpload} id="csv" />
          <label htmlFor="csv" className="btn-primary">{loading ? "Loading..." : "📂 Upload CSV"}</label>
        </section>
        {data.length > 0 && (
          <div className="results-container">
            <div className="chart-section"><Bar data={chartData} options={{ maintainAspectRatio: false }} /></div>
            <div className="table-section">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Status</th></tr></thead>
                <tbody>{data.map((item, i) => (
                  <tr key={i}><td>{item.id}</td><td>{item.name}</td>
                  <td><span className={`status-pill ${item.load >= 80 ? 'status-critical' : 'status-stable'}`}>{item.status}</span></td></tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
export default App;