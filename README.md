# ILI Predictor – Influenza Like Illness Prediction System

A production-ready full-stack web application designed for health analysts and administrators to upload epidemiological datasets, run machine learning models, and visualize Influenza-Like Illness (ILI) predictions.

## 🌟 Features
- **Authentication:** JWT-based role access control (Admin, Health Analyst).
- **Data Ingestion:** Upload CSV/Excel files with weekly epidemiological data.
- **ML Pipeline:** Preprocesses data, handles missing values, engineers features, and runs predictions using XGBoost.
- **Interactive Dashboard:** Vibrant, glassmorphic UI using Recharts and React.
- **Geospatial Surveillance:** Choropleth mapping for India state-wise risk levels using Leaflet.

## 🏗️ Architecture
1. **Frontend:** React + Vite (Vanilla CSS for styling, Recharts, Lucide-React).
2. **Backend Node.js:** Express server for API routing, auth, file handling (Multer), and DB interactions.
3. **ML Microservice:** Flask API + XGBoost running the predictive modeling layer.
4. **Database:** MongoDB (via Mongoose).

## 📂 Folder Structure
- `/frontend`: React UI source code
- `/backend`: Node.js Express server
- `/ml_service`: Python Flask API and XGBoost training pipeline

## 🚀 Setup Instructions

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run start
```
*Note: Configure your MongoDB URI in a `.env` file before running.*

### 3. ML Microservice Setup
```bash
cd ml_service
python -m venv venv
# Activate venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python model_pipeline.py # Train the mock model initially
python app.py # Start the Flask prediction API
```

## 🎨 UI/UX Design
The dashboard features a modern **glassmorphism** design pattern with a dark-mode theme, smooth gradients, and interactive micro-animations. It uses `Inter` for sophisticated typography.

## 🔗 APIs
- `POST /api/auth/login`: Authenticate users
- `POST /api/upload-data`: Handle CSV/Excel ingestion
- `GET /api/dashboard`: Retrieve aggregated metrics
- `POST /predict`: (ML Service) Runs the XGBoost pipeline on data
