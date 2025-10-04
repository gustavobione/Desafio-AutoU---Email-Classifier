import os
import json
from dotenv import load_dotenv
import io
from PyPDF2 import PdfReader

from google import genai
from google.genai import types

load_dotenv()

if not os.getenv('GEMINI_API_KEY'):
    raise ValueError("Variável de ambiente GEMINI_API_KEY não encontrada. Verifique o seu ficheiro .env")

client = genai.Client()

def get_gemini_response(email_text: str) -> dict:

    prompt = f"""
    Você é um assistente de comunicação profissional. Sua tarefa é analisar o email fornecido e retornar um objeto JSON com cinco chaves: "main_category", "department", "status", "reason", e "rewritten_email".

    1.  **"main_category"**: Esta é a classificação mais importante.
        -   Atribua "Produtivo" se o email requer uma ação ou resposta específica (ex: solicitação, dúvida, envio de documento).
        -   Atribua "Improdutivo" se o email não necessita de uma ação imediata (ex: felicitações, agradecimentos, spam).

    2.  **"department"**: Identifique o departamento corporativo alvo. Opções: [Comercial, Financeiro, Recursos Humanos, Suporte Técnico, Marketing, Direção, Consulta Geral, Pessoal].

    3.  **"status"**: Avalie a qualidade da escrita.
        -   "Aprovado" se o email for claro e profissional.
        -   "Reprovado" se for vago, confuso ou informal demais.

    4.  **"reason"**: Explique em uma frase o porquê do status "Aprovado" ou "Reprovado".

    5.  **"rewritten_email"**: Se "Reprovado", reescreva o email de forma profissional. Se "Aprovado", retorne "O email original já está bem escrito.".

    O JSON deve ser a única coisa na sua resposta.

    Email para Análise:
    ---
    {email_text}
    ---

    JSON Response:
    """

    config = types.GenerateContentConfig(temperature=0.4)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt],
            config=config
        )

        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_response)
        
        if not all(key in result for key in ["main_category", "department", "status", "reason", "rewritten_email"]):
            raise ValueError("A resposta da IA está incompleta. Faltam chaves essenciais.")
            
        return result
    except Exception as e:
        print(f"Erro na API Gemini: {e}")
        return {
            "main_category": "Erro",
            "department": "Erro",
            "status": "Erro",
            "reason": "Falha ao analisar o email com a IA.",
            "rewritten_email": "Não foi possível gerar uma sugestão de reescrita."
        }


def extract_text_from_file(file_contents: bytes, content_type: str) -> str:
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
            raise ValueError("Não foi possível ler o conteúdo do ficheiro PDF.")
    else:
        raise ValueError("Formato de ficheiro inválido. Apenas .txt e .pdf são suportados.")