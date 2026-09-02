export function formatMoney(value: number | string | null | undefined): string {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return '—';
  }
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : value;
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function firstDayOfMonthISO(): string {
  const now = new Date();
  return toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
}

export function lastDayOfMonthISO(): string {
  const now = new Date();
  return toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
}

export function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.replace(/\s/g, '').replace(',', '.');
    return Number(normalized);
  }
  return NaN;
}

export function collectErrors(errors: { property: string; constraints?: Record<string, string> }[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const error of errors) {
    const messages = error.constraints ? Object.values(error.constraints) : [];
    if (messages.length) {
      map[error.property] = messages[0];
    }
  }
  return map;
}
