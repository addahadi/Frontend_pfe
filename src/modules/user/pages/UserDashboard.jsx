// src/modules/user/pages/UserDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FolderOpen, CheckCircle, Layers, Plus } from "lucide-react";

const UserDashboard = () => {
  const projects = [
    {
      id: "skyline-tower",
      name: "Skyline Tower",
      description: "High-rise luxury residential complex with sustainable architecture and smart energy...",
      client: "Apex Corp",
      dueDate: "Dec 2024",
      status: "active",
    },
    {
      id: "riverfront-plaza",
      name: "Riverfront Plaza",
      description: "Public-private partnership for waterfront development including recreational and office...",
      client: "Metro City",
      dueDate: "",
      uuid: "8f2-a91",
      status: "completed",
    },
    {
      id: "oakwood-medical",
      name: "Oakwood Medical",
      description: "State-of-the-art medical facility focusing on diagnostic excellence and patient comfort.",
      client: "HealthFirst",
      dueDate: "Mar 2025",
      status: "active",
    },
  ];

  const stats = {
    activeStatus: 12,
    completed: 48,
    categories: 8,
  };

  const handleCreateProject = () => {
    console.log("Create new project");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* رأس الصفحة مع زر Create Project */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">WORKSPACE DASHBOARD</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your architectural portfolio. Monitor status and project metadata as defined in the system registry.
          </p>
        </div>
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-sm"
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">ACTIVE STATUS</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeStatus} Projects</p>
          </div>
          <FolderOpen className="text-primary w-8 h-8 opacity-80" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">COMPLETED</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed} Units</p>
          </div>
          <CheckCircle className="text-green-500 w-8 h-8 opacity-80" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">CATEGORIES</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.categories} Groups</p>
          </div>
          <Layers className="text-accent w-8 h-8 opacity-80" />
        </div>
      </div>

      {/* قسم المشاريع - شبكة من المربعات المتساوية */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Projects</h2>
          <div className="flex gap-2 text-sm">
            <button className="px-3 py-1 rounded-full bg-primary text-white">All Projects</button>
            <button className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Active</button>
            <button className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Completed</button>
          </div>
        </div>

        {/* شبكة مربعات متساوية الأبعاد */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow relative aspect-square flex flex-col"
            >
              {/* شارة الحالة في أعلى اليمين */}
              <span
                className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full z-10 ${
                  project.status === "active"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                }`}
              >
                {project.status === "active" ? "Active" : "Completed"}
              </span>

              <div className="flex-1 flex flex-col overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-16 line-clamp-2">{project.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-400">
                  <span>📅 {project.client}</span>
                  {project.dueDate && <span>Due {project.dueDate}</span>}
                  {project.uuid && <span>UUID: {project.uuid}</span>}
                </div>
              </div>
            </Link>
          ))}

          {/* مربع Create Project بخط متقطع - أيضاً مربع متساوي الأبعاد */}
          <button
            onClick={handleCreateProject}
            className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors aspect-square"
          >
            <Plus size={48} className="text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Create Project</span>
            <span className="text-xs text-slate-400 mt-1 text-center">Initiate project creation process</span>
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Showing {projects.length} of {stats.activeStatus} registered Project entities
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;