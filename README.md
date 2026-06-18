# Simulador de Certificações com IA

Aplicação web para simulação de questões de certificações de TI geradas por Inteligência Artificial, desenvolvida como trabalho acadêmico com foco em carreira profissional e preparação para certificações.

---

## Descrição do Problema

O mercado de tecnologia exige profissionais cada vez mais qualificados e certificados. No entanto, a preparação para certificações como AWS, ITIL, Scrum, LGPD/DPO e CompTIA Security+ é um processo que demanda tempo, disciplina e acesso a materiais de qualidade. Simulados tradicionais costumam ter bancos de questões fixos e limitados, que o candidato acaba memorizando ao longo do tempo, reduzindo a eficácia do estudo.

Além disso, muitas plataformas de simulado não oferecem explicações detalhadas sobre o motivo de cada resposta estar correta ou incorreta, o que dificulta a compreensão real do conteúdo pelo estudante.

---

## Objetivo da Solução

Desenvolver uma aplicação web que utilize Inteligência Artificial para gerar questões de múltipla escolha de forma dinâmica e irrepetível para diferentes certificações de TI, com os seguintes objetivos:

- Permitir que o usuário escolha a certificação, o nível de dificuldade e a quantidade de questões;
- Gerar questões inéditas a cada simulado, variando tópicos e estilos de pergunta;
- Fornecer feedback imediato após cada resposta, com explicação detalhada gerada pela IA;
- Registrar o histórico de simulados por usuário, permitindo acompanhar a evolução ao longo do tempo;
- Oferecer autenticação de usuários para que cada pessoa tenha seu próprio histórico personalizado.

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
| PostgreSQL | — | Persistência de dados |
| bcryptjs | — | Hash de senhas |
| jsonwebtoken | — | Autenticação via JWT |
| dotenv | — | Variáveis de ambiente |
| cors | — | Comunicação entre front e back |

---

## Funcionamento da IA

A aplicação utiliza o modelo **Google Gemini 2.5 Flash** para geração de questões em tempo real. O fluxo funciona da seguinte forma:

### 1. Construção do Prompt

A cada requisição, o backend monta um prompt dinâmico com a certificação escolhida, o nível de dificuldade e uma seed aleatória (`Math.random()`). A seed é fundamental para garantir variação entre as questões, evitando que o modelo gere sempre as perguntas mais óbvias do tema.

```
Você é um gerador de questões para certificações de TI.
Gere UMA questão de múltipla escolha de nível {dificuldade} para a certificação {nome} ({descrição}).

Seed aleatória para garantir variação: {Math.random()}

Regras importantes:
- Escolha um tópico DIFERENTE a cada geração
- Varie o estilo da pergunta (definição, cenário prático, comparação, exceção, caso de uso)
- Varie sempre o índice da alternativa correta entre 0 e 3
```

### 2. Formato de Resposta

O modelo é instruído a retornar **exclusivamente** um JSON estruturado, sem markdown ou texto adicional:

```json
{
    "pergunta": "texto da pergunta",
    "alternativas": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correta": 1,
    "explicacao": "explicação detalhada de cada alternativa"
}
```

### 3. Tratamento da Resposta

O Gemini ocasionalmente retorna o JSON com marcadores de markdown ou texto fora do objeto. Para lidar com isso de forma robusta, o backend extrai o conteúdo usando `indexOf` e `lastIndexOf` para encontrar o primeiro `{` e o último `}` da resposta, ignorando qualquer conteúdo externo antes de fazer o `JSON.parse`.

```javascript
const inicio = textoResposta.indexOf('{');
const fim = textoResposta.lastIndexOf('}');
const textoLimpo = textoResposta.substring(inicio, fim + 1);
const questao = JSON.parse(textoLimpo);
```

### 4. Fallback

Caso a chamada à IA falhe por qualquer motivo (timeout, erro de rede, resposta inválida), o sistema utiliza uma questão de fallback pré-definida para cada certificação, garantindo que o simulado não seja interrompido.

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────┐
│           Usuário (Browser)         │
└────────────────┬────────────────────┘
                 │ HTTP
┌────────────────▼────────────────────┐
│         Frontend (React + Vite)     │
│  ┌──────────┐ ┌──────┐ ┌────────┐  │
│  │TelaSetup │ │Quiz  │ │Result. │  │
│  └──────────┘ └──────┘ └────────┘  │
│         src/services/api.ts         │
└────────────────┬────────────────────┘
                 │ REST API (/api/*)
                 │ JWT Token (Authorization header)
┌────────────────▼────────────────────┐
│        Backend (Express.js)         │
│                                     │
│  POST /api/register                 │
│  POST /api/login                    │
│  GET  /api/me                       │
│  POST /api/gerar-questao  🔒        │
│  POST /api/salvar-respostas 🔒      │
│  GET  /api/historico      🔒        │
│                                     │
│  🔒 = requer autenticação JWT       │
└──────┬───────────────┬──────────────┘
       │               │
┌──────▼──────┐ ┌──────▼──────────────┐
│  PostgreSQL │ │   Google Gemini API  │
│  (histórico │ │  (geração de        │
│   e users)  │ │   questões com IA)  │
└─────────────┘ └─────────────────────┘
```

### Estrutura de Pastas

```
TRABALHO-CARREIRA-E-CERTIFICACAO/
├── server.js                      # Servidor Express
├── package.json                   # Dependências do backend
├── .env                           # Variáveis de ambiente (não versionar)
└── client/                        # Frontend React
    ├── index.html
    ├── vite.config.ts             # Proxy /api → localhost:3000
    ├── tailwind.config.js
    └── src/
        ├── App.tsx                # Navegação entre telas
        ├── index.css              # Estilos globais
        ├── types/index.ts         # Interfaces TypeScript
        ├── data/certificacoes.tsx # Certificações disponíveis
        ├── services/api.ts        # Chamadas ao backend
        └── components/
            ├── TelaSetup.tsx      # Configuração do simulado
            ├── TelaQuiz.tsx       # Execução do simulado
            └── TelaResultado.tsx  # Resultado e revisão
```

---

## Rotas da API

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/register` | Cadastro de novo usuário |
| POST | `/api/login` | Login e geração de token JWT |
| GET | `/api/me` | Retorna dados do usuário autenticado |

### Simulado (requer token JWT)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/gerar-questao` | Gera uma questão com IA para a certificação e dificuldade informadas |
| POST | `/api/salvar-respostas` | Salva as respostas do usuário ao final do simulado |
| GET | `/api/historico` | Retorna o histórico de questões do usuário autenticado |

### Exemplo — Gerar Questão

**Requisição:**
```json
POST /api/gerar-questao
Authorization: Bearer <token>

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

---

## Certificações Suportadas

| ID | Nome | Descrição |
|---|---|---|
| DPO | DPO / LGPD | Data Protection Officer baseado na LGPD brasileira |
| ITIL4 | ITIL 4 | Gestão de Serviços de TI — ITIL 4 Foundation |
| SCRUM | Scrum | Scrum Master / Product Owner baseado no Scrum Guide |
| AWS-CCP | AWS Cloud | AWS Certified Cloud Practitioner |
| AZURE | Azure AZ-900 | Microsoft Azure Fundamentals |
| COMPTIA | CompTIA Sec+ | Segurança da Informação — CompTIA Security+ |

---

## Instalação e Execução

### Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL instalado e rodando
- Chave de API do Google Gemini ([obter aqui](https://aistudio.google.com/))

### 1. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
GEMINI_API_KEY=sua_chave_aqui
JWT_SECRET=um_segredo_forte_aqui
DB_USER=postgres
DB_HOST=localhost
DB_NAME=nome_do_banco
DB_PASSWORD=sua_senha
DB_PORT=5432
```

### 2. Configure o banco de dados

```sql
CREATE TABLE historico_simulados (
    id SERIAL PRIMARY KEY,
    conteudo_questao TEXT,
    certificacao VARCHAR(20),
    dificuldade VARCHAR(20),
    respostas_usuario JSONB,
    user_id INTEGER REFERENCES users(id),
    data_geracao TIMESTAMP DEFAULT NOW()
);
```

> As tabelas `users` e as colunas adicionais são criadas automaticamente pelo `initDb()` na inicialização do servidor.

### 3. Instale as dependências

```bash
# Backend (na raiz)
npm install

# Frontend
cd client
npm install
```

### 4. Rode a aplicação

```bash
# Terminal 1 — Backend
node --watch server.js

# Terminal 2 — Frontend
cd client
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

---

## Principais Desafios Encontrados

### Parsing da resposta do Gemini

O principal desafio técnico do projeto foi garantir que a resposta da IA pudesse ser convertida em JSON de forma confiável.

O modelo foi instruído a retornar apenas um JSON puro, sem nenhum texto adicional. Porém, na prática, o Gemini frequentemente retornava o conteúdo envolto em blocos de markdown (` ```json ... ``` `), com texto introdutório antes do objeto, ou com pequenas inconsistências de formatação que quebravam o `JSON.parse`.

A primeira tentativa de solução foi remover as crases com `.replace(/\`\`\`json|\`\`\`/g, '')`, mas isso não era suficiente quando o modelo adicionava texto fora do bloco de código.

A solução definitiva foi localizar o primeiro `{` e o último `}` da resposta usando `indexOf` e `lastIndexOf`, extraindo apenas o trecho entre eles:

```javascript
const inicio = textoResposta.indexOf('{');
const fim = textoResposta.lastIndexOf('}');
const textoLimpo = textoResposta.substring(inicio, fim + 1);
const questao = JSON.parse(textoLimpo);
```

Essa abordagem é agnóstica ao formato de saída do modelo — independentemente do que o Gemini coloque antes ou depois do JSON, o conteúdo correto é sempre extraído. Para cobrir os casos em que a IA falhasse completamente, também foi implementado um sistema de fallback com questões pré-definidas por certificação, garantindo que o simulado nunca seja interrompido por uma falha de integração.

---

## Conclusão

O projeto demonstrou na prática como a Inteligência Artificial pode ser integrada a aplicações web modernas para resolver um problema real: a limitação de bancos de questões fixos em plataformas de estudo para certificações.

A combinação de React com TypeScript no frontend e Node.js com Express no backend mostrou-se uma arquitetura produtiva e bem estruturada para o prazo disponível. O uso do Google Gemini permitiu gerar questões dinâmicas, variadas e com explicações de qualidade, agregando valor real à experiência do usuário.

A implementação de autenticação com JWT e persistência de histórico por usuário elevou o nível técnico da solução, tornando-a mais próxima de uma aplicação real de mercado.

Como possíveis evoluções futuras, a aplicação poderia incluir um dashboard com gráficos de desempenho por certificação ao longo do tempo, modo cronometrado para simular as condições reais de prova, e suporte a mais certificações como Google Cloud e Kubernetes.
