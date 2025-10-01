import os
import json
from dotenv import load_dotenv

# --- ATUALIZAÇÃO 1: Importações alinhadas com a nova documentação ---
from google import genai
from google.genai import types

# Carrega as variáveis de ambiente do ficheiro .env
load_dotenv()

# Verifica se a chave da API foi carregada corretamente
if not os.getenv('GEMINI_API_KEY'):
    raise ValueError("Variável de ambiente GEMINI_API_KEY não encontrada. Verifique o seu ficheiro .env")

# --- ATUALIZAÇÃO 2: Inicializa o cliente, que usará a variável de ambiente automaticamente ---
client = genai.Client()

def get_gemini_response(email_text: str) -> dict:
    """Função que interage com a API Gemini para uma análise completa."""

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
        # --- ATUALIZAÇÃO 4: Chamada à API usando o novo padrão client.models.generate_content ---
        response = client.models.generate_content(
            model="gemini-2.5-flash", # Usando o modelo que sabemos que funciona para evitar o erro 404
            contents=[prompt],
            config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
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