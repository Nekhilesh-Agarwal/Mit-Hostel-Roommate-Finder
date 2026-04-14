import { useState } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";

function makeRoomKey(block, room) {
  return `${block.trim().toUpperCase()}-${room.trim()}`;
}

function getFillBadge(count) {
  if (count === 0) return { cls: "empty", label: "0/2 · No occupants" };
  if (count === 1) return { cls: "partial", label: "1/2 · 1 spot open" };
  return { cls: "full", label: "2/2 · Full 🔴" };
}

export default function SearchRoom() {
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!block.trim() || !room.trim()) {
      setError("Both block and room number are required.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const roomKey = makeRoomKey(block, room);
      const snap = await get(ref(db, `rooms/${roomKey}`));
      if (snap.exists()) {
        const data = snap.val();
        const occupants = data.occupants ? Object.values(data.occupants) : [];
        setResult({ roomKey, block: data.block, room: data.room, occupants });
      } else {
        setResult({ roomKey, block: block.trim().toUpperCase(), room: room.trim(), occupants: [] });
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
    setLoading(false);
  }

  const badge = result ? getFillBadge(result.occupants.length) : null;

  return (
    <div className="card">
      <h2 className="card-title">Search a Room</h2>
      <p className="card-subtitle">Look up any room to see who has registered so far.</p>

      <form onSubmit={handleSearch} id="search-form" noValidate>
        <div className="search-bar">
          <div className="form-group">
            <label className="form-label" htmlFor="search-block">Block</label>
            <input
              id="search-block"
              className="form-input"
              type="text"
              placeholder="e.g. A"
              value={block}
              onChange={(e) => { setBlock(e.target.value); setError(""); }}
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="search-room">Room Number</label>
            <input
              id="search-room"
              className="form-input"
              type="text"
              placeholder="e.g. 101"
              value={room}
              onChange={(e) => { setRoom(e.target.value); setError(""); }}
              maxLength={10}
            />
          </div>
          <button
            id="btn-search"
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: 0 }}
          >
            {loading ? <span className="spinner" /> : "Search"}
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginTop: 12 }}>
            <span className="alert-icon">❌</span> {error}
          </div>
        )}
      </form>

      {result && (
        <div className="room-result">
          <div className="room-result-header">
            <span className="room-result-title">
              Block {result.block} · Room {result.room}
            </span>
            <span className={`fill-badge ${badge.cls}`}>{badge.label}</span>
          </div>

          {result.occupants.length === 0 ? (
            <div className="empty-state">
              <span className="icon">🛏️</span>
              <p>No one has registered yet.<br />Be the first to claim this room!</p>
            </div>
          ) : (
            <div className="occupant-list">
              {result.occupants.map((occ, i) => (
                <div key={i} className="occupant-card">
                  <div className="occupant-avatar">
                    {occ.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="occupant-info">
                    <div className="occupant-name">{occ.name}</div>
                    <div className="occupant-phone">📞 {occ.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
