import { Phone, MessageSquare } from "lucide-react";

export function StickyContactButtons() {
  const rawPhone = "12813397168";
  const formattedPhone = "(281) 339-7168";
  const whatsappUrl = `https://wa.me/${rawPhone}?text=Hello%20Texas%20Teazed%20Hair%20Salon!%20I'd%20like%20to%20inquire%20about%20booking%20an%20appointment.`;

  return (
    <div
      id="sticky-contact-container"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 pointer-events-auto flex flex-col items-end gap-3"
    >
      {/* Optional WhatsApp Button (Secondary) */}
      <a
        id="sticky-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Optional: Chat on WhatsApp"
        aria-label="Chat on WhatsApp (Optional)"
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366]/90 hover:bg-[#20ba5a] text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white relative z-10 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>

        {/* Hover Tooltip (Desktop Only) */}
        <span className="hidden md:group-hover:block absolute right-full mr-3 px-3 py-1.5 bg-[#0f1f15] text-[#F3EFE6] text-xs font-medium rounded-xl whitespace-nowrap shadow-xl border border-beige/20 pointer-events-none transition-all">
          WhatsApp (Optional)
        </span>
      </a>

      {/* Primary Texas Local Phone / SMS Call-to-Action */}
      <a
        id="sticky-phone-btn"
        href={`tel:+${rawPhone}`}
        title={`Call or Text Salon at ${formattedPhone}`}
        aria-label={`Call or Text Salon at ${formattedPhone}`}
        className="group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-terracotta hover:bg-[#8e452a] text-white shadow-[0_6px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(181,77,46,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-beige/30"
      >
        {/* Soft Ambient Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-terracotta/30 animate-ping pointer-events-none" />

        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-beige animate-pulse" />
        <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase font-sans">
          Call or Text Salon
        </span>
        <span className="hidden lg:inline text-xs text-beige/80 font-mono">
          {formattedPhone}
        </span>
      </a>
    </div>
  );
}
