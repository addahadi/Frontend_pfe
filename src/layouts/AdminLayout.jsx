import { useLocation, Link, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, FileText, FolderOpen, Package,Settings, Zap, Bot } from "lucide-react";
import Avatar from "../shared/components/ui/Avatar.jsx";
import { P } from "../shared/lib/design-tokens.js";


const NAV = [
  { path: "/admin",               icon: <LayoutDashboard size={16}/>, label: "Dashboard",    exact: true },
  { path: "/admin/users",         icon: <Users size={16}/>,         label: "Users"         },
  { path: "/admin/subscriptions", icon: <CreditCard size={16}/>,      label: "Subscriptions" },
  { path: "/admin/articles",      icon: <FileText size={16}/>,        label: "Articles"      },
  { path: "/admin/modules",       icon: <FolderOpen size={16}/>,      label: "Modules"       },
  { path: "/admin/resources", icon: <Package size={16}/>, label: "Resources" },
  { path: "/admin/settings",      icon: <Settings size={16}/>,        label: "Settings"      },
];


/* --- ADMIN LAYOUT COMPONENT --- */
export default function AdminLayout() {
  const location = useLocation();

  // Helper to check if a nav item is active
  const isActive = (navPath, isExact) => {
    if (isExact) return location.pathname === navPath;
    return location.pathname.startsWith(navPath);
  };

  return (
    <div style={{ minHeight: "100vh", background: P.bg, display: "flex", flexDirection: "column", fontFamily: "'Inter',sans-serif", color: P.txt, fontSize: P.body.size }}>
      
      {/* --- TOPBAR (NAVBAR) --- */}
      <div style={{ height: 60, borderBottom: `1px solid ${P.border}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 14, background: P.surface, position: "sticky", top: 0, zIndex: 200, flexShrink: 0 }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.png" alt="APEX Logo" style={{ width: 34, height: 34, borderRadius: 9, objectFit: "cover", boxShadow: `0 2px 8px rgba(16,78,216,.3)` }} />
          <div>
            <div style={{ fontSize: P.body.size, fontWeight: 700, color: P.txt, lineHeight: 1.2 }}>APEX</div>
            <div style={{ fontSize: 11, color: P.txt3, fontWeight: 400 }}>v1.2.0 · Admin Panel</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: P.main, color: "#fff", fontSize: 14, fontFamily: "Inter,sans-serif", fontWeight: 600, cursor: "pointer", border: "none", boxShadow: `0 1px 3px rgba(16,78,216,.3)`, transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = P.mainD}
            onMouseLeave={e => e.currentTarget.style.background = P.main}>
            <Bot size={16} strokeWidth={2}/> AI Assistant
          </button>

          <div style={{ width: 1, height: 28, background: P.border }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "4px 8px", borderRadius: 8, transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = P.bg}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <Avatar initials="SA" size={36} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: P.txt, lineHeight: 1.3 }}>Super Admin</div>
              <div style={{ fontSize: 12, color: P.txt3, lineHeight: 1.2 }}>admin@quanti.dz</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        
        <div style={{ width: 220, borderRight: `1px solid ${P.border}`, display: "flex", flexDirection: "column", background: P.surface, flexShrink: 0 }}>
          <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: P.txt3, letterSpacing: .8, textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>Navigation</div>
            
            {NAV.map(n => {
              const active = isActive(n.path, n.exact);
              return (
                <Link key={n.path} to={n.path}
                  style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", margin: "1px 0", borderRadius: 8, border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: active ? P.mainL : "transparent", color: active ? P.main : P.txt2, transition: "all .15s", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: active ? 600 : 500 }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = P.bg; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                  <span style={{ display: "flex", color: active ? P.main : P.txt3 }}>{n.icon}</span>
                  {n.label}
                  {active && <div style={{ marginLeft: "auto", width: 3, height: 18, borderRadius: 2, background: P.main }} />}
                </Link>
              );
            })}

          </div>
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${P.border}`, fontSize: 12, color: P.txt4, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: P.main, flexShrink: 0 }} />
            APEX DS v1.2.0
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <Outlet /> 
        </div>

      </div>
    </div>
  );
}