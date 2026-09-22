import React, { useState } from 'react';
import { SupersetMovement, SupersetSetLog, WeekMeta, CalculatedTarget } from '../types';
import { ExerciseGraphic } from './ExerciseGraphic';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface SupersetCardProps {
  superset: SupersetMovement;
  supersetIndex: number;
  savedSets: SupersetSetLog[];
  meta: WeekMeta;
  targetA: CalculatedTarget;
  targetB: CalculatedTarget;
  onSaveSupersetSet: (setIdx: number, field: keyof SupersetSetLog, value: any) => void;
  onAutofill: () => void;
  onAskAi: (exerciseName: string) => void;
}

export const SupersetCard: React.FC<SupersetCardProps> = ({
  superset,
  savedSets,
  meta,
  targetA,
  targetB,
  onSaveSupersetSet,
  onAutofill,
  onAskAi,
}) => {
  const [showGraphics, setShowGraphics] = useState(false);

  return (
    <div className="bg-slate-900 border border-amber-400/40 rounded-2xl p-4 space-y-3.5 shadow-xl shadow-amber-400/5 relative overflow-hidden">
      {/* Visual Indicator of Agonist-Antagonist pairing */}
      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400/20 to-transparent w-24 h-6 pointer-events-none" />

      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              AGONIST-ANTAGONIST SUPERSET
            </span>
            <h3 className="font-bold text-slate-100 text-sm">
              {superset.name}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            {superset.notes}
          </p>
          <p className="text-[10px] text-amber-300/80 italic">
            🔬 {superset.researchRationale}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded-lg text-amber-400 border border-slate-700">
            {superset.sets} Pairs
          </span>
          <button
            onClick={() => setShowGraphics(!showGraphics)}
            className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-0.5"
          >
            <span>{showGraphics ? 'Hide Anatomy' : 'View Anatomy'}</span>
            {showGraphics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Dual Anatomy Graphics */}
      {showGraphics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <ExerciseGraphic
            primaryMuscles={superset.moveA.primaryMuscles}
            secondaryMuscles={superset.moveA.secondaryMuscles}
            movementName={superset.moveA.name}
            tempo={superset.moveA.tempo}
            lengthenedTip={superset.moveA.lengthenedPositionTip}
          />
          <ExerciseGraphic
            primaryMuscles={superset.moveB.primaryMuscles}
            secondaryMuscles={superset.moveB.secondaryMuscles}
            movementName={superset.moveB.name}
            tempo={superset.moveB.tempo}
            lengthenedTip={superset.moveB.lengthenedPositionTip}
          />
        </div>
      )}

      {/* Dual Directives with Auto-Fill */}
      <div className="text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 font-medium">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 flex-1">
            <div className="text-amber-400 flex items-center gap-1.5 leading-snug">
              <span className="text-xs">⚡</span>
              <span><strong>1. {superset.moveA.name}:</strong> {targetA.directiveText}</span>
              {targetA.prescribedWeight !== undefined && (
                <span className="bg-amber-400 text-slate-950 px-1 py-0.2 rounded text-[9px] font-black">
                  {targetA.prescribedWeight} lbs
                </span>
              )}
            </div>
            <div className="text-amber-300/90 flex items-center gap-1.5 leading-snug">
              <span className="text-xs">⚡</span>
              <span><strong>2. {superset.moveB.name}:</strong> {targetB.directiveText}</span>
              {targetB.prescribedWeight !== undefined && (
                <span className="bg-amber-400 text-slate-950 px-1 py-0.2 rounded text-[9px] font-black">
                  {targetB.prescribedWeight} lbs
                </span>
              )}
            </div>
          </div>
          {(targetA.hasBaseline || targetB.hasBaseline) && (
            <button
              onClick={onAutofill}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black px-2 py-1 rounded-lg flex-shrink-0 active:scale-95 transition-all shadow-sm"
              title="Auto-fill both targets into this superset"
            >
              Auto-Fill
            </button>
          )}
        </div>
      </div>

      {/* Set Rows */}
      <div className="space-y-2.5">
        {Array.from({ length: superset.sets }).map((_, sIdx) => {
          const setNum = sIdx + 1;
          const sLog = savedSets[sIdx] || {
            weightA: '', repsA: '', weightB: '', repsB: '', rpe: ''
          };

          return (
            <div
              key={sIdx}
              className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 shadow-inner"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-xs font-black text-amber-400 tracking-wider">
                  PAIR {setNum}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">RPE</span>
                  <input
                    type="number"
                    step="0.5"
                    min="5"
                    max="10"
                    placeholder={String(meta.targetRpe)}
                    value={sLog.rpe ?? ''}
                    onChange={(e) => onSaveSupersetSet(sIdx, 'rpe', e.target.value)}
                    className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-center font-bold text-amber-400 text-xs font-mono focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Movement A */}
              <div className="grid grid-cols-12 gap-2 items-center text-xs">
                <div className="col-span-5 min-w-0">
                  <span className="font-bold text-slate-200 block truncate text-[11px]" title={superset.moveA.name}>
                    1. {superset.moveA.name}
                  </span>
                </div>
                <div className="col-span-4 flex items-center bg-slate-900 rounded-lg border border-slate-800 px-2 py-1.5 focus-within:border-amber-400">
                  <input
                    type="number"
                    step="any"
                    placeholder={targetA.prescribedWeight !== undefined ? `⚡ ${targetA.prescribedWeight}` : 'lbs'}
                    value={sLog.weightA ?? ''}
                    onChange={(e) => onSaveSupersetSet(sIdx, 'weightA', e.target.value)}
                    className="w-full bg-transparent text-center text-slate-100 outline-none font-mono text-xs placeholder:text-slate-600"
                  />
                  <span className="text-[10px] text-slate-500 font-mono ml-1">lbs</span>
                </div>
                <div className="col-span-3 flex items-center bg-slate-900 rounded-lg border border-slate-800 px-2 py-1.5 focus-within:border-amber-400">
                  <input
                    type="text"
                    placeholder={targetA.prescribedReps || superset.moveA.targetReps}
                    value={sLog.repsA ?? ''}
                    onChange={(e) => onSaveSupersetSet(sIdx, 'repsA', e.target.value)}
                    className="w-full bg-transparent text-center text-slate-100 outline-none font-mono text-xs placeholder:text-slate-600"
                  />
                  <span className="text-[10px] text-slate-500 font-mono ml-1">reps</span>
                </div>
              </div>

              {/* Movement B */}
              <div className="grid grid-cols-12 gap-2 items-center text-xs">
                <div className="col-span-5 min-w-0">
                  <span className="font-bold text-slate-200 block truncate text-[11px]" title={superset.moveB.name}>
                    2. {superset.moveB.name}
                  </span>
                </div>
                <div className="col-span-4 flex items-center bg-slate-900 rounded-lg border border-slate-800 px-2 py-1.5 focus-within:border-amber-400">
                  <input
                    type="number"
                    step="any"
                    placeholder={targetB.prescribedWeight !== undefined ? `⚡ ${targetB.prescribedWeight}` : 'lbs'}
                    value={sLog.weightB ?? ''}
                    onChange={(e) => onSaveSupersetSet(sIdx, 'weightB', e.target.value)}
                    className="w-full bg-transparent text-center text-slate-100 outline-none font-mono text-xs placeholder:text-slate-600"
                  />
                  <span className="text-[10px] text-slate-500 font-mono ml-1">lbs</span>
                </div>
                <div className="col-span-3 flex items-center bg-slate-900 rounded-lg border border-slate-800 px-2 py-1.5 focus-within:border-amber-400">
                  <input
                    type="text"
                    placeholder={targetB.prescribedReps || superset.moveB.targetReps}
                    value={sLog.repsB ?? ''}
                    onChange={(e) => onSaveSupersetSet(sIdx, 'repsB', e.target.value)}
                    className="w-full bg-transparent text-center text-slate-100 outline-none font-mono text-xs placeholder:text-slate-600"
                  />
                  <span className="text-[10px] text-slate-500 font-mono ml-1">reps</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
