import os
import json
from dotenv import load_dotenv
import io # Necessário para ler os bytes do ficheiro
from PyPDF2 import PdfReader # A nova biblioteca para ler PDFs

from google import genai
from google.genai import types

load_dotenv()

if not os.getenv('GEMINI_API_KEY'):
    raise ValueError("Variável de ambiente GEMINI_API_KEY não encontrada. Verifique o seu ficheiro .env")

client = genai.Client()

def get_gemini_response(email_text: str) -> dict:
    # ... (esta função permanece exatamente a mesma)
    prompt = f"""
    Analise o email abaixo com o objetivo de classificá-lo para uma equipe financeira.
    Retorne um objeto JSON com três chaves: "status", "reason", e "improvement_suggestion".

    A chave "status" deve ser "Aprovado" se o email for claro e exigir uma ação, ou "Reprovado" se for improdutivo, vago ou não relacionado ao trabalho.
    A chave "reason" deve ser uma frase curta explicando o porquê do status.
    A chave "improvement_suggestion":
    - Se o status for "Reprovado", forneça uma frase curta e construtiva sobre como o email poderia ser melhorado.
    - Se o status for "Aprovado", o valor deve ser "Nenhuma sugestão necessária, o email está claro.".

    O JSON deve ser a única coisa na resposta.

    Email para Análise: --- {email_text} ---

    JSON Response:
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt],
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            )
        )
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_response)
        
        if "status" not in result or "reason" not in result or "improvement_suggestion" not in result:
            raise ValueError("A resposta da IA está incompleta.")
            
        return result
    except Exception as e:
        print(f"Erro na API Gemini: {e}")
        return {
            "status": "Erro",
            "reason": "Falha ao analisar o email com a IA.",
            "improvement_suggestion": "Não foi possível gerar uma sugestão."
        }

# --- NOVA FUNÇÃO ADICIONADA ---
def extract_text_from_file(file_contents: bytes, content_type: str) -> str:
    """
    Extrai o texto de um ficheiro (bytes), suportando .txt e .pdf.
    Esta é uma função síncrona (bloqueante) e deve ser executada num threadpool.
    """
    if content_type == "text/plain":
        return file_contents.decode("utf-8")
    
    elif content_type == "application/pdf":
        try:
            pdf_stream = io.BytesIO(file_contents)
            reader = PdfReader(pdf_stream)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
        except Exception as e:
            print(f"Erro ao ler o ficheiro PDF: {e}")
            # Lançamos uma exceção que o endpoint irá capturar
            raise ValueError("Não foi possível ler o conteúdo do ficheiro PDF.")
    else:
        # Lançamos uma exceção que o endpoint irá capturar
        raise ValueError("Formato de ficheiro inválido. Apenas .txt e .pdf são suportados.")

