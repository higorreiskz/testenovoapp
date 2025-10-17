import DashboardLayout from "../components/DashboardLayout";

function AdminPanel(): JSX.Element {
  return (
    <DashboardLayout
      title="Administração"
      description="Monitore contas, pagamentos e moderação em toda a plataforma."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Resumo geral</h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-white/70">
            <li>• Usuários ativos (últimos 30 dias)</li>
            <li>• Pagamentos pendentes</li>
            <li>• Clipes aguardando moderação</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Próximos passos</h2>
          <p className="mt-3 text-sm text-white/60">
            Configure integrações com provedores de pagamento e monitore alertas
            de conteúdo sensível. Esta tela serve como base para expansões
            futuras da equipe de operação.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminPanel;
