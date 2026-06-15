/**
 * Generate code helpers
 */

const generateRandomDigits = (length = 6) => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Generate Resident Code (CD-XXXXXX)
 */
const generateResidentCode = () => {
  return `CD-${generateRandomDigits(6)}`;
};

/**
 * Generate Fee Code (KT-XXXXXX)
 */
const generateFeeCode = () => {
  return `KT-${generateRandomDigits(6)}`;
};

/**
 * Generate Payment Code (TT-XXXXXX)
 */
const generatePaymentCode = () => {
  return `TT-${generateRandomDigits(6)}`;
};

const generateBookingCode = () => {
  return `DV-${generateRandomDigits(6)}`;
};

module.exports = {
  generateResidentCode,
  generateFeeCode,
  generatePaymentCode,
  generateBookingCode
};
