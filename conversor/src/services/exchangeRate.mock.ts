import type { CurrencyCode, ExchangeRateResponse } from '../types/exchange.types';

const BASE_RATES: Record<string, number> = {
  'USD-EUR': 0.92,
  'USD-PEN': 3.71,
  'EUR-USD': 1.09,
  'EUR-PEN': 4.05,
  'EUR-CNY': 7.89,
  'PEN-USD': 0.27,
  'PEN-EUR': 0.25,
  'PEN-CNY': 1.95,
  'CNY-EUR': 0.127,
  'CNY-PEN': 0.513,
};

const MS_DAY = 24 * 60 * 60 * 1000;

const toStartOfDay = (d: Date) =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

const addDays = (d: Date, days: number) => new Date(d.getTime() + days * MS_DAY);

const formatIsoDate = (d: Date) =>
  `${d.toISOString().split('T')[0]}T00:00:00.000Z`;

function getWindowStart(dateFrom?: string): Date {
  const today = toStartOfDay(new Date());
  const defaultStart = addDays(today, -4);
  if (!dateFrom) return defaultStart;

  const parsed = new Date(dateFrom);
  if (Number.isNaN(parsed.getTime())) return defaultStart;

  let start = toStartOfDay(parsed);
  const end = addDays(start, 4);
  if (end > today) {
    const diff = Math.ceil((end.getTime() - today.getTime()) / MS_DAY);
    start = addDays(start, -diff);
  }
  return start;
}

function generateRates(base: number, start: Date, days: number = 5) {
  const rates = [] as { date: string; exchangeRate: number }[];
  for (let i = 0; i < days; i++) {
    const d = addDays(start, i);
    const variation = (Math.random() - 0.5) * 0.04 * base;
    rates.push({
      date: formatIsoDate(d),
      exchangeRate: parseFloat((base + variation).toFixed(4)),
    });
  }
  return rates;
}

export async function getMockExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode,
  dateFrom?: string
): Promise<ExchangeRateResponse> {
  await new Promise(r => setTimeout(r, 400));
  const key = `${from}-${to}`;
  const base = BASE_RATES[key] ?? 1;
  const start = getWindowStart(dateFrom);
  return {
    from,
    to,
    server: 'servidor mock (local)',
    exchangeRates: generateRates(base, start),
  };
}
