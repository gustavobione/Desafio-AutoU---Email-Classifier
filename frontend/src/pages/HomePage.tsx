import { useState } from "react";
import type { ChangeEvent } from "react";
import { Loader2, MailCheck, MailWarning, FileText, Copy, Check } from "lucide-react"; // Adicionados Copy e Check

// Importação dos componentes de UI
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Importamos as funções e o tipo final do nosso serviço
import { analyzeEmail, analyzeFile } from "@/services/apiService";
import type { AnalysisResult } from "@/services/apiService";

function HomePage() {
  // --- Estados do Componente ---
  const [inputText, setInputText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [copyButtonText, setCopyButtonText] = useState<string>("Copiar"); // Novo estado para o botão de cópia

  // --- Lógicas de Chamada da API ---
  const performAnalysis = async (analysisFn: () => Promise<AnalysisResult>) => {
    setIsLoading(true);
    setError("");
    setResult(null);
    setCopyButtonText("Copiar"); // Reseta o texto do botão de cópia

    try {
      const data = await analysisFn();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyseText = () => {
    if (!inputText.trim()) {
      setError("Por favor, insira o texto do email para análise.");
      return;
    }
    performAnalysis(() => analyzeEmail(inputText));
  };

  const handleAnalyseFile = () => {
    if (!selectedFile) {
      setError("Por favor, selecione um ficheiro para análise.");
      return;
    }
    performAnalysis(() => analyzeFile(selectedFile));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.type === 'application/pdf') {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Formato de ficheiro inválido. Por favor, selecione .txt ou .pdf');
        setSelectedFile(null);
      }
    }
  };
  
  // Nova função para o botão de cópia
  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopyButtonText("Copiado!");
    setTimeout(() => {
      setCopyButtonText("Copiar");
    }, 2000); // Volta a "Copiar" após 2 segundos
  };

  // --- Renderização do Componente ---
  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Assistente de Email IA
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
            Otimize sua comunicação. Analise e refine seus emails com o poder do Gemini.
          </p>
        </header>

        <Card className="w-full shadow-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Analisar Texto</TabsTrigger>
                <TabsTrigger value="file">Analisar Ficheiro</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-6">
                <div className="grid w-full gap-4">
                  <Textarea placeholder="Cole o conteúdo do email aqui..." value={inputText} onChange={(e) => setInputText(e.target.value)} rows={10} disabled={isLoading} className="bg-slate-50 dark:bg-slate-800"/>
                  <Button onClick={handleAnalyseText} disabled={isLoading || !inputText} size="lg">
                    {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analisando...</> : "Analisar Texto"}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="file" className="mt-6">
                <div className="grid w-full gap-4">
                  <Input id="file" type="file" onChange={handleFileChange} accept=".txt,.pdf" disabled={isLoading} />
                  {selectedFile && <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center"><FileText className="h-4 w-4 mr-2" />Ficheiro selecionado: <span className="font-medium ml-1">{selectedFile.name}</span></div>}
                  <Button onClick={handleAnalyseFile} disabled={isLoading || !selectedFile} size="lg">
                    {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analisando...</> : "Analisar Ficheiro"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {error && <Alert variant="destructive" className="animate-fade-in"><AlertTitle>Ocorreu um Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {result && (
          <Card className="w-full shadow-lg animate-fade-in border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 dark:text-slate-200">Resultado da Análise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Diagnóstico Rápido (Status e Departamento lado a lado) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-base ${result.status === 'Aprovado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                    {result.status === 'Aprovado' ? <MailCheck className="mr-2 h-5 w-5" /> : <MailWarning className="mr-2 h-5 w-5" />}
                    {result.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Departamento Sugerido</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full font-bold text-base bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                    {result.department}
                  </span>
                </div>
              </div>

              {/* Justificativa da IA */}
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Justificativa da IA</h3>
                <p className="text-slate-700 dark:text-slate-300">{result.reason}</p>
              </div>
              
              {/* Email Reescrito (Apenas para 'Reprovado') */}
              {result.status === 'Reprovado' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg text-primary-700 dark:text-primary-400">Email Reescrito (Versão Melhorada)</h3>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(result.rewritten_email)}>
                      {copyButtonText === 'Copiar' ? 
                        <Copy className="mr-2 h-4 w-4" /> : 
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                      }
                      {copyButtonText}
                    </Button>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-4 rounded-md whitespace-pre-wrap border border-slate-200 dark:border-slate-700">
                    {result.rewritten_email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default HomePage;