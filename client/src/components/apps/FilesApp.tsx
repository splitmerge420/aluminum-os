import { useState } from "react";
import { Folder, FileText, Image, Film, Music, ChevronRight, HardDrive, Cloud } from "lucide-react";

interface FileItem {
  name: string;
  type: "folder" | "document" | "image" | "video" | "audio";
  size?: string;
  modified?: string;
  provider?: string;
}

const providers = [
  { id: "all", name: "All Files", icon: <HardDrive className="w-3.5 h-3.5" />, color: "#00d4ff" },
  { id: "google", name: "Google Drive", icon: <Cloud className="w-3.5 h-3.5" />, color: "#4285F4" },
  { id: "microsoft", name: "OneDrive", icon: <Cloud className="w-3.5 h-3.5" />, color: "#0078D4" },
  { id: "apple", name: "iCloud Drive", icon: <Cloud className="w-3.5 h-3.5" />, color: "#999" },
];

const files: FileItem[] = [
  { name: "uws — Universal Workspace CLI", type: "folder", modified: "Mar 9, 2026", provider: "google" },
  { name: "ALUMINUM_OS_V1_ARCHITECTURE.md", type: "document", size: "45 KB", modified: "Mar 9, 2026", provider: "google" },
  { name: "COPILOT_CLI_SPEC.md", type: "document", size: "28 KB", modified: "Mar 8, 2026", provider: "google" },
  { name: "FUSION_ENGINE.md", type: "document", size: "32 KB", modified: "Mar 9, 2026", provider: "google" },
  { name: "Council Session Recording", type: "video", size: "1.2 GB", modified: "Mar 9, 2026", provider: "microsoft" },
  { name: "Aluminum OS Wallpapers", type: "folder", modified: "Mar 9, 2026", provider: "apple" },
  { name: "Desktop Screenshots", type: "folder", modified: "Mar 9, 2026", provider: "apple" },
  { name: "Project Notes", type: "document", size: "12 KB", modified: "Mar 8, 2026", provider: "microsoft" },
  { name: "Podcast Episode 1.mp3", type: "audio", size: "45 MB", modified: "Mar 7, 2026", provider: "google" },
  { name: "Architecture Diagram.png", type: "image", size: "2.1 MB", modified: "Mar 9, 2026", provider: "google" },
];

const iconMap = {
  folder: <Folder className="w-4 h-4 text-amber-400" />,
  document: <FileText className="w-4 h-4 text-blue-400" />,
  image: <Image className="w-4 h-4 text-green-400" />,
  video: <Film className="w-4 h-4 text-purple-400" />,
  audio: <Music className="w-4 h-4 text-pink-400" />,
};

export default function FilesApp() {
  const [activeProvider, setActiveProvider] = useState("all");
  const filtered = activeProvider === "all" ? files : files.filter(f => f.provider === activeProvider);

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-44 glass-heavy border-r border-white/5 p-2 space-y-0.5">
        <p className="text-[9px] uppercase tracking-wider text-foreground/30 px-2 py-1 font-[family-name:var(--font-display)]">Providers</p>
        {providers.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveProvider(p.id)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${activeProvider === p.id ? "bg-white/10 text-foreground" : "text-foreground/50 hover:bg-white/5"}`}
          >
            <span style={{ color: p.color }}>{p.icon}</span>
            <span className="truncate">{p.name}</span>
          </button>
        ))}
        <div className="pt-3">
          <p className="text-[9px] uppercase tracking-wider text-foreground/30 px-2 py-1 font-[family-name:var(--font-display)]">Quick Access</p>
          {["Recent", "Starred", "Shared", "Trash"].map(item => (
            <button key={item} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-foreground/50 hover:bg-white/5 transition-colors">
              <ChevronRight className="w-3 h-3" />
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 p-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-foreground/40 font-[family-name:var(--font-mono)]">alum://drive/</span>
          <span className="text-xs text-foreground/60">{filtered.length} items</span>
        </div>
        <div className="space-y-0.5">
          {filtered.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-default group"
            >
              {iconMap[file.type]}
              <span className="flex-1 text-xs text-foreground/80 truncate">{file.name}</span>
              <span className="text-[10px] text-foreground/30 group-hover:text-foreground/50">{file.size || "—"}</span>
              <span className="text-[10px] text-foreground/30 group-hover:text-foreground/50 w-24 text-right">{file.modified}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
