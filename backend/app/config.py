"""
Application configuration.

Loads environment variables (e.g. the Groq API key) from a local .env
file using python-dotenv, and exposes them as simple module-level
settings that the rest of the app can import.
"""

import os
from dotenv import load_dotenv

# Load variables from a .env file placed at backend/.env
load_dotenv()


class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Model names used by the LangGraph nodes
    EXTRACTOR_MODEL: str = os.getenv("EXTRACTOR_MODEL", "llama-3.3-70b-versatile")
    FAST_MODEL: str = os.getenv("FAST_MODEL", "gemma2-9b-it")

    # CORS
    ALLOWED_ORIGINS: list = os.getenv("ALLOWED_ORIGINS", "*").split(",")

    # App
    APP_NAME: str = "Pharma Complaint QMS Backend"
    APP_HOST: str = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT: int = int(os.getenv("APP_PORT", "8000"))


settings = Settings()

if not settings.GROQ_API_KEY:
    # Non-fatal: the app will still start, but any call to the LLM
    # nodes will fail until GROQ_API_KEY is set in backend/.env
    print("[config] WARNING: GROQ_API_KEY is not set. Add it to backend/.env")
