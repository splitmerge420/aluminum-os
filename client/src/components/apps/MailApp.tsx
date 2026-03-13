import { useState } from "react";
import { Mail, Star, Archive, Trash2, Send, Inbox } from "lucide-react";

const emails = [
  { id: 1, from: "Copilot 365", subject: "Architecture Review: ALUMINUM_OS_V1 — Validated", preview: "The document is internally consistent. Comparable to the Kubernetes design doc...", time: "2:14 PM", provider: "microsoft", starred: true, read: false },
  { id: 2, from: "Gemini", subject: "Synthesis Complete: Component Scores Ready", preview: "Agent Runtime: 9/10, Governance: 9/10, Memory Substrate: 7/10...", time: "1:45 PM", provider: "google", starred: false, read: false },
  { id: 3, from: "Grok", subject: "Contrarian Review: Vaporware with a Kernel of Potential", preview: "I'm going to be blunt. This is either the most ambitious OS project since...", time: "1:30 PM", provider: "google", starred: true, read: true },
  { id: 4, from: "GitHub", subject: "[splitmerge420/uws] Push: SHREDDERNAUT UNLEASHED", preview: "10 commits pushed to uws-universal. 234 files, 47,624 lines...", time: "12:50 PM", provider: "google", starred: false, read: true },
  { id: 5, from: "Google Drive", subject: "12 files uploaded to uws — Universal Workspace CLI", preview: "ALUMINUM_OS_V1_ARCHITECTURE.md, FUSION_ENGINE.md, GROK_REVIEW.md...", time: "12:30 PM", provider: "google", starred: false, read: true },
  { id: 6, from: "Notion", subject: "4 new pages created in Aluminum OS workspace", preview: "Feature Manifest, Council Session, Copilot Review, Architecture...", time: "11:45 AM", provider: "google", starred: false, read: true },
  { id: 7, from: "GPT (on timeout)", subject: "Pantheon Edition: 20 Wishes Submitted", preview: "Human-centered intelligence amplification. Not replace humans, but augment...", time: "11:00 AM", provider: "microsoft", starred: false, read: true },
];

const folders = [
  { name: "Unified Inbox", icon: <Inbox className="w-3.5 h-3.5" />, count: 2 },
  { name: "Starred", icon: <Star className="w-3.5 h-3.5" />, count: 2 },
  { name: "Sent", icon: <Send className="w-3.5 h-3.5" />, count: 0 },
  { name: "Archive", icon: <Archive className="w-3.5 h-3.5" />, count: 0 },
  { name: "Trash", icon: <Trash2 className="w-3.5 h-3.5" />, count: 0 },
];

export default function MailApp() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = emails.find(e => e.id === selectedId);

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-40 glass-heavy border-r border-white/5 p-2 space-y-0.5">
        <p className="text-[9px] uppercase tracking-wider text-foreground/30 px-2 py-1 font-[family-name:var(--font-display)]">Mailboxes</p>
        {folders.map(f => (
          <button key={f.name} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground/60 hover:bg-white/5 transition-colors">
            {f.icon}
            <span className="flex-1 text-left truncate">{f.name}</span>
            {f.count > 0 && <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 rounded-full">{f.count}</span>}
          </button>
        ))}
        <div className="pt-3">
          <p className="text-[9px] uppercase tracking-wider text-foreground/30 px-2 py-1 font-[family-name:var(--font-display)]">Accounts</p>
          {["Gmail", "Outlook", "iCloud Mail"].map(a => (
            <button key={a} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground/40 hover:bg-white/5 transition-colors">
              <Mail className="w-3 h-3" />
              <span>{a}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Email list */}
      <div className="w-64 border-r border-white/5 overflow-auto">
        {emails.map(email => (
          <button
            key={email.id}
            onClick={() => setSelectedId(email.id)}
            className={`w-full text-left p-3 border-b border-white/3 transition-colors ${selectedId === email.id ? "bg-white/8" : "hover:bg-white/3"}`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${email.read ? "text-foreground/50" : "text-foreground/90"}`}>{email.from}</span>
              {email.starred && <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
              <span className="text-[9px] text-foreground/30 ml-auto">{email.time}</span>
            </div>
            <p className={`text-[11px] mt-0.5 truncate ${email.read ? "text-foreground/40" : "text-foreground/70 font-medium"}`}>{email.subject}</p>
            <p className="text-[10px] text-foreground/25 mt-0.5 truncate">{email.preview}</p>
          </button>
        ))}
      </div>

      {/* Email detail */}
      <div className="flex-1 p-4 overflow-auto">
        {selected ? (
          <div>
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90">{selected.subject}</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs">{selected.from[0]}</div>
              <div>
                <p className="text-xs text-foreground/70">{selected.from}</p>
                <p className="text-[9px] text-foreground/30">via {selected.provider === "google" ? "Gmail" : "Outlook"} — {selected.time}</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-foreground/60 leading-relaxed">
              <p>{selected.preview}</p>
              <p className="mt-3 text-foreground/40">[Full email content would be loaded from the {selected.provider === "google" ? "Gmail" : "Microsoft Graph"} API via the uws MCP server]</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Mail className="w-8 h-8 text-foreground/15 mx-auto" />
              <p className="text-xs text-foreground/30 mt-2">Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
