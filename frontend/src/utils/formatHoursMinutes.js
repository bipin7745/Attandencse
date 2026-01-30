export const formatHoursMinutes = (decimalHours) => {
  if (decimalHours === null || decimalHours === undefined) return "-";

  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  // sirf hours hoy ane minutes 0 hoy
  if (minutes === 0) {
    return `${hours} h`;
  }

  // hours + minutes banne hoy
  return `${hours} h ${minutes} Min`;
};
