import "../assets/css/Charts.css";
import {
    type TraceItem,
    type Basedata,
    type Rawdata,
} from "../Analysis/types";

import {
    LLM
} from '../Analysis/LLM';


import {
    trace
} from "../Analysis/CountCity"

import { useState, useEffect, useMemo } from "react";

import { getAddressByOSM } from "../Analysis/Geocode";

import TravelSuggestion from '../components/TravelSuggestion';
import MapTrajectory from "../components/MapTrajectory";
import RankItem from "../components/Rank";
import ExtremeLocations from "../components/Extreme";
import Loading from "../components/Loading";

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
    return bases;
}

async function getTravelSuggestions(trace: TraceItem[]): Promise<string> {
    let prompt = "<Rule>以下是我最近一段时间的行程足迹,请根据我的足迹给我提供一些旅游建议,**300字左右,不要返回 markdown 格式,返回纯文本**</Rule>"
    for (const item of trace) {
        prompt += `<TraceItem>我在${item.startTime.year}年${item.startTime.month}月${item.startTime.day}日到达了${item.province}${item.city}</TraceItem>`
    }
    console.log(prompt)
    return await LLM(prompt);
}

export default function PersonalPage() {
    const rows = JSON.parse(localStorage.getItem("importedRows") || "[]");
    const bases = useMemo(() => Raw2Base(rows), [rows]);

    const [traceItems, setTraceItems] = useState<TraceItem[]>([]);
    const [calculateFinish, setcalculateFinish] = useState<boolean>(false);

    const temp = trace(bases);
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            const results: TraceItem[] = [];
            for (const item of temp) {
                try {
                    const result = await getAddressByOSM(
                        item.longitude,
                        item.latitude,
                        -1
                    );
                    item.province = result.province;
                    item.city = result.city;
                    results.push(item);
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                } catch (err: any) {
                    console.error("Geocode error:", err);
                }
            }
            setTraceItems(results);
            setcalculateFinish(true);
        }
        fetchData();
        return () => controller.abort();
    }, [])
    // console.log(traceItems);
    return (
        <div className="personal-page">
            <h1>个人足迹分析</h1>

            <div className="chart-container">
                <div className="chart-grid personal">
                    <div className="personal item-1">
                        { calculateFinish ? <MapTrajectory data={traceItems} />:<Loading /> }
                    </div>
                    <div className="personal item-2">
                        <TravelSuggestion 
                            data={traceItems} 
                            onGetSuggestions={getTravelSuggestions} 
                        />
                    </div>
                    <div className="personal item-3">
                        <ExtremeLocations data={bases} />
                    </div>
                    <div className="personal item-4">
                        <RankItem data={bases} />
                    </div>
                </div>
            </div>
        </div>
    );
    
}
