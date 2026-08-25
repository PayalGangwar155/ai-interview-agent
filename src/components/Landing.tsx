import { Brain, ArrowRight, Sparkles, MessageSquare, Target, BarChart3 } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "1s" }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AI Interview Agent</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="w-4 h-4" />
          <span>The AI Cohort — Technical Interview Platform</span>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8 animate-[fadeIn_0.5s_ease-out]">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Adaptive Multi-Turn Technical Interviews
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Conducts interviews that
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
            adapt to each candidate
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          An AI interviewer that reviews each candidate's learning journey through a 31-day AI engineering program,
          asks personalized questions across curriculum topics, and generates a structured evaluation report.
        </p>

        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200"
        >
          Start an Interview
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 max-w-4xl mx-auto">
          <FeatureCard
            icon={<MessageSquare className="w-5 h-5" />}
            title="Adaptive Conversations"
            description="Follow-up questions reference the candidate's actual previous answers, not a script."
          />
          <FeatureCard
            icon={<Target className="w-5 h-5" />}
            title="Curriculum-Aware"
            description="Questions span 4+ curriculum days, calibrated to each candidate's completed missions and gaps."
          />
          <FeatureCard
            icon={<BarChart3 className="w-5 h-5" />}
            title="Structured Reports"
            description="Dimensional scoring across technical knowledge, problem solving, communication, and more."
          />
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-left p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200">
      <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-300 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
