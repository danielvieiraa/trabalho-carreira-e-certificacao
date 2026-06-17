import type { Questao, QuestaoRespondida } from "../types";

const API_BASE = '/api'

interface GerarQuestaoResponse {
    questao: Questao
    id_banco: number
    data_geracao: string
}

interface SalvarRespostasResponse {
    sucesso: boolean
    atualizados: number
    respostas_salvas: unknown
}

export async function gerarQuestao(certificacao: string, dificuldade: string): Promise<Questao> {
    const response = await fetch(`${API_BASE}/gerar-questao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificacao, dificuldade })
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error((err as {error?: string}).error ?? `Erro ${response.status}`);
    }

    const data: GerarQuestaoResponse = await response.json();
    return { ...data.questao, id_banco: data.id_banco };
}

export async function salvarRespostas(certificacao: string, dificuldade: string, respostas: QuestaoRespondida[]): Promise<SalvarRespostasResponse> {
    const respostasFormatadas = respostas.map(r => ({
        id_banco: r.questao.id_banco,
        escolhida: r.escolhida,
        correta: r.questao.correta,
        acertou: r.correta
    }));

    const response = await fetch(`${API_BASE}/salvar-respostas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificacao, dificuldade, respostas: respostasFormatadas })
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error((err as {error?: string}).error ?? `Erro ${response.status}`);
    }

    const data: SalvarRespostasResponse = await response.json();
    return data;
}