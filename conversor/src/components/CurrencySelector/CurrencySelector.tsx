import type { CurrencyCode } from '../../types/exchange.types';
import { CURRENCIES } from '../../constants/currencies';

interface CurrencySelectorProps {
  id: string;
  label: string;
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  isDisabled?: (code: CurrencyCode) => boolean;
  hideLabel?: boolean;
}

export function CurrencySelector({
  id,
  label,
  value,
  onChange,
  isDisabled,
  hideLabel,
}: CurrencySelectorProps) {
  return (
    <label className="currency-selector" htmlFor={id}>
      <span className={hideLabel ? 'sr-only' : undefined}>{label}</span>
      <select
        id={id}
        value={value}
        onChange={event => onChange(event.target.value as CurrencyCode)}
      >
        {CURRENCIES.map(currency => (
          <option
            key={currency.code}
            value={currency.code}
            disabled={isDisabled?.(currency.code)}
          >
            {currency.flag} {currency.symbol} {currency.name}
          </option>
        ))}
      </select>
    </label>
  );
}
