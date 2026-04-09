import type { CurrencyCode, CurrencyInfo } from '../types/exchange.types';

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: 'US$', name: 'Dolares US', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'PEN', symbol: 'S/.', name: 'Soles', flag: '🇵🇪' },
  { code: 'CNY', symbol: '¥', name: 'Yuanes', flag: '🇨🇳' },
];

export const ALLOWED_COMBINATIONS: Record<CurrencyCode, Record<CurrencyCode, boolean>> = {
  USD: { USD: false, EUR: true, PEN: true, CNY: false },
  EUR: { USD: true, EUR: false, PEN: true, CNY: true },
  PEN: { USD: true, EUR: true, PEN: false, CNY: true },
  CNY: { USD: false, EUR: true, PEN: true, CNY: false },
};

export const isAllowed = (from: CurrencyCode, to: CurrencyCode): boolean =>
  ALLOWED_COMBINATIONS[from][to];

export const getCurrencyInfo = (code: CurrencyCode): CurrencyInfo =>
  CURRENCIES.find(c => c.code === code)!;

export const getFirstAllowedTo = (from: CurrencyCode): CurrencyCode => {
  const entry = Object.entries(ALLOWED_COMBINATIONS[from]).find(([, ok]) => ok);
  return (entry?.[0] as CurrencyCode) || from;
};
