export interface Feedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

export interface InterviewResponse {
  reply: string;
  done: boolean;
  feedback?: Feedback;
}

export interface ApiError {
  error: string;
  code: string;
  details?: string;
}

export interface InterviewMessage {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: number;
}

export interface InterviewState {
  sessionId: string;
  status: "active" | "completed";
  messages: InterviewMessage[];
  questionsAsked: number;
}
