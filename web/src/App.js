import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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

  // File Parsing Logic specifically for your CSV format
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const processed = results.data.map(row => {
          const temp = Number(row.Temperature) || 0;
          const press = Number(row.Pressure) || 0;
          
          // Defining Industrial Health Rules
          let healthStatus = 'Stable';
          if (temp > 130 || press > 7.8) healthStatus = 'Critical';
          else if (temp > 115 || press > 6.5) healthStatus = 'Warning';

          return {
            name: row['Equipment Name'] || 'Unknown',
            type: row.Type || 'Generic',
            flow: row.Flowrate || 0,
            pressure: press,
            temp: temp,
            status: healthStatus
          };
        });
        setData(processed);
        setLoading(false);
      },
    });
  };

  // PDF Export for Industrial Submission
  const exportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text("EQUIPMENT ANALYTICS SUBMISSION", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    const tableRows = data.map(d => [d.name, d.type, d.flow, d.pressure, d.temp, d.status]);
    doc.autoTable({
      head: [["Equipment", "Type", "Flowrate", "Pressure", "Temp (°C)", "Status"]],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      didParseCell: (data) => {
        if (data.cell.text[0] === 'Critical') data.cell.styles.textColor = [239, 68, 68];
      }
    });

    doc.save("Industrial_Equipment_Report.pdf");
  };

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      label: 'Temperature Reading (°C)',
      data: data.map(d => d.temp),
      backgroundColor: data.map(d => d.status === 'Critical' ? '#ef4444' : '#6366f1'),
      borderRadius: 4,
    }]
  };

  return (
    <div className="dashboard-container">
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-logo"><h2>EQUIP-AI</h2></div>
        <ul>
          <li className="active">Monitoring</li>
          <li>System Logs</li>
          <li>PDF Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <header>
          <div>
            <h1>Equipment Performance</h1>
            <p className="subtitle">Syncing from: sample_equipment_data.csv</p>
          </div>
          {data.length > 0 && <button className="btn-export" onClick={exportPDF}>Export Final PDF</button>}
        </header>

        <section className="stats-grid">
          <div className="card"><h3>Active Units</h3><p>{data.length}</p></div>
          <div className="card critical"><h3>Critical Alerts</h3><p>{data.filter(d => d.status === 'Critical').length}</p></div>
          <div className="card uptime"><h3>Avg Pressure</h3><p>{data.length ? (data.reduce((a,b) => a + b.pressure, 0)/data.length).toFixed(1) : 0} bar</p></div>
        </section>

        <section className="upload-box">
          <input type="file" accept=".csv" id="csv-in" onChange={handleFileUpload} />
          <label htmlFor="csv-in">
            {loading ? "Processing Sensors..." : "Click to Upload CSV & Generate Dashboard"}
          </label>
        </section>

        {data.length > 0 ? (
          <div className="results-container">
            <div className="chart-section">
              <h3>Thermal Profile</h3>
              <div style={{ height: '300px' }}><Bar data={chartData} options={{ maintainAspectRatio: false }} /></div>
            </div>
            <div className="table-section">
              <h3>Live Sensor Data</h3>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Equipment</th><th>Status</th></tr></thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td><span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">Upload the equipment CSV to sync the sensor dashboard.</div>
        )}
      </main>
    </div>
  );
}

export default App;