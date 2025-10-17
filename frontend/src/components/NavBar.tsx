import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import UserBadge from "./UserBadge";

function NavBar(): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="border-b border-white/5 bg-dark-200/90 backdrop-blur supports-[backdrop-filter]:bg-dark-200/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="rounded bg-primary/20 px-3 py-1 text-primary shadow-glow">
            ClipZone
          </span>
          <span className="text-secondary">✂️</span>
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <UserBadge user={user} />
            <button
              onClick={handleLogout}
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Sair
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

export default NavBar;
