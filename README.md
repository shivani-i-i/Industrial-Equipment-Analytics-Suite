⚗️ Industrial Equipment Analytics & Risk Management Suite

🌟 Project Executive Summary
This suite was engineered to digitize and automate the manual auditing processes common in industrial chemical plants. By bridging a Django API with a React Dashboard and a PyQt5 Desktop Client, the system provides a 360-degree view of equipment health and operational safety.

🛠️ Technical Architecture
1. Data Analytics Core (Django & Pandas)
Orchestration: Developed a centralized API to handle complex file parsing and multi-part data streams.

Logic: Integrated Pandas to execute real-time statistical analysis for pressure and flowrate metrics.

Design Pattern: Adopted Class-Based Views (CBVs) to maximize code reusability and maintain a clean endpoint structure.

2. Kinetics: Algorithmic Risk Assessment
Intelligence: Built a specialized module that audits raw datasets against safety thresholds to identify "High-Risk" equipment.

Reporting: Automatically generates a high_risk_equipment.csv audit report to streamline maintenance workflows.

3. Dual-Platform Interface
Web Dashboard (React): Features an interactive, state-driven UI that translates data into teal bar charts via Chart.js.

Desktop Client (PyQt5): Engineered for "Offline-First" environments, providing engineers with analytical tools without a network connection.

📂 Repository Organization
📂 server/ — Django REST API (Backend Engine)

📂 web/ — React.js Dashboard (Web UI)

📂 kinetics/ — Risk Analysis & Safety Module (Python Logic)

📂 desktop/ — PyQt5 Standalone Client (Desktop UI)

📄 sample_data.csv — Equipment Dataset for demonstration

🚀 Deployment Instructions
Backend:
cd server && python manage.py runserver

Frontend:
cd web && npm start

Safety Engine:
cd kinetics && python main.py

Developer: Shivani Focused on Full-Stack Engineering, Industrial IoT, and Data Analytics.