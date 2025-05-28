import { useState, useEffect } from "react";
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
import YearSelector from "../components/YearSelector";
import {
  type Basedata,
  type Rawdata,
  type Place,
  find_for_city,
  filter_for_city,
  count_for_district,
} from "../Analysis/types";
import {
  CityCennter,
  CityOption,
  CountCity,
  CountYear,
  YearOption,
} from "../Analysis/CountCity";
import { getAddressByOSM } from "../Analysis/Geocode";
import Loading from "../components/Loading";

function Raw2Base(raws: Rawdata[]) {
  const bases: Basedata[] = [];
  for (let raw of raws) {
    const date = new Date(parseInt(raw.DataTime, 10) * 1000);
    const base: Basedata = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      longitude: parseFloat(raw.longitude),
      latitude: parseFloat(raw.latitude),
      altitude: parseFloat(raw.altitude),
    };
    bases.push(base);
  }
  bases.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });
  return bases;
}

function analyzeLatLonRange(raws: Rawdata[]) {
  let minLat = Infinity,
    maxLat = -Infinity,
    minLon = Infinity,
    maxLon = -Infinity;
  for (let raw of raws) {
    const lat = parseFloat(raw.latitude);
    const lon = parseFloat(raw.longitude);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
  }
  console.log(`纬度范围: ${minLat}° - ${maxLat}° (差: ${maxLat - minLat}°)`);
  console.log(`经度范围: ${minLon}° - ${maxLon}° (差: ${maxLon - minLon}°)`);
}

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
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Place[]>([]);
  const [selectedType, setSelectedType] = useState<string>("1");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [calculateFinish, setcalculateFinish] = useState<boolean>(false);
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const rows = JSON.parse(localStorage.getItem("importedRows") || "[]");
  const bases = Raw2Base(rows);
  let countBases = CountCity(bases);
  const year_count = CountYear(bases);
  const year_options = YearOption(year_count);

  useEffect(() => {
    const controller = new AbortController();
    const fetchAddresses = async () => {
      const results: Place[] = [];
      if (selectedType == "1" && selectedYear == "All") {
        for (const countbase of countBases) {
          try {
            const result = await getAddressByOSM(
              countbase.longitude,
              countbase.latitude,
              countbase.count
            );
            results.push(result);
            console.log("Address:", result);
            countbase.city = result.city;

            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (err: any) {
            console.error("Geocode error:", err);
            setError(err.message);
          }
        }

        localStorage.setItem("CountBases", JSON.stringify(countBases));
      } else if (selectedType == "1" && selectedYear != "All") {
        // 筛选出新的位置，和如今城市一样的点
        countBases = JSON.parse(localStorage.getItem("CountBases") || "[]");
        const city_pos = find_for_city(countBases, selectedYear);
        const filter_pos = filter_for_city(bases, city_pos);
        const countdistrict = count_for_district(filter_pos);

        for (const district of countdistrict) {
          try {
            const result = await getAddressByOSM(
              district.longitude,
              district.latitude,
              district.count
            );
            results.push(result);
            console.log("Address:", result);
            district.city = result.district;

            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (err: any) {
            console.error("Geocode error:", err);
            setError(err.message);
          }
        }
      }
      setAddresses(results);
      if (cityOptions.length == 0) setCityOptions(CityOption(countBases));
      setcalculateFinish(true);
    };
    fetchAddresses();
    analyzeLatLonRange(rows);
    return () => controller.abort();
  }, [selectedType, selectedYear]);

  return (
    <div>
      {error && <div style={{ color: "red" }}>错误: {error}</div>}
      <YearSelector
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        option2={selectedType == "1" ? cityOptions : year_options}
      />
      <div className="chart-container">
        <div className="chart-grid calculate">
          <div className="calculate item-1">
            {selectedType == "1" && (
              <MapContainer
                center={CityCennter(countBases)}
                zoom={8}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {countBases.map((countbase, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: countbase.latitude,
                      lng: countbase.longitude,
                    }}
                  >
                    <Popup>
                      {addresses[index]?.province || "未知"},{" "}
                      {addresses[index]?.city || "未知"},{" "}
                      {addresses[index]?.district || "未知"}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          <div className="calculate item-2" style={{ position: "relative" }}>
            {selectedType == "1" ? (
              calculateFinish ? 
              (selectedYear == "All" ? (
                <DynamicDoughnutChart
                  addresses={addresses}
                  years={year_count}
                  choose={true}
                  choose2={true}
                />
              ) : <DynamicDoughnutChart
                  addresses={addresses}
                  years={year_count}
                  choose={true}
                  choose2={false}
                /> ): (
                <Loading />
              )
            ) : (
              <DynamicDoughnutChart
                addresses={addresses}
                years={year_count}
                choose={false}
                  choose2={true}
              />
            )}
          </div>

          <div className="calculate item-3">
            <BarChart />
          </div>

          <div className="calculate item-4">
            <MultiAxisLineChart />
          </div>

          <div className="calculate item-5">
            <DynamicSteppedLineChart />
          </div>
        </div>
      </div>
    </div>
  );
}
