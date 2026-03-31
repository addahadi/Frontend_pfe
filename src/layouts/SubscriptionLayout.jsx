import { NavLink, Outlet } from "react-router-dom";
import { CreditCard, Users, Plus } from "lucide-react";
import { P } from "../shared/lib/design-tokens.js";
import { Btn, SectionTitle } from "../shared/components/ui/atoms.jsx";

export default function SubscriptionLayout() {
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
      {/* Header section with Dynamic Action button */}
      <SectionTitle 
        title="Subscriptions" 
        subtitle="Manage billing plans and monitor active subscribers" 
        action={<Btn icon={<Plus size={14}/>}>Create New Plan</Btn>} 
      />

      {/* Section Navigation Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${P.border}`, marginBottom: 24 }}>
        <NavLink to="/admin/subscriptions" end style={tabStyle}>
          Plan Features
        </NavLink>
        <NavLink to="/admin/subscriptions/subscribers" style={tabStyle}>
          Subscribers List
        </NavLink>
      </div>

      {/* This renders PlanFeatures or Subscribers based on the route */}
      <Outlet />
    </div>
  );
}