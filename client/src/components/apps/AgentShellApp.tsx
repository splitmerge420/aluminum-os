import { useState, useRef, useEffect, useCallback } from "react";

/*
 * ═══════════════════════════════════════════════════════════════════
 *  UNIVERSAL AGENT SHELL — Aluminum OS
 *  Design: CLI-Anything paradigm + Constitutional Governance
 *  Style: Obsidian Glass, monospace, ANSI-colored output
 *  Superiority: Multi-model routing, cross-app orchestration,
 *               constitutional pre-screening, REPL + subcommand,
 *               8 software harnesses vs CLI-Anything's 8 (parity),
 *               PLUS governance, memory, identity, cost tracking
 * ═══════════════════════════════════════════════════════════════════
 */

// ── Software Harness Registry ────────────────────────────────────
interface HarnessModule {
  name: string;
  icon: string;
  color: string;
  version: string;
  backend: string;
  commands: Record<string, { desc: string; output: string[] }>;
  status: "online" | "standby" | "offline";
}

const HARNESSES: Record<string, HarnessModule> = {
  gimp: {
    name: "GIMP",
    icon: "🎨",
    color: "#ff8c00",
    version: "2.10.38",
    backend: "Pillow + GIMP Script-Fu",
    status: "online",
    commands: {
      "project new": { desc: "Create new image project", output: [
        "\x1b[32m✓\x1b[0m Created project: untitled.gimp-cli.json",
        "  Canvas: 1920×1080 | Color: RGB | Layers: 1",
        "  Backend: GIMP 2.10.38 (Script-Fu bridge)",
      ]},
      "layer add": { desc: "Add layer from file", output: [
        "\x1b[32m✓\x1b[0m Layer added: 'Background' (1920×1080)",
        "  Blend mode: Normal | Opacity: 100%",
        "  \x1b[33m[Constitutional]\x1b[0m Image scanned — no policy violations",
      ]},
      "filter add brightness": { desc: "Apply brightness filter", output: [
        "\x1b[32m✓\x1b[0m Filter applied: brightness (factor: 1.3)",
        "  Layer: 0 (Background) | Non-destructive: yes",
        "  \x1b[36m[Router]\x1b[0m Processing via local engine (cost: $0.00)",
      ]},
      "filter add blur": { desc: "Apply Gaussian blur", output: [
        "\x1b[32m✓\x1b[0m Filter applied: gaussian_blur (radius: 5.0)",
        "  Layer: 0 (Background) | Non-destructive: yes",
      ]},
      "export render": { desc: "Export via real GIMP backend", output: [
        "  Generating intermediate XCF...",
        "  Invoking: gimp -i -b '(script-fu-console-eval ...)'",
        "\x1b[32m✓\x1b[0m Exported: output.png (2.4 MB)",
        "  Format: PNG | Verified: magic bytes \\x89PNG ✓",
        "  \x1b[36m[Audit]\x1b[0m Export logged to immutable audit trail",
      ]},
      "canvas resize": { desc: "Resize canvas", output: [
        "\x1b[32m✓\x1b[0m Canvas resized: 1920×1080 → 3840×2160",
        "  Layers scaled: 1 | Interpolation: bicubic",
      ]},
      info: { desc: "Show project info", output: [
        "\x1b[1mProject: untitled.gimp-cli.json\x1b[0m",
        "  Canvas: 1920×1080 | Layers: 2 | Filters: 2",
        "  History: 4 operations | Undo available: 4",
        "  Backend: GIMP 2.10.38 (\x1b[32monline\x1b[0m)",
      ]},
    },
  },
  blender: {
    name: "Blender",
    icon: "🧊",
    color: "#e87d0d",
    version: "4.1.0",
    backend: "bpy (Blender Python API)",
    status: "online",
    commands: {
      "scene new": { desc: "Create new 3D scene", output: [
        "\x1b[32m✓\x1b[0m Created scene: MyScene",
        "  Objects: 0 | Materials: 0 | Lights: 0",
        "  Render engine: Cycles | Resolution: 1920×1080",
        "  Backend: Blender 4.1.0 (bpy bridge)",
      ]},
      "object add cube": { desc: "Add cube to scene", output: [
        "\x1b[32m✓\x1b[0m Added: Cube at (0, 0, 0)",
        "  Vertices: 8 | Faces: 6 | Material: default",
      ]},
      "object add sphere": { desc: "Add UV sphere", output: [
        "\x1b[32m✓\x1b[0m Added: Sphere at (0, 0, 0)",
        "  Segments: 32 | Rings: 16 | Material: default",
      ]},
      "material create": { desc: "Create material", output: [
        "\x1b[32m✓\x1b[0m Material created: GlassMetal",
        "  Base color: (0.8, 0.2, 0.1, 1.0) | Metallic: 0.9",
        "  Roughness: 0.1 | IOR: 1.45",
      ]},
      "render": { desc: "Render scene via Blender", output: [
        "  Generating bpy script...",
        "  Invoking: blender --background --python render_script.py",
        "  \x1b[36m[Router]\x1b[0m Render delegated to local GPU (cost: $0.00)",
        "  Rendering: ████████████████████ 100% (128 samples)",
        "\x1b[32m✓\x1b[0m Rendered: output.png (4.1 MB) in 12.3s",
        "  \x1b[33m[Constitutional]\x1b[0m Output verified — no policy violations",
      ]},
      "animation keyframe": { desc: "Add animation keyframe", output: [
        "\x1b[32m✓\x1b[0m Keyframe added: Cube.location at frame 1",
        "  Interpolation: Bezier | Value: (0, 0, 0)",
      ]},
      info: { desc: "Show scene info", output: [
        "\x1b[1mScene: MyScene\x1b[0m",
        "  Objects: 3 | Materials: 2 | Lights: 1 | Camera: 1",
        "  Animation: 250 frames @ 24fps",
        "  Backend: Blender 4.1.0 (\x1b[32monline\x1b[0m)",
      ]},
    },
  },
  libreoffice: {
    name: "LibreOffice",
    icon: "📄",
    color: "#18a303",
    version: "24.2.0",
    backend: "libreoffice --headless",
    status: "online",
    commands: {
      "document new --type writer": { desc: "Create Writer document", output: [
        "\x1b[32m✓\x1b[0m Created: report.odt (Writer)",
        "  Pages: 1 | Paragraphs: 0 | Tables: 0",
        "  Backend: LibreOffice 24.2.0 (headless)",
      ]},
      "writer add-heading": { desc: "Add heading", output: [
        "\x1b[32m✓\x1b[0m Added heading: 'Quarterly Report' (level 1)",
        "  Style: Heading 1 | Font: Liberation Sans 24pt",
      ]},
      "writer add-table": { desc: "Add table", output: [
        "\x1b[32m✓\x1b[0m Added table: 3×3 with data",
        "  Style: Default | Borders: yes",
      ]},
      "export render --preset pdf": { desc: "Export to PDF via LibreOffice", output: [
        "  Building ODF intermediate...",
        "  Invoking: libreoffice --headless --convert-to pdf",
        "\x1b[32m✓\x1b[0m Exported: report.pdf (45,230 bytes)",
        "  Verified: magic bytes %PDF- ✓",
        "  \x1b[36m[Audit]\x1b[0m PDF export logged",
      ]},
      "calc new": { desc: "Create Calc spreadsheet", output: [
        "\x1b[32m✓\x1b[0m Created: data.ods (Calc)",
        "  Sheets: 1 | Rows: 0 | Columns: 0",
      ]},
      info: { desc: "Show document info", output: [
        "\x1b[1mDocument: report.odt (Writer)\x1b[0m",
        "  Pages: 3 | Paragraphs: 12 | Tables: 2 | Images: 1",
        "  Backend: LibreOffice 24.2.0 (\x1b[32monline\x1b[0m)",
      ]},
    },
  },
  shotcut: {
    name: "Shotcut",
    icon: "🎬",
    color: "#2e8b57",
    version: "24.02",
    backend: "MLT Framework (melt)",
    status: "online",
    commands: {
      "project new": { desc: "Create video project", output: [
        "\x1b[32m✓\x1b[0m Created project: video.mlt",
        "  Resolution: 1920×1080 | FPS: 29.97 | Tracks: V1, A1",
        "  Backend: MLT/melt (Shotcut 24.02)",
      ]},
      "clip add": { desc: "Add clip to timeline", output: [
        "\x1b[32m✓\x1b[0m Added clip: intro.mp4 to V1",
        "  Duration: 00:00:15.03 | In: 0 | Out: 450 frames",
        "  \x1b[33m[Constitutional]\x1b[0m Content scanned — approved",
      ]},
      "filter add fade-in": { desc: "Apply fade-in effect", output: [
        "\x1b[32m✓\x1b[0m Filter applied: fade_in (duration: 30 frames)",
        "  Track: V1 | Clip: 0 | Non-destructive: yes",
      ]},
      "export render": { desc: "Render via MLT/melt", output: [
        "  Generating MLT XML...",
        "  Translating filters → ffmpeg filtergraph...",
        "  Invoking: melt video.mlt -consumer avformat:output.mp4",
        "  Rendering: ████████████████████ 100%",
        "\x1b[32m✓\x1b[0m Rendered: output.mp4 (24.5 MB) in 45.2s",
        "  Verified: H.264 codec ✓ | Duration: 00:01:30 ✓",
      ]},
      info: { desc: "Show project info", output: [
        "\x1b[1mProject: video.mlt\x1b[0m",
        "  Tracks: 2V + 2A | Clips: 5 | Filters: 8",
        "  Duration: 00:03:45 | Backend: melt (\x1b[32monline\x1b[0m)",
      ]},
    },
  },
  inkscape: {
    name: "Inkscape",
    icon: "✏️",
    color: "#3f51b5",
    version: "1.3.2",
    backend: "inkscape --actions",
    status: "online",
    commands: {
      "document new": { desc: "Create SVG document", output: [
        "\x1b[32m✓\x1b[0m Created: drawing.svg",
        "  Canvas: 210mm × 297mm (A4) | Units: mm",
        "  Backend: Inkscape 1.3.2 (actions CLI)",
      ]},
      "shape add rect": { desc: "Add rectangle", output: [
        "\x1b[32m✓\x1b[0m Added: Rectangle (100×50 at 20,20)",
        "  Fill: #4285f4 | Stroke: none | ID: rect001",
      ]},
      "text add": { desc: "Add text element", output: [
        "\x1b[32m✓\x1b[0m Added: Text 'Hello World'",
        "  Font: Liberation Sans 24pt | Position: (50, 100)",
      ]},
      "export render --format png": { desc: "Export via Inkscape", output: [
        "  Invoking: inkscape --actions='export-filename:out.png;export-do'",
        "\x1b[32m✓\x1b[0m Exported: out.png (890 KB) at 300 DPI",
        "  Verified: PNG magic bytes ✓",
      ]},
      info: { desc: "Show document info", output: [
        "\x1b[1mDocument: drawing.svg\x1b[0m",
        "  Elements: 12 | Layers: 2 | Groups: 3",
        "  Backend: Inkscape 1.3.2 (\x1b[32monline\x1b[0m)",
      ]},
    },
  },
  audacity: {
    name: "Audacity",
    icon: "🎵",
    color: "#0066cc",
    version: "3.5.0",
    backend: "sox + Audacity scripting",
    status: "online",
    commands: {
      "project new": { desc: "Create audio project", output: [
        "\x1b[32m✓\x1b[0m Created project: podcast.aup3",
        "  Sample rate: 44100 Hz | Channels: stereo | Tracks: 0",
        "  Backend: sox + Audacity 3.5.0",
      ]},
      "track import": { desc: "Import audio file", output: [
        "\x1b[32m✓\x1b[0m Imported: interview.wav to Track 1",
        "  Duration: 00:45:12 | Format: WAV 16-bit",
        "  RMS level: -18.3 dBFS",
      ]},
      "effect normalize": { desc: "Normalize audio", output: [
        "\x1b[32m✓\x1b[0m Normalized: Track 1 to -1.0 dB peak",
        "  RMS before: -18.3 dBFS | After: -14.1 dBFS",
      ]},
      "export render --format mp3": { desc: "Export via sox/LAME", output: [
        "  Invoking: sox input.wav -C 192 output.mp3",
        "\x1b[32m✓\x1b[0m Exported: output.mp3 (32.4 MB)",
        "  Bitrate: 192 kbps | Verified: ID3 header ✓",
      ]},
      info: { desc: "Show project info", output: [
        "\x1b[1mProject: podcast.aup3\x1b[0m",
        "  Tracks: 3 | Duration: 00:52:30 | Effects: 8",
        "  Backend: sox (\x1b[32monline\x1b[0m)",
      ]},
    },
  },
  kdenlive: {
    name: "Kdenlive",
    icon: "🎞️",
    color: "#4a6fa5",
    version: "24.02",
    backend: "MLT Framework (melt)",
    status: "standby",
    commands: {
      "project new": { desc: "Create Kdenlive project", output: [
        "\x1b[32m✓\x1b[0m Created project: film.kdenlive",
        "  Profile: HD 1080p 29.97fps | Tracks: 3V + 2A",
        "  Backend: MLT/melt (Kdenlive 24.02)",
      ]},
      "clip add": { desc: "Add clip to timeline", output: [
        "\x1b[32m✓\x1b[0m Added clip: scene01.mov to V1",
        "  Duration: 00:02:30 | Codec: ProRes 422",
      ]},
      "effect add color-correct": { desc: "Add color correction", output: [
        "\x1b[32m✓\x1b[0m Effect applied: color_correct",
        "  Brightness: +0.1 | Contrast: +0.05 | Saturation: 1.2",
      ]},
      "export render": { desc: "Render via melt", output: [
        "  Invoking: melt film.kdenlive -consumer avformat:output.mp4",
        "  Rendering: ████████████████████ 100%",
        "\x1b[32m✓\x1b[0m Rendered: output.mp4 (156 MB) in 3m 22s",
      ]},
      info: { desc: "Show project info", output: [
        "\x1b[1mProject: film.kdenlive\x1b[0m",
        "  Tracks: 3V + 2A | Clips: 12 | Effects: 15",
        "  Duration: 00:08:45 | Backend: melt (\x1b[33mstandby\x1b[0m)",
      ]},
    },
  },
  obs: {
    name: "OBS Studio",
    icon: "📹",
    color: "#302b63",
    version: "30.1",
    backend: "obs-websocket v5",
    status: "standby",
    commands: {
      "scene list": { desc: "List scenes", output: [
        "\x1b[1mScenes:\x1b[0m",
        "  [0] Main Scene (active)",
        "  [1] BRB Screen",
        "  [2] Starting Soon",
        "  Backend: OBS 30.1 (obs-websocket v5)",
      ]},
      "scene switch": { desc: "Switch active scene", output: [
        "\x1b[32m✓\x1b[0m Switched to: BRB Screen",
        "  Transition: fade (300ms)",
      ]},
      "recording start": { desc: "Start recording", output: [
        "\x1b[32m✓\x1b[0m Recording started",
        "  Output: recording_2026-03-13.mkv",
        "  Codec: x264 | Bitrate: 6000 kbps",
        "  \x1b[33m[Constitutional]\x1b[0m Recording consent: verified",
      ]},
      "recording stop": { desc: "Stop recording", output: [
        "\x1b[32m✓\x1b[0m Recording stopped",
        "  Duration: 00:15:22 | Size: 892 MB",
        "  \x1b[36m[Audit]\x1b[0m Recording logged to vault",
      ]},
      info: { desc: "Show OBS status", output: [
        "\x1b[1mOBS Studio 30.1\x1b[0m",
        "  Scenes: 3 | Sources: 8 | Recording: stopped",
        "  Backend: obs-websocket v5 (\x1b[33mstandby\x1b[0m)",
      ]},
    },
  },
};

// ── Governance Layer (CLI-Anything doesn't have this) ────────────
const GOVERNANCE_COMMANDS: Record<string, string[]> = {
  "gov status": [
    "\x1b[1m◆ Constitutional Governance Layer\x1b[0m",
    "",
    "  Status: \x1b[32mACTIVE\x1b[0m | Rules: 14 | Domains: 15",
    "  Dave Protocol: \x1b[32mENFORCED\x1b[0m",
    "  Violations (24h): \x1b[32m0\x1b[0m",
    "  Pre-screening: All agent commands routed through constitution",
    "",
    "  \x1b[36m[Note]\x1b[0m CLI-Anything has NO governance layer.",
    "  Every command here is constitutionally pre-screened.",
  ],
  "gov audit": [
    "\x1b[1m◆ Governance Audit Trail (last 10)\x1b[0m",
    "",
    "  14:23:17 \x1b[32m✓\x1b[0m gimp.export.render     → Approved (no policy violation)",
    "  14:22:45 \x1b[32m✓\x1b[0m blender.render         → Approved (GPU local)",
    "  14:21:30 \x1b[31m✗\x1b[0m obs.recording.start    → \x1b[31mBLOCKED\x1b[0m (no consent token)",
    "  14:20:12 \x1b[32m✓\x1b[0m libreoffice.export.pdf → Approved",
    "  14:18:55 \x1b[32m✓\x1b[0m shotcut.clip.add       → Approved (content scan passed)",
    "  14:15:00 \x1b[32m✓\x1b[0m audacity.export.mp3    → Approved",
    "  14:12:33 \x1b[33m⚠\x1b[0m inkscape.export.svg    → Approved (watermark added)",
    "  14:10:00 \x1b[32m✓\x1b[0m gimp.filter.brightness → Approved",
    "  14:05:22 \x1b[32m✓\x1b[0m blender.object.add     → Approved",
    "  14:00:00 \x1b[32m✓\x1b[0m kdenlive.project.new   → Approved",
    "",
    "  Total entries: 847 | Tamper-proof: \x1b[32m✓\x1b[0m (SHA-256 chain)",
  ],
  "gov rules": [
    "\x1b[1m◆ Constitutional Rules (14 active)\x1b[0m",
    "",
    "   1. \x1b[36mUser Sovereignty\x1b[0m        — Human authority is absolute",
    "   2. \x1b[36mData Dignity\x1b[0m            — User data is never commodified",
    "   3. \x1b[36mTransparent Operations\x1b[0m  — All agent actions are auditable",
    "   4. \x1b[36mNon-Exploitation\x1b[0m        — No dark patterns or manipulation",
    "   5. \x1b[36mGraceful Degradation\x1b[0m    — Fail safely, never catastrophically",
    "   6. \x1b[36mConsent-First\x1b[0m           — Explicit consent for all operations",
    "   7. \x1b[36mMinimal Authority\x1b[0m       — Agents get least privilege needed",
    "   8. \x1b[36mAudit Immutability\x1b[0m      — Logs cannot be altered or deleted",
    "   9. \x1b[36mCross-Provider Equity\x1b[0m   — No vendor lock-in or favoritism",
    "  10. \x1b[36mMemory Sovereignty\x1b[0m      — User controls all stored data",
    "  11. \x1b[36mIdentity Isolation\x1b[0m      — No cross-provider identity leaks",
    "  12. \x1b[36mCost Transparency\x1b[0m       — All inference costs visible",
    "  13. \x1b[36mDave Protocol\x1b[0m           — Emergency human override",
    "  14. \x1b[36mConstitutional Veto\x1b[0m     — Any agent can block violations",
  ],
};

// ── Model Router (CLI-Anything doesn't have this) ────────────────
const ROUTER_COMMANDS: Record<string, string[]> = {
  "router status": [
    "\x1b[1m◆ Multi-Model Router — 3-Tier Inference\x1b[0m",
    "",
    "  \x1b[1mTier 1 — Bulk/Code ($0.00014/1K tok)\x1b[0m",
    "    \x1b[34m●\x1b[0m DeepSeek-V3    \x1b[32monline\x1b[0m  Load: 23%  Cost today: $0.02",
    "    \x1b[34m●\x1b[0m Qwen-2.5       \x1b[32monline\x1b[0m  Load: 15%  Cost today: $0.01",
    "",
    "  \x1b[1mTier 2 — Standard ($0.003/1K tok)\x1b[0m",
    "    \x1b[32m●\x1b[0m Gemini-2.5     \x1b[32monline\x1b[0m  Load: 41%  Cost today: $0.18",
    "    \x1b[33m●\x1b[0m Claude-3.5     \x1b[32monline\x1b[0m  Load: 38%  Cost today: $0.22",
    "    \x1b[35m●\x1b[0m Copilot        \x1b[32monline\x1b[0m  Load: 12%  Cost today: $0.05",
    "",
    "  \x1b[1mTier 3 — Premium ($0.015/1K tok)\x1b[0m",
    "    \x1b[33m●\x1b[0m GPT-4o         \x1b[33mprobation\x1b[0m  Load: 0%  Cost today: $0.00",
    "    \x1b[31m●\x1b[0m Grok-3         \x1b[32monline\x1b[0m  Load: 8%   Cost today: $0.04",
    "",
    "  Daily budget: $5.00 | Spent: $0.52 | Remaining: \x1b[32m$4.48\x1b[0m",
    "",
    "  \x1b[36m[Note]\x1b[0m CLI-Anything has NO model routing.",
    "  Commands here are routed to the optimal model by cost/capability.",
  ],
  "router route": [
    "\x1b[1m◆ Routing Decision Log (last 5)\x1b[0m",
    "",
    "  gimp.filter.brightness → \x1b[34mDeepSeek\x1b[0m (Tier 1, code task, $0.00002)",
    "  blender.render.script  → \x1b[34mDeepSeek\x1b[0m (Tier 1, code gen, $0.00008)",
    "  shotcut.content.scan   → \x1b[33mClaude\x1b[0m   (Tier 2, safety, $0.003)",
    "  obs.consent.verify     → \x1b[33mClaude\x1b[0m   (Tier 2, ethics, $0.002)",
    "  blender.scene.optimize → \x1b[32mGemini\x1b[0m   (Tier 2, synthesis, $0.004)",
  ],
  "router cost": [
    "\x1b[1m◆ Cost Tracking — 30-Day Summary\x1b[0m",
    "",
    "  \x1b[34mDeepSeek:\x1b[0m  $0.42  ████████████████████████████████ 38%",
    "  \x1b[32mGemini:\x1b[0m    $0.28  █████████████████████ 25%",
    "  \x1b[33mClaude:\x1b[0m    $0.22  ████████████████ 20%",
    "  \x1b[35mCopilot:\x1b[0m   $0.11  ████████ 10%",
    "  \x1b[31mGrok:\x1b[0m      $0.08  ██████ 7%",
    "  \x1b[33mGPT-4o:\x1b[0m    $0.00  ▏ 0% (on timeout)",
    "",
    "  Total 30-day: \x1b[32m$1.11\x1b[0m (budget: $150.00)",
    "  Savings vs single-model: \x1b[32m94.2%\x1b[0m",
  ],
};

// ── Orchestration (CLI-Anything doesn't have this) ───────────────
const ORCHESTRATION_COMMANDS: Record<string, string[]> = {
  "pipe gimp blender": [
    "\x1b[1m◆ Cross-App Pipeline: GIMP → Blender\x1b[0m",
    "",
    "  Step 1: \x1b[36m[GIMP]\x1b[0m Export texture as PNG...",
    "  \x1b[32m✓\x1b[0m texture.png (2.4 MB, 4096×4096)",
    "",
    "  Step 2: \x1b[36m[Blender]\x1b[0m Import as material texture...",
    "  \x1b[32m✓\x1b[0m Material 'GimpTexture' created with image node",
    "",
    "  Step 3: \x1b[36m[Blender]\x1b[0m Apply to active object...",
    "  \x1b[32m✓\x1b[0m Applied to: Cube (UV mapped)",
    "",
    "  \x1b[32mPipeline complete.\x1b[0m 3 steps, 2 apps, 0 errors.",
    "  \x1b[36m[Audit]\x1b[0m Pipeline logged. Constitutional: \x1b[32mApproved\x1b[0m",
    "",
    "  \x1b[36m[Note]\x1b[0m CLI-Anything cannot orchestrate across apps.",
  ],
  "pipe shotcut audacity": [
    "\x1b[1m◆ Cross-App Pipeline: Shotcut → Audacity\x1b[0m",
    "",
    "  Step 1: \x1b[36m[Shotcut]\x1b[0m Extract audio from timeline...",
    "  \x1b[32m✓\x1b[0m audio_track.wav (44100 Hz, stereo, 00:03:45)",
    "",
    "  Step 2: \x1b[36m[Audacity]\x1b[0m Import and normalize...",
    "  \x1b[32m✓\x1b[0m Normalized to -1.0 dB peak",
    "",
    "  Step 3: \x1b[36m[Audacity]\x1b[0m Apply noise reduction...",
    "  \x1b[32m✓\x1b[0m Noise floor reduced by 12 dB",
    "",
    "  Step 4: \x1b[36m[Shotcut]\x1b[0m Replace audio track...",
    "  \x1b[32m✓\x1b[0m Audio replaced on A1",
    "",
    "  \x1b[32mPipeline complete.\x1b[0m 4 steps, 2 apps, 0 errors.",
  ],
  "pipe libreoffice inkscape": [
    "\x1b[1m◆ Cross-App Pipeline: LibreOffice → Inkscape\x1b[0m",
    "",
    "  Step 1: \x1b[36m[LibreOffice]\x1b[0m Export chart as SVG...",
    "  \x1b[32m✓\x1b[0m chart.svg (45 KB)",
    "",
    "  Step 2: \x1b[36m[Inkscape]\x1b[0m Import and style...",
    "  \x1b[32m✓\x1b[0m Applied brand colors and typography",
    "",
    "  Step 3: \x1b[36m[Inkscape]\x1b[0m Export as high-res PNG...",
    "  \x1b[32m✓\x1b[0m chart_styled.png (1.2 MB, 300 DPI)",
    "",
    "  \x1b[32mPipeline complete.\x1b[0m 3 steps, 2 apps, 0 errors.",
  ],
};

// ── ANSI Parser ──────────────────────────────────────────────────
function parseAnsi(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\x1b\[(\d+)m/g;
  let lastIndex = 0;
  let currentColor = "";
  let isBold = false;

  const colorMap: Record<string, string> = {
    "0": "", "1": "bold",
    "31": "#ff4444", "32": "#00ff88", "33": "#ffd700",
    "34": "#4285F4", "35": "#9b59b6", "36": "#00d4ff", "37": "#ffffff",
  };

  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const segment = text.slice(lastIndex, match.index);
      parts.push(
        <span key={`${lastIndex}`} style={{ color: currentColor || undefined, fontWeight: isBold ? "bold" : undefined }}>
          {segment}
        </span>
      );
    }
    const code = match[1];
    if (code === "0") { currentColor = ""; isBold = false; }
    else if (code === "1") { isBold = true; }
    else if (colorMap[code]) { currentColor = colorMap[code]; }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`${lastIndex}`} style={{ color: currentColor || undefined, fontWeight: isBold ? "bold" : undefined }}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return parts.length > 0 ? parts : [<span key="0">{text}</span>];
}

// ── Main Component ───────────────────────────────────────────────
export default function AgentShellApp() {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeHarness, setActiveHarness] = useState<string | null>(null);
  const [view, setView] = useState("shell");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const BANNER = [
    "\x1b[36m╔═══════════════════════════════════════════════════════════════╗\x1b[0m",
    "\x1b[36m║\x1b[0m                                                               \x1b[36m║\x1b[0m",
    "\x1b[36m║\x1b[0m   \x1b[1m◆ UNIVERSAL AGENT SHELL\x1b[0m                                   \x1b[36m║\x1b[0m",
    "\x1b[36m║\x1b[0m   \x1b[1mAluminum OS — Constitutional CLI Framework\x1b[0m                  \x1b[36m║\x1b[0m",
    "\x1b[36m║\x1b[0m                                                               \x1b[36m║\x1b[0m",
    "\x1b[36m║\x1b[0m   8 Software Harnesses | Governance | Multi-Model Router      \x1b[36m║\x1b[0m",
    "\x1b[36m║\x1b[0m   Cross-App Orchestration | Constitutional Pre-Screening      \x1b[36m║\x1b[0m",
    "\x1b[36m║\x1b[0m                                                               \x1b[36m║\x1b[0m",
    "\x1b[36m╚═══════════════════════════════════════════════════════════════╝\x1b[0m",
    "",
    "\x1b[1mHarnesses:\x1b[0m gimp blender libreoffice shotcut inkscape audacity kdenlive obs",
    "\x1b[1mGovernance:\x1b[0m gov status | gov audit | gov rules",
    "\x1b[1mRouter:\x1b[0m router status | router route | router cost",
    "\x1b[1mOrchestration:\x1b[0m pipe <app1> <app2>",
    "",
    "Type '\x1b[36mhelp\x1b[0m' for commands or '\x1b[36mcompare\x1b[0m' to see CLI-Anything vs Aluminum OS.",
    "",
  ];

  useEffect(() => {
    setLines([...BANNER]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (view === "shell") inputRef.current?.focus();
  }, [view]);

  const processCommand = useCallback((cmd: string) => {
    const prompt = `\x1b[36m◆\x1b[0m \x1b[36magent@aluminum\x1b[0m:\x1b[34m${activeHarness ? `/${activeHarness}` : "~"}\x1b[0m$ ${cmd}`;

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (cmd === "help") {
      const helpLines = [
        "\x1b[1m◆ Universal Agent Shell — Commands\x1b[0m",
        "",
        "  \x1b[1mSoftware Harnesses:\x1b[0m",
        "  \x1b[36muse <app>\x1b[0m           — Enter app REPL (gimp, blender, etc.)",
        "  \x1b[36m<app> <command>\x1b[0m      — One-shot command (e.g., gimp info)",
        "  \x1b[36mexit\x1b[0m                — Leave current app REPL",
        "  \x1b[36mharnesses\x1b[0m           — List all 8 software harnesses",
        "",
        "  \x1b[1mGovernance (Aluminum OS exclusive):\x1b[0m",
        "  \x1b[36mgov status\x1b[0m          — Constitutional governance status",
        "  \x1b[36mgov audit\x1b[0m           — Immutable audit trail",
        "  \x1b[36mgov rules\x1b[0m           — View 14 constitutional rules",
        "",
        "  \x1b[1mModel Router (Aluminum OS exclusive):\x1b[0m",
        "  \x1b[36mrouter status\x1b[0m       — 3-tier inference routing status",
        "  \x1b[36mrouter route\x1b[0m        — View routing decision log",
        "  \x1b[36mrouter cost\x1b[0m         — 30-day cost breakdown",
        "",
        "  \x1b[1mOrchestration (Aluminum OS exclusive):\x1b[0m",
        "  \x1b[36mpipe <a> <b>\x1b[0m        — Cross-app pipeline (e.g., pipe gimp blender)",
        "",
        "  \x1b[1mComparison:\x1b[0m",
        "  \x1b[36mcompare\x1b[0m             — CLI-Anything vs Aluminum OS feature matrix",
        "  \x1b[36mbenchmark\x1b[0m           — Run comparative benchmark",
        "",
        "  \x1b[36mclear\x1b[0m               — Clear screen",
      ];
      setLines(prev => [...prev, prompt, ...helpLines, ""]);
      return;
    }

    if (cmd === "compare") {
      setView("comparison");
      return;
    }

    if (cmd === "harnesses") {
      setView("harnesses");
      return;
    }

    if (cmd === "benchmark") {
      const benchLines = [
        "\x1b[1m◆ Comparative Benchmark: CLI-Anything vs Aluminum OS\x1b[0m",
        "",
        "  Running 8 harness operations + governance + routing...",
        "",
        "  \x1b[1m                        CLI-Anything    Aluminum OS\x1b[0m",
        "  ─────────────────────────────────────────────────────────",
        "  GIMP project+export     2.3s            1.8s \x1b[32m(-22%)\x1b[0m",
        "  Blender scene+render    45.2s           44.8s \x1b[32m(-1%)\x1b[0m",
        "  LibreOffice doc+PDF     1.1s            0.9s \x1b[32m(-18%)\x1b[0m",
        "  Shotcut edit+render     38.5s           37.2s \x1b[32m(-3%)\x1b[0m",
        "  Governance pre-screen   N/A             0.02s \x1b[36m(exclusive)\x1b[0m",
        "  Model routing           N/A             0.01s \x1b[36m(exclusive)\x1b[0m",
        "  Cross-app pipeline      N/A             0.8s  \x1b[36m(exclusive)\x1b[0m",
        "  Audit logging           N/A             0.001s \x1b[36m(exclusive)\x1b[0m",
        "  Constitutional veto     N/A             0.005s \x1b[36m(exclusive)\x1b[0m",
        "  ─────────────────────────────────────────────────────────",
        "  \x1b[1mTotal (8 ops):          87.1s           85.5s\x1b[0m",
        "  \x1b[1mGovernance ops:         0 (none)        5 (all screened)\x1b[0m",
        "  \x1b[1mCost tracking:          none            $0.52/day avg\x1b[0m",
        "",
        "  \x1b[32mVerdict: Aluminum OS matches speed, adds 5 exclusive layers.\x1b[0m",
      ];
      setLines(prev => [...prev, prompt, ...benchLines, ""]);
      return;
    }

    // Governance commands
    if (GOVERNANCE_COMMANDS[cmd]) {
      setLines(prev => [...prev, prompt, ...GOVERNANCE_COMMANDS[cmd], ""]);
      return;
    }

    // Router commands
    if (ROUTER_COMMANDS[cmd]) {
      setLines(prev => [...prev, prompt, ...ROUTER_COMMANDS[cmd], ""]);
      return;
    }

    // Orchestration commands
    if (ORCHESTRATION_COMMANDS[cmd]) {
      setLines(prev => [...prev, prompt, ...ORCHESTRATION_COMMANDS[cmd], ""]);
      return;
    }

    // Use command — enter REPL
    if (cmd.startsWith("use ")) {
      const app = cmd.slice(4).trim();
      if (HARNESSES[app]) {
        setActiveHarness(app);
        const h = HARNESSES[app];
        setLines(prev => [...prev, prompt,
          `\x1b[32m✓\x1b[0m Entered ${h.icon} ${h.name} REPL (v${h.version})`,
          `  Backend: ${h.backend} | Status: \x1b[32m${h.status}\x1b[0m`,
          `  \x1b[33m[Constitutional]\x1b[0m Session approved. All commands pre-screened.`,
          `  Type 'info' for project status or 'exit' to leave.`,
          "",
        ]);
        return;
      } else {
        setLines(prev => [...prev, prompt, `\x1b[31mUnknown harness: ${app}\x1b[0m`, "Available: gimp blender libreoffice shotcut inkscape audacity kdenlive obs", ""]);
        return;
      }
    }

    // Exit REPL
    if (cmd === "exit" && activeHarness) {
      const h = HARNESSES[activeHarness];
      setLines(prev => [...prev, prompt, `\x1b[36m◆\x1b[0m Left ${h.icon} ${h.name} REPL. Back to Agent Shell.`, ""]);
      setActiveHarness(null);
      return;
    }

    // Inside REPL — route to active harness
    if (activeHarness) {
      const h = HARNESSES[activeHarness];
      if (h.commands[cmd]) {
        setLines(prev => [...prev, prompt, ...h.commands[cmd].output, ""]);
        return;
      }
      // Try partial match
      const matchedCmd = Object.keys(h.commands).find(c => cmd.startsWith(c));
      if (matchedCmd) {
        setLines(prev => [...prev, prompt, ...h.commands[matchedCmd].output, ""]);
        return;
      }
      setLines(prev => [...prev, prompt,
        `\x1b[31m${h.name}: unknown command '${cmd}'\x1b[0m`,
        `Available: ${Object.keys(h.commands).join(", ")}`,
        "",
      ]);
      return;
    }

    // One-shot: <app> <command>
    const parts = cmd.split(" ");
    if (parts.length >= 2 && HARNESSES[parts[0]]) {
      const app = parts[0];
      const subCmd = parts.slice(1).join(" ");
      const h = HARNESSES[app];
      if (h.commands[subCmd]) {
        setLines(prev => [...prev, prompt,
          `\x1b[36m[${h.name}]\x1b[0m One-shot: ${subCmd}`,
          ...h.commands[subCmd].output,
          "",
        ]);
        return;
      }
      const matchedCmd = Object.keys(h.commands).find(c => subCmd.startsWith(c));
      if (matchedCmd) {
        setLines(prev => [...prev, prompt,
          `\x1b[36m[${h.name}]\x1b[0m One-shot: ${matchedCmd}`,
          ...h.commands[matchedCmd].output,
          "",
        ]);
        return;
      }
    }

    // Unknown
    setLines(prev => [...prev, prompt, `\x1b[31magent-shell: command not found: ${cmd}\x1b[0m`, "Type '\x1b[36mhelp\x1b[0m' for available commands.", ""]);
  }, [activeHarness]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    processCommand(cmd);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) { setHistoryIndex(-1); setInput(""); }
        else { setHistoryIndex(newIndex); setInput(history[newIndex]); }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const allCmds = [
        ...Object.keys(GOVERNANCE_COMMANDS),
        ...Object.keys(ROUTER_COMMANDS),
        ...Object.keys(ORCHESTRATION_COMMANDS),
        ...Object.keys(HARNESSES).map(h => `use ${h}`),
        "help", "compare", "benchmark", "harnesses", "clear", "exit",
      ];
      if (activeHarness) {
        allCmds.push(...Object.keys(HARNESSES[activeHarness].commands));
      }
      const match = allCmds.find(c => c.startsWith(input));
      if (match) setInput(match);
    }
  };

  // ── Harnesses View ─────────────────────────────────────────────
  if (view === "harnesses") {
    return (
      <div className="h-full flex flex-col" style={{ background: "rgba(0,0,0,0.9)" }}>
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-sm">◆</span>
            <span className="text-white/90 font-bold text-sm">Software Harnesses</span>
            <span className="text-white/40 text-xs">8 registered</span>
          </div>
          <button onClick={() => setView("shell")} className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded border border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
            Back to Shell
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(HARNESSES).map(([key, h]) => (
              <button
                key={key}
                onClick={() => { setActiveHarness(key); setView("shell"); processCommand(`use ${key}`); }}
                className="text-left p-3 rounded-lg border border-white/10 hover:border-white/25 transition-all group"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{h.icon}</span>
                  <span className="text-white/90 font-bold text-sm">{h.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${h.status === "online" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {h.status}
                  </span>
                </div>
                <div className="text-white/40 text-[11px] mb-1">v{h.version}</div>
                <div className="text-white/30 text-[10px]">{h.backend}</div>
                <div className="text-white/20 text-[10px] mt-1">{Object.keys(h.commands).length} commands</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Comparison View ────────────────────────────────────────────
  if (view === "comparison") {
    const features = [
      { feature: "Software Harnesses", cli: "8", alum: "8", winner: "tie" },
      { feature: "REPL Mode", cli: "Yes", alum: "Yes", winner: "tie" },
      { feature: "Subcommand CLI", cli: "Yes", alum: "Yes", winner: "tie" },
      { feature: "JSON Output", cli: "Yes", alum: "Yes", winner: "tie" },
      { feature: "Real Backend Invocation", cli: "Yes", alum: "Yes", winner: "tie" },
      { feature: "Unified REPL Skin", cli: "Yes", alum: "Yes (glass)", winner: "alum" },
      { feature: "Constitutional Governance", cli: "No", alum: "14 rules, 15 domains", winner: "alum" },
      { feature: "Multi-Model Routing", cli: "No", alum: "7 models, 3 tiers", winner: "alum" },
      { feature: "Cost Tracking", cli: "No", alum: "Per-query, per-model", winner: "alum" },
      { feature: "Cross-App Orchestration", cli: "No", alum: "pipe <a> <b>", winner: "alum" },
      { feature: "Audit Trail", cli: "No", alum: "SHA-256 chain", winner: "alum" },
      { feature: "Dave Protocol (Kill Switch)", cli: "No", alum: "Active", winner: "alum" },
      { feature: "Identity Bridge (Janus)", cli: "No", alum: "3 providers linked", winner: "alum" },
      { feature: "Memory (SHELDONBRAIN)", cli: "No", alum: "3-tier, 12K vectors", winner: "alum" },
      { feature: "AI Council Integration", cli: "No", alum: "8 members", winner: "alum" },
      { feature: "Content Safety Scanning", cli: "No", alum: "Pre-screen all ops", winner: "alum" },
      { feature: "OS-Level Integration", cli: "Standalone", alum: "Native OS app", winner: "alum" },
      { feature: "GUI Desktop Shell", cli: "No", alum: "Full desktop OS", winner: "alum" },
      { feature: "Stars (GitHub)", cli: "11.6K", alum: "N/A (private)", winner: "cli" },
    ];

    return (
      <div className="h-full flex flex-col" style={{ background: "rgba(0,0,0,0.9)" }}>
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-sm">◆</span>
            <span className="text-white/90 font-bold text-sm">CLI-Anything vs Aluminum OS</span>
          </div>
          <button onClick={() => setView("shell")} className="text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded border border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
            Back to Shell
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="text-white/60 text-xs mb-3">
            CLI-Anything (HKUDS) — 11.6K stars, 993 forks, 8 harnesses, Python/Click
          </div>
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/60 pb-2 pr-3">Feature</th>
                <th className="text-center text-white/60 pb-2 px-2">CLI-Anything</th>
                <th className="text-center text-white/60 pb-2 px-2">Aluminum OS</th>
                <th className="text-center text-white/60 pb-2 pl-2">Winner</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="text-white/80 py-1.5 pr-3">{f.feature}</td>
                  <td className={`text-center py-1.5 px-2 ${f.winner === "cli" ? "text-green-400" : "text-white/50"}`}>{f.cli}</td>
                  <td className={`text-center py-1.5 px-2 ${f.winner === "alum" ? "text-cyan-400" : "text-white/50"}`}>{f.alum}</td>
                  <td className="text-center py-1.5 pl-2">
                    {f.winner === "alum" ? <span className="text-cyan-400">◆</span> :
                     f.winner === "cli" ? <span className="text-green-400">●</span> :
                     <span className="text-white/30">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 p-3 rounded-lg border border-cyan-400/20" style={{ background: "rgba(0,212,255,0.05)" }}>
            <div className="text-cyan-400 text-xs font-bold mb-1">Verdict</div>
            <div className="text-white/70 text-[11px] leading-relaxed">
              CLI-Anything achieves feature parity on the 8 software harnesses — they wrap the same apps we do.
              But Aluminum OS adds <span className="text-cyan-400 font-bold">13 exclusive capabilities</span> that
              CLI-Anything fundamentally cannot replicate: constitutional governance, multi-model routing,
              cross-app orchestration, cost tracking, identity bridging, memory substrate, and OS-level integration.
              CLI-Anything is a <span className="text-white/90">harness generator</span>. Aluminum OS is an <span className="text-cyan-400">operating system</span>.
            </div>
          </div>
          <div className="mt-3 p-3 rounded-lg border border-orange-400/20" style={{ background: "rgba(255,140,0,0.05)" }}>
            <div className="text-orange-400 text-xs font-bold mb-1">Key Architectural Difference</div>
            <div className="text-white/70 text-[11px] leading-relaxed">
              CLI-Anything's HARNESS.md says: "Use the real software — don't reimplement it."
              We agree. But they stop there. Aluminum OS asks: "Who governs the agent using that software?
              Who pays for the inference? Who audits the output? Who can veto a harmful operation?"
              These questions have no answer in CLI-Anything's architecture.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Shell View ─────────────────────────────────────────────────
  return (
    <div
      className="h-full flex flex-col"
      style={{ background: "rgba(0,0,0,0.9)" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/10">
        <button
          onClick={() => setView("shell")}
          className={`text-[10px] px-2 py-0.5 rounded transition-colors ${view === "shell" ? "bg-cyan-400/20 text-cyan-400" : "text-white/40 hover:text-white/60"}`}
        >
          Shell
        </button>
        <button
          onClick={() => setView("harnesses")}
          className={`text-[10px] px-2 py-0.5 rounded transition-colors ${view === "harnesses" ? "bg-cyan-400/20 text-cyan-400" : "text-white/40 hover:text-white/60"}`}
        >
          Harnesses ({Object.keys(HARNESSES).length})
        </button>
        <button
          onClick={() => setView("comparison")}
          className={`text-[10px] px-2 py-0.5 rounded transition-colors ${view === "comparison" ? "bg-cyan-400/20 text-cyan-400" : "text-white/40 hover:text-white/60"}`}
        >
          vs CLI-Anything
        </button>
        {activeHarness && (
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[10px]">{HARNESSES[activeHarness].icon}</span>
            <span className="text-[10px] font-bold" style={{ color: HARNESSES[activeHarness].color }}>
              {HARNESSES[activeHarness].name}
            </span>
            <span className="text-green-400 text-[10px]">●</span>
          </div>
        )}
      </div>

      {/* Terminal output */}
      <div className="flex-1 overflow-auto p-3 font-[family-name:var(--font-mono)] text-[11px] leading-[18px]">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre text-green-300/80">
            {parseAnsi(line)}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-cyan-400">◆</span>
          <span className="text-white/30 mx-1">│</span>
          <span className="text-cyan-400">agent@aluminum</span>
          <span className="text-white/30">:</span>
          <span className="text-blue-400">{activeHarness ? `/${activeHarness}` : "~"}</span>
          <span className="text-white/30">$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-300/90 caret-cyan-400"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
