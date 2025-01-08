import React, { useState, useEffect } from "react";
import TeamSelector from "./components/UI/TeamSelector";
import GraphGenerator from "./components/UI/GraphGenerator";
import "./App.css";

function App() {
  const [teams, setTeams] = useState([]);
  const [localTeam, setLocalTeam] = useState("");
  const [visitorTeam, setVisitorTeam] = useState("");
  const [localPlayers, setLocalPlayers] = useState([]);
  const [visitorPlayers, setVisitorPlayers] = useState([]);
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
      .catch((error) => console.error(`Error fetching players for ${teamName}:`, error));
  };

  useEffect(() => {
    if (localTeam) fetchPlayers(localTeam, setLocalPlayers);
    else setLocalPlayers([]);
  }, [localTeam]);

  useEffect(() => {
    if (visitorTeam) fetchPlayers(visitorTeam, setVisitorPlayers);
    else setVisitorPlayers([]);
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
            `http://127.0.0.1:5000/api/player-stats?team=${encodeURIComponent(localTeam)}&player_name=${encodeURIComponent(player)}&home_or_away=home&opponent=${encodeURIComponent(visitorTeam)}`
          )
            .then((res) => res.json())
            .then((data) => ({ player, stats: data }))
        )
      );

      const visitorTeamData = await Promise.all(
        visitorPlayers.map((player) =>
          fetch(
            `http://127.0.0.1:5000/api/player-stats?team=${encodeURIComponent(visitorTeam)}&player_name=${encodeURIComponent(player)}&home_or_away=away&opponent=${encodeURIComponent(localTeam)}`
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
    <div className="container">
      <div className="teams-container">
        {/* Equipo Local */}
        <div className="team-section">
          <TeamSelector
            teams={teams}
            selectedTeam={localTeam}
            onSelectTeam={setLocalTeam}
            label="Equipo Local"
          />
        </div>

        {/* Equipo Visitante */}
        <div className="team-section">
          <TeamSelector
            teams={teams}
            selectedTeam={visitorTeam}
            onSelectTeam={setVisitorTeam}
            label="Equipo Visitante"
          />
        </div>
      </div>

      <div className="fetch-button-container">
        <button onClick={fetchMatchData}>GET DATA</button>
      </div>

      {matchData && (
        <div className="graph-section">
          <GraphGenerator matchData={matchData} />
        </div>
      )}
    </div>
  );
}

export default App;
