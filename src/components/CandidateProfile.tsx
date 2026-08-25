import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Brain, Zap, BookOpen, TrendingUp } from "lucide-react";
import { type Candidate, getPassedMissions, getSkippedMissions, getFailedMissions, getAvatarColor } from "@/data/candidates";
import { curriculum, curriculumModules, getCurriculumDay, getModuleForDay } from "@/data/curriculum";

interface CandidateProfileProps {
  candidate: Candidate;
  onBack: () => void;
  onStart: () => void;
}

export default function CandidateProfile({ candidate, onBack, onStart }: CandidateProfileProps) {
  const avatarColor = getAvatarColor(candidate);
  const passedMissions = getPassedMissions(candidate);
  const skippedMissions = getSkippedMissions(candidate);
  const failedMissions = getFailedMissions(candidate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center gap-4 px-6 py-5 max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to candidates
        </button>
        <div className="flex items-center gap-2.5 ml-auto">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight">AI Interview Agent</span>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-4 pb-20">
        <div className="flex items-start gap-5 mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-xl"
            style={{ backgroundColor: avatarColor, boxShadow: `0 12px 32px ${avatarColor}40` }}
          >
            {candidate.member.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{candidate.member.name}</h1>
            <p className="text-slate-400 mt-1">{candidate.member.jobRole}</p>
            <p className="text-sm text-slate-500 mt-1">{candidate.member.education} · {candidate.member.yearsExperience} years experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <div className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-blue-300" />
              <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-300">Candidate Overview</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {candidate.member.name} completed {candidate.signals.missionsCompleted} out of 31 missions
              with {candidate.signals.commitDays} active commit days. {candidate.signals.missionsFirstTry} missions
              were passed on the first attempt.
            </p>

            <div className="mt-5 pt-5 border-t border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-emerald-300" />
                <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-300">Passed Missions</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {passedMissions.map((m) => (
                  <span key={m.day} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium">
                    {m.title}
                  </span>
                ))}
              </div>
            </div>

            {failedMissions.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-amber-300" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-300">Areas of Difficulty</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {failedMissions.map((m) => (
                    <span key={m.day} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium">
                      {m.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <StatCard label="Passed Missions" value={passedMissions.length} icon={<CheckCircle2 className="w-5 h-5" />} color="emerald" />
            <StatCard label="Failed Missions" value={failedMissions.length} icon={<AlertTriangle className="w-5 h-5" />} color="amber" />
            <StatCard label="Skipped Topics" value={skippedMissions.length} icon={<XCircle className="w-5 h-5" />} color="red" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm mb-8">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-slate-300 mb-4">Curriculum Journey</h2>
          <div className="space-y-4">
            {curriculumModules.map((module) => {
              const moduleDays = module.days.filter((d) => getCurriculumDay(d));
              if (moduleDays.length === 0) return null;

              return (
                <div key={module.n}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{module.title}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moduleDays.map((dayNum) => {
                      const day = getCurriculumDay(dayNum)!;
                      const mission = candidate.missions.find((m) => m.day === dayNum);
                      const isPassed = mission?.passed === true;
                      const isSkipped = mission?.skipped === true;
                      const isFailed = mission && mission.passed === false && !mission.skipped;

                      return (
                        <div
                          key={dayNum}
                          className={`px-3 py-2 rounded-lg text-xs border ${
                            isPassed
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                              : isFailed
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                              : isSkipped
                              ? "bg-red-500/10 border-red-500/20 text-red-300"
                              : "bg-white/[0.02] border-white/5 text-slate-500"
                          }`}
                          title={`Day ${dayNum}: ${day.title}${mission ? ` — Attempts: ${mission.attempts || 0}` : ""}`}
                        >
                          <span className="font-semibold">D{dayNum}</span>
                          <span className="ml-1.5 opacity-70">{day.title.split(" ")[0]}</span>
                          {mission && isPassed && mission.attempts && (
                            <span className="ml-1.5 opacity-50">({mission.attempts}x)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200"
          >
            Start Interview
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: "emerald" | "amber" | "red" }) {
  const colors = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]} flex items-center gap-3`}>
      {icon}
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}
