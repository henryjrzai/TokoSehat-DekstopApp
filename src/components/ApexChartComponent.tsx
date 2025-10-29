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

    // Destroy previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Convert Chart.js data format to ApexCharts format
    const series = data.datasets.map((dataset) => ({
      name: dataset.label,
      data: dataset.data,
    }));

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
      yaxis: [
        {
          title: {
            text: data.datasets[0]?.label || "",
          },
          labels: {
            formatter: function (value: number) {
              return Math.round(value).toString();
            },
          },
        },
        {
          opposite: true,
          title: {
            text: data.datasets[1]?.label || "",
          },
          labels: {
            formatter: function (value: number) {
              return "Rp " + value.toLocaleString("id-ID");
            },
          },
        },
      ],
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
      fill: {
        opacity: type === "area" ? 0.3 : 1,
      },
      tooltip: {
        y: [
          {
            formatter: function (val: number) {
              return val + " transaksi";
            },
          },
          {
            formatter: function (val: number) {
              return "Rp " + val.toLocaleString("id-ID");
            },
          },
        ],
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

    // Create new chart instance
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
