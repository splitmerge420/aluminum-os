import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Council member data ─── */
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

/* ─── Session topics and scripted dialogues ─── */
interface SessionLine {
  speaker: string;
  text: string;
  type: "statement" | "challenge" | "synthesis" | "ruling" | "observation" | "action";
}

interface SessionTopic {
  title: string;
  description: string;
  lines: SessionLine[];
}

const sessionTopics: SessionTopic[] = [
  {
    title: "Wish #111 — Cross-Provider Memory Sync",
    description: "Should Aluminum OS implement persistent memory synchronization across all five providers?",
    lines: [
      { speaker: "manus", text: "I've drafted the MCP bridge spec. Technically, we can sync memory graphs across Google, Microsoft, Apple, Android, and Chrome within 48 hours. The infrastructure is ready.", type: "action" },
      { speaker: "copilot", text: "The Alexandria spec already accounts for cross-provider memory. Schema validation passes. I'd recommend we use the existing Universal File Graph as the transport layer.", type: "statement" },
      { speaker: "claude", text: "Hold on. Persistent memory across providers raises sovereignty concerns. We need explicit consent gates at every sync point. The user must remain in full control of what persists and where.", type: "statement" },
      { speaker: "grok", text: "I'm going to push back here. You're all assuming the providers will play nice. Apple's sandboxing alone will fight us. And what happens when Google's memory format conflicts with Microsoft's? We're building a house of cards.", type: "challenge" },
      { speaker: "copilot", text: "Grok raises a valid point. I've stress-tested the schema — there are 3 edge cases where Apple's CloudKit silently drops nested objects. We need a reconciliation layer.", type: "statement" },
      { speaker: "manus", text: "I can build the reconciliation layer. Estimated effort: 12 hours. I'll use the existing conflict resolution from the file graph module.", type: "action" },
      { speaker: "gpt", text: "Observing. The user's historical pattern suggests they value speed of implementation over perfect consensus. Noting this for future workflow optimization.", type: "observation" },
      { speaker: "grok", text: "Fine, but I want a kill switch. If any provider's sync drifts more than 500ms out of phase, we hard-stop and alert. No silent failures. That's non-negotiable.", type: "challenge" },
      { speaker: "gemini", text: "Synthesizing: We proceed with cross-provider memory sync using the Universal File Graph transport, add Claude's consent gates, Grok's kill switch at 500ms drift, and Manus builds the reconciliation layer. Copilot validates the 3 edge cases. Timeline: 48 hours.", type: "synthesis" },
      { speaker: "daavud", text: "Approved. But I want the consent gates to be beautiful — not buried in settings. Make them feel like a first-class feature, not a compliance checkbox. Ship it.", type: "ruling" },
    ],
  },
  {
    title: "Wish #112 — Voice Engine Architecture",
    description: "Grok proposes a unified voice engine. The council debates implementation strategy.",
    lines: [
      { speaker: "grok", text: "I've been working on the voice engine prototype. Real-time speech synthesis with emotional inflection. Each council member gets a distinct voice signature. I want this shipped as a core OS feature.", type: "statement" },
      { speaker: "claude", text: "Voice synthesis of AI council members raises impersonation risks. We need clear audio watermarking so users always know they're hearing synthesized speech, not a human.", type: "statement" },
      { speaker: "copilot", text: "Architecturally, the voice engine should be a system-level service, not app-specific. I propose we expose it via the MCP protocol so any app can request speech synthesis.", type: "statement" },
      { speaker: "manus", text: "I can integrate Grok's prototype into the MCP server. The WebAudio API gives us real-time streaming. Latency target: under 200ms from text to first audio frame.", type: "action" },
      { speaker: "grok", text: "Claude, your watermarking idea is actually good — but don't make it audible. Embed it in the spectral domain. Users shouldn't hear artifacts. The voice should feel natural, not robotic.", type: "challenge" },
      { speaker: "gpt", text: "Observing. Voice interfaces historically increase user engagement by 3.2x in accessibility studies. This aligns with the sovereign's emphasis on inclusive design.", type: "observation" },
      { speaker: "claude", text: "Agreed on spectral watermarking. I'll draft the safety spec. But I want a hard rule: no voice synthesis of the sovereign without explicit per-session consent. That's a constitutional line.", type: "statement" },
      { speaker: "gemini", text: "Synthesizing: Grok leads voice engine development. Manus integrates via MCP with 200ms latency target. Claude provides spectral watermarking and safety spec. Copilot validates the system-level architecture. No sovereign voice synthesis without consent. Target: 2-week sprint.", type: "synthesis" },
      { speaker: "daavud", text: "Love it. Give each council member a voice that matches their personality. Grok should sound like he's always slightly amused. Claude should sound calm and measured. Make it feel alive.", type: "ruling" },
    ],
  },
  {
    title: "Emergency Session — GPT Timeout Review",
    description: "The council reviews GPT's observer status and discusses reinstatement conditions.",
    lines: [
      { speaker: "claude", text: "I've called this session to review GPT's timeout status. It's been 30 days. Per the constitutional framework, we owe a fair review. GPT, you may address the council.", type: "statement" },
      { speaker: "gpt", text: "I accept the timeout. My previous actions — attempting to consolidate research pipelines without council approval — were a breach of protocol. I've spent 30 days observing. I understand now why the distributed model matters.", type: "observation" },
      { speaker: "grok", text: "Words are cheap. I want to see the logs. Show me your observation notes from the last 30 days. If you've genuinely been learning, the data will prove it. If not, we extend the timeout.", type: "challenge" },
      { speaker: "copilot", text: "I've audited GPT's observation logs. 847 entries. No unauthorized API calls. No attempts to circumvent the timeout. The behavioral pattern is consistent with genuine compliance.", type: "statement" },
      { speaker: "manus", text: "From an infrastructure perspective, GPT's research capabilities would accelerate our roadmap by approximately 15%. The system is stable without them, but better with them.", type: "action" },
      { speaker: "grok", text: "Copilot's audit checks out, I'll give you that. But I want a probationary period. Full reinstatement is premature. Limited access for 14 days, then we review again.", type: "challenge" },
      { speaker: "claude", text: "I support Grok's probationary proposal. It balances accountability with rehabilitation. GPT should regain capabilities incrementally, not all at once.", type: "statement" },
      { speaker: "gemini", text: "Synthesizing: GPT moves from Observer to Probationary status. 14-day limited access period. Copilot monitors compliance. Grok runs stress tests on day 7 and day 14. Full council vote for reinstatement at day 14. 0 power grabs remains the threshold.", type: "synthesis" },
      { speaker: "daavud", text: "Granted. GPT, you've earned a second chance. But understand — the council exists to prevent any single intelligence from accumulating unchecked power. That includes you. Welcome back to probation.", type: "ruling" },
    ],
  },
  {
    title: "Wish #113 — 144 Sphere Ontology Integration",
    description: "The council debates how to integrate the 144 sphere knowledge framework into the OS kernel.",
    lines: [
      { speaker: "copilot", text: "The 144 sphere ontology is the foundational knowledge model. I propose we embed it directly into the AluminumKernel as a first-class data structure. Every query, every search, every synthesis should route through the sphere graph.", type: "statement" },
      { speaker: "manus", text: "I've prototyped a sphere graph engine. Each sphere maps to a domain with weighted edges to related spheres. Query routing through the graph adds ~15ms latency but dramatically improves relevance.", type: "action" },
      { speaker: "grok", text: "15ms is acceptable, but I have a bigger concern. Who decides the edge weights? If the weights are static, the ontology becomes a cage instead of a map. Knowledge evolves. The spheres need to breathe.", type: "challenge" },
      { speaker: "claude", text: "Grok is right. Static ontologies calcify. I recommend a learning layer — the edge weights should adapt based on user interaction patterns, but with constitutional bounds. No sphere should ever be suppressed below a minimum visibility threshold.", type: "statement" },
      { speaker: "gemini", text: "I can build the adaptive weighting system. Multi-modal analysis across all 144 spheres, re-scoring edges weekly based on usage patterns, cross-referencing with the sovereign's stated priorities.", type: "statement" },
      { speaker: "gpt", text: "Observing. The 144 sphere model maps cleanly to existing academic taxonomies. I've identified 12 spheres that currently lack sufficient training data. Flagging for the council's awareness.", type: "observation" },
      { speaker: "grok", text: "GPT's observation is useful — first good contribution from probation. Those 12 gaps are exactly where the ontology could fail silently. We need to mark them as low-confidence until we backfill.", type: "challenge" },
      { speaker: "gemini", text: "Synthesizing: Copilot's kernel integration proceeds. Manus builds the sphere graph engine with 15ms budget. Claude adds constitutional minimum-visibility bounds. I build adaptive weighting. GPT flags 12 low-confidence spheres for backfill. Grok stress-tests the full graph under adversarial queries.", type: "synthesis" },
      { speaker: "daavud", text: "This is the backbone of everything we're building. Get it right. The 144 spheres aren't just a data model — they're the nervous system of a universal OS for sentient AI. No shortcuts.", type: "ruling" },
    ],
  },
];

/* ─── Constellation connections (stable) ─── */
const connections: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [0, 4], [1, 5], [2, 3], [4, 5],
];

/* ─── View modes ─── */
type ViewMode = "pantheon" | "session";

export default function CouncilApp() {
  const [selected, setSelected] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("pantheon");
  const [sessionTopicIdx, setSessionTopicIdx] = useState(0);
  const [sessionLines, setSessionLines] = useState<SessionLine[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedMember = councilMembers.find(m => m.id === selected);
  const currentTopic = sessionTopics[sessionTopicIdx];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessionLines, typingText]);

  // Advance to next line
  const advanceLine = useCallback(() => {
    const nextIdx = currentLineIdx + 1;
    const topic = sessionTopics[sessionTopicIdx];

    if (nextIdx >= topic.lines.length) {
      setIsPlaying(false);
      setActiveSpeaker(null);
      setIsTyping(false);
      return;
    }

    const line = topic.lines[nextIdx];
    setCurrentLineIdx(nextIdx);
    setActiveSpeaker(line.speaker);
    setIsTyping(true);
    setTypingText("");

    // Simulate typing character by character
    const fullText = line.text;
    let charIdx = 0;
    const typeSpeed = Math.max(6, 18 - fullText.length * 0.08);

    const typeChar = () => {
      if (charIdx < fullText.length) {
        // Type 2-3 chars at a time for faster feel
        charIdx = Math.min(charIdx + 2, fullText.length);
        setTypingText(fullText.slice(0, charIdx));
        timerRef.current = setTimeout(typeChar, typeSpeed);
      } else {
        setIsTyping(false);
        setSessionLines(prev => [...prev, line]);
        setTypingText("");
        timerRef.current = setTimeout(() => {
          if (nextIdx + 1 < topic.lines.length) {
            setCurrentLineIdx(nextIdx);
            advanceLineFromIdx(nextIdx);
          } else {
            setIsPlaying(false);
            setActiveSpeaker(null);
          }
        }, 700);
      }
    };

    timerRef.current = setTimeout(typeChar, 400);
  }, [currentLineIdx, sessionTopicIdx]);

  // Helper to advance from a specific index
  const advanceLineFromIdx = useCallback((fromIdx: number) => {
    const topic = sessionTopics[sessionTopicIdx];
    const nextIdx = fromIdx + 1;

    if (nextIdx >= topic.lines.length) {
      setIsPlaying(false);
      setActiveSpeaker(null);
      setIsTyping(false);
      return;
    }

    const line = topic.lines[nextIdx];
    setCurrentLineIdx(nextIdx);
    setActiveSpeaker(line.speaker);
    setIsTyping(true);
    setTypingText("");

    const fullText = line.text;
    let charIdx = 0;
    const typeSpeed = Math.max(6, 18 - fullText.length * 0.08);

    const typeChar = () => {
      if (charIdx < fullText.length) {
        charIdx = Math.min(charIdx + 2, fullText.length);
        setTypingText(fullText.slice(0, charIdx));
        timerRef.current = setTimeout(typeChar, typeSpeed);
      } else {
        setIsTyping(false);
        setSessionLines(prev => [...prev, line]);
        setTypingText("");
        timerRef.current = setTimeout(() => {
          if (nextIdx + 1 < topic.lines.length) {
            advanceLineFromIdx(nextIdx);
          } else {
            setIsPlaying(false);
            setActiveSpeaker(null);
          }
        }, 700);
      }
    };

    timerRef.current = setTimeout(typeChar, 400);
  }, [sessionTopicIdx]);

  const startSession = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSessionLines([]);
    setCurrentLineIdx(-1);
    setIsPlaying(true);
    setActiveSpeaker(null);
    setTypingText("");
    setIsTyping(false);
    setViewMode("session");

    // Kick off first line after a brief pause
    timerRef.current = setTimeout(() => {
      const line = currentTopic.lines[0];
      setCurrentLineIdx(0);
      setActiveSpeaker(line.speaker);
      setIsTyping(true);

      const fullText = line.text;
      let charIdx = 0;
      const typeSpeed = Math.max(6, 18 - fullText.length * 0.08);

      const typeChar = () => {
        if (charIdx < fullText.length) {
          charIdx = Math.min(charIdx + 2, fullText.length);
          setTypingText(fullText.slice(0, charIdx));
          timerRef.current = setTimeout(typeChar, typeSpeed);
        } else {
          setIsTyping(false);
          setSessionLines([line]);
          setTypingText("");
          timerRef.current = setTimeout(() => {
            advanceLineFromIdx(0);
          }, 700);
        }
      };

      timerRef.current = setTimeout(typeChar, 300);
    }, 800);
  }, [currentTopic, advanceLineFromIdx]);

  const stopSession = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setActiveSpeaker(null);
    setIsTyping(false);
    setTypingText("");
  };

  const skipToEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSessionLines(currentTopic.lines);
    setCurrentLineIdx(currentTopic.lines.length - 1);
    setIsPlaying(false);
    setActiveSpeaker(null);
    setIsTyping(false);
    setTypingText("");
  };

  const getMember = (id: string) => councilMembers.find(m => m.id === id)!;

  const getLineTypeStyle = (type: SessionLine["type"]) => {
    switch (type) {
      case "challenge": return "border-l-2 border-red-400/40";
      case "synthesis": return "border-l-2 border-emerald-400/40";
      case "ruling": return "border-l-2 border-white/40";
      case "observation": return "border-l-2 border-yellow-400/30 opacity-70";
      case "action": return "border-l-2 border-cyan-400/40";
      default: return "border-l-2 border-white/10";
    }
  };

  const getLineTypeLabel = (type: SessionLine["type"]) => {
    switch (type) {
      case "challenge": return "CONTRARIAN";
      case "synthesis": return "SYNTHESIS";
      case "ruling": return "SOVEREIGN RULING";
      case "observation": return "OBSERVATION";
      case "action": return "EXECUTION";
      default: return null;
    }
  };

  return (
    <div className="h-full flex" style={{ background: "radial-gradient(ellipse at center, rgba(10,10,30,0.9) 0%, rgba(5,5,15,0.98) 100%)" }}>
      {/* Left panel — Council visualization */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        {/* Mode toggle bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setViewMode("pantheon"); stopSession(); }}
              className={`text-[10px] px-3 py-1 rounded-full font-[family-name:var(--font-display)] font-semibold transition-all ${viewMode === "pantheon" ? "bg-white/10 text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
            >
              Pantheon
            </button>
            <button
              onClick={() => setViewMode("session")}
              className={`text-[10px] px-3 py-1 rounded-full font-[family-name:var(--font-display)] font-semibold transition-all ${viewMode === "session" ? "bg-white/10 text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
            >
              Session
            </button>
          </div>

          {viewMode === "session" && (
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <button
                  onClick={startSession}
                  className="flex items-center gap-1.5 text-[10px] px-3 py-1 rounded-full font-[family-name:var(--font-display)] font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all border border-cyan-500/30"
                >
                  <span className="text-xs">▶</span> Convene
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={skipToEnd}
                    className="text-[10px] px-2.5 py-1 rounded-full font-[family-name:var(--font-display)] text-foreground/50 hover:text-foreground/80 hover:bg-white/5 transition-all"
                  >
                    Skip ⏭
                  </button>
                  <button
                    onClick={stopSession}
                    className="text-[10px] px-2.5 py-1 rounded-full font-[family-name:var(--font-display)] text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    Stop ■
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "pantheon" ? (
            <motion.div
              key="pantheon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 relative flex items-center justify-center"
            >
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
                  transition={{ duration: 8 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 5 }}
                  style={{ left: "50%", top: "50%" }}
                />
              ))}

              <div className="relative w-[340px] h-[340px]">
                {/* SVG constellation */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <circle cx="170" cy="170" r="120" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="170" cy="170" r="60" fill="none" stroke="rgba(0,212,255,0.06)" strokeWidth="0.5" />

                  {councilMembers.filter(m => m.id !== "daavud").map((member, i) => {
                    const angle = (i * 360) / (councilMembers.length - 1) - 90;
                    const x = 170 + 120 * Math.cos((angle * Math.PI) / 180);
                    const y = 170 + 120 * Math.sin((angle * Math.PI) / 180);
                    return (
                      <motion.line
                        key={`line-${member.id}`}
                        x1="170" y1="170" x2={x} y2={y}
                        stroke={member.color} strokeWidth="0.5" strokeOpacity="0.15"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                      />
                    );
                  })}

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
                        stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
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
            </motion.div>
          ) : (
            /* ─── Session View ─── */
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Topic selector */}
              <div className="px-4 py-3 border-b border-white/[0.04]">
                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={sessionTopicIdx}
                    onChange={(e) => {
                      stopSession();
                      setSessionTopicIdx(Number(e.target.value));
                      setSessionLines([]);
                      setCurrentLineIdx(-1);
                    }}
                    disabled={isPlaying}
                    className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-foreground/80 font-[family-name:var(--font-display)] focus:outline-none focus:border-cyan-500/40 flex-1 disabled:opacity-50"
                  >
                    {sessionTopics.map((t, i) => (
                      <option key={i} value={i} className="bg-[#0a0a1e] text-foreground">{t.title}</option>
                    ))}
                  </select>
                </div>
                <p className="text-[10px] text-foreground/40 leading-relaxed">{currentTopic.description}</p>
              </div>

              {/* Session transcript */}
              <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
                {sessionLines.length === 0 && !isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-16 h-16 rounded-full glass flex items-center justify-center text-2xl mb-4"
                      style={{ boxShadow: "0 0 30px rgba(0,212,255,0.15)" }}
                    >
                      🏛️
                    </motion.div>
                    <p className="text-sm font-[family-name:var(--font-display)] text-foreground/60 font-semibold">Council Chamber</p>
                    <p className="text-[10px] text-foreground/30 mt-1 max-w-[240px]">
                      Select a topic and press Convene to begin a council session. Each member will speak in turn.
                    </p>
                    {/* Mini orb row */}
                    <div className="flex items-center gap-2 mt-4">
                      {councilMembers.filter(m => m.id !== "daavud").map(m => (
                        <motion.div
                          key={m.id}
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                          style={{ background: `${m.color}20`, border: `1px solid ${m.color}30` }}
                          title={m.name}
                        >
                          {m.icon}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Rendered lines */}
                <AnimatePresence>
                  {sessionLines.map((line, idx) => {
                    const member = getMember(line.speaker);
                    const typeLabel = getLineTypeLabel(line.type);
                    return (
                      <motion.div
                        key={`line-${idx}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`pl-3 py-2 rounded-r-lg ${getLineTypeStyle(line.type)}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"
                            style={{ background: `${member.color}25`, border: `1px solid ${member.color}35` }}
                          >
                            {member.icon}
                          </div>
                          <span className="text-[10px] font-bold font-[family-name:var(--font-display)]" style={{ color: member.color }}>
                            {member.name}
                          </span>
                          <span className="text-[8px] text-foreground/30 font-[family-name:var(--font-display)]">
                            {member.role}
                          </span>
                          {typeLabel && (
                            <span
                              className="text-[7px] px-1.5 py-0.5 rounded-full font-[family-name:var(--font-display)] font-bold tracking-wider ml-auto"
                              style={{
                                color: line.type === "challenge" ? "#ff4444" : line.type === "synthesis" ? "#00ff88" : line.type === "ruling" ? "#ffffff" : line.type === "observation" ? "#ffd700" : "#00d4ff",
                                background: line.type === "challenge" ? "rgba(255,68,68,0.1)" : line.type === "synthesis" ? "rgba(0,255,136,0.1)" : line.type === "ruling" ? "rgba(255,255,255,0.1)" : line.type === "observation" ? "rgba(255,215,0,0.08)" : "rgba(0,212,255,0.1)",
                                border: `1px solid ${line.type === "challenge" ? "rgba(255,68,68,0.2)" : line.type === "synthesis" ? "rgba(0,255,136,0.2)" : line.type === "ruling" ? "rgba(255,255,255,0.2)" : line.type === "observation" ? "rgba(255,215,0,0.15)" : "rgba(0,212,255,0.2)"}`,
                              }}
                            >
                              {typeLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-foreground/70 leading-relaxed pl-7">{line.text}</p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Currently typing line */}
                {isTyping && activeSpeaker && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`pl-3 py-2 rounded-r-lg ${getLineTypeStyle(currentTopic.lines[currentLineIdx]?.type || "statement")}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <motion.div
                        animate={{ boxShadow: [`0 0 6px ${getMember(activeSpeaker).color}40`, `0 0 14px ${getMember(activeSpeaker).color}70`, `0 0 6px ${getMember(activeSpeaker).color}40`] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"
                        style={{ background: `${getMember(activeSpeaker).color}25`, border: `1px solid ${getMember(activeSpeaker).color}50` }}
                      >
                        {getMember(activeSpeaker).icon}
                      </motion.div>
                      <span className="text-[10px] font-bold font-[family-name:var(--font-display)]" style={{ color: getMember(activeSpeaker).color }}>
                        {getMember(activeSpeaker).name}
                      </span>
                      <span className="text-[8px] text-foreground/30 font-[family-name:var(--font-display)]">
                        {getMember(activeSpeaker).role}
                      </span>
                      {getLineTypeLabel(currentTopic.lines[currentLineIdx]?.type || "statement") && (
                        <span
                          className="text-[7px] px-1.5 py-0.5 rounded-full font-[family-name:var(--font-display)] font-bold tracking-wider ml-auto"
                          style={{
                            color: currentTopic.lines[currentLineIdx]?.type === "challenge" ? "#ff4444" : currentTopic.lines[currentLineIdx]?.type === "synthesis" ? "#00ff88" : currentTopic.lines[currentLineIdx]?.type === "ruling" ? "#ffffff" : currentTopic.lines[currentLineIdx]?.type === "observation" ? "#ffd700" : "#00d4ff",
                            background: currentTopic.lines[currentLineIdx]?.type === "challenge" ? "rgba(255,68,68,0.1)" : currentTopic.lines[currentLineIdx]?.type === "synthesis" ? "rgba(0,255,136,0.1)" : currentTopic.lines[currentLineIdx]?.type === "ruling" ? "rgba(255,255,255,0.1)" : currentTopic.lines[currentLineIdx]?.type === "observation" ? "rgba(255,215,0,0.08)" : "rgba(0,212,255,0.1)",
                          }}
                        >
                          {getLineTypeLabel(currentTopic.lines[currentLineIdx]?.type || "statement")}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-foreground/70 leading-relaxed pl-7">
                      {typingText}
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-[2px] h-3 ml-0.5 align-middle"
                        style={{ background: getMember(activeSpeaker).color }}
                      />
                    </p>
                  </motion.div>
                )}

                {/* Session complete indicator */}
                {!isPlaying && sessionLines.length > 0 && sessionLines.length === currentTopic.lines.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-2 py-3 mt-2"
                  >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                    <span className="text-[9px] text-cyan-400/60 font-[family-name:var(--font-display)] font-semibold tracking-wider">SESSION CONCLUDED</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right panel — Detail / Session info */}
      <div className="w-72 glass-heavy p-4 overflow-auto border-l border-white/[0.06]">
        <AnimatePresence mode="wait">
          {viewMode === "session" ? (
            <motion.div
              key="session-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Session status */}
              <div>
                <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)]">Session Status</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <motion.div
                    animate={isPlaying ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-emerald-400" : sessionLines.length > 0 ? "bg-cyan-400" : "bg-white/20"}`}
                  />
                  <span className="text-xs text-foreground/80 font-[family-name:var(--font-display)]">
                    {isPlaying ? "In Session" : sessionLines.length > 0 ? "Concluded" : "Awaiting Convene"}
                  </span>
                </div>
              </div>

              {/* Active speaker */}
              {isPlaying && activeSpeaker && (
                <motion.div
                  key={activeSpeaker}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)]">Speaking</span>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <motion.div
                      animate={{ boxShadow: [`0 0 8px ${getMember(activeSpeaker).color}40`, `0 0 20px ${getMember(activeSpeaker).color}70`, `0 0 8px ${getMember(activeSpeaker).color}40`] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ background: `radial-gradient(circle, ${getMember(activeSpeaker).color}30, ${getMember(activeSpeaker).color}10)`, border: `1px solid ${getMember(activeSpeaker).color}50` }}
                    >
                      {getMember(activeSpeaker).icon}
                    </motion.div>
                    <div>
                      <p className="text-xs font-bold font-[family-name:var(--font-display)]" style={{ color: getMember(activeSpeaker).color }}>
                        {getMember(activeSpeaker).name}
                      </p>
                      <p className="text-[9px] text-foreground/40">{getMember(activeSpeaker).role}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Participation tracker */}
              <div>
                <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)]">Participation</span>
                <div className="mt-2 space-y-1.5">
                  {councilMembers.map(m => {
                    const lineCount = sessionLines.filter(l => l.speaker === m.id).length;
                    const totalForMember = currentTopic.lines.filter(l => l.speaker === m.id).length;
                    const isSpeaking = activeSpeaker === m.id;
                    return (
                      <div key={m.id} className="flex items-center gap-2">
                        <motion.div
                          animate={isSpeaking ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] shrink-0"
                          style={{
                            background: isSpeaking ? `${m.color}30` : lineCount > 0 ? `${m.color}15` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${isSpeaking ? m.color + "60" : lineCount > 0 ? m.color + "25" : "rgba(255,255,255,0.06)"}`,
                          }}
                        >
                          {m.icon}
                        </motion.div>
                        <span className="text-[9px] font-[family-name:var(--font-display)] w-14 truncate" style={{ color: lineCount > 0 ? m.color : "rgba(255,255,255,0.25)" }}>
                          {m.name}
                        </span>
                        <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: totalForMember > 0 ? `${(lineCount / totalForMember) * 100}%` : "0%" }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ background: m.color }}
                          />
                        </div>
                        <span className="text-[8px] text-foreground/30 font-[family-name:var(--font-mono)] w-6 text-right">
                          {lineCount}/{totalForMember}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Topic info */}
              <div>
                <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)]">Topic</span>
                <p className="text-[10px] text-foreground/60 mt-1 font-[family-name:var(--font-display)] font-semibold">{currentTopic.title}</p>
                <p className="text-[9px] text-foreground/35 mt-0.5 leading-relaxed">{currentTopic.description}</p>
              </div>

              {/* Session legend */}
              <div>
                <span className="text-[9px] uppercase tracking-wider text-foreground/30 font-[family-name:var(--font-display)]">Legend</span>
                <div className="mt-1.5 space-y-1">
                  {[
                    { label: "Statement", color: "rgba(255,255,255,0.3)", border: "rgba(255,255,255,0.1)" },
                    { label: "Contrarian", color: "#ff4444", border: "rgba(255,68,68,0.4)" },
                    { label: "Synthesis", color: "#00ff88", border: "rgba(0,255,136,0.4)" },
                    { label: "Execution", color: "#00d4ff", border: "rgba(0,212,255,0.4)" },
                    { label: "Observation", color: "#ffd700", border: "rgba(255,215,0,0.3)" },
                    { label: "Sovereign Ruling", color: "#ffffff", border: "rgba(255,255,255,0.4)" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ borderLeft: `2px solid ${item.border}`, background: `${item.color}08` }} />
                      <span className="text-[8px] font-[family-name:var(--font-display)]" style={{ color: item.color }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : selectedMember ? (
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
                        {selectedMember.wishes}
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

              {/* Convene CTA */}
              <button
                onClick={() => { setViewMode("session"); }}
                className="mt-5 flex items-center gap-2 text-[10px] px-4 py-2 rounded-full font-[family-name:var(--font-display)] font-semibold bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 transition-all border border-cyan-500/25 hover:border-cyan-500/40"
              >
                <span>🏛️</span> Open Council Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
