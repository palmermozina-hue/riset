// Client agent — sekarang call backend (/api/agent/chat) yang pakai LLM
// stealth/ox-alpha via OpenRouter. Fallback ke script lama kalau backend error.
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const STAGE_NAMES = [
  "Intake",
  "Understanding",
  "Grounding",
  "Tool Call",
  "Approval",
  "Response",
  "Analytics",
];

export const IDLE_TRACE = STAGE_NAMES.map((stage) => ({
  stage,
  status: "idle",
  detail: "—",
  ms: 0,
}));

export const runAgent = async (message, history, sessionId) => {
  const payload = {
    message,
    session_id: sessionId,
    history: history
      .filter((m) => m.text)
      .map((m) => ({ role: m.from === "customer" ? "customer" : "agent", text: m.text })),
  };
  const res = await axios.post(`${API}/agent/chat`, payload, { timeout: 60000 });
  return res.data; // { intent, reply, trace, approval? }
};
