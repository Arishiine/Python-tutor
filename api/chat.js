import { SYSTEM_PROMPT } from "./_prompt.js";

const MAX_CHARS = 8000;
const MAX_MESSAGES = 7;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST." });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Server is missing GROQ_API_KEY." });
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
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || "llama-3.3-70b-versatile",
        max_tokens: 2000,
        temperature: 0.2,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(502).json({ error: data?.error?.message || "Upstream error." });
    }
    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "Could not reach the model. Try again." });
  }
}
