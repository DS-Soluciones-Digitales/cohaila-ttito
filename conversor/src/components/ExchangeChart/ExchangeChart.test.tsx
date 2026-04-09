import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExchangeChart } from './ExchangeChart';

describe('ExchangeChart', () => {
  it('muestra mensaje vacio cuando no hay datos', () => {
    render(<ExchangeChart data={[]} fromLabel="USD" toLabel="EUR" />);
    expect(screen.getByText(/Sin datos para graficar/i)).toBeInTheDocument();
  });

  it('renderiza titulo de grafica con datos', () => {
    render(
      <ExchangeChart
        data={[
          { date: '2026-04-05T00:00:00.000Z', exchangeRate: 0.92 },
          { date: '2026-04-06T00:00:00.000Z', exchangeRate: 0.93 },
          { date: '2026-04-07T00:00:00.000Z', exchangeRate: 0.94 },
          { date: '2026-04-08T00:00:00.000Z', exchangeRate: 0.95 },
          { date: '2026-04-09T00:00:00.000Z', exchangeRate: 0.96 },
        ]}
        fromLabel="USD"
        toLabel="EUR"
      />
    );

    expect(screen.getByText(/Ultimos 5 dias/i)).toBeInTheDocument();
  });
});
