export function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatNumber(value) {
  if (value === null || value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat().format(value);
}

export function formatStatus(value) {
  if (!value) {
    return 'unknown';
  }

  return String(value).replace(/[-_]/g, ' ');
}
