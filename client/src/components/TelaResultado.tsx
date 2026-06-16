import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import type { QuestaoRespondida, Certificacao, Dificuldade } from "../types";
import { salvarRespostas } from "../services/api";

interface Props {
    respostas: QuestaoRespondida[]
    certificacao: Certificacao
    dificuldade: Dificuldade
    onReiniciar: () => void
}

export default function TelaResultado({ respostas, certificacao, dificuldade, onReiniciar}: Props) {
    const total = respostas.length
    const acertos = respostas.filter((r) => r.correta).length
    const pct = Math.round((acertos / total) * 100)
    const letra = (i: number) => ['A', 'B', 'C', 'D'][i]
    const [salvo, setSalvo] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        async function salvarDados() {
            try {
                await salvarRespostas(certificacao.id, dificuldade, respostas)
                setSalvo(true)
            } catch (e) {
                setErro(e instanceof Error ? e.message : 'Erro ao salvar respostas')
                console.error("Erro ao salvar:", e)
            }
        }
        salvarDados()
    }, [respostas, certificacao.id, dificuldade])

    const mensagem = () => {
        if (pct >= 80) return { titulo: 'Resultado excelente!', sub: 'Você está bem preparado para a prova.' }
        if (pct >= 60) return { titulo: 'Bom desempenho!', sub: 'Continue estudando os tópicos que errou.'}
        return { titulo: 'Precisa de mais estudo.', sub: 'Revise os conteúdos abaixo e tente novamente.'}
    }

    const corPct = pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'
    const corCirculo = pct >= 80 ? 'border-green-600' : pct >= 60 ? 'border-yellow-600' : 'border-red-600'
    const { titulo, sub } = mensagem()

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 pt-10 pb-16">
            <div className="w-full max-w-2xl">
                <div className="card p-8 mb-4 text-center">
                    <div className={`w-24 h-24 rounded-full border-4 ${corCirculo} flex flex-col items-center justify-center mx-auto mb-4`}>
                        <span className={`text-3xl font-semibold ${corPct}`}>{pct}%</span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-1">{titulo}</h1>
                    <p className="text-gray-500 text-sm mb-5">{sub}</p>

                    {erro && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-600">{erro}</p>
                        </div>
                    )}

                    {salvo && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs text-green-600">✓ Respostas salvas com sucesso</p>
                        </div>
                    )}

                    <div className="flex justify-center gap-6 pt-4 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-gray-900">{acertos}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Acertos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-gray-900">{total-acertos}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Erros</p>
                        </div>
                        <div className="text-center flex flex-col items-center jusutify center mt-2">
                            <p className="font-medium text-gray-700">{certificacao.nome}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{dificuldade}</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 px-1">
                    Revisão das questões
                </h2>

                <div className="flex flex-col gap-3 mb-6">
                    {respostas.map((r, i) => (
                        <div key={i} className="card p-5">
                            <div className="flex items-start gap-3 mb-3">
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                                    text-xs font-semibold mt-0.5
                                    ${r.correta ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {r.correta
                                        ? <Check size={14} className="text-green-700" />
                                        : <X size={14} className="text-red-700"/>}
                                </span>
                                <p className="text-sm text-gray-800 leading-relaxed">{r.questao.pergunta}</p>
                            </div>

                            {!r.correta && (
                                <div className="ml-9 text-xs text-red-600 mb-1.5">
                                    Sua resposta: {letra(r.escolhida)} {r.questao.alternativas[r.escolhida].replace(/^[A-D]\)\s*/, "")}
                                </div>
                            )}

                            <div className="ml-9 text-xs text-green-700 mb-3">
                                Correta: {letra(r.questao.correta)} {r.questao.alternativas[r.questao.correta].replace(/^[A-D]\)\s*/, "")}
                            </div>

                            <div className="ml-9 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-600 leading-relaxed">{r.questao.explicacao}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn-primary w-full py-4 text-base" onClick={onReiniciar}>
                    Fazer novo simulado
                </button>
            </div>
        </div>
    )
}