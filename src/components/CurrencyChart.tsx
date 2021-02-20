import React from 'react';
import { Line } from 'react-chartjs-2';

type Rates = {
  [rate: string]: number;
};

function getDataForChart(
  canvas: HTMLCanvasElement,
  rates: Record<string, Rates>,
  {
    baseCurrency,
    targetCurrency,
  }: { baseCurrency: string; targetCurrency: string }
) {
  // sort the dates (date is key of rates map) chronologically,
  const sortedDates = Object.keys(rates).sort((a, b) => a.localeCompare(b));

  // construct the data structure passed to Chart.js
  const data = sortedDates.map((datum) => ({
    x: new Date(datum),
    y: rates[datum][targetCurrency],
  }));

  // generate gradient background color
  const gradient = getGradient(canvas);

  // described in docs: https://www.chartjs.org/docs/latest/
  const lineGraphData = {
    labels: sortedDates,
    datasets: [
      {
        data,
        label: `${baseCurrency} to ${targetCurrency}`,
        borderColor: '#44D382',
        backgroundColor: gradient,
        type: 'line',
        pointRadius: 0,
        fill: 'start',
        tension: 0,
        borderWidth: 2,
      },
    ],
  };
  return lineGraphData;
}

function getGradient(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(68, 211, 130, 0.8)'); // limegreen hex to rgba
  gradient.addColorStop(1, 'rgba(89, 235, 189, 0)');
  return gradient;
}

const options = {
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        ticks: {
          source: 'auto',
        },
        time: {
          minUnit: 'day',
        },
      },
    ],
    yAxes: [
      {
        type: 'linear',
        gridLines: {
          display: false,
        },
        scaleLabel: {
          display: true,
        },
      },
    ],
  },
} as const;

type CurrencyChartProps = {
  rates: Record<string, Rates>;
  baseCurrency: string;
  targetCurrency: string;
};

export function CurrencyChart({
  rates,
  baseCurrency,
  targetCurrency,
}: CurrencyChartProps) {
  return (
    <div className="mt-4">
      <Line
        width={300}
        data={(canvas: HTMLCanvasElement) =>
          getDataForChart(canvas, rates, { baseCurrency, targetCurrency })
        }
        options={options}
      />
    </div>
  );
}
