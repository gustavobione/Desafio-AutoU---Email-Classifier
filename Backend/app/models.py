from pydantic import BaseModel

class EmailRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    main_category: str
    department: str
    status: str
    reason: str
    rewritten_email: str