// src/modules/user/pages/ProjectOverview.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Eye, ArrowRight, Hash, User, Calendar } from "lucide-react";

const ProjectOverview = () => {
  // بيانات ثابتة
  const project = {
    id: "skyline-tower",
    name: "Skyline Tower",
    uuid: "8f2d-4b9a",
    manager: "Alex Morgan",
    dueDate: "Dec 2024",
    description: "The Skyline Tower is a flagship mixed-use development situated in the heart of the business district. This 45-story structure incorporates sustainable building practices, advanced structural engineering, and premium architectural finishes. The current phase focuses on core structural assessment and interior partition planning for the commercial levels.",
    totalCalculations: 142,
    activeCategories: 3,
  };

  const categories = [
    {
      id: "grand-travaux",
      name: "Grand Travaux",
      description: "Major structural works",
      icon: "🏗️",
      count: 58,
      sub: ["EXCAVATION", "FOUNDATIONS", "COLUMNS"],
    },
    {
      id: "finition",
      name: "Finition",
      description: "Finishing & surface works",
      icon: "🎨",
      count: 42,
      sub: ["TILING", "PAINTING", "CEILING"],
    },
    {
      id: "portes-fenetres",
      name: "Portes & Fenêtres",
      description: "Doors & windows",
      icon: "🚪",
      count: 42,
      sub: ["WINDOWS", "MAIN DOORS", "INTERNAL DOORS"],
    },
  ];

  const recentCalcs = [
    { id: 1, category: "🏗️Grand Travaux", element: "Isolated Footing #12", keyResult: "3.75 m²", timestamp: "2 mins ago" },
    { id: 2, category: "🎨Portes & Fenêtres", element: "Main Entrance Glass", keyResult: "12.40 m²", timestamp: "45 mins ago" },
    { id: 3, category: "🚪Finition", element: "Lobby Wall Coating", keyResult: "450.00 m²", timestamp: "2 hours ago" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* رأس المشروع */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
          <span className="flex items-center gap-1"><Hash size={14} /> {project.uuid}</span>
          <span className="flex items-center gap-1"><User size={14} /> {project.manager}</span>
          <span className="flex items-center gap-1"><Calendar size={14} /> Due {project.dueDate}</span>
        </div>
      </div>

      {/* PROJECT OVERVIEW مع مستطيلين أفقيين يملأن العرض */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">PROJECT OVERVIEW</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{project.description}</p>
        {/* المستطيلان الأفقيان */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Calculations</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{project.totalCalculations}</p>
          </div>
          <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-3 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Active Categories</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{project.activeCategories}</p>
          </div>
        </div>
      </div>

      {/* الفئات (نفسها) */}
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/projects/${project.id}/explorer/${cat.id}`}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow block"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {cat.sub.map((tag) => (
                    <span key={tag} className="bg-slate-100 dark:bg-slate-700 text-xs font-mono px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">{tag}</span>
                  ))}
                </div>
              </div>
              <span className="text-primary font-bold text-sm">{cat.count} calcs</span>
            </div>
          </Link>
        ))}
      </div>

      {/* جدول آخر الحسابات */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Calculations</h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">CATEGORY</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">ELEMENT</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">KEY RESULT</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">TIMESTAMP</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {recentCalcs.map((calc) => (
                <tr key={calc.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{calc.category}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{calc.element}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{calc.keyResult}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{calc.timestamp}</td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:underline text-sm flex items-center gap-1"><Eye size={14} /> View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-right mt-3">
          <Link to="#" className="text-sm text-primary hover:underline flex items-center justify-end gap-1">View all calculations → <ArrowRight size={14} /></Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;