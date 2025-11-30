from pydantic import BaseModel
from typing import Optional, List

class AdminDashboardResponse(BaseModel):
    total_leads: Optional[int] = None
    new_this_week: Optional[int] = None

    total_telecallers: Optional[int] = None
    inactive_telecallers: Optional[int] = None

    total_conversions: Optional[int] = None
    conversion_rate: Optional[float] = None

    total_calls: Optional[int] = None
    pending_followups: Optional[int] = None
    interested_prospects: Optional[int] = None

    unassigned_leads: Optional[int] = None

    class Config:
        orm_mode = True

class TelecallerActiveResponse(BaseModel):
    name: str
    total_leads: int
    converted: int
    conversion_rate: float

class ChartData(BaseModel):
    date: str
    total_leads: int
    total_calls: int

class StatusSummary(BaseModel):
    status: str
    count: int
    percentage: float

class TelecallerSummary(BaseModel):
    telecaller_id: int
    name: str
    total_leads: int
    total_calls: int
    converted: int

class SourceSummary(BaseModel):
    source: str
    total_leads: int
    percentage: float

class DashboardResponse(BaseModel):
    total_leads: int
    total_calls: int
    converted: int
    avg_calls_per_lead: float
    conversion_rate: float
    chart: List[ChartData]
    status_summary: List[StatusSummary]
    telecaller_summary: List[TelecallerSummary]
    source_summary: List[SourceSummary]