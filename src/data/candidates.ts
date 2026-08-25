import candidatesData from "@/data/candidates.json";

export interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

export interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  attempts?: number;
  skipped?: boolean;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

export interface Candidate {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
}

export const candidates: Candidate[] = candidatesData.candidates;

export function getCandidate(id: string): Candidate | undefined {
  return candidates.find((c) => c.member.id === id);
}

export function getPassedMissions(candidate: Candidate): CandidateMission[] {
  return candidate.missions.filter((m) => m.passed === true);
}

export function getFailedMissions(candidate: Candidate): CandidateMission[] {
  return candidate.missions.filter((m) => m.passed === false);
}

export function getSkippedMissions(candidate: Candidate): CandidateMission[] {
  return candidate.missions.filter((m) => m.skipped === true);
}

export function getMissionDays(candidate: Candidate): number[] {
  return candidate.missions.map((m) => m.day);
}

const AVATAR_COLORS = [
  "#2563eb", "#059669", "#dc2626", "#d97706", "#7c3aed",
  "#0891b2", "#db2777", "#4f46e5", "#16a34a", "#ea580c",
  "#0d9488", "#be185d", "#4338ca", "#15803d", "#c2410c",
  "#9333ea", "#0e7490", "#b91c1c", "#1d4ed8", "#047857",
];

export function getAvatarColor(candidate: Candidate): string {
  const idx = candidates.findIndex((c) => c.member.id === candidate.member.id);
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}
