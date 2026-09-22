export type MuscleGroup = 
  | 'chest'
  | 'lats'
  | 'upper_back'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'triceps'
  | 'biceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'traps'
  | 'forearms';

export interface ExerciseMovement {
  id: string;
  name: string;
  targetReps: string;
  defaultSets: number;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  researchNote: string;
  biomechanicsCues: string[];
  lengthenedPositionTip: string;
  tempo: string; // e.g. "3-1-X-0" (3s eccentric, 1s stretched pause, explosive concentric)
  alternatives: string[];
}

export interface SupersetMovement {
  isSuperset: true;
  id: string;
  name: string;
  sets: number;
  notes: string;
  researchRationale: string;
  moveA: ExerciseMovement;
  moveB: ExerciseMovement;
}

export type ExerciseItem = (ExerciseMovement & { isSuperset?: false }) | SupersetMovement;

export interface WorkoutDay {
  id: number;
  dayName: string;
  label: string;
  focus: string;
  warmup: {
    name: string;
    duration: string;
    purpose: string;
  }[];
  exercises: ExerciseItem[];
}

export interface SetLog {
  setNumber: number;
  weight: number | '';
  reps: number | '';
  rpe: number | '';
  completed?: boolean;
}

export interface SupersetSetLog {
  setNumber: number;
  weightA: number | '';
  repsA: number | '';
  weightB: number | '';
  repsB: number | '';
  rpe: number | '';
  completed?: boolean;
}

export interface ExerciseLogEntry {
  isSuperset: boolean;
  sets: (SetLog | SupersetSetLog)[];
}

export interface DayWorkoutLog {
  completed: boolean;
  completedAt?: string;
  notes?: string;
  exercises: Record<string, ExerciseLogEntry>;
}

export type LogsDatabase = Record<string, DayWorkoutLog>;

export interface WeekMeta {
  week: number;
  phase: 1 | 2;
  phaseName: string;
  cycle: number;
  posInCycle: number;
  rotationKey: 'A' | 'B' | 'C' | 'Deload';
  rotationName: string;
  targetRpe: number;
  typeDesc: string;
  researchFocus: string;
}

export interface CalculatedTarget {
  hasBaseline: boolean;
  baselineWeek?: number;
  baselineWeight?: number;
  baselineReps?: string | number;
  baselineRpe?: number;
  prescribedWeight?: number;
  prescribedReps?: string;
  directiveText: string;
  isDeload: boolean;
  deltaText?: string;
}
