"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Globe, Database, Shield, Zap, Terminal, Activity, CheckCircle2, ArrowRight } from "lucide-react";

interface LayerData {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tagline: string;
  features: string[];
  codeSnippet: string;
  metrics: { label: string; value: string }[];
}

const architectureLayers: LayerData[] = [
  {
    id: "edge",
    label: "Edge & Delivery",
    icon: Globe,
    tagline: "Sub-millisecond global routing and distributed edge computation.",
    features: [
      "Dynamic Edge Prerendering & Streaming Server-Side Rendering (SSR)",
      "Multi-region Cloudflare / AWS edge CDN with localized micro-caching",
      "Automatic Brotli / AVIF compression and asset pre-fetching",
    ],
    codeSnippet: `// Edge Middleware Cache & Auth Route
export const config = { matcher: '/api/v1/:path*' };
export default async function middleware(req: NextRequest) {
  const edgeGeo = req.geo?.region || 'global-iad';
  const cachedResponse = await edgeCache.get(req.url);
  if (cachedResponse) return cachedResponse.withHeader('X-Edge-Hit', 'true');
  return executeDistributedRoute(req, { latencyTargetMs: 40 });
}`,
    metrics: [
      { label: "Global TTFB", value: "< 420ms" },
      { label: "Cache Hit Ratio", value: "98.4%" },
      { label: "Lighthouse Score", value: "99 / 100" },
    ],
  },
  {
    id: "core",
    label: "Application Core",
    icon: Server,
    tagline: "Strict TypeScript modularity with Atomic design systems.",
    features: [
      "Strict TypeScript typing across every API payload and component interface",
      "Zero-runtime CSS variables with WCAG 2.1 AA accessible contrast ratios",
      "Automated Playwright E2E and Jest unit regression test pipelines",
    ],
    codeSnippet: `// Typed Domain Handler with State Sync
export class MissionCriticalPipeline<TContext extends SecurityContext> {
  async dispatch<TInput, TOutput>(
    action: DomainAction<TInput, TOutput>,
    payload: TInput
  ): Promise<Result<TOutput>> {
    const validated = action.schema.parse(payload);
    return await this.executionEngine.runIsolated(validated);
  }
}`,
    metrics: [
      { label: "Type Safety", value: "100% Strict" },
      { label: "Test Coverage", value: "92% Automated" },
      { label: "Bundle Overhead", value: "Zero Bloat" },
    ],
  },
  {
    id: "data",
    label: "Data & Caching",
    icon: Database,
    tagline: "High-throughput relational transactions and vector search embeddings.",
    features: [
      "ACID-compliant PostgreSQL schemas with read replica connection pooling",
      "Sub-millisecond Redis in-memory caching and BullMQ async workers",
      "Automated point-in-time database backups and multi-region failover",
    ],
    codeSnippet: `// Transactional Connection Pooling & Queue
const client = await pool.connect();
try {
  await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');
  const record = await client.query(updateLedgerQuery, [id, delta]);
  await redisCluster.publish('events:state_change', JSON.stringify(record));
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw new DistributedError('TRANSACTION_ABORTED', err);
}`,
    metrics: [
      { label: "Query Execution", value: "< 12ms avg" },
      { label: "Queue Throughput", value: "25k msg/s" },
      { label: "Data Integrity", value: "100% ACID" },
    ],
  },
  {
    id: "security",
    label: "Security & Ops",
    icon: Shield,
    tagline: "Enterprise security protocols, SOC2 compliance, and live telemetry.",
    features: [
      "End-to-end TLS 1.3 encryption with automatic TLS certificate renewals",
      "Cryptographic audit logging and field-level RBAC role authorization",
      "Real-time OpenTelemetry tracking with Prometheus & Grafana alerts",
    ],
    codeSnippet: `// RBAC Security Policy & Audit Enforcer
export function requirePrivilege(privilege: PermissionKey) {
  return async (req: RequestContext) => {
    const principal = await verifyJWT(req.headers.authorization);
    if (!principal.roles.some((r) => r.hasPrivilege(privilege))) {
      await auditLog.recordUnauthorizedAccess(principal, privilege);
      throw new ForbiddenException('INSUFFICIENT_SECURITY_CLEARANCE');
    }
  };
}`,
    metrics: [
      { label: "Encryption", value: "AES-256 / TLS 1.3" },
      { label: "Audit Trails", value: "Cryptographic" },
      { label: "Uptime SLA", value: "99.99%" },
    ],
  },
];

export function ServiceArchitectureVisualizer({ serviceTitle }: { serviceTitle: string }) {
  const [activeLayer, setActiveLayer] = useState<string>("edge");

  const currentLayer = architectureLayers.find((l) => l.id === activeLayer) || architectureLayers[0];

  return (
    <div className="bg-surface-1 border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-2xl overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 border-b border-[var(--color-border)] bg-surface-2/60 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-xs font-mono text-text-secondary font-semibold">
            mark://architecture-blueprint/{serviceTitle.toLowerCase().replace(/\s+/g, "-")}
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-mono font-semibold">
          <Activity size={12} className="animate-pulse" />
          <span>System Healthy &bull; 99.99% Uptime</span>
        </div>
      </div>

      {/* Layer Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[var(--color-border)] bg-surface-1">
        {architectureLayers.map((layer) => {
          const Icon = layer.icon;
          const isActive = layer.id === activeLayer;

          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`px-5 py-4 text-left flex items-center gap-3 border-r last:border-r-0 border-[var(--color-border)] transition-all relative ${
                isActive
                  ? "bg-surface-2 text-text-primary font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-2/40"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]" />
              )}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[var(--color-accent)] text-surface-1"
                    : "bg-surface-3 text-text-muted"
                }`}
              >
                <Icon size={16} />
              </div>
              <span className="text-xs sm:text-sm">{layer.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Blueprint Content Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLayer.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left info & features */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-glow)] text-[var(--color-accent-dark)] text-xs font-mono font-bold uppercase mb-4">
                {currentLayer.label} Blueprint
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-display text-text-primary mb-3">
                {currentLayer.tagline}
              </h3>

              <ul className="space-y-3 mt-6 mb-8">
                {currentLayer.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                    <CheckCircle2 size={16} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics pills */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[var(--color-border)]">
              {currentLayer.metrics.map((metric, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-surface-2 border border-[var(--color-border)] text-center">
                  <div className="text-xs text-text-muted font-mono uppercase tracking-wider mb-0.5">
                    {metric.label}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-text-primary font-display">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Code / Architecture preview */}
          <div className="lg:col-span-6 bg-zinc-950 text-zinc-100 rounded-xl p-5 border border-zinc-800 font-mono text-xs overflow-x-auto shadow-inner relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-zinc-400">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[var(--color-accent)]" />
                <span>production-runtime.ts</span>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase">TypeScript 5.7</span>
            </div>

            <pre className="text-zinc-300 leading-relaxed overflow-x-auto">
              <code>{currentLayer.codeSnippet}</code>
            </pre>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
