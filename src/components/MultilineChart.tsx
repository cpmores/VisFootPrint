import React, { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import type { ChartItem } from "chart.js";

Chart.register(...registerables);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    yAxisID: string;
    tension: number;
  }[];
}

const MultiAxisLineChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // 销毁旧图表实例
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const data: ChartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "Dataset 1",
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            yAxisID: "y",
            tension: 0.1,
          },
          {
            label: "Dataset 2",
            data: [-30, 45, -20, 60, -10, 75, 25],
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            yAxisID: "y1",
            tension: 0.1,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false, // 允许图表随容器高度调整
        interaction: {
          mode: "index" as const,
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: "Multi-Axis Line Chart",
          },
        },
        scales: {
          y: {
            type: "linear" as const,
            display: true,
            position: "left" as const,
          },
          y1: {
            type: "linear" as const,
            display: true,
            position: "right" as const,
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      };

      chartInstance.current = new Chart(chartRef.current as ChartItem, {
        type: "line",
        data: data,
        options: options,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div
      style={{
        width: "95%",
        height: "80%",
        position: "relative",
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

export default MultiAxisLineChart;