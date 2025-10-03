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
    """Função que interage com a API Gemini para uma análise detalhada e reescrita."""

    # --- PROMPT MELHORADO com um exemplo (Few-Shot Prompting) ---
    prompt = f"""
    Você é um assistente de comunicação profissional. Sua tarefa é analisar o email fornecido e retornar um objeto JSON com quatro chaves: "department", "status", "reason", e "rewritten_email".

    1.  **"department"**: Identifique o departamento alvo. Opções: [Comercial, Financeiro, Recursos Humanos, Suporte Técnico, Marketing, Direção, Consulta Geral, Pessoal].
    2.  **"status"**: "Aprovado" se o email for claro e acionável. "Reprovado" se for vago, informal ou confuso.
    3.  **"reason"**: Explique detalhadamente o porquê do status.
    4.  **"rewritten_email"**: Se "Reprovado", reescreva o email de forma profissional. Se "Aprovado", retorne "O email original já está bem escrito e não necessita de alterações.".

    O JSON deve ser a única coisa na sua resposta. Siga o formato do exemplo abaixo.

    Exemplo de Saída:
    {{
      "department": "Comercial",
      "status": "Reprovado",
      "reason": "O email é muito vago e não especifica qual produto ou serviço o cliente tem interesse, dificultando a ação da equipe.",
      "rewritten_email": "Olá equipe comercial,\\n\\nGostaria de obter mais informações sobre os vossos serviços de consultoria em cloud. Poderiam, por favor, agendar uma breve chamada para me apresentarem as vossas soluções?\\n\\nObrigado,\\n[Nome do Remetente]"
    }}

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

        # --- LINHAS DE DEBUG ADICIONADAS ---
        # Vamos imprimir a resposta bruta que recebemos do Gemini no terminal
        print("--- RESPOSTA BRUTA DA API GEMINI ---")
        print(response.text)
        print("------------------------------------")
        
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_response)
        
        if not all(key in result for key in ["department", "status", "reason", "rewritten_email"]):
            raise ValueError("A resposta da IA está incompleta. Faltam chaves essenciais.")
            
        return result
    except Exception as e:
        # Este erro continuará a aparecer se a resposta bruta acima não for um JSON válido
        print(f"Erro na API Gemini ou no processamento da resposta: {e}")
        return {
            "department": "Erro",
            "status": "Erro",
            "reason": "Falha ao analisar o email com a IA.",
            "rewritten_email": "Não foi possível gerar uma sugestão de reescrita."
        }

def extract_text_from_file(file_contents: bytes, content_type: str) -> str:
    # ... (esta função permanece a mesma)
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