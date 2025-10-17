import { useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";
import type { UserRole } from "../types";

interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    cpm?: number;
    balance?: number;
  };
}

type AuthMode = "login" | "register";

function LoginPage(): JSX.Element {
  const { user, setAuth, isLoading, setLoading } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("clipper");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  const toggleMode = () => {
    setMode((current) => (current === "login" ? "register" : "login"));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email, password }
          : { name, email, password, role };

      const { data } = await api.post<AuthResponse>(endpoint, payload);
      setAuth({ token: data.token, user: data.user });
    } catch (authError: any) {
      const message =
        authError?.response?.data?.message ??
        "Não foi possível autenticar. Verifique os dados inseridos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-dark-200 via-dark-100 to-dark-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-dark-100/90 p-8 shadow-2xl shadow-primary/20 backdrop-blur">
        <div className="flex flex-col gap-2 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/20 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-primary">
            ClipZone ✂️
          </span>
          <h1 className="text-3xl font-semibold text-white">
            {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p className="text-sm text-white/60">
            Plataforma de colaboração entre criadores e clipadores
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {mode === "register" ? (
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Nome completo
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-xl border border-white/10 bg-dark-200 px-3 py-2 text-white outline-none focus:border-secondary"
                placeholder="Alex Clipador"
              />
            </label>
          ) : null}
          <label className="flex flex-col gap-2 text-sm text-white/70">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-white/10 bg-dark-200 px-3 py-2 text-white outline-none focus:border-secondary"
              placeholder="voce@clipzone.gg"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white/70">
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-white/10 bg-dark-200 px-3 py-2 text-white outline-none focus:border-secondary"
              placeholder="••••••••"
              required
            />
          </label>
          {mode === "register" ? (
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Você é?
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="rounded-xl border border-white/10 bg-dark-200 px-3 py-2 text-white outline-none focus:border-secondary"
              >
                <option value="creator">Criador</option>
                <option value="clipper">Clipador</option>
              </select>
            </label>
          ) : null}
          {error ? <div className="text-sm text-red-400">{error}</div> : null}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]"
          >
            {isLoading
              ? "Aguarde..."
              : mode === "login"
              ? "Entrar"
              : "Cadastrar"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-white/60">
          {mode === "login" ? "Ainda não tem cadastro?" : "Já possui uma conta?"}{" "}
          <button
            className="font-semibold text-secondary"
            onClick={toggleMode}
          >
            {mode === "login" ? "Crie agora" : "Faça login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
