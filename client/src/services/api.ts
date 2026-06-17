import type { Dificuldade, Questao, QuestaoRespondida, User } from "../types";

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(error.error ?? `Erro ${response.status}`);
  }
  return response.json();
}

export async function register(username: string, password: string): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
}

export async function login(username: string, password: string): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
}

export async function me(): Promise<User> {
  const response = await fetch(`${API_BASE}/me`, {
    headers: { ...getAuthHeaders() }
  });
  const data = await handleResponse<{ user: { userId: number; username: string } }>(response);
  return { id: data.user.userId, username: data.user.username };
}

export async function gerarQuestao(certificacao: string, dificuldade: Dificuldade): Promise<Questao> {
  const response = await fetch(`${API_BASE}/gerar-questao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ certificacao, dificuldade })
  });

  const data = await handleResponse<{ questao: Questao; id_banco?: number }>(response);
  return { ...data.questao, id_banco: data.id_banco };
}

export async function salvarRespostas(certificacao: string, dificuldade: Dificuldade, respostas: QuestaoRespondida[]): Promise<void> {
  const payload = respostas.map((r) => ({
    id_banco: r.questao.id_banco,
    escolhida: r.escolhida,
    correta: r.questao.correta,
    acertou: r.correta
  }));

  const response = await fetch(`${API_BASE}/salvar-respostas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ certificacao, dificuldade, respostas: payload })
  });

  await handleResponse(response);
}

export async function buscarHistorico(certificacao?: string, userId?: number): Promise<Array<{ id: number; conteudo_questao: any; certificacao: string; dificuldade: string; respostas_usuario: any; data_geracao: string }>> {
  const params = new URLSearchParams();
  if (certificacao) params.set('certificacao', certificacao);
  if (userId) params.set('user_id', String(userId));

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE}/historico${query}`, {
    headers: { ...getAuthHeaders() }
  });
  return handleResponse(response);
}
