import { useState } from "react";
import type { Certificacao, Dificuldade, QuestaoRespondida, Tela } from "./types";
import TelaSetup from "./components/TelaSetup";
import TelaQuiz from "./components/TelaQuiz";
import TelaResultado from "./components/TelaResultado";

export default function App() {
  const [tela, setTela] = useState<Tela>('setup')
  const [certSelecionada, setCertSelecionada] = useState<Certificacao | null>(null)
  const [dificuldade, setDificuldade] = useState<Dificuldade>('Iniciante')
  const [quantidade, setQuantidade] = useState(5)
  const [respostas, setRespostas] = useState<QuestaoRespondida[]>([])

  function iniciarSimulado() {
    if (!certSelecionada) return
    setRespostas([])
    setTela('quiz')
  }

  function concluirSimulado(rs: QuestaoRespondida[]) {
    setRespostas(rs)
    setTela('resultado')
  }

  function reiniciar() {
    setCertSelecionada(null)
    setDificuldade('Iniciante')
    setQuantidade(5)
    setRespostas([])
    setTela('setup')
  }

  if (tela === 'quiz' && certSelecionada) {
    return (
      <TelaQuiz
        certificacao={certSelecionada}
        dificuldade={dificuldade}
        quantidade={quantidade}
        onConcluir={concluirSimulado}
      />
    )
  }

  if (tela === 'resultado' && certSelecionada){
    return (
      <TelaResultado
        respostas={respostas}
        certificacao={certSelecionada}
        dificuldade={dificuldade}
        onReiniciar={reiniciar}
      />
    )
  }

  return (
    <TelaSetup
      certSelecionada={certSelecionada}
      dificuldade={dificuldade}
      quantidade={quantidade}
      onSelecionarCert={setCertSelecionada}
      onSelectionarDificuldade={setDificuldade}
      onSelecionarQuantidade={setQuantidade}
      onIniciar={iniciarSimulado}
    />
  )
}

