import type { CurrencyCode } from '../../types/exchange.types';
import { CurrencySelector } from '../CurrencySelector/CurrencySelector';

interface CurrencyInputProps {
  id: string;
  label: string;
  amount: string;
  currency: CurrencyCode;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: CurrencyCode) => void;
  isCurrencyDisabled?: (code: CurrencyCode) => boolean;
  hideLabel?: boolean;
}

export function CurrencyInput({
  id,
  label,
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  isCurrencyDisabled,
  hideLabel,
}: CurrencyInputProps) {
  return (
    <div className="currency-input" aria-label={label}>
      <div className="currency-input__field">
        <label className={hideLabel ? 'sr-only' : undefined} htmlFor={`${id}-amount`}>
          {label}
        </label>
        <input
          id={`${id}-amount`}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={event => onAmountChange(event.target.value)}
        />
      </div>
      <CurrencySelector
        id={`${id}-currency`}
        label="Moneda"
        value={currency}
        onChange={onCurrencyChange}
        isDisabled={isCurrencyDisabled}
        hideLabel={hideLabel}
      />
    </div>
  );
}
