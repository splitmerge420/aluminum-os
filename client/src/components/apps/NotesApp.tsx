import { useState } from "react";
import { FileText, Plus, Search } from "lucide-react";

const notes = [
  { id: 1, title: "Aluminum OS — Master Plan", content: "Fork gws CLI → Build uws → Integrate Microsoft + Apple + Android + Chrome → Wire AI Council → Ship to GitHub.\n\n110 wishes fulfilled. 7 council members. 20,000+ operations. One OS.", updated: "Mar 9, 2026", provider: "Notion" },
  { id: 2, title: "Council Session Notes", content: "Copilot: Validated architecture. Compared to Kubernetes design doc.\nGrok: Called it vaporware. Demanded 4 features.\nGemini: Scored 8.3/10 average. Provided 6-month roadmap.\nGPT: Submitted 20 wishes. 0 power grabs detected.", updated: "Mar 9, 2026", provider: "Google Keep" },
  { id: 3, title: "Google Engineer Wish List", content: "1. Hardware-Agnostic Kernel ✓\n2. Blackboard Memory Pattern ✓\n3. Unified Identity Graph ✓\n4. JSON-First Interfaces ✓\n5. Constitutional Runtime ✓\n6. Provider-Driver Interop ✓\n7. Cross-Ecosystem Sync ✓\n8. Native Agent Runtime ✓\n9. Audit Logging ✓\n10. Zero-UI Shell ✓", updated: "Mar 9, 2026", provider: "Apple Notes" },
  { id: 4, title: "Microsoft Engineer Wish List", content: "20/20 fulfilled. Key highlights:\n- Copilot Studio MCP Bridge\n- Azure AD Federation\n- Teams Deep Integration\n- SharePoint as Provider Driver", updated: "Mar 9, 2026", provider: "OneNote" },
  { id: 5, title: "Quick Ideas", content: "- Standalone Apple CLI as gateway drug\n- MCP server for Copilot Studio\n- Publish to crates.io\n- Add Notion, Slack, Linear drivers", updated: "Mar 8, 2026", provider: "Google Keep" },
];

export default function NotesApp() {
  const [selectedId, setSelectedId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const selected = notes.find(n => n.id === selectedId);
  const filtered = searchQuery
    ? notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : notes;

  return (
    <div className="h-full flex">
      {/* Note list */}
      <div className="w-56 glass-heavy border-r border-white/5 flex flex-col">
        <div className="p-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 glass rounded-md px-2 py-1">
            <Search className="w-3 h-3 text-foreground/30" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="flex-1 bg-transparent text-[10px] text-foreground/70 outline-none placeholder:text-foreground/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-1 space-y-0.5">
          {filtered.map(note => (
            <button
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={`w-full text-left p-2 rounded-lg transition-colors ${selectedId === note.id ? "bg-white/8" : "hover:bg-white/3"}`}
            >
              <p className="text-[11px] font-medium text-foreground/80 truncate">{note.title}</p>
              <p className="text-[9px] text-foreground/25 mt-0.5 truncate">{note.content.split("\n")[0]}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] text-foreground/20">{note.updated}</span>
                <span className="text-[8px] text-cyan-400/40">{note.provider}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md hover:bg-white/5 text-foreground/40 text-[10px] transition-colors">
            <Plus className="w-3 h-3" />
            New Note
          </button>
        </div>
      </div>

      {/* Note editor */}
      <div className="flex-1 p-4 overflow-auto">
        {selected ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-foreground/30" />
              <span className="text-[9px] text-cyan-400/50">{selected.provider}</span>
              <span className="text-[9px] text-foreground/20 ml-auto">{selected.updated}</span>
            </div>
            <h1 className="text-base font-bold font-[family-name:var(--font-display)] text-foreground/90 mb-4">{selected.title}</h1>
            <div className="text-xs text-foreground/60 leading-relaxed whitespace-pre-wrap font-[family-name:var(--font-mono)]">
              {selected.content}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-foreground/20">Select a note</p>
          </div>
        )}
      </div>
    </div>
  );
}
