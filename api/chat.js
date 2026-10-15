import { SYSTEM_PROMPT } from "./_prompt.js";

const MAX_CHARS = 8000;
const MAX_MESSAGES = 7;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST." });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY." });
  }

  const messages = req.body?.messages;
  const valid =
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages[0].role === "user" &&
    messages.every(
      (m, i) =>
        typeof m.content === "string" &&
        m.content.length <= MAX_CHARS &&
        m.role === (i % 2 === 0 ? "user" : "assistant")
    );
  if (!valid) {
    return res.status(400).json({ error: "Invalid messages. Keep code under 8,000 characters." });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(502).json({ error: data?.error?.message || "Upstream error." });
    }
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "Could not reach the model. Try again." });
  }
}
