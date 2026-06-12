import type { Questao } from "../types";

const API_BASE = '/api'

interface GerarQuestaoResponse {
    questao: Questao
    id_banco: number
    data_geracao: string
}

export async function gerarQuestao(certificacao: string, dificuldade: string): Promise<Questao> {
    const response = await fetch(`${API_BASE}/gerar_questao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificacao, dificuldade })
    })

    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error((err as {error?: string}).error ?? `Erro ${response.status}`);
    }

    const data: GerarQuestaoResponse = await response.json();
    return data.questao;
}