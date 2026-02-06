⚗️ Industrial Equipment Analytics & Risk Management Suite
An Integrated Full-Stack Ecosystem for Chemical Engineering Data

🌟 Project Executive Summary
This suite was engineered to digitize and automate the manual auditing processes common in industrial chemical plants. By bridging a High-Performance Django API with a Reactive Web Dashboard and a Standalone Desktop Client, the system provides a 360-degree view of equipment health and operational safety.

🛠️ Technical Architecture & Innovations
1. Data Analytics Core (Django REST Framework)
Orchestration: Developed a centralized API to handle complex file parsing and multi-part data streams.

Computational Logic: Integrated Pandas to execute real-time statistical analysis, providing instant arithmetic means for critical pressure and flowrate metrics.

Design Pattern: Adopted Class-Based Views (CBVs) to maximize code reusability and maintain a clean, professional endpoint structure.

2. Kinetics: Algorithmic Risk Assessment
Intelligence: Built a specialized module that audits raw datasets against safety thresholds to automatically identify "High-Risk" equipment.

Automated Reporting: Implemented a direct-to-CSV export feature (high_risk_equipment.csv) to streamline the workflow for onsite maintenance teams.

3. Dual-Platform Visualization Interface
Web Dashboard (React): Features an interactive, state-driven UI that translates JSON payloads into high-fidelity teal bar charts via Chart.js.

Desktop Standalone (PyQt5): Engineered for "Offline-First" environments, providing field engineers with robust analytical tools without requiring a network connection.

📂 Repository Organization
├── 📂 server/         # Django REST API (Backend Engine)
├── 📂 web/            # React.js Dashboard (Web UI)
├── 📂 kinetics/       # Risk Analysis & Safety Module (Python Logic)
├── 📂 desktop/        # PyQt5 Standalone Client (Desktop UI)
└── 📄 sample_data.csv # Equipment Dataset for demonstration

🧠 Engineering Challenges Overcome
CORS Security Implementation: Resolved Cross-Origin Resource Sharing (CORS) barriers by configuring middleware to allow secure handshakes between the React frontend and Django backend.

Resilient Data Parsing: Optimized the backend to intelligently map equipment data even when CSV headers vary, preventing system downtime during data ingestion.

Environment Management: Successfully managed isolated virtual environments for distinct project tiers (Web, Server, and Desktop), ensuring zero dependency conflicts.

🚀 Deployment Instructions
Backend:
Bash
cd server && python manage.py runserver
Frontend:
Bash
cd web && npm start
Safety Engine:
Bash
cd kinetics && python main.py
Developer: Shivani
Focused on Full-Stack Engineering, Industrial IoT, and Data Analytics.