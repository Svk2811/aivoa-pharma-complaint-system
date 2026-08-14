from typing import List, Optional
from pydantic import BaseModel, Field


class ExtractedComplaintData(BaseModel):
    # Origin & Customer Details
    complaint_source: Optional[str] = Field(
        None, description="Source of complaint, e.g., Hospital, Pharmacy, Distributor"
    )
    customer_name: Optional[str] = Field(
        None, description="Name of complainant or organization"
    )

    # Product & Batch Identification
    product_name: Optional[str] = Field(
        None, description="Trade or generic pharmaceutical product name"
    )
    product_strength_grade: Optional[str] = Field(
        None, description="Strength or pharmacopoeial grade (e.g. 500mg, USP, BP)"
    )
    batch_lot_number: Optional[str] = Field(
        None, description="Batch or lot identification code"
    )
    manufacturing_date: Optional[str] = Field(
        None, description="Manufacturing date in YYYY-MM-DD format if available"
    )
    expiry_date: Optional[str] = Field(
        None, description="Expiry date in YYYY-MM-DD format if available"
    )
    quantity_affected: Optional[str] = Field(
        None, description="Quantity or packaging units affected"
    )

    # Complaint Details
    complaint_type: Optional[str] = Field(
        None,
        description="Classification: Packaging Defect, Contamination, Sub-potency, Labelling Error, Physical Defect",
    )
    complaint_date: Optional[str] = Field(
        None, description="Date when complaint was raised (YYYY-MM-DD)"
    )
    detailed_description: Optional[str] = Field(
        None, description="Comprehensive summary of the customer's reported issue"
    )


class RiskAndCAPAAssessment(BaseModel):
    initial_severity: str = Field(
        ..., description="Severity level: Critical, Major, or Minor based on GMP standards"
    )
    priority: str = Field(..., description="Action priority: High, Medium, or Low")
    completeness_score: int = Field(
        ..., description="Completeness percentage (0-100%)"
    )
    missing_fields: List[str] = Field(
        default_factory=list, description="Mandatory GMP fields missing from input"
    )
    probable_root_cause: str = Field(
        ..., description="Preliminary technical root cause hypothesis"
    )
    recommended_capa: str = Field(
        ..., description="Recommended Corrective and Preventive Action (CAPA)"
    )


class ComplaintProcessingResponse(BaseModel):
    extracted_data: ExtractedComplaintData
    assessment: RiskAndCAPAAssessment
    status: str
