import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface Row {
  label?: string;
  value?: number;
  [key: string]: any;
}

const DynamicSteppedLineChart: React.FC = () => {
  const rows: Row[] = JSON.parse(localStorage.getItem("importedRows") || "[]");

  const labels: string[] =
    rows.length > 0
      ? rows.map((row, index) => row.label || `数据 ${index + 1}`)
      : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月"];
  const dataValues: number[] =
    rows.length > 0
      ? rows.map((row) => row.value || 0)
      : [10, 20, 15, 30, 25, 40, 20, 30, 40];

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "阶梯折线图数据",
        data: dataValues,
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        stepped: "before",
        tension: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "阶梯折线图",
        color: "#333",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#333",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#333",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <div className="yearlist">
      <Line data={data} options={options} />
    </div>
  );
};

export default DynamicSteppedLineChart;
