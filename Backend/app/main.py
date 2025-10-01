from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# --- 1. IMPORTAÇÃO ADICIONADA ---
from fastapi.concurrency import run_in_threadpool
from . import models, services

app = FastAPI(title="AutoU Email Classifier API")

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/classify", response_model=models.AnalysisResponse)
async def classify_email_endpoint(request: models.EmailRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="O texto do email não pode estar vazio.")
    
    try:
        # --- 2. ALTERAÇÃO PRINCIPAL ---
        # Em vez de chamar a função diretamente, usamos o run_in_threadpool
        # para executá-la numa thread separada e usamos 'await' para esperar pelo resultado.
        result = await run_in_threadpool(services.get_gemini_response, request.text)

    except Exception as e:
        # Captura qualquer erro inesperado durante a execução da thread
        print(f"Erro inesperado no endpoint: {e}")
        raise HTTPException(status_code=500, detail="Ocorreu um erro interno no servidor.")

    if result["status"] == "Erro":
        raise HTTPException(status_code=500, detail=result["reason"])

    return result

@app.get("/")
def read_root():
    return {"status": "API online e atualizada!"}