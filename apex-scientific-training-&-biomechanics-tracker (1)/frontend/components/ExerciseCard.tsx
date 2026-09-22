import React, { useState } from 'react';
import { ExerciseMovement, SetLog, WeekMeta, CalculatedTarget } from '../types';
import { ExerciseGraphic } from './ExerciseGraphic';
import { RefreshCw, ChevronDown, ChevronUp, Check, Sparkles, Zap } from 'lucide-react';

interface ExerciseCardProps {
  exercise: ExerciseMovement;
  exerciseIndex: number;
  savedSets: SetLog[];
  meta: WeekMeta;
  target: CalculatedTarget;
  onSaveSet: (setIdx: number, field: keyof SetLog, value: any) => void;
  onAutofill: () => void;
  onSwapExercise: (index: number) => void;
  onAskAi: (exerciseName: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  exerciseIndex,
  savedSets,
  meta,
  target,
  onSaveSet,
  onAutofill,
  onSwapExercise,
  onAskAi,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isPhase2 = meta.phase === 2;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-lg transition-all hover:border-slate-700">
      {/* Exercise Title & Controls */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">
              {exercise.name}
            </h3>
            {exercise.alternatives && exercise.alternatives.length > 0 && (
              <button
                onClick={() => onSwapExercise(exerciseIndex)}
                className="text-[10px] text-amber-400 hover:text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors"
                title="Swap with evidence-based alternative"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Swap</span>
              </button>
            )}
            <button
              onClick={() => onAskAi(exercise.name)}
              className="text-[10px] text-purple-400 hover:text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors"
              title="Get AI Biomechanics Form Check"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>AI Coach</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {exercise.researchNote}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700">
            {exercise.defaultSets} × {exercise.targetReps}
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-0.5"
          >
            <span>{showDetails ? 'Hide' : 'Anatomy'}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Embedded Anatomy Graphic & Biomechanics */}
      {showDetails && (
        <ExerciseGraphic
          primaryMuscles={exercise.primaryMuscles}
          secondaryMuscles={exercise.secondaryMuscles}
          movementName={exercise.name}
          tempo={exercise.tempo}
          lengthenedTip={exercise.lengthenedPositionTip}
        />
      )}

      {/* Overload Directive Pill with 1-Click Auto-Fill */}
      <div
        className={`text-[11px] p-2.5 rounded-xl border flex items-center justify-between gap-2 font-medium ${
          target.isDeload
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : isPhase2
            ? 'bg-sky-950/40 border-sky-500/30 text-sky-300'
            : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-2 leading-tight">
          <Zap className="w-4 h-4 flex-shrink-0 text-amber-400 fill-amber-400" />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <strong className="uppercase font-bold tracking-wider text-[10px] opacity-90">
                {target.hasBaseline ? `RPE Overload Target:` : `Baseline Establishment:`}
              </strong>
              {target.prescribedWeight !== undefined && (
                <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-black font-mono">
                  ⚡ {target.prescribedWeight} lbs ({target.deltaText})
                </span>
              )}
            </div>
            <span className="text-[11px] opacity-90 block mt-0.5">{target.directiveText}</span>
          </div>
        </div>

        {target.hasBaseline && (
          <button
            onClick={onAutofill}
            className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black px-2 py-1.5 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            title="Auto-fill this target into your sets"
          >
            <span>Auto-Fill</span>
          </button>
        )}
      </div>

      {/* Set Logging Rows */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-12 gap-2 text-[10px] text-slate-500 uppercase font-bold text-center px-1">
          <span className="col-span-2 text-left">Set</span>
          <span className="col-span-4">Weight (lbs)</span>
          <span className="col-span-3">Reps</span>
          <span className="col-span-3">RPE (1-10)</span>
        </div>

        {Array.from({ length: exercise.defaultSets }).map((_, sIdx) => {
          const setNumber = sIdx + 1;
          const sLog = savedSets[sIdx] || { weight: '', reps: '', rpe: '', completed: false };
          const isDone = Boolean(sLog.weight !== '' && sLog.reps !== '');

          return (
            <div
              key={sIdx}
              className={`grid grid-cols-12 gap-2 items-center text-xs p-1 rounded-xl transition-all ${
                isDone ? 'bg-slate-950/80 border border-slate-800' : 'bg-slate-950/40'
              }`}
            >
              <div className="col-span-2 flex items-center gap-1 font-bold text-slate-400 pl-1">
                <span>{setNumber}</span>
                {isDone && <Check className="w-3 h-3 text-emerald-400" />}
              </div>

              <div className="col-span-4">
                <input
                  type="number"
                  step="any"
                  placeholder={target.prescribedWeight !== undefined ? `⚡ ${target.prescribedWeight}` : 'lbs'}
                  value={sLog.weight ?? ''}
                  onChange={(e) => onSaveSet(sIdx, 'weight', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 text-center text-slate-100 font-mono focus:border-amber-400 focus:outline-none text-xs placeholder:text-slate-600"
                />
              </div>

              <div className="col-span-3">
                <input
                  type="text"
                  placeholder={target.prescribedReps || exercise.targetReps}
                  value={sLog.reps ?? ''}
                  onChange={(e) => onSaveSet(sIdx, 'reps', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 text-center text-slate-100 font-mono focus:border-amber-400 focus:outline-none text-xs placeholder:text-slate-600"
                />
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="10"
                  placeholder={String(meta.targetRpe)}
                  value={sLog.rpe ?? ''}
                  onChange={(e) => onSaveSet(sIdx, 'rpe', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 text-center font-bold text-amber-400 font-mono focus:border-amber-400 focus:outline-none text-xs placeholder:text-amber-400/40"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
