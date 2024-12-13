import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "./GraphGenerator.css";
import PlayerStatsTable from "./PlayerStatsTable";

function GraphGenerator({ playerName, playerData, opponentTeam }) {
  const [selectedStat, setSelectedStat] = useState("");

  const generateChartData = () => {
    if (!selectedStat) return null;

    const labels = playerData.map((game) => game.date);
    const data = playerData.map((game) => game[selectedStat] || 0);

    // Calcular los límites superados el 90%, 80% y 70% del tiempo
    const sortedValues = [...data].sort((a, b) => a - b);
    const threshold_90 = sortedValues[Math.floor(sortedValues.length * 0.1)] || 0;
    const threshold_80 = sortedValues[Math.floor(sortedValues.length * 0.2)] || 0;
    const threshold_70 = sortedValues[Math.floor(sortedValues.length * 0.3)] || 0;

    // Log para depurar los valores de los thresholds
    console.log(`Thresholds para ${selectedStat}:`, {
      threshold_90,
      threshold_80,
      threshold_70,
      sortedValues,
    });

    const backgroundColors = playerData.map((game) =>
      opponentTeam && game.opponent === opponentTeam
        ? "rgba(255, 99, 132, 0.6)" // Color para partidos contra el equipo contrario
        : "rgba(54, 162, 235, 0.6)" // Color para otros partidos
    );

    return {
      labels,
      datasets: [
        {
          label: `${selectedStat} de ${playerName}`,
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map((color) => color.replace("0.6", "1")),
          borderWidth: 1,
        },
      ],
      thresholds: {
        threshold_90,
        threshold_80,
        threshold_70,
      },
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    animation: {
      onProgress: function (animation) {
        const chartInstance = this.chart;
        const ctx = chartInstance.ctx;
        const yAxis = chartInstance.scales["y-axis-0"];
        const chartData = generateChartData();
        if (!chartData) return;

        const { threshold_90, threshold_80, threshold_70 } = chartData.thresholds;

        // Función para dibujar una línea horizontal con animación
        const drawLine = (value, color) => {
          const yPosition = yAxis.getPixelForValue(value);
          const progress = animation.currentStep / animation.numSteps; // Progreso de la animación
          const xStart = chartInstance.chartArea.left;
          const xEnd = xStart + (chartInstance.chartArea.right - xStart) * progress;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(xStart, yPosition);
          ctx.lineTo(xEnd, yPosition);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        };

        // Dibujar las líneas horizontales
        if (threshold_90) drawLine(threshold_90, "green");
        if (threshold_80) drawLine(threshold_80, "yellow");
        if (threshold_70) drawLine(threshold_70, "orange");
      },
    },
  };

  const stats = ["PTS", "REB", "AST", "2A", "2M", "3A", "3M", "STL", "BLK", "TO", "PTS+REB+AST"];

  // Leyenda para los thresholds
  const chartData = generateChartData();
  const legendItems = chartData
    ? [
        { label: "90% Límite", value: chartData.thresholds.threshold_90},
        { label: "80% Límite", value: chartData.thresholds.threshold_80},
        { label: "70% Límite", value: chartData.thresholds.threshold_70},
      ].filter((item) => item.value > 0)
    : [];

  return (
    <div className="graph-generator">
      <h3>Generador de Gráficas para {playerName}</h3>
      <div className="stats-buttons">
        {stats.map((stat) => (
          <button
            key={stat}
            className={`stat-button ${selectedStat === stat ? "active" : ""}`}
            onClick={() => setSelectedStat(stat)}
          >
            {stat}
          </button>
        ))}
      </div>
      {/* Leyenda para los thresholds */}
      <div className="threshold-legend">
        {legendItems.map((item, index) => (
          <div
            key={index}
            className="threshold-item"
            style={{
              border: `2px solid ${item.color}`,
              borderRadius: "5px",
              padding: "5px 10px",
              marginRight: "10px",
              display: "inline-block",
              color: item.color,
            }}
          >
            {item.label}: {item.value}
          </div>
        ))}
      </div>
      {selectedStat ? (
        <div>
          <div className="chart-container">
              <Bar data={generateChartData()} options={chartOptions} />
              <PlayerStatsTable playerData={playerData} />
          </div>
        </div>
      ) : (
        <p>Selecciona una estadística para generar la gráfica.</p>
      )}
    </div>
  );
}

export default GraphGenerator;
