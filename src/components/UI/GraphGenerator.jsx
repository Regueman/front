import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "./GraphGenerator.css";
import PlayerStatsTable from "./PlayerStatsTable";

function GraphGenerator({ playerName, playerData, opponentTeam, location }) {
  const [selectedStat, setSelectedStat] = useState("");

  const generateChartData = () => {
    if (!selectedStat || !playerData?.player?.stats) return null;
  
    // Ordenar las estadísticas por fecha
    const sortedStats = [...playerData.player.stats].sort((a, b) => new Date(a.date) - new Date(b.date));
  
    const labels = sortedStats.map((game) => game.date);
    const data = sortedStats.map((game) => game[selectedStat] || 0);
  
    const sortedValues = [...data].sort((a, b) => a - b);
    const threshold_90 = sortedValues[Math.floor(sortedValues.length * 0.1)] || 0;
    const threshold_80 = sortedValues[Math.floor(sortedValues.length * 0.2)] || 0;
    const threshold_70 = sortedValues[Math.floor(sortedValues.length * 0.3)] || 0;
  
    const backgroundColors = sortedStats.map((game) =>
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
  

  const generateRankingsDisplay = () => {
    if (!selectedStat || !playerData) return [];

    const rankings = [];
    const { team, opponent, player } = playerData;
    const opponentLocation = location === "home" ? "away" : "home";

    // Team Rankings
    if (team.rankings?.top_average?.[selectedStat]) {
      rankings.push({
        label: `Equipo (${team.name}) - Top Average`,
        position: team.rankings.top_average[selectedStat].position || "N/A",
        value: team.rankings.top_average[selectedStat].value?.toFixed(2) || "N/A",
      });
    }

    if (team.rankings?.[`top_${location}`]?.[selectedStat]) {
      rankings.push({
        label: `Equipo (${team.name}) - Top ${location}`,
        position: team.rankings[`top_${location}`][selectedStat].position || "N/A",
        value: team.rankings[`top_${location}`][selectedStat].value?.toFixed(2) || "N/A",
      });
    }

    // Opponent Rankings
    if (opponent.rankings?.top_average?.[selectedStat]) {
      rankings.push({
        label: `Oponente (${opponent.name}) - Top Average`,
        position: opponent.rankings.top_average[selectedStat].position || "N/A",
        value: opponent.rankings.top_average[selectedStat].value?.toFixed(2) || "N/A",
      });
    }

    if (opponent.rankings?.[`top_${opponentLocation}`]?.[selectedStat]) {
      rankings.push({
        label: `Oponente (${opponent.name}) - Top ${opponentLocation}`,
        position: opponent.rankings[`top_${opponentLocation}`][selectedStat].position || "N/A",
        value: opponent.rankings[`top_${opponentLocation}`][selectedStat].value?.toFixed(2) || "N/A",
      });
    }

    // Team Position Rankings
    if (team.position_rankings?.top_average?.[selectedStat]) {
      rankings.push({
        label: `Equipo (${team.name}) - Top Average (Posición ${player.position})`,
        position: team.position_rankings.top_average[selectedStat].position || "N/A",
        value: team.position_rankings.top_average[selectedStat].value?.toFixed(2) || "N/A",
      });
    }

    if (team.position_rankings?.[`top_${location}`]?.[selectedStat]) {
      rankings.push({
        label: `Equipo (${team.name}) - Top ${location} (Posición ${player.position})`,
        position: team.position_rankings[`top_${location}`][selectedStat].position || "N/A",
        value: team.position_rankings[`top_${location}`][selectedStat].value?.toFixed(2) || "N/A",
      });
    }

    // Opponent Position Rankings
    if (opponent.position_rankings?.top_average?.[selectedStat]) {
      rankings.push({
        label: `Oponente (${opponent.name}) - Top Average (Posición ${player.position})`,
        position: opponent.position_rankings.top_average[selectedStat].position || "N/A",
        value: opponent.position_rankings.top_average[selectedStat].value?.toFixed(2) || "N/A",
      });
    }

    if (opponent.position_rankings?.[`top_${opponentLocation}`]?.[selectedStat]) {
      rankings.push({
        label: `Oponente (${opponent.name}) - Top ${opponentLocation} (Posición ${player.position})`,
        position: opponent.position_rankings[`top_${opponentLocation}`][selectedStat].position || "N/A",
        value: opponent.position_rankings[`top_${opponentLocation}`][selectedStat].value?.toFixed(2) || "N/A",
      });
    }

    return rankings.filter((item) => item.position !== "N/A" && item.value !== "N/A");
  };

  const stats = ["PTS", "REB", "AST", "2A", "2M", "3A", "3M", "STL", "BLK", "TO"];
  const chartData = generateChartData();
  const rankingItems = generateRankingsDisplay();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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
      <div className="rankings-container">
        {/* Team Rankings */}
        <div className="team-rankings">
          <h4>{playerData.team.name}</h4>
          <div className="ranking-grid">
            {/* Average */}
            <div className="ranking-card">
              <strong>Average</strong>
              <p>POS: {playerData.team.rankings?.top_average?.[selectedStat]?.position || "N/A"}</p>
              <p>VALUE: {playerData.team.rankings?.top_average?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
            </div>
            {/* Home/Away */}
            {location === "home" && (
              <div className="ranking-card">
                <strong>Home</strong>
                <p>POS: {playerData.team.rankings?.[`top_home`]?.[selectedStat]?.position || "N/A"}</p>
                <p>VALUE: {playerData.team.rankings?.[`top_home`]?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
              </div>
            )}
            {location === "away" && (
              <div className="ranking-card">
                <strong>Away</strong>
                <p>POS: {playerData.team.rankings?.[`top_away`]?.[selectedStat]?.position || "N/A"}</p>
                <p>VALUE: {playerData.team.rankings?.[`top_away`]?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
              </div>
            )}
            {/* Position Average */}
            <div className="ranking-card">
              <strong>Position Average</strong>
              <p>POS: {playerData.team.position_rankings?.top_average?.[selectedStat]?.position || "N/A"}</p>
              <p>VALUE: {playerData.team.position_rankings?.top_average?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
            </div>
            {/* Position Home/Away */}
            {location === "home" && (
              <div className="ranking-card">
                <strong>Position Home</strong>
                <p>POS: {playerData.team.position_rankings?.[`top_home`]?.[selectedStat]?.position || "N/A"}</p>
                <p>VALUE: {playerData.team.position_rankings?.[`top_home`]?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
              </div>
            )}
            {location === "away" && (
              <div className="ranking-card">
                <strong>Position Away</strong>
                <p>POS: {playerData.team.position_rankings?.[`top_away`]?.[selectedStat]?.position || "N/A"}</p>
                <p>VALUE: {playerData.team.position_rankings?.[`top_away`]?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
              </div>
            )}
          </div>
        </div>
  
        {/* Opponent Rankings */}
        <div className="opponent-rankings">
          <h4>{playerData.opponent.name}</h4>
          <div className="ranking-grid">
            {/* Average */}
            <div className="ranking-card">
              <strong>Average</strong>
              <p>POS: {playerData.opponent.rankings?.top_average?.[selectedStat]?.position || "N/A"}</p>
              <p>VALUE: {playerData.opponent.rankings?.top_average?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
            </div>
            {/* Home/Away */}
            {location === "home" && (
              <div className="ranking-card">
                <strong>Away</strong>
                <p>POS: {playerData.opponent.rankings?.[`top_away`]?.[selectedStat]?.position || "N/A"}</p>
                <p>VALUE: {playerData.opponent.rankings?.[`top_away`]?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
              </div>
            )}
            {location === "away" && (
              <div className="ranking-card">
                <strong>Home</strong>
                <p>POS: {playerData.opponent.rankings?.[`top_home`]?.[selectedStat]?.position || "N/A"}</p>
                <p>VALUE: {playerData.opponent.rankings?.[`top_home`]?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
              </div>
            )}
            {/* Position Average */}
            <div className="ranking-card">
              <strong>Position Average</strong>
              <p>POS: {playerData.opponent.position_rankings?.top_average?.[selectedStat]?.position || "N/A"}</p>
              <p>VALUE: {playerData.opponent.position_rankings?.top_average?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
            </div>
            {/* Position Home/Away */}
            {location === "home" && (
              <div className="ranking-card">
                <strong>Position Away</strong>
                <p>POS: {playerData.opponent.position_rankings?.[`top_away`]?.[selectedStat]?.position || "N/A"}</p>
                <p>VALUE: {playerData.opponent.position_rankings?.[`top_away`]?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
              </div>
            )}
            {location === "away" && (
              <div className="ranking-card">
                <strong>Position Home</strong>
                <p>POS: {playerData.opponent.position_rankings?.[`top_home`]?.[selectedStat]?.position || "N/A"}</p>
                <p>VALUE: {playerData.opponent.position_rankings?.[`top_home`]?.[selectedStat]?.value?.toFixed(2) || "N/A"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
  
      {selectedStat ? (
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
          <PlayerStatsTable playerData={playerData.player.stats} />
        </div>
      ) : (
        <p>Selecciona una estadística para generar la gráfica.</p>
      )}
    </div>
  );
  
  
}

export default GraphGenerator;
