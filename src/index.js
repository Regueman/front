import React from "react";
import ReactDOM from "react-dom"; // Cambiar a react-dom para React 16
import App from "./App";
import "./styles/global.css";

// Renderiza la aplicación en el elemento con id "root"
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") // No se usa createRoot
);
