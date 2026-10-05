import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ShieldAlert, LogIn, ArrowRight } from "lucide-react";
import { UserRole } from "../data/network";
import { RoleBadge } from "./RoleBadge";

interface ProtectedRouteProps {
  user: { id: number; fullName: string; email: string; role: UserRole } | null;
  allowedRoles: UserRole[];
  requiredRoleLabel: string;
  children: React.ReactNode;
  onLogout: () => void;
}

export function ProtectedRoute({
  user,
  allowedRoles,
  requiredRoleLabel,
  children,
  onLogout
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  // 1. Not logged in: Require login
  if (!user) {
    return (
      <div className="mx-auto max-w-xl py-12 px-4">
        <Card className="rounded-2xl border border-[#1F2937] bg-[#111111] p-8 text-center text-white shadow-2xl">
          <CardContent className="space-y-6 p-0">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-[#3B82F6]">
              <LogIn className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#3B82F6] font-semibold">
                Authentication Required
              </span>
              <h2 className="text-2xl font-bold text-white">Login Required</h2>
              <p className="text-sm text-[#9CA3AF]">
                You must be logged in as a <span className="text-white font-medium">{requiredRoleLabel}</span> to access this page.
              </p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="w-full max-w-xs bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold h-11 rounded-xl mx-auto"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. Logged in, but wrong role: Strict access block
  if (!allowedRoles.includes(user.role)) {
    const userDashboardPath =
      user.role === "Student" ? "/student" :
      user.role === "Mentor" ? "/leads" :
      user.role === "Volunteer" ? "/volunteer" :
      user.role === "Admin" ? "/admin" :
      "/founder";

    return (
      <div className="mx-auto max-w-xl py-12 px-4">
        <Card className="rounded-2xl border border-red-900/40 bg-[#111111] p-8 text-center text-white shadow-2xl">
          <CardContent className="space-y-6 p-0">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-red-400 font-semibold">
                Access Restricted
              </span>
              <h2 className="text-2xl font-bold text-white">Role Permission Required</h2>
              <p className="text-sm text-[#9CA3AF]">
                This page is exclusively reserved for <span className="text-white font-semibold">{requiredRoleLabel}</span> accounts.
              </p>
            </div>

            <div className="rounded-xl border border-[#1F2937] bg-[#161616] p-4 text-left flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9CA3AF]">Currently logged in as:</p>
                <p className="text-sm font-semibold text-white mt-0.5">{user.fullName}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  onLogout();
                  navigate("/login");
                }}
                className="border-[#1F2937] text-white hover:bg-[#1F2937] h-10 rounded-xl"
              >
                Log in with {requiredRoleLabel} Account
              </Button>
              <Button
                onClick={() => navigate(userDashboardPath)}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white h-10 rounded-xl flex items-center justify-center gap-2"
              >
                <span>Go to {user.role} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. User is authorized
  return <>{children}</>;
}
