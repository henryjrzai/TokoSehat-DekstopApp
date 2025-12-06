import { useEffect, useRef } from "react";
import { ComparisonChartData } from "../services/dashboardService";

interface ApexChartComponentProps {
  data: ComparisonChartData;
  type?: "bar" | "line" | "area";
  height?: number;
  title?: string;
}

declare global {
  interface Window {
    ApexCharts: any;
  }
}

export const ApexChartComponent: React.FC<ApexChartComponentProps> = ({
  data,
  type = "bar",
  height = 300,
  title,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || !window.ApexCharts || !data) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const series = data.datasets.map((dataset) => ({
      name: dataset.label,
      data: dataset.data,
    }));

    // Dynamically create y-axis options based on dataset labels
    const yAxes = data.datasets.map((dataset, index) => {
      const isPendapatan = dataset.label.toLowerCase().includes("pendapatan");

      return {
        seriesName: dataset.label,
        opposite: index > 0, // Only the first axis is on the left
        title: {
          text: dataset.label,
        },
        labels: {
          formatter: function (value: number) {
            if (isPendapatan) {
              return "Rp " + Math.round(value).toLocaleString("id-ID");
            }
            return Math.round(value);
          },
        },
      };
    });

    // Dynamically create tooltip formatters
    const tooltipY = data.datasets.map((dataset) => {
      const isPendapatan = dataset.label.toLowerCase().includes("pendapatan");
      const isTransaksi = dataset.label.toLowerCase().includes("transaksi");

      return {
        formatter: function (val: number) {
          if (isPendapatan) {
            return "Rp " + val.toLocaleString("id-ID");
          }
          if (isTransaksi) {
            return val + " transaksi";
          }
          return val;
        },
      };
    });

    const options = {
      series: series,
      chart: {
        type: type,
        height: height,
        toolbar: {
          show: true,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: type === "line" ? 3 : 2,
        colors: type === "line" ? undefined : ["transparent"],
        curve: "smooth",
      },
      xaxis: {
        categories: data.labels,
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: yAxes,
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
      fill: {
        opacity: type === "area" ? 0.3 : 1,
      },
      tooltip: {
        y: tooltipY.length === 1 ? tooltipY[0] : tooltipY,
      },
      title: {
        text: title,
        align: "left",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
      colors: ["#435ebe", "#55c6a9"],
    };

    chartInstanceRef.current = new window.ApexCharts(chartRef.current, options);
    chartInstanceRef.current.render();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, type, height, title]);

  return <div ref={chartRef}></div>;
};
