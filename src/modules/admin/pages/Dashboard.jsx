import React from 'react';
import { Users, CreditCard, BarChart3, Folder, Heart, Bookmark } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Existing Data
  const statCards = [
    { title: "Total Users", value: "192", trend: "↑ 14 this month", trendColor: "text-emerald-500", icon: <Users className="w-5 h-5 text-slate-600" />, bgColor: "bg-slate-50" },
    { title: "Active Subs", value: "72", trend: "↑ 6 this month", trendColor: "text-emerald-500", icon: <CreditCard className="w-5 h-5 text-blue-600" />, bgColor: "bg-blue-50" },
    { title: "Monthly Rev.", value: "189K", trend: "↑ 9.6% vs Feb", trendColor: "text-emerald-500", icon: <BarChart3 className="w-5 h-5 text-emerald-600" />, bgColor: "bg-emerald-50" },
    { title: "Total Projects", value: "437", trend: "↑ 23 this week", trendColor: "text-emerald-500", icon: <Folder className="w-5 h-5 text-amber-600" />, bgColor: "bg-amber-50" },
  ];

  const recentActivity = [
    { user: "Sara Meziani", action: "Created project Villa Yasmine", time: "2m ago", dot: "bg-blue-500" },
    { user: "Karim Benali", action: "Calculated Isolated Footing", time: "8m ago", dot: "bg-amber-500" },
    { user: "Yacine Oussad", action: "Upgraded to Enterprise", time: "14m ago", dot: "bg-emerald-500" },
    { user: "Lina Hadjadj", action: "Published article Béton armé C25", time: "31m ago", dot: "bg-teal-500" },
  ];

  const planBreakdown = [
    { name: "Free", users: 120, width: "w-[60%]", color: "bg-slate-400" },
    { name: "Pro", users: 54, width: "w-[30%]", color: "bg-blue-600" },
    { name: "Enterprise", users: 18, width: "w-[10%]", color: "bg-purple-600" },
  ];

  // New Recharts Data
  const newUsersData = [
    { date: 'Mar 1', users: 15 },
    { date: 'Mar 3', users: 30 },
    { date: 'Mar 5', users: 20 },
    { date: 'Mar 7', users: 45 },
    { date: 'Mar 9', users: 35 },
    { date: 'Mar 11', users: 65 },
    { date: 'Mar 13', users: 55 },
    { date: 'Mar 15', users: 85 },
    { date: 'Mar 17', users: 80 },
  ];

  const revenueData = [
    { month: 'Oct', revenue: 45 },
    { month: 'Nov', revenue: 60 },
    { month: 'Dec', revenue: 50 },
    { month: 'Jan', revenue: 80 },
    { month: 'Feb', revenue: 75 },
    { month: 'Mar', revenue: 100 },
  ];

  // Custom Tooltip Styles for Recharts
  const customTooltipStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1e293b',
    padding: '8px 12px'
  };

  return (
    <div className="p-8 bg-slate-50/50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-400 text-sm">Live platform overview</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Line Chart: New Users */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">New Users · March 2026</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={newUsersData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} 
                  dy={10} 
                  minTickGap={20}
                />
                <Tooltip contentStyle={customTooltipStyle} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line 
                  type="linear" 
                  dataKey="users" 
                  stroke="#2563eb" 
                  strokeWidth={2.5} 
                  dot={false} 
                  activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Monthly Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Monthly Revenue (DA)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }} barSize={12}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} 
                  dy={10} 
                />
                <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: '#f8fafc' }} />
                {/* Simulated hollow bar matching your template */}
                <Bar 
                  dataKey="revenue" 
                  fill="transparent" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Activity & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-6 xl:col-span-5">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start group">
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${item.dot} shrink-0`}></div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-slate-600 leading-snug">
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.user}</span> {item.action}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-1 uppercase tracking-tighter">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side containers */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="p-4 bg-rose-50 rounded-xl">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Likes</span>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">1.4K</h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="p-4 bg-purple-50 rounded-xl">
                <Bookmark className="w-5 h-5 text-purple-600 fill-purple-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Saves</span>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">892</h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex-1">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">Plan Breakdown</h3>
            <div className="space-y-6">
              {planBreakdown.map((plan, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-700">{plan.name}</span>
                    <span className="text-sm font-black text-slate-900">{plan.users}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`${plan.color} h-1.5 rounded-full ${plan.width} transition-all duration-1000 ease-out`}></div>
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