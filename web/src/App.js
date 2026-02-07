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
        const parsedData = results.data.map((row, index) => {
          // MAPPING: Matches your CSV headers (Equipment, Flowrate)
          const name = row.Equipment || row.name || "Unknown";
          const loadVal = Number(row.Flowrate || row.load || 0);
          const status = loadVal > 140 ? 'CRITICAL' : 'STABLE';
          const id = index + 1;

          return { id, name, load: loadVal, status };
        });
        setData(parsedData);
        setLoading(false);
      },
    });
  };

  const exportPDF = () => {
    if (data.length === 0) return;
    const doc = new jsPDF();
    doc.text("Chemical Equipment Flowrate Report", 14, 15);
    autoTable(doc, {
      head: [["ID", "Equipment", "Status", "Flowrate"]],
      body: data.map(item => [item.id, item.name, item.status, item.load]),
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });
    doc.save("Equipment_Report.pdf");
  };

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      label: 'Flowrate',
      data: data.map(d => d.load),
      backgroundColor: data.map(d => d.load > 140 ? '#ef4444' : '#6366f1'),
      borderRadius: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, suggestedMax: 200 }
    }
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <h2>GEMINI ANALYTICS</h2>
        <ul>
          <li className="active" onClick={() => window.location.reload()}>📊 Dashboard</li>
          <li onClick={exportPDF}>📥 Export PDF</li>
        </ul>
      </aside>

      <main className="main-content">
        <header>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1>System Overview</h1>
        </header>

        <section className="upload-box">
          <input type="file" accept=".csv" onChange={handleFileUpload} id="csv-upload" />
          <label htmlFor="csv-upload" className="btn-primary">
            {loading ? "Processing..." : "📂 Upload CSV File"}
          </label>
          <p>Upload your chemical equipment data to generate insights.</p>
        </section>

        {data.length > 0 && (
          <div className="results-container">
            <div className="chart-section">
              <h3>Flowrate Distribution</h3>
              <div style={{ height: '350px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="table-section">
              <h3>Live Status Logs</h3>
              <table>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {data.map((item, i) => (
                    <tr key={i}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
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
        )}
      </main>
    </div>
  );
}

export default App;