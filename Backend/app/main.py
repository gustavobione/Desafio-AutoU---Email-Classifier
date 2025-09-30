from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from . import models, services

app = FastAPI(title="AutoU Email Classifier API")

# Configuração de CORS para permitir que o seu frontend React (rodando em localhost:5173)
# possa fazer requisições para este backend (rodando em localhost:8000).
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/classify", response_model=models.ClassificationResponse)
async def classify_email_endpoint(request: models.EmailRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="O texto do email não pode estar vazio.")
    
    # Chama a função do services.py para fazer o trabalho pesado
    result = services.get_gemini_response(request.text)

    if result["category"] == "Erro":
        raise HTTPException(status_code=500, detail=result["suggested_response"])

    return result

@app.get("/")
def read_root():
    return {"status": "API online"}