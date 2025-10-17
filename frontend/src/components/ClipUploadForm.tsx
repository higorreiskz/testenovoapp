import { useEffect, useState } from "react";
import type { UserSummary } from "../types";

interface ClipUploadFormProps {
  creators: UserSummary[];
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

function ClipUploadForm({ creators, onSubmit, isSubmitting }: ClipUploadFormProps) {
  const [title, setTitle] = useState("");
  const [creatorId, setCreatorId] = useState(creators[0]?._id ?? "");
  const [views, setViews] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [clipFile, setClipFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!creatorId && creators.length > 0) {
      setCreatorId(creators[0]._id);
    }
  }, [creatorId, creators]);

  const resetForm = () => {
    setTitle("");
    setViews(0);
    setVideoUrl("");
    setClipFile(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!creatorId) {
      setError("Selecione um criador");
      return;
    }

    if (!title) {
      setError("Informe um título para o clip");
      return;
    }

    const payload = new FormData();
    payload.append("creatorId", creatorId);
    payload.append("title", title);
    payload.append("views", String(views ?? 0));
    if (videoUrl) {
      payload.append("videoUrl", videoUrl);
    }
    if (clipFile) {
      payload.append("clip", clipFile);
    }

    try {
      setError(null);
      setSuccess(null);
      await onSubmit(payload);
      setSuccess("Clip enviado com sucesso! Aguardando aprovação do criador.");
      resetForm();
    } catch (submitError) {
      console.error(submitError);
      setSuccess(null);
      setError("Não foi possível enviar o clip. Tente novamente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/80">Selecionar criador</span>
          <select
            value={creatorId}
            onChange={(event) => setCreatorId(event.target.value)}
            className="rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm outline-none focus:border-secondary"
          >
            {creators.length ? (
              creators.map((creator) => (
                <option key={creator._id} value={creator._id}>
                  {creator.name} · CPM ${creator.cpm ?? 0}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Nenhum criador disponível no momento
              </option>
            )}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/80">Título do clip</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Highlights da live..."
            className="rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm outline-none focus:border-secondary"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/80">Views estimadas</span>
          <input
            type="number"
            value={views}
            min={0}
            onChange={(event) => setViews(Number(event.target.value))}
            className="rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm outline-none focus:border-secondary"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/80">Link do vídeo (opcional)</span>
          <input
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder="https://..."
            className="rounded-lg border border-white/10 bg-dark-100 px-3 py-2 text-sm outline-none focus:border-secondary"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-white/80">Upload do arquivo (alternativo)</span>
        <input
          type="file"
          accept="video/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setClipFile(file ?? null);
          }}
          className="cursor-pointer rounded-lg border border-dashed border-white/20 bg-dark-100 px-3 py-3 text-sm outline-none focus:border-secondary"
        />
        <span className="text-xs text-white/50">
          O arquivo é opcional. Caso não envie, informe uma URL válida.
        </span>
      </label>
      {error ? <div className="text-sm text-red-400">{error}</div> : null}
      {success ? <div className="text-sm text-secondary">{success}</div> : null}
      <button
        type="submit"
        disabled={isSubmitting || !creatorId}
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar clip"}
      </button>
    </form>
  );
}

export default ClipUploadForm;
