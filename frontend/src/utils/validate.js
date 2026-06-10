export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function isEmail(value) {
  if (!value) return false;
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value);
}

export function isPhoneNumber(value) {
  if (!value) return false;
  return /^[0-9\s()+-]{8,20}$/.test(value);
}

export function isPositiveAmount(value) {
  if (!value) return false;
  const number = Number(String(value).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(number) && number > 0;
}

export function isDate(value) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export function validateResidentData(data) {
  return {
    name: isRequired(data.name),
    unit: isRequired(data.unit),
    phone: isPhoneNumber(data.phone),
    email: isEmail(data.email),
  };
}
