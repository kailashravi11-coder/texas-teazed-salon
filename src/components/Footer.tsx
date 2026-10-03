import { ArrowRight, ArrowUpRight, CheckCircle2, MessageSquare, Mail, Phone, ExternalLink, Loader2, RotateCcw, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { rawData } from "./Pricing";
import { LegalModal } from "./LegalModal";
import { AnimatedText } from "./AnimatedText";

export function Footer() {
  const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    email: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [smsUrl, setSmsUrl] = useState("");
  const [emailUrl, setEmailUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const salonEmail = "texasteazed96@gmail.com";
  const salonPhoneRaw = "12813397168";
  const salonPhoneFormatted = "(281) 339-7168";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const clientService = formData.service && formData.service !== 'Select a service' 
      ? formData.service 
      : 'General Consultation';

    // Standardized lead body requested for both SMS and Email
    const appointmentBody = `✂️ New Appointment Request\nName: ${formData.firstName || 'Not provided'}\nPhone: ${formData.phone || 'Not provided'}\nEmail: ${formData.email || 'Not provided'}\nService: ${clientService}\nMessage: ${formData.message || 'None'}`;

    // Cross-platform SMS URL (iOS Safari uses &body=, Android/others use ?body=)
    const isIOS = typeof navigator !== 'undefined' && (
      /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
    const smsDelimiter = isIOS ? '&' : '?';
    const generatedSmsUrl = `sms:+${salonPhoneRaw}${smsDelimiter}body=${encodeURIComponent(appointmentBody)}`;
    
    // Direct mailto link fallback
    const generatedMailtoUrl = `mailto:${salonEmail}?subject=${encodeURIComponent(`✂️ New Appointment Request: ${formData.firstName || 'Client'} (${formData.phone || ''})`)}&body=${encodeURIComponent(appointmentBody)}`;

    // Optional WhatsApp link
    const generatedWaUrl = `https://wa.me/${salonPhoneRaw}?text=${encodeURIComponent(appointmentBody)}`;

    setSmsUrl(generatedSmsUrl);
    setEmailUrl(generatedMailtoUrl);
    setWhatsappUrl(generatedWaUrl);

    // 1. Permanent Local Backup in browser storage with ISO date for calendar mapping
    try {
      const stored = localStorage.getItem('tt_salon_leads');
      const leads = stored ? JSON.parse(stored) : [];
      leads.unshift({
        id: 'LEAD-' + Date.now(),
        submittedAt: new Date().toISOString(),
        firstName: formData.firstName,
        phone: formData.phone,
        email: formData.email,
        service: clientService,
        message: formData.message,
        status: "new"
      });
      localStorage.setItem('tt_salon_leads', JSON.stringify(leads));
      
      // Dispatch custom event to notify portal and counter in real-time
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent("lead-submitted"));
      }
    } catch {
      // safe fallback
    }

    // 2. Dispatch Email lead directly to texasteazed96@gmail.com via FormSubmit AJAX
    try {
      await fetch(`https://formsubmit.co/ajax/${salonEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `✂️ New Appointment Request: ${formData.firstName} - ${formData.phone}`,
          _template: "table",
          "Client Name": formData.firstName,
          "Phone Number": formData.phone,
          "Email Address": formData.email,
          "Requested Service": clientService,
          "Client Message": formData.message || "None",
          "Submission Time": new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) + " (Texas Time)"
        })
      });
    } catch (err) {
      console.log("Background email dispatch:", err);
    }

    // 3. Immediately trigger user's native SMS app with pre-filled message to (281) 339-7168
    try {
      window.location.href = generatedSmsUrl;
    } catch {
      // safe fallback
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setFormData({
      firstName: "",
      phone: "",
      email: "",
      service: "",
      message: ""
    });
    setIsSubmitted(false);
  };

  return (
    <footer id="booking" className="bg-forest text-beige border-t border-forest">
      <div className="flex flex-col lg:flex-row">
        {/* Form Section - Clean, Pristine, Focused */}
        <div className="flex-1 p-5 sm:p-8 md:p-14 lg:p-20 xl:p-24 border-b lg:border-b-0 lg:border-r border-beige/10">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="uppercase tracking-[0.2em] text-terracotta text-xs sm:text-sm mb-4 sm:mb-6 font-medium"
          >
            Book Now
          </motion.p>
          <AnimatedText 
            text={["Schedule Your Next", "Hair Transformation"]}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif mb-8 sm:mb-12 text-beige leading-tight break-words"
          />

          {isSubmitted ? (
            /* Successful Submission Confirmation Screen */
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-forest/60 border border-beige/20 rounded-2xl p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-terracotta/20 border border-terracotta/40 flex items-center justify-center flex-shrink-0 text-terracotta">
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-terracotta" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif text-beige break-words">
                    Request Received, {formData.firstName || 'Gorgeous'}!
                  </h3>
                  <p className="text-beige/70 text-xs sm:text-sm">
                    Your appointment details have been automatically routed to our salon desk.
                  </p>
                </div>
              </div>

              {/* Status Box showing both channels */}
              <div className="space-y-3 bg-[#112318] p-4 sm:p-5 rounded-xl border border-beige/10">
                <div className="flex items-start gap-3">
                  <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div className="text-xs min-w-0">
                    <span className="text-beige font-medium block">
                      Email Notification Dispatched:
                    </span>
                    <span className="text-beige/60 break-all">
                      Lead sent permanently to <span className="text-beige font-mono">texasteazed96@gmail.com</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="p-1 rounded bg-terracotta/20 text-terracotta mt-0.5 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <div className="text-xs min-w-0">
                    <span className="text-beige font-medium block">
                      Direct SMS Opened to (281) 339-7168:
                    </span>
                    <span className="text-beige/60">
                      Your native Messages app was triggered with your pre-formatted appointment request. Tap <strong>Send</strong> in your Messages app so our team gets your text directly!
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-2">
                <a
                  href={smsUrl}
                  className="w-full sm:w-auto bg-terracotta text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#8e452a] transition-all flex items-center justify-center gap-2 shadow-lg text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  Open SMS App Again
                </a>

                <a
                  href={emailUrl}
                  className="w-full sm:w-auto border border-beige/30 text-beige hover:bg-beige/10 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Mail className="w-4 h-4" />
                  Send via Email App
                </a>

                {/* Optional WhatsApp for international clients */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-beige/60 hover:text-beige px-3 py-2 sm:py-3.5 rounded-full text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 underline decoration-beige/30 underline-offset-4"
                >
                  Prefer WhatsApp? (Optional)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2 border-t border-beige/10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-beige/60 hover:text-beige text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Book Another Appointment
                </button>
              </div>

              {/* Fixed Vagaro Link Below */}
              <div className="pt-4 border-t border-beige/15">
                <span className="text-beige/50 text-[11px] uppercase tracking-widest block mb-2 sm:mb-3 font-medium">
                  Instant Online Calendar Booking:
                </span>
                <a 
                  href="https://www.vagaro.com/texasteazedhairsalon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border border-beige/30 text-beige px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs uppercase tracking-widest hover:bg-beige hover:text-forest transition-all inline-flex items-center justify-center gap-2 text-center"
                >
                  Book Directly on Vagaro.com
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ) : (
            /* Active Booking Form */
            <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-beige/60 mb-2 sm:mb-3">
                    First Name <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-transparent border-b border-beige/20 pb-2 sm:pb-3 focus:outline-none focus:border-terracotta transition-colors text-beige text-base sm:text-lg"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-beige/60 mb-2 sm:mb-3">
                    Phone Number <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-beige/20 pb-2 sm:pb-3 focus:outline-none focus:border-terracotta transition-colors text-beige text-base sm:text-lg"
                    placeholder="(281) 339-7168"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-beige/60 mb-2 sm:mb-3">
                  Email Address <span className="text-terracotta">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-beige/20 pb-2 sm:pb-3 focus:outline-none focus:border-terracotta transition-colors text-beige text-base sm:text-lg"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-beige/60 mb-2 sm:mb-3">
                  Service Interested In
                </label>
                <select 
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-transparent border-b border-beige/20 pb-2 sm:pb-3 focus:outline-none focus:border-terracotta transition-colors text-beige text-base sm:text-lg appearance-none cursor-pointer"
                >
                  <option className="bg-forest text-beige">
                    Select a service
                  </option>
                  {rawData.map((category) => (
                    <optgroup key={category.name} label={category.name} className="bg-forest text-beige/50 font-bold uppercase tracking-widest text-xs">
                      {category.services.map((service) => (
                        <option key={service.name} value={`${service.name} - ${service.price}`} className="bg-forest text-beige font-normal normal-case text-base tracking-normal">
                          {service.name} - {service.price}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-beige/60 mb-2 sm:mb-3">
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-beige/20 pb-2 sm:pb-3 focus:outline-none focus:border-terracotta transition-colors text-beige text-base sm:text-lg resize-none"
                  placeholder="Tell us about your hair goals or preferred days..."
                ></textarea>
              </div>

              {/* Submit Buttons & Vagaro */}
              <div className="flex flex-col gap-4 sm:gap-6 mt-6">
                <div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-terracotta text-white px-6 sm:px-10 py-4 sm:py-5 rounded-full text-xs sm:text-sm uppercase tracking-widest hover:bg-[#8e452a] transition-all hover:scale-105 inline-flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Routing Request...
                      </>
                    ) : (
                      <>
                        Request Appointment
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-beige/50 mt-2.5 sm:mt-3 leading-relaxed">
                    ✉️ Sends instant lead to <span className="text-beige/80 font-mono">texasteazed96@gmail.com</span> & opens direct SMS to <span className="text-beige/80">(281) 339-7168</span>.
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full max-w-sm my-1">
                  <div className="h-px bg-beige/20 flex-1"></div>
                  <span className="text-beige/60 text-xs uppercase tracking-widest font-semibold">OR</span>
                  <div className="h-px bg-beige/20 flex-1"></div>
                </div>

                <a 
                  href="https://www.vagaro.com/texasteazedhairsalon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border border-beige/30 text-beige px-6 sm:px-10 py-4 sm:py-5 rounded-full text-xs sm:text-sm uppercase tracking-widest hover:bg-beige hover:text-forest transition-all hover:scale-105 inline-flex items-center justify-center gap-3 text-center"
                >
                  Book via Vagaro.com
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </form>
          )}
        </div>
        {/* Links Section */}
        <div className="flex-1 p-5 sm:p-8 md:p-14 lg:p-20 xl:p-24 bg-[#14291c] flex flex-col justify-between">
          <div>
            <div className="mb-10 sm:mb-16 md:mb-20">
              <div className="mb-4 sm:mb-6">
                <img 
                  src="/images/transparent.png" 
                  alt="Texas Teazed Hair Salon" 
                  className="h-28 sm:h-36 md:h-48 lg:h-64 w-auto max-w-full object-contain origin-left"
                />
              </div>
              <p className="text-beige/60 max-w-md text-base sm:text-lg leading-relaxed">
                Hair nerds with southern charm! We specialize in all things
                hair! We cannot wait to meet you guys!
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12">
              {/* Column 1: Explore */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-terracotta mb-4 sm:mb-6">
                  Explore
                </h4>
                <ul className="space-y-3 sm:space-y-3.5 text-beige/70 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-terracotta transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#mission"
                      className="hover:text-terracotta transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#services"
                      className="hover:text-terracotta transition-colors"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="hover:text-terracotta transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#gallery"
                      className="hover:text-terracotta transition-colors"
                    >
                      Gallery
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="hover:text-terracotta transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2: Location & Contact */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-terracotta mb-4 sm:mb-6">
                  Location & Contact
                </h4>
                <div className="space-y-4 sm:space-y-5 text-beige/70">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-beige/50 block mb-1">
                      Direct Salon Line
                    </span>
                    <a
                      href="tel:+12813397168"
                      className="hover:text-terracotta transition-colors block text-lg sm:text-xl font-medium text-beige whitespace-nowrap"
                    >
                      (281) 339-7168
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-beige/50 block mb-1">
                      Email Inquiries
                    </span>
                    <a
                      href="mailto:texasteazed96@gmail.com"
                      className="hover:text-terracotta transition-colors block text-xs sm:text-sm font-medium text-beige break-all"
                    >
                      texasteazed96@gmail.com
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-beige/50 block mb-1">
                      Salon Address
                    </span>
                    <address className="not-italic leading-relaxed text-xs sm:text-sm md:text-base text-beige/90">
                      2576 East League City Parkway<br />
                      League City, TX 77573
                    </address>
                    <a
                      href="https://maps.google.com/?q=2576+East+League+City+Parkway+League+City+TX+77573"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline mt-1.5 sm:mt-2 font-medium"
                    >
                      Get Directions ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Column 3: Hours of Operation */}
              <div className="sm:col-span-2 lg:col-span-1">
                <h4 className="text-xs uppercase tracking-widest text-terracotta mb-4 sm:mb-6">
                  Salon Hours
                </h4>
                <ul className="space-y-2 sm:space-y-2.5 text-beige/70 w-full max-w-sm">
                  <li className="flex justify-between items-center gap-2 py-1 sm:py-1.5 border-b border-beige/10 text-xs sm:text-sm">
                    <span className="text-beige/90 font-medium">Tue – Fri:</span>
                    <span className="text-right">9:30 AM – 6:30 PM</span>
                  </li>
                  <li className="flex justify-between items-center gap-2 py-1 sm:py-1.5 border-b border-beige/10 text-xs sm:text-sm">
                    <span className="text-beige/90 font-medium">Saturday:</span>
                    <span className="text-right">9:00 AM – 4:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center gap-2 py-1 sm:py-1.5 border-b border-beige/10 text-xs sm:text-sm">
                    <span className="text-beige/90 font-medium">Sunday:</span>
                    <span className="text-right">9:00 AM – 9:05 AM</span>
                  </li>
                  <li className="flex justify-between items-center gap-2 py-1 sm:py-1.5 text-xs sm:text-sm">
                    <span className="text-beige/90 font-medium">Monday:</span>
                    <span className="text-right font-medium text-terracotta">Closed</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Media & Contact Connect Bar */}
            <div className="mt-12 pt-8 border-t border-beige/10">
              <h4 className="text-xs uppercase tracking-widest text-terracotta mb-5 font-semibold flex items-center gap-2">
                <span>Connect With Us</span>
                <span className="h-px bg-terracotta/30 flex-1 max-w-[80px]"></span>
              </h4>
              <div className="flex flex-col gap-3.5 w-full">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/texas_teazed_league_city/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-beige/5 hover:bg-beige/10 border border-beige/10 hover:border-terracotta/50 transition-all duration-300 w-full"
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-[10px] uppercase tracking-widest text-beige/50 font-semibold mb-0.5">
                      Instagram Official
                    </div>
                    <div className="text-sm sm:text-base font-medium text-beige group-hover:text-terracotta transition-colors break-words">
                      @texas_teazed_league_city
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-beige/40 group-hover:text-terracotta group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/people/Texas-Teazed-Hair-Salon/100063456485537/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-beige/5 hover:bg-beige/10 border border-beige/10 hover:border-terracotta/50 transition-all duration-300 w-full"
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <svg
                      className="w-6 h-6 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-[10px] uppercase tracking-widest text-beige/50 font-semibold mb-0.5">
                      Facebook Page
                    </div>
                    <div className="text-sm sm:text-base font-medium text-beige group-hover:text-terracotta transition-colors break-words">
                      Texas Teazed Hair Salon
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-beige/40 group-hover:text-terracotta group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </a>

                {/* Personal Email */}
                <a
                  href="mailto:texasteazed96@gmail.com"
                  className="group flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl bg-beige/5 hover:bg-beige/10 border border-beige/10 hover:border-terracotta/50 transition-all duration-300 w-full"
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#EA4335] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-[10px] uppercase tracking-widest text-beige/50 font-semibold mb-0.5">
                      Salon Direct Email
                    </div>
                    <div className="text-sm sm:text-base font-medium text-beige group-hover:text-terracotta transition-colors break-all">
                      texasteazed96@gmail.com
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-beige/40 group-hover:text-terracotta group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-[#0f1f15] px-4 sm:px-8 md:px-16 lg:px-24 py-6 sm:py-8 text-xs sm:text-sm text-beige/40 flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-6 text-center md:text-left">
        <p className="order-2 md:order-1">&copy; 2026 Texas Teazed Hair Salon. All rights reserved.</p>

        {/* Quick Social Icons */}
        <div className="order-1 md:order-2 flex items-center gap-3">
          <a
            href="https://www.instagram.com/texas_teazed_league_city/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Texas Teazed Instagram"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] flex items-center justify-center text-beige hover:text-white transition-all duration-300 border border-beige/10"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/people/Texas-Teazed-Hair-Salon/100063456485537/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Texas Teazed Facebook"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#1877F2] flex items-center justify-center text-beige hover:text-white transition-all duration-300 border border-beige/10"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="mailto:texasteazed96@gmail.com"
            aria-label="Email Texas Teazed"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#EA4335] flex items-center justify-center text-beige hover:text-white transition-all duration-300 border border-beige/10"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>

        <div className="order-3 flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 lg:gap-8">
          <button
            onClick={() => setLegalType('privacy')}
            className="hover:text-beige transition-colors uppercase tracking-widest text-[11px] sm:text-xs cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setLegalType('terms')}
            className="hover:text-beige transition-colors uppercase tracking-widest text-[11px] sm:text-xs cursor-pointer"
          >
            Terms of Service
          </button>
          <a
            href="?portal=leads"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-terracotta transition-colors uppercase tracking-widest text-[11px] sm:text-xs flex items-center gap-1.5 text-beige/40 hover:text-beige font-medium"
            title="Salon Owner & Staff Confidential Lead Tracker"
          >
            <Lock className="w-3.5 h-3.5 text-terracotta" />
            <span>Staff Portal (Leads & Conversion)</span>
          </a>
        </div>
      </div>

      {/* Creator Signature Credit Bar */}
      <div className="bg-[#09140e] border-t border-beige/10 px-6 py-4 text-center">
        <p className="text-xs sm:text-sm text-beige/80 tracking-wider">
          Created by{" "}
          <span className="font-semibold text-[#D4AF37] hover:text-[#f3cc5c] tracking-widest transition-colors">
            SHYAM CREATIVE LABS
          </span>{" "}
          <span className="text-beige/70 font-medium">(Kailashh Prasaad)</span>
        </p>
      </div>
      
      <LegalModal 
        isOpen={legalType !== null} 
        onClose={() => setLegalType(null)} 
        type={legalType} 
      />
    </footer>
  );
}
