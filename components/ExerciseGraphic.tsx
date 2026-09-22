import React, { useState } from 'react';
import { MuscleGroup } from '../types';

interface ExerciseGraphicProps {
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  movementName: string;
  tempo?: string;
  lengthenedTip?: string;
  compact?: boolean;
}

// Maps muscle keys to display names and SVG color schemes
const MUSCLE_NAMES: Record<MuscleGroup, string> = {
  chest: "Pectoralis Major",
  lats: "Latissimus Dorsi",
  upper_back: "Rhomboids / Mid-Traps",
  front_delts: "Anterior Deltoids",
  side_delts: "Lateral Deltoids",
  rear_delts: "Posterior Deltoids",
  triceps: "Triceps Brachii",
  biceps: "Biceps Brachii",
  quads: "Quadriceps (Vastus/Rectus)",
  hamstrings: "Hamstrings (Semi/Biceps)",
  glutes: "Gluteus Maximus/Medius",
  calves: "Gastrocnemius/Soleus",
  core: "Rectus & Obliques",
  traps: "Upper Trapezius",
  forearms: "Wrist Flexors/Extensors"
};

export const ExerciseGraphic: React.FC<ExerciseGraphicProps> = ({
  primaryMuscles,
  secondaryMuscles,
  movementName,
  tempo,
  lengthenedTip,
  compact = false
}) => {
  const [activeTab, setActiveTab] = useState<'muscles' | 'biomechanics'>('muscles');

  const isPrimary = (m: MuscleGroup) => primaryMuscles.includes(m);
  const isSecondary = (m: MuscleGroup) => secondaryMuscles.includes(m);

  const getFill = (m: MuscleGroup) => {
    if (isPrimary(m)) return '#fbbf24'; // Amber Primary
    if (isSecondary(m)) return '#38bdf8'; // Sky Secondary
    return '#1e293b'; // Inactive Slate
  };

  const getOpacity = (m: MuscleGroup) => {
    if (isPrimary(m)) return '0.95';
    if (isSecondary(m)) return '0.65';
    return '0.35';
  };

  return (
    <div className="bg-slate-950/90 rounded-xl border border-slate-800 overflow-hidden text-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
            Target Anatomy & Biomechanics
          </span>
        </div>
        {!compact && (
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setActiveTab('muscles')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeTab === 'muscles' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Muscles
            </button>
            <button
              onClick={() => setActiveTab('biomechanics')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeTab === 'biomechanics' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stretch Arc
            </button>
          </div>
        )}
      </div>

      <div className="p-3">
        {activeTab === 'muscles' || compact ? (
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Vector Humanoid Anatomy Graphic (Front & Back simplified silhouette) */}
            <div className="col-span-5 flex justify-center items-center py-1">
              <svg viewBox="0 0 160 180" className="w-32 h-36 drop-shadow-md select-none">
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Body Outline Base */}
                {/* Head */}
                <circle cx="80" cy="18" r="10" fill="#334155" />

                {/* Upper Traps */}
                <path d="M 68 28 L 92 28 L 98 38 L 62 38 Z" fill={getFill('traps')} opacity={getOpacity('traps')} />

                {/* Shoulders / Front Delts */}
                <circle cx="56" cy="42" r="7" fill={getFill('front_delts')} opacity={getOpacity('front_delts')} />
                <circle cx="104" cy="42" r="7" fill={getFill('front_delts')} opacity={getOpacity('front_delts')} />

                {/* Side Delts */}
                <path d="M 48 40 Q 46 48 50 54 Q 53 48 51 40 Z" fill={getFill('side_delts')} opacity={getOpacity('side_delts')} />
                <path d="M 112 40 Q 114 48 110 54 Q 107 48 109 40 Z" fill={getFill('side_delts')} opacity={getOpacity('side_delts')} />

                {/* Pectoralis / Chest */}
                <path d="M 65 38 Q 80 43 95 38 Q 94 56 80 56 Q 66 56 65 38 Z" fill={getFill('chest')} opacity={getOpacity('chest')} />

                {/* Lats (Tapered) */}
                <path d="M 62 48 L 58 72 L 67 74 L 67 48 Z" fill={getFill('lats')} opacity={getOpacity('lats')} />
                <path d="M 98 48 L 102 72 L 93 74 L 93 48 Z" fill={getFill('lats')} opacity={getOpacity('lats')} />

                {/* Arms - Biceps / Triceps */}
                <rect x="46" y="52" width="6" height="18" rx="3" fill={getFill('biceps')} opacity={getOpacity('biceps')} />
                <rect x="108" y="52" width="6" height="18" rx="3" fill={getFill('biceps')} opacity={getOpacity('biceps')} />

                {/* Forearms */}
                <rect x="43" y="72" width="5" height="20" rx="2" fill={getFill('forearms')} opacity={getOpacity('forearms')} />
                <rect x="112" y="72" width="5" height="20" rx="2" fill={getFill('forearms')} opacity={getOpacity('forearms')} />

                {/* Core / Abdominals */}
                <rect x="71" y="58" width="18" height="22" rx="3" fill={getFill('core')} opacity={getOpacity('core')} />

                {/* Glutes / Pelvis */}
                <path d="M 66 82 L 94 82 L 98 96 L 62 96 Z" fill={getFill('glutes')} opacity={getOpacity('glutes')} />

                {/* Quads / Hamstrings */}
                <rect x="62" y="98" width="15" height="36" rx="4" fill={getFill('quads')} opacity={getOpacity('quads')} />
                <rect x="83" y="98" width="15" height="36" rx="4" fill={getFill('quads')} opacity={getOpacity('quads')} />

                {/* Calves */}
                <rect x="64" y="138" width="12" height="30" rx="3" fill={getFill('calves')} opacity={getOpacity('calves')} />
                <rect x="84" y="138" width="12" height="30" rx="3" fill={getFill('calves')} opacity={getOpacity('calves')} />
              </svg>
            </div>

            {/* Target Breakdown Legend */}
            <div className="col-span-7 space-y-2">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-amber-400 inline-block"></span>
                  Primary Drivers
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {primaryMuscles.map(m => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-semibold text-[10px] border border-amber-400/30"
                    >
                      {MUSCLE_NAMES[m] || m}
                    </span>
                  ))}
                </div>
              </div>

              {secondaryMuscles.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-sky-400 uppercase flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-sky-400 inline-block"></span>
                    Stabilizers & Synergists
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {secondaryMuscles.map(m => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-300 font-medium text-[10px] border border-sky-400/20"
                      >
                        {MUSCLE_NAMES[m] || m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tempo && (
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-300 font-bold">Prescribed Tempo:</span> {tempo}
                  <span className="text-slate-500 block text-[9px]">3s eccentric • 1s stretch • explosive drive</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Biomechanics & Stretch Arc Tab */
          <div className="space-y-2">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-amber-400/20 text-[11px] text-slate-300">
              <div className="text-amber-400 font-bold flex items-center gap-1.5 mb-1 text-xs">
                <span>📐</span> Stretch-Mediated Hypertrophy Cue
              </div>
              <p className="leading-relaxed">
                {lengthenedTip || "Prioritize a controlled 2-3 second eccentric with an active 1-second pause at maximum muscle length to stimulate titin-based passive tension."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] text-slate-400">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="block font-bold text-slate-200">1. Setup</span>
                <span>Scapular brace & stable base</span>
              </div>
              <div className="bg-amber-400/10 p-2 rounded border border-amber-400/30 text-amber-300">
                <span className="block font-bold text-amber-400">2. Deep Stretch</span>
                <span>Maximum sarcomere elongation</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="block font-bold text-slate-200">3. Concentric</span>
                <span>Accelerate through sticking point</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
