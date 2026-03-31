import React from 'react';
import { P } from "../../lib/design-tokens.js";

/**
 * Btn - A simple atom button component
 */
export const Btn = ({ children, onClick, icon, style = {} }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 8,
        background: P.main,
        color: "#fff",
        fontSize: 14,
        fontFamily: "'Inter',sans-serif",
        fontWeight: 600,
        cursor: "pointer",
        border: "none",
        boxShadow: `0 1px 3px rgba(16,78,216,0.3)`,
        transition: "background 0.15s",
        ...style
      }}
      onMouseEnter={e => e.currentTarget.style.background = P.mainD}
      onMouseLeave={e => e.currentTarget.style.background = P.main}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

/**
 * SectionTitle - A component for page headers
 */
export const SectionTitle = ({ title, subtitle, action }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: P.txt, margin: 0, letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: P.txt3, margin: "4px 0 0 0" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
