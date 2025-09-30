from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Olá, Mundo! Minha API FastAPI está funcionando!"}