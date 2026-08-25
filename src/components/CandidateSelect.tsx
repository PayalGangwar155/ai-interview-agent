import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Brain, TrendingUp } from "lucide-react";
import { candidates, type Candidate, getAvatarColor, getPassedMissions, getFailedMissions, getSkippedMissions } from "@/data/candidates";

interface CandidateSelectProps {
  onBack: () => void;
  onSelect: (candidate: Candidate) => void;
}

export default function CandidateSelect({ onBack, onSelect }: CandidateSelectProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center gap-4 px-6 py-5 max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2.5 ml-auto">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight">AI Interview Agent</span>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Select a Candidate</h1>
        <p className="text-slate-400 mb-10 max-w-2xl">
          Each candidate has a unique learning journey through the 31-day AI engineering program.
          Choose one to begin a personalized interview.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.member.id} candidate={candidate} onSelect={() => onSelect(candidate)} />
          ))}
        </div>
      </main>
    </div>
  );
}

function CandidateCard({ candidate, onSelect }: { candidate: Candidate; onSelect: () => void }) {
  const avatarColor = getAvatarColor(candidate);
  const passedCount = getPassedMissions(candidate).length;
  const skippedCount = getSkippedMissions(candidate).length;
  const failedCount = getFailedMissions(candidate).length;
  const firstTryCount = candidate.signals.missionsFirstTry;
  const totalMissions = candidate.missions.length;

  return (
    <div
      onClick={onSelect}
      className="group cursor-pointer rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200 hover:scale-[1.01]"
    >
      <div className="flex items-start gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg"
          style={{ backgroundColor: avatarColor, boxShadow: `0 8px 24px ${avatarColor}40` }}
        >
          {candidate.member.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-white truncate">{candidate.member.name}</h3>
          <p className="text-sm text-slate-400 truncate">{candidate.member.jobRole}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-300 group-hover:translate-x-1 transition-all shrink-0" />
      </div>

      <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-2">
        {candidate.member.yearsExperience} years experience · {candidate.member.education}
      </p>

      <div className="grid grid-cols-4 gap-3 mb-5">
        <Stat icon={<CheckCircle2 className="w-3.5 h-3.5" />} value={passedCount} label="Passed" color="text-emerald-400" />
        <Stat icon={<AlertTriangle className="w-3.5 h-3.5" />} value={failedCount} label="Failed" color="text-amber-400" />
        <Stat icon={<XCircle className="w-3.5 h-3.5" />} value={skippedCount} label="Skipped" color="text-red-400" />
        <Stat icon={<TrendingUp className="w-3.5 h-3.5" />} value={firstTryCount} label="First Try" color="text-blue-400" />
      </div>

      <div className="space-y-2.5">
        <div className="flex flex-wrap gap-1.5">
          {getPassedMissions(candidate).slice(0, 3).map((m) => (
            <span key={m.day} className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              {m.title}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {getFailedMissions(candidate).slice(0, 2).map((m) => (
            <span key={m.day} className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
              {m.title}
            </span>
          ))}
          {getSkippedMissions(candidate).slice(0, 2).map((m) => (
            <span key={m.day} className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium">
              {m.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/[0.03] border border-white/5">
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="font-bold text-sm">{value}</span>
      </div>
      <span className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}
