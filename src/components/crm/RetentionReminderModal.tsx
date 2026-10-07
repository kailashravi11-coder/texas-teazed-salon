import React, { useState } from "react";
import {
  X,
  Clock,
  Sparkles,
  MessageSquare,
  Smartphone,
  Check,
  Copy,
  Scissors,
  User,
  Calendar,
  HeartHandshake,
  Tag,
} from "lucide-react";
import { SalonClientRecord, SalonStaffMember } from "../../types/crm";

interface RetentionReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: SalonClientRecord | null;
  weeksElapsed?: number;
  daysElapsed?: number;
  onMarkContacted?: (clientId: string) => void;
}

export function RetentionReminderModal({
  isOpen,
  onClose,
  client,
  weeksElapsed = 5,
  daysElapsed = 35,
  onMarkContacted,
}: RetentionReminderModalProps) {
  const [copied, setCopied] = useState(false);
  const [customOffer, setCustomOffer] = useState(false);

  if (!isOpen || !client) return null;

  const stylist = client.stylistName || "Ashley";
  const clientName = client.firstName || "there";
  const service = client.service || "Hair";

  // Pre-drafted friendly text messages
  const defaultMessage = `Hi ${clientName}! It's been ${weeksElapsed} weeks since your last visit at Texas Teazed with ${stylist}. Time to refresh your ${service}? Book your spot now: (281) 957-9602 or reply to this text. See you soon!`;
  const promoMessage = `Hi ${clientName}! Your ${service} with ${stylist} at Texas Teazed is due for a refresh (${weeksElapsed} weeks since last visit). Mention this text for $10 OFF your maintenance service this week! Call (281) 957-9602 or book at texasteazed.com.`;

  const activeMessage = customOffer ? promoMessage : defaultMessage;

  const cleanPhone = (client.phone || "").replace(/\D/g, "");
  const formattedUsPhone = cleanPhone.length === 10 ? `1${cleanPhone}` : cleanPhone;
  const smsUrl = `sms:${client.phone || ""}?body=${encodeURIComponent(activeMessage)}`;
  const waUrl = cleanPhone
    ? `https://wa.me/${formattedUsPhone}?text=${encodeURIComponent(activeMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(activeMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMarkContacted = () => {
    if (onMarkContacted && client.id) {
      onMarkContacted(client.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#f7f9f2] rounded-3xl shadow-2xl border border-[#1a2e22]/20 p-5 sm:p-7 text-[#1a2e22] max-h-[92vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#1a2e22]/60 hover:text-[#1a2e22] hover:bg-[#1a2e22]/10 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#1a2e22]/15">
          <div className="w-12 h-12 rounded-2xl bg-[#1a2e22] text-[#f7f9f2] flex items-center justify-center shadow">
            <Clock className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1a2e22]">
                6-Week Client Retention Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#842323] text-white uppercase tracking-wider">
                DUE FOR VISIT
              </span>
            </div>
            <p className="text-xs text-[#1a2e22]/70 mt-0.5">
              1-Click Rebooking SMS to bring repeat clients back to salon chairs
            </p>
          </div>
        </div>

        {/* CLIENT RETENTION STATUS CARD */}
        <div className="my-4 p-4 rounded-2xl bg-white border border-[#1a2e22]/15 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a2e22]/60">
                CLIENT PROFILE
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1a2e22]">
                {client.firstName}
              </h3>
              <p className="text-xs text-[#1a2e22]/70">
                {client.phone} • {client.email || "No email"}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
                ⏰ {weeksElapsed} WEEKS AGO ({daysElapsed} DAYS)
              </span>
              <p className="text-[10px] text-[#1a2e22]/60 mt-1">
                Last Service: {client.date}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1a2e22]/10 text-xs">
            <div>
              <span className="text-[#1a2e22]/60 text-[11px]">Previous Service:</span>
              <p className="font-bold text-[#1a2e22]">{client.service}</p>
            </div>
            <div>
              <span className="text-[#1a2e22]/60 text-[11px]">Attending Stylist:</span>
              <p className="font-bold text-[#1a2e22]">{stylist}</p>
            </div>
          </div>
        </div>

        {/* MESSAGE TEMPLATE SELECTOR */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1a2e22]/70">
              CHOOSE TEXT REMINDER TEMPLATE:
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCustomOffer(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  !customOffer
                    ? "bg-[#1a2e22] text-white"
                    : "bg-white border border-[#1a2e22]/20 text-[#1a2e22]/70"
                }`}
              >
                Standard Friendly
              </button>
              <button
                type="button"
                onClick={() => setCustomOffer(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  customOffer
                    ? "bg-[#842323] text-white"
                    : "bg-white border border-[#1a2e22]/20 text-[#1a2e22]/70"
                }`}
              >
                + $10 OFF Retention Offer
              </button>
            </div>
          </div>

          {/* MESSAGE PREVIEW BOX */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#1a2e22]/20 shadow-inner relative">
            <div className="flex items-center justify-between mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1a2e22]/50">
              <span>Ready-To-Send Text Preview:</span>
              <span>{activeMessage.length} chars</span>
            </div>
            <p className="text-xs text-[#1a2e22] font-mono leading-relaxed bg-[#f7f9f2] p-3 rounded-xl border border-[#1a2e22]/10">
              &quot;{activeMessage}&quot;
            </p>
          </div>
        </div>

        {/* 1-CLICK ACTION BUTTONS */}
        <div className="mt-5 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {/* DIRECT SMS BUTTON */}
            <a
              href={smsUrl}
              onClick={handleMarkContacted}
              className="py-3 px-4 rounded-xl bg-[#1a2e22] hover:bg-[#13231a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              1-Click Direct SMS
            </a>

            {/* DIRECT WHATSAPP BUTTON */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleMarkContacted}
              className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              1-Click WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* COPY TEXT BUTTON */}
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl border border-[#1a2e22]/25 bg-white hover:bg-[#1a2e22]/5 text-[#1a2e22] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Copied Text!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Reminder Text
                </>
              )}
            </button>

            {/* MARK AS CONTACTED */}
            <button
              onClick={handleMarkContacted}
              className="py-2.5 px-3 rounded-xl border border-[#1a2e22]/25 bg-white hover:bg-[#1a2e22]/5 text-[#1a2e22] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Check className="w-4 h-4 text-[#842323]" />
              Mark As Reminded
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-[#1a2e22]/50 mt-4">
          🔒 Texas Teazed Automated Retention Engine • Designed to boost 6-week repeat visits
        </p>

      </div>
    </div>
  );
}
