import React from "react";

function PlayerSelector({ players, selectedPlayer, onSelectPlayer, label }) {
  return (
    <div>
      <label>{label}</label>
      <select value={selectedPlayer} onChange={(e) => onSelectPlayer(e.target.value)}>
        <option value="" disabled>
          Seleccione un jugador
        </option>
        {players.map((player) => (
          <option key={player} value={player}>
            {player}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PlayerSelector;
