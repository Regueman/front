import React from "react";
import '../../App.css';

const TeamStatisticsDisplay = ({ localTeamStats, visitorTeamStats }) => {
  if (!localTeamStats || !visitorTeamStats) {
    return null;
  }

  const renderResults = (results) => {
    return (
      <div className="results-row">
        {results.split(" ").map((result, index) => (
          <span
            key={index}
            className={`result-icon ${result === "W" ? "win" : "loss"}`}
          >
            {result}
          </span>
        ))}
      </div>
    );
  };

  const renderTeamStats = (stats, isLocal) => {
    const totalWins = stats.home_wins + stats.away_wins;
    const totalLosses = stats.home_losses + stats.away_losses;

    return (
      <div className="team-stats-section">
        <h4 className="team-name">{stats.team}</h4>
        <div className="team-stats-row">
          {/* Columna 1: Totales */}
          <div className="team-stats-column">
            <p>
              <strong>Total:</strong> {totalWins}/{totalLosses}
            </p>
            <p>
              <strong>{isLocal ? "Home:" : "Away:"}</strong>{" "}
              {isLocal
                ? `${stats.home_wins}/${stats.home_losses}`
                : `${stats.away_wins}/${stats.away_losses}`}
            </p>
          </div>

          {/* Columna 2: Últimos 5 */}
          <div className="team-stats-column">
            <p>
              <strong>L5 Total:</strong> {renderResults(stats.last_5_results)}
            </p>
            <p>
              <strong>
                L5 {isLocal ? "Home:" : "Away:"}
              </strong>{" "}
              {renderResults(
                isLocal ? stats.last_5_home_results : stats.last_5_away_results
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="team-stats-container">
      {renderTeamStats(localTeamStats, true)}
      {renderTeamStats(visitorTeamStats, false)}
    </div>
  );
};

export default TeamStatisticsDisplay;
