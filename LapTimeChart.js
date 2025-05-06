import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const LapTimesChart = () => {
  const [lapData, setLapData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/laptimes")
      .then((response) => {
        setLapData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Extracting Laps & Lap Times
  const laps = lapData.map((_, index) => index + 1);
  const times = lapData.map((lap) => lap.LapTime);

  const data = {
    labels: laps,
    datasets: [
      {
        label: "Lap Times (seconds)",
        data: times,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "F1 Lap Times Chart" },
    },
    scales: {
      x: { title: { display: true, text: "Lap Number" } },
      y: { title: { display: true, text: "Lap Time (seconds)" } },
    },
  };

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <h2>Lap Times Visualization</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LapTimesChart;
