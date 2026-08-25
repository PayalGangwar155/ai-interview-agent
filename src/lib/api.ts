import type { InterviewResponse } from "@/types/interview";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const FUNCTION_PATH = "/functions/v1/interview-agent";
const BASE_URL = `${SUPABASE_URL}${FUNCTION_PATH}`;

async function callApi<T>(body: unknown): Promise<T> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: "Network error" }));
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Start a new interview: { sessionId, candidate: {...full candidate object} }
export async function startInterview(
  sessionId: string,
  candidate: object
): Promise<InterviewResponse> {
  return callApi<InterviewResponse>({ sessionId, candidate });
}

// Submit an answer: { sessionId, message: "answer text" }
export async function submitAnswer(
  sessionId: string,
  message: string
): Promise<InterviewResponse> {
  return callApi<InterviewResponse>({ sessionId, message });
}

export type { InterviewResponse, Feedback };
