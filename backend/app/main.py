import logging
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.graph.workflow import complaint_workflow
from app.schemas import ComplaintProcessingResponse
from app.utils.parser import extract_text_from_upload

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("pharma-complaint-api")

app = FastAPI(
    title=settings.APP_NAME,
    description="Automated AI-powered pharmaceutical complaint intake, risk classification, and CAPA suggestion workflow using LangGraph.",
    version="1.0.0",
)

# CORS Setup - handles list or comma-separated string from config
origins = getattr(settings, "ALLOWED_ORIGINS", ["*"])
if isinstance(origins, str):
    origins = [origin.strip() for origin in origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "service": settings.APP_NAME,
        "status": "active",
        "docs": "/docs",
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": settings.APP_NAME,
    }


@app.post(
    "/api/process-complaint",
    response_model=ComplaintProcessingResponse,
    status_code=status.HTTP_200_OK,
)
async def process_complaint(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    """
    Process incoming complaints via plain text input or uploaded document files (PDF, DOCX, TXT).
    Executes the LangGraph extraction, validation, and risk assessment pipeline.
    """
    raw_content = ""

    try:
        if file and file.filename:
            logger.info("Processing uploaded document: %s", file.filename)
            raw_content = await extract_text_from_upload(file)
        elif text and text.strip():
            logger.info("Processing raw text input")
            raw_content = text.strip()
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide either plain text or upload a valid document.",
            )

        if not raw_content or not raw_content.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to extract readable text content from the input.",
            )

        # Run LangGraph pipeline
        initial_state = {"raw_text": raw_content}
        result = await complaint_workflow.ainvoke(initial_state)

        return ComplaintProcessingResponse(
            extracted_data=result.get("extracted_data"),
            assessment=result.get("assessment"),
            status="success",
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Error executing complaint workflow: %s", str(exc), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while executing the processing workflow: {str(exc)}",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=getattr(settings, "APP_HOST", "0.0.0.0"),
        port=getattr(settings, "APP_PORT", 8000),
        reload=True,
    )
