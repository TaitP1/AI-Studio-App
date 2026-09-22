import { ExerciseMovement, WorkoutDay } from '../types';

export const EXERCISE_DATABASE: Record<string, ExerciseMovement> = {
  // --- UPPER BODY MOVEMENTS ---
  "Pull-ups (AMRAP)": {
    id: "pull_ups",
    name: "Pull-ups (AMRAP)",
    targetReps: "AMRAP (RIR 1-2)",
    defaultSets: 4,
    primaryMuscles: ['lats', 'upper_back'],
    secondaryMuscles: ['biceps', 'forearms', 'core'],
    researchNote: "Stretch-mediated hypertrophy study (Pedrosa et al., 2022) indicates active hang at full bottom stretch increases lat motor unit recruitment by ~24%.",
    biomechanicsCues: [
      "Depress and retract scapulae before pulling",
      "Drive elbows down toward rear hip pockets, not flared out",
      "Pause 1 full second in dead hang under active tension"
    ],
    lengthenedPositionTip: "Full elbow lockout with lats flaring at the very bottom.",
    tempo: "3-1-X-0",
    alternatives: ["Neutral Grip Pull-ups", "Lat Pulldown (Single Arm)", "Assisted Pull-ups"]
  },
  "DB Incline Bench": {
    id: "db_incline_bench",
    name: "DB Incline Bench",
    targetReps: "8-10",
    defaultSets: 3,
    primaryMuscles: ['chest', 'front_delts'],
    secondaryMuscles: ['triceps'],
    researchNote: "Setting bench at 30° maximizes clavicular (upper) pectoral fiber alignment while reducing excessive anterior deltoid dominance (Rodríguez-Ridao et al., 2020).",
    biomechanicsCues: [
      "Set bench strictly at 30 degrees incline",
      "Tuck elbows ~45° into the scapular plane to save rotator cuff",
      "Lower dumbbells until hands are level with upper chest for deep fascial stretch"
    ],
    lengthenedPositionTip: "Feel chest fibers actively stretching at the deepest 2 inches of the ROM.",
    tempo: "3-1-1-0",
    alternatives: ["Barbell Incline Bench", "Incline Machine Press", "Low-to-High Cable Fly"]
  },
  "T-Bar Row": {
    id: "t_bar_row",
    name: "T-Bar Row",
    targetReps: "10-12",
    defaultSets: 3,
    primaryMuscles: ['upper_back', 'lats'],
    secondaryMuscles: ['rear_delts', 'biceps', 'traps'],
    researchNote: "Chest-supported or 45° landmine rowing reduces spinal axial fatigue (SFR optimization) allowing higher training volume for rhomboids and lats.",
    biomechanicsCues: [
      "Maintain 45° torso angle with neutral spine brace",
      "Lead with elbows, pulling straight back toward pelvic crest",
      "Allow slight scapular protraction at bottom for deep upper back stretch"
    ],
    lengthenedPositionTip: "Let shoulder blades glide open around ribcage at bottom lockout.",
    tempo: "2-1-1-1",
    alternatives: ["Chest-Supported Machine Row", "Barbell Bent-Over Row", "Meadows Row"]
  },
  "Overhead Press (OHP)": {
    id: "ohp",
    name: "Overhead Press (OHP)",
    targetReps: "6-8",
    defaultSets: 3,
    primaryMuscles: ['front_delts', 'side_delts'],
    secondaryMuscles: ['triceps', 'traps', 'core'],
    researchNote: "Pressing vertically in the scapular plane engages serratus anterior and anterior delts with zero subacromial impingement.",
    biomechanicsCues: [
      "Squeeze glutes and brace rectus abdominis to prevent lumbar hyperextension",
      "Pull chin back as bar clears forehead, then lock out directly overhead",
      "Keep wrists stacked vertically above elbows"
    ],
    lengthenedPositionTip: "Full pause at collarbone without bouncing off chest.",
    tempo: "2-1-X-0",
    alternatives: ["DB Seated Shoulder Press", "Standing Arnold Press", "Half-Kneeling Landmine Press"]
  },
  "Lateral Raises": {
    id: "lateral_raises",
    name: "Lateral Raises",
    targetReps: "12-15",
    defaultSets: 4,
    primaryMuscles: ['side_delts'],
    secondaryMuscles: ['traps'],
    researchNote: "Slight forward torso lean (15°) shifts torque peak onto the lateral head rather than upper traps. Long muscle length tension maximized.",
    biomechanicsCues: [
      "Hinge hips slightly forward (15°)",
      "Raise dumbbells in the scapular plane (thumbs slightly lower or neutral)",
      "Think 'pushing knuckles into side walls' rather than pulling up"
    ],
    lengthenedPositionTip: "Control the 3-second descent all the way to outer thighs.",
    tempo: "3-0-1-1",
    alternatives: ["Cable Lateral Raises (Behind Back)", "Incline DB Lateral Raise", "Machine Lateral Raise"]
  },
  "Reverse Fly": {
    id: "reverse_fly",
    name: "Reverse Fly",
    targetReps: "12-15",
    defaultSets: 3,
    primaryMuscles: ['rear_delts'],
    secondaryMuscles: ['traps', 'upper_back'],
    researchNote: "Rear deltoid fibers run diagonally; pulling wide with elbows slightly soft ensures rear delt isolation over rhomboid takeover.",
    biomechanicsCues: [
      "Chest flat on 30° incline bench or hinged at 90°",
      "Sweep arms outward like hugging a wide barrel",
      "Hold peak contraction for 1 second before lowering"
    ],
    lengthenedPositionTip: "Let weights cross slightly at the bottom for increased rear delt stretch.",
    tempo: "2-1-1-1",
    alternatives: ["Face Pulls", "Rear Delt Machine Flyes", "Banded Face Pulls"]
  },
  "Dips": {
    id: "dips",
    name: "Dips",
    targetReps: "8-10",
    defaultSets: 3,
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['front_delts'],
    researchNote: "Torso forward lean of 20-30° stretches lower sternal pectorals at the bottom to their greatest physiological sarcomere length.",
    biomechanicsCues: [
      "Lean forward 25° with elbows tracking back",
      "Descend until humerus is parallel to floor (no painful over-extension)",
      "Drive upward pushing palms through dip bars"
    ],
    lengthenedPositionTip: "Pause 1s at parallel depth to harness passive connective elasticity.",
    tempo: "3-1-1-0",
    alternatives: ["Weighted Dips", "Close-Grip Push-ups", "Cable Pressdowns"]
  },
  "Barbell Bench Press": {
    id: "bb_bench",
    name: "Barbell Bench Press",
    targetReps: "6-8",
    defaultSets: 4,
    primaryMuscles: ['chest'],
    secondaryMuscles: ['front_delts', 'triceps'],
    researchNote: "Arching thoracic spine with retracted scapulae aligns sternocostal fibers and minimizes shoulder anterior capsule strain.",
    biomechanicsCues: [
      "Plant feet firmly into ground creating leg drive",
      "Touch lower sternum smoothly without bouncing",
      "Press in a subtle J-curve back toward eye level"
    ],
    lengthenedPositionTip: "Controlled pause on sternum allows full eccentric elastic recoil.",
    tempo: "3-1-X-0",
    alternatives: ["DB Flat Bench Press", "Floor Press", "Weighted Push-ups"]
  },
  "Single Arm DB Row": {
    id: "single_arm_db_row",
    name: "Single Arm DB Row",
    targetReps: "10-12/side",
    defaultSets: 3,
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'upper_back', 'core'],
    researchNote: "Pulling dumbbell toward the hip pocket (semi-circular arc) maximizes iliac lat fiber contraction without biceps dominance.",
    biomechanicsCues: [
      "Hips square, non-working arm supporting torso on bench",
      "Initiate pull toward hip crease, keep forearm perpendicular",
      "Stretch lat at bottom by allowing scapula to protract down"
    ],
    lengthenedPositionTip: "Reach dumbbell toward floor at bottom for deep lower lat lengthening.",
    tempo: "3-1-1-1",
    alternatives: ["Meadows Row", "Chest-Supported DB Row", "Single Arm Cable Row"]
  },
  "Face Pulls": {
    id: "face_pulls",
    name: "Face Pulls",
    targetReps: "15",
    defaultSets: 3,
    primaryMuscles: ['rear_delts', 'traps'],
    secondaryMuscles: ['upper_back'],
    researchNote: "External rotation combined with horizontal abduction strengthens infraspinatus/teres minor, counteracting rounded shoulder posture.",
    biomechanicsCues: [
      "Set cable pulley at eye level",
      "Pull rope to forehead while rotating thumbs and forearms backward",
      "Spread rope apart at finish to contract lower trapezius"
    ],
    lengthenedPositionTip: "Allow arms to straighten completely to stretch mid-back.",
    tempo: "2-1-1-2",
    alternatives: ["Band Face Pulls", "Rear Delt Machine Flyes", "Prone Y-Raises"]
  },
  "EZ-Bar Curls (21s)": {
    id: "ez_curls_21s",
    name: "EZ-Bar Curls (21s)",
    targetReps: "21 (7 bottom / 7 top / 7 full)",
    defaultSets: 3,
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    researchNote: "7 bottom partials specifically target stretch-mediated hypertrophy where the biceps brachii experiences peak passive mechanical tension.",
    biomechanicsCues: [
      "Elbows pinned to sides, preventing shoulder forward translation",
      "7 reps: Bottom stretch to 90 degrees",
      "7 reps: 90 degrees to peak contraction",
      "7 reps: Full range of motion"
    ],
    lengthenedPositionTip: "Do not stop the bottom half reps early; fully extend elbow joint.",
    tempo: "2-0-1-0",
    alternatives: ["Incline DB Curls (Lengthened)", "Bayesian Cable Curls", "Hammer Curls"]
  },
  "Decline Push-ups": {
    id: "decline_pushups",
    name: "Decline Push-ups",
    targetReps: "12-15",
    defaultSets: 3,
    primaryMuscles: ['chest', 'front_delts'],
    secondaryMuscles: ['triceps', 'core'],
    researchNote: "Elevating feet 18-24\" on bench increases load on upper pectoralis major to ~74% of bodyweight with high serratus anterior activation.",
    biomechanicsCues: [
      "Place toes on bench, hands slightly wider than shoulder width",
      "Rigid hollow-body plank, glutes tightly squeezed",
      "Descend until nose touches ground, press up actively protracting"
    ],
    lengthenedPositionTip: "Full deep chest expansion between hands at floor level.",
    tempo: "2-1-1-0",
    alternatives: ["Weighted Push-ups", "Cable Crossover Flyes", "Incline DB Press"]
  },

  // --- LOWER BODY MOVEMENTS ---
  "Bulgarian Split Squats": {
    id: "bulgarian_split_squat",
    name: "Bulgarian Split Squats",
    targetReps: "8-10/side",
    defaultSets: 3,
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    researchNote: "Unilateral exercise that produces quad and glute hyper-growth equal to barbell squats with 60% less lumbar compression (Mackey et al., 2021).",
    biomechanicsCues: [
      "Rear foot laces down on bench, front foot placed ~3 feet forward",
      "Maintain slight forward torso lean to track knee over midfoot",
      "Descend until rear knee floats 1 inch off floor"
    ],
    lengthenedPositionTip: "Front knee travels past toes while heel stays glued, yielding maximal quad stretch.",
    tempo: "3-1-1-0",
    alternatives: ["Front Rack Reverse Lunges", "Dumbbell Step-ups", "Heels-Elevated Split Squats"]
  },
  "Goblet Squats": {
    id: "goblet_squats",
    name: "Goblet Squats",
    targetReps: "10-12",
    defaultSets: 3,
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['core', 'calves'],
    researchNote: "Anterior loading creates a counterbalance enabling deep pelvic descent below 90°, engaging vastus medialis in its fully lengthened state.",
    biomechanicsCues: [
      "Hold dumbbell/kettlebell tight against sternum with elbows tucked",
      "Feet shoulder-width, toes angled 20-30° out",
      "Sink between hips, spreading knees over pinky toes"
    ],
    lengthenedPositionTip: "Full pause at rock bottom to eliminate stretch reflex and build tendon stiffness.",
    tempo: "3-1-1-0",
    alternatives: ["Front Squats", "Heels-Elevated Hack Squats", "Safety Bar Squats"]
  },
  "GHD / Hyperextensions": {
    id: "ghd_hyperextension",
    name: "GHD / Hyperextensions",
    targetReps: "10-12",
    defaultSets: 3,
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['upper_back', 'core'],
    researchNote: "Pelvis set just forward of the pad isolates hip extension; hamstrings undergo high eccentric torque near the 90° hinge.",
    biomechanicsCues: [
      "Hips free of pad so lower back remains neutral without hyperextending",
      "Hinge at femoral head, lowering torso until hamstrings are fully taut",
      "Squeeze glutes to pull torso back inline with legs"
    ],
    lengthenedPositionTip: "Hold 1s at bottom stretch before initiating glute contraction.",
    tempo: "3-1-1-1",
    alternatives: ["45-Degree Back Extensions", "Barbell Romanian Deadlift", "Good Mornings"]
  },
  "Heavy Farmer's Carry": {
    id: "farmers_carry",
    name: "Heavy Farmer's Carry",
    targetReps: "50 paces",
    defaultSets: 3,
    primaryMuscles: ['traps', 'forearms', 'core'],
    secondaryMuscles: ['glutes', 'calves'],
    researchNote: "Carries produce maximum quadratus lumborum and oblique isometric bracing while loading upper trapezius under continuous stretch.",
    biomechanicsCues: [
      "Shoulders packed back and down away from ears",
      "Ribs pulled down toward pelvis, zero hip sway",
      "Short, controlled heel-to-toe paces with rhythmic nasal breathing"
    ],
    lengthenedPositionTip: "Allow heavy weight to hang naturally to stretch traps and decompress spine.",
    tempo: "Smooth Cadence",
    alternatives: ["Trap Bar Carry", "Single-Arm Suitcase Carry", "Overhead / Rack Carry"]
  },
  "Landmine Rotations": {
    id: "landmine_rotations",
    name: "Landmine Rotations",
    targetReps: "10-12/side",
    defaultSets: 3,
    primaryMuscles: ['core'],
    secondaryMuscles: ['front_delts', 'forearms'],
    researchNote: "Anti-rotational and rotational power transfer across the anterior oblique sling (pectoralis to contralateral external oblique).",
    biomechanicsCues: [
      "Arms locked out with arms tracing a rainbow arc from hip to hip",
      "Pivot slightly on rear foot while keeping pelvis locked forward",
      "Control deceleration before changing directions"
    ],
    lengthenedPositionTip: "Resist twisting at the bottom of each arc to recruit deep transverse abdominis.",
    tempo: "2-0-1-0",
    alternatives: ["Cable Woodchoppers", "Pallof Press Holds", "Medicine Ball Rotational Slams"]
  },
  "Heavy Deadlift": {
    id: "heavy_deadlift",
    name: "Heavy Deadlift",
    targetReps: "5",
    defaultSets: 4,
    primaryMuscles: ['hamstrings', 'glutes', 'upper_back'],
    secondaryMuscles: ['traps', 'forearms', 'core', 'quads'],
    researchNote: "The king of posterior chain recruitment; resets at dead stop prevent eccentric bounce injury and maximize raw starting strength.",
    biomechanicsCues: [
      "Barbell over midfoot, lats engaged by 'bending bar over shins'",
      "Build intra-abdominal pressure with deep diaphragmatic Valsalva brace",
      "Push floor away with legs rather than yanking with lower back"
    ],
    lengthenedPositionTip: "Full tension loaded into hamstrings at floor start before barbell breaks ground.",
    tempo: "2-1-X-0",
    alternatives: ["Trap Bar Deadlift (High Handle)", "Sumo Deadlift", "Deficit Deadlift"]
  },
  "Landmine Reverse Lunge": {
    id: "landmine_reverse_lunge",
    name: "Landmine Reverse Lunge",
    targetReps: "8/side",
    defaultSets: 3,
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['core', 'calves'],
    researchNote: "The arc of the landmine sleeve matches natural human center-of-gravity displacement during single-leg backward deceleration.",
    biomechanicsCues: [
      "Hold barbell collar in hand opposite to working front leg",
      "Step back deep, dropping rear knee to brush floor",
      "Explode straight up through front heel"
    ],
    lengthenedPositionTip: "Pause 1s at bottom lunge to maximize gluteus maximus stretch.",
    tempo: "3-1-1-0",
    alternatives: ["DB Reverse Lunges", "Bulgarian Split Squats", "Step-ups"]
  },
  "Lying or Seated Leg Curls": {
    id: "leg_curls",
    name: "Lying or Seated Leg Curls",
    targetReps: "10-12",
    defaultSets: 3,
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['calves'],
    researchNote: "Maeo et al. (2021) demonstrated seated leg curls produce ~1.5x greater hamstring hypertrophy than lying curls due to hip flexion lengthening the semitendinosus/biceps femoris.",
    biomechanicsCues: [
      "If seated, lean torso forward over thighs to maximize hip flexion stretch",
      "Pull heels to glutes keeping ankles dorsiflexed (toes pointed to shin)",
      "Control 3-second negative descent"
    ],
    lengthenedPositionTip: "Full extension without letting weight stack touch between reps.",
    tempo: "3-1-1-0",
    alternatives: ["Swiss Ball Hamstring Curls", "Nordic Curls", "Slider Leg Curls"]
  },
  "Heavy DB / Barbell Shrugs": {
    id: "shrugs",
    name: "Heavy DB / Barbell Shrugs",
    targetReps: "12",
    defaultSets: 3,
    primaryMuscles: ['traps'],
    secondaryMuscles: ['forearms'],
    researchNote: "Upper trap fibers run upward and medial; leaning slightly forward (10°) aligns shrug line of pull directly along muscle pennation.",
    biomechanicsCues: [
      "Shrug shoulders upward and slightly backward toward ears",
      "Hold top peak contraction for a strict 2-second isometric squeeze",
      "Lower smoothly without rolling shoulders (which damages rotators)"
    ],
    lengthenedPositionTip: "Let weights stretch shoulders all the way down at bottom.",
    tempo: "2-2-1-0",
    alternatives: ["Trap Bar Shrugs", "Kelso Shrugs on Incline", "Farmer's Shrugs"]
  }
};

export const SUPERSET_PAIRS_DATABASE = [
  {
    isSuperset: true as const,
    id: "ss_incline_tbar",
    name: "DB Incline Bench + T-Bar Row",
    sets: 3,
    notes: "Agonist-antagonist pairing: Horizontal Push + Horizontal Pull. No rest between A & B. Rest 90s after completing both movements.",
    researchRationale: "Reciprocal inhibition research shows alternating chest pressing and back rowing increases motor recruitment while halving total gym session duration without strength degradation (Robbins et al., 2010).",
    moveA: EXERCISE_DATABASE["DB Incline Bench"],
    moveB: EXERCISE_DATABASE["T-Bar Row"]
  },
  {
    isSuperset: true as const,
    id: "ss_lateral_rear",
    name: "Lateral Raises + Reverse Fly",
    sets: 3,
    notes: "Shoulder density compound superset. Peak contraction hold on both. Rest 75s after superset.",
    researchRationale: "Combined lateral and posterior deltoid training enhances 3D shoulder capping without taxing the central nervous system.",
    moveA: EXERCISE_DATABASE["Lateral Raises"],
    moveB: EXERCISE_DATABASE["Reverse Fly"]
  }
];

// Helper to construct routine days
export function buildWorkoutDays(rotationKey: string): WorkoutDay[] {
  // Returns scientifically optimized 4-day workouts
  if (rotationKey === 'Deload') {
    return [
      {
        id: 0,
        dayName: "Day 1",
        label: "Upper Deload (Joint Recovery & Blood Flow)",
        focus: "Upper Body Active Recovery",
        warmup: [
          { name: "Dead hangs from bar", duration: "60s", purpose: "Passive lat decompression & spinal relief" },
          { name: "Banded pull-aparts", duration: "2 × 20", purpose: "Rotator cuff blood circulation" },
          { name: "World's Greatest Stretch", duration: "5/side", purpose: "Thoracic spine & hip opener" }
        ],
        exercises: [
          { ...EXERCISE_DATABASE["Pull-ups (AMRAP)"], defaultSets: 2, targetReps: "5-6 easy reps (RPE 6)" },
          { ...EXERCISE_DATABASE["DB Incline Bench"], defaultSets: 2, targetReps: "8-10 (60% load)" },
          { ...EXERCISE_DATABASE["T-Bar Row"], defaultSets: 2, targetReps: "10 (RPE 6)" },
          { ...EXERCISE_DATABASE["Lateral Raises"], defaultSets: 2, targetReps: "12 (Light tempo)" }
        ]
      },
      {
        id: 1,
        dayName: "Day 2",
        label: "Lower Deload (Mobility & Active Recovery)",
        focus: "Knee & Hip Restoration",
        warmup: [
          { name: "90/90 Hip Flow", duration: "2 mins", purpose: "Internal/External rotation" },
          { name: "Pry goblet squat hold", duration: "60s", purpose: "Ankle dorsiflexion & groin stretch" },
          { name: "Banded glute bridges", duration: "15 reps", purpose: "Gluteus medius activation" }
        ],
        exercises: [
          { ...EXERCISE_DATABASE["Goblet Squats"], defaultSets: 2, targetReps: "10 (Light weight)" },
          { ...EXERCISE_DATABASE["GHD / Hyperextensions"], defaultSets: 2, targetReps: "10 (Bodyweight)" },
          { ...EXERCISE_DATABASE["Heavy Farmer's Carry"], defaultSets: 2, targetReps: "40 paces (Moderate)" }
        ]
      },
      {
        id: 2,
        dayName: "Day 3",
        label: "Upper Deload (Rotator Cuff & Posture)",
        focus: "Scapular Rhythm",
        warmup: [
          { name: "Cat-Cow into Child's Pose", duration: "10 cycles", purpose: "Spinal segment articulation" },
          { name: "Band Y-T-W-L raises", duration: "10 each", purpose: "Lower trap & serratus anterior firing" }
        ],
        exercises: [
          { ...EXERCISE_DATABASE["Barbell Bench Press"], defaultSets: 2, targetReps: "8 (50% normal weight)" },
          { ...EXERCISE_DATABASE["Single Arm DB Row"], defaultSets: 2, targetReps: "10 (Smooth contraction)" },
          { ...EXERCISE_DATABASE["Face Pulls"], defaultSets: 2, targetReps: "15 (Light rope)" }
        ]
      },
      {
        id: 3,
        dayName: "Day 4",
        label: "Lower Deload (Hinge & Spine Decompression)",
        focus: "Posterior Chain Ease",
        warmup: [
          { name: "Hamstring sweeps", duration: "10/side", purpose: "Dynamic nerve flossing" },
          { name: "Dead hang lat pull", duration: "60s", purpose: "Lumbar space decompression" }
        ],
        exercises: [
          { ...EXERCISE_DATABASE["Heavy Deadlift"], defaultSets: 2, targetReps: "5 (50% conventional load)" },
          { ...EXERCISE_DATABASE["Lying or Seated Leg Curls"], defaultSets: 2, targetReps: "10 (Light eccentric)" }
        ]
      }
    ];
  }

  // Rotation A, B, C standard days
  return [
    {
      id: 0,
      dayName: "Day 1",
      label: "Upper A (Lat & Shoulder Hypertrophy)",
      focus: "Vertical Pull & Incline Agonist-Antagonist",
      warmup: [
        { name: "Dead hangs from pull-up bar", duration: "60s total", purpose: "Full lat decompression & shoulder joint spacing" },
        { name: "Banded shoulder dislocates & pull-aparts", duration: "2 × 15", purpose: "Subacromial warming & rotator cuff priming" },
        { name: "Scapular pull-ups", duration: "2 × 8 reps", purpose: "Engaging lower trapezius prior to heavy pulling" },
        { name: "World's Greatest Stretch", duration: "5 per side", purpose: "Thoracic spine extension & ribcage opening" }
      ],
      exercises: [
        EXERCISE_DATABASE["Pull-ups (AMRAP)"],
        SUPERSET_PAIRS_DATABASE[0], // DB Incline Bench + T-Bar Row
        EXERCISE_DATABASE["Overhead Press (OHP)"],
        SUPERSET_PAIRS_DATABASE[1], // Lateral Raises + Reverse Fly
        EXERCISE_DATABASE["Dips"]
      ]
    },
    {
      id: 1,
      dayName: "Day 2",
      label: "Lower A (Quad Bias & Posterior Balance)",
      focus: "Deep Knee Flexion & Unilateral Stability",
      warmup: [
        { name: "90/90 Hip mobility openers", duration: "60s/side", purpose: "Pelvic socket mobilization & capsular clearance" },
        { name: "Deep goblet squat hold with ankle prying", duration: "60s", purpose: "Dorsiflexion depth for quad hypertrophy" },
        { name: "Walking lunges with overhead torso reach", duration: "10 reps", purpose: "Psoas and hip flexor active lengthening" },
        { name: "Banded glute bridges (2s squeeze)", duration: "2 × 15", purpose: "PAP potentiation for gluteus maximus" }
      ],
      exercises: [
        EXERCISE_DATABASE["Bulgarian Split Squats"],
        EXERCISE_DATABASE["Goblet Squats"],
        EXERCISE_DATABASE["GHD / Hyperextensions"],
        EXERCISE_DATABASE["Heavy Farmer's Carry"],
        EXERCISE_DATABASE["Landmine Rotations"]
      ]
    },
    {
      id: 2,
      dayName: "Day 3",
      label: "Upper B (Chest Power & Arm Density)",
      focus: "Horizontal Pressing & Bicep Lengthened Hypertrophy",
      warmup: [
        { name: "Cat-Cow into Child's Pose", duration: "10 cycles", purpose: "Thoracic lubrication and serratus glide" },
        { name: "Band Y-T-W-L raises for rotator cuff", duration: "10 each", purpose: "Infraspinatus & teres minor stabilizer activation" },
        { name: "Push-up to Downward Dog", duration: "8 reps", purpose: "Dynamic calf stretch & scapular elevation" },
        { name: "Light DB Cuban Press", duration: "2 × 10", purpose: "Glenohumeral joint prep" }
      ],
      exercises: [
        EXERCISE_DATABASE["Barbell Bench Press"],
        EXERCISE_DATABASE["Single Arm DB Row"],
        EXERCISE_DATABASE["Face Pulls"],
        EXERCISE_DATABASE["EZ-Bar Curls (21s)"],
        EXERCISE_DATABASE["Decline Push-ups"]
      ]
    },
    {
      id: 3,
      dayName: "Day 4",
      label: "Lower B (Posterior Power & Deadlift)",
      focus: "Maximum Ground Force & Hamstring Eccentrics",
      warmup: [
        { name: "Hamstring sweeps & inchworms", duration: "6 reps", purpose: "Sciatic nerve mobility & hamstring dynamic stretch" },
        { name: "Banded hip hinge / Good Mornings", duration: "2 × 15", purpose: "Hinge motor patterning and glute firing" },
        { name: "Bird-dogs with 2s hold", duration: "8/side", purpose: "Multifidus and transverse abdominal recruitment" },
        { name: "Cossack squats", duration: "6/side", purpose: "Adductor magnus elongation and hip depth" }
      ],
      exercises: [
        EXERCISE_DATABASE["Heavy Deadlift"],
        EXERCISE_DATABASE["Landmine Reverse Lunge"],
        EXERCISE_DATABASE["Lying or Seated Leg Curls"],
        EXERCISE_DATABASE["Heavy DB / Barbell Shrugs"]
      ]
    }
  ];
}
