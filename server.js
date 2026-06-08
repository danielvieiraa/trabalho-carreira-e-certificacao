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

app.get('/', (req, res) => {
    res.send('Servidor do Assistente DPO está online e aguardando requisições!');
});

// 3. Rota de comunicação com a IA
app.post('/api/gerar-questao', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = "Gere uma questão de múltipla escolha nível avançado para certificação DPO (Data Protection Officer) baseada na LGPD. Retorne a pergunta, 4 alternativas de resposta e indique qual é a correta.";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textoResposta = response.text();

        // Persistência: Grava o resultado na tabela historico_simulados
        const insertQuery = 'INSERT INTO historico_simulados (conteudo_questao) VALUES ($1) RETURNING id, data_geracao';
        const dbResult = await pool.query(insertQuery, [textoResposta]);

        res.json({ 
            questao: textoResposta,
            id_banco: dbResult.rows[0].id
        });
    } catch (error) {
        console.error("Erro na integração ou banco de dados:", error);
        res.status(500).json({ error: 'Falha ao processar requisição.' });
    }
});

// 4. Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de API rodando em http://localhost:${PORT}`);
});