import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { RoleBadge } from "./RoleBadge";
import { UserRole } from "../data/network";

const navLinks = [
  { label: "Problems", to: "/network" },
  { label: "Ideas", to: "/network" },
  { label: "Network", to: "/network" },
  { label: "Programs", to: "/network" },
  { label: "Club", to: "/network" },
];

interface TopNavProps {
  user: { fullName: string; role: UserRole } | null;
  onLogout: () => void;
}

export function TopNav({ user, onLogout }: TopNavProps) {
  const navigate = useNavigate();
  return (
    <header className="border-b border-[#1F2937] bg-[#0A0A0A]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/network" className="flex items-center gap-3 text-sm font-semibold text-white">
          <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-[#111111] border border-[#1F2937] p-1 overflow-hidden">
            <img src="/vj-logo.png" alt="VJ Startups Launchpad Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-white">VJ STARTUPS LAUNCHPAD</span>
            <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">VJ STARTUPS ECOSYSTEM</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2.5 text-lg font-bold tracking-wide text-white">
          <img src="/vj-logo.png" alt="VJ Startups Launchpad Logo" className="h-6 w-6 object-contain" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            VJ STARTUPS LAUNCHPAD
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 rounded-full border border-[#1F2937] bg-[#111111] px-3 py-2 text-sm text-[#E5E7EB] shadow-sm">
              <Avatar className="bg-[#1F2937] text-white">
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col text-left sm:flex">
                <span className="font-semibold text-white">{user.fullName}</span>
                <RoleBadge role={user.role} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onLogout();
                  navigate("/login");
                }}
                className="hidden sm:inline-flex"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/login")}
              className="bg-[#3B82F6] text-white hover:bg-[#1D4ED8]"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
