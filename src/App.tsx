import { useState } from "react";
import Navigator from "./components/Navigator";
import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import CalculatePage from "./pages/CalculatePage";
import ImportPage from "./pages/ImportPage";
import PersonalPage from "./pages/PersonalPage";

export default function App() {
  return (
    <body>
      <Router>
        <div className="nav-container">
          <Navigator>
            <Link to="/">Import</Link>
            <Link to="/calculate">Calculate</Link>
            <Link to="/personal">Personal</Link>
          </Navigator>
        </div>
        <Routes>
          <Route path="/" element={<ImportPage />} />
          <Route path="/calculate" element={<CalculatePage />} />
          <Route path="/personal" element={<PersonalPage />} />
        </Routes>
      </Router>
    </body>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
