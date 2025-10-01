from pydantic import BaseModel

class EmailRequest(BaseModel):
    text: str

# ATUALIZAÇÃO: Adicionado o campo 'improvement_suggestion'
class AnalysisResponse(BaseModel):
    status: str
    reason: str
    improvement_suggestion: str