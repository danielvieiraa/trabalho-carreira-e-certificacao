# Simulador de Certificações com IA

Aplicação web para simulação de questões de certificações de TI geradas por Inteligência Artificial. O projeto foi desenvolvido como trabalho acadêmico da disciplina de desenvolvimento de software, com foco em carreira profissional e preparação para certificações.

## Visão Geral

A aplicação permite que o usuário escolha uma certificação, defina a dificuldade e a quantidade de questões, e então realiza um simulado com questões geradas em tempo real pela IA do Google Gemini. Ao final, é exibido um relatório com o desempenho e a revisão detalhada de cada questão com explicações.

---

## Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| React | 19 | Framework de interface |
| TypeScript | 6 | Tipagem estática |
| Vite | 8 | Build e servidor de desenvolvimento |
| Tailwind CSS | 3 | Estilização |
| Lucide React | latest | Ícones |

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Node.js | 18+ | Ambiente de execução |
| Express | 5 | Framework HTTP |
| Google Gemini | gemini-2.5-flash | Geração de questões com IA |
| PostgreSQL | - | Persistência do histórico |
| dotenv | - | Variáveis de ambiente |
| cors | - | Comunicação entre front e back |

---

## Estrutura do Projeto

```
TRABALHO-CARREIRA-E-CERTIFICACAO/
├── server.js                  # Servidor Express (backend)
├── package.json               # Dependências do backend
├── .env                       # Variáveis de ambiente (não versionar)
├── .gitignore
└── client/                    # Frontend React
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.tsx
        ├── App.tsx            # Controle de estado global e navegação
        ├── index.css          # Estilos globais e classes Tailwind
        ├── types/
        │   └── index.ts       # Interfaces TypeScript
        ├── data/
        │   └── certificacoes.tsx  # Lista de certificações e constantes
        ├── services/
        │   └── api.ts         # Comunicação com o backend
        └── components/
            ├── TelaSetup.tsx      # Tela de configuração do simulado
            ├── TelaQuiz.tsx       # Tela das questões
            └── TelaResultado.tsx  # Tela de resultado e revisão
```

---

## Certificações Suportadas

| ID | Nome | Descrição |
|---|---|---|
| DPO | DPO / LGPD | Data Protection Officer baseado na LGPD brasileira |
| ITIL4 | ITIL 4 | Gestão de Serviços de TI - ITIL 4 Foundation |
| SCRUM | Scrum | Scrum Master / Product Owner baseado no Scrum Guide |
| AWS-CCP | AWS Cloud | AWS Certified Cloud Practitioner |
| AZURE | Azure AZ-900 | Microsoft Azure Fundamentals |
| COMPTIA | CompTIA Sec+ | Segurança da Informação - CompTIA Security+ |

---

## Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL instalado e rodando
- Chave de API do Google Gemini ([obter aqui](https://aistudio.google.com/))

---

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd TRABALHO-CARREIRA-E-CERTIFICACAO
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
GEMINI_API_KEY=sua_chave_aqui
DB_USER=postgres
DB_HOST=localhost
DB_NAME=nome_do_banco
DB_PASSWORD=sua_senha
DB_PORT=5432
```

### 3. Configure o banco de dados

Execute no PostgreSQL:

```sql
CREATE TABLE historico_simulados (
    id SERIAL PRIMARY KEY,
    conteudo_questao TEXT,
    certificacao VARCHAR(20),
    dificuldade VARCHAR(20),
    data_geracao TIMESTAMP DEFAULT NOW()
);
```

Se a tabela já existia sem as colunas `certificacao` e `dificuldade`, rode:

```sql
ALTER TABLE historico_simulados
    ADD COLUMN IF NOT EXISTS certificacao VARCHAR(20),
    ADD COLUMN IF NOT EXISTS dificuldade  VARCHAR(20);
```

### 4. Instale as dependências do backend

```bash
npm install
```

### 5. Instale as dependências do frontend

```bash
cd client
npm install
```

---

## Como Rodar

Abra dois terminais:

**Terminal 1 — Backend (na raiz do projeto):**
```bash
node --watch server.js
```

**Terminal 2 — Frontend (dentro da pasta client/):**
```bash
cd client
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

> O Vite faz proxy automático de `/api` para `http://localhost:3000`, resolvendo problemas de CORS automaticamente.

---

## Rotas da API

### `POST /api/gerar-questao`

Gera uma questão com IA para a certificação e dificuldade informadas.

**Body:**
```json
{
    "certificacao": "ITIL4",
    "dificuldade": "Intermediário"
}
```

**Resposta:**
```json
{
    "questao": {
        "pergunta": "Qual é o principal propósito do ITIL 4?",
        "alternativas": [
            "A) Fornecer padrões técnicos de infraestrutura.",
            "B) Capacitar organizações a co-criar valor por meio de serviços.",
            "C) Definir metodologia prescritiva para gestão de incidentes.",
            "D) Reduzir custos operacionais de TI ao mínimo possível."
        ],
        "correta": 1,
        "explicacao": "O ITIL 4 tem como propósito central..."
    },
    "id_banco": 42,
    "data_geracao": "2026-06-14T18:43:02.385Z"
}
```

### `GET /api/historico`

Retorna o histórico de questões geradas.

**Query params opcionais:**
```
GET /api/historico?certificacao=ITIL4
```

---

## Fluxo da Aplicação

```
Usuário escolhe certificação + dificuldade + quantidade
            ↓
        App.tsx navega para TelaQuiz
            ↓
    TelaQuiz chama gerarQuestao() em api.ts
            ↓
    api.ts faz POST /api/gerar-questao
            ↓
  server.js monta o prompt e chama o Gemini
            ↓
  Gemini retorna JSON com pergunta e alternativas
            ↓
  server.js salva no banco e retorna ao frontend
            ↓
  TelaQuiz exibe a questão com feedback visual
            ↓
  Ao terminar, App.tsx navega para TelaResultado
            ↓
  TelaResultado exibe pontuação e revisão completa
```

---

## Funcionalidades

- Seleção de certificação com ícones visuais
- Três níveis de dificuldade: Iniciante, Intermediário e Avançado
- Escolha de quantidade de questões: 5, 10 ou 15
- Questões geradas em tempo real pela IA, com variação de tópicos garantida por seed aleatória
- Feedback visual imediato ao responder (verde = correta, vermelho = incorreta)
- Explicação detalhada após cada resposta
- Barra de progresso durante o simulado
- Tela de resultado com percentual de acertos, número de acertos e erros
- Revisão completa de todas as questões com a resposta escolhida, a correta e a explicação
- Persistência do histórico de questões no PostgreSQL

---

## Dependências Principais

### Backend
```bash
npm install express cors dotenv pg @google/generative-ai
```

### Frontend
```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
```

---

## Observações de Desenvolvimento

- O Gemini ocasionalmente retorna o JSON com marcadores de markdown (` ```json `). O backend trata isso extraindo o conteúdo entre o primeiro `{` e o último `}` com `indexOf` e `lastIndexOf` antes de fazer o `JSON.parse`.
- O `vite.config.ts` configura um proxy de `/api` para `localhost:3000`, eliminando a necessidade de configurar CORS manualmente durante o desenvolvimento.
- Arquivos com JSX (como `certificacoes.tsx`) devem ter extensão `.tsx` e não `.ts` para que o TypeScript aceite a sintaxe de componentes React.
