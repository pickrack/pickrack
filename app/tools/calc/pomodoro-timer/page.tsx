"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Settings, Bell, BellOff } from "lucide-react";

type Phase = "work" | "short-break" | "long-break";

const PHASE_LABEL: Record<Phase, string> = {
  "work": "Focus",
  "short-break": "Short break",
  "long-break": "Long break",
};

const PHASE_COLOR: Record<Phase, { ring: string; bg: string; text: string }> = {
  "work":        { ring: "stroke-rose-500",    bg: "bg-rose-50",    text: "text-rose-700" },
  "short-break": { ring: "stroke-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  "long-break":  { ring: "stroke-sky-500",     bg: "bg-sky-50",     text: "text-sky-700" },
};

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.2;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => { o.frequency.value = 1320; }, 200);
    setTimeout(() => { o.stop(); ctx.close(); }, 600);
  } catch { /* ignore */ }
}

export default function PomodoroPage() {
  const [workMin, setWorkMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);
  const [cyclesBeforeLong, setCyclesBeforeLong] = useState(4);
  const [soundOn, setSoundOn] = useState(true);
  const [notifyOn, setNotifyOn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [phase, setPhase] = useState<Phase>("work");
  const [remaining, setRemaining] = useState(workMin * 60);
  const [running, setRunning] = useState(false);
  const [completedWork, setCompletedWork] = useState(0);
  const [totalFocusMin, setTotalFocusMin] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phaseDuration = useCallback((p: Phase) => {
    if (p === "work") return workMin * 60;
    if (p === "short-break") return shortMin * 60;
    return longMin * 60;
  }, [workMin, shortMin, longMin]);

  // Sync remaining when settings change while not running
  useEffect(() => {
    if (!running) setRemaining(phaseDuration(phase));
  }, [phase, phaseDuration, running]);

  const advance = useCallback(() => {
    if (soundOn) playBeep();
    if (notifyOn && "Notification" in window && Notification.permission === "granted") {
      new Notification(`${PHASE_LABEL[phase]} complete`, { body: "Time for the next phase." });
    }
    if (phase === "work") {
      const newCompleted = completedWork + 1;
      setCompletedWork(newCompleted);
      setTotalFocusMin((t) => t + workMin);
      const next: Phase = newCompleted % cyclesBeforeLong === 0 ? "long-break" : "short-break";
      setPhase(next);
      setRemaining(phaseDuration(next));
    } else {
      setPhase("work");
      setRemaining(workMin * 60);
    }
  }, [phase, completedWork, cyclesBeforeLong, workMin, phaseDuration, soundOn, notifyOn]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // Use setTimeout to call advance after state settles
          setTimeout(advance, 0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, advance]);

  // Update browser tab title with countdown
  useEffect(() => {
    if (running) {
      document.title = `${fmtTime(remaining)} · ${PHASE_LABEL[phase]} · Pomodoro`;
    } else {
      document.title = "Pomodoro Timer · Pickrack";
    }
    return () => { document.title = "Pomodoro Timer · Pickrack"; };
  }, [remaining, phase, running]);

  const toggleRun = () => {
    if (!running && notifyOn && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setRunning(!running);
  };

  const reset = () => {
    setRunning(false);
    setPhase("work");
    setRemaining(workMin * 60);
    setCompletedWork(0);
    setTotalFocusMin(0);
  };

  const skipPhase = () => {
    setRunning(false);
    advance();
  };

  const enableNotify = async () => {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifyOn(perm === "granted");
  };

  const total = phaseDuration(phase);
  const progress = total > 0 ? (total - remaining) / total : 0;
  const colors = PHASE_COLOR[phase];

  // Circular ring
  const radius = 130;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ * (1 - progress);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Pomodoro Timer</h1>
        <p className="mt-3 text-gray-600">
          25-minute focus, 5-minute break, repeat. Long break every 4 cycles. Browser tab updates with countdown.
        </p>
      </div>

      <div className={`rounded-2xl border p-8 ${colors.bg} mb-4`} style={{ borderColor: "var(--color-border)" }}>
        <div className="text-center mb-3">
          <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white ${colors.text}`}>
            {PHASE_LABEL[phase]} · Cycle {Math.floor(completedWork / cyclesBeforeLong) + 1} · {completedWork % cyclesBeforeLong}/{cyclesBeforeLong}
          </span>
        </div>

        <div className="relative w-72 h-72 mx-auto">
          <svg viewBox="0 0 300 300" className="-rotate-90">
            <circle cx="150" cy="150" r={radius} fill="none" stroke="white" strokeWidth="14" />
            <circle
              cx="150" cy="150" r={radius}
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
              className={colors.ring}
              style={{ strokeDasharray: circ, strokeDashoffset: dashOffset, transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-mono text-6xl font-bold text-gray-900">{fmtTime(remaining)}</p>
            <p className="text-xs text-gray-500 mt-1">{Math.round(progress * 100)}% complete</p>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={toggleRun}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 text-sm font-semibold"
          >
            {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
          </button>
          <button
            onClick={skipPhase}
            className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium hover:border-indigo-400"
            style={{ borderColor: "var(--color-border)" }}
          >
            Skip
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium hover:border-indigo-400"
            style={{ borderColor: "var(--color-border)" }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <Stat label="Completed cycles" value={completedWork.toString()} />
        <Stat label="Total focus time" value={`${totalFocusMin} min`} />
        <Stat label="Current phase" value={PHASE_LABEL[phase]} />
      </div>

      <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 inline-flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </p>
          <button onClick={() => setShowSettings(!showSettings)} className="text-xs text-indigo-700">
            {showSettings ? "Hide" : "Customize"}
          </button>
        </div>

        {showSettings && (
          <div className="space-y-4 mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="grid sm:grid-cols-3 gap-3">
              <DurField label="Focus (min)" value={workMin} onChange={setWorkMin} max={120} />
              <DurField label="Short break (min)" value={shortMin} onChange={setShortMin} max={30} />
              <DurField label="Long break (min)" value={longMin} onChange={setLongMin} max={60} />
            </div>
            <DurField label="Cycles before long break" value={cyclesBeforeLong} onChange={setCyclesBeforeLong} max={10} />
            <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={soundOn} onChange={(e) => setSoundOn(e.target.checked)} className="accent-indigo-600" />
                <Bell className="w-4 h-4 text-gray-500" /> Sound on phase change
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={notifyOn}
                  onChange={(e) => { if (e.target.checked) enableNotify(); else setNotifyOn(false); }}
                  className="accent-indigo-600"
                />
                {notifyOn ? <Bell className="w-4 h-4 text-gray-500" /> : <BellOff className="w-4 h-4 text-gray-500" />}
                Browser notification {notifyOn ? "" : "(needs permission)"}
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-3 text-center" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function DurField({ label, value, onChange, max }: { label: string; value: number; onChange: (v: number) => void; max: number }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-700 mb-1 block">{label}</label>
      <input
        type="number"
        min={1}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(1, Math.min(max, parseInt(e.target.value, 10) || 1)))}
        className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none"
        style={{ borderColor: "var(--color-border)" }}
      />
    </div>
  );
}
