from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.graph.workflow import complaint_workflow
from app.schemas import ComplaintProcessingResponse
from app.utils.parser import extract_text_from_upload

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.post("/api/process-complaint", response_model=ComplaintProcessingResponse)
async def process_complaint(
    text: str = Form(None),
    file: UploadFile = File(None),
):
    raw_content = ""

    if file:
        raw_content = await extract_text_from_upload(file)
    elif text:
        raw_content = text
    else:
        raise HTTPException(
            status_code=400, detail="Provide either plain text or a valid document."
        )

    if not raw_content.strip():
        raise HTTPException(
            status_code=400, detail="Document text could not be extracted."
        )

    # Execute LangGraph Pipeline
    initial_state = {"raw_text": raw_content}
    result = await complaint_workflow.ainvoke(initial_state)

    return {
        "extracted_data": result["extracted_data"],
        "assessment": result["assessment"],
        "status": "success",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=True,
    )
