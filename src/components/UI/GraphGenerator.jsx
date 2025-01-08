import React, { useState } from "react";
import RankingsBlock from "./RankingsBlock";
import { Bar } from "react-chartjs-2";
import "./GraphGenerator.css"; // Archivo CSS con los cambios

function GraphGenerator({ matchData }) {
  const [selectedStat, setSelectedStat] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("");

  if (!matchData) {
    return <p>No hay datos disponibles.</p>;
  }

  const localTeam = matchData.local_team;
  const visitorTeam = matchData.visitor_team;

  // Asegúrate de que los equipos y jugadores existan antes de acceder a ellos
  const localPlayers = localTeam?.players || [];
  const selectedTeamData =
  selectedTeam === localTeam.name ? localTeam : selectedTeam === visitorTeam.name ? visitorTeam : null;

  const allPlayers = selectedTeamData?.players || [];
  const selectedPlayerData = allPlayers.find((player) => player.player === selectedPlayer);


  const visitorPlayers = visitorTeam?.players || [];

  const generateRankingsDisplay = () => {
    if (!selectedStat || !selectedPlayer || !matchData) return [];
  
    const rankings = [];
    const localTeam = matchData.local_team;
    const visitorTeam = matchData.visitor_team;
  
    const selectedTeamData =
      selectedTeam === localTeam.name ? localTeam : visitorTeam;
  
    const selectedPlayerData = selectedTeamData.players.find(
      (player) => player.player === selectedPlayer
    );
  
    const opponentTeamData =
      selectedTeam === localTeam.name ? visitorTeam : localTeam;
  
    const homeOrAway = selectedTeam === localTeam.name ? "home" : "away";
    const opponentHomeOrAway = homeOrAway === "home" ? "away" : "home";
  
    // Asegúrate de que los datos de ranking existan antes de iterar sobre ellos
    if (!selectedPlayerData || !selectedPlayerData.stats) return [];
  
    // Rankings para el equipo seleccionado
    if (selectedTeamData.name && selectedPlayerData.stats.team?.rankings) {
      const teamRankings = selectedPlayerData.stats.team.rankings;
  
      // Promedio general (Avg.) para el equipo
      if (teamRankings?.top_average?.[selectedStat]) {
        rankings.push({
          label: selectedTeamData.name, // Nombre del equipo en rojo
          position: teamRankings.top_average[selectedStat]?.position || "N/A",
          value: teamRankings.top_average[selectedStat]?.value?.toFixed(2) || "N/A",
          type: "team_avg"
        });
      }
  
      // Valores cuando juega como local (Loc.)
      if (teamRankings?.[`top_${homeOrAway}`]?.[selectedStat]) {
        rankings.push({
          label: homeOrAway == "home" ? "local" : "visitante", // Etiqueta "Loc."
          position: teamRankings[`top_${homeOrAway}`][selectedStat]?.position || "N/A",
          value: teamRankings[`top_${homeOrAway}`][selectedStat]?.value?.toFixed(2) || "N/A",
          type: "team_loc"
        });
      }
    }
  
    // Rankings para el equipo oponente
    if (opponentTeamData.name && selectedPlayerData.stats.opponent?.rankings) {
      const opponentRankings = selectedPlayerData.stats.opponent.rankings;
  
      // Promedio general (Avg.) para el oponente
      if (opponentRankings?.top_average?.[selectedStat]) {
        rankings.push({
          label: opponentTeamData.name, // Nombre del equipo oponente en rojo
          position: opponentRankings.top_average[selectedStat]?.position || "N/A",
          value: opponentRankings.top_average[selectedStat]?.value?.toFixed(2) || "N/A",
          type: "opponent_avg"
        });
      }
  
      // Valores cuando el oponente juega como local (Loc.)
      if (opponentRankings?.[`top_${opponentHomeOrAway}`]?.[selectedStat]) {
        rankings.push({
          label: opponentHomeOrAway == "home" ? "local" : "visitante", // Etiqueta "Loc."
          position: opponentRankings[`top_${opponentHomeOrAway}`][selectedStat]?.position || "N/A",
          value: opponentRankings[`top_${opponentHomeOrAway}`][selectedStat]?.value?.toFixed(2) || "N/A",
          type: "opponent_loc"
        });
      }
    }
  
    return rankings;
  };
  

  
 
  const generateChartData = () => {
    if (!selectedStat || !selectedPlayerData?.stats?.player?.stats) return null;

    const sortedStats = [...selectedPlayerData.stats.player.stats].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const labels = sortedStats.map((game) => game.date);
    const data = sortedStats.map((game) => game[selectedStat] || 0);

    return {
      labels,
      datasets: [
        {
          label: `${selectedStat} de ${selectedPlayer}`,
          data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const generateKeyStats = () => {
    if (!selectedPlayerData || !selectedPlayerData.stats) return null;
  
    const playerStats = selectedPlayerData.stats.player.stats;
    const totalGames = playerStats.length;
  
    if (totalGames === 0) return null;
  
    // Determinar si el equipo es local o visitante
    const isHome = selectedTeam === matchData.local_team.name;
  
    // Filtrar partidos locales y visitantes
    const homeGames = playerStats.filter((game) => game.home_or_away === "home");
    const awayGames = playerStats.filter((game) => game.home_or_away === "away");
  
    const relevantGames = isHome ? homeGames : awayGames;
  
    // Obtener últimos 5 y 10 partidos
    const last5Games = playerStats.slice(-5);
    const last10Games = playerStats.slice(-10);
  
    const last5RelevantGames = relevantGames.slice(-5);
    const last10RelevantGames = relevantGames.slice(-10);
  
    // Función para obtener el promedio de una estadística
    const calculateAvg = (data, stat) =>
      data.reduce((acc, game) => acc + (game[stat] || 0), 0) / data.length || 0;
  
    // Todas las estadísticas relevantes
    const statKeys = ["PTS", "REB", "AST", "2A", "2M", "3A", "3M", "STL", "BLK", "TO"];
    const relevantStats = {};
  
    statKeys.forEach((statKey) => {
      relevantStats[statKey] = [
        { label: statKey, value: calculateAvg(playerStats, statKey).toFixed(2) }, // Total promedio
        {
          label: `${statKey} ${isHome ? "home" : "away"}`,
          value: calculateAvg(relevantGames, statKey).toFixed(2),
        },
        { label: `L5 ${statKey}`, value: calculateAvg(last5Games, statKey).toFixed(2) },
        {
          label: `L5 ${statKey} ${isHome ? "home" : "away"}`,
          value: calculateAvg(last5RelevantGames, statKey).toFixed(2),
        },
        { label: `L10 ${statKey}`, value: calculateAvg(last10Games, statKey).toFixed(2) },
        {
          label: `L10 ${statKey} ${isHome ? "home" : "away"}`,
          value: calculateAvg(last10RelevantGames, statKey).toFixed(2),
        },
      ];
    });
  
    // Calcular minutos y eficiencia por minuto totales y por contexto (home o away)
    const avgMinutes = calculateAvg(playerStats, "MIN");
    const avgMinutesRelevant = calculateAvg(relevantGames, "MIN");
  
    const efficiencyPerMinute = avgMinutes
      ? (calculateAvg(playerStats, "PTS") +
          calculateAvg(playerStats, "AST") +
          calculateAvg(playerStats, "REB")) /
        avgMinutes
      : 0;
  
    const efficiencyPerMinuteRelevant = avgMinutesRelevant
      ? (calculateAvg(relevantGames, "PTS") +
          calculateAvg(relevantGames, "AST") +
          calculateAvg(relevantGames, "REB")) /
        avgMinutesRelevant
      : 0;
  
    // Seleccionar estadísticas basadas en la estadística seleccionada
    const selectedStatStats = relevantStats[selectedStat] || [];
  
    // Añadir estadísticas comunes: Minutos y Eficiencia (Total y por Home/Away)
    selectedStatStats.push(
      { label: "Min", value: avgMinutes.toFixed(2) },
      { label: `Min ${isHome ? "home" : "away"}`, value: avgMinutesRelevant.toFixed(2) },
      { label: "Eff/Min", value: efficiencyPerMinute.toFixed(2) },
      { label: `Eff/Min ${isHome ? "home" : "away"}`, value: efficiencyPerMinuteRelevant.toFixed(2) }
    );
  
    return selectedStatStats;
  };
  
  
  
  
  
  

  const chartData = generateChartData();
  const rankingItems = generateRankingsDisplay();
  const keyStats = generateKeyStats();

  return (
    <div>
      {/* Selector de equipo */}
      <div align="center">
        <label htmlFor="team-select"></label>
        <select
          id="team-select"
          value={selectedTeam}
          onChange={(e) => {
            setSelectedTeam(e.target.value);
            setSelectedPlayer(""); // Limpiar el jugador seleccionado al cambiar de equipo
          }}
        >
          <option value="">Selecciona un equipo</option>
          <option value={localTeam.name}>{localTeam.name}</option>
          <option value={visitorTeam.name}>{visitorTeam.name}</option>
        </select>
      </div>
      <div><p></p></div>
      {/* Selector de jugador */}
      {selectedTeam && (
        <div align="center">
          <label htmlFor="player-select"></label>
          <select
            id="player-select"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
          >
            <option value="">Selecciona un jugador</option>
            {allPlayers.map((player) => (
              <option key={player.player} value={player.player}>
                {player.player}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Botones de estadística */}
      {selectedPlayer && (
        <div align="center">
          {["PTS", "REB", "AST", "2A", "2M", "3A", "3M", "STL", "BLK", "TO"].map((stat) => (
            <button
              key={stat}
              className={`stat-button ${selectedStat === stat ? "active" : ""}`}
              onClick={() => setSelectedStat(stat)}
            >
              {stat}
            </button>
          ))}
        </div>
      )}

        <div className="stats-container">
          {/* Rankings */}
          <div className="rankings-section">
            <RankingsBlock rankingItems={rankingItems} />
          </div>

          {/* Estadísticas clave */}
          {keyStats && (
            <div className="key-stats-section">
              {/* Fila Superior: Indicadores Totales */}
              <div className="key-stats-row">
                {keyStats
                  .filter((stat) => !stat.label.includes("home") && !stat.label.includes("away"))
                  .map((stat, index) => (
                    <div key={index} className="key-stat-item">
                      <span className="key-stat-label">{stat.label}</span>
                      <span className="key-stat-value">{stat.value}</span>
                    </div>
                  ))}
              </div>

              {/* Fila Inferior: Indicadores por Localización */}
              <div className="key-stats-row">
                {keyStats
                  .filter((stat) => stat.label.includes("home") || stat.label.includes("away"))
                  .map((stat, index) => (
                    <div key={index} className="key-stat-item">
                      <span className="key-stat-label">{stat.label}</span>
                      <span className="key-stat-value">{stat.value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>




      {/* Gráfica */}
      {chartData ? (
        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      ) : (
        <p> </p>
      )}
    </div>
  );
}

export default GraphGenerator;
