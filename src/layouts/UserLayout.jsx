import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      {/* ─── STICKY USER HEADER ─── */}
      <header className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 text-primary">
            <img src="/logo.png" alt="APEX Logo" className="w-8 h-8 rounded-lg object-cover" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">APEX</h2>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">smart_toy</span>
              <span>AI Assistant</span>
            </button>
            <div className="size-10 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8] font-bold border border-[#1D4ED8]/20">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* ─── PAGE CONTENT AREA ─── */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
