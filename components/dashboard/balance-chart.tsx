"use client";

import ReactECharts from "echarts-for-react";

type BalanceChartProps = {
  values: number[];
};

export function BalanceChart({ values }: BalanceChartProps) {
  const normalized = values.length > 1 ? values : [1, 1.02, 1.08, 1.04, 1.12, 1.18];
  const markerIndexes = normalized
    .map((_, idx) => idx)
    .filter((idx) => idx % 5 === 0 || idx === normalized.length - 1);
  const option = {
    animationDuration: 1100,
    animationEasing: "cubicOut",
    grid: { top: 6, right: 8, left: 8, bottom: 8 },
    tooltip: {
      trigger: "axis",
      confine: true,
      formatter: (params: Array<{ data: number }>) => {
        const point = params[0];
        return `$${Number(point?.data ?? 0).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}`;
      },
      backgroundColor: "rgba(17, 24, 39, 0.9)",
      borderColor: "rgba(168, 85, 247, 0.45)",
      textStyle: { color: "#fff" },
    },
    xAxis: {
      type: "category",
      show: false,
      boundaryGap: false,
      data: normalized.map((_, idx) => idx),
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(124,58,237,0.14)",
          type: "dotted",
        },
      },
    },
    yAxis: {
      type: "value",
      show: false,
      scale: true,
      splitNumber: 4,
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(124,58,237,0.12)",
          type: "dotted",
        },
      },
    },
    series: [
      {
        type: "line",
        data: normalized,
        smooth: 0.42,
        symbol: "none",
        lineStyle: {
          width: 3,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#7C3AED" },
              { offset: 1, color: "#22D3EE" },
            ],
          },
        },
        areaStyle: {
          opacity: 0.35,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(124,58,237,0.45)" },
              { offset: 1, color: "rgba(34,211,238,0.02)" },
            ],
          },
        },
        markPoint: {
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            color: "#22D3EE",
            borderColor: "#ffffff",
            borderWidth: 1.2,
          },
          data: [{ coord: [normalized.length - 1, normalized[normalized.length - 1]] }],
        },
      },
      {
        type: "scatter",
        data: markerIndexes.map((idx) => [idx, normalized[idx]]),
        symbolSize: 4,
        itemStyle: {
          color: "rgba(124,58,237,0.55)",
        },
        emphasis: {
          scale: 1.2,
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      notMerge
      lazyUpdate
      style={{ height: 200, width: "100%" }}
    />
  );
}
