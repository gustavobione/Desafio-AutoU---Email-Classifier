from pydantic import BaseModel

# Define a estrutura do JSON que a API espera receber
# Ex: { "text": "corpo do email aqui..." }
class EmailRequest(BaseModel):
    text: str

# Define a estrutura do JSON que a API vai responder
# Ex: { "category": "Produtivo", "suggested_response": "..." }
class ClassificationResponse(BaseModel):
    category: str
    suggested_response: str