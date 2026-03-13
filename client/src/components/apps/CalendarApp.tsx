import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const events = [
  { title: "Council Session: Grok Review", time: "9:00 AM", duration: "1h", color: "#ff4444", provider: "Google" },
  { title: "Architecture Sync w/ Copilot", time: "11:00 AM", duration: "30m", color: "#9b59b6", provider: "Microsoft" },
  { title: "Gemini Synthesis Review", time: "2:00 PM", duration: "45m", color: "#00ff88", provider: "Google" },
  { title: "Push to GitHub — Deadline", time: "4:00 PM", duration: "15m", color: "#00d4ff", provider: "Google" },
  { title: "GPT Timeout Expires", time: "6:00 PM", duration: "—", color: "#ffd700", provider: "Microsoft" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarApp() {
  const [currentDate] = useState(new Date(2026, 2, 9));
  const month = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  return (
    <div className="h-full flex">
      {/* Calendar grid */}
      <div className="flex-1 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold font-[family-name:var(--font-display)] text-foreground/90">{month}</h2>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 rounded-md hover:bg-white/5 flex items-center justify-center">
              <ChevronLeft className="w-3.5 h-3.5 text-foreground/50" />
            </button>
            <button className="px-2 py-0.5 rounded-md text-[10px] text-cyan-400 hover:bg-white/5">Today</button>
            <button className="w-6 h-6 rounded-md hover:bg-white/5 flex items-center justify-center">
              <ChevronRight className="w-3.5 h-3.5 text-foreground/50" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px">
          {days.map(d => (
            <div key={d} className="text-center text-[9px] text-foreground/30 py-1 font-[family-name:var(--font-display)]">{d}</div>
          ))}
          {cells.map((day, i) => (
            <div
              key={i}
              className={`h-16 p-1 rounded-md text-[10px] ${day === 9 ? "bg-cyan-500/10 ring-1 ring-cyan-500/30" : "hover:bg-white/3"} transition-colors`}
            >
              {day && (
                <>
                  <span className={`${day === 9 ? "text-cyan-400 font-bold" : "text-foreground/50"}`}>{day}</span>
                  {day === 9 && (
                    <div className="mt-0.5 space-y-px">
                      <div className="h-1 rounded-full bg-red-400/60 w-full" />
                      <div className="h-1 rounded-full bg-purple-400/60 w-full" />
                      <div className="h-1 rounded-full bg-green-400/60 w-3/4" />
                    </div>
                  )}
                  {day === 10 && <div className="h-1 rounded-full bg-cyan-400/40 w-1/2 mt-0.5" />}
                  {day === 12 && <div className="h-1 rounded-full bg-amber-400/40 w-2/3 mt-0.5" />}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-3">
          {["Google Calendar", "Outlook", "iCloud"].map((cal, i) => (
            <div key={cal} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-blue-400" : i === 1 ? "bg-purple-400" : "bg-gray-400"}`} />
              <span className="text-[9px] text-foreground/30">{cal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's events */}
      <div className="w-56 glass-heavy border-l border-white/5 p-3">
        <h3 className="text-[10px] uppercase tracking-wider text-foreground/40 font-[family-name:var(--font-display)]">Today — March 9</h3>
        <div className="mt-3 space-y-2">
          {events.map((event, i) => (
            <div key={i} className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 rounded-full" style={{ background: event.color }} />
                <div>
                  <p className="text-[11px] text-foreground/80 font-medium">{event.title}</p>
                  <p className="text-[9px] text-foreground/35">{event.time} — {event.duration} — {event.provider}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
