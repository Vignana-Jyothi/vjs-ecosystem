import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UserRole } from "../data/network";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { api } from "../data/api";

declare global {
  interface Window {
    google: any;
  }
}

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface LoginPageProps {
  user?: { id: number; fullName?: string; name?: string; email: string; role: UserRole } | null;
  onLogin: (user: { id: number; name: string; email: string; role: UserRole }, token?: string) => void;
}

function getRedirectPath(role: UserRole, email?: string) {
  const normalizedEmail = (email || "").toLowerCase();

  // Special rule for @vnrvjiet.in logins
  if (normalizedEmail.endsWith("@vnrvjiet.in")) {
    if (role === "Admin") return "/admin";
    if (role === "Founder") return "/founder";
    if (normalizedEmail.startsWith("volunteer") || role === "Volunteer") return "/volunteer";
    return "/student";
  }

  switch (role) {
    case "Student":
      return "/student";
    case "Mentor":
      return "/leads";
    case "Founder":
      return "/founder";
    case "Volunteer":
      return "/volunteer";
    case "Admin":
      return "/admin";
    default:
      return "/student";
  }
}

function loadGoogleScript(callback: () => void) {
  if (window.google && window.google.accounts) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = () => callback();
  document.head.appendChild(script);
}

export function LoginPage({ user, onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const target = getRedirectPath(user.role, user.email);
      navigate(target, { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let active = true;
    async function initGoogleSignIn() {
      try {
        let clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
        try {
          const res = await api.get("/api/config");
          if (res.data && res.data.googleClientId) {
            clientId = res.data.googleClientId;
          }
        } catch (e) {
          console.log("Could not load dynamic Google Client ID from backend config, using env/fallback");
        }

        if (!clientId || clientId === "your-google-client-id" || clientId === "dummy-client-id") {
          console.warn("No valid Google Client ID found. Google sign-in will stay disabled until a real client ID is configured.");
          return;
        }

        if (!active) return;

        loadGoogleScript(() => {
          if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleCredentialResponse,
            });
            const targetEl = document.getElementById("google-signin-button");
            if (targetEl) {
              window.google.accounts.id.renderButton(
                targetEl,
                {
                  theme: "outline",
                  size: "large",
                  width: "100%",
                  text: "signin_with",
                }
              );
            }
          }
        });
      } catch (err) {
        console.error("Error setting up Google Sign-in:", err);
      }
    }
    initGoogleSignIn();
    return () => {
      active = false;
    };
  }, []);

  async function handleGoogleCredentialResponse(googleResponse: any) {
    const credential = googleResponse.credential;
    if (!credential) return;

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/google", {
        token: credential,
        idToken: credential,
        credential: credential,
      });

      const userPayload = response.data.user || response.data;
      const token = response.data.token || response.data.jwt;

      if (!userPayload || !userPayload.email) {
        throw new Error("Invalid response payload from authentication server");
      }

      console.log("Google logged in successfully:", userPayload);
      onLogin(userPayload, token);
      navigate(getRedirectPath(userPayload.role, userPayload.email));
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Google authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    setLoading(true);

    try {
      const response = await api.post("/api/login", { email, password });

      const data = response.data;
      console.log("Logged in successfully:", data.user);
      onLogin(data.user, data.token);
      navigate(getRedirectPath(data.user.role, data.user.email));
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "Something went wrong. Please check your server connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-8 px-4 py-12">
      <div className="space-y-4 text-center text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-[#3B82F6]/80">Secure Login Gate</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Access VJ STARTUPS LAUNCHPAD</h1>
      </div>

      <Card className="rounded-[24px] border border-[#1F2937] bg-[#111111] p-8 shadow-2xl">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
                <p className="font-semibold">Login Blocked</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-white">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-[#1F2937] bg-[#0A0A0A] text-white focus:border-[#3B82F6] rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-[#1F2937] bg-[#0A0A0A] text-white focus:border-[#3B82F6] rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition duration-200"
            >
              {loading ? "Verifying..." : "Continue to Dashboard"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1F2937]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111111] px-2 text-[#9CA3AF]">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-in Button */}
          <div id="google-signin-button" className="w-full min-h-[44px] flex justify-center"></div>
        </CardContent>
      </Card>

      {/* Fix 17 — Legal Footer */}
      <div className="text-center text-xs text-[#4B5563] mt-4 space-x-3">
        <a href="/privacy" className="hover:text-[#9CA3AF] transition-colors">Privacy Policy</a>
        <span>·</span>
        <a href="/terms" className="hover:text-[#9CA3AF] transition-colors">Terms of Service</a>
        <span>·</span>
        <span>© {new Date().getFullYear()} VJ Startups</span>
      </div>
    </div>
  );
}
