import type { Certificacao } from "../types";

export const CERTIFICACOES: Certificacao[] = [
    { id: 'DPO', nome: 'DPO / LGPD', descricao: 'Data Protection Officer' },
    { id: 'ITIL4', nome: 'ITIL 4', descricao: 'Gestão de Serviços de TI' },
    { id: 'SCRCUM', nome: 'Scrum', descricao: 'Framework Ágil' },
    { id: 'AWS-CCP', nome: 'AWS Cloud', descricao: 'Cloud Practitioner' },
    { id: 'AZURE', nome: 'AZURE AZ-900', descricao: 'Fundamentos Azure' },
    { id: 'COMPTIA', nome: 'CompTIA Sec+', descricao: 'Segurança da Informação' }
]

export const DIFICULDADES = ['Iniciante', 'Intermediário', 'Avançado'] as const
export const QUANTIDADES = [5, 10, 15] as const