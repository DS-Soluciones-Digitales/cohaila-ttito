import { useEffect, useMemo, useState } from 'react';
import { CurrencyInput } from '../../components/CurrencyInput/CurrencyInput';
import { ExchangeChart } from '../../components/ExchangeChart/ExchangeChart';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import { getCurrencyInfo, getFirstAllowedTo, isAllowed } from '../../constants/currencies';
import { API_CONFIG } from '../../config/api.config';
import type { CurrencyCode } from '../../types/exchange.types';
import './ConversorPage.css';

const STORAGE_URL = 'conversor.backendUrl';
const STORAGE_MOCK = 'conversor.useMock';
const STORAGE_DATE = 'conversor.dateFrom';

const MS_DAY = 24 * 60 * 60 * 1000;

const addDays = (d: Date, days: number) => new Date(d.getTime() + days * MS_DAY);
const formatDateInput = (d: Date) => d.toISOString().slice(0, 10);

const parseAmount = (value: string) => {
  const normalized = value.replace(',', '.').replace(/[^\d.-]/g, '');
  if (!normalized || normalized === '-' || normalized === '.') return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
};

const formatAmount = (value: number) => {
  const fixed = value.toFixed(2);
  return fixed.replace('.', ',');
};

const formatDateTime = (value: Date) => {
  const date = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = value.getFullYear();
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${date}.${month}.${year} ${hours}:${minutes}`;
};

const getStoredValue = (key: string) => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
};

export function ConversorPage() {
  const [from, setFrom] = useState<CurrencyCode>('EUR');
  const [to, setTo] = useState<CurrencyCode>('USD');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');
  const [lastEdited, setLastEdited] = useState<'from' | 'to'>('from');
  const [pendingReset, setPendingReset] = useState(true);

  const [backendUrl, setBackendUrl] = useState(
    () => getStoredValue(STORAGE_URL) || API_CONFIG.baseUrl
  );
  const [useMock, setUseMock] = useState(() => {
    const stored = getStoredValue(STORAGE_MOCK);
    return stored ? stored === 'true' : API_CONFIG.useMock;
  });
  const [dateFrom, setDateFrom] = useState(() => {
    const stored = getStoredValue(STORAGE_DATE);
    if (stored) return stored;
    return formatDateInput(addDays(new Date(), -4));
  });

  const { data, loading, error, currentRate } = useExchangeRate(from, to, {
    backendUrl,
    dateFrom,
    useMock,
  });

  const today = new Date();
  const minDate = formatDateInput(addDays(today, -4));
  const maxDate = formatDateInput(today);

  useEffect(() => {
    if (dateFrom < minDate) setDateFrom(minDate);
    if (dateFrom > maxDate) setDateFrom(maxDate);
  }, [dateFrom, maxDate, minDate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_URL, backendUrl);
  }, [backendUrl]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_MOCK, String(useMock));
  }, [useMock]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_DATE, dateFrom);
  }, [dateFrom]);

  useEffect(() => {
    setFromValue('1');
    setToValue('');
    setLastEdited('from');
    setPendingReset(true);
  }, [from, to]);

  useEffect(() => {
    if (!currentRate) return;
    if (pendingReset) {
      setFromValue('1');
      setToValue(formatAmount(currentRate));
      setPendingReset(false);
    }
  }, [currentRate, pendingReset]);

  useEffect(() => {
    if (!currentRate) return;
    if (lastEdited === 'from') {
      const amount = parseAmount(fromValue);
      if (amount === null) return;
      setToValue(formatAmount(amount * currentRate));
      return;
    }
    const amount = parseAmount(toValue);
    if (amount === null) return;
    setFromValue(formatAmount(amount / currentRate));
  }, [currentRate, fromValue, toValue, lastEdited]);

  const handleFromChange = (value: CurrencyCode) => {
    if (isAllowed(value, to)) {
      setFrom(value);
      return;
    }
    setFrom(value);
    setTo(getFirstAllowedTo(value));
  };

  const handleToChange = (value: CurrencyCode) => {
    if (!isAllowed(from, value)) return;
    setTo(value);
  };

  const handleFromAmount = (value: string) => {
    setLastEdited('from');
    setFromValue(value);
    const amount = parseAmount(value);
    if (amount === null || !currentRate) {
      setToValue('');
      return;
    }
    setToValue(formatAmount(amount * currentRate));
  };

  const handleToAmount = (value: string) => {
    setLastEdited('to');
    setToValue(value);
    const amount = parseAmount(value);
    if (amount === null || !currentRate) {
      setFromValue('');
      return;
    }
    setFromValue(formatAmount(amount / currentRate));
  };

  const fromInfo = getCurrencyInfo(from);
  const toInfo = getCurrencyInfo(to);
  const now = new Date();
  const serverLabel = data?.server || 'servidor no disponible';
  const chartData = useMemo(() => data?.exchangeRates?.slice(-5) ?? [], [data]);

  const conversionText = currentRate
    ? `${formatAmount(currentRate)} ${toInfo.name} (${toInfo.symbol})`
    : '--';

  return (
    <main className="layout">
      <section className="board">
        <div className="board__left">
          <div className="rate-info">
            <p className="rate-info__line-1">1 {fromInfo.name} ({fromInfo.symbol}) equivale a</p>
            <p className="rate-info__line-2">{conversionText}</p>
            <p className="rate-info__line-3">
              {formatDateTime(now)} - Obtenido de {serverLabel}
            </p>
            {loading && <p className="rate-info__status">Cargando tipo de cambio...</p>}
            {error && <p className="rate-info__status rate-info__status--error">{error}</p>}
          </div>

          <div className="rows">
            <CurrencyInput
              id="from"
              label="Monto origen"
              amount={fromValue}
              currency={from}
              onAmountChange={handleFromAmount}
              onCurrencyChange={handleFromChange}
              hideLabel
            />
            <CurrencyInput
              id="to"
              label="Monto destino"
              amount={toValue}
              currency={to}
              onAmountChange={handleToAmount}
              onCurrencyChange={handleToChange}
              isCurrencyDisabled={code => !isAllowed(from, code)}
              hideLabel
            />
          </div>
        </div>

        <div className="board__right">
          <ExchangeChart
            data={chartData}
            fromLabel={`${fromInfo.name} (${fromInfo.symbol})`}
            toLabel={`${toInfo.name} (${toInfo.symbol})`}
          />
        </div>
      </section>

      <section className="config-panel">
        <label>
          Backend URL
          <input
            type="text"
            value={backendUrl}
            onChange={event => setBackendUrl(event.target.value)}
            placeholder="http://localhost:3001"
          />
        </label>
        <label>
          Fecha desde
          <input
            type="date"
            min={minDate}
            max={maxDate}
            value={dateFrom}
            onChange={event => setDateFrom(event.target.value)}
          />
        </label>
        <label className="config-panel__checkbox">
          <input
            type="checkbox"
            checked={useMock}
            onChange={event => setUseMock(event.target.checked)}
          />
          Usar endpoint mock local
        </label>
      </section>
    </main>
  );
}
