import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData } from "chart.js";
import type { MonthCount, Place, YearCount } from "../Analysis/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  addresses?: Place[];
  years?: YearCount[];
  choose?: boolean;
  choose2?: boolean;
  months: MonthCount[];
}

const generateColors = (count: number) => {
  const baseColors = [
    "rgba(255, 99, 132, 0.6)", // Red
    "rgba(54, 162, 235, 0.6)", // Blue
    "rgba(255, 206, 86, 0.6)", // Yellow
    "rgba(75, 192, 192, 0.6)", // Green
    "rgba(153, 102, 255, 0.6)", // Purple
    "rgba(255, 159, 64, 0.6)", // Orange
  ];
  const baseBorderColors = baseColors.map((color) => color.replace("0.6", "1"));

  const colors = [];
  const borderColors = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
    borderColors.push(baseBorderColors[i % baseBorderColors.length]);
  }
  return { colors, borderColors };
};

const BarChart: React.FC<BarChartProps> = ({
  addresses,
  years,
  choose,
  choose2,
  months,
}) => {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (choose) {
      if (!addresses || addresses.length === 0) {
        setChartData({
          labels: [],
          datasets: [],
        });
        return;
      }

      const cityCounts = new Map<string, number>();
      if (choose2 == true) {
        for (const address of addresses) {
          const city = address.city;
          cityCounts.set(city, (cityCounts.get(city) || 0) + address.cityCount);
        }
      } else {
        for (const address of addresses) {
          const city = address.suburb;
          cityCounts.set(city, (cityCounts.get(city) || 0) + address.cityCount);
        }
      }

      const labels_before = Array.from(cityCounts.keys());
      const data_before = Array.from(cityCounts.values());

      const combined = labels_before.map((label, index) => ({
        label,
        data: data_before[index],
        originalIndex: index,
      }));

      combined.sort((a, b) => b.data - a.data);

      const labels = combined.map((item) => item.label);
      const data = combined.map((item) => item.data);

      const { colors, borderColors } = generateColors(labels.length);

      const dataConfig: ChartData<"bar"> = {
        labels,
        datasets: [
          {
            label: "地址分布",
            data,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      };

      setChartData(dataConfig);
    } else {
      if (!years || years.length === 0) {
        setChartData({
          labels: [],
          datasets: [],
        });
        return;
      }

      const yearCounts = new Map<string, number>();
      if (choose2 == true) {
        for (const year of years) {
          const year_name = year.year;
          yearCounts.set(
            year_name.toString(),
            (yearCounts.get(year_name.toString()) || 0) + year.count
          );
        }
      } else {
        for (const month of months) {
          const month_name = month.month_name;
          yearCounts.set(
            month_name,
            (yearCounts.get(month_name) || 0) + month.count
          );
        }
      }

      // Prepare chart data
      const labels_before = Array.from(yearCounts.keys());
      const data_before = Array.from(yearCounts.values());

      const combined = labels_before.map((label, index) => ({
        label,
        data: data_before[index],
        originalIndex: index,
      }));

      combined.sort((a, b) => b.data - a.data);

      const labels = combined.map((item) => item.label);
      const data = combined.map((item) => item.data);


      const { colors, borderColors } = generateColors(labels.length);

      const dataConfig: ChartData<"bar"> = {
        labels,
        datasets: [
          {
            label: "年份分布",
            data,
            backgroundColor: colors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      };

      setChartData(dataConfig);
    }
  }, [addresses, years]);

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

  //   const data = {
  //     labels: ["January", "February", "March", "April", "May", "June", "July"],
  //     datasets: [
  //       {
  //         label: "City Got",
  //         data: [65, 59, 80, 81, 56, 55, 40],
  //         backgroundColor: [
  //           "rgba(255, 99, 132, 0.2)",
  //           "rgba(255, 159, 64, 0.2)",
  //           "rgba(255, 205, 86, 0.2)",
  //           "rgba(75, 192, 192, 0.2)",
  //           "rgba(54, 162, 235, 0.2)",
  //           "rgba(153, 102, 255, 0.2)",
  //           "rgba(201, 203, 207, 0.2)",
  //         ],
  //         borderColor: [
  //           "rgb(255, 99, 132)",
  //           "rgb(255, 159, 64)",
  //           "rgb(255, 205, 86)",
  //           "rgb(75, 192, 192)",
  //           "rgb(54, 162, 235)",
  //           "rgb(153, 102, 255)",
  //           "rgb(201, 203, 207)",
  //         ],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
