import React, { useState } from 'react';

const Subscribers = () => {
  const [activeTab, setActiveTab] = useState('Subscribers');

  // Mock Data for Subscribers Tab
  const subscribersData = [
    { initials: 'KB', name: 'Karim Benali', email: 'karim@mail.com', plan: 'Pro', type: 'NORMAL', status: 'ACTIVE', startDate: '2025-11-03', endDate: '2026-11-03' },
    { initials: 'SM', name: 'Sara Meziani', email: 'sara@corp.dz', plan: 'Enterprise', type: 'COMPANY', status: 'ACTIVE', startDate: '2025-09-14', endDate: '2026-09-14' },
    { initials: 'AT', name: 'Amine Touati', email: 'amine@mail.com', plan: 'Free', type: 'NORMAL', status: 'INACTIVE', startDate: '2026-01-22', endDate: '—' },
    { initials: 'LH', name: 'Lina Hadjadj', email: 'lina@archi.dz', plan: 'Pro', type: 'NORMAL', status: 'ACTIVE', startDate: '2025-12-01', endDate: '2026-12-01' },
    { initials: 'YO', name: 'Yacine Oussad', email: 'yacine@build.com', plan: 'Enterprise', type: 'COMPANY', status: 'ACTIVE', startDate: '2025-08-07', endDate: '2026-08-07' },
    { initials: 'OR', name: 'Omar Rezig', email: 'omar@construct.dz', plan: 'Pro', type: 'NORMAL', status: 'ACTIVE', startDate: '2025-10-30', endDate: '2026-10-30' },
  ];

  // Mock Data for Plans Tab
  const plansData = [
    {
      name: 'Free',
      type: 'NORMAL',
      typeColor: 'text-teal-600 bg-teal-50',
      desc: 'Basic access for individuals',
      features: [
        { label: 'max_projects', value: '3' },
        { label: 'max_calculations', value: '20' },
        { label: 'can_export_pdf', value: 'false', isBoolean: true, boolValue: false },
        { label: 'support_level', value: 'none' },
      ]
    },
    {
      name: 'Pro',
      type: 'NORMAL',
      typeColor: 'text-teal-600 bg-teal-50',
      desc: 'Full access for professionals',
      features: [
        { label: 'max_projects', value: '20' },
        { label: 'max_calculations', value: '500' },
        { label: 'can_export_pdf', value: 'true', isBoolean: true, boolValue: true },
        { label: 'can_use_api', value: 'false', isBoolean: true, boolValue: false },
        { label: 'support_level', value: 'email' },
      ]
    },
    {
      name: 'Enterprise',
      type: 'COMPANY',
      typeColor: 'text-purple-600 bg-purple-50',
      desc: 'Unlimited for construction firms',
      features: [
        { label: 'max_projects', value: 'unlimited' },
        { label: 'max_calculations', value: 'unlimited' },
        { label: 'can_export_pdf', value: 'true', isBoolean: true, boolValue: true },
        { label: 'can_use_api', value: 'true', isBoolean: true, boolValue: true },
        { label: 'support_level', value: 'priority' },
        { label: 'team_members', value: '25' },
      ]
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen font-sans text-gray-800">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Subscriptions</h1>
        <p className="text-gray-400 text-sm">Plans, features & subscribers</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('Plans & Features')}
          className={`pb-3 px-1 mr-8 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'Plans & Features'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Plans & Features
        </button>
        <button
          onClick={() => setActiveTab('Subscribers')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'Subscribers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Subscribers
        </button>
      </div>

      {/* Tab Content: Subscribers */}
      {activeTab === 'Subscribers' && (
        <div className="animate-fadeIn">
          {/* Search & Filter */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
              />
            </div>
            <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[120px]">
              <option>All</option>
            </select>
          </div>

          {/* Table */}
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 font-medium">User</th>
                  <th className="py-3 px-4 font-medium">Plan</th>
                  <th className="py-3 px-4 font-medium">Type</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Start Date</th>
                  <th className="py-3 px-4 font-medium">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {subscribersData.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-xs shrink-0">
                        {user.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className="text-gray-400 text-xs">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        user.plan === 'Pro' ? 'bg-blue-50 text-blue-600' :
                        user.plan === 'Enterprise' ? 'bg-purple-50 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        user.type === 'COMPANY' ? 'bg-purple-50 text-purple-600' : 'bg-teal-50 text-teal-600'
                      }`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        user.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{user.startDate}</td>
                    <td className="py-3 px-4 text-gray-500">{user.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Plans & Features */}
      {activeTab === 'Plans & Features' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {plansData.map((plan, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-6 shadow-sm bg-white flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${plan.typeColor}`}>
                  {plan.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
              
              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex justify-between text-sm">
                    <span className="text-gray-500">{feature.label}</span>
                    <span className={`font-medium ${
                      feature.isBoolean 
                        ? (feature.boolValue ? 'text-green-500' : 'text-red-500')
                        : 'text-gray-800'
                    }`}>
                      {feature.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-auto">
                <button className="flex items-center gap-1.5 px-4 py-2 border border-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  Edit
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 border border-red-100 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* New Plan Card */}
          <button className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all min-h-[350px]">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span className="font-medium text-sm">New Plan</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Subscribers;