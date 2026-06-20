// ============================================================
//  Ask AI — Perplexity configuration
//
//  👉 THIS IS THE ONLY PLACE YOU NEED TO ADD YOUR API KEY.
//     Paste your Perplexity API key between the quotes below.
//     Until you do, the chat opens and works as a UI, but
//     replies are stubbed with a "no key configured" message.
// ============================================================

export const PERPLEXITY_API_KEY = ""; // <-- paste key here, e.g. "pplx-xxxxxxxxxxxxxxxx"

// Perplexity model to use. "sonar" is the cheapest online model.
// Other options: "sonar-pro", "sonar-reasoning", "sonar-reasoning-pro".
export const PERPLEXITY_MODEL = "sonar";

// Perplexity chat-completions endpoint (OpenAI-compatible).
export const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

// How the assistant should behave. Tweak freely.
export const AI_SYSTEM_PROMPT =
  "You are a helpful assistant inside an Adverse Drug Reaction (ADR) reporting app. " +
  "Help clinicians with pharmacovigilance, drug side effects, causality assessment, " +
  "and completing the ADR form. Be concise and accurate. " +
  "Remind users you are not a substitute for professional medical judgment.";

// Convenience flag used by the UI.
export const isAiConfigured = (): boolean => PERPLEXITY_API_KEY.trim().length > 0;
