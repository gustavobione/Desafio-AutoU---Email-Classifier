from pydantic import BaseModel

class EmailRequest(BaseModel):
    text: str

# ATUALIZAÇÃO: O modelo de resposta agora é muito mais detalhado.
class AnalysisResponse(BaseModel):
    department: str
    status: str
    reason: str
    rewritten_email: str