import React, { useState, useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DynamicDoughnutChart = () => {
  const [chartData, setChartData] = useState<ChartData<"doughnut">>({
    labels: [],
    datasets: [],
  });
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        labels: ["红色", "蓝色", "黄色", "绿色"],
        datasets: [
          {
            label: "数据集",
            data: [120, 190, 300, 50],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
      setChartData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const resizeObserver = new ResizeObserver(() => {
      chart.update();
    });

    const chartContainer = chart.canvas.parentElement;
    if (chartContainer) {
      resizeObserver.observe(chartContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div style={{ width: "25vw", height: "25vw" }}>
      <Doughnut
        ref={chartRef}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
        }}
      />
    </div>
  );
};

export default DynamicDoughnutChart;
