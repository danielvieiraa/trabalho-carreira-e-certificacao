export interface Questao {
    pergunta: string
    alternativas: string[]
    correta: number
    explicacao: string
}

export interface QuestaoRespondida {
    questao: Questao
    escolhida: number
    correta: boolean
}

export interface Certificacao {
    id: string
    nome: string
    descricao: string
}

export type Dificuldade = 'Iniciante' | 'Intermediário' | 'Avançado'

export type Tela = 'setup' | 'quiz' | 'resultado'