/**
 * Define a "forma" (type) do objeto de resultado que esperamos da API,
 * correspondendo ao modelo AnalysisResponse final do backend.
 */
export type AnalysisResult = {
  main_category: string;
  department: string;
  status: string;
  reason: string;
  rewritten_email: string;
};

// --- FUNÇÃO PARA ANALISAR TEXTO ---
const API_URL_TEXT = 'http://127.0.0.1:8000/classify';

export const analyzeEmail = async (emailText: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(API_URL_TEXT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: emailText }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ocorreu um erro no servidor.');
    }
    return await response.json();
  } catch (error) {
    console.error('Falha na comunicação com a API:', error);
    throw new Error('Não foi possível conectar à API. Verifique se o backend está a correr.');
  }
};


// --- FUNÇÃO PARA ANALISAR FICHEIROS ---
const API_URL_FILE = 'http://127.0.0.1:8000/classify-file';

export const analyzeFile = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(API_URL_FILE, {
      method: 'POST',
      body: formData,
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