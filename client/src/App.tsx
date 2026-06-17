import { useEffect, useState } from "react";
import type { Certificacao, Dificuldade, QuestaoRespondida, Tela, User } from "./types";
import { me } from "./services/api";
import TelaLogin from "./components/TelaLogin";
import TelaSetup from "./components/TelaSetup";
import TelaQuiz from "./components/TelaQuiz";
import TelaResultado from "./components/TelaResultado";
import TelaHistorico from "./components/TelaHistorico";

export default function App() {
  const [tela, setTela] = useState<Tela>('setup');
  const [certSelecionada, setCertSelecionada] = useState<Certificacao | null>(null);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('Iniciante');
  const [quantidade, setQuantidade] = useState(5);
  const [respostas, setRespostas] = useState<QuestaoRespondida[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const currentUser = await me();
        setUser(currentUser);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoadingAuth(false);
      }
    }

    checkAuth();
  }, []);

  function handleLoginSuccess(userData: User, token: string) {
    localStorage.setItem('token', token);
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    setTela('setup');
  }

  function iniciarSimulado() {
    if (!certSelecionada) return;
    setRespostas([]);
    setTela('quiz');
  }

  function concluirSimulado(rs: QuestaoRespondida[]) {
    setRespostas(rs);
    setTela('resultado');
  }

  function reiniciar() {
    setCertSelecionada(null);
    setDificuldade('Iniciante');
    setQuantidade(5);
    setRespostas([]);
    setTela('setup');
  }

  function abrirHistorico() {
    setTela('historico');
  }

  function voltarDoHistorico() {
    setTela('setup');
  }

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return <TelaLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <header className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">Logado como</span>
          <p className="text-base font-semibold text-gray-900">{user.username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary px-4 py-2"
        >
          Sair
        </button>
      </header>

      {tela === 'historico' ? (
        <TelaHistorico onVoltar={voltarDoHistorico} user={user ?? undefined} />
      ) : tela === 'quiz' && certSelecionada ? (
        <TelaQuiz
          certificacao={certSelecionada}
          dificuldade={dificuldade}
          quantidade={quantidade}
          onConcluir={concluirSimulado}
        />
      ) : tela === 'resultado' && certSelecionada ? (
        <TelaResultado
          respostas={respostas}
          certificacao={certSelecionada}
          dificuldade={dificuldade}
          onReiniciar={reiniciar}
        />
      ) : (
        <TelaSetup
          certSelecionada={certSelecionada}
          dificuldade={dificuldade}
          quantidade={quantidade}
          onSelecionarCert={setCertSelecionada}
          onSelectionarDificuldade={setDificuldade}
          onSelecionarQuantidade={setQuantidade}
          onIniciar={iniciarSimulado}
          onAbrirHistorico={abrirHistorico}
        />
      )}
    </div>
  );
}

