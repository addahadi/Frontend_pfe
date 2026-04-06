import React from 'react';
import { Users, CreditCard, BarChart3, Folder, Heart, Bookmark } from 'lucide-react';

const Dashboard = () => {
  const statCards = [
    { title: "Total Users", value: "192", trend: "↑ 14 this month", trendColor: "text-emerald-500", icon: <Users className="w-5 h-5 text-slate-600" />, bgColor: "bg-slate-50" },
    { title: "Active Subs", value: "72", trend: "↑ 6 this month", trendColor: "text-emerald-500", icon: <CreditCard className="w-5 h-5 text-blue-600" />, bgColor: "bg-blue-50" },
    { title: "Monthly Rev.", value: "189K", trend: "↑ 9.6% vs Feb", trendColor: "text-emerald-500", icon: <BarChart3 className="w-5 h-5 text-emerald-600" />, bgColor: "bg-emerald-50" },
    { title: "Total Projects", value: "437", trend: "↑ 23 this week", trendColor: "text-emerald-500", icon: <Folder className="w-5 h-5 text-amber-600" />, bgColor: "bg-amber-50" },
  ];

  const recentActivity = [
    { user: "Sara Meziani", action: "Created project Villa Yasmine", time: "2m ago", dot: "bg-blue-500" },
    { user: "Karim Benali", action: "Calculated Isolated Footing", time: "8m ago", dot: "bg-yellow-500" },
    { user: "Yacine Oussad", action: "Upgraded to Enterprise", time: "14m ago", dot: "bg-green-500" },
    { user: "Lina Hadjadj", action: "Published article Béton armé C25", time: "31m ago", dot: "bg-teal-500" },
  ];

  const planBreakdown = [
    { name: "Free", users: 120, width: "w-[60%]", color: "bg-slate-300" },
    { name: "Pro", users: 54, width: "w-[30%]", color: "bg-blue-500" },
    { name: "Enterprise", users: 18, width: "w-[10%]", color: "bg-purple-500" },
  ];

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-400 text-sm">Live platform metrics and activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[12px] font-bold uppercase tracking-wider text-slate-400">{card.title}</span>
              <div className={`p-2.5 ${card.bgColor} rounded-xl`}>{card.icon}</div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{card.value}</h2>
            <p className={`text-[11px] mt-2 font-bold ${card.trendColor}`}>{card.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-5">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start group">
                <div className={`mt-1.5 w-2 h-2 rounded-full ${item.dot} ring-4 ring-white shadow-sm shrink-0`}></div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-slate-600 leading-snug">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.user}</span> {item.action}
                  </p>
                  <span className="text-[10px] font-medium text-slate-400 block mt-1 uppercase tracking-tighter">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown & Stats */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="p-4 bg-rose-50 rounded-2xl">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Likes</span>
                <h2 className="text-2xl font-black text-slate-800">1.4K</h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="p-4 bg-purple-50 rounded-2xl">
                <Bookmark className="w-6 h-6 text-purple-500 fill-purple-500" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Saves</span>
                <h2 className="text-2xl font-black text-slate-800">892</h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex-1">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">Plan Breakdown</h3>
            <div className="space-y-7">
              {planBreakdown.map((plan, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-700">{plan.name}</span>
                    <span className="text-xs font-black text-slate-900">{plan.users} <span className="font-medium text-slate-400 uppercase">Users</span></span>
                  </div>
                  <div className="w-full bg-slate-50 rounded-full h-2">
                    <div className={`${plan.color} h-2 rounded-full ${plan.width} transition-all duration-1000 ease-out`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;