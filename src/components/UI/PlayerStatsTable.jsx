import React from "react";
import "./PlayerStatsTable.css";

function PlayerStatsTable({ playerData, opponentTeam }) {
  if (!playerData || playerData.length === 0) return <p>No hay datos disponibles.</p>;

  const statsKeys = ["PTS", "REB", "AST", "2A", "2M", "3A", "3M", "STL", "BLK", "TO"];

  // Calcular promedios generales
  const averages = statsKeys.reduce((acc, key) => {
    const total = playerData.reduce((sum, game) => sum + (game[key] || 0), 0);
    acc[key] = (total / playerData.length).toFixed(2);
    return acc;
  }, {});

  // Calcular límites 70%, 80%, 90%
  const thresholds = statsKeys.reduce((acc, key) => {
    const sortedValues = [...playerData.map((game) => game[key] || 0)].sort((a, b) => a - b);
    acc[key] = {
      threshold_70: sortedValues[Math.floor(sortedValues.length * 0.3)] || 0,
      threshold_80: sortedValues[Math.floor(sortedValues.length * 0.2)] || 0,
      threshold_90: sortedValues[Math.floor(sortedValues.length * 0.1)] || 0,
    };
    return acc;
  }, {});

  // Calcular medias Local y Visitante
  const localGames = playerData.filter((game) => game.home_or_away === "home");
  const visitorGames = playerData.filter((game) => game.home_or_away === "away");

  const localAverages = statsKeys.reduce((acc, key) => {
    const total = localGames.reduce((sum, game) => sum + (game[key] || 0), 0);
    acc[key] = localGames.length ? (total / localGames.length).toFixed(2) : "-";
    return acc;
  }, {});

  const visitorAverages = statsKeys.reduce((acc, key) => {
    const total = visitorGames.reduce((sum, game) => sum + (game[key] || 0), 0);
    acc[key] = visitorGames.length ? (total / visitorGames.length).toFixed(2) : "-";
    return acc;
  }, {});

  // Calcular media Contra el Equipo Rival
  const rivalGames = playerData.filter((game) => game.opponent === opponentTeam);

  const rivalAverages = statsKeys.reduce((acc, key) => {
    const total = rivalGames.reduce((sum, game) => sum + (game[key] || 0), 0);
    acc[key] = rivalGames.length ? (total / rivalGames.length).toFixed(2) : "-";
    return acc;
  }, {});

  return (
    <div className="player-stats-table">
      <h4>Estadísticas del Jugador</h4>
      <table>
        <thead>
          <tr>
            <th>Estadística</th>
            {statsKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Promedio</td>
            {statsKeys.map((key) => (
              <td key={`avg-${key}`}>{averages[key]}</td>
            ))}
          </tr>
          <tr>
            <td>Límite 70%</td>
            {statsKeys.map((key) => (
              <td key={`t70-${key}`}>{thresholds[key].threshold_70}</td>
            ))}
          </tr>
          <tr>
            <td>Límite 80%</td>
            {statsKeys.map((key) => (
              <td key={`t80-${key}`}>{thresholds[key].threshold_80}</td>
            ))}
          </tr>
          <tr>
            <td>Límite 90%</td>
            {statsKeys.map((key) => (
              <td key={`t90-${key}`}>{thresholds[key].threshold_90}</td>
            ))}
          </tr>
          <tr>
            <td>Media Local</td>
            {statsKeys.map((key) => (
              <td key={`local-${key}`}>{localAverages[key]}</td>
            ))}
          </tr>
          <tr>
            <td>Media Visitante</td>
            {statsKeys.map((key) => (
              <td key={`visitor-${key}`}>{visitorAverages[key]}</td>
            ))}
          </tr>
          <tr>
            <td>Media Contra Rival</td>
            {statsKeys.map((key) => (
              <td key={`rival-${key}`}>{rivalAverages[key]}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PlayerStatsTable;
