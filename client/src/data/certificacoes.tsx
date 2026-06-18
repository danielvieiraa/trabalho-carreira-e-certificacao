import { Cloud, Globe, Lock, RefreshCw, Settings, Shield } from "lucide-react";
import type { Certificacao } from "../types";

export const CERTIFICACOES: Certificacao[] = [
    { id: 'DPO', nome: 'DPO / LGPD', descricao: 'Data Protection Officer', icone: <Shield size={22} /> },
    { id: 'ITIL4', nome: 'ITIL 4', descricao: 'Gestão de Serviços de TI', icone: <Settings size={22} /> },
    { id: 'SCRUM', nome: 'Scrum', descricao: 'Framework Ágil', icone: <RefreshCw size={22} />},
    { id: 'AWS-CCP', nome: 'AWS Cloud', descricao: 'Cloud Practitioner', icone: <Cloud size={22} /> },
    { id: 'AZURE', nome: 'AZURE AZ-900', descricao: 'Fundamentos Azure', icone: <Globe size={22} /> },
    { id: 'COMPTIA', nome: 'CompTIA Sec+', descricao: 'Segurança da Informação', icone: <Lock size={22} /> }
]

export const DIFICULDADES = ['Iniciante', 'Intermediário', 'Avançado'] as const
export const QUANTIDADES = [5, 10, 15] as const