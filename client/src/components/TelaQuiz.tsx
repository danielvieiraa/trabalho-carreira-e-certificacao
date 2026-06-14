import { useState, useEffect } from "react";
import type { Questao, QuestaoRespondida, Certificacao, Dificuldade } from "../types";
import { gerarQuestao } from "../services/api";
import { ChevronRight } from "lucide-react";

interface Props {
    certificacao: Certificacao
    dificuldade: Dificuldade
    quantidade: number
    onConcluir: (respostas: QuestaoRespondida[]) => void
}

export default function TelaQuiz({ certificacao, dificuldade, quantidade, onConcluir }: Props){
    const [questaoAtual, setQuestaoAtual] = useState<Questao | null>(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [escolhida, setEscolhida] = useState<number | null>(null)
    const [respondida, setRespondida] = useState(false)
    const [respostas, setRespostas] = useState<QuestaoRespondida[]>([])
    const [indice, setIndice] = useState(0)

    useEffect(() => { carregarQuestao() }, [indice])

    async function carregarQuestao() {
        setCarregando(true)
        setErro(null)
        setEscolhida(null)
        setRespondida(false)
        setQuestaoAtual(null)
        try {   
            const q = await gerarQuestao(certificacao.id, dificuldade)
            setQuestaoAtual(q)
        } catch (e) {
            setErro(e instanceof Error ? e.message : 'Erro ao gerar questão.')
        } finally {
            setCarregando(false)
        }
    }

    function responder(idx: number) {
        if (respondida || !questaoAtual) return
        setEscolhida(idx)
        setRespondida(true)
    }

    function avancar() {
        if (!questaoAtual || escolhida === null) return
        const novasRespostas = [...respostas, {
            questao: questaoAtual,
            escolhida,
            correta: escolhida === questaoAtual.correta
        }]
        setRespostas(novasRespostas)
        if (indice + 1 >= quantidade) {
            onConcluir(novasRespostas)
        } else {
            setIndice(indice + 1)
        }
    }

    const progresso = Math.round((indice / quantidade) * 100)
    const letra = (i: number) => ['A', 'B', 'C', 'D'][i]

    function corBotao(i: number) {
        if (!respondida) {
            return escolhida === i
            ? 'border-brand-600 bg-brand-50 text-brand-900'
            : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
        }

        if (i === questaoAtual?.correta) return 'border-green-400 bg-green-50 text-green-900'
        if (i === escolhida) return 'border-red-400 bg-red-50 text-red-900'

        return 'border-gray-100 text-gray-400'
    }

    function corLetra(i: number) {
        if (!respondida) return 'border-current'
        if (i === questaoAtual?.correta) return 'border-green-500 bg-green-500 text-white'
        if (i === escolhida) return 'border-red-400 bg-red-400 text-white'

        return 'border-current'
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 pt-10 pb-16">
            <div className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <span className="text-xl text-gray-500">{certificacao.icone}</span>
                        <span className="text-sm font-medium text-gray-500">{certificacao.nome}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">{dificuldade}</span>
                    </div>
                </div>
                <span text-sm font-medium text-gray-400>{indice + 1} / {quantidade}</span>

                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
                    <div className="bg-brand-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progresso}%` }} />
                </div>

                <div className="card p-6 mb-4">
                    {carregando && (
                        <div className="flex flex-col items-center py-12 gap-4">   
                            <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"/>
                            <p className="text-sm text-gray-400">Gerando questão com IA...</p>
                        </div>
                    )}

                    {erro && !carregando && (
                        <div className="py-8 text-center">
                            <p className="text-red-600 font-medium text-sm mb-4">{erro}</p>
                            <button className="btn-secondary text-sm">Tentar Novamente</button>
                        </div>
                    )}

                    {questaoAtual && !carregando && (
                        <>
                            <p className="text-base text-gray-900 leading-relaxed mb-5">{questaoAtual.pergunta}</p>

                            <div className="flex flex-col gap-2.5">
                                {questaoAtual.alternativas.map((alt, i) => {
                                    const texto = alt.includes(')') ? alt.substring(alt.indexOf(')') + 1).trim() : alt
                                    return (
                                        <button
                                            key={i}
                                            disabled={respondida}
                                            onClick={() => responder(i)}
                                            className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left
                                                transition-all duration-150 disabled:cursor-default ${corBotao(i)}`}
                                        >
                                            <span className={`min-w-[26px] h-[26px] rounded-full border flex items-center
                                                justify-center text-xs font-semibold flex-shrink-0 mt-0.5 ${corLetra(i)}`}>
                                                {letra(i)}
                                            </span>
                                            <span className="text-sm leading-relaxed">{texto}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </>
                    )}  
                </div>

                {respondida && questaoAtual && (
                    <div className="flex justify-end">
                        <button className="btn-primary flex items-center gap-2 px-8" onClick={avancar}>
                                {indice + 1 >= quantidade ? 'Ver resultado' : 'Próxima questão'}
                            <ChevronRight size={18}/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}