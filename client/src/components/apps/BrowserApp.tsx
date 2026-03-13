import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Lock, Star, Plus } from "lucide-react";

const bookmarks = [
  { name: "GitHub — uws", url: "github.com/splitmerge420/uws" },
  { name: "Notion — Aluminum OS", url: "notion.so/aluminum-os" },
  { name: "Google Drive", url: "drive.google.com" },
  { name: "Medium — gws Article", url: "medium.com/coding-nexus" },
];

export default function BrowserApp() {
  const [url, setUrl] = useState("github.com/splitmerge420/uws");
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["splitmerge420/uws", "New Tab"];

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <div className="flex items-center gap-0.5 px-2 pt-1 bg-black/20">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-1.5 rounded-t-lg text-[10px] transition-colors ${activeTab === i ? "bg-white/8 text-foreground/80" : "text-foreground/30 hover:text-foreground/50"}`}
          >
            {tab}
          </button>
        ))}
        <button className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-white/5">
          <Plus className="w-3 h-3 text-foreground/30" />
        </button>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-black/10">
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 rounded-md hover:bg-white/5 flex items-center justify-center">
            <ArrowLeft className="w-3 h-3 text-foreground/30" />
          </button>
          <button className="w-6 h-6 rounded-md hover:bg-white/5 flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-foreground/30" />
          </button>
          <button className="w-6 h-6 rounded-md hover:bg-white/5 flex items-center justify-center">
            <RotateCw className="w-3 h-3 text-foreground/30" />
          </button>
        </div>
        <div className="flex-1 flex items-center gap-1.5 glass rounded-lg px-2.5 py-1">
          <Lock className="w-3 h-3 text-green-400/60" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent text-[11px] text-foreground/70 outline-none"
          />
          <Star className="w-3 h-3 text-foreground/20 hover:text-amber-400 cursor-pointer" />
        </div>
      </div>

      {/* Bookmarks bar */}
      <div className="flex items-center gap-2 px-3 py-1 border-b border-white/5">
        {bookmarks.map(b => (
          <button
            key={b.name}
            onClick={() => setUrl(b.url)}
            className="text-[9px] text-foreground/35 hover:text-foreground/60 transition-colors"
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-black/30 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
              <span className="text-lg">🔧</span>
            </div>
            <div>
              <h1 className="text-base font-bold font-[family-name:var(--font-display)] text-foreground/90">splitmerge420/uws</h1>
              <p className="text-[10px] text-foreground/40">Universal Workspace CLI — One CLI for Google, Microsoft, and Apple</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">Public</span>
            <span className="text-[10px] text-foreground/30">237 files</span>
            <span className="text-[10px] text-foreground/30">47,624 lines</span>
            <span className="text-[10px] text-foreground/30">11 commits</span>
          </div>
          <div className="glass rounded-lg p-4">
            <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/80 mb-2">README.md</h2>
            <div className="text-xs text-foreground/50 space-y-2 leading-relaxed">
              <p className="font-bold text-foreground/70">uws — Universal Workspace CLI</p>
              <p>One CLI to rule Google Workspace, Microsoft 365, Apple iCloud, Android, and Chrome. Built in Rust. Designed for AI agents.</p>
              <p>110 wishes fulfilled from 7 council members. 20,000+ unified operations. Constitutional governance baked in.</p>
              <p className="text-cyan-400/60 font-[family-name:var(--font-mono)]">$ cargo install uws</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
