import React, { useState } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Smartphone,
  MessageSquare,
  Sparkles,
  Scissors,
  DollarSign,
  Heart,
  Share2,
} from "lucide-react";
import { SalonClientRecord, SalonStaffMember } from "../../types/crm";
import { formatMoney } from "../StaffLeadPortal";

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: SalonClientRecord | null;
  staffList?: SalonStaffMember[];
}

export function DigitalReceiptModal({
  isOpen,
  onClose,
  client,
}: DigitalReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !client) return null;

  const stylist = client.stylistName || "Ashley";
  const savedText = client.discountAmount > 0 ? ` (You Saved $${formatMoney(client.discountAmount)}!)` : "";

  // The exact template specified by the owner:
  // "Thank you [Client]! You visited Texas Teazed today for [Service] with [Stylist]. Bill: $[NetCash] (You Saved $[Discount]!). See you soon!"
  const receiptMessage = `Thank you ${client.firstName}! You visited Texas Teazed today for ${client.service} with ${stylist}. Bill: $${formatMoney(client.netCash)}${savedText}. See you soon!`;

  const cleanPhone = (client.phone || "").replace(/\D/g, "");
  const formattedUsPhone = cleanPhone.length === 10 ? `1${cleanPhone}` : cleanPhone;
  const smsUrl = `sms:${client.phone || ""}?body=${encodeURIComponent(receiptMessage)}`;
  const waUrl = cleanPhone
    ? `https://wa.me/${formattedUsPhone}?text=${encodeURIComponent(receiptMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(receiptMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#1a2e22]/20 p-5 sm:p-7 text-[#1a2e22] max-h-[92vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#1a2e22]/60 hover:text-[#1a2e22] hover:bg-[#1a2e22]/10 rounded-full transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* RECEIPT HEADER */}
        <div className="text-center pb-4 border-b border-dashed border-[#1a2e22]/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1a2e22] text-[#f7f9f2] mb-2 shadow">
            <Scissors className="w-6 h-6 text-[#c5a880]" />
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1a2e22]">
            TEXAS TEAZED
          </h2>
          <p className="text-[11px] tracking-widest uppercase font-semibold text-[#842323]">
            Luxury Hair Salon & Blowdry Bar
          </p>
          <p className="text-[11px] text-[#1a2e22]/70 mt-1">
            League City / Houston, TX • (281) 957-9602
          </p>
          <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#f7f9f2] border border-[#1a2e22]/15 text-[10px] font-bold text-[#1a2e22]">
            DIGITAL ZERO-PAPER RECEIPT #{client.id.slice(0, 8).toUpperCase()}
          </div>
        </div>

        {/* CLIENT & APPOINTMENT META */}
        <div className="py-3 border-b border-dashed border-[#1a2e22]/20 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#1a2e22]/60">Client:</span>
            <span className="font-bold text-[#1a2e22]">{client.firstName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#1a2e22]/60">Phone:</span>
            <span className="font-medium text-[#1a2e22]">{client.phone || "On File"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#1a2e22]/60">Date & Time:</span>
            <span className="font-medium text-[#1a2e22]">
              {client.date} @ {client.time || "11:30 AM"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#1a2e22]/60">Attending Stylist:</span>
            <span className="font-bold text-[#1a2e22]">{stylist}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#1a2e22]/60">Booking Source:</span>
            <span className="font-semibold text-[#1a2e22] uppercase text-[10px]">
              {client.channel === "walk_in" ? "Walk-In Counter" : "Online Website"}
            </span>
          </div>
        </div>

        {/* ITEMIZED BILL BREAKDOWN */}
        <div className="py-3 border-b border-dashed border-[#1a2e22]/20 space-y-2 text-xs">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-sm text-[#1a2e22]">{client.service}</p>
              <p className="text-[10px] text-[#1a2e22]/60">Professional Salon Service</p>
            </div>
            <span className="font-semibold text-sm text-[#1a2e22]">
              ${formatMoney(client.actualPrice)}
            </span>
          </div>

          {client.discountAmount > 0 && (
            <div className="flex justify-between text-[#842323] font-medium bg-[#842323]/5 p-2 rounded-lg">
              <div>
                <span>Instant Salon Discount</span>
                {client.discountReason && (
                  <span className="block text-[10px] text-[#842323]/80 italic">
                    {client.discountReason}
                  </span>
                )}
              </div>
              <span>-${formatMoney(client.discountAmount)}</span>
            </div>
          )}

          {client.tipAmount && client.tipAmount > 0 ? (
            <div className="flex justify-between text-[#1a2e22]/80">
              <span>Stylist Tip:</span>
              <span>+${formatMoney(client.tipAmount)}</span>
            </div>
          ) : null}
        </div>

        {/* FINAL TOTAL */}
        <div className="py-3 border-b border-dashed border-[#1a2e22]/20 flex justify-between items-center">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#1a2e22]/60 block">
              Total Amount Paid
            </span>
            <span className="text-[11px] text-[#1a2e22]/60">
              Method: {client.paymentMethod ? client.paymentMethod.toUpperCase() : "CARD / REGISTER"}
            </span>
          </div>
          <div className="text-right">
            <span className="font-serif text-3xl font-black text-[#1a2e22]">
              ${formatMoney(client.netCash)}
            </span>
            {client.discountAmount > 0 && (
              <span className="block text-[10px] font-bold text-emerald-800">
                You Saved ${formatMoney(client.discountAmount)}!
              </span>
            )}
          </div>
        </div>

        {/* FORMULA / CARE NOTE IF PRESENT */}
        {client.formulaNotes && (
          <div className="py-3 border-b border-dashed border-[#1a2e22]/20 text-[11px]">
            <span className="font-bold text-[#1a2e22]/70 uppercase tracking-wider block mb-0.5">
              Stylist Formula & Care Note:
            </span>
            <p className="text-[#1a2e22]/80 italic bg-[#f7f9f2] p-2 rounded-lg border border-[#1a2e22]/10">
              {client.formulaNotes}
            </p>
          </div>
        )}

        {/* APPRECIATION FOOTER */}
        <div className="py-3 text-center text-xs text-[#1a2e22]/70 space-y-1">
          <p className="font-serif italic font-medium text-[#1a2e22]">
            Thank you for teazing with us!
          </p>
          <p className="text-[10px] text-[#1a2e22]/50">
            For rebooking or inquiries, call (281) 957-9602 • texasteazed.com
          </p>
        </div>

        {/* 1-CLICK SENDING ACTION PANEL (Hidden when printing) */}
        <div className="mt-4 pt-3 border-t border-[#1a2e22]/15 space-y-2.5 print:hidden">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#1a2e22]/70 text-center">
            🚀 1-Click Digital Dispatch to Client
          </p>

          <div className="grid grid-cols-2 gap-2">
            {/* DIRECT SMS BUTTON */}
            <a
              href={smsUrl}
              className="py-2.5 px-3 rounded-xl bg-[#1a2e22] hover:bg-[#13231a] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Direct SMS Bill
            </a>

            {/* DIRECT WHATSAPP BUTTON */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              WhatsApp Bill
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* COPY RECEIPT TEXT */}
            <button
              onClick={handleCopy}
              className="py-2 px-3 rounded-xl border border-[#1a2e22]/20 hover:bg-[#1a2e22]/5 text-[#1a2e22] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied Text!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Receipt Text
                </>
              )}
            </button>

            {/* PRINT / PDF BUTTON */}
            <button
              onClick={handlePrint}
              className="py-2 px-3 rounded-xl border border-[#1a2e22]/20 hover:bg-[#1a2e22]/5 text-[#1a2e22] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>

          {/* PREVIEW OF SENT MESSAGE */}
          <div className="p-2.5 rounded-xl bg-[#f7f9f2] border border-[#1a2e22]/10 text-[11px] text-[#1a2e22]/80">
            <span className="font-bold text-[#1a2e22] block mb-0.5 text-[10px] uppercase">
              Message Preview:
            </span>
            &quot;{receiptMessage}&quot;
          </div>
        </div>

      </div>
    </div>
  );
}
