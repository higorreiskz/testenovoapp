import { UserCircle } from "lucide-react";
import type { UserSummary } from "../types";

interface UserBadgeProps {
  user: UserSummary;
}

function UserBadge({ user }: UserBadgeProps): JSX.Element {
  const initials = user.name
    .split(" ")
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      {user.profilePic ? (
        <img
          src={user.profilePic}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : initials ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/40 text-sm font-semibold">
          {initials}
        </div>
      ) : (
        <UserCircle className="h-10 w-10 text-white/60" />
      )}
      <div>
        <p className="text-sm font-semibold text-white">{user.name}</p>
        <span className="text-xs uppercase tracking-widest text-white/60">
          {user.role}
        </span>
      </div>
    </div>
  );
}

export default UserBadge;
