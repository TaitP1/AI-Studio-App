import { GoogleGenAI } from '@google/genai';

export async function askExerciseBiomechanicsCoach(params: {
  exerciseName: string;
  userQuestion?: string;
  currentWeight?: number | string;
  currentReps?: number | string;
  currentRpe?: number | string;
}): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

    const prompt = `
You are the Apex Scientific Biomechanics Coach, an elite sports scientist and strength researcher familiar with Schoenfeld, Israetel, Nuckols, and Wolf (2023) stretch-mediated hypertrophy research.

Analyze the exercise: "${params.exerciseName}".
User Query / Status: "${params.userQuestion || 'Provide the optimal biomechanics setup, long-length stretch technique, and joint-friendly cues.'}"
Current log: Weight: ${params.currentWeight || 'N/A'}, Reps: ${params.currentReps || 'N/A'}, Target RPE: ${params.currentRpe || 'N/A'}.

Respond with:
1. 🎯 **Biomechanical Setup & Muscle Alignment**: 2 precise cues for joint alignment and scapular/pelvic stability.
2. 📐 **Stretch-Mediated Hypertrophy Cue**: How to exploit passive tension at full sarcomere length without injury.
3. ⚡ **Stimulus-to-Fatigue Ratio (SFR) Optimization**: How to maximize target motor unit recruitment while sparing spinal/axial fatigue.
4. 🔄 **Alternative Variation**: 1 top research-backed substitute if the lifter feels joint pain or lacks equipment.

Keep the advice concise, punchy, scientific, and directly actionable.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate biomechanics recommendations at this time.";
  } catch (error: any) {
    console.error("Gemini Biomechanics Coach Error:", error);
    return "The AI Coach is temporarily offline. Focus on maintaining a controlled 3-second eccentric and an active pause in the lengthened position.";
  }
}
