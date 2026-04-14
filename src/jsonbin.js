const BASE_URL = "https://api.jsonbin.io/v3";

export function getConfig() {
  return {
    masterKey: localStorage.getItem("rf_master_key") || "",
    binId: localStorage.getItem("rf_bin_id") || "",
  };
}

export function saveConfig(masterKey, binId) {
  localStorage.setItem("rf_master_key", masterKey.trim());
  localStorage.setItem("rf_bin_id", binId.trim());
}

export function clearConfig() {
  localStorage.removeItem("rf_master_key");
  localStorage.removeItem("rf_bin_id");
}

export function hasConfig() {
  const { masterKey, binId } = getConfig();
  return !!(masterKey && binId);
}

function makeHeaders(masterKey) {
  const key = masterKey || getConfig().masterKey;
  return {
    "Content-Type": "application/json",
    "X-Master-Key": key,
    "X-Bin-Meta": "false",
  };
}

export async function readData() {
  const { binId, masterKey } = getConfig();
  const res = await fetch(`${BASE_URL}/b/${binId}/latest`, {
    headers: makeHeaders(masterKey),
  });
  if (!res.ok) throw new Error(`Read failed (${res.status})`);
  const json = await res.json();
  return json.record;
}

export async function writeData(data) {
  const { binId, masterKey } = getConfig();
  const res = await fetch(`${BASE_URL}/b/${binId}`, {
    method: "PUT",
    headers: makeHeaders(masterKey),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Write failed (${res.status})`);
  return res.json();
}

export async function createBin(masterKey) {
  const res = await fetch(`${BASE_URL}/b`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": masterKey.trim(),
      "X-Bin-Name": "roommate-finder",
      "X-Bin-Private": "false",
    },
    body: JSON.stringify({ rooms: {}, phones: {} }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Could not create bin (${res.status}): ${msg}`);
  }
  const json = await res.json();
  return json.metadata.id;
}
