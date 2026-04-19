import React, { useEffect, useState } from "react";
import { Search, Edit2, Trash2, Plus, Save, X } from "lucide-react";
import { subscriptionService } from "../../auth/services/subscription.service";

function Subscribers() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await subscriptionService.getSubscriptions();
        setSubscriptions(response.data || []);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);
  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-gray-100 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select className="min-w-[120px] rounded-xl border border-gray-100 px-6 py-3 text-sm text-gray-600 focus:outline-none">
          <option>All</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Plan</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Start Date</th>
              <th className="px-6 py-4 font-semibold">End Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscriptions.map((sub, i) => (
              <tr key={i} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                      {sub.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{sub.user?.name}</div>
                      <div className="text-xs text-gray-400">{sub.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-blue-500">{sub.plan?.name_en}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold ${sub.status === "ACTIVE" ? "text-green-400" : "text-gray-300"}`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(sub.start_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(sub.end_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Subscribers;
