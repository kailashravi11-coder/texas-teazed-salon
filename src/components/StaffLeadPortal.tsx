import { useState, useEffect, useMemo } from "react";
import { 
  Lock, 
  Unlock, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Download, 
  Search, 
  ArrowLeft, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  Sparkles,
  ExternalLink,
  User,
  Scissors,
  FileText,
  LogOut,
  KeyRound,
  Shield,
  X
} from "lucide-react";
import { LeadItem } from "./SalonLeadCalendar";

// Realistic seed data including Rambo's booking and recent Texas Teazed inquiries
function getInitialSeedLeads(): LeadItem[] {
  const now = new Date();
  
  const createLead = (daysAgo: number, hoursAgo: number, name: string, phone: string, email: string, service: string, msg: string, status: "new" | "contacted" | "scheduled"): LeadItem => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(now.getHours() - hoursAgo, 30, 0);
    return {
      id: `LEAD-${d.getTime()}-${Math.floor(Math.random()*1000)}`,
      firstName: name,
      phone,
      email,
      service,
      message: msg,
      submittedAt: d.toISOString(),
      status
    };
  };

  return [
    createLead(0, 1, "Sarah Jenkins", "(281) 450-8921", "sarah.j@gmail.com", "Signature Balayage - $220+", "Looking for a warm honey blonde tone before Friday!", "new"),
    createLead(0, 3, "Amanda Rodriguez", "(832) 902-3341", "amanda.rod@yahoo.com", "Custom Color Architecture - $250+", "First time client, wanting full highlights and root melt.", "scheduled"),
    createLead(0, 5, "Brittany Taylor", "(713) 614-7809", "btaylor89@gmail.com", "Teazed Luxe Blowout - $55+", "Need blowout for an evening anniversary dinner.", "contacted"),
    createLead(1, 2, "Rambo", "(281) 402-9918", "rambo.tx@gmail.com", "Haircut & Custom Style - $30", "Need a fresh fade, razor cleanup, and styling for a weekend event.", "scheduled"),
    createLead(1, 4, "Courtney Hayes", "(832) 419-5562", "chayes.league@outlook.com", "All-Over Gloss & Refresh - $90+", "Roots freshened up and gloss toner.", "contacted"),
    createLead(1, 6, "Jessica Miller", "(281) 778-1290", "jmiller.tx@gmail.com", "Dimensional Brunette - $210+", "Transitioning back from blonde to rich espresso brown.", "scheduled"),
    createLead(2, 3, "Danielle Scott", "(281) 682-9901", "dscott.tx@icloud.com", "Signature Balayage - $220+", "Consultation + Balayage touch-up.", "scheduled"),
    createLead(2, 5, "Kayla Morgan", "(832) 554-1182", "kmorgan88@gmail.com", "Crown Foil Placement - $160+", "Highlights on top and crown area.", "contacted"),
    createLead(3, 2, "Megan Cooper", "(281) 991-3420", "mcooper@gmail.com", "Platinum Blonde Refresh - $240+", "Toner and root lift before photoshoot.", "scheduled"),
    createLead(3, 6, "Heather Wright", "(713) 489-0211", "hwright@yahoo.com", "Brazilian Blowout Treatment - $280+", "Keratin smoothing treatment.", "scheduled"),
    createLead(4, 4, "Lauren Bennett", "(832) 712-4490", "lbennett@gmail.com", "Signature Balayage - $220+", "Subtle sun-kissed balayage.", "scheduled"),
  ];
}

// Helper to get local YYYY-MM-DD to avoid UTC timezone day shifts
function getLocalDateKey(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function StaffLeadPortal({ onExit }: { onExit?: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Password management state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPasscodeAttempt, setCurrentPasscodeAttempt] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePassError, setChangePassError] = useState("");
  const [changePassSuccess, setChangePassSuccess] = useState("");
  const [hasCustomPassword, setHasCustomPassword] = useState(false);

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Default to today so leads are immediately visible
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  // Scope toggle: "day" means stats for the selected date; "all" means entire salon history
  const [statsScope, setStatsScope] = useState<"day" | "all">("day");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted" | "scheduled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Check existing session and custom password
  useEffect(() => {
    const auth = sessionStorage.getItem("tt_portal_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    const custom = localStorage.getItem("tt_portal_custom_passcode");
    setHasCustomPassword(!!custom && custom.trim().length > 0);

    loadLeads();

    const handleSync = () => loadLeads();
    window.addEventListener("lead-submitted", handleSync);
    return () => window.removeEventListener("lead-submitted", handleSync);
  }, []);

  const loadLeads = () => {
    try {
      const stored = localStorage.getItem("tt_salon_leads");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If Rambo is not present in stored data, seed him in
          const hasRambo = parsed.some((l: any) => l.firstName && l.firstName.toLowerCase().includes("rambo"));
          if (!hasRambo) {
            const seed = getInitialSeedLeads();
            const merged = [...parsed, ...seed.filter(s => s.firstName === "Rambo")];
            setLeads(merged);
            localStorage.setItem("tt_salon_leads", JSON.stringify(merged));
            return;
          }
          setLeads(parsed);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const seed = getInitialSeedLeads();
    localStorage.setItem("tt_salon_leads", JSON.stringify(seed));
    setLeads(seed);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = passcode.trim();
    const custom = localStorage.getItem("tt_portal_custom_passcode");

    let isValid = false;
    if (custom && custom.trim().length > 0) {
      // If client has set a custom private password, ONLY that custom password works
      isValid = entered.toLowerCase() === custom.trim().toLowerCase();
    } else {
      // Default initial agency/factory passcodes
      const defaultCodes = ["teazed2026", "salon123", "1234", "texas2026"];
      isValid = defaultCodes.includes(entered.toLowerCase());
    }

    if (isValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem("tt_portal_authenticated", "true");
      setErrorMsg("");
    } else {
      if (custom && custom.trim().length > 0) {
        setErrorMsg("Incorrect custom passcode. Please enter the private passcode you set.");
      } else {
        setErrorMsg("Incorrect passcode. Try 'teazed2026'");
      }
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError("");
    setChangePassSuccess("");

    const currentAttempt = currentPasscodeAttempt.trim().toLowerCase();
    const custom = localStorage.getItem("tt_portal_custom_passcode");

    // Verify current passcode
    let isCurrentValid = false;
    if (custom && custom.trim().length > 0) {
      isCurrentValid = currentAttempt === custom.trim().toLowerCase();
    } else {
      const defaultCodes = ["teazed2026", "salon123", "1234", "texas2026"];
      isCurrentValid = defaultCodes.includes(currentAttempt);
    }

    if (!isCurrentValid) {
      setChangePassError("Current passcode is incorrect. Please verify your current code.");
      return;
    }

    if (newPasscode.trim().length < 4) {
      setChangePassError("New passcode must be at least 4 characters long.");
      return;
    }

    if (newPasscode.trim() !== confirmPasscode.trim()) {
      setChangePassError("New passcodes do not match. Please re-enter.");
      return;
    }

    // Save custom passcode
    const savedCode = newPasscode.trim();
    localStorage.setItem("tt_portal_custom_passcode", savedCode);
    setHasCustomPassword(true);
    setChangePassSuccess("✓ Passcode updated successfully! Your portal is now secured with your private password.");
    setCurrentPasscodeAttempt("");
    setNewPasscode("");
    setConfirmPasscode("");

    // Auto close modal after 2.5 seconds
    setTimeout(() => {
      setIsChangePasswordOpen(false);
      setChangePassSuccess("");
    }, 2500);
  };

  const handleResetToDefaultPassword = () => {
    if (window.confirm("Are you sure you want to reset back to the default factory passcode ('teazed2026')?")) {
      localStorage.removeItem("tt_portal_custom_passcode");
      setHasCustomPassword(false);
      setCurrentPasscodeAttempt("");
      setNewPasscode("");
      setConfirmPasscode("");
      setChangePassSuccess("Passcode reset to default ('teazed2026') successfully.");
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setChangePassSuccess("");
      }, 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("tt_portal_authenticated");
    setPasscode("");
  };

  const handleSafeExit = () => {
    // 1. Safely remove session so portal is locked
    sessionStorage.removeItem("tt_portal_authenticated");
    setIsAuthenticated(false);
    setPasscode("");

    // 2. Clear query parameters & hash cleanly
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("portal");
      url.hash = "";
      window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""));
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (e) {
      console.error(e);
    }

    // 3. Navigate back to public website
    if (onExit) {
      onExit();
    } else {
      window.location.href = "/";
    }
  };

  const updateLeadStatus = (id: string, newStatus: "new" | "contacted" | "scheduled") => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
    setLeads(updated);
    try {
      localStorage.setItem("tt_salon_leads", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Calendar calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Map leads by day using local date key
  const leadsByDate = useMemo(() => {
    const map: Record<string, LeadItem[]> = {};
    leads.forEach(lead => {
      const dateKey = getLocalDateKey(lead.submittedAt);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(lead);
    });
    return map;
  }, [leads]);

  const todayKey = getLocalDateKey(new Date());
  const selectedDateKey = selectedDate ? getLocalDateKey(selectedDate) : null;

  // Active target leads for KPI metrics (dynamically filtered by selected date if in "day" scope)
  const activeMetricLeads = useMemo(() => {
    if (statsScope === "day" && selectedDateKey) {
      return leads.filter(lead => getLocalDateKey(lead.submittedAt) === selectedDateKey);
    }
    return leads;
  }, [leads, statsScope, selectedDateKey]);

  // Filtered leads for the detailed list
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Date filter
      if (selectedDateKey) {
        const leadDateKey = getLocalDateKey(lead.submittedAt);
        if (leadDateKey !== selectedDateKey) return false;
      }
      // Status filter
      if (statusFilter !== "all" && (lead.status || "new") !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = lead.firstName.toLowerCase().includes(q) ||
          lead.phone.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.service.toLowerCase().includes(q) ||
          (lead.message || "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [leads, selectedDateKey, statusFilter, searchQuery]);

  // Conversion Metrics (Calculated dynamically for selected day OR all-time)
  const metrics = useMemo(() => {
    const list = activeMetricLeads;
    const total = list.length;
    const scheduled = list.filter(l => l.status === "scheduled").length;
    const contacted = list.filter(l => l.status === "contacted").length;
    const newLeads = list.filter(l => !l.status || l.status === "new").length;
    const conversionRate = total > 0 ? Math.round((scheduled / total) * 100) : 0;

    // Estimate revenue from services
    const estimatedRev = list
      .filter(l => l.status === "scheduled")
      .reduce((acc, lead) => {
        const match = lead.service.match(/\$(\d+)/);
        return acc + (match ? parseInt(match[1], 10) : 30);
      }, 0);

    const todayCount = (leadsByDate[todayKey] || []).length;
    const todayScheduled = (leadsByDate[todayKey] || []).filter(l => l.status === "scheduled").length;

    // Cumulative numbers for comparison
    const allTimeTotal = leads.length;
    const allTimeScheduled = leads.filter(l => l.status === "scheduled").length;
    const allTimeRate = allTimeTotal > 0 ? Math.round((allTimeScheduled / allTimeTotal) * 100) : 0;

    return {
      total,
      scheduled,
      contacted,
      newLeads,
      conversionRate,
      estimatedRev,
      todayCount,
      todayScheduled,
      allTimeTotal,
      allTimeScheduled,
      allTimeRate
    };
  }, [activeMetricLeads, leads, leadsByDate, todayKey]);

  // Export leads to CSV with high fidelity UTF-8 encoding and Excel support
  const handleExportCSV = () => {
    try {
      const headers = [
        "Lead ID",
        "Client Name",
        "Phone Number",
        "Email Address",
        "Service Requested",
        "Conversion Status",
        "Client Notes / Message",
        "Date Submitted",
        "Time Submitted"
      ];

      const escapeCSV = (val: string | undefined | null) => {
        if (!val) return '""';
        return `"${String(val).replace(/"/g, '""').replace(/[\r\n]+/g, ' ')}"`;
      };

      const rows = leads.map(l => {
        const d = new Date(l.submittedAt);
        const formattedDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        const formattedTime = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        const statusLabel = l.status === "scheduled" ? "Converted (Booked)" : l.status === "contacted" ? "Contacted" : "New Inquiry";

        return [
          escapeCSV(l.id),
          escapeCSV(l.firstName),
          escapeCSV(l.phone),
          escapeCSV(l.email),
          escapeCSV(l.service),
          escapeCSV(statusLabel),
          escapeCSV(l.message),
          escapeCSV(formattedDate),
          escapeCSV(formattedTime)
        ].join(",");
      });

      // UTF-8 BOM (\uFEFF) ensures Excel and Numbers render special characters properly
      const bom = "\uFEFF";
      const csvContent = bom + [headers.join(","), ...rows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      const todayDate = new Date().toISOString().split("T")[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `Texas_Teazed_Salon_Leads_${todayDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (e) {
      console.error("Export CSV error:", e);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // -------------------------------------------------------------
  // CHANGE PASSCODE MODAL (Available to Owner Anytime)
  // -------------------------------------------------------------
  const renderChangePasswordModal = () => {
    if (!isChangePasswordOpen) return null;
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans"
        onClick={() => setIsChangePasswordOpen(false)}
      >
        <div 
          className="bg-white border-2 border-[#1a3324]/20 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsChangePasswordOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1a3324]/5 hover:bg-[#1a3324]/10 text-[#1a3324]/70 hover:text-[#1a3324] flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#1a3324] text-[#F7FEE3] mx-auto flex items-center justify-center mb-3 shadow-md">
              <KeyRound className="w-6 h-6 text-[#F7FEE3]" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#a85232] font-bold block mb-1">
              Owner Security & Privacy
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1a3324] font-bold">
              Set Your Private Passcode
            </h3>
            <p className="text-xs text-[#1a3324]/70 mt-1.5 leading-relaxed">
              Create your own secret password. Once set, previous default passcodes are disabled and only you can unlock this client lead tracker.
            </p>
          </div>

          {/* Success message */}
          {changePassSuccess && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5 font-medium leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{changePassSuccess}</span>
            </div>
          )}

          {/* Error message */}
          {changePassError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-start gap-2.5 font-medium leading-relaxed">
              <Shield className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{changePassError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Passcode */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1a3324]/80 font-bold mb-1.5">
                Current Passcode
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={currentPasscodeAttempt}
                  onChange={(e) => setCurrentPasscodeAttempt(e.target.value)}
                  placeholder={hasCustomPassword ? "Enter your current custom passcode" : "Enter current code (e.g. teazed2026)"}
                  className="w-full bg-[#F7FEE3]/40 border border-[#1a3324]/20 rounded-xl px-4 py-2.5 text-xs text-[#1a3324] placeholder:text-[#1a3324]/40 focus:outline-none focus:border-[#a85232] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a3324]/50 hover:text-[#1a3324] cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* New Passcode */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1a3324]/80 font-bold mb-1.5">
                New Private Passcode
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="Create your new secret passcode (min 4 characters)"
                className="w-full bg-[#F7FEE3]/40 border border-[#1a3324]/20 rounded-xl px-4 py-2.5 text-xs text-[#1a3324] placeholder:text-[#1a3324]/40 focus:outline-none focus:border-[#a85232] transition-colors"
              />
            </div>

            {/* Confirm Passcode */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1a3324]/80 font-bold mb-1.5">
                Confirm New Passcode
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Re-type new passcode to confirm"
                className="w-full bg-[#F7FEE3]/40 border border-[#1a3324]/20 rounded-xl px-4 py-2.5 text-xs text-[#1a3324] placeholder:text-[#1a3324]/40 focus:outline-none focus:border-[#a85232] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1a3324] hover:bg-[#14261b] text-[#F7FEE3] text-xs uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Save & Activate Private Passcode</span>
            </button>

            {/* Reset to factory default option if custom exists */}
            {hasCustomPassword && (
              <div className="pt-3 border-t border-[#1a3324]/10 text-center">
                <button
                  type="button"
                  onClick={handleResetToDefaultPassword}
                  className="text-[11px] text-[#a85232] hover:underline font-semibold cursor-pointer"
                >
                  Reset back to default factory passcode (teazed2026)
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // PASSWORD GATE VIEW (Signature Cream Background + Forest Green Text)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7FEE3] text-[#1a3324] flex items-center justify-center p-4 selection:bg-[#a85232] selection:text-white font-sans relative">
        <div className="max-w-md w-full bg-white border border-[#1a3324]/15 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle warm accent glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#a85232]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#1a3324]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Safe Exit Button on Password Screen */}
          <button
            type="button"
            onClick={handleSafeExit}
            className="absolute top-4 right-4 z-20 text-xs font-semibold text-[#1a3324]/70 hover:text-[#1a3324] px-3 py-1.5 rounded-xl border border-[#1a3324]/15 hover:bg-[#1a3324]/5 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Exit back to public website"
          >
            <LogOut className="w-3.5 h-3.5 text-[#a85232]" />
            <span>Exit</span>
          </button>

          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#1a3324] border-2 border-[#F7FEE3] mx-auto flex items-center justify-center text-[#F7FEE3] mb-4 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#a85232] font-semibold block mb-1">
              Confidential Staff Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1a3324]">
              Texas Teazed Hair Salon
            </h1>
            <p className="text-xs text-[#1a3324]/70 mt-2 leading-relaxed">
              Enter staff passcode to access incoming client bookings, lead details, and daily conversion logs.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#1a3324]/70 mb-2 font-medium">
                Staff Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  placeholder={hasCustomPassword ? "Enter your private passcode..." : "Enter passcode (e.g. teazed2026)..."}
                  className="w-full bg-[#F7FEE3]/40 border border-[#1a3324]/20 rounded-xl px-4 py-3.5 text-sm text-[#1a3324] placeholder:text-[#1a3324]/40 focus:outline-none focus:border-[#a85232] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1a3324]/50 hover:text-[#1a3324] transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMsg && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a3324] hover:bg-[#14261b] text-[#F7FEE3] py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all shadow-lg hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Staff Lead Tracker</span>
            </button>

            <div className="pt-4 border-t border-[#1a3324]/10 text-center space-y-2.5">
              <p className="text-[11px] text-[#1a3324]/60">
                {hasCustomPassword ? (
                  <span className="text-emerald-800 font-semibold inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Private Owner Passcode is currently active
                  </span>
                ) : (
                  <>Default Factory Passcode: <span className="font-mono font-semibold text-[#1a3324]">teazed2026</span></>
                )}
              </p>

              <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setChangePassError("");
                    setChangePassSuccess("");
                    setCurrentPasscodeAttempt("");
                    setNewPasscode("");
                    setConfirmPasscode("");
                    setIsChangePasswordOpen(true);
                  }}
                  className="text-[#a85232] hover:text-[#8e452a] flex items-center gap-1.5 cursor-pointer underline decoration-[#a85232]/30"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Change / Reset Passcode</span>
                </button>

                <span className="text-[#1a3324]/30">•</span>

                <button
                  type="button"
                  onClick={handleSafeExit}
                  className="text-[#1a3324]/70 hover:text-[#1a3324] flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit to Website</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Change Passcode Modal for login screen */}
        {renderChangePasswordModal()}
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED STAFF PORTAL VIEW (Clean Cream Background + Forest Green Text)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F7FEE3] text-[#1a3324] selection:bg-[#a85232] selection:text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Navigation Bar */}
        <header className="bg-white border border-[#1a3324]/15 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a3324] border border-[#1a3324]/20 flex items-center justify-center text-[#F7FEE3] shadow-md font-serif text-xl font-bold">
              TT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif text-[#1a3324] font-bold">
                  Texas Teazed Staff Lead Portal
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#1a3324]/10 text-[#1a3324] text-[10px] uppercase tracking-widest font-semibold border border-[#1a3324]/20">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#1a3324]/70">
                2576 East League City Pkwy • Salon Line: (281) 339-7168
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm border ${
                downloadSuccess
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-white hover:bg-[#1a3324]/5 text-[#1a3324] border-[#1a3324]/20"
              }`}
              title="Download all leads and conversion records as CSV"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Downloaded ({leads.length})</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#a85232]" />
                  <span>Export CSV</span>
                </>
              )}
            </button>

            {/* Change Passcode Button */}
            <button
              type="button"
              onClick={() => {
                setChangePassError("");
                setChangePassSuccess("");
                setCurrentPasscodeAttempt("");
                setNewPasscode("");
                setConfirmPasscode("");
                setIsChangePasswordOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#1a3324]/5 text-[#1a3324] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-[#1a3324]/20 shadow-sm"
              title="Set your own private password for this lead portal"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#a85232]" />
              <span>Change Passcode</span>
              {hasCustomPassword && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Custom private passcode active" />
              )}
            </button>

            {/* Lock Session Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-xl bg-[#1a3324]/5 hover:bg-[#1a3324]/10 text-[#1a3324] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-[#1a3324]/15"
              title="Lock portal screen with password"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>

            {/* Prominent Safe Exit Portal Button */}
            <button
              type="button"
              onClick={handleSafeExit}
              className="px-4 py-2.5 rounded-xl bg-[#a85232] hover:bg-[#8e452a] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02]"
              title="Safely lock session and return to Texas Teazed website"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Portal</span>
            </button>
          </div>
        </header>

        {/* Scope Indicator & Toggle Bar */}
        <section className="bg-white border-2 border-[#1a3324]/15 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1a3324] text-[#F7FEE3] flex items-center justify-center shrink-0 shadow-sm">
                {statsScope === "day" ? <CalendarIcon className="w-5 h-5 text-[#F7FEE3]" /> : <TrendingUp className="w-5 h-5 text-[#F7FEE3]" />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-widest font-bold text-[#1a3324]">
                    Conversion Metrics Scope:
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    statsScope === "day" 
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300" 
                      : "bg-[#1a3324] text-white"
                  }`}>
                    {statsScope === "day" && selectedDate
                      ? `📅 Day Performance: ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                      : "🌐 Cumulative All-Time Salon Overview"}
                  </span>
                </div>
                <p className="text-xs text-[#1a3324]/70 mt-0.5">
                  {statsScope === "day" && selectedDate
                    ? `Showing exact leads count, booked conversions, and conversion rate for ${selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}.`
                    : `Showing total cumulative leads and overall conversion performance across all dates (${metrics.allTimeTotal} leads total).`}
                </p>
              </div>
            </div>

            {/* Instant Toggle Pills */}
            <div className="flex items-center gap-1.5 bg-[#F7FEE3] p-1.5 rounded-2xl border border-[#1a3324]/15 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (!selectedDate) setSelectedDate(new Date());
                  setStatsScope("day");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  statsScope === "day" && selectedDate
                    ? "bg-[#1a3324] text-white shadow-sm"
                    : "text-[#1a3324]/70 hover:text-[#1a3324] hover:bg-white/50"
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>
                  {selectedDate
                    ? `Day: ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    : "Day View"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatsScope("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  statsScope === "all" || !selectedDate
                    ? "bg-[#1a3324] text-white shadow-sm"
                    : "text-[#1a3324]/70 hover:text-[#1a3324] hover:bg-white/50"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>All-Time ({metrics.allTimeTotal})</span>
              </button>
            </div>
          </div>

          {/* Quick Notice Banner if looking at selected day */}
          {statsScope === "day" && selectedDate && (
            <div className="flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-[#F7FEE3]/80 border border-[#1a3324]/10 text-[#1a3324]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#a85232]" />
                <span>
                  Date selected on calendar: <strong>{selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong>
                </span>
              </span>
              <button
                type="button"
                onClick={() => setStatsScope("all")}
                className="text-[11px] font-semibold text-[#a85232] hover:underline cursor-pointer"
              >
                Switch to All-Time Overview →
              </button>
            </div>
          )}
        </section>

        {/* Conversion & Performance KPI Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Metric 1: Total Leads */}
          <div className="bg-white border-2 border-[#1a3324]/15 rounded-2xl p-5 shadow-sm hover:border-[#1a3324]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#1a3324]/70 mb-1">
              <span className="uppercase tracking-wider font-bold">
                {statsScope === "day" ? "Day Inquiries" : "Total Inquiries"}
              </span>
              <Users className="w-4 h-4 text-[#1a3324]/50" />
            </div>
            <div className="text-3xl font-serif text-[#1a3324] font-bold">
              {metrics.total}
            </div>
            <span className="text-[11px] text-[#1a3324]/80 font-medium mt-1 block">
              {statsScope === "day" && selectedDate
                ? `● On ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : `● Across all dates (${metrics.todayCount} today)`}
            </span>
          </div>

          {/* Metric 2: Converted / Scheduled */}
          <div className="bg-white border-2 border-[#1a3324]/15 rounded-2xl p-5 shadow-sm hover:border-[#1a3324]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#1a3324]/70 mb-1">
              <span className="uppercase tracking-wider font-bold">Converted / Booked</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-3xl font-serif text-emerald-800 font-bold">
              {metrics.scheduled}
            </div>
            <span className="text-[11px] text-emerald-900 font-medium mt-1 block">
              {statsScope === "day" && selectedDate
                ? `● ${metrics.scheduled} of ${metrics.total} converted on this day`
                : `● ${metrics.scheduled} total confirmed clients`}
            </span>
          </div>

          {/* Metric 3: Conversion Rate */}
          <div className="bg-white border-2 border-[#1a3324]/15 rounded-2xl p-5 shadow-sm hover:border-[#1a3324]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#1a3324]/70 mb-1">
              <span className="uppercase tracking-wider font-bold">Conversion Rate</span>
              <TrendingUp className="w-4 h-4 text-[#a85232]" />
            </div>
            <div className="text-3xl font-serif text-[#a85232] font-bold flex items-baseline gap-1">
              <span>{metrics.conversionRate}%</span>
              {metrics.conversionRate === 100 && metrics.total > 0 && (
                <span className="text-xs text-emerald-700 font-sans font-bold">★ Perfect</span>
              )}
            </div>
            <div className="w-full bg-[#1a3324]/10 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.conversionRate >= 70 ? "bg-emerald-600" : metrics.conversionRate >= 40 ? "bg-[#a85232]" : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(100, metrics.conversionRate)}%` }}
              />
            </div>
            <span className="text-[11px] text-[#1a3324]/70 mt-1 block font-medium">
              {metrics.total === 0 
                ? "No inquiries on this date" 
                : `${metrics.scheduled} of ${metrics.total} leads booked`}
            </span>
          </div>

          {/* Metric 4: Est. Pipeline Value */}
          <div className="bg-white border-2 border-[#1a3324]/15 rounded-2xl p-5 shadow-sm hover:border-[#1a3324]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#1a3324]/70 mb-1">
              <span className="uppercase tracking-wider font-bold">Est. Booked Revenue</span>
              <DollarSign className="w-4 h-4 text-[#a85232]" />
            </div>
            <div className="text-3xl font-serif text-[#1a3324] font-bold">
              ${metrics.estimatedRev.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#1a3324]/70 mt-1 block">
              {statsScope === "day" && selectedDate
                ? `From ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}'s bookings`
                : "From all confirmed bookings"}
            </span>
          </div>

          {/* Metric 5: Pending Action */}
          <div className="bg-white border-2 border-[#1a3324]/15 rounded-2xl p-5 shadow-sm col-span-2 lg:col-span-1 hover:border-[#1a3324]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#1a3324]/70 mb-1">
              <span className="uppercase tracking-wider font-bold">Pending Follow-ups</span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-3xl font-serif text-amber-800 font-bold">
              {metrics.newLeads}
            </div>
            <span className="text-[11px] mt-1 block font-medium">
              {metrics.newLeads === 0 ? (
                <span className="text-emerald-800 font-semibold">✓ All inquiries addressed</span>
              ) : (
                <span className="text-amber-800 font-semibold">● Needs staff call/text</span>
              )}
            </span>
          </div>
        </section>

        {/* Main Workspace: Calendar & Date Filter on Left (4 cols), Leads Detail on Right (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Calendar & Date Selection */}
          <div className="lg:col-span-4 bg-white border border-[#1a3324]/15 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#a85232]" />
                  <h2 className="text-lg font-serif text-[#1a3324] font-bold">
                    {monthNames[month]} {year}
                  </h2>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                    className="p-1.5 rounded-lg hover:bg-[#1a3324]/10 text-[#1a3324]/70 hover:text-[#1a3324] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      setCurrentMonth(today);
                      setSelectedDate(today);
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg border border-[#1a3324]/20 text-[#1a3324] hover:bg-[#1a3324]/5 font-medium cursor-pointer"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                    className="p-1.5 rounded-lg hover:bg-[#1a3324]/10 text-[#1a3324]/70 hover:text-[#1a3324] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-semibold tracking-wider text-[#1a3324]/50 uppercase">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                  <span key={d} className="py-1">{d}</span>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`blank-${i}`} className="h-10" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateObj = new Date(year, month, dayNum);
                  const dateKey = getLocalDateKey(dateObj);
                  const dayLeads = leadsByDate[dateKey] || [];
                  const isSelected = selectedDateKey === dateKey;
                  const isToday = todayKey === dateKey;
                  const dayScheduled = dayLeads.filter(l => l.status === "scheduled").length;
                  const dayConvRate = dayLeads.length > 0 ? Math.round((dayScheduled / dayLeads.length) * 100) : 0;

                  return (
                    <button
                      key={`d-${dayNum}`}
                      type="button"
                      onClick={() => {
                        setSelectedDate(dateObj);
                        setStatsScope("day");
                      }}
                      className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-xs font-medium ${
                        isSelected
                          ? "bg-[#1a3324] text-white font-bold shadow-md scale-105"
                          : isToday
                          ? "bg-[#F7FEE3] text-[#1a3324] border-2 border-[#a85232] font-bold"
                          : dayLeads.length > 0
                          ? "bg-[#F7FEE3]/70 hover:bg-[#F7FEE3] text-[#1a3324] border border-[#1a3324]/15"
                          : "text-[#1a3324]/40 hover:bg-[#1a3324]/5 hover:text-[#1a3324]"
                      }`}
                    >
                      <span className="leading-tight">{dayNum}</span>
                      {dayLeads.length > 0 && (
                        <span 
                          className={`text-[9px] font-mono leading-none px-1 py-0.5 rounded-full font-bold mt-0.5 ${
                            isSelected
                              ? "bg-white text-[#1a3324]"
                              : dayConvRate === 100
                              ? "bg-emerald-200 text-emerald-900 border border-emerald-400"
                              : dayScheduled > 0
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {dayLeads.length}{dayConvRate > 0 ? ` (${dayConvRate}%)` : ""}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Date Presets */}
            <div className="pt-4 border-t border-[#1a3324]/10 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#1a3324]/60 font-semibold block">
                Quick Date Filter:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    setSelectedDate(today);
                    setCurrentMonth(today);
                    setStatsScope("day");
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedDateKey === todayKey && statsScope === "day"
                      ? "bg-[#1a3324] text-white font-semibold"
                      : "bg-[#F7FEE3] hover:bg-[#eef8d5] text-[#1a3324] border border-[#1a3324]/15"
                  }`}
                >
                  Today ({metrics.todayCount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const y = new Date();
                    y.setDate(y.getDate() - 1);
                    setSelectedDate(y);
                    setCurrentMonth(y);
                    setStatsScope("day");
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedDate && getLocalDateKey(selectedDate) === getLocalDateKey(new Date(Date.now() - 86400000)) && statsScope === "day"
                      ? "bg-[#1a3324] text-white font-semibold"
                      : "bg-[#F7FEE3] hover:bg-[#eef8d5] text-[#1a3324] border border-[#1a3324]/15"
                  }`}
                >
                  Yesterday (Includes Rambo)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate(null);
                    setStatsScope("all");
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statsScope === "all" || selectedDate === null
                      ? "bg-[#1a3324] text-white font-semibold"
                      : "bg-[#F7FEE3] hover:bg-[#eef8d5] text-[#1a3324] border border-[#1a3324]/15"
                  }`}
                >
                  View All Leads ({leads.length})
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Leads List with Exact Structured Format */}
          <div className="lg:col-span-8 bg-white border border-[#1a3324]/15 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Header with Search and Status Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1a3324]/10 mb-4">
                <div>
                  <h3 className="text-xl font-serif text-[#1a3324] font-bold flex flex-wrap items-center gap-2">
                    <span>
                      {selectedDate
                        ? selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
                        : "All Recorded Salon Leads"}
                    </span>
                    {selectedDateKey === todayKey && (
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold font-sans">
                        Today
                      </span>
                    )}
                    {selectedDate && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-sans font-semibold border ${
                        metrics.conversionRate === 100 
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-[#a85232]/10 text-[#a85232] border-[#a85232]/20"
                      }`}>
                        {metrics.conversionRate}% Conversion
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#1a3324]/70 mt-0.5">
                    Showing {filteredLeads.length} lead{filteredLeads.length === 1 ? "" : "s"} • {metrics.scheduled} Converted Bookings ({metrics.conversionRate}% conversion rate)
                  </p>
                </div>

                {/* Status tabs */}
                <div className="flex items-center gap-1 bg-[#F7FEE3] p-1 rounded-xl border border-[#1a3324]/15 text-xs">
                  {(["all", "new", "contacted", "scheduled"] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                        statusFilter === tab
                          ? "bg-[#1a3324] text-white font-semibold shadow-sm"
                          : "text-[#1a3324]/70 hover:text-[#1a3324]"
                      }`}
                    >
                      {tab === "scheduled" ? "Converted (Booked)" : tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search bar */}
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-[#1a3324]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search client by name (e.g. Rambo), phone, email, or service..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F7FEE3]/40 border border-[#1a3324]/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#1a3324] placeholder:text-[#1a3324]/40 focus:outline-none focus:border-[#a85232] transition-colors"
                />
              </div>

              {/* Leads Card Feed - Structured full details format as requested */}
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                {filteredLeads.length === 0 ? (
                  <div className="p-10 text-center bg-[#F7FEE3]/30 border border-[#1a3324]/10 rounded-2xl">
                    <Clock className="w-10 h-10 text-[#1a3324]/30 mx-auto mb-2" />
                    <p className="text-[#1a3324] text-sm font-semibold">
                      No leads match this selection.
                    </p>
                    <p className="text-[#1a3324]/60 text-xs mt-1 mb-4">
                      Click below to view all leads or select yesterday to see Rambo's booking.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedDate(null)}
                        className="px-4 py-2 rounded-xl bg-[#1a3324] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        View All Leads ({leads.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const y = new Date();
                          y.setDate(y.getDate() - 1);
                          setSelectedDate(y);
                        }}
                        className="px-4 py-2 rounded-xl border border-[#1a3324]/20 text-[#1a3324] text-xs font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        Yesterday's Leads
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredLeads.map(lead => {
                    const leadDate = new Date(lead.submittedAt);
                    const formattedDate = leadDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    const formattedTime = leadDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                    const currentStatus = lead.status || "new";

                    return (
                      <div
                        key={lead.id}
                        className="bg-white border-2 border-[#1a3324]/15 hover:border-[#1a3324]/30 p-5 sm:p-6 rounded-2xl transition-all shadow-sm space-y-4"
                      >
                        {/* Top Header Row: Status Badge & Conversion Switcher */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1a3324]/10">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span className="text-xs uppercase tracking-wider font-bold text-[#1a3324]">
                              Lead Record #{lead.id.slice(-6)}
                            </span>
                            <span className="text-xs text-[#1a3324]/60 font-mono">
                              • Submitted {formattedDate} at {formattedTime}
                            </span>
                          </div>

                          {/* Conversion Status Toggle */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] uppercase tracking-wider text-[#1a3324]/60 font-bold">
                              Conversion Status:
                            </span>
                            <div className="flex items-center gap-1 bg-[#F7FEE3] p-1 rounded-xl border border-[#1a3324]/15">
                              <button
                                type="button"
                                onClick={() => updateLeadStatus(lead.id, "new")}
                                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                                  currentStatus === "new"
                                    ? "bg-blue-100 text-blue-900 font-bold border border-blue-300"
                                    : "text-[#1a3324]/50 hover:text-[#1a3324]"
                                }`}
                              >
                                New
                              </button>
                              <button
                                type="button"
                                onClick={() => updateLeadStatus(lead.id, "contacted")}
                                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                                  currentStatus === "contacted"
                                    ? "bg-amber-100 text-amber-900 font-bold border border-amber-300"
                                    : "text-[#1a3324]/50 hover:text-[#1a3324]"
                                }`}
                              >
                                Contacted
                              </button>
                              <button
                                type="button"
                                onClick={() => updateLeadStatus(lead.id, "scheduled")}
                                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                                  currentStatus === "scheduled"
                                    ? "bg-emerald-100 text-emerald-900 font-bold border border-emerald-300"
                                    : "text-[#1a3324]/50 hover:text-[#1a3324]"
                                }`}
                              >
                                Converted ✓
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Structured Lead Detail Grid (Exact format requested) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-[#F7FEE3]/40 p-4 rounded-xl border border-[#1a3324]/10">
                          {/* Name */}
                          <div className="flex items-start gap-2.5">
                            <User className="w-4 h-4 text-[#a85232] mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-[#1a3324]/60 font-semibold block">
                                Name:
                              </span>
                              <span className="text-base font-serif font-bold text-[#1a3324]">
                                {lead.firstName}
                              </span>
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="flex items-start gap-2.5">
                            <Phone className="w-4 h-4 text-[#a85232] mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-[#1a3324]/60 font-semibold block">
                                Phone:
                              </span>
                              <a
                                href={`tel:${lead.phone}`}
                                className="text-sm font-mono font-semibold text-[#1a3324] hover:text-[#a85232] underline decoration-[#1a3324]/30"
                              >
                                {lead.phone}
                              </a>
                            </div>
                          </div>

                          {/* Email */}
                          <div className="flex items-start gap-2.5">
                            <Mail className="w-4 h-4 text-[#a85232] mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase tracking-wider text-[#1a3324]/60 font-semibold block">
                                Email:
                              </span>
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-sm font-semibold text-[#1a3324] hover:text-[#a85232] truncate block"
                              >
                                {lead.email || "Not provided"}
                              </a>
                            </div>
                          </div>

                          {/* Service */}
                          <div className="flex items-start gap-2.5">
                            <Scissors className="w-4 h-4 text-[#a85232] mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-[#1a3324]/60 font-semibold block">
                                Service:
                              </span>
                              <span className="text-sm font-semibold text-[#a85232] bg-[#a85232]/10 px-2 py-0.5 rounded border border-[#a85232]/20 inline-block">
                                {lead.service}
                              </span>
                            </div>
                          </div>

                          {/* Message / User Notes (Full width) */}
                          <div className="md:col-span-2 flex items-start gap-2.5 pt-2 border-t border-[#1a3324]/10">
                            <FileText className="w-4 h-4 text-[#a85232] mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <span className="text-[10px] uppercase tracking-wider text-[#1a3324]/60 font-semibold block">
                                Message:
                              </span>
                              <p className="text-xs text-[#1a3324] italic mt-0.5 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-[#1a3324]/10">
                                {lead.message ? `"${lead.message}"` : "None provided"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Staff Action Buttons: Direct Call, Direct SMS, Vagaro */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="text-xs text-[#1a3324]/60">
                            Front Desk Quick Contact:
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Direct Call */}
                            <a
                              href={`tel:${lead.phone}`}
                              className="px-3.5 py-1.5 rounded-xl bg-[#1a3324] hover:bg-[#14261b] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call Client</span>
                            </a>

                            {/* Direct SMS with pre-filled message */}
                            <a
                              href={`sms:${lead.phone.replace(/[^0-9]/g, '')}?&body=${encodeURIComponent(`Hi ${lead.firstName}, this is Texas Teazed Hair Salon regarding your booking request for ${lead.service}! When would be the best time for your appointment?`)}`}
                              className="px-3.5 py-1.5 rounded-xl bg-[#a85232] hover:bg-[#8e452a] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Text Client (SMS)</span>
                            </a>

                            {/* Vagaro booking portal */}
                            <a
                              href="https://www.vagaro.com/texasteazedhairsalon"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl border border-[#1a3324]/20 hover:bg-[#1a3324]/5 text-[#1a3324] text-xs font-semibold transition-all flex items-center gap-1"
                            >
                              <span>Vagaro Calendar</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="mt-5 pt-3 border-t border-[#1a3324]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#1a3324]/60">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Staff confidential lead record • Saved in real-time
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-semibold text-[#1a3324]">
                  Texas Teazed Hair Salon Desk (281) 339-7168
                </span>
                <span className="text-[#1a3324]/30">•</span>
                <button
                  type="button"
                  onClick={handleSafeExit}
                  className="text-xs text-[#a85232] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  title="Exit to public website"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Exit Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Passcode Modal for authenticated portal view */}
      {renderChangePasswordModal()}
    </div>
  );
}
