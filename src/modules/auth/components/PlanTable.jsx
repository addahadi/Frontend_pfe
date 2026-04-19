// components/PlanTable.jsx
import React from "react";
import { CheckCircle, Bolt, X, Server } from "lucide-react";

const PlanTable = ({ data }) => {
  return (
    <div className="border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-hidden rounded-xl border shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-border-light dark:border-border-dark border-b bg-black/5 dark:bg-white/5">
            <th className="w-1/3 px-6 py-4 text-sm font-bold">Features</th>
            <th className="w-1/3 px-6 py-4 text-center text-sm font-bold">Normal User</th>
            <th className="text-primary w-1/3 px-6 py-4 text-center text-sm font-bold">Company</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-border-light dark:border-border-dark border-b transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                row.highlight ? "bg-primary/5 dark:bg-primary/10" : ""
              }`}
            >
              <td className="px-6 py-4 text-sm font-medium">{row.feature}</td>

              {/* Normal User Cell */}
              <td className="px-6 py-4 text-center text-sm">
                {row.normal === "check" ? (
                  <CheckCircle className="mx-auto text-blue-500" size={20} />
                ) : row.normal === "bolt" ? (
                  <Bolt className="mx-auto text-orange-500" size={20} />
                ) : row.normal === "remove" ? (
                  <X className="mx-auto text-red-500" size={20} />
                ) : row.normal === "server" ? (
                  <Server className="mx-auto text-green-500" size={20} />
                ) : (
                  row.normal
                )}
              </td>

              {/* Company Cell */}
              <td className="px-6 py-4 text-center text-sm font-semibold">
                {row.company === "check" ? (
                  <CheckCircle className="mx-auto text-blue-500" size={20} />
                ) : row.company === "bolt" ? (
                  <Bolt className="mx-auto text-orange-500" size={20} />
                ) : row.company === "remove" ? (
                  <X className="mx-auto text-red-500" size={20} />
                ) : row.company === "server" ? (
                  <Server className="mx-auto text-green-500" size={20} />
                ) : (
                  row.company
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanTable;
