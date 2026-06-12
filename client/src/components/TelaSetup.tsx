import type { Certificacao, Dificuldade } from "../types";
import { CERTIFICACOES, DIFICULDADES, QUANTIDADES } from "../data/certificacoes";

interface Props {
    certSelecionada: Certificacao | null
    dificuldade: Dificuldade
    quantidade: number
    onSelecionarCert: (c: Certificacao) => void
    onSelectionarDificuldade: (d: Dificuldade) => void
    onSelecionarQuantidade: (q: number) => void
    onIniciar: () => void
}

export default function TelaSetup({
    certSelecionada, dificuldade, quantidade,
    onSelecionarCert, onSelectionarDificuldade, onSelecionarQuantidade, onIniciar,
}: Props) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 pt-12 pb-16">
            <div className="w-full max-w-2xl">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-brand-600 uppercase tracking-wide">
                            Simulador de Certificações
                        </span>
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
                        Prepare-se para sua certificação
                    </h1>
                    <p className="text-gray-500 mt-1.5 text-base">
                        Questões geradas por IA com explicações detalhadas.
                    </p>
                </div>

                <div className="card p-6 mb-4">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                        Escolha a certificação
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {CERTIFICACOES.map((cert) => {
                            const selected = certSelecionada?.id === cert.id
                            return (
                                <button
                                    key={cert.id}
                                    onClick={() => onSelecionarCert(cert)}
                                    className={`text-left p-4 rounded-xl border-2 transition-all duration-150
                                        ${selected
                                            ? 'border-brand-600 bg-brand-50'
                                            : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
                                        }`}
                                >
                                    <p className={`text-sm font-semibold leading-tight ${selected ? 'text-brand-800' : 'text-gray-900'}`}>
                                        {cert.nome}
                                    </p>
                                    <p className={`text-xs mt-0.5 ${selected ? 'text-brand-600' : 'text-gray-400'}`}>
                                        {cert.descricao}
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="card p-5">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Dificuldade</h2>
                        <div className="flex flex-col gap-2">
                            {DIFICULDADES.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => onSelectionarDificuldade(d)}
                                    className={`text-left px-4 py-2.5 rounded-lg border transition-all duration-150 text-sm font-medium
                                        ${dificuldade === d
                                            ? 'border-brand-600 bg-brand-50 text-brand-800'
                                            : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {d === 'Iniciante'}{d === 'Intermediário'}{d === 'Avançado'}
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card p-5">
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Questões</h2>
                        <div className="flex flex-col gap-2">
                            {QUANTIDADES.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => onSelecionarQuantidade(q)}
                                    className={`text-left px-4 py-2.5 rounded-lg border transition-all duration-150 text-sm font-medium
                                        ${quantidade === q
                                            ? 'border-brand-600 bg-brand-50 text-brand-800'
                                            : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {q} questões
                                    <span className="text-xs font-normal ml-2 text-gray-400">
                                        {q === 5 ? '~5 min' : q === 10 ? '~10 min' : '~15 min'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    className="btn-primary w-full py-4 text-base"
                    disabled={!certSelecionada}
                    onClick={onIniciar}
                >
                    {certSelecionada
                        ? `Iniciar simulado - ${certSelecionada.nome}`
                        : 'Selecione uma certificação para continuar'
                    }
                </button>
            </div>
        </div>
    )
}