import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConversorPage } from './ConversorPage';

vi.mock('../../services/exchangeRate.service', () => ({
  getExchangeRate: vi.fn(async () => ({
    from: 'USD',
    to: 'EUR',
    server: 'servidor de prueba',
    exchangeRates: [
      { date: '2026-04-05T00:00:00.000Z', exchangeRate: 0.92 },
      { date: '2026-04-06T00:00:00.000Z', exchangeRate: 0.93 },
      { date: '2026-04-07T00:00:00.000Z', exchangeRate: 0.94 },
      { date: '2026-04-08T00:00:00.000Z', exchangeRate: 0.95 },
      { date: '2026-04-09T00:00:00.000Z', exchangeRate: 0.96 },
    ],
  })),
}));

describe('ConversorPage', () => {
  it('muestra el texto de equivalencia y el servidor', async () => {
    render(<ConversorPage />);

    await waitFor(() => {
      expect(screen.getByText(/equivale a/i)).toBeInTheDocument();
      expect(screen.getByText(/servidor de prueba/i)).toBeInTheDocument();
    });
  });
});
