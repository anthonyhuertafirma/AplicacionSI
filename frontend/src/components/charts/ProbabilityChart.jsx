import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProbabilityChart = ({ probabilityData }) => {
  if (!probabilityData || typeof probabilityData !== 'object') {
    return <p style={{ color: '#ccc', textAlign: 'center' }}>No hay datos de probabilidad disponibles.</p>;
  }

  const data = {
    labels: Object.keys(probabilityData),
    datasets: [
      {
        label: 'Confianza del Modelo',
        data: Object.values(probabilityData),
        backgroundColor: 'rgba(255, 215, 0, 0.6)',
        borderColor: 'rgba(255, 215, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Probabilidad por Gama de Precio',
        color: '#EAEAEA',
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9a9a9a' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        title: {
          display: true,
          text: 'Probabilidad',
          color: '#9a9a9a',
        },
      },
      y: {
        ticks: { color: '#EAEAEA', font: { size: 14 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default ProbabilityChart;
