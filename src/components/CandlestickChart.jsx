import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import "chartjs-adapter-date-fns"; // Import the date adapter for time axis support

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  CandlestickController,
  CandlestickElement
);

const CandlestickChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy(); // Clean up existing chart before creating a new one
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new ChartJS(ctx, {
      type: "candlestick",
      data: {
        datasets: [
          {
            label: "Candlestick Data",
            data: data.map((candle) => ({
              x: new Date(candle.time), // Ensure time is parsed correctly for the x-axis
              o: parseFloat(candle.open), // Open price
              h: parseFloat(candle.high), // High price
              l: parseFloat(candle.low), // Low price
              c: parseFloat(candle.close), // Close price
            })),
            borderColor: "rgba(0, 0, 0, 1)", // Color for candle borders
            color: {
              up: "rgba(0, 255, 0, 1)", // Green for upward candles
              down: "rgba(255, 0, 0, 1)", // Red for downward candles
            },
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Candlestick Chart",
          },
        },
        scales: {
          x: {
            type: "time", // Ensure x-axis uses the time scale
            time: {
              unit: "minute", // Set the granularity of time (can be minute, hour, day, etc.)
              tooltipFormat: "MMM dd, yyyy HH:mm", // Format for tooltips using date-fns format
            },
            title: {
              display: true,
              text: "Time",
            },
            ticks: {
              source: "auto", // Automatically choose the tick marks
              autoSkip: true,
              maxTicksLimit: 10, // Limits the number of x-axis ticks for better readability
            },
          },
          y: {
            title: {
              display: true,
              text: "Price",
            },
          },
        },
      },
    });
  }, [data]);

  return (
    <div>
      <canvas ref={chartRef} id="candlestickChart" />
    </div>
  );
};

export default CandlestickChart;
