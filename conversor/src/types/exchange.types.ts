export type CurrencyCode = 'USD' | 'EUR' | 'PEN' | 'CNY';

export interface ExchangeRateEntry {
  date: string;
  exchangeRate: number;
}

export interface ExchangeRateResponse {
  from: CurrencyCode;
  to: CurrencyCode;
  server: string;
  exchangeRates: ExchangeRateEntry[];
}

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}