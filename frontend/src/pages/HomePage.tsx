import { useState } from "react";
import type { ChangeEvent } from "react"; // Adicionado ChangeEvent
import { Loader2, MailCheck, MailWarning, FileText } from "lucide-react"; // Adicionado FileText

// Importação dos componentes de UI
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Novo
import { Input } from "@/components/ui/input"; // Novo

// Importamos as duas funções do nosso serviço
import { analyzeEmail, analyzeFile } from "@/services/apiService";
import type { AnalysisResult } from "@/services/apiService";

function HomePage() {
  // --- Estados do Componente ---
  const [inputText, setInputText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Novo estado para o ficheiro
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // --- Lógicas de Chamada da API ---

  // Função para análise de texto (sem alterações)
  const handleAnalyseText = async () => {
    if (!inputText.trim()) {
      setError("Por favor, insira o texto do email para análise.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeEmail(inputText);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Nova função para guardar o ficheiro selecionado
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.type === 'application/pdf') {
        setSelectedFile(file);
        setError(''); // Limpa erros anteriores
      } else {
        setError('Formato de ficheiro inválido. Por favor, selecione .txt ou .pdf');
        setSelectedFile(null);
      }
    }
  };

  // Nova função para análise de ficheiro
  const handleAnalyseFile = async () => {
    if (!selectedFile) {
      setError("Por favor, selecione um ficheiro para análise.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeFile(selectedFile);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
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
            <CardTitle className="text-2xl text-slate-800 dark:text-slate-200">Analisar Email</CardTitle>
            <CardDescription>
              Escolha um método de entrada: colar texto ou enviar um ficheiro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Analisar Texto</TabsTrigger>
                <TabsTrigger value="file">Analisar Ficheiro</TabsTrigger>
              </TabsList>
              
              {/* Aba para Análise de Texto */}
              <TabsContent value="text" className="mt-4">
                <div className="grid w-full gap-4">
                  <Textarea
                    placeholder="Cole o conteúdo do email aqui..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={10}
                    disabled={isLoading}
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                  <Button onClick={handleAnalyseText} disabled={isLoading} size="lg">
                    {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analisando Texto...</> : "Analisar Texto"}
                  </Button>
                </div>
              </TabsContent>

              {/* Aba para Análise de Ficheiro */}
              <TabsContent value="file" className="mt-4">
                <div className="grid w-full gap-4">
                  <Input id="file" type="file" onChange={handleFileChange} accept=".txt,.pdf" disabled={isLoading} />
                  {selectedFile && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Ficheiro selecionado: <span className="font-medium ml-1">{selectedFile.name}</span>
                    </div>
                  )}
                  <Button onClick={handleAnalyseFile} disabled={isLoading || !selectedFile} size="lg">
                    {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analisando Ficheiro...</> : "Analisar Ficheiro"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ... (O resto do código para exibir Erros e Resultados permanece o mesmo) ... */}
        {error && <Alert variant="destructive" className="animate-fade-in"><AlertTitle>Ocorreu um Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        {result && <Card className="w-full shadow-lg animate-fade-in border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"><CardHeader><CardTitle className="text-2xl text-slate-800 dark:text-slate-200">Resultado da Análise</CardTitle></CardHeader><CardContent className="space-y-6"><div><h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">Status</h3><span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-lg ${result.status==='Aprovado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{result.status==='Aprovado' ? <MailCheck className="mr-2 h-5 w-5" /> : <MailWarning className="mr-2 h-5 w-5" />}{result.status}</span></div><div><h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">Justificativa da IA</h3><p className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-4 rounded-md whitespace-pre-wrap border border-slate-200 dark:border-slate-700">{result.reason}</p></div>{result.status==='Reprovado' && (<div><h3 className="font-semibold text-lg text-warning-600 dark:text-warning-400 mb-2">Sugestão de Melhoria</h3><p className="text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md whitespace-pre-wrap border border-amber-200 dark:border-amber-900">{result.improvement_suggestion}</p></div>)}</CardContent></Card>}

      </div>
    </div>
  );
}

export default HomePage;