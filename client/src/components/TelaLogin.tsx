import { useState } from "react";
import type { User } from "../types";
import { login, register } from "../services/api";

interface Props {
  onLoginSuccess: (user: User, token: string) => void;
}

export default function TelaLogin({ onLoginSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = isRegister
        ? await register(username, password)
        : await login(username, password);

      onLoginSuccess(result.user, result.token);
    } catch (err) {
      function friendlyMessage(e: unknown) {
        if (e instanceof Error) {
          const m = e.message;
          if (m.includes('Usuário já existe')) return 'Esse usuário já existe. Escolha outro nome.';
          if (m.includes('Usuário ou senha inválidos')) return 'Usuário ou senha incorretos.';
          if (m.includes('Token') || m.includes('401')) return 'Falha de autenticação. Faça login novamente.';
          if (m.startsWith('Erro')) return 'Erro no servidor. Tente novamente mais tarde.';
          return m;
        }
        return 'Erro desconhecido ao autenticar.';
      }

      setError(friendlyMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {isRegister ? "Criar conta" : "Entrar"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isRegister
            ? "Cadastre-se para salvar seu histórico e acessar seu simulado." 
            : "Faça login para acessar seu simulado e histórico."}
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Usuário
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {loading ? "Carregando..." : isRegister ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
          }}
          className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          {isRegister ? "Já tenho conta" : "Criar nova conta"}
        </button>
      </div>
    </div>
  );
}
