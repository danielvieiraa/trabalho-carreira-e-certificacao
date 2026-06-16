import { useState, useEffect, ReactNode } from 'react';
import { CERTIFICACOES } from '../data/certificacoes';

interface RegistroHistorico {
    id: number;
    conteudo_questao: string;
    certificacao: string;
    dificuldade: string;
    data_geracao: string;
}

interface Props {
    onVoltar?: () => void;
}

export default function TelaHistorico({ onVoltar }: Props) {
    const [historico, setHistorico] = useState<RegistroHistorico[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [filtroFiltro, setFiltroFiltro] = useState<string | null>(null);
    const [expandidos, setExpandidos] = useState<Set<number>>(new Set());

    useEffect(() => {
        buscarHistorico();
    }, []);

    async function buscarHistorico() {
        try {
            setCarregando(true);
            const url = filtroFiltro ? `/api/historico?certificacao=${filtroFiltro}` : '/api/historico';
            const response = await fetch(url);
            const data = await response.json();
            setHistorico(data);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
        } finally {
            setCarregando(false);
        }
    }

    function alternarExpansao(id: number) {
        const novoExpandidos = new Set(expandidos);
        if (novoExpandidos.has(id)) {
            novoExpandidos.delete(id);
        } else {
            novoExpandidos.add(id);
        }
        setExpandidos(novoExpandidos);
    }

    function formatarData(dataStr: string) {
        const data = new Date(dataStr);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function obterCorDificuldade(dificuldade: string) {
        switch (dificuldade) {
            case 'Iniciante':
                return 'bg-green-50 border-green-200 text-green-700';
            case 'Intermediário':
                return 'bg-yellow-50 border-yellow-200 text-yellow-700';
            case 'Avançado':
                return 'bg-red-50 border-red-200 text-red-700';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    }

    function obterIconeCertificacao(cert: string): ReactNode {
        const certificacao = CERTIFICACOES.find(c => c.id === cert);
        return certificacao?.icone || '📚';
    }

    const certificacoesFiltradas = [...new Set(historico.map(r => r.certificacao))];

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 pt-12 pb-16">
            <div className="w-full max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-brand-600 uppercase tracking-wide">
                                📋 Histórico
                            </span>
                        </div>
                        <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
                            Seus Simulados
                        </h1>
                        <p className="text-gray-500 mt-1.5 text-base">
                            {historico.length} questões geradas
                        </p>
                    </div>
                    <a
                        href="/"
                        onClick={(e) => {
                            if (onVoltar) {
                                e.preventDefault();
                                onVoltar();
                            }
                        }}
                        className="btn-secondary"
                    >
                        ← Voltar
                    </a>
                </div>

                {certificacoesFiltradas.length > 0 && (
                    <div className="card p-4 mb-6">
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => {
                                    setFiltroFiltro(null);
                                    buscarHistorico();
                                }}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${
                                    filtroFiltro === null
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Todas
                            </button>
                            {certificacoesFiltradas.map((cert) => (
                                <button
                                    key={cert}
                                    onClick={() => {
                                        setFiltroFiltro(cert);
                                        buscarHistorico();
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 ${
                                        filtroFiltro === cert
                                            ? 'bg-brand-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {obterIconeCertificacao(cert)} {cert}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {carregando ? (
                    <div className="card p-8 text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Carregando histórico...</p>
                    </div>
                ) : historico.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="text-5xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Nenhum simulado encontrado
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Comece gerando questões para construir seu histórico
                        </p>
                        <a href="/" className="btn-primary inline-block">
                            Iniciar Simulado
                        </a>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {historico.map((registro) => {
                            const isExpandido = expandidos.has(registro.id);
                            let conteudo;
                            try {
                                conteudo = JSON.parse(registro.conteudo_questao);
                            } catch {
                                conteudo = null;
                            }

                            return (
                                <div
                                    key={registro.id}
                                    className="card overflow-hidden transition-all duration-200 hover:shadow-md"
                                >
                                    <button
                                        onClick={() => alternarExpansao(registro.id)}
                                        className="w-full px-6 py-4 text-left flex items-center gap-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="text-2xl flex-shrink-0">
                                            {obterIconeCertificacao(registro.certificacao)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {conteudo?.pergunta || 'Questão sem título'}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formatarData(registro.data_geracao)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium border ${obterCorDificuldade(
                                                    registro.dificuldade
                                                )}`}
                                            >
                                                {registro.dificuldade}
                                            </span>
                                            <div
                                                className={`transform transition-transform ${
                                                    isExpandido ? 'rotate-180' : ''
                                                }`}
                                            >
                                                ▼
                                            </div>
                                        </div>
                                    </button>

                                    {isExpandido && conteudo && (
                                        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                                            <div className="mb-4">
                                                <h4 className="font-semibold text-gray-900 mb-3">
                                                    Alternativas:
                                                </h4>
                                                <div className="space-y-2">
                                                    {conteudo.alternativas?.map((alt, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`p-3 rounded-lg border-2 ${
                                                                idx === conteudo.correta
                                                                    ? 'border-green-300 bg-green-50'
                                                                    : 'border-gray-200 bg-white'
                                                            }`}
                                                        >
                                                            <p
                                                                className={
                                                                    idx === conteudo.correta
                                                                        ? 'text-green-700 font-medium'
                                                                        : 'text-gray-700'
                                                                }
                                                            >
                                                                {alt}
                                                                {idx === conteudo.correta && (
                                                                    <span className="ml-2">✓</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    Explicação:
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                                                    {conteudo.explicacao}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
