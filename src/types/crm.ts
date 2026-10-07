export type ClientStatus = "new" | "contacted" | "converted" | "lost";
export type ClientChannel = "online" | "walk_in";
export type PaymentMethod = "card" | "cash" | "zelle" | "apple_pay";

export interface SalonClientRecord {
  id: string;
  firstName: string;
  phone: string;
  email: string;
  service: string;
  stylistName: string;
  channel: ClientChannel;
  status: ClientStatus;
  date: string; // YYYY-MM-DD
  time?: string;
  actualPrice: number;
  discountAmount: number;
  discountPercent: number;
  netCash: number;
  discountReason?: string;
  paymentMethod?: PaymentMethod;
  tipAmount?: number;
  message?: string;
  formulaNotes?: string;
  submittedAt: string;
}

export interface SalonStaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  active: boolean;
  joinedDate?: string;
}

export interface ServiceMenuItem {
  name: string;
  price: number;
  category: string;
}

// Actual Services & Official Menu Pricing matching Pricing.tsx
export const SALON_SERVICES: ServiceMenuItem[] = [
  // Color Services
  { name: "Balayage", price: 215, category: "Color Services" },
  { name: "Balayage and Color Retouch", price: 245, category: "Color Services" },
  { name: "Balayage and Haircut", price: 275, category: "Color Services" },
  { name: "Balayage, Color Retouch and Haircut", price: 295, category: "Color Services" },
  { name: "All Over Color", price: 110, category: "Color Services" },
  { name: "All Over Color with Haircut", price: 165, category: "Color Services" },
  { name: "Color correction", price: 250, category: "Color Services" },

  // Haircuts & Styling
  { name: "Women's Haircut", price: 65, category: "Haircuts & Styling" },
  { name: "Men's Haircut", price: 35, category: "Haircuts & Styling" },
  { name: "Boy's Haircut", price: 30, category: "Haircuts & Styling" },
  { name: "Girl's Haircut", price: 40, category: "Haircuts & Styling" },

  // Toners & Refreshers
  { name: "Toner / Demi-Permanent Color", price: 50, category: "Toners & Refreshers" },
  { name: "Toner & Haircut", price: 75, category: "Toners & Refreshers" },

  // Root Touch Up
  { name: "Root Color Touch Up", price: 70, category: "Root Touch Up" },
  { name: "Root Color Touch Up With Haircut", price: 110, category: "Root Touch Up" },

  // Smoothing Treatments
  { name: "Keratin Smoothing Treatment", price: 195, category: "Hair Smoothing Treatment" },

  // Highlights
  { name: "Full Highlight", price: 150, category: "Highlight" },
  { name: "Highlight and Haircut", price: 200, category: "Highlight" },
  { name: "Highlight and Color Retouch", price: 200, category: "Highlight" },
  { name: "Highlight, Root Color and Haircut", price: 225, category: "Highlight" },
  { name: "Partial Highlight", price: 110, category: "Highlight" },
  { name: "Partial Highlight and Haircut", price: 150, category: "Highlight" },
  { name: "Partial Highlight and Color Retouch", price: 145, category: "Highlight" },

  // Hair Treatments & Styling
  { name: "Olaplex", price: 50, category: "Hair Treatments" },
  { name: "Conditioning Treatment", price: 30, category: "Hair Treatments" },
  { name: "Flat iron/curl Style", price: 35, category: "Hair Treatments" },
  { name: "Shampoo Blow Dry and Style", price: 35, category: "Hair Treatments" },
  { name: "Shampoo and Blow-Dry", price: 35, category: "Hair Treatments" },
  { name: "Shampoo", price: 20, category: "Hair Treatments" },

  // Extensions & Waxing
  { name: "Extension (Move Up)", price: 150, category: "Weft Extensions" },
  { name: "Waxing - Brow Shaping", price: 20, category: "Waxing" },
  { name: "Nose wax", price: 15, category: "Waxing" },
  { name: "Ear wax", price: 15, category: "Waxing" },
];

// Actual Salon Staff Members matching OurStaff.tsx
export const INITIAL_STAFF_MEMBERS: SalonStaffMember[] = [
  {
    id: "staff-1",
    name: "Antoinette (Toni) Johnson",
    role: "Master Colorist",
    phone: "(281) 450-8901",
    email: "toni@texasteazed.com",
    active: true,
  },
  {
    id: "staff-2",
    name: "Ashley Cox",
    role: "Lead Stylist",
    phone: "(281) 450-8902",
    email: "ashley@texasteazed.com",
    active: true,
  },
  {
    id: "staff-3",
    name: "Evangeline (Vangie) Schuler",
    role: "Master Hairstylist",
    phone: "(832) 450-8903",
    email: "vangie@texasteazed.com",
    active: true,
  },
  {
    id: "staff-4",
    name: "Kastin Wilde",
    role: "Cutting Specialist",
    phone: "(713) 450-8904",
    email: "kastin@texasteazed.com",
    active: true,
  },
  {
    id: "staff-5",
    name: "Katie Zimmerman",
    role: "Senior Stylist",
    phone: "(281) 450-8905",
    email: "katie@texasteazed.com",
    active: true,
  },
  {
    id: "staff-6",
    name: "Linsie Reames",
    role: "Blonding Expert",
    phone: "(832) 450-8906",
    email: "linsie@texasteazed.com",
    active: true,
  },
];
