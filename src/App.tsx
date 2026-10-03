import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Mission } from './components/Mission';
import { VideoDivider } from './components/VideoDivider';
import { Services } from './components/Services';
import { ColorArchitecture } from './components/ColorArchitecture';
import { TonersAndRefreshers } from './components/TonersAndRefreshers';
import { OurStaff } from './components/OurStaff';
import { Pricing } from './components/Pricing';
import { GalleryVideo } from './components/GalleryVideo';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { InstagramFeed } from './components/InstagramFeed';
import { CtaVideo } from './components/CtaVideo';
import { Footer } from './components/Footer';
import { StickyContactButtons } from './components/StickyContactButtons';
import { MotionProgressBar } from './components/MotionProgressBar';
import { StaffLeadPortal } from './components/StaffLeadPortal';
import { DragToScroll } from './components/DragToScroll';

export default function App() {
  const [isStaffPortal, setIsStaffPortal] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('portal') === 'leads' || window.location.hash === '#staff-portal';
  });

  useEffect(() => {
    const checkRoute = () => {
      const params = new URLSearchParams(window.location.search);
      setIsStaffPortal(params.get('portal') === 'leads' || window.location.hash === '#staff-portal');
    };
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  if (isStaffPortal) {
    return <StaffLeadPortal onExit={() => setIsStaffPortal(false)} />;
  }

  return (
    <div className="bg-forest p-2 sm:p-4 md:p-6 lg:p-8 min-h-screen font-sans text-forest selection:bg-terracotta selection:text-white relative overflow-x-hidden w-full max-w-full">
      <DragToScroll />
      <MotionProgressBar />
      <div className="bg-beige rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-full">
        <Hero />
        <Mission />
        <VideoDivider />
        <Services />
        <ColorArchitecture />
        <TonersAndRefreshers />
        <OurStaff />
        <Pricing />
        <GalleryVideo />
        <Testimonials />
        <FAQ />
        <InstagramFeed />
        <CtaVideo />
        <Footer />
      </div>
      <StickyContactButtons />
    </div>
  );
}
