import React, { useState } from "react";
import { X, DollarSign, Sparkles, Scissors } from "lucide-react";
import { SalonClientRecord, SalonStaffMember, SALON_SERVICES, INITIAL_STAFF_MEMBERS } from "../../types/crm";

interface EditPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: SalonClientRecord | null;
  staffList: SalonStaffMember[];
  onSave: (updated: SalonClientRecord) => void;
}

export function EditPricingModal({
  isOpen,
  onClose,
  client,
  staffList,
  onSave,
}: EditPricingModalProps) {
  if (!isOpen || !client) return null;

  const [selectedService, setSelectedService] = useState(client.service);
  const [selectedStylist, setSelectedStylist] = useState(client.stylistName || staffList[0]?.name || INITIAL_STAFF_MEMBERS[0].name);
  const [menuPrice, setMenuPrice] = useState<number>(client.actualPrice || 100);
  const [discountAmount, setDiscountAmount] = useState<number>(client.discountAmount || 0);
  const [discountPercent, setDiscountPercent] = useState<number>(client.discountPercent || 0);
  const [finalCash, setFinalCash] = useState<number>(client.netCash || client.actualPrice || 100);
  const [discountReason, setDiscountReason] = useState(client.discountReason || "");
  const [formulaNotes, setFormulaNotes] = useState(client.formulaNotes || "");

  const handleServiceChange = (serviceName: string) => {
    setSelectedService(serviceName);
    const item = SALON_SERVICES.find((s) => s.name === serviceName);
    const base = item ? item.price : menuPrice;
    setMenuPrice(base);
    if (discountPercent > 0) {
      const disc = Number(((base * discountPercent) / 100).toFixed(2));
      setDiscountAmount(disc);
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SalonClientRecord = {
      ...client,
      service: selectedService,
      stylistName: selectedStylist,
      actualPrice: menuPrice,
      discountAmount,
      discountPercent,
      netCash: finalCash,
      discountReason: discountReason.trim() || undefined,
      formulaNotes: formulaNotes.trim() || undefined,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-beige rounded-2xl shadow-2xl border border-forest/20 p-5 sm:p-6 text-forest max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-forest/15 pb-3">
          <div className="w-10 h-10 rounded-xl bg-forest text-beige flex items-center justify-center shadow">
            <DollarSign className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-forest">
              Edit Pricing, Discount & Formula
            </h2>
            <p className="text-xs text-forest/70">
              Client: <span className="font-semibold text-forest">{client.firstName}</span> ({client.phone})
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-forest/70 mb-1">
                Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-forest/20 bg-white text-xs font-medium text-forest"
              >
                {SALON_SERVICES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} (${s.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest/70 mb-1">
                Assigned Stylist
              </label>
              <select
                value={selectedStylist}
                onChange={(e) => setSelectedStylist(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-forest/20 bg-white text-xs font-medium text-forest"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3-WAY REAL-TIME DYNAMIC DISCOUNT CALCULATOR BOX */}
          <div className="p-4 rounded-xl bg-forest/5 border border-forest/20 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-terracotta" />
              Dynamic 3-Way Price Adjuster
            </span>

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
                  className="w-full px-2.5 py-2 rounded-lg border border-forest/25 bg-white text-forest font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-forest/70 mb-1">
                  Discount ($ / %)
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="$"
                    value={discountAmount || ""}
                    onChange={(e) => handleDiscountAmountChange(Number(e.target.value))}
                    className="w-full px-1.5 py-2 rounded-lg border border-forest/25 bg-white text-forest text-xs font-semibold"
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
                    className="w-full px-1.5 py-2 rounded-lg border border-forest/25 bg-white text-forest text-xs font-semibold"
                    title="Discount in Percent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                  Final Billed ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={finalCash}
                  onChange={(e) => handleFinalCashChange(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg border-2 border-emerald-600 bg-emerald-50 text-emerald-950 font-bold text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-forest/70 mb-1">
                Discount Reason / Offer Note
              </label>
              <input
                type="text"
                placeholder="e.g. Returning Client 15%, Promotional Code"
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-forest/20 bg-white text-xs placeholder:text-forest/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest/70 mb-1">
              Hair Formula / Service Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Wella Koleston Perfect 7/1 + 6% 20 Vol..."
              value={formulaNotes}
              onChange={(e) => setFormulaNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-forest/20 bg-white/90 text-xs text-forest placeholder:text-forest/40"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-forest/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-forest/20 text-forest/80 hover:bg-forest/5 font-medium transition text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-forest text-beige font-semibold hover:bg-forest/90 shadow transition flex items-center gap-2 text-xs"
            >
              <Sparkles className="w-4 h-4 text-terracotta" />
              Update Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
