import React from 'react';
import { Search, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { subscribers } from './mock.js'; // <-- Import the mock data here
function Subscribers() {
 
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select className="border border-gray-100 rounded-xl px-6 py-3 text-sm text-gray-600 focus:outline-none min-w-[120px]">
          <option>All</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Plan</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Start Date</th>
              <th className="px-6 py-4 font-semibold">End Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscribers.map((sub, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {sub.init}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{sub.name}</div>
                      <div className="text-gray-400 text-xs">{sub.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-blue-500 font-semibold text-sm">{sub.plan}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded text-[10px] font-bold ${sub.type === 'COMPANY' ? 'bg-purple-50 text-purple-400' : 'bg-cyan-50 text-cyan-400'}`}>
                    {sub.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-bold text-xs ${sub.status === 'ACTIVE' ? 'text-green-400' : 'text-gray-300'}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{sub.start}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{sub.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Subscribers