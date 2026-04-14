import { useState } from "react";
import { db } from "../firebase";
import { ref, get, set, push, remove } from "firebase/database";

const MAX_OCCUPANTS = 2;

function makeRoomKey(block, room) {
  return `${block.trim().toUpperCase()}-${room.trim()}`;
}

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", block: "", room: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [deletePhone, setDeletePhone] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.block.trim()) e.block = "Block is required";
    if (!form.room.trim()) e.room = "Room number is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Phone must be exactly 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus(null);

    try {
      const roomKey = makeRoomKey(form.block, form.room);

      // 1. Duplicate phone check
      const phoneSnap = await get(ref(db, `phones/${form.phone}`));
      if (phoneSnap.exists()) {
        setStatus({ type: "error", msg: "You are already registered in a room." });
        setLoading(false);
        return;
      }

      // 2. Room capacity check
      const roomSnap = await get(ref(db, `rooms/${roomKey}/occupants`));
      const count = roomSnap.exists() ? Object.keys(roomSnap.val()).length : 0;
      if (count >= MAX_OCCUPANTS) {
        setStatus({ type: "error", msg: "Room is already full (2/2 occupants)." });
        setLoading(false);
        return;
      }

      // 3. Write occupant
      const newRef = push(ref(db, `rooms/${roomKey}/occupants`));
      const occupantId = newRef.key;
      await set(newRef, { name: form.name.trim(), phone: form.phone });
      await set(ref(db, `rooms/${roomKey}/block`), form.block.trim().toUpperCase());
      await set(ref(db, `rooms/${roomKey}/room`), form.room.trim());

      // 4. Phone index
      await set(ref(db, `phones/${form.phone}`), { roomKey, occupantId });

      setStatus({
        type: "success",
        msg: `Registered! Room ${roomKey} now has ${count + 1}/${MAX_OCCUPANTS} occupant(s).`,
      });
      setForm({ name: "", block: "", room: "", phone: "" });
    } catch (err) {
      setStatus({ type: "error", msg: `Error: ${err.message}` });
    }
    setLoading(false);
  }

  async function handleDelete(e) {
    e.preventDefault();
    if (!/^\d{10}$/.test(deletePhone)) {
      setDeleteStatus({ type: "error", msg: "Enter a valid 10-digit phone number." });
      return;
    }
    setDeleteLoading(true);
    setDeleteStatus(null);

    try {
      const snap = await get(ref(db, `phones/${deletePhone}`));
      if (!snap.exists()) {
        setDeleteStatus({ type: "error", msg: "No entry found for this phone number." });
        setDeleteLoading(false);
        return;
      }
      const { roomKey, occupantId } = snap.val();
      await remove(ref(db, `rooms/${roomKey}/occupants/${occupantId}`));
      await remove(ref(db, `phones/${deletePhone}`));
      setDeleteStatus({ type: "success", msg: "Your entry has been removed." });
      setDeletePhone("");
    } catch (err) {
      setDeleteStatus({ type: "error", msg: `Error: ${err.message}` });
    }
    setDeleteLoading(false);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <>
      <div className="card">
        <h2 className="card-title">Register Your Room</h2>
        <p className="card-subtitle">Add yourself so others can find you — and vice versa.</p>

        <form onSubmit={handleSubmit} noValidate id="register-form">
          <div className="form-grid">
            <div className="form-group full">
              <label className="form-label" htmlFor="field-name">Full Name</label>
              <input
                id="field-name"
                className={`form-input ${errors.name ? "error" : ""}`}
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                maxLength={60}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="field-block">Block</label>
              <input
                id="field-block"
                className={`form-input ${errors.block ? "error" : ""}`}
                type="text"
                placeholder="e.g. A"
                value={form.block}
                onChange={(e) => handleChange("block", e.target.value)}
                maxLength={10}
              />
              {errors.block && <span className="field-error">{errors.block}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="field-room">Room Number</label>
              <input
                id="field-room"
                className={`form-input ${errors.room ? "error" : ""}`}
                type="text"
                placeholder="e.g. 101"
                value={form.room}
                onChange={(e) => handleChange("room", e.target.value)}
                maxLength={10}
              />
              {errors.room && <span className="field-error">{errors.room}</span>}
            </div>

            <div className="form-group full">
              <label className="form-label" htmlFor="field-phone">Phone Number</label>
              <input
                id="field-phone"
                className={`form-input ${errors.phone ? "error" : ""}`}
                type="tel"
                placeholder="10-digit number"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                inputMode="numeric"
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="form-group full">
              <div className="privacy-notice">
                <span className="icon">⚠️</span>
                Only share information you are comfortable making public. Your name and phone number will be visible to anyone who searches your room.
              </div>
            </div>
          </div>

          <button id="btn-submit" className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Saving…</> : "Register Me"}
          </button>

          {status && (
            <div className={`alert alert-${status.type}`}>
              <span className="alert-icon">{status.type === "error" ? "❌" : "✅"}</span>
              {status.msg}
            </div>
          )}
        </form>
      </div>

      <div className="card">
        <h2 className="card-title">Remove My Entry</h2>
        <p className="card-subtitle">Enter your phone number to remove your registration.</p>
        <form onSubmit={handleDelete} id="delete-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="field-delete-phone">Phone Number</label>
            <input
              id="field-delete-phone"
              className="form-input"
              type="tel"
              placeholder="Your registered 10-digit number"
              value={deletePhone}
              onChange={(e) => { setDeletePhone(e.target.value.replace(/\D/g, "")); setDeleteStatus(null); }}
              maxLength={10}
              inputMode="numeric"
            />
          </div>
          <button id="btn-delete" className="btn btn-secondary" type="submit" disabled={deleteLoading}>
            {deleteLoading ? <><span className="spinner" /> Removing…</> : "🗑️ Remove My Entry"}
          </button>
          {deleteStatus && (
            <div className={`alert alert-${deleteStatus.type}`}>
              <span className="alert-icon">{deleteStatus.type === "error" ? "❌" : "✅"}</span>
              {deleteStatus.msg}
            </div>
          )}
        </form>
      </div>
    </>
  );
}
