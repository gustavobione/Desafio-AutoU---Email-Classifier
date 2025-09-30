// Importações necessárias do React e da biblioteca de ícones
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Ícone de spinner para o estado de carregamento

// Importação dos componentes de UI que você instalou do shadcn/ui
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define a "forma" (type) do objeto de resultado para o TypeScript
// Isso ajuda a evitar erros e melhora o autocompletar do editor.
type AnalysisResult = {
  category: string;
  suggested_response: string;
};

function HomePage() {
  // --- Estados do Componente ---
  // Guarda o texto do email digitado pelo usuário
  const [inputText, setInputText] = useState<string>("");
  // Guarda o resultado da análise vindo da API
  const [result, setResult] = useState<AnalysisResult | null>(null);
  // Controla se a aplicação está esperando uma resposta da API
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Guarda qualquer mensagem de erro que possa ocorrer
  const [error, setError] = useState<string>("");

  // --- Lógica de Chamada da API ---
  const handleAnalyseClick = async () => {
    // 1. Reseta os estados antes de uma nova chamada
    setIsLoading(true);
    setError("");
    setResult(null);

    // Validação para garantir que o texto não está vazio
    if (!inputText.trim()) {
      setError("Por favor, insira o texto do email para análise.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Faz a requisição POST para o seu backend FastAPI
      const response = await fetch('http://127.0.0.1:8000/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia o texto dentro de um objeto JSON, como definido no models.py
        body: JSON.stringify({ text: inputText }),
      });

      // 3. Trata respostas de erro do servidor (ex: 400, 500)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ocorreu um erro no servidor.");
      }

      // 4. Se a resposta for bem-sucedida, atualiza o estado com os dados
      const data: AnalysisResult = await response.json();
      setResult(data);

    } catch (err: any) {
      // 5. Captura erros de rede ou da lógica acima e atualiza o estado de erro
      setError(err.message || "Falha ao conectar com a API. Verifique se o backend está rodando.");
      console.error(err);
    } finally {
      // 6. Garante que o estado de 'loading' seja desativado ao final,
      //    não importa se a requisição deu certo ou errado.
      setIsLoading(false);
    }
  };

  // --- Renderização do Componente (O que aparece na tela) ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">AutoU Email Classifier</h1>
          <p className="text-lg text-gray-600 mt-2">
            Cole um email abaixo para classificá-lo e receber uma sugestão de resposta usando IA.
          </p>
        </header>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Analisar Novo Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-4">
              <Textarea
                placeholder="Digite ou cole o conteúdo do email aqui..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                disabled={isLoading}
              />
              <Button onClick={handleAnalyseClick} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  "Analisar Email"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Erro (só aparece se houver um erro) */}
        {error && (
            <Alert variant="destructive" className="mt-6">
                <AlertTitle>Erro na Análise</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {/* Seção de Resultado (só aparece se houver um resultado) */}
        {result && (
          <Card className="mt-6 w-full shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle>Resultado da Análise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Categoria</h3>
                <p className={`font-bold text-xl ${result.category === 'Produtivo' ? 'text-blue-600' : 'text-green-600'}`}>
                  {result.category}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Resposta Sugerida</h3>
                <p className="text-gray-700 bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
                  {result.suggested_response}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default HomePage;
