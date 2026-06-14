require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexão com o Banco de Dados PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// 2. Instância do Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CERTIFICACOES = {
    'DPO': { nome: 'DPO / LGPD', descricao: 'Data Protection Officer baseado na LGDP brasileira'},
    'ITIL4': {nome: 'ITIL 4', descricao: 'Gestão de serviços de TI - ITIL 4 Foundation'},
    'SCRUM': {nome: 'Scrum', descricao: 'Scrum Master / Product Owner baseado no Scrum Guide'},
    'AWS-CCP': {nome: 'AWS Cloud', descricao: 'AWS Certified Cloud Pratictioner'},
    'AZURE': {nome: 'Azure AZ-900', descricao: 'Microsoft Azure Fundamentals'},
    'COMPTIA': {nome: 'CompTIA Security+', descricao: 'Segurança da informação - CompTIA Security+'},
};

app.get('/', (req, res) => {
    res.send('Servidor online')
});

// 3. Rota de comunicação com a IA
app.post('/api/gerar-questao', async (req, res) => {
    try {
        const { certificacao = 'DPO', dificuldade = 'Iniciante' } = req.body

        const cert = CERTIFICACOES[certificacao];
        if (!cert) {
            return res.status(400).json({
                error: `Certificação inválida. Opções ${Object.keys(CERTIFICACOES).join(', ')}`
            })
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Você é um gerador de questões para certificações de TI.
        gere UMA questão de múltipla escolha de nível ${dificuldade} para a certificação ${cert.nome} (${cert.descricao}).

        Seed aleatória para garantir variação: ${Math.random}

        Regras importantes:
        - Escolha um tópico DIFERENTE a cada geração, variando sempre entre os diversos assuntos da certificação
        - Não repita perguntas sobre o mesmo conceito básico
        - Varie o estilo da pergunta (definição, cenário prático, comparação, exceção, caso de uso)

        Retorne APENAS um JSON válido com este formato, sem markdown, sem texto extra:
        {
            "pergunta": "texto da pergunta aqui",
            "alternativas": ["A) texto", "B) texto", "C) texto", "D) texto"],
            "correta": 0
            "explicacao": "explicacao detalhada do porquê a resposta correta está certa e as demais estão erradas"
        }

        O campo "correta" é o índice (0 a 3) da alternativa correta. Varie sempre o índice da resposta correta.`;

        const result = await model.generateContent(prompt);
        const textoResposta = result.response.text();

        const inicio = textoResposta.indexOf('{')
        const fim = textoResposta.indexOf('}')

        if (inicio === -1 || fim === -1) {
            throw new Error('IA não retornou um JSON válido')
        }

        const textoLimpo = textoResposta.substring(inicio, fim + 1);
        const questao = JSON.parse(textoLimpo);

        // Persistência: Grava o resultado na tabela historico_simulados
        const insertQuery = `
            INSERT INTO historico_simulados (conteudo_questao, certificacao, dificuldade)
            VALUES ($1, $2, $3)
            RETURNING id, data_geracao
        `;
        const dbResult = await pool.query(insertQuery, [textoLimpo, certificacao, dificuldade]);

        res.json({ 
            questao,
            id_banco: dbResult.rows[0].id,
            data_geracao: dbResult.rows[0].data_geracao,
        });
        
    } catch (error) {
        console.error("Erro na integração ou banco de dados:", error);
        res.status(500).json({ error: 'Falha ao processar requisição.' });
    }
});

app.get('/api/historico', async (req, res) => {
    try {
        const { certificacao } = req.query;
        const query = certificacao
            ? 'SELECT * FROM historico_simulados WHERE certificacao = $1 ORDER BY data_geracao DESC LIMIT 50'
            : 'SELECT * FROM historico_simulados ORDER BY data_geracao DESC LIMIT 50';
        
        const result = await pool.query(query, certificacao ? [certificacao] : []);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar histórico '});
    }
});

// 4. Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de API rodando em http://localhost:${PORT}`);
});