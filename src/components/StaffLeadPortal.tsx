import React, { useState, useEffect, useMemo } from "react";
import {
  Lock,
  Unlock,
  KeyRound,
  Shield,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Search,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Users,
  BarChart3,
  DollarSign,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  MessageSquare,
  Tag,
  X,
  TrendingUp,
  Moon,
  Receipt,
} from "lucide-react";
import {
  SalonClientRecord,
  SalonStaffMember,
  ClientStatus,
  ClientChannel,
  INITIAL_STAFF_MEMBERS,
  SALON_SERVICES,
} from "../types/crm";
import { getInitialCrmSeed } from "../utils/crmSeed";
import { WalkInPosModal } from "./crm/WalkInPosModal";
import { StaffManagerModal } from "./crm/StaffManagerModal";
import { EditPricingModal } from "./crm/EditPricingModal";
import { CrmReportsModal } from "./crm/CrmReportsModal";
import { DailyZReportModal } from "./crm/DailyZReportModal";
import { DigitalReceiptModal } from "./crm/DigitalReceiptModal";
import { RetentionReminderModal } from "./crm/RetentionReminderModal";

export function formatMoney(amount: number | undefined | null): string {
  if (amount == null || isNaN(amount)) return "0.00";
  return Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(pct: number | undefined | null): string {
  if (pct == null || isNaN(pct)) return "0";
  return Number(Number(pct).toFixed(2)).toString();
}

export function getClientElapsedInfo(dateStr: string, refDateStr: string = "2026-10-07") {
  if (!dateStr) return { diffDays: 0, weeks: 0, isDue: false };
  try {
    const [ry, rm, rd] = refDateStr.split("-").map(Number);
    const [cy, cm, cd] = dateStr.split("-").map(Number);
    const ref = new Date(ry, rm - 1, rd).getTime();
    const clientTime = new Date(cy, cm - 1, cd).getTime();
    const diffDays = Math.max(0, Math.round((ref - clientTime) / (1000 * 60 * 60 * 24)));
    const weeks = parseFloat((diffDays / 7).toFixed(1));
    // 4 to 6+ weeks: 28 days or more
    const isDue = diffDays >= 28;
    return { diffDays, weeks, isDue };
  } catch {
    return { diffDays: 0, weeks: 0, isDue: false };
  }
}

export function StaffLeadPortal({ onExit }: { onExit?: () => void }) {
  // Passcode Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Change Passcode State
  const [isChangePasscodeOpen, setIsChangePasscodeOpen] = useState(false);
  const [currentCodeInput, setCurrentCodeInput] = useState("");
  const [newCodeInput, setNewCodeInput] = useState("");
  const [confirmCodeInput, setConfirmCodeInput] = useState("");
  const [passcodeSuccessMsg, setPasscodeSuccessMsg] = useState("");
  const [passcodeErrorMsg, setPasscodeErrorMsg] = useState("");
  const [hasCustomPasscode, setHasCustomPasscode] = useState(false);

  // CRM Data State
  const [clients, setClients] = useState<SalonClientRecord[]>([]);
  const [staffList, setStaffList] = useState<SalonStaffMember[]>(INITIAL_STAFF_MEMBERS);

  // Calendar & Scope State (Matching Screenshot)
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 9, 1)); // Oct 2026
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("2026-10-06");
  const [scopeMode, setScopeMode] = useState<"day" | "all">("day");
  const [channelFilter, setChannelFilter] = useState<"all" | ClientChannel>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ClientStatus | "due_for_visit">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [isStaffManagerOpen, setIsStaffManagerOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isDailyZOpen, setIsDailyZOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<SalonClientRecord | null>(null);
  const [receiptClient, setReceiptClient] = useState<SalonClientRecord | null>(null);
  const [retentionClient, setRetentionClient] = useState<SalonClientRecord | null>(null);

  // Check Session Authentication on Mount
  useEffect(() => {
    const auth = sessionStorage.getItem("tt_portal_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    const custom = localStorage.getItem("tt_portal_custom_passcode");
    setHasCustomPasscode(!!custom && custom.trim().length > 0);

    loadStaffList();
    loadClientsData();

    const handleSync = () => loadClientsData();
    window.addEventListener("lead-submitted", handleSync);
    return () => window.removeEventListener("lead-submitted", handleSync);
  }, []);

  const loadStaffList = () => {
    try {
      const stored = localStorage.getItem("tt_salon_staff_list");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasActualStaff = parsed.some((s: any) =>
            s.name.includes("Antoinette") || s.name.includes("Ashley Cox")
          );
          if (hasActualStaff) {
            setStaffList(parsed);
            return;
          }
        }
      }
    } catch {}
    localStorage.setItem("tt_salon_staff_list", JSON.stringify(INITIAL_STAFF_MEMBERS));
    setStaffList(INITIAL_STAFF_MEMBERS);
  };

  const handleUpdateStaffList = (updated: SalonStaffMember[]) => {
    setStaffList(updated);
    localStorage.setItem("tt_salon_staff_list", JSON.stringify(updated));
  };

  const loadClientsData = () => {
    try {
      const stored = localStorage.getItem("tt_salon_leads");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized: SalonClientRecord[] = parsed.map((item: any) => {
            const dateStr = item.date || item.submittedAt?.split("T")[0] || "2026-10-05";
            const price = typeof item.actualPrice === "number" ? item.actualPrice : 100;
            const net = typeof item.netCash === "number" ? item.netCash : price;
            return {
              id: item.id || `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              firstName: item.firstName || item.name || "Client",
              phone: item.phone || "",
              email: item.email || "",
              service: item.service || "Balayage",
              stylistName: (item.stylistName && item.stylistName !== "Cheyanne") ? item.stylistName : INITIAL_STAFF_MEMBERS[0].name,
              channel: item.channel === "walk_in" ? "walk_in" : "online",
              status: item.status === "scheduled" ? "converted" : item.status || "new",
              date: dateStr,
              time: item.time || "11:30 AM",
              actualPrice: price,
              discountAmount: item.discountAmount || 0,
              discountPercent: item.discountPercent || 0,
              netCash: net,
              discountReason: item.discountReason,
              message: item.message,
              formulaNotes: item.formulaNotes,
              submittedAt: item.submittedAt || new Date().toISOString(),
            };
          });

          // Check if full Sep 25 to Oct 6 seed data and Retention seed are present
          const hasSep25Seed = normalized.some((c) => c.id && c.id.startsWith("REC-20260925"));
          const hasRetentionSeed = normalized.some((c) => c.id && c.id.startsWith("REC-RETENTION-"));
          if (!hasSep25Seed || !hasRetentionSeed) {
            const seed = getInitialCrmSeed();
            const retentionSeed = seed.filter((c) => c.id.startsWith("REC-RETENTION-"));
            const userCreated = normalized.filter((c) => !c.id.startsWith("LEAD-10") && !c.id.startsWith("WALK-10") && !c.id.startsWith("REC-"));
            const merged = hasSep25Seed
              ? [...retentionSeed, ...normalized.filter((c) => !c.id.startsWith("REC-RETENTION-"))]
              : [...seed, ...userCreated];
            setClients(merged);
            localStorage.setItem("tt_salon_leads", JSON.stringify(merged));
            return;
          }

          setClients(normalized);
          return;
        }
      }
    } catch {}

    const seed = getInitialCrmSeed();
    localStorage.setItem("tt_salon_leads", JSON.stringify(seed));
    setClients(seed);
  };

  const saveClients = (newClients: SalonClientRecord[]) => {
    setClients(newClients);
    localStorage.setItem("tt_salon_leads", JSON.stringify(newClients));
  };

  // PASSCODE LOGIN
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = passcode.trim();
    const custom = localStorage.getItem("tt_portal_custom_passcode");

    let valid = false;
    if (custom && custom.trim().length > 0) {
      valid = entered === custom.trim();
    } else {
      valid = entered.toLowerCase() === "salon2026" || entered.toLowerCase() === "teazed2026";
    }

    if (valid) {
      sessionStorage.setItem("tt_portal_authenticated", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid passcode. Factory default is 'salon2026'.");
    }
  };

  const handleLockPortal = () => {
    sessionStorage.removeItem("tt_portal_authenticated");
    setIsAuthenticated(false);
    setPasscode("");
  };

  const handleExitToWebsite = () => {
    sessionStorage.removeItem("tt_portal_authenticated");
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("portal");
      window.history.pushState({}, "", url.pathname);
      window.location.hash = "";
    }
    if (onExit) onExit();
  };

  // Change Passcode
  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeErrorMsg("");
    setPasscodeSuccessMsg("");

    const custom = localStorage.getItem("tt_portal_custom_passcode");
    const activePass = custom && custom.trim().length > 0 ? custom.trim() : "salon2026";

    if (currentCodeInput.trim() !== activePass && currentCodeInput.trim() !== "salon2026") {
      setPasscodeErrorMsg("Current passcode is incorrect.");
      return;
    }

    if (!newCodeInput.trim() || newCodeInput.trim().length < 4) {
      setPasscodeErrorMsg("New passcode must be at least 4 characters.");
      return;
    }

    if (newCodeInput.trim() !== confirmCodeInput.trim()) {
      setPasscodeErrorMsg("New passcodes do not match.");
      return;
    }

    localStorage.setItem("tt_portal_custom_passcode", newCodeInput.trim());
    setHasCustomPasscode(true);
    setPasscodeSuccessMsg("✓ Passcode updated successfully!");
    setCurrentCodeInput("");
    setNewCodeInput("");
    setConfirmCodeInput("");
  };

  const handleResetPasscodeToDefault = () => {
    if (confirm("Reset passcode back to factory default 'salon2026'?")) {
      localStorage.removeItem("tt_portal_custom_passcode");
      setHasCustomPasscode(false);
      setPasscodeSuccessMsg("✓ Passcode has been reset to factory default: salon2026");
      setPasscodeErrorMsg("");
    }
  };

  const handleStatusChange = (id: string, newStatus: ClientStatus) => {
    const updated = clients.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    saveClients(updated);
  };

  const handleAddWalkInClient = (newRecord: SalonClientRecord) => {
    const updated = [newRecord, ...clients];
    saveClients(updated);
  };

  const handleSaveEditedClient = (updatedRecord: SalonClientRecord) => {
    const updated = clients.map((c) => (c.id === updatedRecord.id ? updatedRecord : c));
    saveClients(updated);
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (confirm(`Delete record for ${name}?`)) {
      const updated = clients.filter((c) => c.id !== id);
      saveClients(updated);
    }
  };

  // CALENDAR COMPUTATION
  const calendarData = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayClients = clients.filter((c) => c.date === dateKey);
      const convertedCount = dayClients.filter((c) => c.status === "converted").length;

      days.push({
        dayNumber: d,
        dateKey,
        count: dayClients.length,
        convertedCount,
      });
    }

    return days;
  }, [calendarMonth, clients]);

  // Unique Dates List for Quick Filter
  const quickDatesList = useMemo(() => {
    const countsMap: Record<string, number> = {};
    clients.forEach((c) => {
      if (c.date) countsMap[c.date] = (countsMap[c.date] || 0) + 1;
    });
    return Object.entries(countsMap).sort((a, b) => b[0].localeCompare(a[0]));
  }, [clients]);

  // SCOPE FILTERED CLIENTS (Day vs All-Time)
  const scopeClients = useMemo(() => {
    if (scopeMode === "day") {
      return clients.filter((c) => c.date === selectedDateFilter);
    }
    return clients;
  }, [clients, scopeMode, selectedDateFilter]);

  // KPI Computations for the Active Scope
  const scopeTotal = scopeClients.length;
  const scopeConverted = scopeClients.filter((c) => c.status === "converted").length;
  const scopeConversionRate = scopeTotal > 0 ? Math.round((scopeConverted / scopeTotal) * 100) : 0;
  const scopeEstRevenue = scopeClients
    .filter((c) => c.status === "converted")
    .reduce((sum, c) => sum + (c.netCash || 0), 0);
  const scopePending = scopeClients.filter((c) => c.status === "new" || c.status === "contacted").length;

  const scopeWalkIns = scopeClients.filter((c) => c.channel === "walk_in");
  const scopeOnline = scopeClients.filter((c) => c.channel === "online");
  const scopeWalkInCash = scopeWalkIns.reduce((sum, c) => sum + (c.netCash || 0), 0);
  const scopeOnlineCash = scopeOnline.reduce((sum, c) => sum + (c.netCash || 0), 0);

  // Retention Due Clients Count (4 to 6+ Weeks Elapsed)
  const dueClientsCount = useMemo(() => {
    return clients.filter((c) => {
      const { isDue } = getClientElapsedInfo(c.date);
      return isDue && c.status !== "lost";
    }).length;
  }, [clients]);

  // FINAL FILTERED CLIENTS FOR DISPLAY TABLE
  const displayedClients = useMemo(() => {
    // When "due_for_visit" tab is active, look across all clients
    const baseList = statusFilter === "due_for_visit" ? clients : scopeClients;
    return baseList.filter((c) => {
      if (channelFilter !== "all" && c.channel !== channelFilter) return false;
      if (statusFilter === "due_for_visit") {
        const { isDue } = getClientElapsedInfo(c.date);
        if (!isDue) return false;
      } else if (statusFilter !== "all" && c.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.firstName.toLowerCase().includes(q);
        const matchPhone = c.phone.toLowerCase().includes(q);
        const matchService = c.service.toLowerCase().includes(q);
        const matchStylist = c.stylistName?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchService && !matchStylist) return false;
      }
      return true;
    });
  }, [scopeClients, clients, channelFilter, statusFilter, searchQuery]);

  // Format Date for UI Banner
  const formattedScopeDate = useMemo(() => {
    try {
      const parts = selectedDateFilter.split("-");
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    } catch {
      return selectedDateFilter;
    }
  }, [selectedDateFilter]);

  const shortMonthDay = useMemo(() => {
    const parts = selectedDateFilter.split("-");
    return `${parts[1]}-${parts[2]}`;
  }, [selectedDateFilter]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a2e22] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#f7f9f2] rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 text-[#1a2e22]">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#1a2e22] text-[#f7f9f2] flex items-center justify-center mx-auto mb-3 shadow-lg font-serif font-bold text-2xl tracking-wider">
              TT
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              Texas Teazed Staff Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#1a2e22]/70 mt-1">
              Confidential Staff Lead Portal & Salon Management
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1a2e22]/70 mb-1.5">
                Staff Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1a2e22]/25 bg-white text-[#1a2e22] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1a2e22] text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-3 text-[#1a2e22]/60 hover:text-[#1a2e22]"
                >
                  {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1a2e22] text-[#f7f9f2] font-semibold hover:bg-[#1a2e22]/90 shadow transition text-sm flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-[#842323]" />
              Unlock Staff Portal
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1a2e22]/15 text-center space-y-2">
            <p className="text-[11px] text-[#1a2e22]/60">
              Factory Default Passcode: <span className="font-bold text-[#1a2e22]">salon2026</span>
            </p>
            <button
              onClick={handleExitToWebsite}
              className="text-xs text-[#1a2e22]/70 hover:text-[#1a2e22] font-medium flex items-center justify-center gap-1.5 mx-auto transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Public Salon Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9f2] text-[#1a2e22] selection:bg-[#842323] selection:text-white font-sans p-3 sm:p-5 lg:p-7">
      <div className="max-w-[1440px] mx-auto space-y-4 sm:space-y-5">
        
        {/* CARD 1: TOP HEADER BAR (Exact Format from Image 1) */}
        <header className="bg-white rounded-2xl shadow-sm border border-[#1a2e22]/15 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#1a2e22] text-[#f7f9f2] flex items-center justify-center font-serif font-bold text-xl tracking-wider shadow">
              TT
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1a2e22] tracking-tight">
                  Texas Teazed Staff Lead Portal
                </h1>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#1a2e22]/30 text-[#1a2e22]/80 uppercase tracking-wider">
                  LIVE SYNC
                </span>
              </div>
              <p className="text-xs text-[#1a2e22]/70 mt-0.5">
                2605 Marina Bay Dr, League City, TX 77573 • Salon Line: (281) 957-9602
              </p>
            </div>
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsStaffManagerOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-[#1a2e22]/30 bg-white hover:bg-[#1a2e22]/5 text-[#1a2e22] text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Users className="w-4 h-4 text-[#1a2e22]" />
              Team Staff ({staffList.filter((s) => s.active).length} Active)
            </button>

            <button
              onClick={() => setIsDailyZOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-[#1a2e22]/30 bg-white hover:bg-[#1a2e22]/5 text-[#1a2e22] text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="End-of-Day Z-Report"
            >
              <Moon className="w-4 h-4 text-[#842323]" />
              Daily Z-Report
            </button>

            <button
              onClick={() => setIsReportsOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#1a2e22] text-white text-xs font-semibold hover:bg-[#1a2e22]/90 transition flex items-center gap-1.5 shadow"
            >
              <BarChart3 className="w-4 h-4 text-[#d4af37]" />
              Reports & CSV Export
            </button>

            <button
              onClick={() => setIsChangePasscodeOpen(true)}
              className="px-3 py-2 rounded-xl border border-[#1a2e22]/30 bg-white hover:bg-[#1a2e22]/5 text-[#1a2e22] text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="Change Passcode"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#1a2e22]/70" />
              Change Passcode
            </button>

            <button
              onClick={handleLockPortal}
              className="px-3 py-2 rounded-xl border border-[#1a2e22]/30 bg-white hover:bg-[#1a2e22]/5 text-[#1a2e22] text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="Lock Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#1a2e22]/70" />
              Lock
            </button>

            <button
              onClick={handleExitToWebsite}
              className="px-4 py-2 rounded-xl bg-[#842323] hover:bg-[#6e1c1c] text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <LogOut className="w-3.5 h-3.5" />
              EXIT PORTAL
            </button>
          </div>
        </header>

        {/* CARD 2: CONVERSION METRICS SCOPE & CHANNEL FILTER BAR (Exact Format from Image 1) */}
        <section className="bg-white rounded-2xl shadow-sm border border-[#1a2e22]/15 p-4 sm:p-5 space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a2e22] text-[#f7f9f2] flex items-center justify-center shrink-0">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a2e22]/60">
                    CONVERSION METRICS SCOPE:
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1a2e22]/10 text-[#1a2e22] uppercase">
                    {scopeMode === "day"
                      ? `DAY PERFORMANCE: ${formattedScopeDate}`
                      : "ALL-TIME SALON PERFORMANCE"}
                  </span>
                </div>
                <p className="text-xs text-[#1a2e22]/70 mt-0.5">
                  {scopeMode === "day"
                    ? `Showing exact leads count, booked conversions, and conversion rate for ${formattedScopeDate}.`
                    : "Showing all-time historical salon conversion metrics across all dates."}
                </p>
              </div>
            </div>

            {/* DAY vs ALL-TIME TOGGLE */}
            <div className="flex items-center bg-[#f7f9f2] p-1 rounded-xl border border-[#1a2e22]/15 self-start md:self-center">
              <button
                onClick={() => setScopeMode("day")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  scopeMode === "day"
                    ? "bg-[#1a2e22] text-white shadow"
                    : "text-[#1a2e22]/70 hover:text-[#1a2e22]"
                }`}
              >
                Day: {shortMonthDay}
              </button>
              <button
                onClick={() => setScopeMode("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  scopeMode === "all"
                    ? "bg-[#1a2e22] text-white shadow"
                    : "text-[#1a2e22]/70 hover:text-[#1a2e22]"
                }`}
              >
                All-Time ({clients.length})
              </button>
            </div>
          </div>

          {/* CHANNEL FILTER ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#1a2e22]/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a2e22]/60 mr-1">
                CHANNEL FILTER:
              </span>

              <button
                onClick={() => setChannelFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  channelFilter === "all"
                    ? "bg-[#1a2e22] text-white"
                    : "bg-white border border-[#1a2e22]/20 text-[#1a2e22]/80 hover:bg-[#1a2e22]/5"
                }`}
              >
                All Bookings ({scopeTotal})
              </button>

              <button
                onClick={() => setChannelFilter("walk_in")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                  channelFilter === "walk_in"
                    ? "bg-[#1a2e22] text-white"
                    : "bg-white border border-[#1a2e22]/20 text-[#1a2e22]/80 hover:bg-[#1a2e22]/5"
                }`}
              >
                <span>🚶 {shortMonthDay} • {scopeWalkIns.length} Walk-In Customer</span>
                <span className="font-bold">${formatMoney(scopeWalkInCash)}</span>
              </button>

              <button
                onClick={() => setChannelFilter("online")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                  channelFilter === "online"
                    ? "bg-[#1a2e22] text-white"
                    : "bg-white border border-[#1a2e22]/20 text-[#1a2e22]/80 hover:bg-[#1a2e22]/5"
                }`}
              >
                <span>🌐 Online Website Leads ({scopeOnline.length})</span>
                <span className="font-bold">${formatMoney(scopeOnlineCash)}</span>
              </button>
            </div>

            <button
              onClick={() => setScopeMode(scopeMode === "day" ? "all" : "day")}
              className="text-xs text-[#1a2e22]/70 hover:text-[#1a2e22] font-semibold flex items-center gap-1 transition"
            >
              {scopeMode === "day" ? "Switch to All-Time Overview ›" : "Switch to Single Day View ›"}
            </button>
          </div>
        </section>

        {/* 5 KPI CARDS ROW (Exact Format from Image 1) */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Card 1 */}
          <div className="bg-white p-4 rounded-2xl border border-[#1a2e22]/15 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#1a2e22]/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {scopeMode === "day" ? "DAY INQUIRIES" : "TOTAL INQUIRIES"}
              </span>
              <Users className="w-4 h-4" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1a2e22]">
                {scopeTotal}
              </p>
              <p className="text-[11px] text-[#1a2e22]/60 mt-0.5">
                • {scopeMode === "day" ? `On ${shortMonthDay}` : "All-Time Records"}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 rounded-2xl border border-[#1a2e22]/15 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#1a2e22]/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                CONVERTED / BOOKED
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1a2e22]">
                {scopeConverted}
              </p>
              <p className="text-[11px] text-[#1a2e22]/60 mt-0.5">
                • {scopeConverted} of {scopeTotal} converted on this {scopeMode === "day" ? "day" : "period"}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 rounded-2xl border border-[#1a2e22]/15 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#1a2e22]/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                CONVERSION RATE
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1a2e22]">
                {scopeConversionRate}%
              </p>
              <p className="text-[11px] text-[#1a2e22]/60 mt-0.5">
                {scopeConversionRate}% successful client bookings
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-4 rounded-2xl border border-[#1a2e22]/15 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#1a2e22]/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                EST. BOOKED REVENUE
              </span>
              <span className="text-xs font-bold text-amber-700">$</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1a2e22]">
                ${formatMoney(scopeEstRevenue)}
              </p>
              <p className="text-[11px] text-[#1a2e22]/60 mt-0.5">
                • From {shortMonthDay}&apos;s bookings
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-4 rounded-2xl border border-[#1a2e22]/15 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-[#1a2e22]/60">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                PENDING FOLLOW-UPS
              </span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#1a2e22]">
                {scopePending}
              </p>
              <p className="text-[11px] text-[#1a2e22]/60 mt-0.5">
                {scopePending === 0 ? "✓ All inquiries addressed" : `${scopePending} need attention`}
              </p>
            </div>
          </div>
        </section>

        {/* MAIN 2-COLUMN SECTION (CALENDAR & QUICK DATES ON LEFT, CLIENT LIST ON RIGHT) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT COLUMN: CALENDAR + QUICK DATES + BIG WALK-IN BUTTON (~32% width) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* MINI CALENDAR (Exact Format from Image 1 & 2) */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#1a2e22]/15 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#842323]" />
                  <h3 className="font-serif font-bold text-sm text-[#1a2e22]">
                    {calendarMonth.toLocaleString("default", { month: "long" })} {calendarMonth.getFullYear()}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
                    }
                    className="p-1 rounded-md hover:bg-[#1a2e22]/5 text-[#1a2e22]/70"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCalendarMonth(new Date(2026, 9, 1));
                      setSelectedDateFilter("2026-10-05");
                      setScopeMode("day");
                    }}
                    className="px-2 py-0.5 rounded-md border border-[#1a2e22]/20 text-[10px] font-semibold text-[#1a2e22]"
                  >
                    Today
                  </button>
                  <button
                    onClick={() =>
                      setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                    }
                    className="p-1 rounded-md hover:bg-[#1a2e22]/5 text-[#1a2e22]/70"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CALENDAR GRID */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
                  <div key={day} className="text-[10px] font-bold text-[#1a2e22]/50 py-0.5">
                    {day}
                  </div>
                ))}

                {calendarData.map((item, idx) => {
                  if (!item) {
                    return <div key={`empty-${idx}`} className="h-10 rounded-lg" />;
                  }

                  const isSelected = selectedDateFilter === item.dateKey && scopeMode === "day";

                  return (
                    <button
                      key={item.dateKey}
                      onClick={() => {
                        setSelectedDateFilter(item.dateKey);
                        setScopeMode("day");
                      }}
                      className={`h-11 rounded-lg p-0.5 flex flex-col items-center justify-between transition text-xs ${
                        isSelected
                          ? "border-2 border-[#1a2e22] bg-[#f7f9f2] font-bold"
                          : item.count > 0
                          ? "hover:bg-[#1a2e22]/5"
                          : "text-[#1a2e22]/60 hover:bg-[#1a2e22]/5"
                      }`}
                    >
                      <span className="text-[11px] font-semibold">{item.dayNumber}</span>
                      {item.count > 0 && (
                        <span className="text-[9px] font-semibold text-[#1a2e22]/80 leading-tight">
                          {item.count} {item.convertedCount > 0 ? `(${Math.round((item.convertedCount / item.count) * 100)}%)` : ""}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK DATE FILTER (Exact Format from Image 2) */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#1a2e22]/15 p-4 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a2e22]/60 block">
                QUICK DATE FILTER:
              </span>

              <div className="flex flex-wrap gap-1.5">
                {quickDatesList.slice(0, 12).map(([dStr, count]) => {
                  const parts = dStr.split("-");
                  const label = `${parts[1]}-${parts[2]}`;
                  const isSelected = selectedDateFilter === dStr && scopeMode === "day";

                  return (
                    <button
                      key={dStr}
                      onClick={() => {
                        setSelectedDateFilter(dStr);
                        setScopeMode("day");
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        isSelected
                          ? "bg-[#1a2e22] text-white"
                          : "bg-white border border-[#1a2e22]/20 text-[#1a2e22]/80 hover:bg-[#1a2e22]/5"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setScopeMode("all")}
                className="w-full py-2 rounded-xl border border-[#1a2e22]/25 text-xs font-semibold text-[#1a2e22] hover:bg-[#1a2e22]/5 transition text-center mt-2"
              >
                View All {quickDatesList.length} Days ({clients.length} Leads)
              </button>
            </div>

            {/* BIG SOLID BURGUNDY ADD WALK-IN BUTTON (Exact Format from Image 2) */}
            <button
              onClick={() => setIsWalkInOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-[#842323] hover:bg-[#6e1c1c] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              + + ADD WALK-IN / PHONE LEAD
            </button>
          </div>

          {/* RIGHT COLUMN: CLIENT LIST & ACTIVITY CARDS (~68% width) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* TOP BAR WITH DATE & STATUS TABS (Exact Format from Image 1 & 2) */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#1a2e22]/15 p-4 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-serif font-bold text-[#1a2e22]">
                      {statusFilter === "due_for_visit"
                        ? "6-Week Client Retention Engine"
                        : scopeMode === "day"
                        ? formattedScopeDate
                        : "All-Time Historical Register"}
                    </h2>
                    {statusFilter === "due_for_visit" ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#842323] text-white">
                        {displayedClients.length} DUE FOR VISIT
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#1a2e22]/30 text-[#1a2e22]">
                        {scopeConversionRate}% CONVERSION
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#1a2e22]/70 mt-0.5">
                    {statusFilter === "due_for_visit"
                      ? `Showing ${displayedClients.length} clients whose previous visit was 4 to 6+ weeks ago • Send 1-click text reminders to rebook`
                      : `Showing ${displayedClients.length} leads • ${scopeConverted} Converted Bookings (${scopeConversionRate}% conversion rate)`}
                  </p>
                </div>

                {/* STATUS FILTER TABS */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {(["all", "new", "contacted", "converted", "lost", "due_for_visit"] as const).map((st) => {
                    const label =
                      st === "all"
                        ? "ALL"
                        : st === "new"
                        ? "NEW"
                        : st === "contacted"
                        ? "CONTACTED"
                        : st === "converted"
                        ? "CONVERTED (BOOKED)"
                        : st === "lost"
                        ? "LOST"
                        : `⏰ DUE FOR VISIT (${dueClientsCount})`;

                    const isActive = statusFilter === st;

                    return (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition shrink-0 ${
                          isActive
                            ? st === "due_for_visit"
                              ? "bg-[#842323] text-white shadow"
                              : "bg-[#1a2e22] text-white"
                            : st === "due_for_visit"
                            ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                            : "text-[#1a2e22]/70 hover:text-[#1a2e22] hover:bg-[#1a2e22]/5"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#1a2e22]/40" />
                <input
                  type="text"
                  placeholder="Search client by name (e.g. Rambo), phone, email, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1a2e22]/20 bg-white text-xs sm:text-sm text-[#1a2e22] focus:outline-none focus:ring-2 focus:ring-[#1a2e22] placeholder:text-[#1a2e22]/40"
                />
              </div>
            </div>

            {/* LUXURY CLIENT CARDS LIST (Exact Format from Image 2) */}
            <div className="space-y-3.5">
              {displayedClients.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#1a2e22]/15 p-8 text-center space-y-2">
                  <p className="font-serif text-lg text-[#1a2e22] font-semibold">
                    No client records found for this selection.
                  </p>
                  <p className="text-xs text-[#1a2e22]/60">
                    Try switching date in the calendar or clearing search filters.
                  </p>
                </div>
              ) : (
                displayedClients.map((client) => {
                  const elapsed = getClientElapsedInfo(client.date);

                  return (
                    <div
                      key={client.id}
                      className="bg-white rounded-2xl shadow-sm border border-[#1a2e22]/15 p-4 sm:p-5 hover:border-[#1a2e22]/30 transition space-y-3"
                    >
                      {/* TOP ROW: NAME & BADGES ON LEFT, PRICING & BREAKDOWN ON RIGHT */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1a2e22]">
                              {client.firstName}
                            </h3>

                            {/* CHANNEL BADGE */}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#1a2e22]/30 uppercase text-[#1a2e22] flex items-center gap-1">
                              {client.channel === "walk_in" ? "🚶 WALK-IN CUSTOMER" : "🌐 ONLINE WEBSITE LEAD"}
                            </span>

                            {/* STATUS BADGE */}
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#1a2e22]/30 uppercase text-[#1a2e22]">
                              ✓ {client.status.toUpperCase()} (BOOKED)
                            </span>

                            {/* RETENTION DUE BADGE IF 4+ WEEKS AGO */}
                            {elapsed.isDue && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-700" />
                                DUE FOR VISIT ({elapsed.weeks} WKS AGO)
                              </span>
                            )}
                          </div>

                          {/* SERVICE & STYLIST */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-[#1a2e22]/80">
                            <span>
                              <span className="font-semibold text-[#842323]">Service:</span>{" "}
                              <span className="font-bold text-[#1a2e22]">{client.service}</span>
                            </span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-md bg-[#1a2e22]/5 font-semibold text-[#1a2e22]">
                              Attending Stylist: {client.stylistName || INITIAL_STAFF_MEMBERS[0].name}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT PRICING BLOCK (Exact Layout from Image 2) */}
                        <div className="text-left sm:text-right shrink-0">
                          <div className="flex items-center sm:justify-end gap-2">
                            <span className="font-serif font-bold text-xl sm:text-2xl text-[#1a2e22]">
                              ${formatMoney(client.netCash)}
                            </span>

                            {client.actualPrice > client.netCash && (
                              <span className="text-xs text-[#1a2e22]/50 line-through">
                                ${formatMoney(client.actualPrice)}
                              </span>
                            )}

                            {client.discountAmount > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#1a2e22]/30 text-[#1a2e22] flex items-center gap-1">
                                <Tag className="w-3 h-3 text-[#842323]" />
                                SAVE ${formatMoney(client.discountAmount)} ({formatPercent(client.discountPercent)}% OFF)
                              </span>
                            )}

                            <button
                              onClick={() => setEditingClient(client)}
                              className="p-1 rounded hover:bg-[#1a2e22]/10 text-[#1a2e22]/70"
                              title="Edit Pricing & Formula"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] text-[#1a2e22]/70 mt-0.5">
                            Actual ${formatMoney(client.actualPrice)} - Discount ${formatMoney(client.discountAmount)} = ${formatMoney(client.netCash)}
                          </div>

                          {client.discountReason && (
                            <div className="text-[10px] text-[#842323] font-medium mt-0.5">
                              • {client.discountReason} (Actual ${formatMoney(client.actualPrice)} - Discount ${formatMoney(client.discountAmount)} = ${formatMoney(client.netCash)})
                            </div>
                          )}

                          <div className="text-[10px] text-[#1a2e22]/50 mt-0.5">
                            {client.date} @ {client.time || "11:30 AM"}
                          </div>
                        </div>
                      </div>

                      {/* CONTACT BADGES ROW */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        {client.phone && (
                          <span className="px-2.5 py-1 rounded-lg bg-[#f7f9f2] border border-[#1a2e22]/15 text-[#1a2e22] font-semibold flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#1a2e22]/60" />
                            {client.phone}
                          </span>
                        )}

                        {client.phone && (
                          <a
                            href={`sms:${client.phone}`}
                            className="px-2.5 py-1 rounded-lg bg-[#f7f9f2] border border-[#1a2e22]/15 text-[#1a2e22] font-semibold hover:bg-[#1a2e22]/10 transition flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#1a2e22]/60" />
                            Quick SMS
                          </a>
                        )}

                        {client.email && (
                          <span className="px-2.5 py-1 rounded-lg bg-[#f7f9f2] border border-[#1a2e22]/15 text-[#1a2e22]/80 font-medium flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#1a2e22]/60" />
                            {client.email}
                          </span>
                        )}

                        <div className="flex items-center gap-1.5 ml-auto">
                          {/* 1-CLICK TEXT REMINDER (FOR 6-WEEK RETENTION ENGINE) */}
                          <button
                            onClick={() => setRetentionClient(client)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                              elapsed.isDue
                                ? "bg-[#842323] hover:bg-[#6e1c1c] text-white"
                                : "bg-[#1a2e22]/10 hover:bg-[#1a2e22]/20 text-[#1a2e22]"
                            }`}
                            title="Send 1-Click Rebooking Text Reminder (4-6 Weeks Retention)"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            1-Click Text Reminder
                          </button>

                          {/* 1-CLICK LUXURY DIGITAL BILL / RECEIPT (WhatsApp / SMS / Thermal Print) */}
                          <button
                            onClick={() => setReceiptClient(client)}
                            className="px-3 py-1 rounded-lg bg-[#1a2e22] hover:bg-[#13231a] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                            title="Open 1-Click WhatsApp & SMS Digital Bill / Luxury Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5 text-[#c5a880]" />
                            1-Click Digital Bill
                          </button>
                        </div>
                      </div>

                      {/* QUOTE / NOTES BOX (Exact Format from Image 2) */}
                      {(client.formulaNotes || client.message || client.discountReason) && (
                        <div className="p-3 rounded-xl bg-[#f7f9f2] border border-[#1a2e22]/10 flex items-start justify-between gap-2 text-xs italic text-[#1a2e22]/80">
                          <p>
                            &quot;{client.formulaNotes || client.message || `Walk-in customer today! Attended by ${client.stylistName || INITIAL_STAFF_MEMBERS[0].name} for ${client.service}. $${client.discountAmount} counter discount, billed $${client.netCash}.`}&quot;
                          </p>
                          <button
                            onClick={() => setEditingClient(client)}
                            className="p-1 text-[#1a2e22]/50 hover:text-[#1a2e22] shrink-0 not-italic"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* BOTTOM ROW: SET STATUS DROPDOWN & DELETE */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#1a2e22]/10 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold uppercase tracking-wider text-[10px] text-[#1a2e22]/60">
                            SET STATUS:
                          </span>
                          <select
                            value={client.status}
                            onChange={(e) =>
                              handleStatusChange(client.id, e.target.value as ClientStatus)
                            }
                            className="px-2.5 py-1 rounded-lg border border-[#1a2e22]/25 bg-white text-xs font-semibold text-[#1a2e22] cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted (Booked)</option>
                            <option value="lost">Lost</option>
                          </select>
                        </div>

                        <button
                          onClick={() => handleDeleteClient(client.id, client.firstName)}
                          className="text-[#842323] hover:text-[#6e1c1c] font-semibold text-xs flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* BOTTOM FOOTER NOTICE (Exact from Image 2) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 text-[11px] text-[#1a2e22]/60 border-t border-[#1a2e22]/15">
              <span>🔒 Staff confidential lead record • Saved in real-time</span>
              <div className="flex items-center gap-2">
                <span>Texas Teazed Salon Desk (281) 957-9602</span>
                <span>•</span>
                <button
                  onClick={handleExitToWebsite}
                  className="hover:underline font-medium text-[#1a2e22]"
                >
                  Exit Portal
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ALL MODALS */}
      <WalkInPosModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        staffList={staffList}
        onAddClient={handleAddWalkInClient}
      />

      <StaffManagerModal
        isOpen={isStaffManagerOpen}
        onClose={() => setIsStaffManagerOpen(false)}
        staffList={staffList}
        onUpdateStaffList={handleUpdateStaffList}
      />

      <EditPricingModal
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient}
        staffList={staffList}
        onSave={handleSaveEditedClient}
      />

      <CrmReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        clients={clients}
        staffList={staffList}
      />

      <DailyZReportModal
        isOpen={isDailyZOpen}
        onClose={() => setIsDailyZOpen(false)}
        clients={clients}
        staffList={staffList}
        reportDate={selectedDateFilter}
      />

      <DigitalReceiptModal
        isOpen={!!receiptClient}
        onClose={() => setReceiptClient(null)}
        client={receiptClient}
        staffList={staffList}
      />

      <RetentionReminderModal
        isOpen={!!retentionClient}
        onClose={() => setRetentionClient(null)}
        client={retentionClient}
        weeksElapsed={retentionClient ? getClientElapsedInfo(retentionClient.date).weeks : 5}
        daysElapsed={retentionClient ? getClientElapsedInfo(retentionClient.date).diffDays : 35}
        onMarkContacted={(id) => {
          handleStatusChange(id, "contacted");
        }}
      />

      {/* PASSCODE SETTINGS MODAL */}
      {isChangePasscodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#f7f9f2] rounded-2xl shadow-2xl border border-[#1a2e22]/20 p-5 sm:p-6 text-[#1a2e22]">
            <button
              onClick={() => setIsChangePasscodeOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#1a2e22]/60 hover:text-[#1a2e22] hover:bg-[#1a2e22]/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-[#1a2e22]/15 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1a2e22] text-[#f7f9f2] flex items-center justify-center shadow">
                <KeyRound className="w-5 h-5 text-[#842323]" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1a2e22]">
                  CRM Passcode Settings
                </h3>
                <p className="text-xs text-[#1a2e22]/70">
                  {hasCustomPasscode ? "Private Passcode Configured" : "Factory Default: salon2026"}
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePasscode} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#1a2e22]/70 mb-1">
                  Current Passcode *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current passcode"
                  value={currentCodeInput}
                  onChange={(e) => setCurrentCodeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1a2e22]/20 bg-white text-[#1a2e22]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1a2e22]/70 mb-1">
                  New Private Passcode *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 4 characters"
                  value={newCodeInput}
                  onChange={(e) => setNewCodeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1a2e22]/20 bg-white text-[#1a2e22]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1a2e22]/70 mb-1">
                  Confirm New Passcode *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new passcode"
                  value={confirmCodeInput}
                  onChange={(e) => setConfirmCodeInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#1a2e22]/20 bg-white text-[#1a2e22]"
                />
              </div>

              {passcodeErrorMsg && (
                <div className="p-2 rounded-lg bg-red-100 text-red-900 font-semibold">
                  {passcodeErrorMsg}
                </div>
              )}

              {passcodeSuccessMsg && (
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 font-semibold">
                  {passcodeSuccessMsg}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetPasscodeToDefault}
                  className="text-[#842323] hover:underline font-semibold"
                >
                  Reset to Default
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1a2e22] text-[#f7f9f2] font-semibold hover:bg-[#1a2e22]/90 transition shadow"
                >
                  Save Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
