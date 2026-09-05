"use client";

import { useState } from "react";
import { 
  Activity, 
  CheckCircle2, 
  Database, 
  Lock, 
  Server, 
  ShieldCheck, 
  Terminal, 
  Zap 
} from "lucide-react";

interface ProductVisualPreviewProps {
  productName: string;
  category: string;
  demoUrl?: string;
}

export function ProductVisualPreview({
  productName,
  category,
  demoUrl,
}: ProductVisualPreviewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "telemetry" | "security" | "api">("overview");

  return (
    <section className="section-padding border-b border-[var(--color-border)] bg-surface-2/40">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-1 text-text-muted text-xs font-mono mb-3 uppercase tracking-widest border border-[var(--color-border)] shadow-xs">
            <Activity size={12} className="text-[var(--color-accent)]" />
            Interactive Architecture & Visual Canvas
          </div>
          <h2 className="text-display-sm md:text-display-md font-bold font-display text-text-primary mb-3">
            Real-Time System Command Center
          </h2>
          <p className="text-text-secondary text-base md:text-lg font-light">
            Explore the live interface architecture and sub-millisecond execution engine behind {productName}.
          </p>
        </div>

        {/* Mock Enterprise Window */}
        <div className="max-w-5xl mx-auto bg-surface-1 rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-2xl overflow-hidden">
          {/* Window Title Bar */}
          <div className="bg-surface-2 px-3.5 sm:px-6 py-3 sm:py-4 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1 shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono font-medium text-text-secondary flex items-center gap-1.5 truncate max-w-[150px] xs:max-w-[220px] sm:max-w-none">
                <Lock size={12} className="text-emerald-600 shrink-0" />
                app.{productName.toLowerCase().replace(/\s+/g, "")}.enterprise.internal
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-surface-1 p-1 rounded-lg border border-[var(--color-border)] text-xs font-mono overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors whitespace-nowrap min-h-[32px] ${
                  activeTab === "overview"
                    ? "bg-text-primary text-surface-1 font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("telemetry")}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors whitespace-nowrap min-h-[32px] ${
                  activeTab === "telemetry"
                    ? "bg-text-primary text-surface-1 font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Telemetry
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors whitespace-nowrap min-h-[32px] ${
                  activeTab === "security"
                    ? "bg-text-primary text-surface-1 font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Security & RBAC
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("api")}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors whitespace-nowrap min-h-[32px] ${
                  activeTab === "api"
                    ? "bg-text-primary text-surface-1 font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                REST / GraphQL
              </button>
            </div>
          </div>

          {/* Window Canvas Body */}
          <div className="p-4 sm:p-6 md:p-10 bg-surface-1">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-surface-2 border border-[var(--color-border)]">
                    <div className="text-xs font-mono text-text-muted mb-1">System Uptime</div>
                    <div className="text-xl font-bold font-display text-text-primary">99.998%</div>
                    <div className="text-[11px] text-emerald-600 font-mono mt-1 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Healthy (30d)
                    </div>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-surface-2 border border-[var(--color-border)]">
                    <div className="text-xs font-mono text-text-muted mb-1">Response Latency</div>
                    <div className="text-xl font-bold font-display text-text-primary">38ms</div>
                    <div className="text-[11px] text-[var(--color-accent-dark)] font-mono mt-1 flex items-center gap-1">
                      <Zap size={11} /> Edge Cached
                    </div>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-surface-2 border border-[var(--color-border)]">
                    <div className="text-xs font-mono text-text-muted mb-1">Daily Transactions</div>
                    <div className="text-xl font-bold font-display text-text-primary">1,480,210</div>
                    <div className="text-[11px] text-blue-600 font-mono mt-1 flex items-center gap-1">
                      <Activity size={11} /> +14.2% velocity
                    </div>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-surface-2 border border-[var(--color-border)]">
                    <div className="text-xs font-mono text-text-muted mb-1">Active Nodes</div>
                    <div className="text-xl font-bold font-display text-text-primary">16 / 16</div>
                    <div className="text-[11px] text-emerald-600 font-mono mt-1 flex items-center gap-1">
                      <Server size={11} /> Multi-region
                    </div>
                  </div>
                </div>

                {/* Main Visual Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 p-6 rounded-xl bg-surface-2/60 border border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-text-primary font-mono uppercase">Operational Workflow Pipeline</h4>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">LIVE STREAM</span>
                    </div>

                    {/* Simulated Graph Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-text-secondary mb-1">
                          <span>Database Replication & Sharding</span>
                          <span className="font-mono">100% Synced</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
                          <div className="h-full bg-[var(--color-accent)] w-full rounded-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-text-secondary mb-1">
                          <span>Asynchronous Event Queue (Kafka/Redis)</span>
                          <span className="font-mono">99.4% Capacity Free</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[94%] rounded-full" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-text-secondary mb-1">
                          <span>WebSocket Real-Time Broadcasts</span>
                          <span className="font-mono">&lt; 15ms Broadcast</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
                          <div className="h-full bg-blue-500 w-[98%] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-surface-2/60 border border-[var(--color-border)] flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary font-mono uppercase mb-3">Enterprise Core</h4>
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">
                        {productName} is architected for continuous high-throughput transaction velocity without single points of failure.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-1 border border-[var(--color-border)] text-xs font-mono text-text-secondary">
                      <div className="flex items-center gap-1.5 text-text-primary font-bold mb-1">
                        <Zap size={13} className="text-[var(--color-accent-dark)]" />
                        Zero Per-Seat Taxes
                      </div>
                      Deploy across 10,000 operators with private VPC data sovereignty.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "telemetry" && (
              <div className="p-6 rounded-xl bg-surface-2/60 border border-[var(--color-border)] space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <span className="text-text-primary font-bold">Telemetry Stream & Heartbeat</span>
                  <span className="text-emerald-600 font-medium">All Microservices Healthy</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-text-secondary">
                  <div className="p-3 rounded-lg bg-surface-1 border border-[var(--color-border)] space-y-1">
                    <div className="text-text-muted text-[11px]">Primary DB Read Pool</div>
                    <div className="text-sm font-bold text-text-primary">1.2ms Query Avg (PostgreSQL 16)</div>
                    <div className="text-[10px] text-text-muted">Connection Pool: 48/500 Active</div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-1 border border-[var(--color-border)] space-y-1">
                    <div className="text-text-muted text-[11px]">Cache Hit Ratio</div>
                    <div className="text-sm font-bold text-text-primary">98.4% Hit Rate (Redis Cluster)</div>
                    <div className="text-[10px] text-text-muted">Memory Allocated: 4.2 GB / 32 GB</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6 rounded-xl bg-surface-2/60 border border-[var(--color-border)] space-y-4 text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <span className="font-bold text-text-primary font-mono uppercase text-xs">Security Matrix & Access Enforcement</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">SOC2 & GDPR READY</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-surface-1 border border-[var(--color-border)]">
                    <ShieldCheck size={16} className="text-emerald-600 mb-2" />
                    <div className="font-bold text-text-primary">AES-256 & TLS 1.3</div>
                    <div className="text-text-muted text-[11px] mt-1">End-to-end cryptographic encryption at rest and in transit.</div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-1 border border-[var(--color-border)]">
                    <Lock size={16} className="text-[var(--color-accent-dark)] mb-2" />
                    <div className="font-bold text-text-primary">Field-Level RBAC</div>
                    <div className="text-text-muted text-[11px] mt-1">Granular role permissions with row-level security policies.</div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-1 border border-[var(--color-border)]">
                    <Database size={16} className="text-blue-600 mb-2" />
                    <div className="font-bold text-text-primary">Immutable Audit Trail</div>
                    <div className="text-text-muted text-[11px] mt-1">Tamper-proof event ledger recording all CRUD operations.</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="p-6 rounded-xl bg-surface-2/80 border border-[var(--color-border)] font-mono text-xs">
                <div className="flex items-center gap-2 text-text-muted mb-3">
                  <Terminal size={14} className="text-[var(--color-accent-dark)]" />
                  <span>API Request Contract (HTTP / JSON)</span>
                </div>
                <pre className="p-4 rounded-lg bg-[#111111] text-[#ECECEC] overflow-x-auto leading-relaxed text-[11px]">
{`curl -X POST https://api.mark2.in/v1/${productName.toLowerCase().replace(/\s+/g, "-")}/query \\
  -H "Authorization: Bearer sec_live_enterprise_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "module": "core",
    "filter": { "status": "active" },
    "execution_mode": "edge_streaming"
  }'`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
