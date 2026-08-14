"""
Utilities for pulling raw text out of uploaded complaint documents
(PDF or plain text/email files) so it can be handed to the LangGraph
extraction pipeline.
"""

import io
from fastapi import UploadFile
from pypdf import PdfReader


async def extract_text_from_upload(file: UploadFile) -> str:
    """
    Reads an UploadFile and returns its plain-text content.

    - .pdf files are parsed page-by-page with pypdf.
    - Everything else (.txt, .eml, .csv, etc.) is decoded as UTF-8,
      ignoring any bytes that can't be decoded.
    """
    filename = (file.filename or "").lower()

    if filename.endswith(".pdf"):
        pdf_bytes = await file.read()
        reader = PdfReader(io.BytesIO(pdf_bytes))
        pages_text = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages_text)

    raw_bytes = await file.read()
    return raw_bytes.decode("utf-8", errors="ignore")


def clean_text(text: str) -> str:
    """Light normalization before sending text to the LLM."""
    return "\n".join(line.strip() for line in text.splitlines() if line.strip())
