import React, { useState, useMemo } from "react";
import { 
  X, 
  Download, 
  Calendar as CalendarIcon, 
  BarChart3, 
  User, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  AlertCircle, 
  CheckCircle2, 
  Scissors, 
  Clock, 
  Building2,
  FileSpreadsheet
} from "lucide-react";
import { SalonClientRecord, SalonStaffMember, INITIAL_STAFF_MEMBERS } from "../../types/crm";

interface CrmReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: SalonClientRecord[];
  staffList: SalonStaffMember[];
}

export function CrmReportsModal({
  isOpen,
  onClose,
  clients,
  staffList,
}: CrmReportsModalProps) {
  // Today's YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  // Default date range: Past 7 days to Today
  const defaultPast7Str = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const [fromDate, setFromDate] = useState(defaultPast7Str);
  const [toDate, setToDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState<"salon" | "staff">("salon");
  const [selectedStylist, setSelectedStylist] = useState<string>(staffList[0]?.name || INITIAL_STAFF_MEMBERS[0].name);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Normalized Start & End dates to prevent inverted selection crash
  const [normalizedStart, normalizedEnd] = fromDate <= toDate ? [fromDate, toDate] : [toDate, fromDate];

  // Calculate days span
  const daysSpan = useMemo(() => {
    const start = new Date(normalizedStart);
    const end = new Date(normalizedEnd);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [normalizedStart, normalizedEnd]);

  // Span Badge Text
  const spanBadge = useMemo(() => {
    if (normalizedStart === normalizedEnd) {
      return "🟢 1 Day Report (Daily Closing / Z-Report)";
    }
    if (daysSpan === 15) {
      return "🟣 15 Days Bi-Weekly Payroll Span";
    }
    return `🔵 ${daysSpan} Days Span`;
  }, [normalizedStart, normalizedEnd, daysSpan]);

  // Quick Preset Handlers
  const handlePreset = (type: "today" | "yesterday" | "past7" | "biweekly" | "month" | "all") => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    if (type === "today") {
      const s = fmt(now);
      setFromDate(s);
      setToDate(s);
    } else if (type === "yesterday") {
      const yest = new Date(now);
      yest.setDate(yest.getDate() - 1);
      const s = fmt(yest);
      setFromDate(s);
      setToDate(s);
    } else if (type === "past7") {
      const past = new Date(now);
      past.setDate(past.getDate() - 6);
      setFromDate(fmt(past));
      setToDate(fmt(now));
    } else if (type === "biweekly") {
      // 1st to 15th or 16th to end of month
      const y = now.getFullYear();
      const m = now.getMonth();
      if (now.getDate() <= 15) {
        setFromDate(`${y}-${pad(m + 1)}-01`);
        setToDate(`${y}-${pad(m + 1)}-15`);
      } else {
        const lastDay = new Date(y, m + 1, 0).getDate();
        setFromDate(`${y}-${pad(m + 1)}-16`);
        setToDate(`${y}-${pad(m + 1)}-${pad(lastDay)}`);
      }
    } else if (type === "month") {
      const y = now.getFullYear();
      const m = now.getMonth();
      const lastDay = new Date(y, m + 1, 0).getDate();
      setFromDate(`${y}-${pad(m + 1)}-01`);
      setToDate(`${y}-${pad(m + 1)}-${pad(lastDay)}`);
    } else if (type === "all") {
      setFromDate("2026-01-01");
      setToDate(fmt(now));
    }
  };

  // Filter clients within normalized date range
  const filteredClients = clients.filter((c) => {
    const cDate = c.date || c.submittedAt.split("T")[0];
    return cDate >= normalizedStart && cDate <= normalizedEnd;
  });

  // Whole Salon Aggregations
  const totalLeads = filteredClients.length;
  const convertedClients = filteredClients.filter((c) => c.status === "converted");
  const convertedCount = convertedClients.length;
  const netRevenue = convertedClients.reduce((acc, c) => acc + (c.netCash || 0), 0);
  const totalDiscounts = convertedClients.reduce((acc, c) => acc + (c.discountAmount || 0), 0);
  
  const walkInConverted = convertedClients.filter((c) => c.channel === "walk_in");
  const onlineConverted = convertedClients.filter((c) => c.channel === "online");
  const walkInCash = walkInConverted.reduce((acc, c) => acc + (c.netCash || 0), 0);
  const onlineCash = onlineConverted.reduce((acc, c) => acc + (c.netCash || 0), 0);

  // Staff Breakdown Aggregations
  const staffBreakdown = staffList.map((st) => {
    const stClients = filteredClients.filter(
      (c) => c.stylistName && c.stylistName.toLowerCase().includes(st.name.toLowerCase())
    );
    const stConverted = stClients.filter((c) => c.status === "converted");
    const stWalkIns = stConverted.filter((c) => c.channel === "walk_in");
    const stOnline = stConverted.filter((c) => c.channel === "online");
    const stCash = stConverted.reduce((acc, c) => acc + (c.netCash || 0), 0);
    const stDisc = stConverted.reduce((acc, c) => acc + (c.discountAmount || 0), 0);

    return {
      staff: st,
      totalClients: stClients.length,
      convertedCount: stConverted.length,
      walkInsCount: stWalkIns.length,
      walkInsCash: stWalkIns.reduce((acc, c) => acc + (c.netCash || 0), 0),
      onlineCount: stOnline.length,
      onlineCash: stOnline.reduce((acc, c) => acc + (c.netCash || 0), 0),
      discountsGiven: stDisc,
      netRevenue: stCash,
    };
  });

  // Selected Stylist Metrics for Tab 2
  const selectedStylistRecords = filteredClients.filter(
    (c) => c.stylistName && c.stylistName.toLowerCase().includes(selectedStylist.toLowerCase())
  );
  const stylistConverted = selectedStylistRecords.filter((c) => c.status === "converted");
  const stylistConversionRate =
    selectedStylistRecords.length > 0
      ? Math.round((stylistConverted.length / selectedStylistRecords.length) * 100)
      : 0;
  const stylistNetRevenue = stylistConverted.reduce((acc, c) => acc + (c.netCash || 0), 0);
  const stylistOnlineConverted = stylistConverted.filter((c) => c.channel === "online");
  const stylistWalkIns = stylistConverted.filter((c) => c.channel === "walk_in");
  const stylistDiscounts = stylistConverted.reduce((acc, c) => acc + (c.discountAmount || 0), 0);
  const stylistAvgTicket =
    stylistConverted.length > 0
      ? Math.round(stylistNetRevenue / stylistConverted.length)
      : 0;

  // CSV DOWNLOAD 1: Whole Salon Bookings CSV (16 Audit Columns)
  const downloadWholeSalonCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Time",
      "Client Name",
      "Phone",
      "Email",
      "Service",
      "Stylist Assigned",
      "Intake Channel",
      "Status",
      "Actual Menu Price ($)",
      "Discount ($)",
      "Discount (%)",
      "Final Net Cash ($)",
      "Discount Reason / Offer",
      "Formula & Preferences",
    ];

    const rows = filteredClients.map((c) => [
      `"${c.id}"`,
      `"${c.date || c.submittedAt.split("T")[0]}"`,
      `"${c.time || ""}"`,
      `"${c.firstName.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.service.replace(/"/g, '""')}"`,
      `"${c.stylistName || INITIAL_STAFF_MEMBERS[0].name}"`,
      `"${c.channel === "walk_in" ? "Counter Walk-In" : "Online Website"}"`,
      `"${c.status.toUpperCase()}"`,
      (c.actualPrice || 0).toFixed(2),
      (c.discountAmount || 0).toFixed(2),
      (c.discountPercent || 0).toFixed(2),
      (c.netCash || 0).toFixed(2),
      `"${(c.discountReason || "").replace(/"/g, '""')}"`,
      `"${(c.formulaNotes || c.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `TexasTeazed_Salon_Bookings_${normalizedStart}_to_${normalizedEnd}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice("✓ Whole Salon Master Bookings CSV exported successfully!");
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  // CSV DOWNLOAD 2: Staff Breakdown CSV
  const downloadStaffBreakdownCSV = () => {
    const headers = [
      "Stylist Name",
      "Role",
      "Total Clients Handled",
      "Converted Bookings",
      "Online Converted Count",
      "Online Converted Cash ($)",
      "Walk-In Count",
      "Walk-In Cash ($)",
      "Total Discounts Given ($)",
      "Net Billed Revenue ($)",
    ];

    const rows = staffBreakdown.map((s) => [
      `"${s.staff.name}"`,
      `"${s.staff.role}"`,
      s.totalClients,
      s.convertedCount,
      s.onlineCount,
      s.onlineCash.toFixed(2),
      s.walkInsCount,
      s.walkInsCash.toFixed(2),
      s.discountsGiven.toFixed(2),
      s.netRevenue.toFixed(2),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `TexasTeazed_Staff_Breakdown_${normalizedStart}_to_${normalizedEnd}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice("✓ Staff Production Breakdown CSV exported successfully!");
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  // CSV DOWNLOAD 3: Individual Stylist Work & Commission CSV
  const downloadStylistCSV = () => {
    const headers = [
      "Stylist",
      "Date",
      "Client Name",
      "Phone",
      "Service",
      "Channel",
      "Status",
      "Actual Price ($)",
      "Discount ($)",
      "Net Cash ($)",
      "Commission Eligible",
    ];

    const rows = selectedStylistRecords.map((c) => [
      `"${selectedStylist}"`,
      `"${c.date || c.submittedAt.split("T")[0]}"`,
      `"${c.firstName.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.service.replace(/"/g, '""')}"`,
      `"${c.channel === "walk_in" ? "Walk-In" : "Online"}"`,
      `"${c.status}"`,
      (c.actualPrice || 0).toFixed(2),
      (c.discountAmount || 0).toFixed(2),
      (c.netCash || 0).toFixed(2),
      c.status === "converted" ? "YES" : "NO",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${selectedStylist.replace(/\s+/g, "_")}_CommissionReport_${normalizedStart}_to_${normalizedEnd}_${daysSpan}days.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice(`✓ ${selectedStylist}'s Work & Commission CSV exported!`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-beige rounded-2xl shadow-2xl border border-forest/20 p-4 sm:p-7 text-forest max-h-[94vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest/15 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-beige flex items-center justify-center shadow">
              <BarChart3 className="w-5 h-5 text-terracotta" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest">
                Analytics & Payroll Commission Center
              </h2>
              <p className="text-xs sm:text-sm text-forest/70">
                Custom date-range accounting, multi-scope audit & automated payroll exports
              </p>
            </div>
          </div>

          {downloadNotice && (
            <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold animate-pulse">
              {downloadNotice}
            </div>
          )}
        </div>

        {/* CUSTOM DATE-RANGE CONTROLS & SMART SPAN BADGE */}
        <div className="bg-forest/5 border border-forest/15 rounded-xl p-4 mb-5 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-forest/70">From:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-forest/25 bg-white text-xs font-semibold text-forest"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-forest/70">To:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-forest/25 bg-white text-xs font-semibold text-forest"
                />
              </div>

              <span className="text-xs px-3 py-1 rounded-full font-bold bg-white border border-forest/20 text-forest shadow-sm">
                {spanBadge}
              </span>
            </div>

            {/* QUICK PRESETS */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-forest/60 mr-1">Presets:</span>
              <button
                onClick={() => handlePreset("today")}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-forest/20 hover:bg-forest/10 transition"
              >
                Today
              </button>
              <button
                onClick={() => handlePreset("yesterday")}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-forest/20 hover:bg-forest/10 transition"
              >
                Yesterday
              </button>
              <button
                onClick={() => handlePreset("past7")}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-forest/20 hover:bg-forest/10 transition"
              >
                Past 7 Days
              </button>
              <button
                onClick={() => handlePreset("biweekly")}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-forest/20 hover:bg-forest/10 transition"
              >
                Bi-Weekly
              </button>
              <button
                onClick={() => handlePreset("month")}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-forest/20 hover:bg-forest/10 transition"
              >
                Full Month
              </button>
              <button
                onClick={() => handlePreset("all")}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white border border-forest/20 hover:bg-forest/10 transition"
              >
                All-Time
              </button>
            </div>
          </div>
        </div>

        {/* 2 MAIN SCOPE TABS */}
        <div className="flex items-center gap-3 border-b border-forest/15 mb-5">
          <button
            onClick={() => setActiveTab("salon")}
            className={`pb-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "salon"
                ? "border-forest text-forest"
                : "border-transparent text-forest/50 hover:text-forest"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Scope 1: 🏢 Whole Salon Master Report
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`pb-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "staff"
                ? "border-forest text-forest"
                : "border-transparent text-forest/50 hover:text-forest"
            }`}
          >
            <User className="w-4 h-4" />
            Scope 2: 👤 Staff-Wise Work & Efficiency Report
          </button>
        </div>

        {/* SCOPE TAB 1: WHOLE SALON MASTER REPORT */}
        {activeTab === "salon" && (
          <div className="space-y-6">
            {/* 4 Financial KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-forest/15 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-forest/60">
                  Total Leads / Intake
                </span>
                <p className="text-xl sm:text-2xl font-bold font-serif text-forest mt-1">
                  {totalLeads}
                </p>
                <p className="text-[11px] text-forest/60 mt-0.5">Online & Counter Combined</p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-forest/15 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Converted Bookings
                </span>
                <p className="text-xl sm:text-2xl font-bold font-serif text-emerald-900 mt-1">
                  {convertedCount}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  {totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0}% Conversion Rate
                </p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-forest/15 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Net Billed Revenue
                </span>
                <p className="text-xl sm:text-2xl font-bold font-serif text-emerald-950 mt-1">
                  ${netRevenue.toLocaleString()}
                </p>
                <p className="text-[11px] text-forest/60 mt-0.5">
                  ${totalDiscounts.toLocaleString()} Discounts Given
                </p>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-forest/15 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                  Channel Split
                </span>
                <p className="text-xs sm:text-sm font-bold text-forest mt-1.5">
                  Walk-In: <span className="text-emerald-800">${walkInCash.toLocaleString()}</span>
                </p>
                <p className="text-xs sm:text-sm font-bold text-forest">
                  Online: <span className="text-sky-800">${onlineCash.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* TEAM PRODUCTION BREAKDOWN TABLE */}
            <div className="bg-white rounded-xl border border-forest/15 p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-forest flex items-center gap-2">
                  <Users className="w-4 h-4 text-terracotta" />
                  Team Production Breakdown ({normalizedStart} to {normalizedEnd})
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadStaffBreakdownCSV}
                    className="px-3 py-1.5 rounded-lg bg-forest/10 hover:bg-forest/20 text-forest text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Staff Breakdown CSV
                  </button>
                  <button
                    onClick={downloadWholeSalonCSV}
                    className="px-3 py-1.5 rounded-lg bg-forest text-beige hover:bg-forest/90 text-xs font-semibold transition flex items-center gap-1.5 shadow"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-terracotta" />
                    Download Whole Salon Bookings CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-forest/15 text-forest/70 font-semibold bg-forest/5">
                      <th className="py-2.5 px-3">Stylist</th>
                      <th className="py-2.5 px-3">Total Clients</th>
                      <th className="py-2.5 px-3">Online Converted</th>
                      <th className="py-2.5 px-3">Walk-Ins</th>
                      <th className="py-2.5 px-3">Discounts Given</th>
                      <th className="py-2.5 px-3 font-bold text-emerald-950">Net Revenue ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/10">
                    {staffBreakdown.map((item) => (
                      <tr key={item.staff.id} className="hover:bg-forest/5 transition">
                        <td className="py-2.5 px-3 font-semibold text-forest">
                          {item.staff.name}
                          <span className="block text-[10px] text-terracotta font-normal">
                            {item.staff.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">{item.totalClients}</td>
                        <td className="py-2.5 px-3">
                          {item.onlineCount} (${item.onlineCash})
                        </td>
                        <td className="py-2.5 px-3">
                          {item.walkInsCount} (${item.walkInsCash})
                        </td>
                        <td className="py-2.5 px-3 text-forest/70">${item.discountsGiven}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-900 text-sm">
                          ${item.netRevenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PREVIEW SAMPLE ROWS */}
            <div className="bg-white rounded-xl border border-forest/15 p-4 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-forest">
                Bookings Activity Preview ({filteredClients.length} Records in Range)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-forest/15 text-forest/70 font-semibold bg-forest/5">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Client</th>
                      <th className="py-2 px-3">Service</th>
                      <th className="py-2 px-3">Stylist</th>
                      <th className="py-2 px-3">Channel</th>
                      <th className="py-2 px-3">Menu Price</th>
                      <th className="py-2 px-3">Discount</th>
                      <th className="py-2 px-3 font-bold text-emerald-900">Net Cash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest/10">
                    {filteredClients.slice(0, 6).map((c) => (
                      <tr key={c.id} className="hover:bg-forest/5 transition">
                        <td className="py-2 px-3">{c.date || c.submittedAt.split("T")[0]}</td>
                        <td className="py-2 px-3 font-medium text-forest">{c.firstName}</td>
                        <td className="py-2 px-3">{c.service}</td>
                        <td className="py-2 px-3">{c.stylistName || INITIAL_STAFF_MEMBERS[0].name}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              c.channel === "walk_in"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-sky-100 text-sky-900"
                            }`}
                          >
                            {c.channel === "walk_in" ? "Walk-In" : "Online"}
                          </span>
                        </td>
                        <td className="py-2 px-3">${c.actualPrice || 0}</td>
                        <td className="py-2 px-3 text-red-700">-${c.discountAmount || 0}</td>
                        <td className="py-2 px-3 font-bold text-emerald-900">${c.netCash || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SCOPE TAB 2: STAFF-WISE WORK & EFFICIENCY REPORT (HRM & PAYROLL COMMISSION) */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            {/* Stylist Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-forest/15">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-forest/70">
                  Select Stylist:
                </span>
                <select
                  value={selectedStylist}
                  onChange={(e) => setSelectedStylist(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-forest/25 bg-beige font-semibold text-sm text-forest"
                >
                  {staffList.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name} ({st.role})
                    </option>
                  ))}
                </select>
              </div>

              {selectedStylistRecords.length > 0 && (
                <button
                  onClick={downloadStylistCSV}
                  className="px-4 py-2 rounded-xl bg-forest text-beige text-xs font-semibold hover:bg-forest/90 transition flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4 text-terracotta" />
                  Download {selectedStylist} Work & Commission CSV
                </button>
              )}
            </div>

            {/* CASE A: ZERO WORK FOUND */}
            {selectedStylistRecords.length === 0 ? (
              <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-amber-950">
                  ⚠️ Zero Work Found for {selectedStylist}
                </h3>
                <p className="text-xs sm:text-sm text-amber-900/80 max-w-lg mx-auto">
                  No appointments or walk-in clients were logged between{" "}
                  <span className="font-semibold">{normalizedStart}</span> and{" "}
                  <span className="font-semibold">{normalizedEnd}</span> ({daysSpan} Days span).
                  Stylist was off-duty, on leave, or had zero production during this timeframe.
                </p>
              </div>
            ) : (
              /* CASE B: > 0 BOOKINGS -> 8 DEEP PRODUCTION KPIS */
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-forest/15">
                    <span className="text-[11px] font-bold text-forest/60 uppercase">
                      1. Clients Handled
                    </span>
                    <p className="text-xl font-bold font-serif text-forest mt-1">
                      {selectedStylistRecords.length}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-forest/15">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase">
                      2. Converted Bookings
                    </span>
                    <p className="text-xl font-bold font-serif text-emerald-900 mt-1">
                      {stylistConverted.length}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-forest/15">
                    <span className="text-[11px] font-bold text-forest/60 uppercase">
                      3. Conversion Rate
                    </span>
                    <p className="text-xl font-bold font-serif text-forest mt-1">
                      {stylistConversionRate}%
                    </p>
                  </div>

                  <div className="bg-emerald-50 p-3.5 rounded-xl border-2 border-emerald-600 shadow-sm">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase">
                      4. Net Billed Revenue
                    </span>
                    <p className="text-xl font-bold font-serif text-emerald-950 mt-1">
                      ${stylistNetRevenue.toLocaleString()}
                    </p>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 block mt-0.5">
                      ★ Basis for Commission Payout
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-forest/15">
                    <span className="text-[11px] font-bold text-sky-800 uppercase">
                      5. Online Converted
                    </span>
                    <p className="text-lg font-bold font-serif text-sky-950 mt-1">
                      {stylistOnlineConverted.length} Clients
                    </p>
                    <p className="text-[11px] text-sky-700">
                      ${stylistOnlineConverted.reduce((a, c) => a + (c.netCash || 0), 0)} Cash
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-forest/15">
                    <span className="text-[11px] font-bold text-amber-800 uppercase">
                      6. Walk-Ins Handled
                    </span>
                    <p className="text-lg font-bold font-serif text-amber-950 mt-1">
                      {stylistWalkIns.length} Clients
                    </p>
                    <p className="text-[11px] text-amber-700">
                      ${stylistWalkIns.reduce((a, c) => a + (c.netCash || 0), 0)} Cash
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-forest/15">
                    <span className="text-[11px] font-bold text-forest/60 uppercase">
                      7. Discounts Given
                    </span>
                    <p className="text-lg font-bold font-serif text-red-700 mt-1">
                      ${stylistDiscounts.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-forest/15">
                    <span className="text-[11px] font-bold text-forest/60 uppercase">
                      8. Avg Ticket Size
                    </span>
                    <p className="text-lg font-bold font-serif text-forest mt-1">
                      ${stylistAvgTicket}
                    </p>
                  </div>
                </div>

                {/* ITEMIZED WORK HISTORY TABLE */}
                <div className="bg-white rounded-xl border border-forest/15 p-4 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-forest">
                    {selectedStylist}&apos;s Itemized Client Register ({selectedStylistRecords.length} Records)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-forest/15 text-forest/70 font-semibold bg-forest/5">
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Client</th>
                          <th className="py-2 px-3">Service</th>
                          <th className="py-2 px-3">Phone</th>
                          <th className="py-2 px-3">Channel</th>
                          <th className="py-2 px-3">Menu Price</th>
                          <th className="py-2 px-3">Discount</th>
                          <th className="py-2 px-3 font-bold text-emerald-900">Net Cash</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-forest/10">
                        {selectedStylistRecords.map((c) => (
                          <tr key={c.id} className="hover:bg-forest/5 transition">
                            <td className="py-2 px-3">{c.date || c.submittedAt.split("T")[0]}</td>
                            <td className="py-2 px-3 font-semibold text-forest">{c.firstName}</td>
                            <td className="py-2 px-3">{c.service}</td>
                            <td className="py-2 px-3 text-forest/70">{c.phone}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  c.channel === "walk_in"
                                    ? "bg-amber-100 text-amber-900"
                                    : "bg-sky-100 text-sky-900"
                                }`}
                              >
                                {c.channel === "walk_in" ? "Walk-In" : "Online"}
                              </span>
                            </td>
                            <td className="py-2 px-3">${c.actualPrice || 0}</td>
                            <td className="py-2 px-3 text-red-700">-${c.discountAmount || 0}</td>
                            <td className="py-2 px-3 font-bold text-emerald-900">${c.netCash || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end pt-5 mt-5 border-t border-forest/15">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-forest text-beige font-semibold text-xs sm:text-sm hover:bg-forest/90 transition shadow"
          >
            Close Reports
          </button>
        </div>
      </div>
    </div>
  );
}
