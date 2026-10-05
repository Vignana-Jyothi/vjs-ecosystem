import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { TopNav } from "./components/TopNav";
import { LandingPage } from "./pages/LandingPage";
import { SubmitLeadPage } from "./pages/SubmitLeadPage";
import { SearchPage } from "./pages/SearchPage";
import { VolunteerPage } from "./pages/VolunteerPage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { StudentPage } from "./pages/StudentPage";
import { LeadsPage } from "./pages/LeadsPage";
import { FounderPage } from "./pages/FounderPage";
import { Toast } from "./components/Toast";
import { UserRole } from "./data/network";
import { api } from "./data/api";
import MentorPage from "./pages/MentorPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

type AppUser = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole | "Mentor";
  profileCompleted?: boolean;
  hasSeenWelcome?: boolean;
  hasLinkedAccount?: boolean;
};

function ProtectedRoute({
  user,
  authLoading,
  children,
}: {
  user: AppUser | null;
  authLoading: boolean;
  children: JSX.Element;
}) {
  if (authLoading && !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1D9E75] border-t-transparent"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ── Page Title Setter ──────────────────────────────────────────────────────────
function PageTitleSetter({ user }: { user: AppUser | null }) {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path === "/login") {
      document.title = "VJ Startups — Sign In";
    } else if (path === "/founder") {
      document.title = "VJ Startups — Founder Dashboard";
    } else if (path === "/volunteer") {
      document.title = "VJ Startups — Volunteer Panel";
    } else if (path === "/admin") {
      document.title = "VJ Startups — Admin Dashboard";
    } else if (path === "/mentor" || path === "/leads") {
      document.title = "VJ Startups — Mentor Dashboard";
    } else if (path === "/student" || path === "/submit-lead") {
      document.title = "VJ Startups — Student Portal";
    } else if (path === "/privacy") {
      document.title = "VJ Startups — Privacy Policy";
    } else if (path === "/terms") {
      document.title = "VJ Startups — Terms of Service";
    } else {
      document.title = "VJ Startups — Startup Support Ecosystem";
    }
  }, [location, user]);
  return null;
}

function ProfileCompletionModal({ onComplete, onLogout }: { onComplete: (phone: string, year: string, branch: string) => Promise<void>; onLogout: () => void }) {
  const [phone, setPhone] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !year || !branch) {
      setError("Please fill in all fields.");
      return;
    }
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onComplete(phone, year, branch);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Your session has expired. Please click 'Log Out' below and log in again.");
      } else {
        setError(err.response?.data?.error || err.message || "Failed to complete profile. Please try again.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-md rounded-lg bg-[#121212] p-8 shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold text-white text-center">Complete Your Profile</h2>
        <p className="mt-2 text-sm text-[#9CA3AF] text-center mb-6">
          Please provide your details so we can connect you with the right people.
        </p>

        {error && (
          <div className="mb-4 rounded bg-red-500/20 p-3 text-sm text-red-400 border border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full rounded bg-[#1F1F1F] border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. +91 98765 43210"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Year of Study</label>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full rounded bg-[#1F1F1F] border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Branch</label>
            <select
              value={branch}
              onChange={e => setBranch(e.target.value)}
              className="w-full rounded bg-[#1F1F1F] border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="" disabled>Select Branch</option>
              <optgroup label="CSE &amp; IT" className="bg-[#1F1F1F] text-emerald-400 font-bold">
                <option value="Computer Science &amp; Engineering (CSE and CSBS)" className="text-white font-normal">Computer Science &amp; Engineering (CSE and CSBS)</option>
                <option value="CSE (AI &amp; ML) &amp; IoT and R&amp;AI" className="text-white font-normal">CSE (AI &amp; ML) &amp; IoT and R&amp;AI</option>
                <option value="CSE-(CyS,DS) and AI&amp;DS" className="text-white font-normal">CSE-(CyS,DS) and AI&amp;DS</option>
                <option value="Information Technology" className="text-white font-normal">Information Technology</option>
              </optgroup>
              <optgroup label="Engineering" className="bg-[#1F1F1F] text-emerald-400 font-bold">
                <option value="Automobile Engineering" className="text-white font-normal">Automobile Engineering</option>
                <option value="Biotechnology" className="text-white font-normal">Biotechnology</option>
                <option value="Civil Engineering" className="text-white font-normal">Civil Engineering</option>
                <option value="Electrical &amp; Electronics Engineering" className="text-white font-normal">Electrical &amp; Electronics Engineering</option>
                <option value="Electronics and Communication Engineering (ECE)" className="text-white font-normal">Electronics and Communication Engineering (ECE)</option>
                <option value="Electronics and Instrumentation Engineering" className="text-white font-normal">Electronics and Instrumentation Engineering</option>
                <option value="Mechanical Engineering" className="text-white font-normal">Mechanical Engineering</option>
              </optgroup>
              <optgroup label="Other Disciplines" className="bg-[#1F1F1F] text-emerald-400 font-bold">
                <option value="Sciences &amp; Humanities" className="text-white font-normal">Sciences &amp; Humanities</option>
                <option value="Other" className="text-white font-normal">Other</option>
              </optgroup>
            </select>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={onLogout}
              className="w-1/3 rounded border border-white/20 bg-transparent px-4 py-2.5 font-semibold text-white hover:bg-white/10 transition text-sm"
            >
              Log Out
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 rounded bg-emerald-600 px-4 py-2.5 font-bold text-white hover:bg-emerald-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const RocketAnimation = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #0A0A0A 0%, #0F172A 50%, #0A2A1A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
    }}>
      <style>{`
        @keyframes rocketFly {
          0% { transform: translateY(120px) scale(0.8); opacity: 0; }
          20% { opacity: 1; transform: translateY(60px) scale(0.9); }
          60% { transform: translateY(-20px) scale(1.05); }
          80% { transform: translateY(-60px) scale(1); }
          100% { transform: translateY(-140px) scale(0.9); opacity: 0.7; }
        }
        @keyframes flameFlicker {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; }
          50% { transform: scaleY(1.3) scaleX(0.85); opacity: 0.8; }
        }
        @keyframes textFadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: Math.random() * 3 + 1 + 'px',
          height: Math.random() * 3 + 1 + 'px',
          borderRadius: '50%',
          background: 'white',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          animation: `starTwinkle ${Math.random() * 2 + 1}s ease-in-out infinite`,
          animationDelay: Math.random() * 2 + 's'
        }} />
      ))}

      <div style={{ animation: 'rocketFly 3s ease-in-out forwards', position: 'relative' }}>
        <svg width="80" height="140" viewBox="0 0 80 140" fill="none">
          <ellipse cx="40" cy="55" rx="22" ry="45" fill="url(#bodyGrad)"/>
          <ellipse cx="40" cy="20" rx="14" ry="20" fill="url(#noseGrad)"/>
          <circle cx="40" cy="52" r="10" fill="url(#windowGrad)" stroke="#1D9E75" strokeWidth="2"/>
          <circle cx="40" cy="52" r="6" fill="#0EA5E9" opacity="0.8"/>
          <polygon points="18,80 5,105 18,95" fill="url(#finGrad)"/>
          <polygon points="62,80 75,105 62,95" fill="url(#finGrad)"/>
          <ellipse cx="40" cy="100" rx="8" ry="4" fill="#374151"/>
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E2E8F0"/>
              <stop offset="50%" stopColor="#F8FAFC"/>
              <stop offset="100%" stopColor="#CBD5E1"/>
            </linearGradient>
            <linearGradient id="noseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D9E75"/>
              <stop offset="100%" stopColor="#157A5C"/>
            </linearGradient>
            <radialGradient id="windowGrad">
              <stop offset="0%" stopColor="#BAE6FD"/>
              <stop offset="100%" stopColor="#0369A1"/>
            </radialGradient>
            <linearGradient id="finGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1D9E75"/>
              <stop offset="100%" stopColor="#0F6E56"/>
            </linearGradient>
          </defs>
        </svg>

        <div style={{
          position: 'absolute', bottom: '-40px', left: '50%',
          transform: 'translateX(-50%)',
          animation: 'flameFlicker 0.15s ease-in-out infinite'
        }}>
          <svg width="30" height="50" viewBox="0 0 30 50">
            <ellipse cx="15" cy="15" rx="10" ry="15" fill="url(#flame1)"/>
            <ellipse cx="15" cy="25" rx="6" ry="12" fill="url(#flame2)"/>
            <defs>
              <radialGradient id="flame1">
                <stop offset="0%" stopColor="#FFF7ED"/>
                <stop offset="40%" stopColor="#FB923C"/>
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="flame2">
                <stop offset="0%" stopColor="#FEFCE8"/>
                <stop offset="100%" stopColor="#FACC15" stopOpacity="0"/>
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center', animation: 'textFadeIn 1s ease-out 0.5s both' }}>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0', letterSpacing: '0.05em' }}>
          VJ Startups
        </h1>
        <p style={{ color: '#1D9E75', fontSize: '16px', margin: 0, letterSpacing: '0.1em' }}>
          STARTUP SUPPORT ECOSYSTEM
        </p>
        <p style={{ color: '#64748B', fontSize: '13px', margin: '8px 0 0 0' }}>
          VJ College
        </p>
      </div>
    </div>
  );
};

const AccountLinkingModal = ({
  lead,
  onConfirm,
  onDeny
}: {
  lead: any,
  onConfirm: () => void,
  onDeny: () => void
}) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9998,
    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
  }}>
    <div style={{
      background: '#111111', border: '1px solid #1F2937',
      borderRadius: '24px', padding: '32px', maxWidth: '480px', width: '100%'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1D9E75, #157A5C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: '28px'
        }}>👋</div>
        <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          We found your profile!
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
          It looks like <strong style={{ color: '#1D9E75' }}>{lead.sourcer?.name}</strong> from
          VJ College added you to our platform as a mentor in the
          <strong style={{ color: 'white' }}> {lead.domain}</strong> domain.
          Is this you?
        </p>
      </div>

      <div style={{
        background: '#0A0A0A', border: '1px solid #1F2937',
        borderRadius: '12px', padding: '16px', marginBottom: '24px'
      }}>
        <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your profile details</p>
        <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px 0' }}><strong>Name:</strong> {lead.name}</p>
        <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px 0' }}><strong>Organisation:</strong> {lead.organization}</p>
        <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px 0' }}><strong>Domain:</strong> {lead.domain}</p>
        <p style={{ color: '#9CA3AF', fontSize: '13px', margin: '8px 0 0 0' }}>Referred by: {lead.sourcer?.name}</p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onConfirm} style={{
          flex: 1, background: 'linear-gradient(135deg, #1D9E75, #157A5C)',
          color: 'white', border: 'none', borderRadius: '12px',
          padding: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          Yes, that is me
        </button>
        <button onClick={onDeny} style={{
          flex: 1, background: 'transparent', color: '#9CA3AF',
          border: '1px solid #1F2937', borderRadius: '12px',
          padding: '12px', fontSize: '14px', cursor: 'pointer'
        }}>
          No, that is not me
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  // Synchronously restore user from localStorage on initialization
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem("vjse_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState<boolean>(() => {
    return !localStorage.getItem("vjse_user");
  });
  const [toastMessage, setToastMessage] = useState("");
  const [showRocket, setShowRocket] = useState(false);
  const [showLinkingModal, setShowLinkingModal] = useState(false);
  const [matchedLead, setMatchedLead] = useState<any>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // 5-Reload Limit Guard
  useEffect(() => {
    const savedUser = localStorage.getItem("vjse_user");
    if (!savedUser) {
      sessionStorage.removeItem("vjse_reload_count");
      return;
    }

    const MAX_RELOAD_LIMIT = 5;
    const currentCount = parseInt(sessionStorage.getItem("vjse_reload_count") || "0", 10) + 1;
    sessionStorage.setItem("vjse_reload_count", currentCount.toString());

    if (currentCount >= MAX_RELOAD_LIMIT) {
      sessionStorage.removeItem("vjse_reload_count");
      handleLogout();
      toast.error("Session ended: Reload limit reached (5 reloads). Please sign in again.");
    }
  }, []);

  // Restore authenticated session on mount from server
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const response = await api.get("/check-auth");
        const userPayload = response.data.user || response.data;
        if (userPayload && userPayload.email) {
          const freshUser: AppUser = {
            id: userPayload.id || 1,
            fullName: userPayload.fullName || userPayload.name || "VJ User",
            email: userPayload.email,
            role: userPayload.role || "Student",
            profileCompleted: Boolean(userPayload.profileCompleted),
            hasSeenWelcome: userPayload.hasSeenWelcome,
            hasLinkedAccount: userPayload.hasLinkedAccount,
          };
          setUser(freshUser);
          localStorage.setItem("vjse_user", JSON.stringify(freshUser));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("vjse_user");
          sessionStorage.removeItem("vjse_reload_count");
          setUser(null);
        }
      } catch (err) {
        console.log("No active session found:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("vjse_user");
        sessionStorage.removeItem("vjse_reload_count");
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuthSession();
  }, []);

  useEffect(() => {
    if (user && user.role === 'Mentor') {
      if (!user.hasSeenWelcome) {
        setShowRocket(true);
      }

      const checkMatch = async () => {
        try {
          const matchRes = await api.get('/api/users/check-mentor-match');
          const matchData = matchRes.data;
          if (matchData.matched && !user.hasLinkedAccount) {
            setMatchedLead(matchData.lead);
            setShowLinkingModal(true);
          }
        } catch (err) {
          console.error("Match check failed", err);
        }
      };
      checkMatch();
    }
  }, [user]);

  // Fix 21 — Session timeout: warn at 23h, auto-logout at 24h
  useEffect(() => {
    if (!user) return;
    const warningTimer = setTimeout(() => {
      toast('Your session will expire in 1 hour. Click to refresh.', {
        duration: 30000,
        action: {
          label: 'Stay logged in',
          onClick: () => api.get('/check-auth').catch(() => {})
        }
      });
    }, 23 * 60 * 60 * 1000);
    const logoutTimer = setTimeout(() => {
      handleLogout();
    }, 24 * 60 * 60 * 1000);
    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [user]);

  function handleLogin(
    loginData: UserRole | { id: number; name: string; email: string; role: UserRole },
    token?: string
  ) {
    sessionStorage.setItem("vjse_reload_count", "0");
    if (token) {
      localStorage.setItem("token", token);
    }
    let newUser: AppUser;
    if (typeof loginData === "string") {
      newUser = {
        id: loginData === "Student" ? 1 : loginData === "Founder" ? 3 : 2,
        fullName: `Demo ${loginData}`,
        email: `${loginData.toLowerCase()}@vnrvjiet.in`,
        role: loginData,
        profileCompleted: true,
      };
    } else {
      newUser = {
        id: loginData.id,
        fullName: (loginData as any).fullName || loginData.name || "VJ User",
        email: loginData.email,
        role: loginData.role,
        profileCompleted: Boolean((loginData as any).profileCompleted),
      };
    }
    setUser(newUser);
    localStorage.setItem("vjse_user", JSON.stringify(newUser));
  }

  async function handleLogout() {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("vjse_user");
      sessionStorage.removeItem("vjse_reload_count");
      setUser(null);
    }
  }

  function handleSubmitSuccess() {
    setToastMessage("Your lead has been submitted successfully.");
  }

  async function handleProfileComplete(phone: string, year: string, branch: string) {
    const res = await api.post("/api/users/complete-profile", { phone, year, branch });
    if (res.data && res.data.user) {
      const u = res.data.user;
      const updatedUser: AppUser = {
        id: u.id,
        fullName: u.name || u.fullName,
        email: u.email,
        role: u.role,
        profileCompleted: u.profileCompleted
      };
      setUser(updatedUser);
      localStorage.setItem("vjse_user", JSON.stringify(updatedUser));
    } else {
      throw new Error("Invalid response from server");
    }
  }

  const handleRocketComplete = async () => {
    setShowRocket(false);
    try {
      await api.post('/api/users/mark-welcome-seen');
      if (user) {
        const updated = { ...user, hasSeenWelcome: true };
        setUser(updated);
        localStorage.setItem("vjse_user", JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLinkConfirm = async () => {
    try {
      await api.post('/api/users/link-mentor-account', { leadId: matchedLead.id, confirmed: true });
      setShowLinkingModal(false);
      setShowRocket(true);
      if (user) {
        const updated = { ...user, hasLinkedAccount: true };
        setUser(updated);
        localStorage.setItem("vjse_user", JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLinkDeny = () => {
    setShowLinkingModal(false);
  };

  return (
    <BrowserRouter>
      <div className="dark min-h-screen bg-[#0A0A0A] text-white">
        {/* Sonner Toaster */}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              border: '1px solid #1F2937',
              color: 'white',
            },
          }}
        />
        <PageTitleSetter user={user} />
        {showRocket && <RocketAnimation onComplete={handleRocketComplete} />}
        {showLinkingModal && matchedLead && (
          <AccountLinkingModal
            lead={matchedLead}
            onConfirm={handleLinkConfirm}
            onDeny={handleLinkDeny}
          />
        )}
        <TopNav user={user} onLogout={handleLogout} />
        <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate replace to="/network" />} />
            <Route path="/network" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage user={user} onLogin={handleLogin} />} />
            <Route
              path="/student"
              element={<ProtectedRoute user={user} authLoading={authLoading}><StudentPage user={user} onLogin={() => handleLogin("Student")} onSubmit={handleSubmitSuccess} /></ProtectedRoute>}
            />
            <Route
              path="/submit-lead"
              element={<ProtectedRoute user={user} authLoading={authLoading}><SubmitLeadPage user={user} onLogin={() => handleLogin("Student")} onSubmit={handleSubmitSuccess} /></ProtectedRoute>}
            />
            <Route
              path="/leads"
              element={<ProtectedRoute user={user} authLoading={authLoading}><LeadsPage user={user} onLogin={() => handleLogin("Mentor")} /></ProtectedRoute>}
            />
            <Route path="/search" element={<ProtectedRoute user={user} authLoading={authLoading}><SearchPage user={user} onLogin={() => handleLogin("Founder")} /></ProtectedRoute>} />
            <Route path="/founder" element={<ProtectedRoute user={user} authLoading={authLoading}><FounderPage user={user} onLogin={() => handleLogin("Founder")} /></ProtectedRoute>} />
            <Route path="/volunteer" element={<ProtectedRoute user={user} authLoading={authLoading}><VolunteerPage user={user} onLogin={() => handleLogin("Volunteer")} /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute user={user} authLoading={authLoading}><AdminPage user={user} onLogin={() => handleLogin("Admin")} onUserRefresh={setUser} /></ProtectedRoute>} />
            <Route path="/mentor" element={<ProtectedRoute user={user} authLoading={authLoading}><MentorPage user={user} onLogout={handleLogout} /></ProtectedRoute>} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {toastMessage ? <Toast message={toastMessage} /> : null}

        {user && user.profileCompleted === false && user.role === 'Student' && (
          <ProfileCompletionModal onComplete={handleProfileComplete} onLogout={handleLogout} />
        )}
      </div>
    </BrowserRouter>
  );
}
