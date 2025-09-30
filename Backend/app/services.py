import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Carrega as variáveis de ambiente (como a GOOGLE_API_KEY) do arquivo .env
load_dotenv()

# Configura a API do Gemini
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

def get_gemini_response(email_text: str) -> dict:
    """Função que interage com a API Gemini e retorna um dicionário estruturado."""
    
    prompt = f"""
    Analise o email abaixo e retorne um objeto JSON com duas chaves: "category" e "suggested_response".
    A "category" deve ser "Produtivo" para emails que requerem ação, ou "Improdutivo" para os demais.
    A "suggested_response" deve ser uma resposta curta e adequada à categoria.
    O JSON deve ser a única coisa na resposta.

    Email: "{email_text}"

    JSON Response:
    """

    try:
        response = model.generate_content(prompt)
        # Limpa a resposta para garantir que seja um JSON válido
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_response)
        return result
    except Exception as e:
        print(f"Erro na API Gemini: {e}")
        return {
            "category": "Erro",
            "suggested_response": "Falha ao analisar o email com a IA."
        }