"use client";

import React from "react";

export interface FormTabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

interface FormTabsProps {
  tabs: FormTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function FormTabs({ tabs, activeTab, onChange, className = "" }: FormTabsProps) {
  return (
    <div className={`border-b border-[var(--color-border)] mb-5 -mx-6 px-6 bg-surface-2/40 ${className}`}>
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-surface-1 text-[var(--color-accent-dark)] shadow-sm border border-[var(--color-border)]"
                  : "text-text-muted hover:text-text-primary hover:bg-surface-2"
              }`}
            >
              {Icon && <Icon size={14} className={isActive ? "text-[var(--color-accent-dark)]" : "text-text-muted"} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                    isActive
                      ? "bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] font-bold"
                      : "bg-surface-3 text-text-muted"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
