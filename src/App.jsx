import React, { useState, useEffect } from "react";
import TeamSelector from "./components/UI/TeamSelector";
import GraphGenerator from "./components/UI/GraphGenerator";
import TeamStatisticsDisplay from "./components/UI/TeamStatisticsDisplay"; // Importar el componente
import "./App.css";

function App() {
  const [teams, setTeams] = useState([]);
  const [localTeam, setLocalTeam] = useState("");
  const [visitorTeam, setVisitorTeam] = useState("");
  const [localPlayers, setLocalPlayers] = useState([]);
  const [visitorPlayers, setVisitorPlayers] = useState([]);
  const [localTeamStats, setLocalTeamStats] = useState(null);
  const [visitorTeamStats, setVisitorTeamStats] = useState(null);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, []);

  const fetchPlayers = (teamName, setPlayers) => {
    fetch(`http://127.0.0.1:5000/api/players/${encodeURIComponent(teamName)}`)
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((error) =>
        console.error(`Error fetching players for ${teamName}:`, error)
      );
  };

  const fetchTeamStatistics = async (team, setStats) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/team-statistics?team=${encodeURIComponent(
          team
        )}`
      );
      if (!response.ok) {
        console.error(`No se encontraron estadísticas para el equipo: ${team}`);
        return;
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(`Error al obtener estadísticas del equipo ${team}:`, error);
    }
  };

  useEffect(() => {
    if (localTeam) {
      fetchPlayers(localTeam, setLocalPlayers);
      fetchTeamStatistics(localTeam, setLocalTeamStats);
    } else {
      setLocalPlayers([]);
      setLocalTeamStats(null);
    }
  }, [localTeam]);

  useEffect(() => {
    if (visitorTeam) {
      fetchPlayers(visitorTeam, setVisitorPlayers);
      fetchTeamStatistics(visitorTeam, setVisitorTeamStats);
    } else {
      setVisitorPlayers([]);
      setVisitorTeamStats(null);
    }
  }, [visitorTeam]);

  const fetchMatchData = async () => {
    if (!localTeam || !visitorTeam) {
      alert("Por favor, selecciona ambos equipos.");
      return;
    }

    try {
      const localTeamData = await Promise.all(
        localPlayers.map((player) =>
          fetch(
            `http://127.0.0.1:5000/api/player-stats?team=${encodeURIComponent(
              localTeam
            )}&player_name=${encodeURIComponent(
              player
            )}&home_or_away=home&opponent=${encodeURIComponent(visitorTeam)}`
          )
            .then((res) => res.json())
            .then((data) => ({ player, stats: data }))
        )
      );

      const visitorTeamData = await Promise.all(
        visitorPlayers.map((player) =>
          fetch(
            `http://127.0.0.1:5000/api/player-stats?team=${encodeURIComponent(
              visitorTeam
            )}&player_name=${encodeURIComponent(
              player
            )}&home_or_away=away&opponent=${encodeURIComponent(localTeam)}`
          )
            .then((res) => res.json())
            .then((data) => ({ player, stats: data }))
        )
      );

      setMatchData({
        local_team: { name: localTeam, players: localTeamData },
        visitor_team: { name: visitorTeam, players: visitorTeamData },
      });
    } catch (error) {
      console.error("Error fetching match data:", error);
    }
  };

  return (
    <div className="app-container">
      {/* Columna Izquierda: Selectores */}
      <div className="selectors-container">
        <TeamSelector
          teams={teams}
          selectedTeam={localTeam}
          onSelectTeam={setLocalTeam}
          label="Equipo Local"
        />
  
        <TeamSelector
          teams={teams}
          selectedTeam={visitorTeam}
          onSelectTeam={setVisitorTeam}
          label="Equipo Visitante"
        />
  
        <button className="fetch-button" onClick={fetchMatchData}>
          GET DATA
        </button>
  
        {localTeamStats && visitorTeamStats && (
          <div className="team-stats-display">
            <TeamStatisticsDisplay
              localTeamStats={localTeamStats}
              visitorTeamStats={visitorTeamStats}
            />
          </div>
        )}
      </div>
  
      {/* Columna Derecha: Estadísticas y Gráfica */}
      <div className="stats-graph-container">
        {matchData && (
          <>
            <div className="player-selectors">
              <GraphGenerator matchData={matchData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
  
}

export default App;
