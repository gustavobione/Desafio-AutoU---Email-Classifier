from fastapi import FastAPI, HTTPException, UploadFile, File # --- 1. IMPORTAÇÕES ADICIONADAS ---
from fastapi.middleware.cors import CORSMiddleware
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
        result = await run_in_threadpool(services.get_gemini_response, request.text)

    except Exception as e:
        print(f"Erro inesperado no endpoint: {e}")
        raise HTTPException(status_code=500, detail="Ocorreu um erro interno no servidor.")

    if result["status"] == "Erro":
        raise HTTPException(status_code=500, detail=result["reason"])

    return result


# --- 2. NOVO ENDPOINT ADICIONADO AQUI ---
@app.post("/classify-file", response_model=models.AnalysisResponse)
async def classify_file_endpoint(file: UploadFile = File(...)):
    """
    Recebe um ficheiro (.txt ou .pdf), extrai o seu texto e o classifica.
    """
    # Lê os bytes do ficheiro de forma assíncrona
    file_contents = await file.read()

    try:
        # Executa a extração de texto (que pode ser lenta) num threadpool
        extracted_text = await run_in_threadpool(
            services.extract_text_from_file, 
            file_contents=file_contents, 
            content_type=file.content_type
        )
    except ValueError as e:
        # Captura os erros de formato inválido ou falha de leitura do PDF do nosso service
        raise HTTPException(status_code=400, detail=str(e))
    
    if not extracted_text or not extracted_text.strip():
        raise HTTPException(status_code=400, detail="O ficheiro está vazio ou não contém texto extraível.")
    
    # Reutiliza a mesma lógica do endpoint de texto para chamar o Gemini
    try:
        result = await run_in_threadpool(services.get_gemini_response, extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Ocorreu um erro interno no servidor ao contactar a IA.")

    if result["status"] == "Erro":
        raise HTTPException(status_code=500, detail=result["reason"])

    return result


@app.get("/")
def read_root():
    return {"status": "API online e atualizada com upload de ficheiros!"}

