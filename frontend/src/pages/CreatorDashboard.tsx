import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ClipTable from "../components/ClipTable";
import StatCard from "../components/StatCard";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";
import type { CreatorDashboardPayload } from "../types";

function CreatorDashboard(): JSX.Element {
  const { user, updateUser } = useAuthStore();
  const [dashboard, setDashboard] = useState<CreatorDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cpmInput, setCpmInput] = useState<number>(user?.cpm ?? 5);
  const [isUpdatingCPM, setIsUpdatingCPM] = useState(false);

  const summary = dashboard?.summary;

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<CreatorDashboardPayload>("/creator/dashboard");
      setDashboard(data);
      if (data.summary.currentCPM !== undefined) {
        setCpmInput(data.summary.currentCPM);
        updateUser({ cpm: data.summary.currentCPM });
      }
    } catch (loadError: any) {
      const message =
        loadError?.response?.data?.message ??
        "Erro ao carregar dados do dashboard.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModeration = async (clipId: string, status: "approved" | "rejected") => {
    try {
      await api.patch(`/clips/${clipId}/status`, { status });
      await loadDashboard();
    } catch (moderationError: any) {
      const message =
        moderationError?.response?.data?.message ??
        "Não foi possível atualizar o status do clip.";
      setError(message);
    }
  };

  const handleCPMUpdate = async () => {
    if (!Number.isFinite(cpmInput) || cpmInput <= 0) {
      setError("Informe um CPM válido.");
      return;
    }

    setIsUpdatingCPM(true);
    try {
      await api.post("/creator/cpm", { cpm: cpmInput });
      await loadDashboard();
    } catch (updateError: any) {
      const message =
        updateError?.response?.data?.message ??
        "Não foi possível atualizar o CPM.";
      setError(message);
    } finally {
      setIsUpdatingCPM(false);
    }
  };

  const topStats = useMemo(() => {
    const totalClips = summary?.totalClips ?? 0;
    const approvedClips = summary?.approvedClips ?? 0;
    const totalViews = summary?.totalViews ?? 0;
    const totalEarnings = summary?.totalEarnings ?? 0;

    return [
      {
        label: "Clipes recebidos",
        value: totalClips,
        helper: `${approvedClips} aprovados`,
        accent: "primary" as const,
      },
      {
        label: "Visualizações totais",
        value: totalViews.toLocaleString(),
        helper: "Soma das views em todos os clipes",
        accent: "secondary" as const,
      },
      {
        label: "Ganhos estimados",
        value: "$" + totalEarnings.toFixed(2),
        helper: "Baseado em CPM e views reportadas",
        accent: "accent" as const,
      },
    ];
  }, [summary]);

  return (
    <DashboardLayout
      title="Painel do Criador"
      description="Gerencie seus clipadores, aprove clips e acompanhe resultados."
      actions={
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
          <div className="flex flex-col text-xs">
            <span className="text-white/60">CPM vigente</span>
            <strong className="text-lg text-white">
              ${summary?.currentCPM?.toFixed(2) ?? "—"}
            </strong>
          </div>
          <input
            type="number"
            value={cpmInput}
            onChange={(event) => setCpmInput(Number(event.target.value))}
            className="w-24 rounded-lg border border-white/10 bg-dark-100 px-2 py-2 text-xs"
          />
          <button
            onClick={handleCPMUpdate}
            disabled={isUpdatingCPM}
            className="rounded-lg bg-secondary/20 px-4 py-2 text-xs font-semibold text-secondary transition hover:bg-secondary/30"
          >
            {isUpdatingCPM ? "Atualizando..." : "Atualizar CPM"}
          </button>
        </div>
      }
    >
      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60">
          Carregando métricas...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {topStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">
              Clipadores em destaque
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(dashboard?.clipperStats ?? []).map((clipper) => (
                <div
                  key={clipper.clipperId}
                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-dark-100/70 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      {clipper.name}
                    </span>
                    <span className="text-xs text-white/50">
                      {clipper.clips} clipes
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{clipper.totalViews.toLocaleString()} views</span>
                    <span>${clipper.totalEarnings.toFixed(2)}</span>
                  </div>
                  {clipper.portfolioUrl ? (
                    <a
                      href={clipper.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-secondary"
                    >
                      Ver portfólio
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-white">
              Clipes enviados
            </h2>
            <ClipTable
              clips={dashboard?.clips ?? []}
              isCreator
              onApprove={(clipId) => handleModeration(clipId, "approved")}
              onReject={(clipId) => handleModeration(clipId, "rejected")}
            />
          </section>
        </>
      )}
    </DashboardLayout>
  );
}

export default CreatorDashboard;
