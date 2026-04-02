import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { P } from "../../../shared/lib/design-tokens";
import { Btn, SectionTitle } from "../../../shared/components/ui/atoms.jsx"; 


export default function ArticleLayout() {
  const location = useLocation(); 
  const isEditor = location.pathname.includes("/articles/new") || location.pathname.includes("/articles/") && location.pathname.includes("/edit");
  const tabStyle = ({ isActive }) => ({
    padding: "10px 20px",
    background: "none",
    border: "none",
    borderBottom: `2px solid ${isActive ? P.main : "transparent"}`,
    color: isActive ? P.main : P.txt3,
    fontSize: 14,
    fontFamily: "Inter,sans-serif",
    cursor: "pointer",
    fontWeight: isActive ? 600 : 400,
    transition: "all .15s",
    marginBottom: -1,
    textDecoration: "none",
    display: "inline-block"
  });

  return (
    <div style={{ padding: "28px 30px", animation: "fadeUp .3s ease" }}>
      
      {/*  Header */}
      <SectionTitle 
        title="Articles" 
        subtitle="Content management & tags"
        action={
          <Link to="/admin/articles/new">
            <Btn icon={<Plus size={14}/>}>New Article</Btn>
          </Link>
        } 
      />

      {/* ✅ Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${P.border}`, marginBottom: 24 }}>
        
        <NavLink to="/admin/articles" end style={tabStyle}>
          All Articles
        </NavLink>

        <NavLink to="/admin/articles/tags" style={tabStyle}>
          Tags
        </NavLink>
        {isEditor && (
       <NavLink to={location.pathname} style={tabStyle}>
        New Article
      </NavLink>
  )}
      </div>

      {/* ✅ Content (يتبدل حسب route) */}
      <Outlet />

    </div>
  );
}