import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CurrencyInput } from './CurrencyInput';

describe('CurrencyInput', () => {
  it('renderiza el input y dispara callbacks', () => {
    const onAmountChange = vi.fn();
    const onCurrencyChange = vi.fn();

    render(
      <CurrencyInput
        id="from"
        label="Envias"
        amount="1"
        currency="USD"
        onAmountChange={onAmountChange}
        onCurrencyChange={onCurrencyChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '10.5' } });
    expect(onAmountChange).toHaveBeenCalledWith('10.5');

    const select = screen.getByLabelText('Moneda');
    fireEvent.change(select, { target: { value: 'EUR' } });
    expect(onCurrencyChange).toHaveBeenCalledWith('EUR');
  });
});
