import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { binomialPMF } from '../utils/mathCore';

ChartJS.register(...registerables, annotationPlugin);

export default function ComparisonChart({ nA, pA, kA, nB, pB, kB }) {
  const maxN = Math.max(nA, nB);

  // Genera etiquetas del espacio muestral {0, 1, ..., maxN}
  const labels = useMemo(() => {
    return Array.from({ length: maxN + 1 }, (_, i) => `${i}`);
  }, [maxN]);

  // Calcula la distribución PMF para el Escenario A
  const dataA = useMemo(() => {
    return Array.from({ length: maxN + 1 }, (_, i) => {
      if (i > nA) return 0;
      return binomialPMF(nA, pA, i);
    });
  }, [nA, pA, maxN]);

  // Calcula la distribución PMF para el Escenario B
  const dataB = useMemo(() => {
    return Array.from({ length: maxN + 1 }, (_, i) => {
      if (i > nB) return 0;
      return binomialPMF(nB, pB, i);
    });
  }, [nB, pB, maxN]);

  // Genera degradados neón verticales vía Canvas Context
  const getGradientCyan = (context) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) return 'rgba(6, 182, 212, 0.4)';
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.02)');
    gradient.addColorStop(1, 'rgba(34, 211, 238, 0.85)');
    return gradient;
  };

  const getGradientPurple = (context) => {
    const chart = context.chart;
    const { ctx, chartArea } = chart;
    if (!chartArea) return 'rgba(139, 92, 246, 0.4)';
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.02)');
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0.85)');
    return gradient;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Escenario A (Cian)',
        data: dataA,
        backgroundColor: getGradientCyan,
        borderColor: '#06b6d4',
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(34, 211, 238, 0.95)',
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
      {
        label: 'Escenario B (Púrpura)',
        data: dataB,
        backgroundColor: getGradientPurple,
        borderColor: '#8b5cf6',
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(167, 139, 250, 0.95)',
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'easeInOutQuart',
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.25)', // slate-800 sutil
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8', // slate-400
          font: {
            family: 'Outfit',
            size: 11,
          },
        },
        title: {
          display: true,
          text: 'Número de Fallos Defectuosos (Variable Aleatoria Discreta X)',
          color: '#64748b', // slate-500
          font: {
            family: 'Outfit',
            size: 12,
            weight: 500,
          },
          padding: 8,
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.25)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Outfit',
            size: 11,
          },
          callback: (value) => `${(value * 100).toFixed(0)}%`,
        },
        title: {
          display: true,
          text: 'Probabilidad P(X = x)',
          color: '#64748b',
          font: {
            family: 'Outfit',
            size: 12,
            weight: 500,
          },
          padding: 8,
        },
        min: 0,
        max: 1.0, // La probabilidad siempre se limita a 1
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0', // slate-200
          font: {
            family: 'Outfit',
            size: 12,
          },
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(51, 65, 85, 0.5)',
        borderWidth: 1,
        titleColor: '#f8fafc', // slate-50
        titleFont: {
          family: 'JetBrains Mono',
          size: 13,
        },
        bodyColor: '#e2e8f0',
        bodyFont: {
          family: 'Outfit',
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const val = context.raw;
            return ` ${context.dataset.label}: ${(val * 100).toFixed(4)}%`;
          },
        },
      },
      annotation: {
        annotations: {
          lineA: {
            type: 'line',
            // El eje X es categórico, por lo que kA mapea a la posición kA (es numérico indexado a 0)
            xMin: kA,
            xMax: kA,
            borderColor: 'rgba(34, 211, 238, 0.85)', // cian neón
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              display: true,
              content: `Tolerancia A (k=${kA})`,
              position: 'start',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              color: '#22d3ee',
              font: {
                family: 'Outfit',
                size: 11,
                weight: 'bold',
              },
              padding: 4,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: 'rgba(34, 211, 238, 0.3)',
            },
          },
          lineB: {
            type: 'line',
            xMin: kB,
            xMax: kB,
            borderColor: 'rgba(167, 139, 250, 0.85)', // púrpura neón
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              display: true,
              content: `Tolerancia B (k=${kB})`,
              position: 'end',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              color: '#a78bfa',
              font: {
                family: 'Outfit',
                size: 11,
                weight: 'bold',
              },
              padding: 4,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: 'rgba(167, 139, 250, 0.3)',
            },
          },
        },
      },
    },
  };

  return (
    <div className="relative w-full h-[400px] min-h-[300px]">
      <Bar data={chartData} options={chartOptions} />
      {/* Indicativos visuales flotantes de Zona Permitida / Zona Rechazo */}
      <div className="absolute top-12 left-4 px-2.5 py-1 text-[10px] tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold backdrop-blur-sm pointer-events-none">
        Zona Permitida (X ≤ k)
      </div>
      <div className="absolute top-12 right-4 px-2.5 py-1 text-[10px] tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/20 rounded font-semibold backdrop-blur-sm pointer-events-none">
        Zona de Rechazo (X &gt; k)
      </div>
    </div>
  );
}
