<div align="center">
  <h1>🤖 AutoU: Classificador Inteligente de Emails</h1>
  <p>
    Uma aplicação full-stack que utiliza IA para analisar, classificar e otimizar a gestão de emails, desenvolvida para o Case Prático da AutoU.
  </p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/status-concluído-green?style=for-the-badge" alt="Status do Projeto: Concluído"/>
  <img src="https://img.shields.io/badge/licen%C3%A7a-MIT-blue?style=for-the-badge" alt="Licença MIT"/>
</div>

<br>

## 📍 Tabela de Conteúdos
1. [**Sobre o Projeto**](#-sobre-o-projeto)
2. [**Demonstração Rápida**](#-demonstração-rápida)
3. [**✨ Funcionalidades Principais**](#-funcionalidades-principais)
4. [**🚀 Stack de Tecnologias**](#-stack-de-tecnologias)
5. [**🏁 Começando (Execução Local)**](#-começando-execução-local)
6. [**🧠 Decisões Técnicas e Desafios**](#-decisões-técnicas-e-desafios)
7. [**👨‍💻 Autor**](#-autor)

<br>

## 📖 Sobre o Projeto

Num ambiente corporativo de alto volume, a triagem manual de emails é um grande consumidor de tempo e produtividade. O **Classificador Inteligente de Emails** foi concebido para resolver este problema, automatizando a análise e classificação de comunicações.

Utilizando o poder do Google Gemini, a aplicação não só categoriza emails como "Aprovados" (acionáveis) ou "Reprovados" (não acionáveis), mas também fornece um feedback valioso, incluindo a justificativa para a classificação e sugestões de melhoria para emails reprovados. Isto transforma a ferramenta num assistente proativo que melhora a qualidade da comunicação da equipa.

---

## 🎬 Demonstração Rápida

*Insira aqui um GIF da sua aplicação em funcionamento. Grave a tela usando uma ferramenta como o [LiceCAP](https://www.cockos.com/licecap/) ou [ScreenToGif](https://www.screentogif.com/) e arraste o ficheiro para esta secção.*

![Demo do Projeto](URL_PARA_SEU_GIF_AQUI)

> **[➡️ Clique aqui para aceder à aplicação online](URL_DA_SUA_APLICAÇÃO_DEPLOYADA_AQUI)**

---

## ✨ Funcionalidades Principais

* **Análise Multimodal:** Processa emails inseridos diretamente como texto ou através do upload de ficheiros (`.txt`, `.pdf`).
* **Classificação Inteligente com IA:** Atribui um status de **"Aprovado"** ou **"Reprovado"** com base na clareza e acionabilidade do conteúdo.
* **Feedback Construtivo:** A IA vai além da classificação, fornecendo:
    * Uma **justificativa** clara para cada decisão.
    * Uma **sugestão de melhoria** para emails "Reprovados", ajudando a educar os utilizadores.
* **Interface Moderna e Reativa:** Construída com React e `shadcn/ui`, a UI é limpa, intuitiva e suporta *dark mode* para uma melhor experiência visual.
* **Processamento Assíncrono:** O backend é construído com FastAPI, garantindo que as chamadas à IA não bloqueiam o servidor e que a aplicação permanece responsiva.

---

## 🚀 Stack de Tecnologias

A aplicação segue uma arquitetura de monorepo, com uma clara separação entre o frontend e o backend.

| Frontend | Backend | IA & DevOps |
| :--- | :--- | :--- |
| React | Python 3.10+ | Google Gemini API |
| TypeScript | FastAPI | Git & GitHub |
| Vite | Uvicorn | Docker |
| Tailwind CSS | Pydantic | |
| `shadcn/ui` | PyPDF2 | |

---

## 🏁 Começando (Execução Local)

Siga os passos abaixo para configurar e executar o projeto na sua máquina.

### **Pré-requisitos**
* **Node.js** (v18.x ou superior)
* **Python** (v3.9 ou superior)
* Uma chave de API do **Google Gemini** (disponível gratuitamente no [Google AI Studio](https://aistudio.google.com/)).

### **1. Clone o Repositório**
```bash
git clone [https://github.com/gustavobione/Desafio-AutoU---Email-Classifier.git](https://github.com/gustavobione/Desafio-AutoU---Email-Classifier.git)
cd SEU_REPOSITORIO
````

### **2. Configuração do Backend**

a. Navegue para a pasta do backend:

```bash
cd Backend
```

b. Crie e ative um ambiente virtual:

```bash
# Criar
python -m venv venv

# Ativar (Windows - Git Bash)
source venv/Scripts/activate

# Ativar (macOS/Linux)
source venv/bin/activate
```

c. Instale as dependências:

```bash
pip install -r requirements.txt
```

d. Configure as variáveis de ambiente:

  * Crie um ficheiro `.env` na pasta `Backend`.
  * Adicione a sua chave de API: `GEMINI_API_KEY="SUA_CHAVE_SECRETA_AQUI"`

e. Inicie o servidor do backend:

```bash
uvicorn app.main:app --reload
```

> O backend estará disponível em `http://127.0.0.1:8000`.

### **3. Configuração do Frontend**

a. Abra um **novo terminal** e navegue para a pasta do frontend:

```bash
cd Frontend
```

b. Instale as dependências:

```bash
npm install
```

c. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

> A aplicação estará acessível no seu navegador em `http://localhost:5173`.

-----

## 🧠 Decisões Técnicas e Desafios

Durante o desenvolvimento, algumas decisões e desafios foram cruciais para o sucesso do projeto:

1.  **Desafio: `async` vs. Síncrono no Backend**

      * **Problema:** A aplicação ficava em "loop infinito" (timeout) ao fazer a requisição. A causa era uma chamada de rede síncrona (para a API do Gemini) dentro de um endpoint `async` do FastAPI, o que bloqueava o event loop do servidor.
      * **Solução:** Implementei o `run_in_threadpool` do FastAPI. Esta solução executa a chamada bloqueante numa thread separada, libertando o event loop principal e garantindo que a aplicação permaneça responsiva e escalável.

2.  **Decisão: Evolução da IA com Engenharia de Prompt**

      * Para ir além do requisito básico, decidi refinar o `prompt` enviado ao Gemini. Em vez de pedir uma simples categoria, instruí a IA a retornar um objeto JSON estruturado com `status`, `reason` e `improvement_suggestion`.
      * **Impacto:** Esta decisão transformou a ferramenta de um simples classificador para um assistente inteligente que fornece feedback construtivo, agregando muito mais valor ao utilizador final.

3.  **Arquitetura: Separação de Responsabilidades**

      * Optei por uma arquitetura desacoplada com um frontend em React e um backend em FastAPI. No frontend, a lógica de chamada à API foi isolada num ficheiro de serviço (`apiService.ts`), separando a gestão da interface da comunicação de rede e facilitando a manutenção e os testes.

-----

## 👨‍💻 Autor

Feito com ❤️ por **Gustavo Bione**

  * [LinkedIn](https://www.google.com/search?q=URL_DO_SEU_LINKEDIN_AQUI)
  * [GitHub](https://www.google.com/search?q=URL_DO_SEU_GITHUB_AQUI)

<!-- end list -->

```
```