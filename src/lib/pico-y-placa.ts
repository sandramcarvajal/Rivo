/**
 * Pico y Placa Rules Configuration
 * Every day of the week maps to an array of restricted digits.
 * 0: Sunday, 1: Monday, ..., 4: Thursday, ...
 */
export const PICO_Y_PLACA_RULES: Record<number, number[]> = {
  1: [0, 9], // Monday
  2: [1, 2], // Tuesday
  3: [3, 4], // Wednesday
  4: [5, 6], // Thursday (Requested Rule)
  5: [7, 8], // Friday
};

/**
 * Evaluates if a vehicle has restriction based on its plate and current date.
 * @param placa The vehicle plate (e.g., SYC123)
 * @param date Optional date to evaluate (defaults to today)
 * @returns boolean
 */
export const checkPicoYPlaca = (placa: string, date: Date = new Date()): boolean => {
  if (!placa || placa.length < 1) return false;
  
  const lastDigit = parseInt(placa.slice(-1));
  if (isNaN(lastDigit)) return false;

  const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
  const restrictedDigits = PICO_Y_PLACA_RULES[dayOfWeek];

  return restrictedDigits ? restrictedDigits.includes(lastDigit) : false;
};
