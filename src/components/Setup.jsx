import { useState } from "react";
import { createBin, saveConfig } from "../jsonbin";

export default function Setup({ onReady }) {
  const [masterKey, setMasterKey] = useState("");
  const [binId, setBinId] = useState("");
  const [mode, setMode] = useState("new"); // "new" | "existing"
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleCreate() {
    if (!masterKey.trim()) {
      setStatus({ type: "error", msg: "Please enter your Master Key." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const id = await createBin(masterKey);
      saveConfig(masterKey, id);
      setStatus({ type: "success", msg: `Bin created! ID: ${id}` });
      setTimeout(() => onReady(), 800);
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    }
    setLoading(false);
  }

  async function handleExisting() {
    if (!masterKey.trim() || !binId.trim()) {
      setStatus({ type: "error", msg: "Both Master Key and Bin ID are required." });
      return;
    }
    saveConfig(masterKey, binId);
    onReady();
  }

  return (
    <div className="setup-overlay">
      <div className="setup-card">
        <div className="setup-icon">🔑</div>
        <h2 className="setup-title">Connect Your Database</h2>
        <p className="setup-desc">
          This app uses <strong>JSONBin.io</strong> — a free shared database.
          Setup takes under 2 minutes.
        </p>

        {/* Step 1: Get API Key */}
        <div className="setup-step">
          <div className="step-num">1</div>
          <div className="step-body">
            <p className="step-title">Get your free API key</p>
            <p className="step-hint">
              Go to{" "}
              <a href="https://jsonbin.io" target="_blank" rel="noreferrer">
                jsonbin.io
              </a>{" "}
              → Sign up free → <strong>API Keys</strong> page → copy your <em>Master Key</em>
            </p>
            <input
              id="setup-master-key"
              className="form-input"
              type="password"
              placeholder="Paste Master Key here ($2b$10$...)"
              value={masterKey}
              onChange={(e) => { setMasterKey(e.target.value); setStatus(null); }}
            />
          </div>
        </div>

        {/* Step 2: New or existing bin */}
        <div className="setup-step">
          <div className="step-num">2</div>
          <div className="step-body">
            <p className="step-title">Choose an option</p>
            <div className="setup-options">
              <button
                id="opt-new"
                className={`opt-btn ${mode === "new" ? "opt-active" : ""}`}
                onClick={() => { setMode("new"); setStatus(null); }}
              >
                🆕 Create new database
              </button>
              <button
                id="opt-existing"
                className={`opt-btn ${mode === "existing" ? "opt-active" : ""}`}
                onClick={() => { setMode("existing"); setStatus(null); }}
              >
                🔗 Use existing Bin ID
              </button>
            </div>

            {mode === "existing" && (
              <input
                id="setup-bin-id"
                className="form-input"
                style={{ marginTop: 12 }}
                type="text"
                placeholder="Paste Bin ID (e.g. 664abc...)"
                value={binId}
                onChange={(e) => { setBinId(e.target.value); setStatus(null); }}
              />
            )}

            <p className="step-hint" style={{ marginTop: 10 }}>
              💡 <strong>Share the Bin ID</strong> with roommates so they use the same database.
            </p>
          </div>
        </div>

        {/* Action */}
        <button
          id="btn-setup"
          className="btn btn-primary"
          style={{ marginTop: 8 }}
          onClick={mode === "new" ? handleCreate : handleExisting}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : mode === "new" ? "Create & Connect →" : "Connect →"}
        </button>

        {status && (
          <div className={`alert alert-${status.type}`} style={{ marginTop: 16 }}>
            <span className="alert-icon">{status.type === "error" ? "❌" : "✅"}</span>
            {status.msg}
          </div>
        )}

        <p className="setup-footnote">
          JSONBin free tier: 10,000 requests/month. More than enough for a hostel.
          Your API key is stored only in <em>this browser</em>.
        </p>
      </div>
    </div>
  );
}
