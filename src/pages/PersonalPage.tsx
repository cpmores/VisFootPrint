import React from 'react'
import "../assets/css/Charts.css"

export default function PersonalPage() {
    return (
        <div>
            <h1>
                hello from Personal.
            </h1>
            <div className="chart-container">
                <div className="chart-grid personal">
                    <div className="personal item-1">地图轨迹展示</div>
                    <div className="personal item-2">个人之最</div>
                    <div className="personal item-3">海拔</div>
                    <div className="personal item-4">居住地</div>
                    <div className="personal item-5">旅游推荐</div>
                </div>
            </div>
        </div>
    )
}
