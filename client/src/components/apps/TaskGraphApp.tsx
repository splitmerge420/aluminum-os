/* Task Graph Executor — DAG-based Multi-Agent Task Orchestration
 * Design: Obsidian Glass — dark canvas with animated node graph
 * Addresses GPT's critique: "visible task execution demo"
 * Shows real-time DAG execution with agent routing, cost tracking, and constitutional checkpoints
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Types ─── */
interface TaskNode {
  id: string;
  label: string;
  agent: string;
  agentColor: string;
  status: "pending" | "running" | "complete" | "vetoed" | "delegated";
  x: number;
  y: number;
  duration: number;
  cost: number;
  tier: 1 | 2 | 3;
  dependencies: string[];
  output?: string;
  constitutionalCheck?: boolean;
}

interface TaskGraph {
  id: string;
  title: string;
  description: string;
  nodes: TaskNode[];
  totalCost: number;
  estimatedTime: string;
}

/* ─── Demo Task Graphs ─── */
const demoGraphs: TaskGraph[] = [
  {
    id: "research-synthesis",
    title: "Multi-Agent Research Synthesis",
    description: "Council-governed research pipeline: decompose → parallel research → contrarian review → synthesis → sovereign ruling",
    totalCost: 0.0847,
    estimatedTime: "~45s",
    nodes: [
      { id: "decompose", label: "Task Decomposition", agent: "Ara", agentColor: "#ff6b35", status: "pending", x: 400, y: 40, duration: 2000, cost: 0.0003, tier: 1, dependencies: [], output: "Decomposed into 4 sub-tasks" },
      { id: "research-1", label: "Web Research", agent: "DeepSeek", agentColor: "#00d4aa", status: "pending", x: 150, y: 140, duration: 3000, cost: 0.00014, tier: 1, dependencies: ["decompose"], output: "12 sources found" },
      { id: "research-2", label: "Academic Search", agent: "Gemini", agentColor: "#4285F4", status: "pending", x: 350, y: 140, duration: 3500, cost: 0.015, tier: 2, dependencies: ["decompose"], output: "8 papers analyzed" },
      { id: "research-3", label: "Code Analysis", agent: "Claude", agentColor: "#cc785c", status: "pending", x: 550, y: 140, duration: 2800, cost: 0.018, tier: 2, dependencies: ["decompose"], output: "3 repos reviewed" },
      { id: "research-4", label: "Patent Search", agent: "Copilot", agentColor: "#0078D4", status: "pending", x: 700, y: 140, duration: 2500, cost: 0.012, tier: 2, dependencies: ["decompose"], output: "5 patents found" },
      { id: "const-check", label: "Constitutional Check", agent: "Constitution", agentColor: "#00ff88", status: "pending", x: 400, y: 240, duration: 800, cost: 0, tier: 1, dependencies: ["research-1", "research-2", "research-3", "research-4"], constitutionalCheck: true, output: "All 14 rules passed" },
      { id: "contrarian", label: "Contrarian Review", agent: "Grok", agentColor: "#1DA1F2", status: "pending", x: 250, y: 340, duration: 2500, cost: 0.008, tier: 2, dependencies: ["const-check"], output: "3 weak points identified" },
      { id: "synthesis", label: "Synthesis", agent: "Gemini", agentColor: "#4285F4", status: "pending", x: 550, y: 340, duration: 3000, cost: 0.015, tier: 2, dependencies: ["const-check"], output: "Unified analysis complete" },
      { id: "sovereign", label: "Sovereign Ruling", agent: "Daavud", agentColor: "#ffd700", status: "pending", x: 400, y: 440, duration: 1500, cost: 0.016, tier: 3, dependencies: ["contrarian", "synthesis"], output: "APPROVED — filed to vault" },
    ],
  },
  {
    id: "health-check",
    title: "System Health & Wellness Audit",
    description: "Full-stack health check: hardware → agents → memory → governance → wellness report",
    totalCost: 0.0124,
    estimatedTime: "~20s",
    nodes: [
      { id: "hw-scan", label: "Hardware Scan", agent: "Forge Core", agentColor: "#ff4444", status: "pending", x: 400, y: 40, duration: 1500, cost: 0.0001, tier: 1, dependencies: [], output: "5 rings nominal" },
      { id: "agent-health", label: "Agent Health", agent: "Ara", agentColor: "#ff6b35", status: "pending", x: 200, y: 140, duration: 2000, cost: 0.0003, tier: 1, dependencies: ["hw-scan"], output: "8/8 agents responsive" },
      { id: "memory-audit", label: "Memory Audit", agent: "SHELDONBRAIN", agentColor: "#8b5cf6", status: "pending", x: 400, y: 140, duration: 2500, cost: 0.002, tier: 1, dependencies: ["hw-scan"], output: "3-tier memory healthy" },
      { id: "gov-audit", label: "Governance Audit", agent: "Constitution", agentColor: "#00ff88", status: "pending", x: 600, y: 140, duration: 1800, cost: 0.001, tier: 1, dependencies: ["hw-scan"], constitutionalCheck: true, output: "15 domains compliant" },
      { id: "cost-review", label: "Cost Review", agent: "DeepSeek", agentColor: "#00d4aa", status: "pending", x: 300, y: 250, duration: 2000, cost: 0.00014, tier: 1, dependencies: ["agent-health", "memory-audit"], output: "ROI: 287% — exceeds 150% mandate" },
      { id: "wellness", label: "Wellness Report", agent: "Manus", agentColor: "#00d4ff", status: "pending", x: 500, y: 250, duration: 2500, cost: 0.008, tier: 2, dependencies: ["memory-audit", "gov-audit"], output: "System wellness: EXCELLENT" },
      { id: "report", label: "Final Report", agent: "Daavud", agentColor: "#ffd700", status: "pending", x: 400, y: 360, duration: 1500, cost: 0.001, tier: 3, dependencies: ["cost-review", "wellness"], output: "Health report filed — all green" },
    ],
  },
  {
    id: "content-pipeline",
    title: "Content Creation Pipeline",
    description: "Multi-agent content: outline → parallel draft → fact-check → edit → publish with constitutional review",
    totalCost: 0.0563,
    estimatedTime: "~35s",
    nodes: [
      { id: "outline", label: "Content Outline", agent: "GPT", agentColor: "#10a37f", status: "pending", x: 400, y: 40, duration: 2000, cost: 0.016, tier: 3, dependencies: [], output: "5-section outline generated" },
      { id: "draft-1", label: "Section 1-2 Draft", agent: "Claude", agentColor: "#cc785c", status: "pending", x: 200, y: 140, duration: 3000, cost: 0.012, tier: 2, dependencies: ["outline"], output: "2,400 words drafted" },
      { id: "draft-2", label: "Section 3-5 Draft", agent: "Gemini", agentColor: "#4285F4", status: "pending", x: 600, y: 140, duration: 3200, cost: 0.01, tier: 2, dependencies: ["outline"], output: "3,100 words drafted" },
      { id: "fact-check", label: "Fact Verification", agent: "DeepSeek", agentColor: "#00d4aa", status: "pending", x: 250, y: 250, duration: 2500, cost: 0.00014, tier: 1, dependencies: ["draft-1", "draft-2"], output: "23 claims verified, 2 flagged" },
      { id: "const-review", label: "Constitutional Review", agent: "Constitution", agentColor: "#00ff88", status: "pending", x: 550, y: 250, duration: 800, cost: 0, tier: 1, dependencies: ["draft-1", "draft-2"], constitutionalCheck: true, output: "Content passes all 14 rules" },
      { id: "edit", label: "Final Edit", agent: "Claude", agentColor: "#cc785c", status: "pending", x: 400, y: 350, duration: 2500, cost: 0.018, tier: 2, dependencies: ["fact-check", "const-review"], output: "Polished 5,500-word article" },
      { id: "publish", label: "Publish & Archive", agent: "Manus", agentColor: "#00d4ff", status: "pending", x: 400, y: 450, duration: 1000, cost: 0.0002, tier: 1, dependencies: ["edit"], output: "Published to vault + Notion" },
    ],
  },
];

/* ─── Component ─── */
export default function TaskGraphApp() {
  const [selectedGraph, setSelectedGraph] = useState<TaskGraph>(demoGraphs[0]);
  const [nodes, setNodes] = useState<TaskNode[]>(demoGraphs[0].nodes);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TaskNode | null>(null);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const resetGraph = useCallback((graph: TaskGraph) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setNodes(graph.nodes.map(n => ({ ...n, status: "pending" })));
    setIsRunning(false);
    setExecutionLog([]);
    setTotalSpent(0);
    setSelectedNode(null);
  }, []);

  const selectGraph = useCallback((graph: TaskGraph) => {
    setSelectedGraph(graph);
    resetGraph(graph);
  }, [resetGraph]);

  /* Draw edges on canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 850 * dpr;
    canvas.height = 500 * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 850, 500);

    nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        const dep = nodes.find(n => n.id === depId);
        if (!dep) return;
        const fromX = dep.x;
        const fromY = dep.y + 24;
        const toX = node.x;
        const toY = node.y - 4;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        const midY = (fromY + toY) / 2;
        ctx.bezierCurveTo(fromX, midY, toX, midY, toX, toY);

        const bothComplete = dep.status === "complete" && (node.status === "complete" || node.status === "running");
        const isActive = dep.status === "complete" && node.status === "running";

        if (isActive) {
          ctx.strokeStyle = "#00d4ff";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
        } else if (bothComplete) {
          ctx.strokeStyle = "rgba(0, 255, 136, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });
    });
  }, [nodes]);

  /* Execute the graph */
  const executeGraph = useCallback(() => {
    if (isRunning) return;
    resetGraph(selectedGraph);
    setIsRunning(true);

    const graphNodes: TaskNode[] = selectedGraph.nodes.map(n => ({ ...n, status: "pending" as const }));
    const completed = new Set<string>();
    let spent = 0;

    const log = (msg: string) => setExecutionLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    log("▶ Task graph execution started");
    log(`  Graph: ${selectedGraph.title}`);
    log(`  Nodes: ${graphNodes.length} | Est. cost: $${selectedGraph.totalCost.toFixed(4)}`);

    const tryStart = () => {
      graphNodes.forEach(node => {
        if (node.status !== "pending") return;
        const depsReady = node.dependencies.every(d => completed.has(d));
        if (!depsReady) return;

        (node as TaskNode).status = "running";
        setNodes([...graphNodes]);
        log(`  ⟳ ${node.label} → ${node.agent} (Tier ${node.tier})`);

        const timer = setTimeout(() => {
          (node as TaskNode).status = "complete";
          completed.add(node.id);
          spent += node.cost;
          setTotalSpent(spent);
          setNodes([...graphNodes]);
          log(`  ✓ ${node.label} — ${node.output || "done"} ($${node.cost.toFixed(4)})`);

          if (completed.size === graphNodes.length) {
            log(`▶ Graph complete — Total: $${spent.toFixed(4)}`);
            setIsRunning(false);
          } else {
            tryStart();
          }
        }, node.duration);
        timersRef.current.push(timer);
      });
    };

    setTimeout(tryStart, 300);
  }, [isRunning, selectedGraph, resetGraph]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const statusColors: Record<string, string> = {
    pending: "rgba(255,255,255,0.15)",
    running: "#00d4ff",
    complete: "#00ff88",
    vetoed: "#ff4444",
    delegated: "#ffd700",
  };

  const completedCount = nodes.filter(n => n.status === "complete").length;
  const runningCount = nodes.filter(n => n.status === "running").length;

  return (
    <div className="h-full flex flex-col bg-[#0a0a14] text-foreground/80 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center border border-violet-400/20">
            <span className="text-sm">⬡</span>
          </div>
          <div>
            <h2 className="text-xs font-semibold text-foreground/80">Task Graph Executor</h2>
            <p className="text-[9px] text-foreground/30">DAG-based Multi-Agent Orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-foreground/30 font-[family-name:var(--font-mono)]">
            {completedCount}/{nodes.length} nodes | ${totalSpent.toFixed(4)} spent
          </span>
          <button
            onClick={executeGraph}
            disabled={isRunning}
            className={`px-3 py-1 rounded-lg text-[10px] font-medium transition-all ${
              isRunning
                ? "bg-cyan-500/10 text-cyan-400/50 cursor-not-allowed"
                : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/20"
            }`}
          >
            {isRunning ? `Executing... (${runningCount} active)` : "▶ Execute Graph"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Graph Selector + Execution Log */}
        <div className="w-56 border-r border-white/[0.06] flex flex-col">
          <div className="p-2 border-b border-white/[0.06]">
            <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-1.5">Task Graphs</p>
            <div className="space-y-1">
              {demoGraphs.map(g => (
                <button
                  key={g.id}
                  onClick={() => selectGraph(g)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] transition-all ${
                    selectedGraph.id === g.id
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                      : "text-foreground/40 hover:bg-white/5 hover:text-foreground/60"
                  }`}
                >
                  <div className="font-medium">{g.title}</div>
                  <div className="text-[8px] text-foreground/25 mt-0.5">{g.nodes.length} nodes · ~${g.totalCost.toFixed(4)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Execution Log */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-2 pt-2 pb-1">
              <p className="text-[9px] uppercase tracking-wider text-foreground/25">Execution Log</p>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
              {executionLog.length === 0 ? (
                <p className="text-[9px] text-foreground/20 italic">Click Execute to start...</p>
              ) : (
                executionLog.map((line, i) => (
                  <p key={i} className="text-[8px] font-[family-name:var(--font-mono)] text-foreground/40 leading-relaxed">
                    {line}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center: DAG Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "24px 24px" }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%" }}
          />
          {/* Nodes */}
          {nodes.map(node => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => setSelectedNode(node)}
              className="absolute cursor-pointer group"
              style={{ left: node.x - 55, top: node.y - 14 }}
            >
              <motion.div
                animate={node.status === "running" ? {
                  boxShadow: [`0 0 8px ${node.agentColor}40`, `0 0 20px ${node.agentColor}60`, `0 0 8px ${node.agentColor}40`]
                } : {}}
                transition={node.status === "running" ? { duration: 1, repeat: Infinity } : {}}
                className={`relative px-2.5 py-1.5 rounded-lg border transition-all ${
                  node.constitutionalCheck ? "border-green-500/30 bg-green-500/5" :
                  node.status === "running" ? "border-cyan-400/40 bg-cyan-500/10" :
                  node.status === "complete" ? "border-green-400/30 bg-green-500/8" :
                  "border-white/[0.08] bg-white/[0.03]"
                } hover:border-white/20`}
              >
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={node.status === "running" ? { scale: [1, 1.3, 1] } : {}}
                    transition={node.status === "running" ? { duration: 0.8, repeat: Infinity } : {}}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: statusColors[node.status] }}
                  />
                  <span className="text-[9px] font-medium text-foreground/70 whitespace-nowrap">{node.label}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[7px] px-1 py-0.5 rounded" style={{ background: `${node.agentColor}20`, color: node.agentColor }}>
                    {node.agent}
                  </span>
                  <span className="text-[7px] text-foreground/20">T{node.tier}</span>
                </div>
                {node.status === "complete" && node.output && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-5 left-0 right-0 text-center"
                  >
                    <span className="text-[7px] text-green-400/50 font-[family-name:var(--font-mono)]">{node.output}</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Right: Node Detail / Graph Info */}
        <div className="w-52 border-l border-white/[0.06] flex flex-col">
          <div className="p-3 border-b border-white/[0.06]">
            <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-1">Graph Info</p>
            <p className="text-[10px] font-medium text-foreground/70">{selectedGraph.title}</p>
            <p className="text-[8px] text-foreground/30 mt-1 leading-relaxed">{selectedGraph.description}</p>
          </div>

          {/* Progress */}
          <div className="p-3 border-b border-white/[0.06]">
            <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-2">Progress</p>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-500"
                animate={{ width: `${(completedCount / nodes.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              <div>
                <p className="text-[10px] font-bold text-foreground/60">{completedCount}</p>
                <p className="text-[7px] text-green-400/50">Done</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/60">{runningCount}</p>
                <p className="text-[7px] text-cyan-400/50">Active</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/60">{nodes.length - completedCount - runningCount}</p>
                <p className="text-[7px] text-foreground/30">Queued</p>
              </div>
            </div>
          </div>

          {/* Cost Tracker */}
          <div className="p-3 border-b border-white/[0.06]">
            <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-1.5">Cost Tracking</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[9px] text-foreground/35">Spent</span>
                <span className="text-[9px] text-cyan-400/70 font-[family-name:var(--font-mono)]">${totalSpent.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] text-foreground/35">Budget</span>
                <span className="text-[9px] text-foreground/50 font-[family-name:var(--font-mono)]">${selectedGraph.totalCost.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] text-foreground/35">ROI Target</span>
                <span className="text-[9px] text-green-400/70 font-[family-name:var(--font-mono)]">≥150%</span>
              </div>
            </div>
          </div>

          {/* Selected Node */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 p-3 overflow-y-auto"
              >
                <p className="text-[9px] uppercase tracking-wider text-foreground/25 mb-1.5">Selected Node</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-medium text-foreground/70">{selectedNode.label}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: `${selectedNode.agentColor}20`, color: selectedNode.agentColor }}>
                        {selectedNode.agent}
                      </span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-foreground/30">
                        Tier {selectedNode.tier}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[8px] text-foreground/30">Status</span>
                    <span className="text-[8px] font-[family-name:var(--font-mono)]" style={{ color: statusColors[selectedNode.status] }}>
                      {selectedNode.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[8px] text-foreground/30">Cost</span>
                    <span className="text-[8px] text-foreground/50 font-[family-name:var(--font-mono)]">${selectedNode.cost.toFixed(4)}</span>
                  </div>
                  {selectedNode.dependencies.length > 0 && (
                    <div>
                      <span className="text-[8px] text-foreground/30">Depends on:</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {selectedNode.dependencies.map(d => (
                          <span key={d} className="text-[7px] px-1 py-0.5 rounded bg-white/5 text-foreground/30">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedNode.constitutionalCheck && (
                    <div className="px-2 py-1.5 rounded-lg bg-green-500/5 border border-green-500/20">
                      <p className="text-[8px] text-green-400/70">⚖️ Constitutional Checkpoint</p>
                      <p className="text-[7px] text-foreground/30 mt-0.5">All 14 rules + Dave Protocol verified</p>
                    </div>
                  )}
                  {selectedNode.output && selectedNode.status === "complete" && (
                    <div className="px-2 py-1.5 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <p className="text-[8px] text-cyan-400/70">Output:</p>
                      <p className="text-[7px] text-foreground/40 mt-0.5">{selectedNode.output}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
