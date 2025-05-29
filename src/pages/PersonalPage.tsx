import "../assets/css/Charts.css"
import {
    type Basedata,
    type Rawdata,
} from "../Analysis/types";

import RankItem from "../components/Rank"
import ExtremeLocations from "../components/Extreme";

function Raw2Base(raws: Rawdata[]): Basedata[] {
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
    console.log(bases.length);
    return bases;
}
  
export default function PersonalPage() {
    const rows = JSON.parse(localStorage.getItem("importedRows") || "[]");
    const bases = Raw2Base(rows);
    return (
        <div>
            <h1>
                hello from Personal.
            </h1>
            <div className="chart-container">
                <div className="chart-grid personal">
                    <div className="personal item-1">地图轨迹展示</div>
                    <div className="personal item-2">
                        <ExtremeLocations data={bases} />
                    </div>
                    <div className="personal item-3">
                        <RankItem data={bases} />
                    </div>
                    <div className="personal item-4">旅游推荐</div>
                </div>
            </div>
        </div>
    )
}
