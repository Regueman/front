import React from "react";

function TeamSelector({ teams, selectedTeam, onSelectTeam, label }) {
  return (
    <div>
      <h2>{label}</h2>
      <select value={selectedTeam} onChange={(e) => onSelectTeam(e.target.value)}>
        <option value="">Seleccione un equipo</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TeamSelector;
