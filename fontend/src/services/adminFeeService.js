const VEHICLE_KEY = "adminParkingVehicles";
const UTILITY_KEY = "adminUtilityCharges";

export const PARKING_RATES = {
  "Xe máy": 70000,
  "Ô tô": 1200000,
};

export function loadParkingVehicles() {
  try {
    const data = localStorage.getItem(VEHICLE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveParkingVehicles(vehicles) {
  localStorage.setItem(VEHICLE_KEY, JSON.stringify(vehicles));
}

export function loadUtilityCharges() {
  try {
    const data = localStorage.getItem(UTILITY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUtilityCharges(charges) {
  localStorage.setItem(UTILITY_KEY, JSON.stringify(charges));
}
