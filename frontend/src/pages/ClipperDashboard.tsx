import { useEffect, useMemo, useState } from "react";
import ClipUploadForm from "../components/ClipUploadForm";
import DashboardLayout from "../components/DashboardLayout";
import ClipTable from "../components/ClipTable";
import StatCard from "../components/StatCard";
import api from "../services/api";
import type {
  ClipperDashboardPayload,
  UserSummary,
} from "../types";

function ClipperDashboard(): JSX.Element {
  const [dashboard, setDashboard] = useState<ClipperDashboardPayload | null>(null);
  const [creators, setCreators] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboard = async () => {
    const { data } = await api.get<ClipperDashboardPayload>(
      "/clips/clipper/dashboard"
    );
    setDashboard(data);
  };

  const fetchCreators = async () => {
    const { data } = await api.get<{ creators: UserSummary[] }>(
      "/clips/creators"
    );
    setCreators(data.creators);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchDashboard(), fetchCreators()]);
        setError(null);
      } catch (loadError: any) {
        const message =
          loadError?.response?.data?.message ??
          "Erro ao carregar dados do dashboard.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleUpload = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/clips", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchDashboard();
      setError(null);
    } catch (uploadError: any) {
      const message =
        uploadError?.response?.data?.message ??
        "Não foi possível enviar o clip. Verifique as informações.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = useMemo(
    () => [
      {
        label: "Ganhos acumulados",
        value:
          "$" + (dashboard?.summary.totalEarnings ?? 0).toFixed(2),
        helper: "Somatório após aprovação dos clips",
        accent: "accent" as const,
      },
      {
        label: "Clipes aprovados",
        value: dashboard?.summary.approvedClips ?? 0,
        helper: `${dashboard?.summary.totalClips ?? 0} enviados no total`,
        accent: "primary" as const,
      },
      {
        label: "Views geradas",
        value: (dashboard?.summary.totalViews ?? 0).toLocaleString(),
        helper: "Atualizadas pelos criadores",
        accent: "secondary" as const,
      },
    ],
    [dashboard]
  );

  return (
    <DashboardLayout
      title="Painel do Clipador"
      description="Envie novos clipes, acompanhe ganhos e descubra criadores."
    >
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
          Carregando informações...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <section className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 className="text-lg font-semibold text-white">
                Enviar novo clip
              </h2>
              <ClipUploadForm
                creators={creators}
                onSubmit={handleUpload}
                isSubmitting={isSubmitting}
              />
            </div>
            <aside className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
              <h3 className="text-base font-semibold text-white">
                Criadores disponíveis
              </h3>
              <ul className="flex flex-col divide-y divide-white/10 text-sm">
                {creators.map((creator) => (
                  <li key={creator._id} className="flex flex-col gap-1 py-3">
                    <span className="font-semibold text-white">{creator.name}</span>
                    <span className="text-xs text-white/60">
                      CPM ${creator.cpm?.toFixed(2) ?? "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-white">
              Meus clipes enviados
            </h2>
            <ClipTable clips={dashboard?.clips ?? []} />
          </section>
        </>
      )}
    </DashboardLayout>
  );
}

export default ClipperDashboard;
