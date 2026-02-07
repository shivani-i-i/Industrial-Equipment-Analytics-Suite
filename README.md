# ⚗️ Industrial Equipment Analytics Suite
**A High-Performance Full-Stack Solution for Chemical Plant Auditing**

### 🌟 Project Executive Summary
This suite was engineered to digitize and automate manual auditing processes in industrial chemical plants. By bridging a **Django REST API** with a **React Dashboard** and **Pandas-driven analytics**, the system provides a 360-degree view of equipment health, operational safety, and historical data trends.

---

## ✨ Key Features & Functionalities

* **Smart CSV Ingestion:** Intelligent header mapping that automatically identifies and processes equipment data regardless of column order.
* **Real-time Analytics Dashboard:** Dynamic visualization using **Chart.js**, featuring conditional formatting (Red for Critical, Blue for Stable) based on industrial safety thresholds ($> 140$ m³/h).
* **Historical Data Tracking:** Automated history management system that stores and retrieves the last 5 audit datasets using **SQLite**.
* **Automated PDF Reporting:** One-click generation of professional industrial reports via **ReportLab**, including date-stamped summaries of equipment distribution.
* **Multi-Platform Access:** Native support for both **Web (React)** and **Desktop (PyQt5)** clients communicating through a unified API.
* **Advanced Safety Logic:** The **Kinetics** module performs algorithmic risk assessments, identifying high-risk assets and exporting dedicated audit CSVs.

---

## 🛠️ Technical Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | **Django 5.x**, **Django REST Framework**, **Pandas** |
| **Frontend** | **React.js**, **Chart.js**, **Tailwind/Custom CSS** |
| **Desktop** | **Python**, **PyQt5**, **Matplotlib** |
| **Database** | **SQLite3** (Development/Staging) |
| **Libraries** | **ReportLab** (PDF), **PapaParse** (CSV), **Axios** |

---

## 📂 Repository Organization

* **📂 server/** — Django REST API (Backend Engine)
* **📂 web/** — React.js Dashboard (Web UI)
* **📂 kinetics/** — Risk Analysis & Safety Module (Python Logic)
* **📂 desktop/** — PyQt5 Standalone Client (Desktop UI)
* **📄 sample_equipment_data.csv** — Standardized dataset for demo

---

## 🚀 Installation & Setup Instructions

### **1. Prerequisites**
* **Python 3.x** installed
* **Node.js** and **npm** installed

### **2. Backend Setup (Django)**
```bash
cd server
python -m venv .venv
# Windows Activation:
.venv\Scripts\activate
# Install & Run:
pip install django django-cors-headers djangorestframework pandas reportlab
python manage.py migrate
python manage.py runserver

3. Frontend Setup (React)
Bash
cd web
npm install
npm start
4. Safety Logic (Kinetics)
Bash
cd kinetics
python main.py
📊 System Architecture & Data Flow
Ingestion: User uploads a CSV via the React Dashboard.

Processing: Django API receives the JSON payload, and Pandas performs statistical normalization.

Storage: Results are saved to the SQLite history table via the EquipmentAnalysis model.

Visualization: React fetches the updated stats and renders the Chart.js bar graph with safety alerts.

👤 Developer
Shivani Full-Stack Engineering | Industrial IoT | Data Analytics