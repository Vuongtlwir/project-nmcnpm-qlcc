const RESIDENT_KEY = "residents";

const defaultResidents = [
  {
    id: "R-001",
    name: "Nguyễn Văn A",
    unit: "A-101",
    phone: "0905 123 456",
    email: "a@example.com",
    status: "Đang thuê",
    nationalId: "012345678901",
    username: "012345678901",
    password: "A101admin",
  },
  {
    id: "R-002",
    name: "Trần Thị B",
    unit: "B-302",
    phone: "0916 234 567",
    email: "b@example.com",
    status: "Đang thuê",
    nationalId: "012345678902",
    username: "012345678902",
    password: "B302admin",
  },
  {
    id: "R-003",
    name: "Lê Văn C",
    unit: "C-205",
    phone: "0927 345 678",
    email: "c@example.com",
    status: "Đang thuê",
    nationalId: "012345678903",
    username: "012345678903",
    password: "C205admin",
  },
];

function generateResidentId() {
  return `R-${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 90 + 10)}`;
}

function generatePassword() {
  const randomPart = Math.random().toString(36).slice(-8);
  const numberPart = Math.floor(Math.random() * 900 + 100);
  return `${randomPart}${numberPart}`;
}

function normalizeResident(resident) {
  const username = resident.username || resident.nationalId || resident.email || resident.id;
  const nationalId = resident.nationalId || (/^\d{9,}$/.test(username) ? username : "");

  return {
    ...resident,
    nationalId,
    username,
    password: resident.password || generatePassword(),
  };
}

export function loadResidents() {
  try {
    const data = localStorage.getItem(RESIDENT_KEY);
    const rawResidents = data ? JSON.parse(data) : defaultResidents;
    const normalizedResidents = rawResidents.map(normalizeResident);

    if (data && JSON.stringify(normalizedResidents) !== JSON.stringify(rawResidents)) {
      saveResidents(normalizedResidents);
    }

    return normalizedResidents;
  } catch {
    return defaultResidents.map(normalizeResident);
  }
}

export function saveResidents(residents) {
  localStorage.setItem(RESIDENT_KEY, JSON.stringify(residents));
}

export function addResident(payload) {
  const residents = loadResidents();
  const newResident = {
    id: generateResidentId(),
    name: payload.name,
    unit: payload.unit,
    nationalId: payload.nationalId,
    phone: payload.phone,
    email: payload.email,
    username: payload.nationalId,
    password: generatePassword(),
    status: payload.status || "Đang thuê",
  };
  const updated = [...residents, newResident];
  saveResidents(updated);
  return newResident;
}

export async function getResidents(query = {}) {
  // Keep API helper for future backend integration.
  console.warn("getResidents is not connected to a backend API; using local storage fallback.");
  return loadResidents();
}

export async function getResidentById(id) {
  const residents = loadResidents();
  return residents.find((item) => item.id === id) || null;
}

export async function createResident(payload) {
  return addResident(payload);
}

export async function updateResident(id, payload) {
  const residents = loadResidents();
  const updated = residents.map((item) =>
    item.id === id ? { ...item, ...payload } : item
  );
  saveResidents(updated);
  return updated.find((item) => item.id === id) || null;
}

export async function deleteResident(id) {
  const residents = loadResidents();
  const updated = residents.filter((item) => item.id !== id);
  saveResidents(updated);
  return { success: true };
}
