export const DEMO = {
  page: "demo-page",
  chatInput: "demo-chat-input",
  sendButton: "demo-send-btn",
  quickReply: (key) => `demo-quick-${key}`,
  message: (i) => `demo-message-${i}`,
  pipelineStage: (name) => `demo-pipeline-${name.toLowerCase().replace(/\s+/g, "-")}`,
  openDashboard: "demo-open-dashboard",
  resetButton: "demo-reset-btn",
  backHome: "demo-back-home",
};
