/**
 * Define a "forma" (type) do objeto de resultado que esperamos da API,
 * correspondendo ao modelo AnalysisResponse do backend.
 */
export type AnalysisResult = {
  status: string;
  reason: string;
  improvement_suggestion: string;
};

// A URL do nosso endpoint no backend FastAPI.
const API_URL = 'http://127.0.0.1:8000/classify';

/**
 * Função assíncrona para analisar o texto de um email fazendo uma chamada real ao backend.
 *
 * @param emailText - O texto do email a ser analisado.
 * @returns Uma Promise que resolve com o objeto AnalysisResult vindo da API.
 * @throws Lança um erro se a chamada à API falhar.
 */
export const analyzeEmail = async (emailText: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: emailText }),
    });

    // Se a resposta do servidor não for bem-sucedida (ex: erro 400, 500),
    // lemos a mensagem de erro detalhada do FastAPI e lançamos um erro.
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ocorreu um erro no servidor.');
    }

    // Se a resposta for bem-sucedida, retornamos os dados em formato JSON.
    const data: AnalysisResult = await response.json();
    return data;

  } catch (error) {
    // Captura erros de rede (ex: o servidor está offline) ou os erros que lançámos acima.
    console.error('Falha na comunicação com a API:', error);
    // Lança um erro claro para a interface do utilizador.
    throw new Error('Não foi possível conectar à API. Verifique se o backend está a correto e tente novamente.');
  }
};

// --- NOVA FUNÇÃO PARA ANALISAR FICHEIROS ---
const API_URL_FILE = 'http://127.0.0.1:8000/classify-file';

/**
 * Envia um ficheiro para o backend para análise.
 * @param file - O ficheiro (txt ou pdf) a ser analisado.
 * @returns Uma Promise que resolve com o objeto AnalysisResult.
 */
export const analyzeFile = async (file: File): Promise<AnalysisResult> => {
  // Para enviar ficheiros, usamos FormData em vez de JSON.
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(API_URL_FILE, {
      method: 'POST',
      body: formData, // Não definimos o 'Content-Type', o navegador fá-lo-á por nós.
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ocorreu um erro no servidor ao processar o ficheiro.');
    }
    return await response.json();
  } catch (error) {
    console.error('Falha no upload do ficheiro:', error);
    throw new Error('Não foi possível enviar o ficheiro. Verifique o backend e o tamanho do ficheiro.');
  }
};