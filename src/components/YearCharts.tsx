import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

interface Row {
  DataTime: string;
  value: number;
  [key: string]: any;
}

const DynamicSteppedLineChart: React.FC = () => {
  const rows: Row[] = JSON.parse(localStorage.getItem("importedRows") || "[]");

  const data = useMemo(() => {
    if (rows.length > 0) {
      return rows.map((row) => [
        new Date(parseInt(row.DataTime, 10) * 1000).toISOString(),
        row.value || 0,
      ]);
    }
    return [
      ["2023-01-01", 10],
      ["2023-02-01", 20],
      ["2023-03-01", 15],
      ["2023-04-01", 30],
      ["2023-05-01", 25],
    ];
  }, [rows]);

  // ECharts 配置
  const option = {
    title: {
      text: "阶梯折线图",
      textStyle: { color: "#333" },
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      textStyle: { color: "#fff" },
    },
    xAxis: {
      type: "time", // 时间轴
      axisLabel: {
        color: "#333",
        formatter: (value: number) => {
          return echarts.format.formatTime("MMM yyyy", value); // 格式化日期，如 "Jan 2023"
        },
      },
      axisLine: { lineStyle: { color: "#333" } },
      splitLine: { lineStyle: { color: "rgba(0, 0, 0, 0.1)" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#333" },
      splitLine: { lineStyle: { color: "rgba(0, 0, 0, 0.1)" } },
    },
    series: [
      {
        name: "阶梯折线图数据",
        type: "line",
        step: "start", // 阶梯折线图，类似 Chart.js 的 stepped: "before"
        data: [
          ["2023-01-01", 10],
          ["2023-02-01", 20],
          ["2023-03-01", 15],
          ["2023-04-01", 30],
          ["2023-05-01", 25],
        ],
        lineStyle: { color: "#4bc0c0" },
        itemStyle: { color: "#4bc0c0" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(75, 192, 192, 0.2)" },
            { offset: 1, color: "rgba(75, 192, 192, 0)" },
          ]),
        },
      },
    ],
    dataZoom: [
      {
        type: "slider", // 滑块组件
        xAxisIndex: 0, // 控制 x 轴
        start: 0, // 初始范围：0%
        end: 100, // 初始范围：100%
        height: 20, // 滑块高度
        bottom: 10, // 距离底部的距离
        handleSize: "100%", // 滑块手柄大小
        showDetail: true, // 显示滑块两端的标签
        labelFormatter: (value: number) => {
          return echarts.format.formatTime("yyyy-MM", value); // 格式化滑块标签
        },
      },
      {
        type: "inside", // 支持鼠标滚轮和拖动缩放
        xAxisIndex: 0,
      },
    ],
    grid: {
      left: "10%",
      right: "10%",
      top: "15%",
      bottom: "15%",
      containLabel: true,
    },
  };

  return (
    <div className="yearlist">
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        echarts={echarts}
      />
    </div>
  );
};

export default DynamicSteppedLineChart;
