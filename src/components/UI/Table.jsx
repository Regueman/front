import React from "react";

function Table({ data }) {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, i) => (
              <td key={i}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
