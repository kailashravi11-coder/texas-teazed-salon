import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

type LegalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | null;
};

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !type) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#f8f5f0] text-forest rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-forest/10 bg-white">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-terracotta">
              {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-forest/5 text-forest/60 hover:text-forest transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 text-base leading-relaxed text-forest/80 space-y-6">
            {type === 'privacy' ? (
              <>
                <p className="text-sm font-bold tracking-widest uppercase text-terracotta/80">Last Updated: September 17, 2026</p>
                
                <h3 className="text-xl font-semibold text-forest mt-8">1. Introduction</h3>
                <p>Welcome to Texas Teazed Hair Salon ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or visit our salon located in League City, Texas.</p>
                
                <h3 className="text-xl font-semibold text-forest mt-8">2. Information We Collect</h3>
                <p>We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our services, or when you participate in activities on our website or at our physical salon.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Data:</strong> Name, phone number, email address, and physical address.</li>
                  <li><strong>Payment Data:</strong> Data necessary to process your payment if you make purchases, such as your payment instrument number (e.g., a credit card number), and the security code associated with your payment instrument.</li>
                  <li><strong>Service Data:</strong> Hair history, treatment notes, formulas used, and preferences.</li>
                </ul>

                <h3 className="text-xl font-semibold text-forest mt-8">3. How We Use Your Information</h3>
                <p>We use the personal information collected via our website for a variety of business purposes described below:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To facilitate account creation and logon process through third-party platforms (like Vagaro).</li>
                  <li>To fulfill and manage your appointments and purchases.</li>
                  <li>To send administrative information to you, such as appointment reminders and policy changes.</li>
                  <li>To send you marketing and promotional communications (you may opt-out at any time).</li>
                </ul>

                <h3 className="text-xl font-semibold text-forest mt-8">4. Sharing Your Information</h3>
                <p>We do not share, sell, rent, or trade your information with third parties for their promotional purposes. We may share your information with service providers (such as Vagaro for booking) solely for the purpose of operating our business and providing you with our services.</p>

                <h3 className="text-xl font-semibold text-forest mt-8">5. Texas Privacy Rights</h3>
                <p>If you are a resident of Texas, you may have specific rights regarding your personal information under state law. We comply with all applicable state and federal laws regarding consumer privacy and data protection.</p>

                <h3 className="text-xl font-semibold text-forest mt-8">6. Contact Us</h3>
                <p>If you have questions or comments about this notice, you may email us at <a href="mailto:texasteazed96@gmail.com" className="text-terracotta underline font-medium">texasteazed96@gmail.com</a> or by post to:</p>
                <address className="not-italic pl-4 border-l-2 border-terracotta mt-4 bg-terracotta/5 p-4 rounded-r-lg">
                  <strong>Texas Teazed Hair Salon</strong><br/>
                  2576 East League City Parkway<br/>
                  League City, TX 77573<br/>
                  United States
                </address>
              </>
            ) : (
              <>
                <p className="text-sm font-bold tracking-widest uppercase text-terracotta/80">Last Updated: September 17, 2026</p>
                
                <h3 className="text-xl font-semibold text-forest mt-8">1. Agreement to Terms</h3>
                <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Texas Teazed Hair Salon ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto. Our business is registered and operates within the State of Texas.</p>

                <h3 className="text-xl font-semibold text-forest mt-8">2. Salon Policies & Appointments</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cancellations:</strong> We require at least 24 hours' notice for cancellations. Late cancellations or no-shows may be subject to a fee up to 50% of the scheduled service cost.</li>
                  <li><strong>Late Arrivals:</strong> If you are more than 15 minutes late, we may need to reschedule your appointment or alter your service to fit the remaining time to ensure we are on time for our next client.</li>
                  <li><strong>Satisfaction Guarantee:</strong> We want you to love your hair. If you are unsatisfied, please contact us within 7 days of your service, and we will gladly adjust it. Refunds are not issued for services rendered.</li>
                </ul>

                <h3 className="text-xl font-semibold text-forest mt-8">3. Pricing & Payments</h3>
                <p>All prices listed are starting prices and are subject to change based on hair length, thickness, and the amount of product needed. A final quote will be provided during your consultation before the service begins. We accept cash and all major credit cards. Payment is due at the time of service.</p>

                <h3 className="text-xl font-semibold text-forest mt-8">4. Health & Safety</h3>
                <p>For the safety of our staff and clients, we ask that you reschedule your appointment if you are feeling unwell. We adhere to all sanitation guidelines mandated by the Texas Department of Licensing and Regulation (TDLR).</p>

                <h3 className="text-xl font-semibold text-forest mt-8">5. Governing Law</h3>
                <p>These Terms shall be governed by and defined following the laws of the State of Texas. Texas Teazed Hair Salon and yourself irrevocably consent that the courts of Galveston County, Texas shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.</p>

                <h3 className="text-xl font-semibold text-forest mt-8">6. Contact Information</h3>
                <p>In order to resolve a complaint regarding the Site or our services, please contact us at:</p>
                <address className="not-italic pl-4 border-l-2 border-terracotta mt-4 bg-terracotta/5 p-4 rounded-r-lg">
                  <strong>Texas Teazed Hair Salon</strong><br/>
                  2576 East League City Parkway<br/>
                  League City, TX 77573<br/>
                  Phone: (281) 339-7168
                </address>
              </>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-6 bg-forest/5 border-t border-forest/10 flex justify-end">
            <button
              onClick={onClose}
              className="bg-forest text-beige px-8 py-3 rounded-full text-sm uppercase tracking-widest hover:bg-forest/90 transition-colors font-semibold shadow-md"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
