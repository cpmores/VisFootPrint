import React, { useRef, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import type { ChartItem } from "chart.js";
import {
  filter_for_city,
  Month_value2name,
  type Basedata,
  type Position,
} from "../Analysis/types";

Chart.register(...registerables);

interface Dataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  yAxisID: string;
  tension: number;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface MultiProps {
  choose?: boolean;
  year_name?: string;
  bases: Basedata[];
  year_options: OptionType[];
}

interface OptionType {
  value: string;
  label: string;
}

const generateColors = (count: number, offset: number) => {
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
    colors.push(baseColors[(i + offset) % baseColors.length]);
    borderColors.push(baseBorderColors[(i + offset) % baseBorderColors.length]);
  }
  return { colors, borderColors };
};

const MultiAxisLineChart: React.FC<MultiProps> = ({
  choose,
  year_name,
  bases,
  year_options,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const countBases: Position[] = JSON.parse(
      localStorage.getItem("CountBases") || "[]"
    );

    if (choose) {
      // Show all cities by year
      const year_labels: string[] = [];

      // Get all year options (skip the first empty option)
      for (let i = 1; i < year_options.length; ++i) {
        year_labels.push(year_options[i].value);
      }

      const datasets = [];

      let offset = 0;
      // Process each city
      for (let countbase of countBases) {
        // Initialize array for yearly counts
        const cityYearCounts = new Array(year_labels.length).fill(0);

        // Get all positions for this city
        const filter_pos = filter_for_city(bases, countbase);

        // Count positions by year
        for (let filter_city of filter_pos) {
          const year = Math.floor(filter_city.lastTime / 10000).toString();
          const yearIndex = year_labels.indexOf(year);
          if (yearIndex !== -1) {
            cityYearCounts[yearIndex]++;
          }
        }

        // Generate color for this city's line
        const { colors, borderColors } = generateColors(1, offset);
        offset++;

        datasets.push({
          label: countbase.city,
          data: cityYearCounts,
          borderColor: borderColors[0],
          backgroundColor: colors[0],
          yAxisID: "y",
          tension: 0.1,
        });
      }

      setChartData({
        labels: year_labels,
        datasets: datasets,
      });
    } else if (!choose) {
      // Show all cities by year
      const year_labels: string[] = [];

      // Get all year options (skip the first empty option)
      for (let i = 1; i < Month_value2name.length ; ++i) {
        year_labels.push(Month_value2name[i]);
      }

      const datasets = [];

      let offset = 0;
      // Process each city
      for (let countbase of countBases) {
        // Initialize array for yearly counts
        const cityYearCounts = new Array(year_labels.length).fill(0);

        // Get all positions for this city
        const filter_pos = filter_for_city(bases, countbase);

        // Count positions by year
        for (let filter_city of filter_pos) {
          const year = Math.floor(filter_city.lastTime / 10000).toString();
          const month = Month_value2name[(Math.floor(filter_city.lastTime / 100) % 100)];
          if (year == year_name) {
            const month_index = year_labels.indexOf(month);
            if(month_index != -1) {
                cityYearCounts[month_index]++;
            }
          }
          
        }

        // Generate color for this city's line
        const { colors, borderColors } = generateColors(1, offset);
        offset++;

        datasets.push({
          label: countbase.city,
          data: cityYearCounts,
          borderColor: borderColors[0],
          backgroundColor: colors[0],
          yAxisID: "y",
          tension: 0.1,
        });
      }

      setChartData({
        labels: year_labels,
        datasets: datasets,
      });
    } else {
      // Default chart data when choose is false
      setChartData({
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
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
            yAxisID: "y",
            tension: 0.1,
          },
        ],
      });
    }
  }, [choose, bases, year_options]);

  useEffect(() => {
    if (chartRef.current && chartData.labels.length > 0) {
      // Destroy old chart instance
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index" as const,
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: choose ? "City Data by Year" : "City Data by Month In " + year_name,
          },
        },
        scales: {
          y: {
            type: "linear" as const,
            display: true,
            position: "left" as const,
          },
        },
      };

      chartInstance.current = new Chart(chartRef.current as ChartItem, {
        type: "line",
        data: chartData,
        options: options,
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, choose]);

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
