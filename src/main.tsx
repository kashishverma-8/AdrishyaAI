// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
// import "leaflet/dist/leaflet.css";

// createRoot(document.getElementById("root")!).render(<App />);
// main.tsx - Updated with Language Context Provider
// main.tsx - Updated
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { LanguageProvider } from "./LanguageContext";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);


