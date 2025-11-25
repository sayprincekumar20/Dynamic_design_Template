// backend/groqClient.js
const axios = require('axios');

const GROQ_BASE = process.env.GROQ_API_BASE || 'https://api.groq.com/openai/v1';
const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
  console.warn('WARNING: GROQ_API_KEY not set. Set it in .env.');
}

async function generateFromGroq({messages, model = 'openai/gpt-oss-120b'}) {
  // Uses the Groq OpenAI-compatible /chat/completions endpoint.
  // Docs: Groq Chat Completions (see quickstart). :contentReference[oaicite:1]{index=1}
  const url = `${GROQ_BASE}/chat/completions`;

  const payload = {
    model,
    messages
  };

  const headers = {
    'Authorization': `Bearer ${GROQ_KEY}`,
    'Content-Type': 'application/json'
  };

  const resp = await axios.post(url, payload, { headers });
  // Response shape may vary; for OpenAI-compatible APIs, look for resp.data.choices[0].message.content
  return resp.data;
}

module.exports = { generateFromGroq };
