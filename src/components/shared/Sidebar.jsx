/**
 * Sidebar — left navigation
 * Matches QuantiConstruct design exactly
 */
const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard',     path: '/dashboard' },
  { icon: '👥', label: 'Users',         path: '/users' },
  { icon: '💳', label: 'Subscriptions', path: '/subscriptions' },
  { icon: '📄', label: 'Articles',      path: '/articles' },
  { icon: '🧩', label: 'Modules',       path: '/modules' },
  { icon: '🗂',  label: 'Resources',    path: '/resources' },
  { icon: '⚙️', label: 'Settings',      path: '/settings' },
];

export default function Sidebar({ activePath = '/resources', onNavigate }) {
  return (
    <aside className="w-48 min-w-[192px] bg-white border-r border-slate-200 flex flex-col py-4 flex-shrink-0">
      <nav className="flex flex-col gap-0.5 px-2">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2 mb-2">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate?.(item.path)}
              className={[
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium w-full text-left transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800',
              ].join(' ')}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom version badge */}
      <div className="mt-auto px-4 pb-2">
        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          QuantiConstruct DS v1.2.0
        </div>
      </div>
    </aside>
  );
}
