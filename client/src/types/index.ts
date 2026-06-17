import { ReactNode } from "react"

export interface Questao {
    pergunta: string
    alternativas: string[]
    correta: number
    explicacao: string
    id_banco?: number
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
    icone: ReactNode
}

export type Dificuldade = 'Iniciante' | 'Intermediário' | 'Avançado'

export type Tela = 'setup' | 'quiz' | 'resultado' | 'historico'