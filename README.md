# ⚗️ Industrial Equipment Analytics Suite

### 🌟 Project Executive Summary
This suite was engineered to digitize and automate manual auditing processes in industrial chemical plants. By bridging a **Django API** with a **React Dashboard** and a **PyQt5 Desktop Client**, the system provides a 360-degree view of equipment health and operational safety.

---

## 🛠️ Technical Architecture

### 1. Data Analytics Core (Django & Pandas)
* **Orchestration:** Developed a centralized API to handle complex file parsing.
* **Logic:** Integrated **Pandas** for real-time statistical analysis.
* **Design:** Adopted **Class-Based Views (CBVs)** for professional scalability.

### 2. Kinetics: Algorithmic Risk Assessment
* **Intelligence:** Built a module that audits raw datasets against safety thresholds to identify "High-Risk" equipment automatically.
* **Reporting:** Automatically generates a `high_risk_equipment.csv` audit report.

---

## 📂 Repository Organization
* **📂 server/** — Django REST API (Backend Engine)
* **📂 web/** — React.js Dashboard (Web UI)
* **📂 kinetics/** — Risk Analysis & Safety Module (Python Logic)
* **📂 desktop/** — PyQt5 Standalone Client (Desktop UI)
* **📄 sample_data.csv** — Equipment Dataset for demonstration

---

## 🚀 Installation & Setup Instructions

### **1. Prerequisites**
* Python 3.x installed
* Node.js and npm installed

### **2. Backend Setup (Django)**
```bash
cd server
python -m venv .venv
# Windows Activation:
.venv\Scripts\activate
# Install & Run:
pip install django django-cors-headers pandas
python manage.py migrate
python manage.py runserver

### 3. Frontend Setup (React)
cd web
npm install
npm start

###4. Safety Logic (Kinetics)
cd kinetics
python main.py

Developer: Shivani Full-Stack Engineering | Industrial IoT | Data Analytics