import React, { useState, useMemo } from "react";
import {
  X,
  Moon,
  MessageSquare,
  Copy,
  Check,
  DollarSign,
  Users,
  CreditCard,
  Banknote,
  Smartphone,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import { SalonClientRecord, SalonStaffMember } from "../../types/crm";
import { formatMoney } from "../StaffLeadPortal";

interface DailyZReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: SalonClientRecord[];
  staffList: SalonStaffMember[];
  reportDate: string; // YYYY-MM-DD
}

export function DailyZReportModal({
  isOpen,
  onClose,
  clients,
  staffList,
  reportDate,
}: DailyZReportModalProps) {
  const [copied, setCopied] = useState(false);

  // Filter clients for report date
  const dayClients = useMemo(() => {
    return clients.filter((c) => c.date === reportDate);
  }, [clients, reportDate]);

  const convertedClients = useMemo(() => {
    return dayClients.filter((c) => c.status === "converted");
  }, [dayClients]);

  const totalClients = dayClients.length;
  const convertedCount = convertedClients.length;
  const netRevenue = convertedClients.reduce((sum, c) => sum + (c.netCash || 0), 0);
  const totalTips = convertedClients.reduce((sum, c) => sum + (c.tipAmount || 0), 0);
  const totalDiscounts = convertedClients.reduce((sum, c) => sum + (c.discountAmount || 0), 0);

  // Payment Breakdown
  const cardCash = convertedClients
    .filter((c) => c.paymentMethod === "card" || !c.paymentMethod)
    .reduce((sum, c) => sum + (c.netCash || 0), 0);

  const physicalCash = convertedClients
    .filter((c) => c.paymentMethod === "cash")
    .reduce((sum, c) => sum + (c.netCash || 0), 0);

  const zelleCash = convertedClients
    .filter((c) => c.paymentMethod === "zelle" || c.paymentMethod === "apple_pay")
    .reduce((sum, c) => sum + (c.netCash || 0), 0);

  // Top Stylist Computation
  const stylistStats = useMemo(() => {
    const map: Record<string, number> = {};
    convertedClients.forEach((c) => {
      const name = c.stylistName || "Cheyanne";
      map[name] = (map[name] || 0) + (c.netCash || 0);
    });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? { name: sorted[0][0], revenue: sorted[0][1] } : null;
  }, [convertedClients]);

  // Formatted date label
  const formattedDate = useMemo(() => {
    try {
      const parts = reportDate.split("-");
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
    } catch {
      return reportDate;
    }
  }, [reportDate]);

  // Pre-drafted Z-Report message text for Owner
  const zReportMessage = useMemo(() => {
    return (
      `TEXAS TEAZED SALON - DAILY CLOSING Z-REPORT\n` +
      `Date: ${formattedDate}\n` +
      `--------------------------------\n` +
      `• Total Clients: ${totalClients} (${convertedCount} Converted)\n` +
      `• Total Net Revenue: $${formatMoney(netRevenue)}\n` +
      `• Card Payments: $${formatMoney(cardCash)}\n` +
      `• Cash in Register: $${formatMoney(physicalCash)}\n` +
      `• Zelle / Digital: $${formatMoney(zelleCash)}\n` +
      `• Total Stylist Tips: $${formatMoney(totalTips)}\n` +
      `• Total Discounts Given: $${formatMoney(totalDiscounts)}\n` +
      (stylistStats ? `• Top Producer: ${stylistStats.name} ($${formatMoney(stylistStats.revenue)})\n` : "") +
      `--------------------------------\n` +
      `Salon Desk: (281) 957-9602 • Closed & Audited in Real-Time.`
    );
  }, [formattedDate, totalClients, convertedCount, netRevenue, cardCash, physicalCash, zelleCash, totalTips, totalDiscounts, stylistStats]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(zReportMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const ownerPhone = "2819579602"; // Texas Teazed salon line
  const smsUrl = `sms:${ownerPhone}?body=${encodeURIComponent(zReportMessage)}`;
  const waUrl = `https://wa.me/1${ownerPhone}?text=${encodeURIComponent(zReportMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-beige rounded-2xl shadow-2xl border border-forest/20 p-5 sm:p-7 text-forest max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-5 border-b border-forest/15 pb-4">
          <div className="w-10 h-10 rounded-xl bg-forest text-beige flex items-center justify-center shadow">
            <Moon className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest">
              Daily End-of-Day Z-Report
            </h2>
            <p className="text-xs text-forest/70">
              Audit for {formattedDate} • 1-Click Dispatch to Salon Owner
            </p>
          </div>
        </div>

        {/* 4 CORE KPI CARDS */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-white p-3 rounded-xl border border-forest/15 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60">
              Total Clients
            </span>
            <p className="text-xl font-bold font-serif text-forest mt-0.5">
              {totalClients}
            </p>
            <p className="text-[10px] text-emerald-800 font-semibold">
              {convertedCount} converted ({totalClients > 0 ? Math.round((convertedCount / totalClients) * 100) : 0}%)
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-forest/15 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Net Billed Revenue
            </span>
            <p className="text-xl font-bold font-serif text-emerald-950 mt-0.5">
              ${formatMoney(netRevenue)}
            </p>
            <p className="text-[10px] text-forest/60">
              -${formatMoney(totalDiscounts)} discounts
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-forest/15 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Stylist Tips Pool
            </span>
            <p className="text-xl font-bold font-serif text-amber-950 mt-0.5">
              ${formatMoney(totalTips)}
            </p>
            <p className="text-[10px] text-forest/60">
              100% credited to team
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-forest/15 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
              Top Daily Producer
            </span>
            <p className="text-sm font-bold font-serif text-forest mt-1 truncate">
              {stylistStats ? stylistStats.name : "N/A"}
            </p>
            <p className="text-[10px] text-emerald-800 font-semibold">
              {stylistStats ? `$${formatMoney(stylistStats.revenue)} billed` : "No work logged"}
            </p>
          </div>
        </div>

        {/* PAYMENT REGISTER BREAKDOWN */}
        <div className="p-3.5 rounded-xl bg-forest/5 border border-forest/15 space-y-2 mb-4 text-xs">
          <span className="font-bold uppercase tracking-wider text-[11px] text-forest block">
            Payment Mode Reconciliation
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2 rounded-lg border border-forest/10">
              <span className="text-[10px] text-forest/60 block">Card Terminal</span>
              <span className="font-bold text-forest text-sm">${formatMoney(cardCash)}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-forest/10">
              <span className="text-[10px] text-forest/60 block">Cash Register</span>
              <span className="font-bold text-emerald-900 text-sm">${formatMoney(physicalCash)}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-forest/10">
              <span className="text-[10px] text-forest/60 block">Zelle / Digital</span>
              <span className="font-bold text-sky-900 text-sm">${formatMoney(zelleCash)}</span>
            </div>
          </div>
        </div>

        {/* PREVIEW AUDIT TEXT BOX */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-forest/70 mb-1">
            Dispatch Audit Summary
          </label>
          <pre className="p-3 bg-white rounded-xl border border-forest/15 text-[11px] font-mono whitespace-pre-wrap text-forest/80 max-h-36 overflow-y-auto">
            {zReportMessage}
          </pre>
        </div>

        {/* ACTIONS */}
        <div className="space-y-2 pt-2 border-t border-forest/15">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={smsUrl}
              className="py-2.5 px-3 rounded-xl bg-forest text-beige font-semibold text-xs hover:bg-forest/90 transition flex items-center justify-center gap-1.5 shadow"
            >
              <MessageSquare className="w-3.5 h-3.5 text-terracotta" />
              Text SMS to Owner
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-semibold text-xs hover:bg-[#20ba59] transition flex items-center justify-center gap-1.5 shadow"
            >
              <Smartphone className="w-3.5 h-3.5" />
              WhatsApp to Owner
            </a>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2 rounded-xl border border-forest/20 text-xs font-semibold text-forest hover:bg-forest/5 transition flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Full Z-Report Summary
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
