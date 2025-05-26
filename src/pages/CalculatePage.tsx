import React from "react";
import DynamicDoughnutChart from "../components/ChooseChart";
import DynamicSteppedLineChart from "../components/YearCharts";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import BarChart from "../components/BarChart";
import MultiAxisLineChart from "../components/MultilineChart";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "../assets/css/Charts.css";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function CalculatePage() {
  const rows = JSON.parse(localStorage.getItem("importedRows") || "[]");

  if (rows != null) {
    for (const row of rows) {
      console.log("Row Data:", row);
    }
  }

  const position = {
    lat: 32.04,
    lng: 118.76,
  };
  const position2 = {
    lat: 31.95,
    lng: 119.16,
  };

  return (
    <div>
      <h1>hello from Cal.</h1>

      <div className="chart-container">
        <div className="chart-grid calculate">
          <div className="calculate item-1">
            <MapContainer
              center={position}
              zoom={8}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
              <Marker position={position2}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="calculate item-2">
            <DynamicDoughnutChart />
          </div>
          <div className="calculate item-3">
            <BarChart></BarChart>
          </div>
          <div className="calculate item-4">
            <MultiAxisLineChart></MultiAxisLineChart>
          </div>
          <div className="calculate item-5">
            <DynamicSteppedLineChart />
          </div>
        </div>
      </div>
    </div>
  );
}
