# 💊 AI-Powered Pharmaceutical Complaint Management System

[![Live Demo](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://aivoa-pharma-complaint-system.vercel.app/)
[![Backend API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://aivoa-pharma-complaint-system.onrender.com/docs)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Orchestration-orange?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)

An end-to-end AI system designed to streamline, validate, and analyze pharmaceutical product complaints. Powered by **FastAPI**, **LangGraph**, **Groq LLMs**, and **React**, this platform automates document intake, structured entity extraction, risk classification, and CAPA (Corrective and Preventive Actions) generation.

---

## 🔗 Quick Links

- 🌐 **Live Web Application:** [aivoa-pharma-complaint-system.vercel.app](https://aivoa-pharma-complaint-system.vercel.app/)
- ⚙️ **Backend API & Swagger Docs:** [aivoa-pharma-complaint-system.onrender.com/docs](https://aivoa-pharma-complaint-system.onrender.com/docs)
- 🎥 **Video Demonstration:** [Watch Demo on Google Drive](https://drive.google.com/file/d/1EX7zAZ2J9Xsv0tdTI8vZyJlI3fAVGoYH/view?usp=drivesdk)

---

## ✨ Key Features

- **Multimodal Intake:** Supports direct plain-text input as well as document uploads (PDF, DOCX, TXT) with automatic text extraction.
- **LangGraph Orchestration:** Modular graph workflow coordinating extraction, quality validation, severity grading, and regulatory risk scoring.
- **CAPA Recommendations:** Automatically suggests context-aware Corrective and Preventive Actions based on reported deviations or defects.
- **Interactive AI Copilot:** Built-in assistant to query complaint history, clarify risk assessments, and generate investigation summaries.
- **Real-time State Management:** Responsive user interface built with React, Redux Toolkit, and Tailwind CSS.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), Redux Toolkit, Tailwind CSS, Lucide Icons |
| **Backend** | FastAPI, Uvicorn, Pydantic |
| **AI / Orchestration** | LangGraph, LangChain, Groq API (Llama-3 models) |
| **Parsers & Utilities** | PyPDF, python-multipart |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📁 Repository Structure

```text
aivoa-pharma-complaint-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app & routing
│   │   ├── config.py            # Environment settings (Groq API Key)
│   │   ├── schemas.py           # Pydantic data models
│   │   ├── graph/
│   │   │   ├── __init__.py
│   │   │   ├── state.py         # LangGraph state definitions
│   │   │   ├── nodes.py         # Graph execution nodes (Extraction, Risk, CAPA)
│   │   │   └── workflow.py      # Compiled LangGraph pipeline
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── parser.py        # PDF & document extraction helpers
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ComplaintForm.jsx # Left panel complaint editor
    │   │   ├── AIIntake.jsx      # File upload & intake dropzone
    │   │   └── CopilotChat.jsx   # AI risk assessment & assistant
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── complaintSlice.js # Global form & intake state
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Local Development Setup

### 1. Prerequisites

- Python 3.10+
- Node.js 18+ & npm
- Groq API Key ([console.groq.com](https://console.groq.com))

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env   # Or create .env manually
```

Add your environment variables in `backend/.env`:

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,https://aivoa-pharma-complaint-system.vercel.app
```

Run the backend server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API will be available at: `http://localhost:8000`
- Interactive API docs: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

- App will run at: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend health check & service status |
| `POST` | `/api/process-complaint` | Ingests raw text or file uploads through the LangGraph pipeline |

---

## 📄 License

This project is licensed under the MIT License.
