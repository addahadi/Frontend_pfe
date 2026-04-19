import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
// Added more icons from Lucide
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Folder, 
  Heart, 
  Bookmark, 
  LayoutDashboard,
  Settings,
  Users2,
  FileText,
  Layers,
  Sparkles
} from 'lucide-react'; 

// Import your mock data
import { statCards, recentActivity, planBreakdown, lineChartData, barChartData } from './mock.js'; 

const Dashboard = () => {
  // Mapping the string keys from your mock data to actual Lucide components
  const iconMap = {
    "Users": <Users size={20} />,
    "CreditCard": <CreditCard size={20} />,
    "TrendingUp": <TrendingUp size={20} />,
    "Folder": <Folder size={20} />,
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Live platform overview</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          <Sparkles size={16} />
          AI Assistant
        </button>
      </div>

      {/* Row 1: Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500">{card.title}</span>
              <span className="p-2 bg-slate-50 text-blue-600 rounded-lg leading-none">
                {iconMap[card.iconKey] || <LayoutDashboard size={20} />}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">{card.value}</h2>
            <p className={`text-xs mt-2 font-medium ${card.trendColor}`}>{card.trend}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">New Users · March 2026</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="linear" 
                  dataKey="users" 
                  stroke="#2563eb" 
                  strokeWidth={2.5} 
                  dot={false} 
                  activeDot={{ r: 6, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Monthly Revenue (DA)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="rev" 
                  fill="#ffffff" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  radius={[4, 4, 0, 0]} 
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity List */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm lg:col-span-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-start">
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${item.dot} shrink-0`}></div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">{item.user}</span> {item.action}
                  </p>
                </div>
                <span className="text-xs text-slate-400 shrink-0 ml-4">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Stack */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-medium text-slate-500">Total Likes</span>
                <span className="p-2 bg-pink-50 text-pink-500 rounded-lg">
                  <Heart size={20} fill="currentColor" fillOpacity={0.1} />
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800">1.4K</h2>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-medium text-slate-500">Total Saves</span>
                <span className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                  <Bookmark size={20} fill="currentColor" fillOpacity={0.1} />
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800">892</h2>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm grow">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Plan Breakdown</h3>
            <div className="space-y-5 mt-2">
              {planBreakdown.map((plan, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{plan.name}</span>
                    <span className="font-bold text-slate-900">{plan.users}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`${plan.color} h-1.5 rounded-full transition-all duration-500`} style={{ width: plan.width }}></div>
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