
import React, { useState } from "react";
import { Bookmark, Heart, Calendar, CreditCard, Edit, Search, X, Eye } from "lucide-react";

const UserProfile = () => {
  
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

  
  const [savedArticles, setSavedArticles] = useState([
    { id: 1, title: "Sustainable Concrete Trends", type: "BLOG", status: "PUBLISHED" },
    { id: 2, title: "2024 Safety Regulations", type: "ACTUALITE", status: "DRAFT" },
    { id: 3, title: "BIM Integration 101", type: "BLOG", status: "PUBLISHED" },
    { id: 4, title: "Urban Development News", type: "ACTUALITE", status: "PUBLISHED" },
    { id: 5, title: "Cost Optimization Hacks", type: "ACTUALITE", status: "PUBLISHED" },
    { id: 6, title: "Green Concrete Innovations", type: "BLOG", status: "PUBLISHED" },
    { id: 7, title: "Modular Construction", type: "ACTUALITE", status: "DRAFT" },
  ]);

  
  const [likedArticles] = useState([
    { id: 8, title: "Green Building Standards", type: "BLOG", status: "PUBLISHED" },
    { id: 9, title: "Smart Cities Report", type: "ACTUALITE", status: "PUBLISHED" },
    { id: 10, title: "Circular Economy", type: "BLOG", status: "PUBLISHED" },
    { id: 11, title: "Net Zero Buildings", type: "ACTUALITE", status: "PUBLISHED" },
  ]);

  
  const [searchSaved, setSearchSaved] = useState("");
  const [visibleSaved, setVisibleSaved] = useState(5);
  const [searchLiked, setSearchLiked] = useState("");
  const [visibleLiked, setVisibleLiked] = useState(5);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [modalSearch, setModalSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(5);

  
  const [formData, setFormData] = useState({ fullName: profile.fullName, email: profile.email });
  const [showEditModal, setShowEditModal] = useState(false);

  
  const handleUnsave = (id) => {
    setSavedArticles(savedArticles.filter(article => article.id !== id));
  };
  const handleLoadMoreSaved = () => setVisibleSaved(prev => prev + 3);
  const filteredSaved = savedArticles.filter(a => a.title.toLowerCase().includes(searchSaved.toLowerCase()));
  const displayedSaved = filteredSaved.slice(0, visibleSaved);

  
  const handleLoadMoreLiked = () => setVisibleLiked(prev => prev + 3);
  const filteredLiked = likedArticles.filter(a => a.title.toLowerCase().includes(searchLiked.toLowerCase()));
  const displayedLiked = filteredLiked.slice(0, visibleLiked);

  
  const openModal = (type) => {
    setModalType(type);
    setModalSearch("");
    setModalVisible(5);
    setModalOpen(true);
  };

  
  const modalArticles = modalType === "saved" ? savedArticles : likedArticles;
  const filteredModal = modalArticles.filter(a => a.title.toLowerCase().includes(modalSearch.toLowerCase()));
  const displayedModal = filteredModal.slice(0, modalVisible);

  const handleLoadMoreModal = () => setModalVisible(prev => prev + 3);

  
  const handleSaveProfile = () => {
    setProfile({ ...profile, fullName: formData.fullName, email: formData.email });
    setShowEditModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-sm">JD</div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.fullName}</h2>
            <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>
            <p className="text-sm text-primary font-semibold mt-1">{profile.role}</p>
          </div>
        </div>
        <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
       
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-md font-semibold text-slate-500 uppercase tracking-wide mb-3">Current Plan</h3>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{profile.plan}</p>
          <p className="text-sm text-slate-500 mt-1">Full access to advanced construction analytics, real-time tracking, and automated reporting tools.</p>
          <div className="flex items-center gap-2 mt-3 text-sm text-slate-600"><Calendar size={14} /> Billing Cycle: {profile.billingCycle}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600"><CreditCard size={14} /> {profile.periodStart} - {profile.periodEnd}</div>
          <div className="flex flex-col gap-3 mt-5">
            <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition">
  Switch Plan
</button>
            <button className="w-full text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition">
  Cancel Subscription
</button>
          </div>
        </div>

        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-md font-semibold text-slate-500 uppercase tracking-wide mb-4">Plan Limits</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500">Projects Created</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{profile.limits.projectsCreated} / {profile.limits.projectsMax}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500">AI Requests Used</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{profile.limits.aiRequestsUsed} / {profile.limits.aiRequestsMax}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500">Team Members</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{profile.limits.teamSeats} Seats</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500">Support </p>
             <p className="text-xl font-bold text-slate-900 dark:text-white">Priority</p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Saved Articles</h3>
            </div>
            <button onClick={() => openModal("saved")} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View all <Eye size={14} />
            </button>
          </div>
      
          <div className="space-y-3">
            {displayedSaved.map(article => (
              <div key={article.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{article.title}</p>
                  <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-semibold">{article.type}</span>
                    <span>|</span>
                    <span>{article.status}</span>
                  </div>
                </div>
                <button onClick={() => handleUnsave(article.id)} className="text-slate-400 hover:text-red-500 text-sm font-medium">Unsave</button>
              </div>
            ))}
          </div>
          {visibleSaved < filteredSaved.length && (
            <button onClick={handleLoadMoreSaved} className="w-full mt-4 text-center text-primary text-sm font-medium py-2 hover:underline">Load More Articles</button>
          )}
        </div>

        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-red-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Liked Articles</h3>
            </div>
            <button onClick={() => openModal("liked")} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View all <Eye size={14} />
            </button>
          </div>
     
          <div className="space-y-3">
            {displayedLiked.map(article => (
              <div key={article.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{article.title}</p>
                  <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{article.type}</span>
                    <span>|</span>
                    <span>{article.status}</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-red-500"><Heart size={14} /></button>
              </div>
            ))}
          </div>
          {visibleLiked < filteredLiked.length && (
            <button onClick={handleLoadMoreLiked} className="w-full mt-4 text-center text-primary text-sm font-medium py-2 hover:underline">Load More Articles</button>
          )}
        </div>
      </div>

      
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
           
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                {modalType === "saved" ? <Bookmark size={20} className="text-primary" /> : <Heart size={20} className="text-red-500" />}
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {modalType === "saved" ? "Saved Articles" : "Liked Articles"}
                </h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
           
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search within ${modalType === "saved" ? "saved" : "liked"} articles...`}
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {displayedModal.map(article => (
                <div key={article.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{article.title}</p>
                    <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-semibold">{article.type}</span>
                      <span>|</span>
                      <span>{article.status}</span>
                    </div>
                  </div>
                  {modalType === "saved" ? (
                    <button onClick={() => handleUnsave(article.id)} className="text-slate-400 hover:text-red-500 text-sm font-medium">Unsave</button>
                  ) : (
                    <button className="text-slate-400 hover:text-red-500"><Heart size={14} /></button>
                  )}
                </div>
              ))}
              {filteredModal.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-4">No articles found.</p>
              )}
            </div>
            
            {modalVisible < filteredModal.length && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center">
                <button onClick={handleLoadMoreModal} className="text-primary text-sm font-medium hover:underline">Load More Articles</button>
              </div>
            )}
          </div>
        </div>
      )}

      
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={handleSaveProfile} className="px-4 py-2 bg-primary text-white rounded-lg">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;