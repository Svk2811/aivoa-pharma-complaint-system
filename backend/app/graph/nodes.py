from typing import Dict, Any

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from app.config import settings
from app.schemas import ExtractedComplaintData, RiskAndCAPAAssessment
from app.graph.state import ComplaintState

# Primary LLM used for both extraction and risk/CAPA assessment
extractor_llm = ChatGroq(
    model_name=settings.EXTRACTOR_MODEL,
    groq_api_key=settings.GROQ_API_KEY,
    temperature=0.0,
)

MANDATORY_FIELDS = [
    "customer_name",
    "product_name",
    "batch_lot_number",
    "complaint_type",
    "detailed_description",
]


def extraction_node(state: ComplaintState) -> Dict[str, Any]:
    """Extracts structured fields from raw complaint text."""
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                (
                    "You are an expert Pharmaceutical Quality Assurance Auditor. Extract all key "
                    "complaint, batch, and customer information from the provided document/email "
                    "text into structured JSON format. If a field is not present, leave it null."
                ),
            ),
            ("human", "Complaint Text:\n{text}"),
        ]
    )

    structured_llm = extractor_llm.with_structured_output(ExtractedComplaintData)
    chain = prompt | structured_llm

    result = chain.invoke({"text": state["raw_text"]})
    return {"extracted_data": result.model_dump()}


def completeness_check_node(state: ComplaintState) -> Dict[str, Any]:
    """Validates missing mandatory regulatory fields."""
    data = state.get("extracted_data") or {}

    missing = [field for field in MANDATORY_FIELDS if not data.get(field)]
    score = int(((len(MANDATORY_FIELDS) - len(missing)) / len(MANDATORY_FIELDS)) * 100)

    return {
        "missing_fields": missing,
        "completeness_score": score,
    }


def risk_and_capa_node(state: ComplaintState) -> Dict[str, Any]:
    """Assesses severity, risk priority, root causes, and CAPA in pharma QMS."""
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                (
                    "You are a Senior Pharma QMS Director. Assess the severity (Critical, Major, "
                    "Minor), Priority (High, Medium, Low), probable root cause, and recommended "
                    "CAPA based on standard Good Manufacturing Practices (GMP) and ICH Q9/Q10 "
                    "guidelines.\n"
                    "- Critical: Contamination, sub-potency, sterility failure, health hazard.\n"
                    "- Major: Missing label details, damaged primary packaging, discoloration.\n"
                    "- Minor: Outer carton dent, secondary packaging cosmetic scuffs."
                ),
            ),
            ("human", "Complaint Details:\n{details}\nMissing Fields:\n{missing}"),
        ]
    )

    structured_llm = extractor_llm.with_structured_output(RiskAndCAPAAssessment)
    chain = prompt | structured_llm

    result = chain.invoke(
        {
            "details": str(state.get("extracted_data")),
            "missing": str(state.get("missing_fields")),
        }
    )

    assessment_dict = result.model_dump()
    # Overwrite with the deterministic values computed in completeness_check_node
    assessment_dict["completeness_score"] = state["completeness_score"]
    assessment_dict["missing_fields"] = state["missing_fields"]

    return {"assessment": assessment_dict}
