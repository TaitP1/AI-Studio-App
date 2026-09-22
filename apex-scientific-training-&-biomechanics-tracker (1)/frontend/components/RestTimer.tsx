import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export const RestTimer: React.FC = () => {
  const [targetSeconds, setTargetSeconds] = useState(90);
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      // Haptic vibration feedback
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([250, 100, 250, 100, 400]);
      }
      // Play a quick web audio synth beep
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch (e) {
        // audio context not allowed without direct interaction
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const toggleTimer = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(targetSeconds);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const setPreset = (sec: number) => {
    setTargetSeconds(sec);
    setSecondsLeft(sec);
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(targetSeconds);
  };

  const progressPct = ((targetSeconds - secondsLeft) / targetSeconds) * 100;

  return (
    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
      <button
        onClick={toggleTimer}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-mono font-bold transition-all ${
          isRunning
            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
            : secondsLeft === 0
            ? 'bg-emerald-500 text-slate-950 font-black animate-pulse'
            : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
        }`}
        title="Toggle Rest Timer"
      >
        <Timer className="w-3.5 h-3.5" />
        <span>{secondsLeft === 0 ? "GO!" : `${secondsLeft}s`}</span>
      </button>

      {/* Quick Interval Preset Buttons */}
      <div className="hidden sm:flex items-center gap-1">
        {[60, 90, 120, 180].map((s) => (
          <button
            key={s}
            onClick={() => setPreset(s)}
            className={`px-1.5 py-1 text-[10px] font-mono rounded ${
              targetSeconds === s && isRunning
                ? 'bg-amber-400/20 text-amber-300 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s}s
          </button>
        ))}
      </div>

      {isRunning && (
        <button
          onClick={resetTimer}
          className="p-1.5 text-slate-400 hover:text-slate-200"
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
