import React, { useState, useEffect } from "react";
import TeamSelector from "./components/UI/TeamSelector";
import PlayerSelector from "./components/UI/PlayerSelector";
import GraphGenerator from "./components/UI/GraphGenerator"; // Importamos el nuevo componente
import "./App.css"; // Asegúrate de incluir este archivo CSS

function App() {
  const [teams, setTeams] = useState([]); // Lista de equipos
  const [localTeam, setLocalTeam] = useState(""); // Equipo local seleccionado
  const [visitorTeam, setVisitorTeam] = useState(""); // Equipo visitante seleccionado
  const [localPlayers, setLocalPlayers] = useState([]); // Jugadores del equipo local
  const [visitorPlayers, setVisitorPlayers] = useState([]); // Jugadores del equipo visitante
  const [localPlayer, setLocalPlayer] = useState(""); // Jugador local seleccionado
  const [visitorPlayer, setVisitorPlayer] = useState(""); // Jugador visitante seleccionado
  const [localPlayerData, setLocalPlayerData] = useState(null); // Datos del jugador local
  const [visitorPlayerData, setVisitorPlayerData] = useState(null); // Datos del jugador visitante

  // Fetch inicial para obtener la lista de equipos
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, []);

  // Fetch de los jugadores cuando se selecciona un equipo local
  useEffect(() => {
    if (localTeam) {
      fetch(`http://127.0.0.1:5000/api/players/${encodeURIComponent(localTeam)}`)
        .then((res) => res.json())
        .then((data) => setLocalPlayers(data))
        .catch((error) => console.error("Error fetching local players:", error));
    } else {
      setLocalPlayers([]);
    }
  }, [localTeam]);

  // Fetch de los jugadores cuando se selecciona un equipo visitante
  useEffect(() => {
    if (visitorTeam) {
      fetch(`http://127.0.0.1:5000/api/players/${encodeURIComponent(visitorTeam)}`)
        .then((res) => res.json())
        .then((data) => setVisitorPlayers(data))
        .catch((error) => console.error("Error fetching visitor players:", error));
    } else {
      setVisitorPlayers([]);
    }
  }, [visitorTeam]);

  // Consultar los datos del jugador en el backend
  const fetchPlayerData = (teamName, playerName, setPlayerData, homeOrAway, opponentTeam) => {
    if (!teamName || !playerName || !homeOrAway || !opponentTeam) {
      alert("Seleccione todos los parámetros antes de consultar.");
      return;
    }

    const url = `http://127.0.0.1:5000/api/player-stats?team=${encodeURIComponent(teamName)}&player_name=${encodeURIComponent(playerName)}&home_or_away=${encodeURIComponent(homeOrAway)}&opponent=${encodeURIComponent(opponentTeam)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(`Error: ${data.error}`);
        } else {
          setPlayerData(data);
        }
      })
      .catch((error) => console.error("Error fetching player data:", error));
  };

  return (
    <div className="container">
          {/* Equipo Local */}
          <div className="team-container">
        <h2>Equipo Local</h2>
        <TeamSelector
          teams={teams}
          selectedTeam={localTeam}
          onSelectTeam={setLocalTeam}
          label="Equipo Local"
        />
        <PlayerSelector
          players={localPlayers}
          selectedPlayer={localPlayer}
          onSelectPlayer={setLocalPlayer}
          label="Jugador Local"
        />
        <button
          onClick={() =>
            fetchPlayerData(localTeam, localPlayer, setLocalPlayerData, "home", visitorTeam)
          }
        >
          Ver Estadísticas
        </button>
        {localPlayerData && (
          <div className="player-data">
            <h3>Estadísticas del Jugador Local</h3>
            <GraphGenerator
              playerName={localPlayer}
              playerData={localPlayerData}
              opponentTeam={visitorTeam}
            />
          </div>
        )}
      </div>


      {/* Equipo Visitante */}
      <div className="team-container">
        <h2>Equipo Visitante</h2>
        <TeamSelector
          teams={teams}
          selectedTeam={visitorTeam}
          onSelectTeam={setVisitorTeam}
          label="Equipo Visitante"
        />
        <PlayerSelector
          players={visitorPlayers}
          selectedPlayer={visitorPlayer}
          onSelectPlayer={setVisitorPlayer}
          label="Jugador Visitante"
        />
        <button
          onClick={() =>
            fetchPlayerData(visitorTeam, visitorPlayer, setVisitorPlayerData, "away", localTeam)
          }
        >
          Ver Estadísticas
        </button>
        {visitorPlayerData && (
          <div className="player-data">
            <h3>Estadísticas del Jugador Visitante</h3>
            <GraphGenerator
              playerName={visitorPlayer}
              playerData={visitorPlayerData}
              opponentTeam={localTeam}
            />
          </div>
        )}
      </div>


    </div>
  );
}

export default App;
