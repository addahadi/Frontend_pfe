// mock.js


import { Users, DollarSign, Activity, ShoppingCart } from 'lucide-react';
import { 
  
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


export const mockUsers = [
  { id: 1, name: 'Karim Benali', initials: 'KB', email: 'karim@mail.com', status: 'Active', plan: 'Pro', subStatus: 'ACTIVE', joined: '2025-11-03' },
  { id: 2, name: 'Sara Meziani', initials: 'SM', email: 'sara@corp.dz', status: 'Active', plan: 'Enterprise', subStatus: 'ACTIVE', joined: '2025-09-14' },
  { id: 3, name: 'Amine Touati', initials: 'AT', email: 'amine@mail.com', status: 'Banned', plan: 'Free', subStatus: 'INACTIVE', joined: '2026-01-22' },
  { id: 4, name: 'Lina Hadjadj', initials: 'LH', email: 'lina@archi.dz', status: 'Active', plan: 'Pro', subStatus: 'ACTIVE', joined: '2025-12-01' },
  { id: 5, name: 'Yacine Oussad', initials: 'YO', email: 'yacine@build.com', status: 'Active', plan: 'Enterprise', subStatus: 'ACTIVE', joined: '2025-08-07' },
  { id: 6, name: 'Nadia Belkadi', initials: 'NB', email: 'nadia@mail.com', status: 'Active', plan: 'Free', subStatus: 'INACTIVE', joined: '2026-02-11' },
  { id: 7, name: 'Omar Rezig', initials: 'OR', email: 'omar@construct.dz', status: 'Suspended', plan: 'Pro', subStatus: 'ACTIVE', joined: '2025-10-30' },
  { id: 8, name: 'Amira Chikh', initials: 'AC', email: 'amira@mail.com', status: 'Active', plan: 'Free', subStatus: 'INACTIVE', joined: '2026-03-01' },
]; 
 export const subscribers = [
    { name: 'Karim Benali', email: 'karim@mail.com', plan: 'Pro', type: 'NORMAL', status: 'ACTIVE', start: '2025-11-03', end: '2026-11-03', init: 'KB' },
    { name: 'Sara Meziani', email: 'sara@corp.dz', plan: 'Enterprise', type: 'COMPANY', status: 'ACTIVE', start: '2025-09-14', end: '2026-09-14', init: 'SM' },
    { name: 'Amine Touati', email: 'amine@mail.com', plan: 'Free', type: 'NORMAL', status: 'INACTIVE', start: '2026-01-22', end: '-', init: 'AT' },
    { name: 'Lina Hadjadj', email: 'lina@archi.dz', plan: 'Pro', type: 'NORMAL', status: 'ACTIVE', start: '2025-12-01', end: '2026-12-01', init: 'LH' },
    { name: 'Yacine Oussad', email: 'yacine@build.com', plan: 'Enterprise', type: 'COMPANY', status: 'ACTIVE', start: '2025-08-07', end: '2026-08-07', init: 'YO' },
    { name: 'Omar Rezig', email: 'omar@construct.dz', plan: 'Pro', type: 'NORMAL', status: 'ACTIVE', start: '2025-10-30', end: '2026-10-30', init: 'OR' },
  ];

 // --- MOCK DATA ---
// mock.js
export const statCards = [
  { title: "Total Users", value: "192", trend: "↑ 14 this month", trendColor: "text-emerald-500", iconKey: "Users" },
  { title: "Active Subs", value: "72", trend: "↑ 6 this month", trendColor: "text-emerald-500", iconKey: "CreditCard" },
  { title: "Monthly Rev.", value: "189K", trend: "↑ 9.6% vs Feb", trendColor: "text-emerald-500", iconKey: "TrendingUp" },
  { title: "Total Projects", value: "437", trend: "↑ 23 this week", trendColor: "text-emerald-500", iconKey: "Folder" },
];

 export const recentActivity = [
    { user: "Sara Meziani", action: "Created project Villa Yasmine", time: "2m ago", dot: "bg-blue-500" },
    { user: "Karim Benali", action: "Calculated Isolated Footing", time: "8m ago", dot: "bg-yellow-500" },
    { user: "Yacine Oussad", action: "Upgraded to Enterprise", time: "14m ago", dot: "bg-green-500" },
    { user: "Lina Hadjadj", action: "Published article Béton armé C25", time: "31m ago", dot: "bg-teal-500" },
    { user: "Nadia Belkadi", action: "Registered new account", time: "1h ago", dot: "bg-purple-500" },
    { user: "Amine Touati", action: "Account banned by admin", time: "2h ago", dot: "bg-red-500" },
  ];

 export const planBreakdown = [
    { name: "Free", users: 120, width: "w-[60%]", color: "bg-slate-400" },
    { name: "Pro", users: 54, width: "w-[30%]", color: "bg-blue-600" },
    { name: "Enterprise", users: 18, width: "w-[10%]", color: "bg-purple-500" },
  ];

  // --- CHART MOCK DATA ---
  // Mimicking the sharp line spikes clustered on the left
 export const lineChartData = [
    { date: 'Mar 1', users: 10 },
    { date: 'Mar 2', users: 35 },
    { date: 'Mar 3', users: 20 },
    { date: 'Mar 4', users: 60 },
    { date: 'Mar 5', users: 40 },
    { date: 'Mar 6', users: 85 },
    { date: 'Mar 7', users: 30 },
    { date: 'Mar 9', users: 50},
    { date: 'Mar 11', users: 25 },
    { date: 'Mar 13', users: 70 },
    { date: 'Mar 17', users: 45 },
  ];

  // Mimicking the hollow bars 
 export const barChartData = [
   

    { month: 'Nov', rev: 65 },
    { month: 'Dec', rev: 55 },
    { month: 'Jan', rev: 85 },
    { month: 'Feb', rev: 95 },
    { month: 'Mar', rev: 0 }, // Pad the rest for spacing shown in image
  ];
// --- TAB 1: PLAN FEATURES (Unchanged) --- --- IGNORE ---
 // plansMock.js
export const initialPlans = [
  {
    name: 'Free',
    tag: 'NORMAL',
    tagColor: 'bg-cyan-50 text-cyan-500',
    description: 'Basic access for individuals',
    features: [
      { label: 'max_projects', value: '3' },
      { label: 'max_calculations', value: '20' },
      { label: 'can_export_pdf', value: 'false', isBoolean: true },
      { label: 'support_level', value: 'none' },
    ]
  },
  {
    name: 'Pro',
    tag: 'NORMAL',
    tagColor: 'bg-cyan-50 text-cyan-500',
    description: 'Full access for professionals',
    features: [
      { label: 'max_projects', value: '20' },
      { label: 'max_calculations', value: '500' },
      { label: 'can_export_pdf', value: 'true', isBoolean: true },
      { label: 'can_use_api', value: 'false', isBoolean: true },
      { label: 'support_level', value: 'email' },
    ]
  },
  {
    name: 'Enterprise',
    tag: 'COMPANY',
    tagColor: 'bg-purple-50 text-purple-500',
    description: 'Unlimited for construction firms',
    features: [
      { label: 'max_projects', value: 'unlimited' },
      { label: 'max_calculations', value: 'unlimited' },
      { label: 'can_export_pdf', value: 'true', isBoolean: true },
      { label: 'can_use_api', value: 'true', isBoolean: true },
      { label: 'support_level', value: 'priority' },
      { label: 'team_members', value: '25' },
    ]
  }
];