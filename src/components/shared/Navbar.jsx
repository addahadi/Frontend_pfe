/**
 * Navbar — top navigation bar
 * Shows app name + AI Assistant button + user info
 */
export default function Navbar({ user }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left — Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
          Q
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 leading-none">QuantiConstruct</div>
          <div className="text-[10px] text-slate-400 leading-none mt-0.5">v1.2.0 · Admin Panel</div>
        </div>
      </div>

      {/* Right — AI + User */}
      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors">
          🤖 AI Assistant
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.initials || 'SA'}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-800 leading-none">{user?.name || 'Super Admin'}</div>
            <div className="text-xs text-slate-400 leading-none mt-0.5">{user?.email || 'admin@quanti.dz'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
