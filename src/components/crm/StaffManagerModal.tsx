import React, { useState } from "react";
import { X, Users, UserPlus, CheckCircle2, XCircle, Trash2, Shield, Phone, Mail } from "lucide-react";
import { SalonStaffMember } from "../../types/crm";

interface StaffManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: SalonStaffMember[];
  onUpdateStaffList: (updated: SalonStaffMember[]) => void;
}

export function StaffManagerModal({
  isOpen,
  onClose,
  staffList,
  onUpdateStaffList,
}: StaffManagerModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleToggleActive = (id: string) => {
    const updated = staffList.map((s) =>
      s.id === id ? { ...s, active: !s.active } : s
    );
    onUpdateStaffList(updated);
  };

  const handleDeleteStaff = (id: string, staffName: string) => {
    if (confirm(`Are you sure you want to remove ${staffName} from active directory?`)) {
      const updated = staffList.filter((s) => s.id !== id);
      onUpdateStaffList(updated);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStaff: SalonStaffMember = {
      id: `staff-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || "Stylist",
      phone: phone.trim() || "(281) 555-0100",
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, "")}@texasteazed.com`,
      active: true,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    onUpdateStaffList([...staffList, newStaff]);
    setName("");
    setRole("");
    setPhone("");
    setEmail("");
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-beige rounded-2xl shadow-2xl border border-forest/20 p-5 sm:p-7 text-forest max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between gap-3 mb-6 border-b border-forest/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-beige flex items-center justify-center shadow">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest">
                Staff HRM & Team Directory
              </h2>
              <p className="text-xs sm:text-sm text-forest/70">
                Stylist lifecycle, active booking availability & chair status
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-xl bg-forest text-beige text-xs sm:text-sm font-semibold hover:bg-forest/90 transition flex items-center gap-1.5 shadow"
          >
            <UserPlus className="w-4 h-4" />
            {showAddForm ? "Cancel Add" : "Add Stylist"}
          </button>
        </div>

        {/* ADD NEW STYLIST FORM */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="mb-6 p-4 rounded-xl bg-forest/5 border border-forest/20 space-y-3"
          >
            <h3 className="text-sm font-bold text-forest flex items-center gap-2">
              <Shield className="w-4 h-4 text-terracotta" />
              Onboard New Team Member
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-forest/70 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Williams"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-forest/20 bg-white text-xs text-forest"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest/70 mb-1">
                  Role / Specialization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Balayage Specialist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-forest/20 bg-white text-xs text-forest"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest/70 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="(281) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-forest/20 bg-white text-xs text-forest"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-forest/70 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="stylist@texasteazed.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-forest/20 bg-white text-xs text-forest"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition"
              >
                Save & Add to Directory
              </button>
            </div>
          </form>
        )}

        {/* STYLISTS LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-forest/60 px-1">
            <span>Stylist & Chair Details</span>
            <span>Status / Action</span>
          </div>

          <div className="divide-y divide-forest/10 border border-forest/15 rounded-xl overflow-hidden bg-white/70">
            {staffList.map((member) => (
              <div
                key={member.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-forest/5 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-forest">
                      {member.name}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        member.active
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {member.active ? "Active" : "Inactive / On Leave"}
                    </span>
                  </div>
                  <p className="text-xs text-terracotta font-medium mt-0.5">
                    {member.role}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-forest/60 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {member.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {member.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleActive(member.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                      member.active
                        ? "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300"
                        : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300"
                    }`}
                  >
                    {member.active ? (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-amber-700" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        Set Active
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteStaff(member.id, member.name)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                    title="Delete Staff Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-5 mt-5 border-t border-forest/15">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-forest text-beige font-semibold text-xs sm:text-sm hover:bg-forest/90 transition shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
