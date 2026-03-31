/**
 * P (Design Tokens) - Project Palette & Properties
 * A centralized object for colors, typography, and UI constants.
 */
export const P = {
  // Main brand colors
  main: "#104ED8",      // Primary Blue
  mainD: "#0C3EAB",     // Darker Blue (for hover)
  mainL: "#E8EFFF",     // Background Blue (for active states)
  
  // Neutral colors
  bg: "#F8FAFC",        // App Background
  surface: "#FFFFFF",   // Card/Sidebar Background
  border: "#E2E8F0",    // Divider/Border Color
  
  // Typography
  txt: "#0F172A",       // Main Headline Text
  txt2: "#334155",      // Body/Secondary Text
  txt3: "#64748B",      // Muted/Subtext
  txt4: "#94A3B8",      // Extra Muted/Disabled
  
  body: {
    size: "14px",
    lineHeight: "1.5",
  },
  
  // Statuses (Optional expansion)
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
};

export default P;
