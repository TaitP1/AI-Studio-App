import React, { useState, useEffect } from 'react';
import { askExerciseBiomechanicsCoach } from '../services/geminiService';
import { X, Sparkles, Send, Loader2, Dumbbell } from 'lucide-react';

interface AiCoachModalProps {
  exerciseName: string | null;
  onClose: () => void;
}

export const AiCoachModal: React.FC<AiCoachModalProps> = ({ exerciseName, onClose }) => {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [userQuery, setUserQuery] = useState<string>('');

  const fetchAdvice = async (queryText?: string) => {
    if (!exerciseName) return;
    setLoading(true);
    const text = await askExerciseBiomechanicsCoach({
      exerciseName,
      userQuestion: queryText || "Explain the optimal stretch-mediated hypertrophy execution and joint angles."
    });
    setResponse(text);
    setLoading(false);
  };

  useEffect(() => {
    if (exerciseName) {
      fetchAdvice();
    }
  }, [exerciseName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    fetchAdvice(userQuery);
  };

  if (!exerciseName) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                Apex Biomechanics Coach
              </h2>
              <p className="text-[11px] text-amber-400 font-medium">
                {exerciseName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-slate-400 font-mono text-[11px]">
                Consulting sports biomechanics research...
              </p>
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-sans space-y-2">
              {response}
            </div>
          )}
        </div>

        {/* Input box for follow-up questions */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-950/80 flex gap-2">
          <input
            type="text"
            placeholder="Ask about joint pain, range of motion, cues..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !userQuery.trim()}
            className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-colors text-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
