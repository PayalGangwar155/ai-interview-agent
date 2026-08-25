import { useState, useCallback, useRef } from "react";
import Landing from "@/components/Landing";
import CandidateSelect from "@/components/CandidateSelect";
import CandidateProfile from "@/components/CandidateProfile";
import InterviewScreen from "@/components/InterviewScreen";
import ReportScreen from "@/components/ReportScreen";
import { startInterview, submitAnswer } from "@/lib/api";
import { type Candidate, getAvatarColor } from "@/data/candidates";
import { type InterviewState, type InterviewMessage, type Feedback } from "@/types/interview";

type Screen = "landing" | "select" | "profile" | "interview" | "report";

let msgCounter = 0;

function makeMessage(role: "interviewer" | "candidate", content: string): InterviewMessage {
  msgCounter += 1;
  return {
    id: `msg_${Date.now()}_${msgCounter}`,
    role,
    content,
    timestamp: Date.now(),
  };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [interviewState, setInterviewState] = useState<InterviewState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<Feedback | null>(null);
  const sessionIdRef = useRef<string>("");

  const handleStartFromLanding = () => {
    setScreen("select");
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setScreen("profile");
  };

  const handleStartInterview = async () => {
    if (!selectedCandidate) return;
    setLoading(true);
    setError(null);

    const sessionId = `interview-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionIdRef.current = sessionId;

    try {
      const res = await startInterview(sessionId, selectedCandidate);
      const messages: InterviewMessage[] = [
        makeMessage("interviewer", res.reply),
      ];

      const state: InterviewState = {
        sessionId,
        status: "active",
        messages,
        questionsAsked: 1,
      };

      setInterviewState(state);
      setReport(null);
      setScreen("interview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = useCallback(async (answer: string) => {
    if (!interviewState) return;
    setLoading(true);
    setError(null);

    const candidateMsg = makeMessage("candidate", answer);
    setInterviewState((prev) => {
      if (!prev) return prev;
      return { ...prev, messages: [...prev.messages, candidateMsg] };
    });

    try {
      const res = await submitAnswer(sessionIdRef.current, answer);

      const interviewerMsg = makeMessage("interviewer", res.reply);
      setInterviewState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, interviewerMsg],
          questionsAsked: prev.questionsAsked + 1,
          status: res.done ? "completed" : "active",
        };
      });

      if (res.done && res.feedback) {
        setReport(res.feedback);
        setScreen("report");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer");
    } finally {
      setLoading(false);
    }
  }, [interviewState]);

  const handleRestart = () => {
    setReport(null);
    setInterviewState(null);
    setError(null);
    handleStartInterview();
  };

  const handleSelectNew = () => {
    setReport(null);
    setInterviewState(null);
    setError(null);
    setSelectedCandidate(null);
    setScreen("select");
  };

  const handleBackToLanding = () => {
    setScreen("landing");
  };

  if (screen === "landing") {
    return <Landing onStart={handleStartFromLanding} />;
  }

  if (screen === "select") {
    return <CandidateSelect onBack={handleBackToLanding} onSelect={handleSelectCandidate} />;
  }

  if (screen === "profile" && selectedCandidate) {
    return (
      <CandidateProfile
        candidate={selectedCandidate}
        onBack={() => setScreen("select")}
        onStart={handleStartInterview}
      />
    );
  }

  if (screen === "interview" && selectedCandidate) {
    return (
      <InterviewScreen
        candidate={selectedCandidate}
        state={interviewState}
        loading={loading}
        error={error}
        onAnswer={handleAnswer}
      />
    );
  }

  if (screen === "report" && selectedCandidate && report) {
    return (
      <ReportScreen
        candidate={selectedCandidate}
        report={report}
        onRestart={handleRestart}
        onSelectNew={handleSelectNew}
      />
    );
  }

  return <Landing onStart={handleStartFromLanding} />;
}
