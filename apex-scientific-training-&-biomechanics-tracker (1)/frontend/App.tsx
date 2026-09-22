import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LogsDatabase, WeekMeta, ExerciseMovement, SupersetMovement, CalculatedTarget } from './types';
import { buildWorkoutDays, EXERCISE_DATABASE } from './constants/exerciseData';
import { ExerciseCard } from './components/ExerciseCard';
import { SupersetCard } from './components/SupersetCard';
import { RestTimer } from './components/RestTimer';
import { AiCoachModal } from './components/AiCoachModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { 
  Flame, 
  CheckCircle, 
  Download, 
  Upload, 
  Trash2, 
  BarChart3, 
  Smartphone, 
  Sparkles,
  Zap,
  RotateCw
} from 'lucide-react';

const TOTAL_WEEKS = 40;

export default function App() {
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [logs, setLogs] = useState<LogsDatabase>(() => {
    try {
      const saved = localStorage.getItem('apex_logs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [aiExerciseName, setAiExerciseName] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);

  // Synchronize state with LocalStorage
  useEffect(() => {
    localStorage.setItem('apex_logs', JSON.stringify(logs));
  }, [logs]);

  // Compute Meta for current week
  const meta: WeekMeta = useMemo(() => {
    const isPhase2 = currentWeek > 23;
    const phase = isPhase2 ? 2 : 1;
    const effectiveWeek = isPhase2 ? currentWeek - 23 : currentWeek;
    const cycle = Math.ceil(effectiveWeek / 4);
    const posInCycle = ((effectiveWeek - 1) % 4) + 1;

    let rotationKey: 'A' | 'B' | 'C' | 'Deload' = 'A';
    let rotationName = 'Rotation A';
    let targetRpe = 8;
    let typeDesc = 'Volume Accumulation';
    let researchFocus = 'Stretch-Mediated Hypertrophy & Motor Recruitment';

    if (posInCycle === 4) {
      rotationKey = 'Deload';
      rotationName = 'Deload & Joint Recovery';
      targetRpe = 6;
      typeDesc = 'Active Deload & Connective Tissue Restoration';
      researchFocus = 'Systemic fatigue reduction & glycogen replenishment';
    } else if (posInCycle === 1) {
      rotationKey = 'A';
      rotationName = 'Rotation A (Hypertrophy & Supersets)';
      targetRpe = currentWeek === 1 ? 7 : 7.5;
      typeDesc = currentWeek === 1 ? 'Baseline Benchmark' : 'Volume Accumulation';
      researchFocus = 'Agonist-antagonist pairing & deep lengthened pauses';
    } else if (posInCycle === 2) {
      rotationKey = 'B';
      rotationName = 'Rotation B (Heavy Strength & Low Reps)';
      targetRpe = 8.5;
      typeDesc = 'Load Progression';
      researchFocus = 'High mechanical tension & myofibrillar cross-sectional area';
    } else if (posInCycle === 3) {
      rotationKey = 'C';
      rotationName = 'Rotation C (Density & Unilateral Balance)';
      targetRpe = 9;
      typeDesc = 'Peak Overload';
      researchFocus = 'Unilateral stabilization & metabolic stress accumulation';
    }

    const phaseName = isPhase2
      ? "Phase 2: Functional Power & Capacity (Mar '27 - Jun '27)"
      : "Phase 1: Hypertrophy & Overload (Sep '26 - Feb '27)";

    return {
      week: currentWeek,
      phase,
      phaseName,
      cycle,
      posInCycle,
      rotationKey,
      rotationName,
      targetRpe,
      typeDesc,
      researchFocus,
    };
  }, [currentWeek]);

  // Generate the active days for current rotation
  const workoutDays = useMemo(() => {
    return buildWorkoutDays(meta.rotationKey);
  }, [meta.rotationKey]);

  const activeDay = workoutDays[currentDay] || workoutDays[0];
  const dayKey = `w${currentWeek}_d${currentDay}`;
  const currentDayLog = logs[dayKey] || { completed: false, exercises: {} };

  // =========================================================================
  // AUTOMATED RPE & PROGRESSIVE OVERLOAD CALCULATION ENGINE
  // =========================================================================
  const calculateLiftTarget = useCallback((liftName: string, defaultTargetReps: string): CalculatedTarget => {
    const isDeload = meta.rotationKey === 'Deload';

    // Scan backwards through previous weeks
    for (let w = currentWeek - 1; w >= 1; w--) {
      for (let d = 0; d < 4; d++) {
        const k = `w${w}_d${d}`;
        const dayEntry = logs[k];
        if (dayEntry && dayEntry.exercises) {
          // 1. Direct standard exercise check
          const exLog = dayEntry.exercises[liftName];
          if (exLog && exLog.sets && exLog.sets.length > 0) {
            const validSet: any = exLog.sets.find((s: any) => s.weight !== '' && s.weight !== undefined);
            if (validSet) {
              const baseWeight = parseFloat(validSet.weight) || 0;
              const baseReps = validSet.reps || defaultTargetReps;
              const baseRpe = parseFloat(validSet.rpe) || 7.5;

              if (isDeload) {
                // Deload calculation: 60% of baseline load rounded to nearest 2.5/5 lbs
                const deloadWeight = Math.round((baseWeight * 0.6) / 2.5) * 2.5;
                return {
                  hasBaseline: true,
                  baselineWeek: w,
                  baselineWeight: baseWeight,
                  baselineReps: baseReps,
                  baselineRpe: baseRpe,
                  prescribedWeight: deloadWeight,
                  prescribedReps: typeof baseReps === 'number' ? `${Math.max(5, Math.floor(baseReps * 0.7))}` : defaultTargetReps,
                  directiveText: `Deload: 60% load (${deloadWeight} lbs) @ RPE 6 to flush systemic fatigue.`,
                  isDeload: true,
                  deltaText: `-40% deload`,
                };
              }

              // Overload calculation based on previous RPE vs Target RPE
              const isHeavyBarbell = baseWeight >= 115 || liftName.toLowerCase().includes('deadlift') || liftName.toLowerCase().includes('bench') || liftName.toLowerCase().includes('squat');
              const weightStep = isHeavyBarbell ? 5 : 2.5;

              if (baseRpe <= meta.targetRpe) {
                // Met or beat RPE target: Bump weight up
                const calculatedWeight = Math.round((baseWeight + weightStep) * 10) / 10;
                return {
                  hasBaseline: true,
                  baselineWeek: w,
                  baselineWeight: baseWeight,
                  baselineReps: baseReps,
                  baselineRpe: baseRpe,
                  prescribedWeight: calculatedWeight,
                  prescribedReps: String(baseReps),
                  directiveText: `Auto-Calculated: +${weightStep} lbs over Wk ${w} (${baseWeight} lbs @ RPE ${baseRpe}). Target RPE: ${meta.targetRpe}.`,
                  isDeload: false,
                  deltaText: `+${weightStep} lbs`,
                };
              } else {
                // Overshot RPE (> target): Maintain load and consolidate form
                return {
                  hasBaseline: true,
                  baselineWeek: w,
                  baselineWeight: baseWeight,
                  baselineReps: String(baseReps),
                  baselineRpe: baseRpe,
                  prescribedWeight: baseWeight,
                  prescribedReps: String(baseReps),
                  directiveText: `Consolidate: Hold ${baseWeight} lbs from Wk ${w} (was RPE ${baseRpe}) to lower RIR to target ${meta.targetRpe}.`,
                  isDeload: false,
                  deltaText: `Hold load`,
                };
              }
            }
          }

          // 2. Superset sub-component check
          for (const itemKey in dayEntry.exercises) {
            const item = dayEntry.exercises[itemKey];
            if (item?.isSuperset && item.sets && item.sets.length > 0) {
              const s0: any = item.sets.find((s: any) => 
                (s.moveAName === liftName && s.weightA !== '') || 
                (s.moveBName === liftName && s.weightB !== '')
              );
              if (s0) {
                const isA = s0.moveAName === liftName;
                const baseWeight = parseFloat(isA ? s0.weightA : s0.weightB) || 0;
                const baseReps = (isA ? s0.repsA : s0.repsB) || defaultTargetReps;
                const baseRpe = parseFloat(s0.rpe) || 8;
                const weightStep = baseWeight >= 100 ? 5 : 2.5;
                const calculatedWeight = isDeload ? Math.round((baseWeight * 0.6) / 2.5) * 2.5 : baseWeight + weightStep;

                return {
                  hasBaseline: true,
                  baselineWeek: w,
                  baselineWeight: baseWeight,
                  baselineReps: baseReps,
                  baselineRpe: baseRpe,
                  prescribedWeight: calculatedWeight,
                  prescribedReps: String(baseReps),
                  directiveText: isDeload 
                    ? `Deload Superset: ${calculatedWeight} lbs @ RPE 6.`
                    : `Superset Overload: +${weightStep} lbs over Wk ${w} (${baseWeight} lbs).`,
                  isDeload,
                  deltaText: isDeload ? `-40%` : `+${weightStep} lbs`,
                };
              }
            }
          }
        }
      }
    }

    // No baseline found (e.g. Week 1 or first time doing exercise)
    return {
      hasBaseline: false,
      prescribedReps: defaultTargetReps,
      directiveText: `Baseline Setup: Test & record initial working load targeting RPE ${meta.targetRpe} with 3s eccentric.`,
      isDeload,
      deltaText: `Benchmark`,
    };
  }, [currentWeek, logs, meta]);

  // Set handlers
  const handleSaveStandardSet = (exName: string, setIdx: number, field: string, val: any) => {
    setLogs((prev) => {
      const dayData = prev[dayKey] || { completed: false, exercises: {} };
      const exData = dayData.exercises[exName] || { isSuperset: false, sets: [] };
      const sets = [...exData.sets];
      if (!sets[setIdx]) sets[setIdx] = { setNumber: setIdx + 1, weight: '', reps: '', rpe: '' };
      sets[setIdx] = { ...sets[setIdx], [field]: val };

      return {
        ...prev,
        [dayKey]: {
          ...dayData,
          exercises: {
            ...dayData.exercises,
            [exName]: {
              isSuperset: false,
              sets,
            },
          },
        },
      };
    });
  };

  const handleSaveSupersetSet = (supersetName: string, setIdx: number, field: string, val: any) => {
    setLogs((prev) => {
      const dayData = prev[dayKey] || { completed: false, exercises: {} };
      const exData = dayData.exercises[supersetName] || { isSuperset: true, sets: [] };
      const sets = [...exData.sets];
      if (!sets[setIdx]) {
        sets[setIdx] = {
          setNumber: setIdx + 1,
          weightA: '',
          repsA: '',
          weightB: '',
          repsB: '',
          rpe: '',
        };
      }
      sets[setIdx] = { ...sets[setIdx], [field]: val };

      return {
        ...prev,
        [dayKey]: {
          ...dayData,
          exercises: {
            ...dayData.exercises,
            [supersetName]: {
              isSuperset: true,
              sets,
            },
          },
        },
      };
    });
  };

  // 1-Click Autofill for a single standard exercise
  const handleAutofillExercise = (ex: ExerciseMovement) => {
    const calc = calculateLiftTarget(ex.name, ex.targetReps);
    if (!calc.prescribedWeight && !calc.hasBaseline) {
      alert(`No baseline found yet for ${ex.name}. Please enter your first session's weight to establish your baseline!`);
      return;
    }

    setLogs((prev) => {
      const dayData = prev[dayKey] || { completed: false, exercises: {} };
      const sets = Array.from({ length: ex.defaultSets }).map((_, idx) => ({
        setNumber: idx + 1,
        weight: calc.prescribedWeight !== undefined ? calc.prescribedWeight : '',
        reps: calc.prescribedReps || ex.targetReps,
        rpe: meta.targetRpe,
        completed: false,
      }));

      return {
        ...prev,
        [dayKey]: {
          ...dayData,
          exercises: {
            ...dayData.exercises,
            [ex.name]: {
              isSuperset: false,
              sets,
            },
          },
        },
      };
    });
  };

  // 1-Click Autofill for a superset pair
  const handleAutofillSuperset = (ss: SupersetMovement) => {
    const calcA = calculateLiftTarget(ss.moveA.name, ss.moveA.targetReps);
    const calcB = calculateLiftTarget(ss.moveB.name, ss.moveB.targetReps);

    if (!calcA.hasBaseline && !calcB.hasBaseline) {
      alert(`No previous baseline found for ${ss.name}. Enter today's load to establish the baseline for future weeks!`);
      return;
    }

    setLogs((prev) => {
      const dayData = prev[dayKey] || { completed: false, exercises: {} };
      const sets = Array.from({ length: ss.sets }).map((_, idx) => ({
        setNumber: idx + 1,
        weightA: calcA.prescribedWeight !== undefined ? calcA.prescribedWeight : '',
        repsA: calcA.prescribedReps || ss.moveA.targetReps,
        weightB: calcB.prescribedWeight !== undefined ? calcB.prescribedWeight : '',
        repsB: calcB.prescribedReps || ss.moveB.targetReps,
        rpe: meta.targetRpe,
        moveAName: ss.moveA.name,
        moveBName: ss.moveB.name,
      }));

      return {
        ...prev,
        [dayKey]: {
          ...dayData,
          exercises: {
            ...dayData.exercises,
            [ss.name]: {
              isSuperset: true,
              sets,
            },
          },
        },
      };
    });
  };

  // Master 1-Click Autofill for Entire Workout Session
  const handleAutofillEntireSession = () => {
    let filledCount = 0;
    setLogs((prev) => {
      const dayData = prev[dayKey] || { completed: false, exercises: {} };
      const newExercises = { ...dayData.exercises };

      activeDay.exercises.forEach((item) => {
        if ('isSuperset' in item && item.isSuperset) {
          const ss = item as SupersetMovement;
          const calcA = calculateLiftTarget(ss.moveA.name, ss.moveA.targetReps);
          const calcB = calculateLiftTarget(ss.moveB.name, ss.moveB.targetReps);

          if (calcA.prescribedWeight !== undefined || calcB.prescribedWeight !== undefined) {
            filledCount++;
            newExercises[ss.name] = {
              isSuperset: true,
              sets: Array.from({ length: ss.sets }).map((_, idx) => ({
                setNumber: idx + 1,
                weightA: calcA.prescribedWeight !== undefined ? calcA.prescribedWeight : '',
                repsA: calcA.prescribedReps || ss.moveA.targetReps,
                weightB: calcB.prescribedWeight !== undefined ? calcB.prescribedWeight : '',
                repsB: calcB.prescribedReps || ss.moveB.targetReps,
                rpe: meta.targetRpe,
                moveAName: ss.moveA.name,
                moveBName: ss.moveB.name,
              })),
            };
          }
        } else {
          const ex = item as ExerciseMovement;
          const calc = calculateLiftTarget(ex.name, ex.targetReps);
          if (calc.prescribedWeight !== undefined) {
            filledCount++;
            newExercises[ex.name] = {
              isSuperset: false,
              sets: Array.from({ length: ex.defaultSets }).map((_, idx) => ({
                setNumber: idx + 1,
                weight: calc.prescribedWeight,
                reps: calc.prescribedReps || ex.targetReps,
                rpe: meta.targetRpe,
                completed: false,
              })),
            };
          }
        }
      });

      return {
        ...prev,
        [dayKey]: {
          ...dayData,
          exercises: newExercises,
        },
      };
    });

    if (filledCount === 0) {
      alert("No previous week baselines exist yet to calculate from. Log your weights for Week 1, and the app will automatically calculate your progressive overload targets for Week 2, 3, etc.!");
    }
  };

  // Swap exercise with alternative
  const handleSwapExercise = (index: number) => {
    const ex = activeDay.exercises[index];
    if ('isSuperset' in ex && ex.isSuperset) return;
    const stdEx = ex as ExerciseMovement;
    if (!stdEx.alternatives || stdEx.alternatives.length === 0) return;

    const nextAlt = stdEx.alternatives[0];
    const newAlternatives = [...stdEx.alternatives.slice(1), stdEx.name];
    const replacementObj = EXERCISE_DATABASE[nextAlt] || {
      ...stdEx,
      name: nextAlt,
      alternatives: newAlternatives,
    };

    activeDay.exercises[index] = {
      ...replacementObj,
      alternatives: newAlternatives,
    };
    setLogs((prev) => ({ ...prev }));
  };

  const toggleWorkoutComplete = () => {
    setLogs((prev) => {
      const dayData = prev[dayKey] || { exercises: {}, completed: false };
      return {
        ...prev,
        [dayKey]: {
          ...dayData,
          completed: !dayData.completed,
          completedAt: !dayData.completed ? new Date().toISOString() : undefined,
        },
      };
    });
  };

  const resetCurrentDay = () => {
    if (!window.confirm("Clear all logged data for this workout?")) return;
    setLogs((prev) => {
      const clone = { ...prev };
      delete clone[dayKey];
      return clone;
    });
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex_overload_backup_w${currentWeek}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        setLogs(parsed);
        alert("Workout history successfully imported.");
      } catch {
        alert("Failed to parse JSON backup.");
      }
    };
    reader.readAsText(file);
  };

  // Master adherence calculation
  const totalPossible = TOTAL_WEEKS * 4;
  let completedCount = 0;
  Object.values(logs).forEach((l) => {
    if (l && l.completed) completedCount++;
  });
  const adherencePct = Math.round((completedCount / totalPossible) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 pt-safe selection:bg-amber-400 selection:text-slate-950">
      {/* Sticky Header with Rest Timer and AI quick access */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-wider text-amber-400 uppercase truncate">
                Apex Science
              </h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                  meta.phase === 2
                    ? 'bg-sky-400/20 text-sky-400 border-sky-400/30'
                    : 'bg-amber-400/20 text-amber-400 border-amber-400/30'
                }`}
              >
                Phase {meta.phase}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate">
              Meso {meta.cycle} • Wk {currentWeek} ({meta.rotationName})
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowAnalytics(true)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Progression Analytics"
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => setShowInstallGuide(true)}
              className="hidden sm:flex items-center gap-1 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 text-xs px-2.5 py-1.5 rounded-xl border border-amber-400/30 font-semibold transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>PWA</span>
            </button>

            <RestTimer />
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 mt-4 space-y-4">
        {/* Research Directive / Adherence Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold tracking-wider text-slate-400 uppercase text-[10px]">
              Master Adherence & Progressive Load
            </span>
            <span className="text-amber-400 font-mono font-bold">
              {completedCount} / {totalPossible} ({adherencePct}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all duration-300 shadow-sm shadow-amber-400/40"
              style={{ width: `${adherencePct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
            <span className="text-[11px] truncate max-w-[240px] text-slate-300 font-medium">
              {meta.phaseName}
            </span>
            <span className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded-lg text-[11px] font-mono border border-slate-700 font-bold">
              Target RPE: {meta.targetRpe}
            </span>
          </div>
        </div>

        {/* 40-Week Horizontal Bar Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Select Meso Cycle Week (40 Total)
            </span>
            <span className="text-amber-400 text-[10px] font-mono">
              {meta.typeDesc}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Array.from({ length: TOTAL_WEEKS }).map((_, idx) => {
              const w = idx + 1;
              const isDeload = ((w - 1) % 4) + 1 === 4;
              const isSelected = w === currentWeek;

              return (
                <button
                  key={w}
                  onClick={() => setCurrentWeek(w)}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-400/20'
                      : isDeload
                      ? 'bg-slate-900 text-emerald-400 border-emerald-900/50 hover:border-emerald-600'
                      : w > 23
                      ? 'bg-slate-900 text-sky-400 border-sky-900/60 hover:border-sky-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  W{w}{isDeload ? '·D' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Day Tabs */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {workoutDays.map((d, dIdx) => {
            const isDaySelected = currentDay === dIdx;
            const isDayFinished = logs[`w${currentWeek}_d${dIdx}`]?.completed;

            return (
              <button
                key={dIdx}
                onClick={() => setCurrentDay(dIdx)}
                className={`py-2 text-xs font-bold rounded-xl transition-all relative ${
                  isDaySelected
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Day {dIdx + 1}
                <span
                  className={`text-[9px] font-normal block truncate ${
                    isDaySelected ? 'text-slate-900 font-semibold' : 'text-slate-500'
                  }`}
                >
                  {d.label.split('(')[0].replace('Upper', 'Upper').replace('Lower', 'Lower').trim()}
                </span>
                {isDayFinished && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Master 1-Click Auto-Calculate Session Targets Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-900 border border-amber-400/30 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Auto-Calculate RPE Targets</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {currentWeek === 1
                ? "Week 1 establishes your baseline. Log your initial weights below!"
                : `Calculates exact +2.5/5 lb load bumps or deload 60% based on your prior RPE.`}
            </p>
          </div>
          {currentWeek > 1 && (
            <button
              onClick={handleAutofillEntireSession}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold px-3 py-2 rounded-xl flex items-center gap-1.5 flex-shrink-0 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Apply All</span>
            </button>
          )}
        </div>

        {/* Dynamic Warm-Up Protocol (PAP & Mobility) */}
        <div className="bg-slate-900/90 border border-amber-400/20 rounded-2xl p-4 space-y-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {activeDay.label.split('(')[0]} Warm-Up Protocol
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">5–8 mins</span>
          </div>

          <div className="space-y-2 text-xs">
            {activeDay.warmup.map((wItem, wIdx) => (
              <label
                key={wIdx}
                className="flex items-start gap-2.5 cursor-pointer select-none bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-slate-700 text-amber-400 focus:ring-0 bg-slate-900"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-slate-200">
                      {wItem.name}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {wItem.duration}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {wItem.purpose}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Exercises Container */}
        <div className="space-y-4">
          {activeDay.exercises.map((item, exIdx) => {
            if ('isSuperset' in item && item.isSuperset) {
              const supersetItem = item as SupersetMovement;
              const savedSupersetSets = (currentDayLog.exercises[supersetItem.name]?.sets || []) as any[];
              const targetA = calculateLiftTarget(supersetItem.moveA.name, supersetItem.moveA.targetReps);
              const targetB = calculateLiftTarget(supersetItem.moveB.name, supersetItem.moveB.targetReps);

              return (
                <SupersetCard
                  key={supersetItem.id || exIdx}
                  superset={supersetItem}
                  supersetIndex={exIdx}
                  savedSets={savedSupersetSets}
                  meta={meta}
                  targetA={targetA}
                  targetB={targetB}
                  onSaveSupersetSet={(sIdx, field, val) =>
                    handleSaveSupersetSet(supersetItem.name, sIdx, field, val)
                  }
                  onAutofill={() => handleAutofillSuperset(supersetItem)}
                  onAskAi={(name) => setAiExerciseName(name)}
                />
              );
            } else {
              const stdEx = item as ExerciseMovement;
              const savedSets = (currentDayLog.exercises[stdEx.name]?.sets || []) as any[];
              const target = calculateLiftTarget(stdEx.name, stdEx.targetReps);

              return (
                <ExerciseCard
                  key={stdEx.id || exIdx}
                  exercise={stdEx}
                  exerciseIndex={exIdx}
                  savedSets={savedSets}
                  meta={meta}
                  target={target}
                  onSaveSet={(sIdx, field, val) =>
                    handleSaveStandardSet(stdEx.name, sIdx, field, val)
                  }
                  onAutofill={() => handleAutofillExercise(stdEx)}
                  onSwapExercise={handleSwapExercise}
                  onAskAi={(name) => setAiExerciseName(name)}
                />
              );
            }
          })}
        </div>

        {/* Completion Action Button */}
        <button
          onClick={toggleWorkoutComplete}
          className={`w-full py-4 rounded-2xl font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-lg ${
            currentDayLog.completed
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          <span>
            {currentDayLog.completed ? "Workout Completed ✓ (Tap to Reopen)" : "Mark Workout Complete"}
          </span>
        </button>

        {/* Utilities & Backups */}
        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-4 border-t border-slate-800">
          <button
            onClick={exportData}
            className="flex items-center gap-1 hover:text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>

          <label className="flex items-center gap-1 hover:text-slate-300 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Backup</span>
            <input type="file" className="hidden" accept=".json" onChange={importData} />
          </label>

          <button
            onClick={resetCurrentDay}
            className="flex items-center gap-1 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Session</span>
          </button>
        </div>
      </main>

      {/* AI Biomechanics Coach Modal */}
      <AiCoachModal
        exerciseName={aiExerciseName}
        onClose={() => setAiExerciseName(null)}
      />

      {/* Analytics Modal */}
      {showAnalytics && (
        <AnalyticsModal
          logs={logs}
          totalWeeks={TOTAL_WEEKS}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {/* iOS PWA Install Guide Modal */}
      {showInstallGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center pb-safe"
          onClick={() => setShowInstallGuide(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-t-3xl p-6 text-slate-100 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-amber-400/40 flex items-center justify-center text-amber-400 font-black text-xl">
                A
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-100">Install Apex on iPhone / Android</h3>
                <p className="text-xs text-slate-400">Launch fullscreen with zero address bars.</p>
              </div>
            </div>
            <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">1</span>
                <p>Tap the <strong>Share</strong> button in Safari’s bottom bar.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">2</span>
                <p>Select <strong>"Add to Home Screen"</strong>.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">3</span>
                <p>Tap <strong>"Add"</strong> in the top-right corner.</p>
              </div>
            </div>
            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
