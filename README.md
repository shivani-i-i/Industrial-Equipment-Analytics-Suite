⚗️ Industrial Equipment Analytics & Risk Management Suite
An Integrated Full-Stack Ecosystem for Chemical Engineering Data

🌟 Project Executive Summary
This suite was engineered to digitize and automate manual auditing processes in industrial chemical plants. By bridging a Django API with a React Dashboard and a PyQt5 Desktop Client, the system provides a 360-degree view of equipment health and operational safety.

🛠️ Technical Architecture
1. Data Analytics Core (Django & Pandas)
Orchestration: Developed a centralized API to handle complex file parsing and multi-part data streams.

Logic: Integrated Pandas to execute real-time statistical analysis for pressure and flowrate metrics.

Design Pattern: Adopted Class-Based Views (CBVs) for professional, scalable endpoint structure.

2. Kinetics: Algorithmic Risk Assessment
Intelligence: Built a module that audits raw datasets against safety thresholds to identify "High-Risk" equipment automatically.

Reporting: Automatically generates a high_risk_equipment.csv audit report for maintenance teams.

📂 Repository Organization
📂 server/ — Django REST API (Backend Engine)

📂 web/ — React.js Dashboard (Web UI)

📂 kinetics/ — Risk Analysis & Safety Module (Python Logic)

📂 desktop/ — PyQt5 Standalone Client (Desktop UI)

📄 sample_data.csv — Equipment Dataset for demonstration

🚀 Installation & Setup Instructions
Follow these steps to get the environment running on your local machine:

1. Prerequisites
Python 3.x installed

Node.js and npm installed

2. Backend Setup (Django)
Bash
cd server
python -m venv .venv
# Activate venv: .venv\Scripts\activate (Windows) or source .venv/bin/activate (Mac/Linux)
pip install django django-cors-headers pandas
python manage.py migrate
python manage.py runserver
3. Frontend Setup (React)
Bash
cd ../web
npm install
npm start
4. Running the Risk Analysis Module
Bash
cd ../kinetics
python main.py
Developer: Shivani Focused on Full-Stack Engineering, Industrial IoT, and Data Analytics.