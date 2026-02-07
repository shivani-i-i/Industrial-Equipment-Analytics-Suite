import React, { useState, useEffect } from 'react';
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
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({ total: 0, average: 0, critical: 0 });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/upload-csv/')
      .then(res => res.json())
      .then(result => { if (result.history) setHistory(result.history); })
      .catch(() => console.log("Backend offline - History hidden"));
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: async (results) => {
        const parsedData = results.data.map((row, index) => ({
          id: index + 1,
          name: (row["Equipment Name"] || row.Equipment || "Unknown").trim(),
          load: Number(String(row.Flowrate || 0).replace(/[^0-9.]/g, '')),
        }));

        try {
          const apiResponse = await fetch('http://127.0.0.1:8000/api/upload-csv/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, data: parsedData })
          });
          const result = await apiResponse.json();
          setSummary({
            total: result.total_count,
            average: result.avg_value,
            critical: result.distribution?.critical || 0
          });
          setHistory(result.history || []);
        } catch (err) {
          console.error("Backend Error - processing locally");
        }

        setData(parsedData);
        setLoading(false);
      },
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Equipment Analytics Report", 14, 15);
    autoTable(doc, {
      head: [["ID", "Equipment", "Flowrate"]],
      body: data.map(item => [item.id, item.name, item.load]),
      startY: 20,
    });
    doc.save("Report.pdf");
  };

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      label: 'Flowrate (m³/h)',
      data: data.map(d => d.load),
      backgroundColor: data.map(d => d.load > 140 ? '#ef4444' : '#6366f1'),
      borderRadius: 5,
    }]
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2>GEMINI ANALYTICS</h2>
        <div className="history-section">
          <h3>Recent History</h3>
          {history.map((h, i) => (
            <div key={i} className="history-item">
              <small>{h.date}</small>
              <p>{h.filename}</p>
            </div>
          ))}
        </div>
        <button className="export-btn" onClick={exportPDF}>📥 Export PDF</button>
      </aside>

      <main className="main-content">
        <header>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="system-title">System Overview</h1>
        </header>

        <section className="upload-box">
          <input type="file" accept=".csv" onChange={handleFileUpload} id="csv-upload" hidden />
          <label htmlFor="csv-upload" className="btn-primary">
            {loading ? "Processing..." : "📂 Upload CSV File"}
          </label>
        </section>

        {data.length > 0 && (
          <div className="results-grid">
            <div className="stats-row">
              <div className="stat-card"><strong>Total</strong> {summary.total || data.length}</div>
              <div className="stat-card"><strong>Average</strong> {summary.average} m³/h</div>
              <div className="stat-card"><strong>Critical</strong> {summary.critical}</div>
            </div>
            <div className="card">
              <div style={{ height: '350px' }}>
                <Bar data={chartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;