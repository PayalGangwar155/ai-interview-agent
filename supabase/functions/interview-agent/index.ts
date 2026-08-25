import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// ─── Supabase Client ───
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── CORS ───
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ─── Types (match candidates.json + curriculum.json schemas) ───
interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  attempts?: number;
  skipped?: boolean;
}

interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

interface Candidate {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
}

interface CurriculumDay {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

interface Feedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

interface InterviewState {
  sessionId: string;
  candidate: Candidate;
  status: "active" | "completed";
  messages: { role: "interviewer" | "candidate"; content: string; day?: number; title?: string }[];
  questionsAsked: number;
  daysCovered: number[];
  currentDay: number | null;
  evaluations: AnswerEvaluation[];
}

interface AnswerEvaluation {
  technicalScore: number;
  depthScore: number;
  communicationScore: number;
  reasoningScore: number;
  strengths: string[];
  weaknesses: string[];
  followUpNeeded: boolean;
}

// ─── Curriculum Data (embedded, matching curriculum.json) ───
const curriculum: CurriculumDay[] = [
  { day: 1, title: "VS Code & Python Environment Setup", type: "SETUP", tools: ["VS Code", "Python", "Python Extension", "Pylance", "Virtual Environment"], objectives: ["Install VS Code and Python", "Configure the Python extension", "Create a project virtual environment", "Run and debug Python programs", "Verify the development environment"] },
  { day: 2, title: "Local LLM & AI Coding Assistant Setup", type: "SETUP", tools: ["Ollama", "Qwen2.5-Coder", "GitHub Copilot", "Cline"], objectives: ["Install Ollama and download a local coding model", "Verify the local model works", "Connect VS Code to the local model", "Generate code using the local AI assistant", "Confirm the AI coding workflow works offline"] },
  { day: 3, title: "First AI Project, React Frontend & GitHub", type: "BUILD", tools: ["Python", "Ollama", "FastAPI", "React", "Vite", "Git", "GitHub"], objectives: ["Build a CLI chatbot with Ollama", "Scaffold a FastAPI backend", "Create a React app using Vite", "Connect React with FastAPI", "Initialize Git and publish to GitHub"] },
  { day: 4, title: "Reading & Processing Structured Data", type: "BUILD", tools: ["Pandas", "SQLite", "SQL", "SQLAlchemy"], objectives: ["Create synthetic healthcare datasets", "Load and clean CSV data using Pandas", "Store processed data in SQLite", "Write SQL queries for healthcare questions", "Document reusable SQL queries"] },
  { day: 5, title: "Reading & Processing Unstructured Data", type: "BUILD", tools: ["pdfplumber", "PyPDF", "python-docx", "Tesseract OCR", "BeautifulSoup", "Requests"], objectives: ["Extract text from PDFs and Word documents", "Perform OCR on scanned forms", "Scrape content from a public webpage", "Clean and normalize extracted text", "Store processed text files"] },
  { day: 6, title: "Building the Knowledge Base", type: "BUILD", tools: ["LangChain Text Splitters", "JSONL", "Python"], objectives: ["Convert data into a unified knowledge base", "Split documents into retrieval-friendly chunks", "Attach metadata to every chunk", "Export to knowledge_base.jsonl", "Validate chunk quality"] },
  { day: 7, title: "Embeddings Explained", type: "AI_CORE", tools: ["Sentence Transformers", "OpenAI Embeddings", "Scikit-learn", "Matplotlib"], objectives: ["Understand vector embeddings", "Generate embeddings for every chunk", "Store embeddings alongside documents", "Visualize embedding clusters using PCA", "Analyze whether similar concepts cluster together"] },
  { day: 8, title: "Vector Databases Overview", type: "BUILD", tools: ["ChromaDB", "Pinecone"], objectives: ["Learn the role of vector databases in RAG", "Set up a local Chroma vector database", "Create a cloud-based Pinecone index", "Compare local and managed solutions", "Select the most suitable database"] },
  { day: 9, title: "Building & Populating the Vector Database", type: "BUILD", tools: ["ChromaDB", "Sentence Transformers"], objectives: ["Load embeddings into the vector database", "Store documents with metadata for filtering", "Verify every chunk has been indexed", "Test semantic search", "Evaluate retrieval quality"] },
  { day: 10, title: "The Retrieval & Matching Engine", type: "SHIP_IT", tools: ["SQLite", "ChromaDB", "Python"], objectives: ["Build a query router for SQL, vector, or hybrid retrieval", "Implement structured data lookup", "Implement semantic retrieval", "Merge and deduplicate results", "Evaluate retrieval accuracy"] },
  { day: 11, title: "RAG End-to-End & LLM API Basics", type: "BUILD", tools: ["OpenAI SDK", "Ollama", "Groq", "Python"], objectives: ["Connect retrieval to an LLM for complete RAG", "Configure an LLM provider", "Create a grounded prompt", "Generate answers using retrieved knowledge", "Evaluate responses against baseline"] },
  { day: 12, title: "Prompt Engineering Fundamentals", type: "LEARN", tools: ["LLMs", "Prompt Templates"], objectives: ["Understand zero-shot, few-shot, and CoT prompting", "Design system prompt variations", "Compare prompts on accuracy and tone", "Evaluate prompt performance", "Finalize the production system prompt"] },
  { day: 13, title: "Advanced Prompting: Function Calling & Structured Outputs", type: "BUILD", tools: ["OpenAI Function Calling", "Pydantic", "Python"], objectives: ["Define tool schemas for chatbot functions", "Implement LLM function calling", "Validate structured outputs with Pydantic", "Log tool calls for debugging", "Test correct tool selection"] },
  { day: 14, title: "Fine-Tuning: Concepts & When to Use It", type: "LEARN", tools: ["JSONL", "OpenAI", "LoRA", "QLoRA"], objectives: ["Understand when fine-tuning is appropriate", "Identify issues fine-tuning can solve", "Create a fine-tuning dataset", "Validate and organize the dataset", "Prepare for model fine-tuning"] },
  { day: 15, title: "Fine-Tuning: Hands-On with LoRA & QLoRA", type: "SHIP_IT", tools: ["PEFT", "Transformers", "BitsAndBytes", "OpenAI Fine-Tuning", "LoRA"], objectives: ["Train or fine-tune an LLM using LoRA", "Load and evaluate the fine-tuned model", "Compare base and fine-tuned models", "Measure improvements", "Document fine-tuning benefits"] },
  { day: 16, title: "Chatbot Backend & API Integration", type: "BUILD", tools: ["FastAPI", "SQLite", "Python"], objectives: ["Create a /chat API endpoint", "Integrate retrieval, function calling, and LLM", "Implement session-based conversation management", "Build a conversation history endpoint", "Test the backend API"] },
  { day: 17, title: "Chatbot Frontend Development", type: "BUILD", tools: ["Streamlit", "Requests", "UUID"], objectives: ["Build an interactive chat interface", "Connect frontend to backend chat API", "Maintain conversation history", "Add a plan selector and new conversation option", "Validate end-to-end communication"] },
  { day: 18, title: "Full-Stack Integration & Streaming Responses", type: "BUILD", tools: ["FastAPI", "StreamingResponse", "Server-Sent Events", "Streamlit"], objectives: ["Implement real-time streaming responses", "Display tokens incrementally", "Add loading indicators", "Handle interrupted streaming requests", "Verify smooth end-to-end streaming"] },
  { day: 19, title: "Response Formatting & Rich Outputs", type: "BUILD", tools: ["Pydantic", "Markdown", "Streamlit"], objectives: ["Add citations to responses", "Create structured cards for claims", "Render Markdown content", "Validate structured outputs", "Improve readability and trustworthiness"] },
  { day: 20, title: "Conversation Memory & Context Management", type: "SHIP_IT", tools: ["SQLite", "FastAPI", "LLM", "Token Management"], objectives: ["Persist conversation history", "Build context-aware conversations", "Implement automatic summarization", "Manage token limits", "Remember user preferences"] },
  { day: 21, title: "Agentic Frameworks: LangChain Agents & Tool Use", type: "BUILD", tools: ["LangChain", "LangChain Agents", "ReAct", "Python"], objectives: ["Convert function-calling into a reasoning agent", "Wrap chatbot capabilities as LangChain tools", "Build a ReAct agent", "Analyze reasoning traces", "Evaluate tool selection"] },
  { day: 22, title: "Multi-Agent Orchestration", type: "BUILD", tools: ["CrewAI", "LangGraph", "Python"], objectives: ["Create specialized agents for different domains", "Build a router agent", "Implement a multi-agent workflow", "Compare multi-agent vs single-agent", "Identify scenarios for multiple agents"] },
  { day: 23, title: "Model Context Protocol (MCP)", type: "BUILD", tools: ["MCP Python SDK", "Claude Desktop", "Cline", "Python"], objectives: ["Understand the Model Context Protocol", "Build an MCP server exposing chatbot tools", "Connect the MCP server to a client", "Expose capabilities through MCP tools", "Verify tool execution"] },
  { day: 24, title: "Agentic Chatbot Integration", type: "SHIP_IT", tools: ["LangChain", "MCP", "FastAPI", "Python"], objectives: ["Integrate agents, MCP tools, retrieval, and memory", "Replace mock tools with live MCP calls", "Implement retries and error handling", "Perform failure testing", "Build a production-style agentic pipeline"] },
  { day: 25, title: "Chatbot Evaluation & Testing", type: "SHIP_IT", tools: ["Python", "Evaluation Dataset", "Automated Testing"], objectives: ["Create a benchmark dataset", "Evaluate responses for accuracy and grounding", "Measure retrieval quality", "Identify failure cases", "Establish baseline metrics"] },
  { day: 26, title: "Performance Optimization & Cost Management", type: "OPTIMIZE", tools: ["tiktoken", "Python", "FastAPI"], objectives: ["Measure token usage", "Optimize retrieval and prompt size", "Implement response caching", "Benchmark response time", "Document performance improvements"] },
  { day: 27, title: "Security, Privacy & Guardrails", type: "BUILD", tools: ["FastAPI", "Python", "Authentication", "Input Validation"], objectives: ["Secure chatbot APIs", "Validate and sanitize user inputs", "Protect sensitive healthcare information", "Implement prompt-injection safeguards", "Test security scenarios"] },
  { day: 28, title: "Docker & Kubernetes Deployment", type: "SHIP_IT", tools: ["Docker", "Kubernetes", "FastAPI", "React"], objectives: ["Containerize the chatbot", "Deploy to a Kubernetes cluster", "Configure health checks and env vars", "Verify the deployed chatbot", "Prepare for production hosting"] },
  { day: 29, title: "Monitoring, Logging & Observability", type: "BUILD", tools: ["Python Logging", "Prometheus", "Grafana"], objectives: ["Add structured logging", "Monitor API performance", "Track failures and latency", "Build dashboards", "Use monitoring insights to improve reliability"] },
  { day: 30, title: "Production Readiness & Final Testing", type: "SHIP_IT", tools: ["FastAPI", "Docker", "Kubernetes", "Python"], objectives: ["Perform end-to-end testing", "Validate retrieval and agent workflows", "Fix production issues", "Complete deployment documentation", "Prepare for real-world production"] },
  { day: 31, title: "Capstone Project & Final Demo", type: "CAPSTONE", tools: ["FastAPI", "React", "LangChain", "MCP", "Docker", "Kubernetes"], objectives: ["Demonstrate the complete chatbot", "Showcase retrieval, RAG, agents, MCP, and memory", "Present the deployed application", "Evaluate using real-world scenarios", "Publish the final project"] },
];

// ─── Question Bank (keyed by day) ───
const questionBank: Record<number, { question: string; keyConcepts: string[]; followUps: string[] }[]> = {
  7: [
    { question: "Let's start with embeddings. In your own words, how does an embedding model convert text into a vector, and what makes a good embedding?", keyConcepts: ["vector", "similarity", "dimension", "semantic", "cosine", "representation"], followUps: ["You mentioned {concept}. How does that affect retrieval quality?", "How would you evaluate whether your embeddings are good for your domain?"] },
    { question: "You generated embeddings for your knowledge base. How did you decide which embedding model to use, and what trade-offs did you consider?", keyConcepts: ["dimension", "model", "domain", "benchmark", "MTEB", "cost", "latency"], followUps: ["How would you benchmark embeddings for a specific domain?", "What happens if your embedding model doesn't match your domain?"] },
  ],
  8: [
    { question: "Let's talk about vector databases. What are the key factors you'd consider when choosing a vector database for a production system?", keyConcepts: ["scale", "latency", "recall", "cost", "metadata", "filtering", "managed", "self-hosted"], followUps: ["How would that change at scale vs a prototype?", "Which factor would you weight most for a real-time application?"] },
    { question: "You set up both ChromaDB and Pinecone. How would you design the metadata schema to support efficient filtering without degrading search performance?", keyConcepts: ["metadata", "pre-filter", "post-filter", "namespace", "partition", "hybrid"], followUps: ["What are the performance implications of pre vs post filtering?", "How would this handle multi-tenant isolation?"] },
  ],
  10: [
    { question: "Let's discuss the retrieval engine. How did you decide between SQL lookup, vector search, or hybrid retrieval for different types of queries?", keyConcepts: ["router", "SQL", "vector", "hybrid", "semantic", "structured", "deduplicate"], followUps: ["What happens when both retrieval methods return conflicting results?", "How would you measure retrieval accuracy?"] },
    { question: "Your retrieval engine merges results from multiple sources. How do you handle deduplication and ranking?", keyConcepts: ["merge", "deduplicate", "rank", "relevance", "score", "filter"], followUps: ["How would you handle conflicting relevance scores?", "What ranking strategy works best for mixed structured and semantic results?"] },
  ],
  11: [
    { question: "Let's talk about RAG end-to-end. Walk me through how you connected the retrieval engine to an LLM to build a complete RAG pipeline.", keyConcepts: ["retrieve", "augment", "generate", "grounded", "context", "prompt", "LLM"], followUps: ["How did you ensure the LLM only answers from retrieved context?", "What happens when retrieval returns poor results?"] },
    { question: "You used an OpenAI-compatible SDK with multiple LLM providers. How did you handle switching between local and hosted models?", keyConcepts: ["OpenAI SDK", "Ollama", "Groq", "provider", "configuration", "fallback"], followUps: ["How would you handle provider failures gracefully?", "What are the trade-offs between local and hosted models?"] },
  ],
  12: [
    { question: "Let's discuss prompt engineering. What are the core prompt patterns you relied on, and what makes them effective?", keyConcepts: ["system prompt", "role", "instruction", "context", "example", "template", "structure"], followUps: ["How do you test whether a prompt is actually working?", "What happens when prompt patterns conflict?"] },
    { question: "You compared zero-shot, few-shot, and chain-of-thought prompting. When would you use each, and what are the trade-offs?", keyConcepts: ["zero-shot", "few-shot", "chain-of-thought", "accuracy", "cost", "latency"], followUps: ["When does CoT actually hurt performance?", "How do you balance accuracy with cost?"] },
  ],
  13: [
    { question: "Let's talk about function calling. How do you define a tool that an LLM can reliably call?", keyConcepts: ["schema", "description", "parameter", "JSON", "function", "validation", "Pydantic"], followUps: ["What happens if the model passes invalid parameters?", "How detailed should the tool description be?"] },
    { question: "You implemented function calling with Pydantic validation. Walk me through your error handling when a tool call fails.", keyConcepts: ["error", "retry", "fallback", "validation", "parse", "exception", "graceful"], followUps: ["How do you prevent infinite retry loops?", "Should the error message go back to the model or be handled silently?"] },
  ],
  15: [
    { question: "Let's discuss fine-tuning. When is fine-tuning more appropriate than prompting or RAG?", keyConcepts: ["fine-tuning", "prompting", "RAG", "dataset", "LoRA", "QLoRA", "trade-off"], followUps: ["What specific problems does fine-tuning solve that RAG can't?", "How would you decide between LoRA and full fine-tuning?"] },
    { question: "You worked with LoRA and QLoRA. What were the key challenges in preparing the training data and evaluating the results?", keyConcepts: ["dataset", "training", "test", "evaluation", "overfit", "quality", "format"], followUps: ["How do you prevent overfitting with a small dataset?", "What metrics would you use to compare base vs fine-tuned models?"] },
  ],
  16: [
    { question: "Let's talk about the chatbot backend. How did you design your /chat API endpoint to integrate retrieval, function calling, and LLM generation?", keyConcepts: ["FastAPI", "endpoint", "retrieval", "function calling", "generation", "session"], followUps: ["How do you handle long-running LLM generation in the API?", "What's your approach to session management?"] },
    { question: "You implemented session-based conversation management. How do you maintain conversation state across multiple requests?", keyConcepts: ["session", "state", "history", "context", "memory", "SQLite"], followUps: ["How do you handle session expiration?", "What happens when the conversation gets too long?"] },
  ],
  18: [
    { question: "Let's discuss streaming responses. How did you implement real-time streaming from the LLM to the frontend?", keyConcepts: ["streaming", "SSE", "Server-Sent Events", "StreamingResponse", "token", "incremental"], followUps: ["How do you handle interrupted streaming requests?", "What's the client experience like during streaming?"] },
    { question: "You implemented Server-Sent Events for streaming. What are the trade-offs between SSE and other streaming approaches?", keyConcepts: ["SSE", "WebSocket", "polling", "latency", "complexity", "bidirectional"], followUps: ["When would you choose WebSocket over SSE?", "How do you handle backpressure during streaming?"] },
  ],
  20: [
    { question: "Let's talk about conversation memory. How do you persist conversation history across multiple user sessions?", keyConcepts: ["persist", "history", "session", "SQLite", "context", "memory"], followUps: ["How do you balance memory usage with conversation quality?", "What's your strategy for long conversations?"] },
    { question: "You implemented automatic conversation summarization. How do you manage token limits while preserving important context?", keyConcepts: ["summarization", "token", "context", "compression", "priority", "retention"], followUps: ["How do you decide what to summarize vs keep?", "What happens to conversation quality when you compress?"] },
  ],
  21: [
    { question: "Let's discuss agentic AI. Can you explain the ReAct pattern and how it differs from a simple pipeline?", keyConcepts: ["ReAct", "reason", "act", "observe", "loop", "tool", "pipeline", "adaptive"], followUps: ["What makes the 'reason' step different from just calling a tool?", "When would a pipeline be better than an agent?"] },
    { question: "You built a ReAct agent with LangChain. What are the key failure modes of agent loops, and how do you prevent them?", keyConcepts: ["loop", "termination", "max steps", "error", "timeout", "guardrail", "retry"], followUps: ["How do you detect infinite loops in production?", "What's your strategy for tool failures within the loop?"] },
  ],
  22: [
    { question: "Let's talk about multi-agent orchestration. How did you design the router agent to delegate to specialist agents?", keyConcepts: ["router", "delegate", "specialist", "orchestration", "CrewAI", "LangGraph"], followUps: ["How do you handle conflicts between specialist agents?", "When does multi-agent outperform single-agent?"] },
    { question: "You compared multi-agent with single-agent architectures. What scenarios provide measurable benefits for multiple agents?", keyConcepts: ["multi-agent", "single-agent", "comparison", "performance", "complexity", "cost"], followUps: ["How do you justify the added complexity of multi-agent?", "What are the latency implications of agent orchestration?"] },
  ],
  23: [
    { question: "Let's discuss MCP. What problem does the Model Context Protocol solve, and how is it different from just defining tools directly?", keyConcepts: ["protocol", "standard", "interoperability", "server", "client", "discovery", "transport"], followUps: ["What does standardization actually buy you?", "Could you achieve the same thing with a good API design?"] },
    { question: "You built an MCP server. Walk me through the server lifecycle and how capabilities are negotiated between client and server.", keyConcepts: ["lifecycle", "initialize", "capability", "negotiate", "transport", "stdio", "SSE", "handshake"], followUps: ["What happens if negotiation fails?", "How do you handle versioning of capabilities?"] },
  ],
  25: [
    { question: "Let's discuss evaluation. How did you create a benchmark dataset to evaluate your chatbot's responses?", keyConcepts: ["benchmark", "dataset", "accuracy", "grounding", "consistency", "evaluation"], followUps: ["How do you ensure your benchmark covers representative questions?", "What metrics matter most for chatbot quality?"] },
    { question: "You measured retrieval quality and end-to-end response performance. What were the most common failure cases you found?", keyConcepts: ["failure", "retrieval", "generation", "hallucination", "grounding", "latency"], followUps: ["How would you detect these failures in production?", "What improvement areas did you identify?"] },
  ],
  27: [
    { question: "Let's talk about security. How did you secure your chatbot APIs against unauthorized access?", keyConcepts: ["authentication", "authorization", "API", "access", "token", "rate limit"], followUps: ["How would you handle API key management?", "What's your approach to rate limiting?"] },
    { question: "You implemented prompt-injection safeguards. What are the most common attack vectors for LLM applications, and how do you mitigate them?", keyConcepts: ["prompt injection", "jailbreak", "sanitization", "guardrail", "validation", "PII"], followUps: ["How do you test your safeguards against novel attacks?", "How do you balance security with usability?"] },
  ],
  28: [
    { question: "Let's discuss deployment. How did you containerize your chatbot backend and frontend using Docker?", keyConcepts: ["Docker", "container", "image", "Dockerfile", "environment", "build"], followUps: ["How do you handle environment-specific configuration?", "What's your strategy for image size optimization?"] },
    { question: "You deployed to Kubernetes. Walk me through your cluster configuration and health checks.", keyConcepts: ["Kubernetes", "cluster", "pod", "deployment", "health check", "service", "ingress"], followUps: ["How do you handle rolling updates?", "What happens when a pod fails?"] },
  ],
  29: [
    { question: "Let's talk about observability. What should you be logging and monitoring in a production LLM application?", keyConcepts: ["logging", "latency", "token", "cost", "quality", "error", "metric", "alert"], followUps: ["How do you measure quality automatically?", "What's the most important metric to alert on?"] },
    { question: "You set up Prometheus and Grafana. How do you detect quality drift in an LLM application — not just latency or errors, but actual answer quality degrading over time?", keyConcepts: ["drift", "quality", "evaluation", "baseline", "LLM as judge", "sampling"], followUps: ["How do you establish the baseline?", "How do you balance automated vs human evaluation?"] },
  ],
  31: [
    { question: "Let's discuss your capstone. Walk me through the architecture of your final healthcare chatbot and the key decisions you made.", keyConcepts: ["architecture", "RAG", "agents", "MCP", "deployment", "production", "end-to-end"], followUps: ["What was the hardest part to get working?", "If you had more time, what would you improve?"] },
    { question: "You demonstrated the complete system. How did you evaluate it using real-world scenarios, and what did you learn?", keyConcepts: ["evaluation", "real-world", "scenario", "testing", "production", "reliability"], followUps: ["What surprised you during testing?", "How confident are you in the production readiness?"] },
  ],
};

// ─── Session Persistence (Supabase) ───
async function loadSession(sessionId: string): Promise<InterviewState | null> {
  const { data, error } = await supabase
    .from("interview_sessions")
    .select("state")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (error) throw { error: "Database error", code: "DB_ERROR", details: error.message };
  return data ? (data.state as InterviewState) : null;
}

async function saveSession(sessionId: string, candidate: Candidate, state: InterviewState): Promise<void> {
  const { error } = await supabase
    .from("interview_sessions")
    .upsert({ session_id: sessionId, candidate, state, updated_at: new Date().toISOString() });
  if (error) throw { error: "Database error", code: "DB_ERROR", details: error.message };
}

// ─── Helper Functions ───
function getCurriculumDay(day: number): CurriculumDay | undefined {
  return curriculum.find((d) => d.day === day);
}

function getMissionForDay(candidate: Candidate, day: number): CandidateMission | undefined {
  return candidate.missions.find((m) => m.day === day);
}

function getAvailableDays(candidate: Candidate): number[] {
  return candidate.missions.map((m) => m.day);
}

// ─── Topic Selection ───
function selectTopicOrder(candidate: Candidate): number[] {
  const availableDays = getAvailableDays(candidate);
  const passedDays = availableDays.filter((d) => {
    const m = getMissionForDay(candidate, d);
    return m && m.passed && !m.skipped;
  });
  const failedDays = availableDays.filter((d) => {
    const m = getMissionForDay(candidate, d);
    return m && m.passed === false && !m.skipped;
  });
  const skippedDays = availableDays.filter((d) => {
    const m = getMissionForDay(candidate, d);
    return m && m.skipped;
  });

  const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const ordered: number[] = [];

  // Start with 2 passed days (test depth)
  for (const day of shuffle(passedDays)) {
    if (ordered.length < 2) ordered.push(day);
  }
  // Add 1-2 failed days (probe gaps)
  for (const day of shuffle(failedDays)) {
    if (ordered.length < 4) ordered.push(day);
  }
  // Add 1 skipped day (flag gaps)
  for (const day of shuffle(skippedDays)) {
    if (ordered.length < 5) ordered.push(day);
  }
  // Fill remaining from passed days
  for (const day of shuffle(passedDays)) {
    if (!ordered.includes(day) && ordered.length < 6) ordered.push(day);
  }

  return ordered;
}

// ─── Question Selection ───
function selectQuestion(day: number): { question: string; keyConcepts: string[]; followUps: string[] } | null {
  const questions = questionBank[day];
  if (!questions || questions.length === 0) return null;
  return questions[Math.floor(Math.random() * questions.length)];
}

// ─── Answer Evaluation ───
function evaluateAnswer(
  answer: string,
  question: { question: string; keyConcepts: string[]; followUps: string[] },
  previousEvaluations: AnswerEvaluation[]
): AnswerEvaluation {
  const answerLower = answer.toLowerCase();
  const answerWords = answerLower.split(/\s+/);
  const answerLength = answerWords.length;

  const conceptsFound: string[] = [];
  const conceptsMissing: string[] = [];

  for (const concept of question.keyConcepts) {
    const conceptLower = concept.toLowerCase();
    if (answerLower.includes(conceptLower)) {
      conceptsFound.push(concept);
    } else {
      const conceptWords = conceptLower.split(/\s+/);
      const matchedWords = conceptWords.filter((w) => answerLower.includes(w));
      if (matchedWords.length >= Math.ceil(conceptWords.length * 0.6)) {
        conceptsFound.push(concept);
      } else {
        conceptsMissing.push(concept);
      }
    }
  }

  const conceptRatio = conceptsFound.length / question.keyConcepts.length;

  let technicalScore = Math.round(conceptRatio * 7 + (answerLength > 30 ? 2 : 0) + (answerLength > 80 ? 1 : 0));
  technicalScore = Math.min(10, Math.max(1, technicalScore));

  let depthScore = 0;
  if (answerLength > 100) depthScore += 3;
  else if (answerLength > 50) depthScore += 2;
  else if (answerLength > 20) depthScore += 1;
  const multiWordFound = conceptsFound.filter((c) => c.includes(" ") || c.includes("-")).length;
  depthScore += Math.min(3, multiWordFound);
  if (/\bexample\b|\bfor instance\b|\bsuch as\b|\bscenario\b/i.test(answer)) depthScore += 2;
  if (/\btrade-off\b|\bhowever\b|\bon the other hand\b|\bwhereas\b|versus/i.test(answer)) depthScore += 2;
  depthScore = Math.min(10, Math.max(1, depthScore));

  let communicationScore = 5;
  if (answerLength > 30) communicationScore += 1;
  if (answerLength > 80) communicationScore += 1;
  if (/\bfirst\b|\bsecond\b|\bthird\b|\bfinally\b|\bstep\b|\bthen\b|\bnext\b/i.test(answer)) communicationScore += 2;
  if (/\bbecause\b|\btherefore\b|\bthus\b|\bsince\b/i.test(answer)) communicationScore += 1;
  if (answerLength < 15) communicationScore -= 2;
  if (answerLength > 300) communicationScore -= 1;
  communicationScore = Math.min(10, Math.max(1, communicationScore));

  let reasoningScore = 4;
  if (/\bbecause\b|\bcause\b|\bleads to\b|\bresults in\b|\bdue to\b/i.test(answer)) reasoningScore += 2;
  if (/\bif\b|\bthen\b|\bwould\b|\bcould\b|\bmight\b|\bsuppose\b/i.test(answer)) reasoningScore += 2;
  if (/\bcompare\b|\bdifference\b|\bversus\b|\bvs\b|\bbetter\b|\bworse\b/i.test(answer)) reasoningScore += 1;
  if (conceptsFound.length >= question.keyConcepts.length * 0.5) reasoningScore += 1;
  if (answerLength > 60) reasoningScore += 1;
  reasoningScore = Math.min(10, Math.max(1, reasoningScore));

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (conceptRatio >= 0.7) strengths.push(`Strong coverage of key concepts (${conceptsFound.length}/${question.keyConcepts.length})`);
  if (depthScore >= 7) strengths.push("Good depth and specificity");
  if (communicationScore >= 7) strengths.push("Clear, well-structured communication");
  if (reasoningScore >= 7) strengths.push("Solid reasoning and causal thinking");

  if (conceptRatio < 0.3) weaknesses.push(`Missed key concepts: ${conceptsMissing.slice(0, 3).join(", ")}`);
  if (depthScore < 4) weaknesses.push("Answer lacked sufficient depth");
  if (answerLength < 20) weaknesses.push("Answer was too brief");
  if (communicationScore < 4) weaknesses.push("Communication could be clearer");

  const followUpNeeded = conceptRatio < 0.5 || depthScore < 5 || (answerLength < 40 && conceptRatio < 0.7);

  return { technicalScore, depthScore, communicationScore, reasoningScore, strengths, weaknesses, followUpNeeded };
}

// ─── Follow-up Generation ───
function generateFollowUp(
  question: { question: string; keyConcepts: string[]; followUps: string[] },
  answer: string,
  evaluation: AnswerEvaluation
): string {
  const answerLower = answer.toLowerCase();
  const mentionedConcepts = question.keyConcepts.filter((c) => answerLower.includes(c.toLowerCase()));
  const missedConcepts = question.keyConcepts.filter((c) => !answerLower.includes(c.toLowerCase()));
  const template = question.followUps[Math.floor(Math.random() * question.followUps.length)];

  let followUp = template;

  if (template.includes("{concept}")) {
    if (mentionedConcepts.length > 0) {
      followUp = followUp.replace("{concept}", mentionedConcepts[0]);
    } else if (missedConcepts.length > 0) {
      followUp = followUp.replace("{concept}", missedConcepts[0]);
    } else {
      followUp = followUp.replace("{concept}", "that approach");
    }
  }

  if (answer.split(/\s+/).length < 15 && evaluation.depthScore < 4) {
    const clarifications = [
      `I'd like to go a bit deeper. Can you expand on what you mean by that in more detail?`,
      `Let me push you on this. Can you walk me through the actual mechanism or trade-offs involved?`,
      `I want to make sure I understand. Can you give me a concrete example that illustrates what you mean?`,
    ];
    followUp = clarifications[Math.floor(Math.random() * clarifications.length)];
  }

  return followUp;
}

// ─── Opening Question Generation ───
function generateOpeningQuestion(candidate: Candidate, day: number): string {
  const dayInfo = getCurriculumDay(day);
  const mission = getMissionForDay(candidate, day);
  const question = selectQuestion(day);

  if (!dayInfo) return "Let's begin the interview. Can you tell me about your experience with AI engineering?";
  if (!question) return `Let's start with ${dayInfo.title}. Can you tell me about your experience with this topic?`;

  let opening = "";
  if (mission && mission.skipped) {
    opening = `I see you skipped ${dayInfo.title} during the cohort. I'd like to get a sense of where you are with this topic. `;
  } else if (mission && mission.passed === false) {
    opening = `I noticed you had some challenges with ${dayInfo.title}. Let's explore this area. `;
  } else if (mission && mission.passed && (mission.attempts || 1) === 1) {
    opening = `I can see you did really well with ${dayInfo.title} — passed on the first try. Let me test the depth of your understanding. `;
  } else if (mission && mission.passed) {
    opening = `You completed ${dayInfo.title} in the cohort. Let's dive into this topic. `;
  } else {
    opening = `Let's dive into ${dayInfo.title}. `;
  }

  return opening + question.question;
}

// ─── Final Report Generation ───
function generateFeedback(state: InterviewState): Feedback {
  const evaluations = state.evaluations;
  const candidate = state.candidate;

  const avgTechnical = evaluations.length > 0
    ? evaluations.reduce((sum, e) => sum + e.technicalScore, 0) / evaluations.length : 0;
  const avgDepth = evaluations.length > 0
    ? evaluations.reduce((sum, e) => sum + e.depthScore, 0) / evaluations.length : 0;
  const avgCommunication = evaluations.length > 0
    ? evaluations.reduce((sum, e) => sum + e.communicationScore, 0) / evaluations.length : 0;
  const avgReasoning = evaluations.length > 0
    ? evaluations.reduce((sum, e) => sum + e.reasoningScore, 0) / evaluations.length : 0;

  const overall = Math.round((avgTechnical + avgDepth + avgCommunication + avgReasoning) / 4 * 10);

  const allStrengths = evaluations.flatMap((e) => e.strengths);
  const allWeaknesses = evaluations.flatMap((e) => e.weaknesses);

  const strengthCounts = new Map<string, number>();
  for (const s of allStrengths) strengthCounts.set(s, (strengthCounts.get(s) || 0) + 1);
  const weaknessCounts = new Map<string, number>();
  for (const w of allWeaknesses) weaknessCounts.set(w, (weaknessCounts.get(w) || 0) + 1);

  const strengths = Array.from(strengthCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k]) => k);

  const gaps = Array.from(weaknessCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k]) => k);

  // Add curriculum-specific gaps
  for (const day of state.daysCovered) {
    const dayInfo = getCurriculumDay(day);
    const dayEvals = state.evaluations.filter((_, i) => {
      const candidateMsgs = state.messages.filter((m) => m.role === "candidate");
      return candidateMsgs[i] && candidateMsgs[i].day === day;
    });
    if (dayEvals.length > 0) {
      const avgTech = dayEvals.reduce((s, e) => s + e.technicalScore, 0) / dayEvals.length;
      if (avgTech < 5 && dayInfo) {
        gaps.push(`${dayInfo.title} — needs significant revision`);
      }
    }
  }

  const uniqueGaps = [...new Set(gaps)].slice(0, 5);

  const performanceLevel = overall >= 80 ? "strong" : overall >= 60 ? "solid" : overall >= 40 ? "developing" : "needs significant improvement";

  const coveredTitles = state.daysCovered
    .map((d) => getCurriculumDay(d)?.title)
    .filter(Boolean)
    .join(", ");

  const summary = `${candidate.member.name} demonstrated ${performanceLevel} understanding across the topics covered (${coveredTitles}). ` +
    `Technical knowledge: ${Math.round(avgTechnical * 10)}/100, ` +
    `depth: ${Math.round(avgDepth * 10)}/100, ` +
    `communication: ${Math.round(avgCommunication * 10)}/100, ` +
    `reasoning: ${Math.round(avgReasoning * 10)}/100. ` +
    `The interview covered ${state.daysCovered.length} curriculum areas across ${state.questionsAsked} questions. ` +
    (uniqueGaps.length > 0 ? `Key gaps emerged in ${uniqueGaps.slice(0, 2).join(" and ")}.` : "No significant gaps identified.");

  const next: string[] = [];
  if (uniqueGaps.length > 0) next.push(`Review and strengthen: ${uniqueGaps.slice(0, 3).join(", ")}`);
  if (overall < 60) next.push("Revisit foundational concepts before advancing to production-level topics");
  if (avgCommunication < 6) next.push("Practice explaining technical concepts with structured responses");
  if (avgReasoning < 6) next.push("Work on reasoning through trade-offs and design decisions");
  if (overall >= 75) next.push("Consider tackling advanced topics: multi-agent systems, edge deployment, and production reliability");
  next.push("Schedule a follow-up interview after completing recommended revisions");

  return { summary, strengths, gaps: uniqueGaps, next };
}

// ─── Start Interview ───
async function startInterview(sessionId: string, candidate: Candidate): Promise<InterviewState> {
  const topicOrder = selectTopicOrder(candidate);
  const firstDay = topicOrder[0];
  const openingQuestion = generateOpeningQuestion(candidate, firstDay);
  const dayInfo = getCurriculumDay(firstDay);

  const state: InterviewState = {
    sessionId,
    candidate,
    status: "active",
    messages: [
      {
        role: "interviewer",
        content: `Welcome, ${candidate.member.name.split(" ")[0]}. I'm your AI interviewer for today. I've reviewed your learning journey through the AI Cohort, including your completed missions, topics you've explored, and areas you've skipped. I'll be asking you questions across different parts of the curriculum, adapting to your responses. Let's begin.\n\n${openingQuestion}`,
        day: firstDay,
        title: dayInfo?.title,
      },
    ],
    questionsAsked: 1,
    daysCovered: [firstDay],
    currentDay: firstDay,
    evaluations: [],
  };

  await saveSession(sessionId, candidate, state);
  return state;
}

// ─── Submit Answer ───
async function submitAnswer(sessionId: string, answer: string): Promise<{ state: InterviewState; isComplete: boolean }> {
  const state = await loadSession(sessionId);
  if (!state) {
    throw { error: "Session not found", code: "NOT_FOUND", details: `No session with id ${sessionId}` };
  }
  if (state.status === "completed") {
    throw { error: "Interview already completed", code: "CONFLICT", details: "This interview session has been completed" };
  }

  const candidate = state.candidate;
  const lastQuestion = [...state.messages].reverse().find((m) => m.role === "interviewer");
  if (!lastQuestion || !lastQuestion.day) {
    throw { error: "No active question", code: "BAD_STATE" };
  }

  const currentDay = lastQuestion.day;
  const question = selectQuestion(currentDay);
  if (!question) {
    throw { error: "Question not found", code: "BAD_STATE" };
  }

  state.messages.push({ role: "candidate", content: answer, day: currentDay });

  const evaluation = evaluateAnswer(answer, question, state.evaluations);
  state.evaluations.push(evaluation);

  const minQuestions = 8;
  const minDays = 4;
  const hasEnoughQuestions = state.questionsAsked >= minQuestions;
  const hasEnoughDays = state.daysCovered.length >= minDays;
  const shouldFollowUp = evaluation.followUpNeeded && state.questionsAsked < minQuestions + 2;
  const isComplete = hasEnoughQuestions && hasEnoughDays && !shouldFollowUp;

  if (isComplete) {
    state.status = "completed";
    state.currentDay = null;
    state.messages.push({
      role: "interviewer",
      content: `Thank you, ${candidate.member.name.split(" ")[0]}. That concludes our interview. I've evaluated your responses across ${state.daysCovered.length} curriculum areas and ${state.questionsAsked} questions.`,
    });
    await saveSession(sessionId, state.candidate, state);
    return { state, isComplete: true };
  }

  let nextDay: number;

  if (shouldFollowUp) {
    nextDay = currentDay;
    const followUp = generateFollowUp(question, answer, evaluation);
    const dayInfo = getCurriculumDay(nextDay);
    state.messages.push({ role: "interviewer", content: followUp, day: nextDay, title: dayInfo?.title });
  } else {
    const topicOrder = selectTopicOrder(candidate);
    const nextDayIndex = state.daysCovered.length;
    if (nextDayIndex < topicOrder.length) {
      nextDay = topicOrder[nextDayIndex];
    } else {
      const remaining = topicOrder.filter((d) => !state.daysCovered.includes(d));
      nextDay = remaining[0] || topicOrder[0];
    }

    const nextQuestion = selectQuestion(nextDay);
    const dayInfo = getCurriculumDay(nextDay);

    if (nextQuestion) {
      let transition = "";
      const mission = getMissionForDay(candidate, nextDay);
      if (!state.daysCovered.includes(nextDay)) {
        if (mission && mission.skipped) {
          transition = `I'd like to check in on a topic you skipped: ${dayInfo?.title}. Don't worry — I just want to get a sense of your current understanding. `;
        } else if (mission && mission.passed === false) {
          transition = `Let's explore another topic. ${dayInfo?.title} was an area where you had some challenges. `;
        } else {
          transition = `Let's move to ${dayInfo?.title}. `;
        }
      } else {
        transition = `Let's continue exploring this area. `;
      }
      state.messages.push({ role: "interviewer", content: transition + nextQuestion.question, day: nextDay, title: dayInfo?.title });
    }
  }

  state.questionsAsked += 1;
  if (!state.daysCovered.includes(nextDay!)) {
    state.daysCovered.push(nextDay!);
  }
  state.currentDay = nextDay!;

  await saveSession(sessionId, state.candidate, state);
  return { state, isComplete: false };
}

// ─── HTTP Handler ───
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method === "GET") {
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    // Start: { sessionId, candidate: {...full candidate object} }
    if (body.candidate && body.sessionId) {
      const state = await startInterview(body.sessionId, body.candidate as Candidate);
      const lastMsg = state.messages[state.messages.length - 1];
      return new Response(JSON.stringify({
        reply: lastMsg.content,
        done: false,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Conversation turn: { sessionId, message }
    if (body.sessionId && body.message) {
      const result = await submitAnswer(body.sessionId, body.message);
      const lastMsg = result.state.messages[result.state.messages.length - 1];

      if (result.isComplete) {
        const feedback = generateFeedback(result.state);
        return new Response(JSON.stringify({
          reply: lastMsg.content,
          done: true,
          feedback,
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        reply: lastMsg.content,
        done: false,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      error: "Invalid request. Provide { sessionId, candidate } to start, or { sessionId, message } to answer.",
      code: "VALIDATION_ERROR",
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    const status = err.code === "NOT_FOUND" ? 404 : err.code === "CONFLICT" ? 409 : 500;
    return new Response(JSON.stringify(err), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
