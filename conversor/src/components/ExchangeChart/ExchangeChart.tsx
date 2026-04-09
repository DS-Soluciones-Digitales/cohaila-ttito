import type { ExchangeRateEntry } from '../../types/exchange.types';

interface ExchangeChartProps {
  data: ExchangeRateEntry[];
  fromLabel: string;
  toLabel: string;
}

const formatDay = (iso: string) => {
  const date = new Date(iso);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
};

export function ExchangeChart({ data, fromLabel, toLabel }: ExchangeChartProps) {
  if (!data.length) {
    return (
      <div className="chart empty">
        <p>Sin datos para graficar.</p>
      </div>
    );
  }

  const values = data.map(item => item.exchangeRate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const paddedMin = min - 0.003;
  const paddedMax = max + 0.003;
  const range = paddedMax - paddedMin || 1;

  const points = data.map((item, index) => {
    const x = 50 + (index / Math.max(data.length - 1, 1)) * 320;
    const y = 210 - ((item.exchangeRate - paddedMin) / range) * 160;
    return { x, y, item };
  });

  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const axisTicks = [0, 1, 2, 3, 4].map(index => {
    const value = paddedMax - (range * index) / 4;
    const y = 50 + index * 40;
    return { value, y };
  });

  return (
    <div className="chart">
      <svg
        viewBox="0 0 420 250"
        role="img"
        aria-label={`Ultimos 5 dias ${fromLabel} a ${toLabel}`}
      >
        <g className="chart__grid">
          {axisTicks.map(tick => (
            <g key={tick.y}>
              <line x1="50" y1={tick.y} x2="380" y2={tick.y} />
              <text x="44" y={tick.y + 4} textAnchor="end">
                {tick.value.toFixed(2).replace('.', ',')}
              </text>
            </g>
          ))}
        </g>

        <text className="chart__ylabel" x="18" y="130" transform="rotate(-90 18 130)">
          Tipo de cambio
        </text>

        <path className="chart__line" d={path} />
        {points.map(point => (
          <circle
            key={point.item.date}
            className="chart__dot"
            cx={point.x}
            cy={point.y}
            r="4.5"
          />
        ))}

        {points.map(point => (
          <text
            key={`x-${point.item.date}`}
            className="chart__xlabel"
            x={point.x}
            y="230"
            textAnchor="middle"
          >
            {formatDay(point.item.date)}
          </text>
        ))}
      </svg>

      <p className="chart__footer">Ultimos 5 dias</p>
    </div>
  );
}
