import React, { useState } from "react";
import { X, UserPlus, Scissors, DollarSign, Sparkles, CreditCard, Banknote, Smartphone, Heart } from "lucide-react";
import { SalonClientRecord, SalonStaffMember, SALON_SERVICES, INITIAL_STAFF_MEMBERS, PaymentMethod } from "../../types/crm";

interface WalkInPosModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: SalonStaffMember[];
  onAddClient: (newClient: SalonClientRecord) => void;
}

export function WalkInPosModal({ isOpen, onClose, staffList, onAddClient }: WalkInPosModalProps) {
  const activeStaff = staffList.filter((s) => s.active);

  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedService, setSelectedService] = useState(SALON_SERVICES[0].name);
  const [selectedStylist, setSelectedStylist] = useState(activeStaff[0]?.name || INITIAL_STAFF_MEMBERS[0].name);
  
  // Date & Time of Visit (default to today / current time)
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [visitTime, setVisitTime] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // 3-way Dynamic Pricing & Calculator
  const [menuPrice, setMenuPrice] = useState<number>(SALON_SERVICES[0].price);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [finalCash, setFinalCash] = useState<number>(SALON_SERVICES[0].price);
  const [discountReason, setDiscountReason] = useState("");
  const [notes, setNotes] = useState("");

  // Payment Method & Stylist Tip Split
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [tipAmount, setTipAmount] = useState<number>(0);

  if (!isOpen) return null;

  const handleServiceChange = (serviceName: string) => {
    setSelectedService(serviceName);
    const item = SALON_SERVICES.find((s) => s.name === serviceName);
    const base = item ? item.price : 100;
    setMenuPrice(base);
    // recalculate with existing percent
    if (discountPercent > 0) {
      const disc = Number(((base * discountPercent) / 100).toFixed(2));
      setDiscountAmount(disc);
      setFinalCash(Math.max(0, Number((base - disc).toFixed(2))));
    } else if (discountAmount > 0) {
      const disc = Math.min(discountAmount, base);
      setDiscountAmount(disc);
      setDiscountPercent(base > 0 ? Number(((disc / base) * 100).toFixed(1)) : 0);
      setFinalCash(Math.max(0, Number((base - disc).toFixed(2))));
    } else {
      setDiscountAmount(0);
      setDiscountPercent(0);
      setFinalCash(base);
    }
  };

  const handleMenuPriceChange = (val: number) => {
    const base = Math.max(0, val);
    setMenuPrice(base);
    if (discountPercent > 0) {
      const disc = Number(((base * discountPercent) / 100).toFixed(2));
      setDiscountAmount(disc);
      setFinalCash(Math.max(0, Number((base - disc).toFixed(2))));
    } else {
      setFinalCash(Math.max(0, base - discountAmount));
    }
  };

  const handleDiscountAmountChange = (val: number) => {
    const disc = Math.min(Math.max(0, val), menuPrice);
    setDiscountAmount(Number(disc.toFixed(2)));
    const pct = menuPrice > 0 ? Number(((disc / menuPrice) * 100).toFixed(2)) : 0;
    setDiscountPercent(pct);
    setFinalCash(Number((menuPrice - disc).toFixed(2)));
  };

  const handleDiscountPercentChange = (val: number) => {
    const pct = Math.min(Math.max(0, val), 100);
    setDiscountPercent(Number(pct.toFixed(2)));
    const disc = Number(((menuPrice * pct) / 100).toFixed(2));
    setDiscountAmount(disc);
    setFinalCash(Number((menuPrice - disc).toFixed(2)));
  };

  const handleFinalCashChange = (val: number) => {
    const finalVal = Math.min(Math.max(0, val), menuPrice);
    setFinalCash(Number(finalVal.toFixed(2)));
    const disc = Number((menuPrice - finalVal).toFixed(2));
    setDiscountAmount(disc);
    const pct = menuPrice > 0 ? Number(((disc / menuPrice) * 100).toFixed(2)) : 0;
    setDiscountPercent(pct);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const newRecord: SalonClientRecord = {
      id: `WALK-${Date.now()}`,
      firstName: clientName.trim(),
      phone: phone.trim() || "(Walk-In Counter)",
      email: email.trim() || "walkin@counter.internal",
      service: selectedService,
      stylistName: selectedStylist,
      channel: "walk_in",
      status: "converted",
      date: visitDate || todayStr,
      time: visitTime || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actualPrice: menuPrice,
      discountAmount,
      discountPercent,
      netCash: finalCash,
      discountReason: discountReason.trim() || undefined,
      paymentMethod,
      tipAmount: tipAmount > 0 ? tipAmount : 0,
      formulaNotes: notes.trim() || undefined,
      submittedAt: now.toISOString(),
    };

    onAddClient(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-beige rounded-2xl shadow-2xl border border-forest/20 p-5 sm:p-7 text-forest max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-forest/15 pb-4">
          <div className="w-10 h-10 rounded-xl bg-forest text-beige flex items-center justify-center shadow">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest">
              Counter Walk-In Client POS
            </h2>
            <p className="text-xs sm:text-sm text-forest/70">
              Quick 10-Second Intake with 3-Way Live Pricing & Discount Engine
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rachel Green"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-forest text-forest placeholder:text-forest/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="(281) 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-forest text-forest placeholder:text-forest/40"
              />
            </div>
          </div>

          {/* DATE & TIME OF VISIT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-1">
                Date of Visit *
              </label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-forest text-forest text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-1">
                Time of Visit *
              </label>
              <input
                type="text"
                placeholder="11:30 AM"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-forest text-forest text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-1">
                Selected Service *
              </label>
              <select
                value={selectedService}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-forest text-forest"
              >
                {SALON_SERVICES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} (${s.price})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-1">
                Assign Stylist *
              </label>
              <select
                value={selectedStylist}
                onChange={(e) => setSelectedStylist(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-forest text-forest"
              >
                {activeStaff.map((staff) => (
                  <option key={staff.id} value={staff.name}>
                    {staff.name} ({staff.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3-WAY REAL-TIME DYNAMIC DISCOUNT CALCULATOR BOX */}
          <div className="p-4 rounded-xl bg-forest/5 border border-forest/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-terracotta" />
                3-Way Real-Time Price Formula
              </span>
              <span className="text-xs bg-forest/10 px-2 py-0.5 rounded-full text-forest/80 font-medium">
                Auto-Synchronized
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-forest/70 mb-1">
                  Menu Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={menuPrice}
                  onChange={(e) => handleMenuPriceChange(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg border border-forest/25 bg-white text-forest font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-forest/70 mb-1">
                  Discount ($ or %)
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="$"
                    value={discountAmount || ""}
                    onChange={(e) => handleDiscountAmountChange(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-lg border border-forest/25 bg-white text-forest text-xs font-semibold"
                    title="Discount in Dollars"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="%"
                    value={discountPercent || ""}
                    onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-lg border border-forest/25 bg-white text-forest text-xs font-semibold"
                    title="Discount in Percent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                  Final Billed Cash ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={finalCash}
                  onChange={(e) => handleFinalCashChange(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg border-2 border-emerald-600 bg-emerald-50 text-emerald-950 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-forest/70 mb-1">
                Discount Reason / Festive Offer Note
              </label>
              <input
                type="text"
                placeholder="e.g. Diwali Promo 10%, First-Time Special, Bridal Package"
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-forest/20 bg-white text-xs placeholder:text-forest/40"
              />
            </div>
          </div>

          {/* PAYMENT METHOD & STYLIST TIP SPLIT */}
          <div className="p-3.5 rounded-xl bg-forest/5 border border-forest/15 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-terracotta" />
                Payment Method & Stylist Tip
              </span>
              <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                Total Charged: ${(finalCash + (tipAmount || 0)).toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-forest/70 mb-1">
                  Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["card", "cash", "zelle"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMethod(mode)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition uppercase ${
                        paymentMethod === mode
                          ? "bg-forest text-beige border-forest shadow-sm"
                          : "bg-white text-forest/70 border-forest/20 hover:bg-forest/5"
                      }`}
                    >
                      {mode === "zelle" ? "Zelle/Pay" : mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-forest/70 mb-1 flex items-center justify-between">
                  <span>Stylist Tip ($)</span>
                  <span className="text-[10px] text-terracotta font-medium">100% to Stylist</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="$0.00"
                    value={tipAmount || ""}
                    onChange={(e) => setTipAmount(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-forest/25 bg-white text-xs font-bold text-forest"
                  />
                  {[5, 10, 15, 20].map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setTipAmount(tip)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition shrink-0 ${
                        tipAmount === tip
                          ? "bg-forest text-beige border-forest"
                          : "bg-white text-forest/70 border-forest/20 hover:bg-forest/5"
                      }`}
                    >
                      +${tip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-1">
              Hair / Color Formula Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Redken Shades EQ 09V + 09GI root melt, 30 vol balayage lightener..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-forest/20 bg-white/90 focus:outline-none focus:ring-2 focus:ring-forest text-forest placeholder:text-forest/40 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-forest/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-forest/20 text-forest/80 hover:bg-forest/5 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-forest text-beige font-semibold hover:bg-forest/90 shadow transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-terracotta" />
              Complete 10-Second Intake
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
