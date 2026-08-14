from typing import TypedDict, Optional, List, Dict, Any


class ComplaintState(TypedDict):
    raw_text: str
    extracted_data: Optional[Dict[str, Any]]
    missing_fields: Optional[List[str]]
    completeness_score: Optional[int]
    assessment: Optional[Dict[str, Any]]
