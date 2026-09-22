import React from 'react';
import { LogsDatabase } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { X, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

interface AnalyticsModalProps {
  logs: LogsDatabase;
  totalWeeks: number;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ logs, totalWeeks, onClose }) => {
  // Aggregate weekly volume load (Total weight * reps)
  const chartData = [];
  let totalWorkoutsCompleted = 0;

  for (let w = 1; w <= 16; w++) {
    let weekVolume = 0;
    let completedInWeek = 0;

    for (let d = 0; d < 4; d++) {
      const key = `w${w}_d${d}`;
      const log = logs[key];
      if (log && log.completed) {
        completedInWeek++;
        totalWorkoutsCompleted++;
      }
      if (log && log.exercises) {
        Object.values(log.exercises).forEach((ex) => {
          if (ex.sets) {
            ex.sets.forEach((s: any) => {
              if (s.weight && s.reps) {
                weekVolume += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
              } else if (s.weightA && s.repsA) {
                weekVolume += (parseFloat(s.weightA) || 0) * (parseFloat(s.repsA) || 0);
                weekVolume += (parseFloat(s.weightB) || 0) * (parseFloat(s.repsB) || 0);
              }
            });
          }
        });
      }
    }

    chartData.push({
      week: `Wk ${w}`,
      volume: Math.round(weekVolume),
      completedSessions: completedInWeek
    });
  }

  const totalPossible = totalWeeks * 4;
  const adherencePct = Math.round((totalWorkoutsCompleted / totalPossible) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-100">
                Progression & Volume Analytics
              </h2>
              <p className="text-[11px] text-slate-400">
                Tracking cumulative workload (lbs × reps)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Key Stats Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Adherence</span>
              <span className="text-lg font-black text-amber-400 font-mono">{adherencePct}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Completed</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{totalWorkoutsCompleted}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Program Goal</span>
              <span className="text-lg font-black text-sky-400 font-mono">160 Sessions</span>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200">Volume Load Progression</span>
              <span className="text-[10px] text-slate-500 font-mono">lbs lifted</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="volume" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Science Insights */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-slate-300 space-y-1.5 leading-relaxed">
            <div className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
              <Award className="w-3.5 h-3.5" />
              <span>Hypertrophy Volume Thresholds</span>
            </div>
            <p className="text-[11px]">
              Research highlights that 10–20 hard sets per muscle group per week represents the ideal hypertrophic sweet spot. Use Deload weeks (every 4th week) to purge accumulated systemic fatigue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
