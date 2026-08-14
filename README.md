# AI-Powered Customer Complaint Management System (Pharma QMS)

An AI-assisted complaint intake tool for pharmaceutical manufacturing. Upload or
paste a customer complaint (email, PDF, or free text) and a LangGraph-driven
agent pipeline extracts structured fields, checks GMP-mandatory completeness,
and produces a risk/CAPA assessment — auto-populating the complaint form.

## Stack
- **Frontend:** React + Redux Toolkit, Tailwind CSS, Vite, Google Inter font
- **Backend:** Python, FastAPI
- **AI Agent Framework:** LangGraph
- **LLMs:** Groq — `llama-3.3-70b-versatile` (extraction / risk & CAPA), `gemma2-9b-it` available for lighter tasks
- **Database:** PostgreSQL/MySQL (persistence layer stubbed — see `app.main.process_complaint`)

## Project Structure
```
pharma-complaint-system/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app & routing
│   │   ├── config.py            # Environment variables (Groq API key, model names)
│   │   ├── schemas.py           # Pydantic models for structured LLM output
│   │   ├── graph/
│   │   │   ├── state.py         # LangGraph State definition
│   │   │   ├── nodes.py         # Graph nodes (extraction, completeness, risk/CAPA)
│   │   │   └── workflow.py      # Compiled LangGraph workflow
│   │   └── utils/
│   │       └── parser.py        # PDF & text extraction
│   ├── requirements.txt
│   └── .env                     # GROQ_API_KEY goes here (not committed)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ComplaintForm.jsx  # Left panel: Log Customer Complaint form
    │   │   ├── AIIntake.jsx       # Right panel: upload/paste + extraction progress
    │   │   └── CopilotChat.jsx    # AI assistant & risk/CAPA summary
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── complaintSlice.js  # Form state + async thunk calling the backend
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── postcss.config.js
    ├── tailwind.config.js
    └── package.json
```

## AI Workflow (LangGraph)
`extract → check_completeness → risk_capa_assessment → END`

1. **extract** — LLM extraction into the `ExtractedComplaintData` schema (origin,
   customer, product/batch, complaint details).
2. **check_completeness** — deterministic check of GMP-mandatory fields
   (customer name, product name, batch/lot number, complaint type, description);
   produces a missing-fields list and a completeness score.
3. **risk_capa_assessment** — LLM assessment of severity (Critical/Major/Minor per
   GMP), priority, probable root cause, and recommended CAPA using ICH Q9/Q10-style
   guidance.

## Setup

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env .env   # then edit .env and add your GROQ_API_KEY
uvicorn app.main:app --reload
```
Backend runs at `http://localhost:8000` (`/api/health`, `/api/process-complaint`).

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:8000
npm run dev
```
Frontend runs at `http://localhost:5173`.

## API

`POST /api/process-complaint` — multipart form, either:
- `file`: a PDF/TXT/EML complaint document, or
- `text`: pasted complaint text

Returns:
```json
{
  "extracted_data": { "customer_name": "...", "product_name": "...", "...": "..." },
  "assessment": {
    "initial_severity": "Major",
    "priority": "High",
    "completeness_score": 80,
    "missing_fields": ["manufacturing_date"],
    "probable_root_cause": "...",
    "recommended_capa": "..."
  },
  "status": "success"
}
```

## Notes
- Get a Groq API key at https://console.groq.com.
- The "Save Complaint" button is currently a stub — wire it to a persistence
  endpoint backed by Postgres/MySQL to store submitted complaints.
- Sample pharma complaint PDFs/emails can be created for demo purposes; no
  production-grade OCR is required per the assignment.
