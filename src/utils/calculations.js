import { addDays } from 'date-fns';

/**
 * Calcule la consommation moyenne journalière.
 * @param {number} energy - L'énergie obtenue en kWh lors de la recharge précédente.
 * @param {number} duration - La durée en jours que cette énergie a tenue.
 * @returns {number} La consommation moyenne en kWh/jour.
 */
export function calculateAverageConsumption(energy, duration) {
  if (duration <= 0) return 0;
  return energy / duration;
}

/**
 * Estime la durée restante de la nouvelle recharge.
 * @param {number} energy - L'énergie obtenue en kWh lors de la nouvelle recharge.
 * @param {number} averageConsumption - La consommation moyenne en kWh/jour.
 * @returns {number} La durée estimée en jours.
 */
export function calculateEstimatedDuration(energy, averageConsumption) {
  if (averageConsumption <= 0) return 0;
  return energy / averageConsumption;
}

/**
 * Calcule la date d'épuisement estimée.
 * @param {Date|string} rechargeDate - La date de la recharge.
 * @param {number} estimatedDuration - La durée estimée en jours.
 * @returns {Date} La date estimée d'épuisement.
 */
export function calculateDepletionDate(rechargeDate, estimatedDuration) {
  const date = new Date(rechargeDate);
  // addDays from date-fns handles fractional days gracefully, but standard Date manipulation works too.
  // Actually, addDays expects an integer. Let's do it manually if fractional.
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + estimatedDuration * millisecondsInADay);
}
