// Importações do React e dos ícones
import { useState } from "react";
import { Loader2, MailCheck, MailWarning } from "lucide-react";

// Importação dos componentes de UI do shadcn/ui
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- Importa a função e o tipo do nosso serviço ---
// Agora não importa se o serviço está a simular ou a fazer uma chamada real,
// o componente funciona da mesma maneira.
import { analyzeEmail } from "@/services/apiService";
import type { AnalysisResult } from "@/services/apiService";


function HomePage() {
  // --- Estados do Componente ---
  const [inputText, setInputText] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // --- Lógica de Chamada da API ---
  const handleAnalyseClick = async () => {
    setIsLoading(true);
    setError("");
    setResult(null);

    if (!inputText.trim()) {
      setError("Por favor, insira o texto do email para análise.");
      setIsLoading(false);
      return;
    }

    try {
      // Chama a função do nosso serviço.
      // Neste momento, ela está a usar la lógica simulada.
      const data = await analyzeEmail(inputText);
      setResult(data);

    } catch (err: any) {
      // Apanha o erro (seja ele real ou simulado) e exibe-o.
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Renderização do Componente ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl space-y-8">
        
        <header className="text-center">
          <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-400">
            AutoU Email Classifier
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Otimize seu fluxo de trabalho com o poder da Inteligência Artificial.
          </p>
        </header>

        <Card className="w-full shadow-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800 dark:text-slate-200">Analisar Novo Email</CardTitle>
            <CardDescription>
              Cole o conteúdo do email abaixo e clique em analisar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-4">
              <Textarea
                placeholder="Ex: 'Olá, gostaria de saber o status do meu pedido 12345...'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                disabled={isLoading}
                className="bg-slate-50 dark:bg-slate-800 focus:ring-primary-500"
              />
              <Button onClick={handleAnalyseClick} disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  "Analisar Email"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
            <Alert variant="destructive" className="animate-fade-in">
                <AlertTitle>Ocorreu um Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
          <Card className="w-full shadow-lg animate-fade-in border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 dark:text-slate-200">Resultado da Análise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">Categoria</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-lg
                  ${result.category === 'Produtivo' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`
                }>
                  {result.category === 'Produtivo' 
                    ? <MailCheck className="mr-2 h-5 w-5" /> 
                    : <MailWarning className="mr-2 h-5 w-5" />
                  }
                  {result.category}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">Resposta Sugerida</h3>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-4 rounded-md whitespace-pre-wrap border border-slate-200 dark:border-slate-700">
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