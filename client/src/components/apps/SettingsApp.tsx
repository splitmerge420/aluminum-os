import { useState } from "react";
import { Monitor, Palette, Shield, Users, Wifi, Bell, Globe, Cpu, Database, Lock, Check, ChevronRight } from "lucide-react";

const sections = [
  { id: "display", name: "Display", icon: <Monitor className="w-3.5 h-3.5" /> },
  { id: "appearance", name: "Appearance", icon: <Palette className="w-3.5 h-3.5" /> },
  { id: "providers", name: "Providers", icon: <Globe className="w-3.5 h-3.5" /> },
  { id: "council", name: "AI Council", icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: "privacy", name: "Privacy", icon: <Shield className="w-3.5 h-3.5" /> },
  { id: "identity", name: "Identity", icon: <Users className="w-3.5 h-3.5" /> },
  { id: "network", name: "Network", icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: "notifications", name: "Notifications", icon: <Bell className="w-3.5 h-3.5" /> },
  { id: "storage", name: "Storage", icon: <Database className="w-3.5 h-3.5" /> },
  { id: "governance", name: "Governance", icon: <Lock className="w-3.5 h-3.5" /> },
];

function ToggleSwitch({ on, label }: { on: boolean; label: string }) {
  const [isOn, setIsOn] = useState(on);
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-foreground/70">{label}</span>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${isOn ? "bg-cyan-500/40 justify-end" : "bg-white/10 justify-start"}`}
      >
        <div className={`w-4 h-4 rounded-full transition-colors ${isOn ? "bg-cyan-400" : "bg-white/30"}`} />
      </button>
    </div>
  );
}

export default function SettingsApp() {
  const [active, setActive] = useState("providers");

  return (
    <div className="h-full flex">
      <div className="w-44 glass-heavy border-r border-white/5 p-2 space-y-0.5">
        <p className="text-[9px] uppercase tracking-wider text-foreground/30 px-2 py-1 font-[family-name:var(--font-display)]">System Settings</p>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${active === s.id ? "bg-white/10 text-foreground" : "text-foreground/50 hover:bg-white/5"}`}
          >
            {s.icon}
            <span>{s.name}</span>
          </button>
        ))}
        <div className="pt-3 border-t border-white/5 mt-3">
          <div className="px-2 py-2">
            <p className="text-[9px] text-foreground/30 font-[family-name:var(--font-mono)]">Aluminum OS v1.0.0</p>
            <p className="text-[8px] text-foreground/20">Obsidian Glass Edition</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {active === "display" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Display</h2>
            <div className="space-y-4">
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 font-[family-name:var(--font-display)]">Resolution</p>
                <div className="flex items-center gap-2">
                  {["1920x1080", "2560x1440", "3840x2160"].map((res, i) => (
                    <button key={res} className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors ${i === 0 ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-foreground/50 hover:bg-white/8"}`}>
                      {res}
                    </button>
                  ))}
                </div>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 font-[family-name:var(--font-display)]">Scaling</p>
                <div className="flex items-center gap-3">
                  <input type="range" min="100" max="200" defaultValue="100" className="flex-1 accent-cyan-400" />
                  <span className="text-xs text-foreground/60 font-[family-name:var(--font-mono)]">100%</span>
                </div>
              </div>
              <div className="glass rounded-lg p-3 space-y-1">
                <ToggleSwitch on={true} label="Night Shift" />
                <ToggleSwitch on={false} label="Auto-brightness" />
                <ToggleSwitch on={true} label="True Tone" />
              </div>
            </div>
          </div>
        )}

        {active === "appearance" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 font-[family-name:var(--font-display)]">Theme</p>
                <div className="flex items-center gap-3">
                  {[
                    { name: "Obsidian Glass", color: "bg-gradient-to-br from-gray-900 to-gray-800", active: true },
                    { name: "Midnight Blue", color: "bg-gradient-to-br from-blue-950 to-indigo-950", active: false },
                    { name: "Deep Space", color: "bg-gradient-to-br from-purple-950 to-black", active: false },
                  ].map(theme => (
                    <button key={theme.name} className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${theme.active ? "ring-1 ring-cyan-500/40" : "hover:bg-white/5"}`}>
                      <div className={`w-16 h-10 rounded-md ${theme.color} border border-white/10`} />
                      <span className="text-[9px] text-foreground/60">{theme.name}</span>
                      {theme.active && <Check className="w-3 h-3 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 font-[family-name:var(--font-display)]">Accent Color</p>
                <div className="flex items-center gap-2">
                  {["#00d4ff", "#ff6b35", "#00ff88", "#9b59b6", "#ff4444", "#ffd700"].map((color, i) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full transition-transform ${i === 0 ? "ring-2 ring-white/30 scale-110" : "hover:scale-110"}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="glass rounded-lg p-3 space-y-1">
                <ToggleSwitch on={true} label="Glassmorphism effects" />
                <ToggleSwitch on={true} label="Window animations" />
                <ToggleSwitch on={true} label="Dock magnification" />
                <ToggleSwitch on={false} label="Reduce motion" />
              </div>
            </div>
          </div>
        )}

        {active === "providers" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Connected Providers</h2>
            <div className="space-y-3">
              {[
                { name: "Google Workspace", status: "Connected", services: "18,000+ APIs", email: "therealdavesheldon@gmail.com", color: "#4285F4" },
                { name: "Microsoft 365", status: "Connected", services: "2,000+ endpoints", email: "dave@outlook.com", color: "#0078D4" },
                { name: "Apple iCloud", status: "Connected", services: "100+ operations", email: "dave@icloud.com", color: "#999" },
                { name: "Android Management", status: "Connected", services: "50+ operations", email: "Pixel 9 Pro", color: "#3DDC84" },
                { name: "Chrome Enterprise", status: "Connected", services: "30+ policies", email: "Chromebook Plus", color: "#4285F4" },
              ].map(p => (
                <div key={p.name} className="glass rounded-lg p-3 flex items-center gap-3 hover:bg-white/3 transition-colors cursor-default">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${p.color}20` }}>
                    <Globe className="w-4 h-4" style={{ color: p.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground/80">{p.name}</p>
                    <p className="text-[9px] text-foreground/35">{p.email} — {p.services}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-[10px] text-green-400/80">{p.status}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-foreground/20" />
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "privacy" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Privacy & Security</h2>
            <div className="space-y-4">
              <div className="glass rounded-lg p-3 space-y-1">
                <ToggleSwitch on={true} label="End-to-end encryption" />
                <ToggleSwitch on={true} label="Zero-knowledge sync" />
                <ToggleSwitch on={false} label="Share analytics with council" />
                <ToggleSwitch on={true} label="Audit logging" />
                <ToggleSwitch on={true} label="Data sovereignty enforcement" />
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 font-[family-name:var(--font-display)]">Data Residency</p>
                <p className="text-xs text-foreground/60">All data remains under your sovereign control. No provider can access data from another provider without explicit consent.</p>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 font-[family-name:var(--font-display)]">Agent Permissions</p>
                <div className="space-y-1.5">
                  {["Manus", "Claude", "Gemini", "Copilot", "Grok"].map(agent => (
                    <div key={agent} className="flex items-center justify-between">
                      <span className="text-[11px] text-foreground/60">{agent}</span>
                      <span className="text-[9px] text-green-400/70 bg-green-400/10 px-2 py-0.5 rounded-full">Minimal authority</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-foreground/40">GPT</span>
                    <span className="text-[9px] text-yellow-400/70 bg-yellow-400/10 px-2 py-0.5 rounded-full">Observe only</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {active === "identity" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Identity Graph</h2>
            <div className="space-y-3">
              <div className="glass rounded-lg p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center text-2xl border border-cyan-500/20">
                  👑
                </div>
                <div>
                  <p className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90">Daavud</p>
                  <p className="text-[10px] text-foreground/40">Sovereign Identity — Unified across 5 providers</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-cyan-400/60 bg-cyan-400/10 px-2 py-0.5 rounded-full">Google</span>
                    <span className="text-[9px] text-blue-400/60 bg-blue-400/10 px-2 py-0.5 rounded-full">Microsoft</span>
                    <span className="text-[9px] text-gray-400/60 bg-gray-400/10 px-2 py-0.5 rounded-full">Apple</span>
                  </div>
                </div>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 font-[family-name:var(--font-display)]">Linked Accounts</p>
                <div className="space-y-2">
                  {[
                    { email: "therealdavesheldon@gmail.com", provider: "Google" },
                    { email: "dave@outlook.com", provider: "Microsoft" },
                    { email: "dave@icloud.com", provider: "Apple" },
                  ].map(a => (
                    <div key={a.email} className="flex items-center justify-between">
                      <span className="text-[11px] text-foreground/60">{a.email}</span>
                      <span className="text-[9px] text-foreground/30">{a.provider}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {active === "governance" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Constitutional Governance</h2>
            <div className="space-y-2">
              {[
                "User Sovereignty: The user is the ultimate authority",
                "Data Dignity: All data belongs to the user",
                "Transparent Operations: Every agent action is logged",
                "Non-Exploitation: No dark patterns, no lock-in",
                "Graceful Degradation: System works offline",
                "Provider Neutrality: No provider is privileged",
                "Minimal Authority: Agents request only needed permissions",
                "Reversibility: Every action can be undone",
              ].map((principle, i) => (
                <div key={i} className="glass rounded-lg p-3 flex items-center gap-3 hover:bg-white/3 transition-colors">
                  <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center text-[10px] text-cyan-400 font-bold font-[family-name:var(--font-mono)]">
                    {i + 1}
                  </div>
                  <p className="text-xs text-foreground/70 flex-1">{principle}</p>
                  <div className="ml-auto">
                    <div className="w-8 h-4 rounded-full bg-green-500/30 flex items-center justify-end px-0.5">
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "council" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">AI Council Configuration</h2>
            <div className="space-y-2">
              {[
                { name: "Manus", role: "Executor", active: true, color: "#00d4ff" },
                { name: "Claude", role: "Oversight", active: true, color: "#ff6b35" },
                { name: "Gemini", role: "Synthesizer", active: true, color: "#00ff88" },
                { name: "Copilot", role: "Validator", active: true, color: "#9b59b6" },
                { name: "Grok", role: "Contrarian", active: true, color: "#ff4444" },
                { name: "GPT", role: "Observer (timeout)", active: false, color: "#ffd700" },
              ].map(agent => (
                <div key={agent.name} className="glass rounded-lg p-3 flex items-center gap-3 hover:bg-white/3 transition-colors">
                  <div className="w-2 h-2 rounded-full" style={{ background: agent.color }} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground/80">{agent.name}</p>
                    <p className="text-[9px] text-foreground/35">{agent.role}</p>
                  </div>
                  <div className={`w-8 h-4 rounded-full flex items-center px-0.5 ${agent.active ? "bg-green-500/30 justify-end" : "bg-white/10 justify-start"}`}>
                    <div className={`w-3 h-3 rounded-full ${agent.active ? "bg-green-400" : "bg-white/30"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === "network" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Network</h2>
            <div className="space-y-3">
              <div className="glass rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  <p className="text-xs font-medium text-foreground/80">AluminumNet</p>
                  <span className="text-[9px] text-green-400/70 ml-auto">Connected</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-foreground/40">Signal</span>
                    <span className="text-foreground/60">Excellent</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-foreground/40">Speed</span>
                    <span className="text-foreground/60">940 Mbps</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-foreground/40">MCP Server</span>
                    <span className="text-foreground/60">localhost:8765</span>
                  </div>
                </div>
              </div>
              <div className="glass rounded-lg p-3 space-y-1">
                <ToggleSwitch on={true} label="Provider sync over WiFi" />
                <ToggleSwitch on={false} label="Metered connection" />
                <ToggleSwitch on={true} label="VPN (Aluminum Tunnel)" />
              </div>
            </div>
          </div>
        )}

        {active === "notifications" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Notifications</h2>
            <div className="glass rounded-lg p-3 space-y-1">
              <ToggleSwitch on={true} label="Council session alerts" />
              <ToggleSwitch on={true} label="Provider sync notifications" />
              <ToggleSwitch on={false} label="Agent activity logs" />
              <ToggleSwitch on={true} label="Mail notifications" />
              <ToggleSwitch on={true} label="Calendar reminders" />
              <ToggleSwitch on={false} label="Do Not Disturb" />
            </div>
          </div>
        )}

        {active === "storage" && (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">Storage</h2>
            <div className="space-y-3">
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2 font-[family-name:var(--font-display)]">Universal File Graph</p>
                <div className="space-y-2">
                  {[
                    { name: "Google Drive", used: "12.4 GB", total: "15 GB", pct: 83, color: "#4285F4" },
                    { name: "OneDrive", used: "3.2 GB", total: "5 GB", pct: 64, color: "#0078D4" },
                    { name: "iCloud", used: "1.8 GB", total: "5 GB", pct: 36, color: "#999" },
                  ].map(s => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-foreground/60">{s.name}</span>
                        <span className="text-[10px] text-foreground/40">{s.used} / {s.total}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-1 font-[family-name:var(--font-display)]">Memory Substrate</p>
                <p className="text-lg font-bold font-[family-name:var(--font-mono)] text-cyan-400">2.4 GB <span className="text-xs text-foreground/30 font-normal">/ 16 GB</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
