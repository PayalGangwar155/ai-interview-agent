import { Brain, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, RotateCcw, TrendingUp } from "lucide-react";
import { type Candidate, getAvatarColor } from "@/data/candidates";
import { type Feedback } from "@/types/interview";

interface ReportScreenProps {
  candidate: Candidate;
  report: Feedback;
  onRestart: () => void;
  onSelectNew: () => void;
}

export default function ReportScreen({ candidate, report, onRestart, onSelectNew }: ReportScreenProps) {
  const avatarColor = getAvatarColor(candidate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <button
          onClick={onSelectNew}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          New Interview
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight">AI Interview Agent</span>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-4 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Interview Complete
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Interview Report</h1>
          <p className="text-slate-400">{candidate.member.name} — {candidate.member.jobRole}</p>
        </div>

        {/* Summary */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-blue-300" />
            <h2 className="font-semibold text-lg">Summary</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">{report.summary}</p>
        </div>

        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/15 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="font-semibold text-lg">Strengths</h2>
          </div>
          <ul className="space-y-2">
            {report.strengths.length > 0 ? report.strengths.map((area, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                {area}
              </li>
            )) : <li className="text-sm text-slate-500">No specific strengths identified.</li>}
          </ul>
        </div>

        {/* Gaps */}
        {report.gaps.length > 0 && (
          <div className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/15 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold text-lg">Knowledge Gaps</h2>
            </div>
            <ul className="space-y-2">
              {report.gaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/[0.05] to-cyan-500/[0.03] border border-blue-500/15 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-blue-300" />
            <h2 className="font-semibold text-lg">Recommended Next Steps</h2>
          </div>
          <ul className="space-y-3">
            {report.next.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                <span className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center text-blue-300 text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Interview
          </button>
          <button
            onClick={onSelectNew}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200"
          >
            <Brain className="w-4 h-4" />
            Interview Another Candidate
          </button>
        </div>
      </main>
    </div>
  );
}
