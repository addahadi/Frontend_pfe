// src/modules/user/pages/UserProfile.jsx
import React, { useState } from "react";
import { Save, X, Zap, Bookmark, Heart, Calendar, CreditCard, User, Edit } from "lucide-react";

const UserProfile = () => {
  // بيانات ثابتة
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@quanticconstruct.com",
    role: "SENIOR PROJECT MANAGER",
    plan: "Pro Analytics Plus",
    billingCycle: "Annual",
    periodStart: "Jan 01, 2024",
    periodEnd: "Jan 01, 2025",
    limits: {
      projectsCreated: 3,
      projectsMax: 20,
      aiRequestsUsed: 45,
      aiRequestsMax: 500,
      teamSeats: 25,
    },
  });

  const [savedArticles] = useState([
    { id: 1, title: "Sustainable Concrete Trends", type: "BLOG", status: "PUBLISHED" },
    { id: 2, title: "2024 Safety Regulations", type: "ACTUALITE", status: "DRAFT" },
    { id: 3, title: "BIM Integration 101", type: "BLOG", status: "PUBLISHED" },
  ]);

  const [likedArticles] = useState([
    { id: 4, title: "Cost Optimization Hacks", type: "ACTUALITE", status: "PUBLISHED" },
    { id: 5, title: "Urban Development News", type: "ACTUALITE", status: "PUBLISHED" },
  ]);

  const [formData, setFormData] = useState({ fullName: profile.fullName, email: profile.email });
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    setProfile({ ...profile, fullName: formData.fullName, email: formData.email });
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* الشريط العلوي مع الأفاتار بجانب الاسم */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* الأفاتار الدائري */}
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-md">
            JD
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.fullName}</h2>
            <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
            <p className="text-sm text-primary font-semibold mt-1">{profile.role}</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      {/* باقي المحتوى (Current Plan, Plan Limits, Articles) - لم يتغير */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Current Plan */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border p-5">
          <h3 className="text-md font-semibold text-slate-500 uppercase mb-3">Current Plan</h3>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{profile.plan}</p>
          <p className="text-sm text-slate-500 mt-1">Full access to advanced construction analytics...</p>
          <div className="flex items-center gap-2 mt-3 text-sm">
            <Calendar size={14} /> Billing Cycle: {profile.billingCycle}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard size={14} /> {profile.periodStart} - {profile.periodEnd}
          </div>
          <div className="flex flex-col gap-3 mt-5">
            <button className="w-full bg-primary/10 text-primary py-2 rounded-lg">Switch Plan</button>
            <button className="w-full border border-red-300 text-red-600 py-2 rounded-lg">Cancel Subscription</button>
          </div>
        </div>

        {/* Plan Limits */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border p-5">
          <h3 className="text-md font-semibold text-slate-500 uppercase mb-4">Plan Limits</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
              <p className="text-xs text-slate-500">Projects Created</p>
              <p className="text-xl font-bold">{profile.limits.projectsCreated} / {profile.limits.projectsMax}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
              <p className="text-xs text-slate-500">AI Requests Used</p>
              <p className="text-xl font-bold">{profile.limits.aiRequestsUsed} / {profile.limits.aiRequestsMax}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
              <p className="text-xs text-slate-500">Team Members</p>
              <p className="text-xl font-bold">{profile.limits.teamSeats} Seats</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
              <p className="text-xs text-slate-500">Support </p>
              <p className="text-xl font-bold ">Priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved و Liked Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-3"><Bookmark size={18} className="text-primary" /><h3 className="font-bold">Saved Articles</h3></div>
          {savedArticles.map(a => (
            <div key={a.id} className="flex justify-between items-center text-sm border-b pb-2 mb-2">
              <div><p className="font-medium">{a.title}</p><div className="flex gap-2 text-xs text-slate-400"><span>{a.type}</span><span>{a.status}</span></div></div>
              <button><X size={14} /></button>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-3"><Heart size={18} className="text-red-500" /><h3 className="font-bold">Liked Articles</h3></div>
          {likedArticles.map(a => (
            <div key={a.id} className="flex justify-between items-center text-sm border-b pb-2 mb-2">
              <div><p className="font-medium">{a.title}</p><div className="flex gap-2 text-xs text-slate-400"><span>{a.type}</span><span>{a.status}</span></div></div>
              <button><Heart size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Edit Profile */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Full Name</label><input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Email Address</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;