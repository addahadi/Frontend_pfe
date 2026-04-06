import React, { useState } from 'react';
import { Search, Plus, Eye, CheckCircle, Ban, X, Heart, Bookmark } from 'lucide-react';

// --- MOCK DATA ---
const mockUsers = [
  { id: 1, name: 'Karim Benali', initials: 'KB', email: 'karim@mail.com', status: 'Active', plan: 'Pro', subStatus: 'ACTIVE', joined: '2025-11-03' },
  { id: 2, name: 'Sara Meziani', initials: 'SM', email: 'sara@corp.dz', status: 'Active', plan: 'Enterprise', subStatus: 'ACTIVE', joined: '2025-09-14' },
  { id: 3, name: 'Amine Touati', initials: 'AT', email: 'amine@mail.com', status: 'Banned', plan: 'Free', subStatus: 'INACTIVE', joined: '2026-01-22' },
  { id: 4, name: 'Lina Hadjadj', initials: 'LH', email: 'lina@archi.dz', status: 'Active', plan: 'Pro', subStatus: 'ACTIVE', joined: '2025-12-01' },
  { id: 5, name: 'Yacine Oussad', initials: 'YO', email: 'yacine@build.com', status: 'Active', plan: 'Enterprise', subStatus: 'ACTIVE', joined: '2025-08-07' },
  { id: 6, name: 'Nadia Belkadi', initials: 'NB', email: 'nadia@mail.com', status: 'Active', plan: 'Free', subStatus: 'INACTIVE', joined: '2026-02-11' },
  { id: 7, name: 'Omar Rezig', initials: 'OR', email: 'omar@construct.dz', status: 'Suspended', plan: 'Pro', subStatus: 'ACTIVE', joined: '2025-10-30' },
  { id: 8, name: 'Amira Chikh', initials: 'AC', email: 'amira@mail.com', status: 'Active', plan: 'Free', subStatus: 'INACTIVE', joined: '2026-03-01' },
];

// Helper components for Badges to keep the table clean
const StatusBadge = ({ status }) => {
  const styles = {
    Active: 'bg-green-100 text-green-700',
    Banned: 'bg-red-100 text-red-700',
    Suspended: 'bg-yellow-100 text-yellow-700',
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
};

const PlanBadge = ({ plan }) => {
  const styles = {
    Pro: 'bg-blue-50 text-blue-600',
    Enterprise: 'bg-purple-50 text-purple-600',
    Free: 'bg-gray-100 text-gray-600',
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[plan]}`}>{plan}</span>;
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Engagement');

  return (
    <div className="flex h-full bg-white relative">
      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 p-8 transition-all duration-300 ${selectedUser ? 'mr-80' : ''}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-500 mt-1">8 total accounts</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Invite User
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="w-5 h-5" />
            </span>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All</option>
          </select>
        </div>

        {/* Table */}
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Sub Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-sm">
                      {user.initials}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                  <td className="px-6 py-4"><PlanBadge plan={user.plan} /></td>
                  <td className="px-6 py-4">
                     <span className={`text-xs font-semibold ${user.subStatus === 'ACTIVE' ? 'text-green-500' : 'text-gray-400'}`}>
                        {user.subStatus}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 text-xs font-medium"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      {user.status === 'Banned' || user.status === 'Suspended' ? (
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 text-xs font-medium">
                          <CheckCircle className="w-4 h-4" /> Unban
                        </button>
                      ) : (
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-xs font-medium">
                          <Ban className="w-4 h-4" /> Ban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDE DRAWER (Conditional Rendering) */}
      {selectedUser && (
        <div className="w-96 bg-white border-l border-gray-100 fixed right-0 top-0 h-full shadow-lg z-50 flex flex-col pt-16"> 
          
          <div className="p-6 border-b border-gray-100 relative">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                {selectedUser.initials}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-bold uppercase">Active</span>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold uppercase">{selectedUser.plan}</span>
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-bold uppercase">{selectedUser.subStatus}</span>
              <span className="px-2 py-1 bg-cyan-50 text-cyan-600 rounded text-xs font-bold uppercase">Normal</span>
            </div>
          </div>

          <div className="flex border-b border-gray-100">
            <button 
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'Profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('Profile')}
            >
              Profile
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'Engagement' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('Engagement')}
            >
              Engagement
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {activeTab === 'Engagement' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-red-500" /> Liked Articles
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 border border-gray-100 rounded-lg text-sm text-gray-700 bg-gray-50/30">Béton armé C25</div>
                    <div className="p-3 border border-gray-100 rounded-lg text-sm text-gray-700 bg-gray-50/30">Calcul de charge</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <Bookmark className="w-4 h-4 text-blue-500" /> Saved Articles
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 border border-gray-100 rounded-lg text-sm text-gray-700 bg-gray-50/30">Guide fondations</div>
                    <div className="p-3 border border-gray-100 rounded-lg text-sm text-gray-700 bg-gray-50/30">Isolation thermique</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'Profile' && (
              <div className="text-sm text-gray-500">Profile details go here...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}