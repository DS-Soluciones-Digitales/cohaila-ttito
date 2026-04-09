import type { CurrencyCode, ExchangeRateResponse } from '../types/exchange.types';
import { API_CONFIG } from '../config/api.config';
import { getMockExchangeRate } from './exchangeRate.mock';

export async function getExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode,
  dateFrom?: string,
  baseUrl?: string,
  useMock?: boolean
): Promise<ExchangeRateResponse> {
  const shouldMock = useMock ?? API_CONFIG.useMock;
  if (shouldMock) {
    return getMockExchangeRate(from, to, dateFrom);
  }

  const url = new URL(
    `/exchangeRate/${from}/${to}`,
    baseUrl || API_CONFIG.baseUrl
  );
  if (dateFrom) url.searchParams.set('dateFrom', dateFrom);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}
