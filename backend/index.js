// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Ajv = require('ajv');
const { generateFromGroq } = require('./groqClient');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const schema = require('./schema/ui-spec.schema.json');
const ajv = new Ajv();
const validate = ajv.compile(schema);

// read prompt template
const promptTemplate = fs.readFileSync(path.join(__dirname, 'promptTemplates', 'ui_generator.template.txt'), 'utf8');

app.post('/generate', async (req, res) => {
  try {
    const { instruction, model } = req.body;
    if (!instruction) return res.status(400).json({ error: 'instruction required' });

    // Build messages for Chat Completions
    const messages = [
      { role: 'system', content: promptTemplate },
      { role: 'user', content: instruction }
    ];

    const raw = await generateFromGroq({ messages, model });

    // Attempt to extract text output
    // OpenAI-like response: choices[0].message.content
    let textOut = null;
    try {
      if (raw?.choices?.[0]?.message?.content) {
        textOut = raw.choices[0].message.content;
      } else if (raw?.choices?.[0]?.text) {
        textOut = raw.choices[0].text;
      } else if (raw?.result) {
        // Groq Compound style
        textOut = raw.result;
      } else {
        textOut = JSON.stringify(raw);
      }
    } catch (e) {
      textOut = JSON.stringify(raw);
    }

    // Try to parse JSON from the model output
    let spec = null;
    try {
      // If model mistakenly returns code block fences, strip them
      const cleaned = textOut.replace(/^```json\s*|```$/g, '').trim();
      spec = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse JSON from LLM output', raw: textOut });
    }

    // Validate spec with JSON Schema
    const valid = validate(spec);
    if (!valid) {
      return res.status(400).json({ error: 'Spec validation failed', details: validate.errors, spec });
    }

    // Optionally: sanitize props, remove disallowed fields, etc.
    return res.json({ spec });
  } catch (err) {
    console.error('generate error', err?.response?.data || err);
    return res.status(500).json({ error: 'internal_error', details: err?.message || err });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
