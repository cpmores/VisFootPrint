import React from "react";

import "../assets/css/Charts.css";

export default function CalculatePage() {
  const rows = JSON.parse(localStorage.getItem('importedRows') || '[]');

  if (rows != null)
    for (const row of rows) {
      console.log('Row Data:', row);
    }
  return (
    <div>
      <h1>hello from Cal.</h1>


      <div className="chart-container">
        <div className="chart-grid calculate">
          <div className="calculate item-1">1</div>
          <div className="calculate item-2">2</div>
          <div className="calculate item-3">3</div>
          <div className="calculate item-4">4</div>
          <div className="calculate item-5">5</div>
        </div>
      </div>
    </div>
  );
}
