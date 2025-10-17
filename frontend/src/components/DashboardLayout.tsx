import type { ReactNode } from "react";
import NavBar from "./NavBar";

interface DashboardLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

function DashboardLayout({
  title,
  description,
  actions,
  children,
}: DashboardLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-200 via-dark-100 to-dark-50">
      <NavBar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">{title}</h1>
            {description ? (
              <p className="mt-1 text-sm text-gray-300">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </header>
        <section className="flex flex-col gap-6">{children}</section>
      </main>
    </div>
  );
}

export default DashboardLayout;
