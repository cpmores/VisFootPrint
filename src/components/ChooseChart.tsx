import { useState, useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { Place, YearCount } from "../Analysis/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DynamicDoughnutChartProps {
  addresses?: Place[];
  years?: YearCount[];
  choose?: boolean;
  choose2?: boolean;
}

// Generate dynamic colors
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

const DynamicDoughnutChart: React.FC<DynamicDoughnutChartProps> = ({
  addresses,
  years,
  choose,
  choose2,
}) => {
  const [chartData, setChartData] = useState<ChartData<"doughnut">>({
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

      // Prepare chart data
      const labels = Array.from(cityCounts.keys());
      const data = Array.from(cityCounts.values());
      const { colors, borderColors } = generateColors(labels.length);

      const dataConfig: ChartData<"doughnut"> = {
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

      const yearCounts = new Map<number, number>();
      for (const year of years) {
        const year_name = year.year;
        yearCounts.set(
          year_name,
          (yearCounts.get(year_name) || 0) + year.count
        );
      }

      // Prepare chart data
      const labels = Array.from(yearCounts.keys());
      const data = Array.from(yearCounts.values());
      const { colors, borderColors } = generateColors(labels.length);

      const dataConfig: ChartData<"doughnut"> = {
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

  return (
    <div style={{ width: "25vw", height: "25vw" }}>
      <Doughnut
        ref={chartRef}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              enabled: true,
            },
          },
        }}
      />
    </div>
  );
};

export default DynamicDoughnutChart;
