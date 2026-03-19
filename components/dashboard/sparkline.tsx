"use client";

import { useRef, useState, useEffect } from "react";
import { Line, LineChart } from "recharts";

type SparklineProps = {
  values: number[];
  positive?: boolean;
};

export function Sparkline({ values, positive = true }: SparklineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  const data = values.map((value, index) => ({ index, value }));
  const stroke = positive ? "#22c55e" : "#ef4444";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setWidth(Math.floor(w));
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-12 w-full overflow-hidden">
      <LineChart width={width} height={48} data={data}>
        <defs>
          <pattern id="dotGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="rgba(148,163,184,0.22)" />
          </pattern>
        </defs>
        <rect x={0} y={0} width={width} height={48} fill="url(#dotGrid)" />
        <Line
          type="monotone"
          dataKey="value"
          stroke={stroke}
          strokeWidth={2}
          dot={(props: { cx?: number; cy?: number; index?: number }) => {
            const { cx, cy, index } = props;
            if (index === undefined) return null;
            if (index % 5 !== 0 && index !== data.length - 1) return null;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={1.8}
                fill={stroke}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth={0.8}
              />
            );
          }}
          activeDot={{ r: 2.8, strokeWidth: 1.2 }}
          isAnimationActive
        />
      </LineChart>
    </div>
  );
}
