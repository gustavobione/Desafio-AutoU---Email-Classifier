/**
 * Define a "forma" (type) do objeto de resultado que esperamos da API.
 * Isto ajuda o TypeScript a garantir que estamos a usar os dados corretamente.
 */
export type AnalysisResult = {
  category: string;
  suggested_response: string;
};

/**
 * Função assíncrona para analisar o texto de um email.
 *
 * !!! IMPORTANTE: Esta é uma versão SIMULADA (mock) da chamada à API. !!!
 * Ela espera 2 segundos e retorna dados falsos para que você possa
 * desenvolver o frontend sem precisar que o backend esteja a correr.
 *
 * Quando o seu backend FastAPI estiver pronto, você poderá substituir o conteúdo
 * desta função pela versão real com o `fetch`.
 *
 * @param emailText - O texto do email a ser analisado.
 * @returns Uma Promise que resolve com o objeto AnalysisResult.
 */
export const analyzeEmail = async (emailText: string): Promise<AnalysisResult> => {
  console.log("Simulando chamada à API com o texto:", emailText);

  // Simula o tempo de espera de uma chamada de rede (2 segundos)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simula uma resposta de sucesso
  // Altere 'Produtivo' para 'Improdutivo' para testar os diferentes visuais
  if (emailText) { // Simula sucesso se houver texto
    return {
      category: 'Produtivo',
      suggested_response: 'Esta é uma resposta de teste simulada para um email produtivo. \nObrigado pelo seu contacto. Recebemos o seu pedido e a nossa equipa já está a trabalhar nele. Retornaremos em breve.',
    };
  }

  // Simula uma resposta de erro (pode descomentar para testar o erro)
  // throw new Error('Esta é uma mensagem de erro simulada da API.');

  // Por defeito, retorna um resultado caso algo corra mal na simulação
  return {
    category: 'Improdutivo',
    suggested_response: 'Resposta de teste para o caso de o texto estar vazio.',
  }
};

// --- CÓDIGO REAL PARA USAR NO FUTURO ---
/*
  Quando o seu backend estiver pronto, apague o código acima e descomente este abaixo.

  const API_URL = 'http://127.0.0.1:8000/classify';

  export const analyzeEmail = async (emailText: string): Promise<AnalysisResult> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: emailText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocorreu um erro no servidor.');
      }

      const data: AnalysisResult = await response.json();
      return data;

    } catch (error) {
      console.error('Falha na comunicação com a API:', error);
      throw new Error('Não foi possível conectar à API. Verifique se o backend está a correr e tente novamente.');
    }
  };
*/