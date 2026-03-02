/**
 * Safely parse date value (string, timestamp, or Date) to Date object.
 */
export function toSafeDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (value?.toDate && typeof value.toDate === 'function') {
    return value.toDate();
  }
  return null;
}

export function isSameDay(a, b) {
  if (!a || !b) return false;
  const d1 = toSafeDate(a);
  const d2 = toSafeDate(b);
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
