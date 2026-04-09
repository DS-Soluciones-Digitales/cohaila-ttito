import { useState, useEffect, useCallback } from 'react';
import type { CurrencyCode, ExchangeRateResponse } from '../types/exchange.types';
import { getExchangeRate } from '../services/exchangeRate.service';
import { isAllowed } from '../constants/currencies';

interface UseExchangeRateResult {
  data: ExchangeRateResponse | null;
  loading: boolean;
  error: string | null;
  currentRate: number | null;
  refetch: () => void;
}

export function useExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode,
  options?: {
    backendUrl?: string;
    dateFrom?: string;
    useMock?: boolean;
  }
): UseExchangeRateResult {
  const [data, setData] = useState<ExchangeRateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isAllowed(from, to)) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getExchangeRate(
        from,
        to,
        options?.dateFrom,
        options?.backendUrl,
        options?.useMock
      );
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [from, to, options?.backendUrl, options?.dateFrom, options?.useMock]);

  useEffect(() => { fetch(); }, [fetch]);

  const currentRate = data?.exchangeRates?.at(-1)?.exchangeRate ?? null;

  return { data, loading, error, currentRate, refetch: fetch };
}
