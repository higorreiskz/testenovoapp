import type { ClipSummary } from "../types";

interface ClipTableProps {
  clips: ClipSummary[];
  isCreator?: boolean;
  showClipperColumn?: boolean;
  onApprove?: (clipId: string) => void;
  onReject?: (clipId: string) => void;
}

function ClipTable({
  clips,
  isCreator,
  showClipperColumn,
  onApprove,
  onReject,
}: ClipTableProps) {
  if (!clips.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-white/50">
        Nenhum clip cadastrado até o momento.
      </div>
    );
  }

  const displayClipperColumn = isCreator || showClipperColumn;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/60">
          <tr>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Criador</th>
            {displayClipperColumn ? <th className="px-4 py-3">Clipper</th> : null}
            <th className="px-4 py-3">Views</th>
            <th className="px-4 py-3">Earnings</th>
            <th className="px-4 py-3">Status</th>
            {isCreator ? <th className="px-4 py-3 text-right">Ações</th> : null}
          </tr>
        </thead>
        <tbody>
          {clips.map((clip, index) => {
            const creatorName =
              typeof clip.creatorId === "string"
                ? "—"
                : clip.creatorId?.name ?? "—";
            const clipperName =
              typeof clip.clipperId === "string"
                ? "—"
                : clip.clipperId?.name ?? "—";

            return (
              <tr
                key={clip._id}
                className={
                  index % 2 === 0
                    ? "bg-dark-100/60"
                    : "bg-dark-100/30"
                }
              >
                <td className="px-4 py-4 font-medium text-white">{clip.title}</td>
                <td className="px-4 py-4 text-white/70">{creatorName}</td>
                {displayClipperColumn ? (
                  <td className="px-4 py-4 text-white/70">{clipperName}</td>
                ) : null}
                <td className="px-4 py-4 font-medium text-secondary">{clip.views.toLocaleString()}</td>
                <td className="px-4 py-4 text-white/70">
                  ${clip.earnings.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      clip.status === "approved"
                        ? "bg-emerald-500/15 text-emerald-200"
                        : clip.status === "rejected"
                        ? "bg-red-500/15 text-red-200"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {clip.status}
                  </span>
                </td>
                {isCreator ? (
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onApprove?.(clip._id)}
                        className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/30"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => onReject?.(clip._id)}
                        className="rounded-lg bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-500/30"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ClipTable;
