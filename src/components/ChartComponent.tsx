import { useEffect, useRef } from "react";
import { ComparisonChartData } from "../services/dashboardService";

interface ChartComponentProps {
  data: ComparisonChartData;
  type?: "bar" | "line";
  height?: number;
  title?: string;
}

declare global {
  interface Window {
    Chart: any;
  }
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  type = "bar",
  height = 300,
  title,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current || !window.Chart || !data) return;

    // Destroy previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Create new chart
    chartRef.current = new window.Chart(ctx, {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top" as const,
          },
          title: {
            display: !!title,
            text: title || "",
            font: {
              size: 16,
              weight: "bold" as const,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return value.toLocaleString("id-ID");
              },
            },
          },
          y1: {
            position: "right" as const,
            beginAtZero: true,
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function (value: any) {
                return "Rp " + value.toLocaleString("id-ID");
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, type, title]);

  return (
    <div style={{ height: `${height}px`, position: "relative" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
