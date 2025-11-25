import React, { useState } from 'react';
import axios from 'axios';
import { renderSpec } from './renderer/uiRenderer';

export default function App() {
  const [instruction, setInstruction] = useState('Show a welcome title, two cards side-by-side, and a signup form with name and submit button.');
  const [spec, setSpec] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.post('http://localhost:4000/generate', { instruction });
      setSpec(resp.data.spec);
    } catch (e) {
      setError(e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Dynamic UI (Web)</h1>

      <div>
        <textarea value={instruction} onChange={e => setInstruction(e.target.value)} rows={4} cols={80}/>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={generate} disabled={loading}>{loading ? 'Generating...' : 'Generate UI'}</button>
      </div>

      {error && <pre style={{ color: 'red' }}>{JSON.stringify(error, null, 2)}</pre>}

      <hr />

      <div>
        <h2>Preview</h2>
        {spec ? renderSpec(spec) : <div>No spec generated yet. Click Generate UI.</div>}
      </div>

      <hr />
      <div>
        <h3>Spec JSON</h3>
        <pre style={{ background:'#f7f7f7', padding: 12 }}>{spec ? JSON.stringify(spec, null, 2) : '—'}</pre>
      </div>
    </div>
  );
}
