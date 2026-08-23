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

/** Streaming variant — SSE. Callbacks:
 *   onStart(trace_id), onChunk(text), onDone({intent, reply, trace, approval, trace_id})
 * Return: promise resolved dgn payload done, atau reject kalau network error.
 */
export const runAgentStream = async (message, history, sessionId, cb) => {
  const payload = {
    message,
    session_id: sessionId,
    history: history
      .filter((m) => m.text)
      .map((m) => ({ role: m.from === "customer" ? "customer" : "agent", text: m.text })),
  };
  const res = await fetch(`${API}/agent/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok || !res.body) throw new Error(`stream failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = null;

  // SSE parser: split on "\n\n", each frame has "data: {...}"
  // Loop until reader closes.
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { value, done: closed } = await reader.read();
    if (closed) break;
    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() || "";
    for (const frame of frames) {
      if (!frame.startsWith("data: ")) continue;
      try {
        const evt = JSON.parse(frame.slice(6));
        if (evt.type === "start") cb?.onStart?.(evt.trace_id);
        else if (evt.type === "chunk") cb?.onChunk?.(evt.text);
        else if (evt.type === "done") {
          done = evt;
          cb?.onDone?.(evt);
        }
      } catch {
        /* ignore malformed frame */
      }
    }
  }
  return done;
};
