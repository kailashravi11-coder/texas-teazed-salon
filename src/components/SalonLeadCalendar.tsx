import { useState, useEffect, useMemo } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Filter, 
  Search,
  ExternalLink,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface LeadItem {
  id: string;
  firstName: string;
  phone: string;
  email: string;
  service: string;
  message?: string;
  submittedAt: string; // ISO string
  status?: "new" | "contacted" | "scheduled";
}

// Initial realistic seed data for Houston / League City Texas Teazed salon
function getInitialSeedLeads(): LeadItem[] {
  const now = new Date();
  
  const createLead = (daysAgo: number, hoursAgo: number, name: string, phone: string, email: string, service: string, msg: string, status: "new" | "contacted" | "scheduled"): LeadItem => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(now.getHours() - hoursAgo, 15, 0);
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
    createLead(0, 3, "Amanda Rodriguez", "(832) 902-3341", "amanda.rod@yahoo.com", "Custom Color Architecture - $250+", "First time client, wanting full highlights and root melt.", "new"),
    createLead(0, 5, "Brittany Taylor", "(713) 614-7809", "btaylor89@gmail.com", "Teazed Luxe Blowout - $55+", "Need blowout for an evening anniversary dinner.", "contacted"),
    createLead(1, 2, "Jessica Miller", "(281) 778-1290", "jmiller.tx@gmail.com", "Dimensional Brunette - $210+", "Transitioning back from blonde to rich espresso brown.", "scheduled"),
    createLead(1, 4, "Courtney Hayes", "(832) 419-5562", "chayes.league@outlook.com", "All-Over Gloss & Refresh - $90+", "Roots freshened up and gloss toner.", "contacted"),
    createLead(1, 7, "Rachel Vance", "(713) 304-9812", "rvance@gmail.com", "Haircut & Custom Style - $75+", "Short layered bob trim.", "scheduled"),
    createLead(2, 3, "Danielle Scott", "(281) 682-9901", "dscott.tx@icloud.com", "Signature Balayage - $220+", "Consultation + Balayage touch-up.", "scheduled"),
    createLead(2, 6, "Kayla Morgan", "(832) 554-1182", "kmorgan88@gmail.com", "Crown Foil Placement - $160+", "Highlights on top and crown.", "contacted"),
    createLead(3, 2, "Megan Cooper", "(281) 991-3420", "mcooper@gmail.com", "Platinum Blonde Refresh - $240+", "Toner and root lift.", "scheduled"),
    createLead(3, 5, "Heather Wright", "(713) 489-0211", "hwright@yahoo.com", "Brazilian Blowout Treatment - $280+", "Keratin smoothing treatment.", "scheduled"),
    createLead(4, 4, "Lauren Bennett", "(832) 712-4490", "lbennett@gmail.com", "Signature Balayage - $220+", "Subtle sun-kissed balayage.", "scheduled"),
  ];
}

function getLocalDateKey(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function SalonLeadCalendar({ onSelectLead }: { onSelectLead?: (lead: LeadItem) => void }) {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted" | "scheduled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load leads from storage or initialize with seed data
  useEffect(() => {
    const loadLeads = () => {
      try {
        const stored = localStorage.getItem("tt_salon_leads");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLeads(parsed);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to parse stored leads", err);
      }
      
      const seed = getInitialSeedLeads();
      localStorage.setItem("tt_salon_leads", JSON.stringify(seed));
      setLeads(seed);
    };

    loadLeads();

    // Listen for custom lead-submitted event from the booking form
    const handleNewLead = () => loadLeads();
    window.addEventListener("lead-submitted", handleNewLead);
    return () => window.removeEventListener("lead-submitted", handleNewLead);
  }, []);

  // Update lead status (e.g. mark as Contacted or Scheduled)
  const handleToggleStatus = (id: string, newStatus: "new" | "contacted" | "scheduled") => {
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

  // Map leads by day (YYYY-MM-DD string)
  const leadsByDate = useMemo(() => {
    const map: Record<string, LeadItem[]> = {};
    leads.forEach(lead => {
      const dateKey = getLocalDateKey(lead.submittedAt);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(lead);
    });
    return map;
  }, [leads]);

  // Selected date key
  const selectedDateKey = getLocalDateKey(selectedDate);
  const todayKey = getLocalDateKey(new Date());

  // Leads for selected date
  const leadsForSelectedDate = useMemo(() => {
    const dayLeads = leadsByDate[selectedDateKey] || [];
    return dayLeads.filter(lead => {
      const matchesStatus = statusFilter === "all" || (lead.status || "new") === statusFilter;
      const matchesSearch = !searchQuery || 
        lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.service.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [leadsByDate, selectedDateKey, statusFilter, searchQuery]);

  // Quick stats
  const todayLeadsCount = (leadsByDate[todayKey] || []).length;
  const monthLeadsCount = useMemo(() => {
    return leads.filter(l => {
      const d = new Date(l.submittedAt);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  }, [leads, year, month]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-[#112318] border border-beige/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl text-beige">
      {/* Top Banner & Salon Member Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-beige/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/20 border border-terracotta/40 text-terracotta text-xs font-semibold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Salon Lead Desk
            </span>
            <span className="text-xs text-beige/50 font-mono">
              Texas Teazed Hair Salon
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-beige">
            Daily Leads & Appointment Tracker
          </h3>
          <p className="text-beige/60 text-sm mt-1">
            Browse daily fresh inquiries, filter by calendar date, and track salon bookings.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <div className="bg-forest px-4 py-3 rounded-2xl border border-beige/15 text-center min-w-[110px]">
            <span className="text-[10px] uppercase tracking-wider text-beige/60 block">
              Today's Leads
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-terracotta font-bold flex items-center justify-center gap-1">
              {todayLeadsCount}
              <span className="text-xs text-emerald-400 font-sans font-normal">Active</span>
            </span>
          </div>

          <div className="bg-forest px-4 py-3 rounded-2xl border border-beige/15 text-center min-w-[110px]">
            <span className="text-[10px] uppercase tracking-wider text-beige/60 block">
              {monthNames[month]} Total
            </span>
            <span className="text-2xl sm:text-3xl font-serif text-beige font-bold">
              {monthLeadsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Leads List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Calendar Picker (5 cols) */}
        <div className="lg:col-span-5 bg-forest/70 p-5 sm:p-6 rounded-2xl border border-beige/15 flex flex-col justify-between">
          <div>
            {/* Month & Navigation Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-terracotta" />
                <h4 className="text-lg font-serif text-beige">
                  {monthNames[month]} {year}
                </h4>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                  className="p-2 rounded-full hover:bg-beige/10 text-beige/70 hover:text-beige transition-colors"
                  aria-label="Previous Month"
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
                  className="text-xs px-2.5 py-1 rounded-full border border-beige/20 text-beige/70 hover:text-beige hover:border-beige/40 transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                  className="p-2 rounded-full hover:bg-beige/10 text-beige/70 hover:text-beige transition-colors"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
                <span key={idx} className="text-[11px] font-semibold tracking-wider text-beige/40 uppercase py-1">
                  {day}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {/* Blank spaces for first day offset */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10 sm:h-11" />
              ))}

              {/* Day buttons */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateObj = new Date(year, month, dayNum);
                const dateKey = dateObj.toISOString().split("T")[0];
                const dayLeads = leadsByDate[dateKey] || [];
                const hasLeads = dayLeads.length > 0;
                const isSelected = dateKey === selectedDateKey;
                const isToday = dateKey === todayKey;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => setSelectedDate(dateObj)}
                    className={`relative h-10 sm:h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer text-xs font-medium ${
                      isSelected
                        ? "bg-terracotta text-white font-bold shadow-md scale-105 z-10"
                        : isToday
                        ? "bg-beige/15 text-beige border border-terracotta/40"
                        : hasLeads
                        ? "bg-forest hover:bg-beige/10 text-beige"
                        : "text-beige/40 hover:bg-beige/5 hover:text-beige/80"
                    }`}
                  >
                    <span>{dayNum}</span>
                    {/* Leads count dot / badge */}
                    {hasLeads && (
                      <span 
                        className={`text-[9px] px-1 rounded-full font-mono mt-0.5 leading-none ${
                          isSelected
                            ? "bg-white text-terracotta font-bold"
                            : "bg-emerald-500/20 text-emerald-400 font-bold"
                        }`}
                      >
                        {dayLeads.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="mt-6 pt-4 border-t border-beige/10 flex flex-wrap gap-2 text-xs">
            <span className="text-beige/40 self-center uppercase text-[10px] tracking-wider">Quick:</span>
            <button
              type="button"
              onClick={() => setSelectedDate(new Date())}
              className={`px-3 py-1 rounded-full transition-colors ${
                selectedDateKey === todayKey 
                  ? "bg-terracotta text-white font-semibold" 
                  : "bg-beige/10 text-beige/80 hover:bg-beige/20"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const y = new Date();
                y.setDate(y.getDate() - 1);
                setSelectedDate(y);
              }}
              className="px-3 py-1 rounded-full bg-beige/10 text-beige/80 hover:bg-beige/20 transition-colors"
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => {
                const t2 = new Date();
                t2.setDate(t2.getDate() - 2);
                setSelectedDate(t2);
              }}
              className="px-3 py-1 rounded-full bg-beige/10 text-beige/80 hover:bg-beige/20 transition-colors"
            >
              2 Days Ago
            </button>
          </div>
        </div>

        {/* Selected Day Leads Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            {/* Header for Day Leads */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-beige/10">
              <div>
                <h4 className="text-xl font-serif text-beige flex items-center gap-2">
                  <span>
                    {selectedDate.toLocaleDateString("en-US", { 
                      weekday: "short", 
                      month: "short", 
                      day: "numeric", 
                      year: "numeric" 
                    })}
                  </span>
                  {selectedDateKey === todayKey && (
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-sans font-semibold">
                      Today
                    </span>
                  )}
                </h4>
                <p className="text-xs text-beige/60 mt-0.5">
                  Showing {leadsForSelectedDate.length} lead{leadsForSelectedDate.length === 1 ? "" : "s"} for this date
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-forest p-1 rounded-xl border border-beige/15 text-xs">
                {(["all", "new", "contacted", "scheduled"] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      statusFilter === tab 
                        ? "bg-terracotta text-white font-semibold shadow-sm" 
                        : "text-beige/60 hover:text-beige"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search within leads */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-beige/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads by name, phone or service..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-forest/70 border border-beige/15 rounded-xl pl-9 pr-4 py-2 text-xs text-beige placeholder:text-beige/40 focus:outline-none focus:border-terracotta transition-colors"
              />
            </div>

            {/* Leads List */}
            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
              {leadsForSelectedDate.length === 0 ? (
                <div className="p-8 text-center bg-forest/30 border border-beige/10 rounded-2xl">
                  <Clock className="w-8 h-8 text-beige/30 mx-auto mb-2" />
                  <p className="text-beige/70 text-sm font-medium">
                    No leads recorded for this date.
                  </p>
                  <p className="text-beige/40 text-xs mt-1">
                    Select another calendar day or submit a test request in the form above to see it appear live!
                  </p>
                </div>
              ) : (
                leadsForSelectedDate.map(lead => {
                  const leadTime = new Date(lead.submittedAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                  });
                  const leadStatus = lead.status || "new";

                  return (
                    <div
                      key={lead.id}
                      className="bg-forest/80 hover:bg-forest p-4 sm:p-5 rounded-2xl border border-beige/15 transition-all shadow-sm group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-serif text-beige font-semibold">
                              {lead.firstName}
                            </span>
                            <span className="text-[11px] text-beige/50 font-mono">
                              at {leadTime}
                            </span>
                          </div>
                          <span className="inline-block mt-1 text-xs text-terracotta font-medium bg-terracotta/10 px-2 py-0.5 rounded-md border border-terracotta/20">
                            ✂️ {lead.service}
                          </span>
                        </div>

                        {/* Status Toggle Button */}
                        <div className="flex items-center gap-1.5 self-start">
                          <button
                            type="button"
                            title="Click to toggle status"
                            onClick={() => {
                              const nextStatus = leadStatus === "new" ? "contacted" : leadStatus === "contacted" ? "scheduled" : "new";
                              handleToggleStatus(lead.id, nextStatus);
                            }}
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-all border ${
                              leadStatus === "new"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                : leadStatus === "contacted"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                            }`}
                          >
                            ● {leadStatus}
                          </button>
                        </div>
                      </div>

                      {/* Client notes / message */}
                      {lead.message && (
                        <p className="text-xs text-beige/70 italic bg-black/20 p-2.5 rounded-xl border border-beige/5 mb-3 leading-relaxed">
                          "{lead.message}"
                        </p>
                      )}

                      {/* Quick Contact Bar for Salon Staff */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-beige/10 text-xs">
                        <div className="flex items-center gap-4">
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1.5 text-beige/80 hover:text-terracotta transition-colors font-mono"
                          >
                            <Phone className="w-3.5 h-3.5 text-terracotta" />
                            {lead.phone}
                          </a>
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="hidden sm:flex items-center gap-1.5 text-beige/60 hover:text-beige transition-colors truncate max-w-[180px]"
                            >
                              <Mail className="w-3.5 h-3.5 text-beige/50" />
                              {lead.email}
                            </a>
                          )}
                        </div>

                        {/* Direct SMS link button for salon team to text client */}
                        <a
                          href={`sms:${lead.phone.replace(/[^0-9]/g, '')}?&body=${encodeURIComponent(`Hi ${lead.firstName}, this is Texas Teazed Hair Salon regarding your appointment request for ${lead.service}!`)}`}
                          className="px-3 py-1 rounded-full bg-beige/10 hover:bg-terracotta hover:text-white text-beige text-[11px] font-semibold transition-all flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Text Client
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer notice */}
          <div className="mt-5 pt-3 border-t border-beige/10 flex items-center justify-between text-xs text-beige/50">
            <span>
              🔒 Salon internal lead calendar & inquiry audit
            </span>
            <span className="font-mono text-[11px]">
              Direct line: (281) 339-7168
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
