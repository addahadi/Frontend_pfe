// components/PlanCard.jsx
import React from "react";
import { CheckCircle, Bolt, Server, X } from "lucide-react";

const iconMap = {
  check: CheckCircle,
  bolt: Bolt,
  api: Server,
  remove: X,
};

const PlanCard = ({ title, price, subtitle, features, highlight, buttonText }) => {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-xl border ${
        highlight
          ? "border-primary border-2 shadow-lg md:-translate-y-4"
          : "border border-solid shadow-sm"
      } bg-surface-light dark:bg-surface-dark`}
    >
      {highlight && <div className="bg-accent absolute inset-x-0 top-0 h-1"></div>}

      <div className="flex flex-1 flex-col gap-6 p-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className={`${highlight ? "text-primary" : ""} text-xl font-bold`}>{title}</h2>
            {highlight && (
              <span className="bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Recommended
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
              {subtitle}
            </p>
          )}
          {price && (
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tight">{price}</span>
            </div>
          )}
        </div>

        <button
          className={`flex h-12 w-full items-center justify-center rounded-lg px-4 text-base font-bold leading-normal transition-colors ${
            highlight
              ? "bg-primary hover:bg-primary/90 shadow-primary/20 text-white shadow-md"
              : "bg-primary/10 hover:bg-primary/20 text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
          }`}
        >
          {buttonText}
        </button>

        <div className="mt-4 flex flex-col gap-4">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon] || CheckCircle;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm ${feature.bold ? "font-bold" : "font-medium"}`}
              >
                <Icon className={`${feature.color || "text-primary"}`} size={20} />
                {feature.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
