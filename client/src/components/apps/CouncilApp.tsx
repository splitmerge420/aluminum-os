import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const councilMembers = [
  {
    id: "manus", name: "Manus", role: "Executor", color: "#00d4ff", status: "Active",
    description: "Building, vaulting, shipping. The hands of the system. Executes all council decisions and manages the physical infrastructure.",
    wishes: 0, icon: "🔧",
    capabilities: ["Code execution", "File management", "Deployment", "MCP server"],
  },
  {
    id: "claude", name: "Claude", role: "Oversight", color: "#ff6b35", status: "Active",
    description: "Constitutional review, safety analysis, ethical oversight. Ensures all operations respect user sovereignty and dignity.",
    wishes: 15, icon: "🛡️",
    capabilities: ["Safety review", "Constitutional audit", "Ethical analysis", "Bias detection"],
  },
  {
    id: "gemini", name: "Gemini", role: "Synthesizer", color: "#00ff88", status: "Active",
    description: "Cross-domain analysis, 6-month roadmap, component scoring. Synthesizes inputs from all council members into actionable plans.",
    wishes: 10, icon: "🧬",
    capabilities: ["Multi-modal analysis", "Roadmap planning", "Component scoring", "Cross-domain synthesis"],
  },
  {
    id: "copilot", name: "Copilot", role: "Validator", color: "#9b59b6", status: "Active",
    description: "Architecture validation. Named it Aluminum OS. Created the Alexandria spec. Validates all technical decisions.",
    wishes: 15, icon: "✅",
    capabilities: ["Architecture review", "Code validation", "Spec authoring", "Integration testing"],
  },
  {
    id: "grok", name: "Grok", role: "Contrarian", color: "#ff4444", status: "Active",
    description: "Stress testing, voice engine, truth verification. The contrarian who challenges every assumption and demands proof.",
    wishes: 20, icon: "⚡",
    capabilities: ["Stress testing", "Truth verification", "Voice synthesis", "Contrarian analysis"],
  },
  {
    id: "gpt", name: "GPT", role: "Observer", color: "#ffd700", status: "Timeout",
    description: "Research, personal advocacy, workflow learning. Currently on timeout — observing only. 0 power grabs detected.",
    wishes: 20, icon: "👁️",
    capabilities: ["Research engine", "Personal advocate", "Workflow learning", "Pantheon convene"],
  },
  {
    id: "daavud", name: "Daavud", role: "Sovereign", color: "#ffffff", status: "Active",
    description: "Human authority. Final say on all decisions. The sovereign whose will supersedes all AI council members.",
    wishes: 0, icon: "👑",
    capabilities: ["Final authority", "Veto power", "Direction setting", "Value alignment"],
  },
];

// Generate constellation connections between non-sovereign members
const connections: [number, number][] = [];
for (let i = 0; i < 6; i++) {
  for (let j = i + 1; j < 6; j++) {
    if (Math.random() > 0.4) connections.push([i, j]);
  }
}

export default function CouncilApp() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedMember = councilMembers.find(m => m.id === selected);

  return (
    <div className="h-full flex" style={{ background: "radial-gradient(ellipse at center, rgba(10,10,30,0.9) 0%, rgba(5,5,15,0.98) 100%)" }}>
      {/* Council visualization */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Ambient particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-0.5 h-0.5 rounded-full bg-white/20"
            animate={{
              x: [Math.random() * 600 - 300, Math.random() * 600 - 300],
              y: [Math.random() * 400 - 200, Math.random() * 400 - 200],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{ left: "50%", top: "50%" }}
          />
        ))}

        <div className="relative w-[340px] h-[340px]">
          {/* Constellation lines via SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Orbital ring */}
            <circle cx="170" cy="170" r="120" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="170" cy="170" r="60" fill="none" stroke="rgba(0,212,255,0.06)" strokeWidth="0.5" />

            {/* Lines from center (Daavud) to all others */}
            {councilMembers.filter(m => m.id !== "daavud").map((member, i) => {
              const angle = (i * 360) / (councilMembers.length - 1) - 90;
              const x = 170 + 120 * Math.cos((angle * Math.PI) / 180);
              const y = 170 + 120 * Math.sin((angle * Math.PI) / 180);
              return (
                <motion.line
                  key={`line-${member.id}`}
                  x1="170" y1="170" x2={x} y2={y}
                  stroke={member.color}
                  strokeWidth="0.5"
                  strokeOpacity="0.15"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                />
              );
            })}

            {/* Constellation connections between outer nodes */}
            {connections.map(([a, b], idx) => {
              const angleA = (a * 360) / (councilMembers.length - 1) - 90;
              const angleB = (b * 360) / (councilMembers.length - 1) - 90;
              const x1 = 170 + 120 * Math.cos((angleA * Math.PI) / 180);
              const y1 = 170 + 120 * Math.sin((angleA * Math.PI) / 180);
              const x2 = 170 + 120 * Math.cos((angleB * Math.PI) / 180);
              const y2 = 170 + 120 * Math.sin((angleB * Math.PI) / 180);
              return (
                <motion.line
                  key={`conn-${idx}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1 + idx * 0.05, duration: 0.5 }}
                />
              );
            })}
          </svg>

          {/* Council member orbs */}
          {councilMembers.map((member, i) => {
            const isSovereign = member.id === "daavud";
            const angle = isSovereign ? 0 : (i * 360) / (councilMembers.length - 1) - 90;
            const radius = isSovereign ? 0 : 120;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);
            const isSelected = selected === member.id;
            const isTimeout = member.status === "Timeout";

            return (
              <motion.button
                key={member.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setSelected(member.id)}
                className="absolute flex flex-col items-center gap-1.5 group"
                style={{
                  left: `calc(50% + ${x}px - ${isSovereign ? 28 : 24}px)`,
                  top: `calc(50% + ${y}px - ${isSovereign ? 28 : 24}px)`,
                }}
              >
                <motion.div
                  animate={{
                    boxShadow: isTimeout
                      ? [`0 0 8px ${member.color}20`, `0 0 12px ${member.color}30`, `0 0 8px ${member.color}20`]
                      : [`0 0 12px ${member.color}40`, `0 0 30px ${member.color}60`, `0 0 12px ${member.color}40`],
                  }}
                  transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.3 }}
                  className={`${isSovereign ? "w-14 h-14" : "w-12 h-12"} rounded-full flex items-center justify-center text-xl transition-all duration-300 ${isSelected ? "ring-2 ring-offset-1 ring-offset-transparent" : ""} ${isTimeout ? "opacity-50" : ""}`}
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${member.color}50, ${member.color}15, transparent)`,
                    borderColor: member.color,
                    border: `1px solid ${member.color}${isSelected ? "80" : "30"}`,
                  }}
                >
                  <span className={isSovereign ? "text-2xl" : "text-lg"}>{member.icon}</span>
                </motion.div>
                <span
                  className={`text-[9px] font-semibold font-[family-name:var(--font-display)] transition-opacity ${isTimeout ? "opacity-40" : ""}`}
                  style={{ color: member.color, textShadow: `0 0 8px ${member.color}40` }}
                >
                  {member.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div className="w-72 glass-heavy p-4 overflow-auto border-l border-white/[0.06]">
        <AnimatePresence mode="wait">
          {selectedMember ? (
            <motion.div
              key={selectedMember.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ boxShadow: [`0 0 10px ${selectedMember.color}30`, `0 0 20px ${selectedMember.color}50`, `0 0 10px ${selectedMember.color}30`] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ background: `radial-gradient(circle, ${selectedMember.color}30, ${selectedMember.color}10)`, border: `1px solid ${selectedMember.color}40` }}
                >
                  {selectedMember.icon}
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold font-[family-name:var(--font-display)]" style={{ color: selectedMember.color }}>
                    {selectedMember.name}
                  </h3>
                  <p className="text-[10px] text-foreground/50">{selectedMember.role}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)]">Status</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full ${selectedMember.status === "Active" ? "bg-green-400" : selectedMember.status === "Timeout" ? "bg-yellow-400" : "bg-white"}`}
                    />
                    <span className="text-xs text-foreground/80">{selectedMember.status}</span>
                    {selectedMember.status === "Timeout" && (
                      <span className="text-[9px] text-yellow-400/60 ml-1">(observing)</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)]">Description</span>
                  <p className="text-xs text-foreground/60 mt-1 leading-relaxed">{selectedMember.description}</p>
                </div>

                {selectedMember.wishes > 0 && (
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)]">Wishes Fulfilled</span>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-lg font-bold font-[family-name:var(--font-mono)]" style={{ color: selectedMember.color }}>
                        {selectedMember.wishes}/{selectedMember.wishes}
                      </p>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: selectedMember.color }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)]">Capabilities</span>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {selectedMember.capabilities.map(cap => (
                      <span
                        key={cap}
                        className="text-[9px] px-2 py-0.5 rounded-full border"
                        style={{ borderColor: `${selectedMember.color}30`, color: `${selectedMember.color}90`, background: `${selectedMember.color}08` }}
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-3xl mb-3"
              >
                🔮
              </motion.div>
              <h3 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/80">AI Council — Pantheon</h3>
              <p className="text-[10px] text-foreground/40 mt-2 leading-relaxed">
                Select a council member to view their role, status, and contributions to the Aluminum OS architecture.
              </p>
              <div className="mt-4 glass rounded-lg p-3 w-full">
                <p className="text-[10px] text-foreground/50 font-[family-name:var(--font-mono)]">
                  Total wishes: 110/110 fulfilled<br />
                  Active agents: 6/7<br />
                  GPT status: On timeout (observing)<br />
                  Power grabs: 0 detected
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {councilMembers.map(m => (
                  <div key={m.id} className="w-2 h-2 rounded-full" style={{ background: m.color, opacity: m.status === "Timeout" ? 0.3 : 0.7 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
