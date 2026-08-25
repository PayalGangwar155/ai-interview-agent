import { useState, useRef, useEffect } from "react";
import {
  Brain, Send, CheckCircle2, BookOpen, AlertTriangle, Sparkles, Loader2
} from "lucide-react";
import { type Candidate, getAvatarColor, getPassedMissions } from "@/data/candidates";
import { type InterviewState } from "@/types/interview";

interface InterviewScreenProps {
  candidate: Candidate;
  state: InterviewState | null;
  loading: boolean;
  error: string | null;
  onAnswer: (answer: string) => void;
}

export default function InterviewScreen({ candidate, state, loading, error, onAnswer }: InterviewScreenProps) {
  const [answer, setAnswer] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state?.messages]);

  const avatarColor = getAvatarColor(candidate);

  const handleSubmit = () => {
    if (!answer.trim() || loading) return;
    onAnswer(answer.trim());
    setAnswer("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const lastMessage = state?.messages[state.messages.length - 1];
  const isLastFromInterviewer = lastMessage?.role === "interviewer";
  const isComplete = state?.status === "completed";
  const progressPct = Math.min((state?.questionsAsked || 0) / 8 * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Brain className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-sm">AI Interviewer</span>
            <div className="text-xs text-slate-500">{candidate.member.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="font-semibold text-blue-300">
              {Math.min(state?.questionsAsked || 0, 8)} / 8+
            </span>
          </div>
          <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative z-10 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
            {state?.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} candidateName={candidate.member.name} candidateColor={avatarColor} />
            ))}

            {loading && (
              <div className="flex items-start gap-3 animate-[fadeIn_0.3s_ease-out]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.05] border border-white/10">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-300" />
                  <span className="text-sm text-slate-400">Analyzing your answer...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {!isComplete && (
            <div className="px-4 sm:px-6 py-4 border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your answer here..."
                      rows={3}
                      disabled={loading || !isLastFromInterviewer}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all disabled:opacity-50"
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-slate-600">
                      {answer.split(/\s+/).filter(Boolean).length} words
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || loading || !isLastFromInterviewer}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none flex items-center gap-2 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Submit</span>
                  </button>
                </div>
                <div className="text-xs text-slate-600 mt-2 text-center">
                  Press Cmd/Ctrl + Enter to submit
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="hidden lg:flex w-80 border-l border-white/5 bg-slate-950/50 backdrop-blur-md flex-col overflow-y-auto">
          <Sidebar candidate={candidate} state={state} />
        </aside>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function MessageBubble({ message, candidateName, candidateColor }: {
  message: InterviewState["messages"][number];
  candidateName: string;
  candidateColor: string;
}) {
  const isInterviewer = message.role === "interviewer";

  return (
    <div className={`flex items-start gap-3 max-w-3xl mx-auto animate-[fadeIn_0.3s_ease-out] ${isInterviewer ? "" : "flex-row-reverse"}`}>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isInterviewer ? "bg-gradient-to-br from-blue-500 to-cyan-400" : ""
        }`}
        style={!isInterviewer ? { backgroundColor: candidateColor } : undefined}
      >
        {isInterviewer ? (
          <Brain className="w-4 h-4 text-white" />
        ) : (
          <span className="text-xs font-bold text-white">
            {candidateName.split(" ").map((n) => n[0]).join("")}
          </span>
        )}
      </div>

      <div className={`flex-1 ${isInterviewer ? "" : "flex flex-col items-end"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isInterviewer
              ? "bg-white/[0.05] border border-white/10 rounded-tl-sm text-slate-200"
              : "rounded-tr-sm text-white"
          }`}
          style={!isInterviewer ? { backgroundColor: `${candidateColor}25`, border: `1px solid ${candidateColor}40` } : undefined}
        >
          {message.content.split("\n\n").map((para, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ candidate, state }: { candidate: Candidate; state: InterviewState | null }) {
  if (!state) return null;

  const avatarColor = getAvatarColor(candidate);
  const passedDays = getPassedMissions(candidate).map((m) => m.day);

  return (
    <div className="p-5 space-y-5">
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Candidate</h3>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: avatarColor }}
            >
              {candidate.member.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{candidate.member.name}</div>
              <div className="text-xs text-slate-500 truncate">{candidate.member.jobRole}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Interview Progress</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Questions</span>
            <span className="font-semibold text-white">{state.questionsAsked} / 8+</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${Math.min(state.questionsAsked / 8 * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Completed Missions</h3>
        <div className="flex flex-wrap gap-1.5">
          {passedDays.slice(0, 12).map((day) => (
            <span key={day} className="px-2 py-1 rounded text-xs font-medium bg-white/[0.03] border border-white/10 text-slate-400">
              D{day}
            </span>
          ))}
          {passedDays.length > 12 && (
            <span className="px-2 py-1 text-xs text-slate-500">+{passedDays.length - 12}</span>
          )}
        </div>
      </div>
    </div>
  );
}
