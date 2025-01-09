import React from "react";
import '../../App.css';


const RankingsBlock = ({ rankingItems }) => {
  if (!rankingItems || rankingItems.length === 0) {
    return <p>No hay rankings disponibles.</p>;
  }

  // Separar rankings por equipo y oponente
  const teamAvg = rankingItems.filter((item) => item.type === "team_avg");
  const teamLoc = rankingItems.filter((item) => item.type === "team_loc");
  const opponentAvg = rankingItems.filter((item) => item.type === "opponent_avg");
  const opponentLoc = rankingItems.filter((item) => item.type === "opponent_loc");

  return (
    <div className="rankings-container">
      {/* Sección de Team */}
      <div className="rankings-column">
        {teamAvg.map((item, index) => (
          <div key={index} className="ranking-item">
            <span className="ranking-label">{item.label}</span>
            <div className="ranking-value">
              <span>{item.position ? `${item.position}º` : "N/A"}</span>
              <span>{item.value || "N/A"}</span>
            </div>
          </div>
        ))}
        {teamLoc.map((item, index) => (
          <div key={index} className="ranking-item">
            <span className="ranking-label">{item.label}</span>
            <div className="ranking-value">
              <span>{item.position ? `${item.position}º` : "N/A"}</span>
              <span>{item.value || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Opponent */}
      <div className="rankings-column">
        {opponentAvg.map((item, index) => (
          <div key={index} className="ranking-item">
            <span className="ranking-label">{item.label}</span>
            <div className="ranking-value">
              <span>{item.position ? `${item.position}º` : "N/A"}</span>
              <span>{item.value || "N/A"}</span>
            </div>
          </div>
        ))}
        {opponentLoc.map((item, index) => (
          <div key={index} className="ranking-item">
            <span className="ranking-label">{item.label}</span>
            <div className="ranking-value">
              <span>{item.position ? `${item.position}º` : "N/A"}</span>
              <span>{item.value || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingsBlock;
